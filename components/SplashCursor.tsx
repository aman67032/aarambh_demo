"use client";
import React, { useEffect, useRef } from "react";

interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

interface SplashCursorProps {
  SIM_RESOLUTION?: number;
  DYE_RESOLUTION?: number;
  CAPTURE_RESOLUTION?: number;
  DENSITY_DISSIPATION?: number;
  VELOCITY_DISSIPATION?: number;
  PRESSURE?: number;
  PRESSURE_ITERATIONS?: number;
  CURL?: number;
  SPLAT_RADIUS?: number;
  SPLAT_FORCE?: number;
  SHADING?: boolean;
  COLOR_UPDATE_SPEED?: number;
  BACK_COLOR?: ColorRGB;
  TRANSPARENT?: boolean;
  excludeSelectors?: string[];
}

interface Pointer {
  id: number;
  texcoordX: number;
  texcoordY: number;
  prevTexcoordX: number;
  prevTexcoordY: number;
  deltaX: number;
  deltaY: number;
  down: boolean;
  moved: boolean;
  color: ColorRGB;
}

function pointerPrototype(): Pointer {
  return {
    id: -1,
    texcoordX: 0,
    texcoordY: 0,
    prevTexcoordX: 0,
    prevTexcoordY: 0,
    deltaX: 0,
    deltaY: 0,
    down: false,
    moved: false,
    color: { r: 0, g: 0, b: 0 },
  };
}

export default function SplashCursor({
  SIM_RESOLUTION = 96, // Further reduced for performance
  DYE_RESOLUTION = 512, // Reduced from 1024
  CAPTURE_RESOLUTION = 56, // Reduced from 512
  DENSITY_DISSIPATION = 5.0, // Increased for faster fade
  VELOCITY_DISSIPATION = 3, // Increased for faster fade
  PRESSURE = 0.1,
  PRESSURE_ITERATIONS = 15, // Reduced from 20
  CURL = 2, // Reduced from 3
  SPLAT_RADIUS = 0.15, // Reduced from 0.2 for less spread
  SPLAT_FORCE = 4000, // Reduced from 6000
  SHADING = true,
  COLOR_UPDATE_SPEED = 15, // Increased for faster color changes
  BACK_COLOR = { r: 0.3, g: 0, b: 0 }, // Reduced opacity
  TRANSPARENT = true,
  excludeSelectors = ['.no-splash', '[data-no-splash]', '.profile-card', '.team-card', 'button', '.button', '.btn', 'input', 'textarea', 'select', 'form', '.form', 'a[href]', '.pc-card-wrapper', '.pc-card', '.pc-inside', '.pc-content', '.pc-contact-btn', '.pc-user-info']
}: SplashCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webGLAvailable, setWebGLAvailable] = React.useState<boolean | null>(null);

  // Function to check if mouse is over excluded elements
  const isOverExcludedElement = (clientX: number, clientY: number): boolean => {
    try {
      const elements = document.elementsFromPoint(clientX, clientY);
      
      // Check if any element or its parents match exclusion selectors
      for (const element of elements) {
        for (const selector of excludeSelectors) {
          try {
            // Check if element itself matches
            if (element.matches(selector)) {
              return true;
            }
            // Check if any parent matches
            if (element.closest(selector)) {
              return true;
            }
            // Special check for data attributes
            if (selector.includes('[data-no-splash]') && element.hasAttribute('data-no-splash')) {
              return true;
            }
            // Check for profile card specific classes
            if (element.classList.contains('pc-card-wrapper') || 
                element.classList.contains('pc-card') || 
                element.classList.contains('pc-inside') || 
                element.classList.contains('pc-content') || 
                element.classList.contains('pc-contact-btn') || 
                element.classList.contains('pc-user-info')) {
              return true;
            }
          } catch (e) {
            // Ignore selector errors
          }
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check if WebGL is supported at all
    if (!window.WebGLRenderingContext && !window.WebGL2RenderingContext) {
      console.warn('WebGL not supported in this browser, SplashCursor will be disabled');
      setWebGLAvailable(false);
      return;
    }

    let pointers: Pointer[] = [pointerPrototype()];

    let config = {
      SIM_RESOLUTION: SIM_RESOLUTION!,
      DYE_RESOLUTION: DYE_RESOLUTION!,
      CAPTURE_RESOLUTION: CAPTURE_RESOLUTION!,
      DENSITY_DISSIPATION: DENSITY_DISSIPATION!,
      VELOCITY_DISSIPATION: VELOCITY_DISSIPATION!,
      PRESSURE: PRESSURE!,
      PRESSURE_ITERATIONS: PRESSURE_ITERATIONS!,
      CURL: CURL!,
      SPLAT_RADIUS: SPLAT_RADIUS!,
      SPLAT_FORCE: SPLAT_FORCE!,
      SHADING,
      COLOR_UPDATE_SPEED: COLOR_UPDATE_SPEED!,
      PAUSED: false,
      BACK_COLOR,
      TRANSPARENT,
    };

    // Try to get WebGL context with error handling
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    let ext: any = null;
    
    try {
      const webGLContext = getWebGLContext(canvas);
      gl = webGLContext.gl;
      ext = webGLContext.ext;
      setWebGLAvailable(true);
    } catch (error) {
      console.warn('WebGL not available, SplashCursor will be disabled:', error);
      setWebGLAvailable(false);
      return; // Exit gracefully if WebGL fails
    }
    
    if (!gl || !ext) {
      console.warn('WebGL context could not be created, SplashCursor will be disabled');
      setWebGLAvailable(false);
      return;
    }

    // Additional safety check for WebGL context validity
    if (!gl.getExtension || !gl.createBuffer) {
      console.warn('WebGL context is invalid, SplashCursor will be disabled');
      setWebGLAvailable(false);
      return;
    }

    // At this point, gl and ext are guaranteed to be non-null
    const glContext = gl!;
    const extContext = ext!;

    if (!extContext.supportLinearFiltering) {
      config.DYE_RESOLUTION = 256;
      config.SHADING = false;
    }

    // Runtime performance controls
    let animationFrameId: number | null = null;
    let isRunning = false;
    let lastInteractionTime = performance.now();
    const IDLE_TIMEOUT_MS = 500; // pause when idle for better performance (reduced from 3000)
    let qualityScale = 0.75; // scales internal render resolution [0.5, 1]
    const MIN_QUALITY = 0.5;
    const MAX_QUALITY = 1.0;
    const MAX_DEVICE_PIXEL_RATIO = 1.5; // cap DPR to avoid huge framebuffers
    let currentPressureIterations = config.PRESSURE_ITERATIONS;
    let fpsSampleCount = 0;
    let fpsSampleTimeMs = 0;
    let prevTimestamp = performance.now();

    function startAnimation() {
      if (!webGLAvailable || isRunning) return;
      isRunning = true;
      animationFrameId = requestAnimationFrame(updateFrame);
    }

    function stopAnimation() {
      if (!isRunning) return;
      isRunning = false;
      if (animationFrameId != null) cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    function getWebGLContext(canvas: HTMLCanvasElement) {
      const params = {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        preserveDrawingBuffer: false,
      };

      let gl = canvas.getContext(
        "webgl2",
        params
      ) as WebGL2RenderingContext | null;

      if (!gl) {
        gl = (canvas.getContext("webgl", params) ||
          canvas.getContext(
            "experimental-webgl",
            params
          )) as WebGL2RenderingContext | null;
      }

      if (!gl) {
        throw new Error("Unable to initialize WebGL.");
      }

      const isWebGL2 = "drawBuffers" in gl;

      let supportLinearFiltering = false;
      let halfFloat = null;

      if (isWebGL2) {
        (gl as WebGL2RenderingContext).getExtension("EXT_color_buffer_float");
        supportLinearFiltering = !!(gl as WebGL2RenderingContext).getExtension(
          "OES_texture_float_linear"
        );
      } else {
        halfFloat = gl.getExtension("OES_texture_half_float");
        supportLinearFiltering = !!gl.getExtension(
          "OES_texture_half_float_linear"
        );
      }

      gl.clearColor(0, 0, 0, 1);

      const halfFloatTexType = isWebGL2
        ? (gl as WebGL2RenderingContext).HALF_FLOAT
        : (halfFloat && (halfFloat as any).HALF_FLOAT_OES) || 0;

      let formatRGBA: any;
      let formatRG: any;
      let formatR: any;

      if (isWebGL2) {
        formatRGBA = getSupportedFormat(
          gl,
          (gl as WebGL2RenderingContext).RGBA16F,
          gl.RGBA,
          halfFloatTexType
        );
        formatRG = getSupportedFormat(
          gl,
          (gl as WebGL2RenderingContext).RG16F,
          (gl as WebGL2RenderingContext).RG,
          halfFloatTexType
        );
        formatR = getSupportedFormat(
          gl,
          (gl as WebGL2RenderingContext).R16F,
          (gl as WebGL2RenderingContext).RED,
          halfFloatTexType
        );
      } else {
        formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      }

      return {
        gl,
        ext: {
          formatRGBA,
          formatRG,
          formatR,
          halfFloatTexType,
          supportLinearFiltering,
        },
      };
    }

    function getSupportedFormat(
      gl: WebGLRenderingContext | WebGL2RenderingContext,
      internalFormat: number,
      format: number,
      type: number
    ): { internalFormat: number; format: number } | null {
      if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
        if ("drawBuffers" in gl) {
          const gl2 = gl as WebGL2RenderingContext;
          switch (internalFormat) {
            case gl2.R16F:
              return getSupportedFormat(gl2, gl2.RG16F, gl2.RG, type);
            case gl2.RG16F:
              return getSupportedFormat(gl2, gl2.RGBA16F, gl2.RGBA, type);
            default:
              return null;
          }
        }
        return null;
      }
      return { internalFormat, format };
    }

    function supportRenderTextureFormat(
      gl: WebGLRenderingContext | WebGL2RenderingContext,
      internalFormat: number,
      format: number,
      type: number
    ) {
      const texture = gl.createTexture();
      if (!texture) return false;

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat,
        4,
        4,
        0,
        format,
        type,
        null
      );

      const fbo = gl.createFramebuffer();
      if (!fbo) return false;

      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      );
      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      return status === gl.FRAMEBUFFER_COMPLETE;
    }

    function hashCode(s: string) {
      if (!s.length) return 0;
      let hash = 0;
      for (let i = 0; i < s.length; i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i);
        hash |= 0;
      }
      return hash;
    }

    function addKeywords(source: string, keywords: string[] | null) {
      if (!keywords) return source;
      let keywordsString = "";
      for (const keyword of keywords) {
        keywordsString += `#define ${keyword}\n`;
      }
      return keywordsString + source;
    }

    function compileShader(
      type: number,
      source: string,
      keywords: string[] | null = null
    ): WebGLShader | null {
      const shaderSource = addKeywords(source, keywords);
      const shader = glContext.createShader(type);
      if (!shader) return null;
      glContext.shaderSource(shader, shaderSource);
      glContext.compileShader(shader);
      if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
        console.trace(glContext.getShaderInfoLog(shader));
      }
      return shader;
    }

    function createProgram(
      vertexShader: WebGLShader | null,
      fragmentShader: WebGLShader | null
    ): WebGLProgram | null {
      if (!vertexShader || !fragmentShader) return null;
      const program = glContext.createProgram();
      if (!program) return null;
      glContext.attachShader(program, vertexShader);
      glContext.attachShader(program, fragmentShader);
      glContext.linkProgram(program);
      if (!glContext.getProgramParameter(program, glContext.LINK_STATUS)) {
        console.trace(glContext.getProgramInfoLog(program));
      }
      return program;
    }

    function getUniforms(program: WebGLProgram) {
      let uniforms: Record<string, WebGLUniformLocation | null> = {};
      const uniformCount = glContext.getProgramParameter(program, glContext.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; i++) {
        const uniformInfo = glContext.getActiveUniform(program, i);
        if (uniformInfo) {
          uniforms[uniformInfo.name] = glContext.getUniformLocation(
            program,
            uniformInfo.name
          );
        }
      }
      return uniforms;
    }

    class Program {
      program: WebGLProgram | null;
      uniforms: Record<string, WebGLUniformLocation | null>;

      constructor(
        vertexShader: WebGLShader | null,
        fragmentShader: WebGLShader | null
      ) {
        this.program = createProgram(vertexShader, fragmentShader);
        this.uniforms = this.program ? getUniforms(this.program) : {};
      }

      bind() {
        if (this.program) glContext.useProgram(this.program);
      }
    }

    class Material {
      vertexShader: WebGLShader | null;
      fragmentShaderSource: string;
      programs: Record<number, WebGLProgram | null>;
      activeProgram: WebGLProgram | null;
      uniforms: Record<string, WebGLUniformLocation | null>;

      constructor(
        vertexShader: WebGLShader | null,
        fragmentShaderSource: string
      ) {
        this.vertexShader = vertexShader;
        this.fragmentShaderSource = fragmentShaderSource;
        this.programs = {};
        this.activeProgram = null;
        this.uniforms = {};
      }

      setKeywords(keywords: string[]) {
        let hash = 0;
        for (const kw of keywords) {
          hash += hashCode(kw);
        }
        let program = this.programs[hash];
        if (program == null) {
          const fragmentShader = compileShader(
            glContext.FRAGMENT_SHADER,
            this.fragmentShaderSource,
            keywords
          );
          program = createProgram(this.vertexShader, fragmentShader);
          this.programs[hash] = program;
        }
        if (program === this.activeProgram) return;
        if (program) {
          this.uniforms = getUniforms(program);
        }
        this.activeProgram = program;
      }

      bind() {
        if (this.activeProgram) {
          glContext.useProgram(this.activeProgram);
        }
      }
    }

    const baseVertexShader = compileShader(
      glContext.VERTEX_SHADER,
      `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;

      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `
    );

    const copyShader = compileShader(
      glContext.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;

      void main () {
          gl_FragColor = texture2D(uTexture, vUv);
      }
    `
    );

    const clearShader = compileShader(
      glContext.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;

      void main () {
          gl_FragColor = value * texture2D(uTexture, vUv);
      }
    `
    );

    const displayShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform sampler2D uDithering;
      uniform vec2 ditherScale;
      uniform vec2 texelSize;

      vec3 linearToGamma (vec3 color) {
          color = max(color, vec3(0));
          return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
      }

      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
          #ifdef SHADING
              vec3 lc = texture2D(uTexture, vL).rgb;
              vec3 rc = texture2D(uTexture, vR).rgb;
              vec3 tc = texture2D(uTexture, vT).rgb;
              vec3 bc = texture2D(uTexture, vB).rgb;

              float dx = length(rc) - length(lc);
              float dy = length(tc) - length(bc);

              vec3 n = normalize(vec3(dx, dy, length(texelSize)));
              vec3 l = vec3(0.0, 0.0, 1.0);

              float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
              c *= diffuse;
          #endif

          float a = max(c.r, max(c.g, c.b));
          gl_FragColor = vec4(c, a);
      }
    `;

    const splatShader = compileShader(
      glContext.FRAGMENT_SHADER,
      `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;

      void main () {
          vec2 p = vUv - point.xy;
          p.x *= aspectRatio;
          vec3 splat = exp(-dot(p, p) / radius) * color;
          vec3 base = texture2D(uTarget, vUv).xyz;
          gl_FragColor = vec4(base + splat, 1.0);
      }
    `
    );

    const advectionShader = compileShader(
      glContext.FRAGMENT_SHADER,
      `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;

      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
          vec2 st = uv / tsize - 0.5;
          vec2 iuv = floor(st);
          vec2 fuv = fract(st);

          vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
          vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
          vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
          vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

          return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }

      void main () {
          #ifdef MANUAL_FILTERING
              vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
              vec4 result = bilerp(uSource, coord, dyeTexelSize);
          #else
              vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
              vec4 result = texture2D(uSource, coord);
          #endif
          float decay = 1.0 + dissipation * dt;
          gl_FragColor = result / decay;
      }
    `,
      extContext.supportLinearFiltering ? null : ["MANUAL_FILTERING"]
    );

    const divergenceShader = compileShader(
      glContext.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
          float L = texture2D(uVelocity, vL).x;
          float R = texture2D(uVelocity, vR).x;
          float T = texture2D(uVelocity, vT).y;
          float B = texture2D(uVelocity, vB).y;

          vec2 C = texture2D(uVelocity, vUv).xy;
          if (vL.x < 0.0) { L = -C.x; }
          if (vR.x > 1.0) { R = -C.x; }
          if (vT.y > 1.0) { T = -C.y; }
          if (vB.y < 0.0) { B = -C.y; }

          float div = 0.5 * (R - L + T - B);
          gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `
    );

    const curlShader = compileShader(
      glContext.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
          float L = texture2D(uVelocity, vL).y;
          float R = texture2D(uVelocity, vR).y;
          float T = texture2D(uVelocity, vT).x;
          float B = texture2D(uVelocity, vB).x;
          float vorticity = R - L - T + B;
          gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `
    );

    const vorticityShader = compileShader(
      glContext.FRAGMENT_SHADER,
      `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;

      void main () {
          float L = texture2D(uCurl, vL).x;
          float R = texture2D(uCurl, vR).x;
          float T = texture2D(uCurl, vT).x;
          float B = texture2D(uCurl, vB).x;
          float C = texture2D(uCurl, vUv).x;

          vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
          force /= length(force) + 0.0001;
          force *= curl * C;
          force.y *= -1.0;

          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity += force * dt;
          velocity = min(max(velocity, -1000.0), 1000.0);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `
    );

    const pressureShader = compileShader(
      glContext.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;

      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          float C = texture2D(uPressure, vUv).x;
          float divergence = texture2D(uDivergence, vUv).x;
          float pressure = (L + R + B + T - divergence) * 0.25;
          gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `
    );

    const gradientSubtractShader = compileShader(
      glContext.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;

      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity.xy -= vec2(R - L, T - B);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `
    );

    const blit = (() => {
      const buffer = glContext.createBuffer()!;
      glContext.bindBuffer(glContext.ARRAY_BUFFER, buffer);
      glContext.bufferData(
        glContext.ARRAY_BUFFER,
        new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
        glContext.STATIC_DRAW
      );
      const elemBuffer = glContext.createBuffer()!;
      glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, elemBuffer);
      glContext.bufferData(
        glContext.ELEMENT_ARRAY_BUFFER,
        new Uint16Array([0, 1, 2, 0, 2, 3]),
        glContext.STATIC_DRAW
      );
      glContext.vertexAttribPointer(0, 2, glContext.FLOAT, false, 0, 0);
      glContext.enableVertexAttribArray(0);

      return (target: FBO | null, doClear = false) => {
        if (!target) {
          glContext.viewport(0, 0, glContext.drawingBufferWidth, glContext.drawingBufferHeight);
          glContext.bindFramebuffer(glContext.FRAMEBUFFER, null);
        } else {
          glContext.viewport(0, 0, target.width, target.height);
          glContext.bindFramebuffer(glContext.FRAMEBUFFER, target.fbo);
        }
        if (doClear) {
          glContext.clearColor(0, 0, 0, 1);
          glContext.clear(glContext.COLOR_BUFFER_BIT);
        }
        glContext.drawElements(glContext.TRIANGLES, 6, glContext.UNSIGNED_SHORT, 0);
      };
    })();

    interface FBO {
      texture: WebGLTexture;
      fbo: WebGLFramebuffer;
      width: number;
      height: number;
      texelSizeX: number;
      texelSizeY: number;
      attach: (id: number) => number;
    }

    interface DoubleFBO {
      width: number;
      height: number;
      texelSizeX: number;
      texelSizeY: number;
      read: FBO;
      write: FBO;
      swap: () => void;
    }

    let dye: DoubleFBO;
    let velocity: DoubleFBO;
    let divergence: FBO;
    let curl: FBO;
    let pressure: DoubleFBO;

    const copyProgram = new Program(baseVertexShader, copyShader);
    const clearProgram = new Program(baseVertexShader, clearShader);
    const splatProgram = new Program(baseVertexShader, splatShader);
    const advectionProgram = new Program(baseVertexShader, advectionShader);
    const divergenceProgram = new Program(baseVertexShader, divergenceShader);
    const curlProgram = new Program(baseVertexShader, curlShader);
    const vorticityProgram = new Program(baseVertexShader, vorticityShader);
    const pressureProgram = new Program(baseVertexShader, pressureShader);
    const gradienSubtractProgram = new Program(
      baseVertexShader,
      gradientSubtractShader
    );
    const displayMaterial = new Material(baseVertexShader, displayShaderSource);

    function createFBO(
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): FBO {
      glContext.activeTexture(glContext.TEXTURE0);
      const texture = glContext.createTexture()!;
      glContext.bindTexture(glContext.TEXTURE_2D, texture);
      glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, param);
      glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, param);
      glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.CLAMP_TO_EDGE);
      glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_T, glContext.CLAMP_TO_EDGE);
      glContext.texImage2D(
        glContext.TEXTURE_2D,
        0,
        internalFormat,
        w,
        h,
        0,
        format,
        type,
        null
      );
      const fbo = glContext.createFramebuffer()!;
      glContext.bindFramebuffer(glContext.FRAMEBUFFER, fbo);
      glContext.framebufferTexture2D(
        glContext.FRAMEBUFFER,
        glContext.COLOR_ATTACHMENT0,
        glContext.TEXTURE_2D,
        texture,
        0
      );
      glContext.viewport(0, 0, w, h);
      glContext.clear(glContext.COLOR_BUFFER_BIT);

      const texelSizeX = 1 / w;
      const texelSizeY = 1 / h;

      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX,
        texelSizeY,
        attach(id: number) {
          glContext.activeTexture(glContext.TEXTURE0 + id);
          glContext.bindTexture(glContext.TEXTURE_2D, texture);
          return id;
        },
      };
    }

    function createDoubleFBO(
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): DoubleFBO {
      const fbo1 = createFBO(w, h, internalFormat, format, type, param);
      const fbo2 = createFBO(w, h, internalFormat, format, type, param);
      return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        read: fbo1,
        write: fbo2,
        swap() {
          const tmp = this.read;
          this.read = this.write;
          this.write = tmp;
        },
      };
    }

    function resizeFBO(
      target: FBO,
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ) {
      const newFBO = createFBO(w, h, internalFormat, format, type, param);
      copyProgram.bind();
      if (copyProgram.uniforms.uTexture)
        glContext.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
      blit(newFBO, false);
      return newFBO;
    }

    function resizeDoubleFBO(
      target: DoubleFBO,
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ) {
      if (target.width === w && target.height === h) return target;
      target.read = resizeFBO(
        target.read,
        w,
        h,
        internalFormat,
        format,
        type,
        param
      );
      target.write = createFBO(w, h, internalFormat, format, type, param);
      target.width = w;
      target.height = h;
      target.texelSizeX = 1 / w;
      target.texelSizeY = 1 / h;
      return target;
    }

    function initFramebuffers() {
      const simRes = getResolution(config.SIM_RESOLUTION!);
      const dyeRes = getResolution(config.DYE_RESOLUTION!);

      const texType = extContext.halfFloatTexType;
      const rgba = extContext.formatRGBA;
      const rg = extContext.formatRG;
      const r = extContext.formatR;
      const filtering = extContext.supportLinearFiltering ? glContext.LINEAR : glContext.NEAREST;
      glContext.disable(glContext.BLEND);

      if (!dye) {
        dye = createDoubleFBO(
          dyeRes.width,
          dyeRes.height,
          rgba.internalFormat,
          rgba.format,
          texType,
          filtering
        );
      } else {
        dye = resizeDoubleFBO(
          dye,
          dyeRes.width,
          dyeRes.height,
          rgba.internalFormat,
          rgba.format,
          texType,
          filtering
        );
      }

      if (!velocity) {
        velocity = createDoubleFBO(
          simRes.width,
          simRes.height,
          rg.internalFormat,
          rg.format,
          texType,
          filtering
        );
      } else {
        velocity = resizeDoubleFBO(
          velocity,
          simRes.width,
          simRes.height,
          rg.internalFormat,
          rg.format,
          texType,
          filtering
        );
      }

      divergence = createFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        glContext.NEAREST
      );
      curl = createFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        glContext.NEAREST
      );
      pressure = createDoubleFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        glContext.NEAREST
      );
    }

    function updateKeywords() {
      const displayKeywords: string[] = [];
      if (config.SHADING) displayKeywords.push("SHADING");
      displayMaterial.setKeywords(displayKeywords);
    }

    function getResolution(resolution: number) {
      const w = glContext.drawingBufferWidth;
      const h = glContext.drawingBufferHeight;
      const aspectRatio = w / h;
      let aspect = aspectRatio < 1 ? 1 / aspectRatio : aspectRatio;
      const scaled = Math.max(16, Math.round(resolution * qualityScale));
      const min = scaled;
      const max = Math.round(scaled * aspect);
      if (w > h) {
        return { width: max, height: min };
      }
      return { width: min, height: max };
    }

    function scaleByPixelRatio(input: number) {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
      return Math.floor(input * pixelRatio);
    }

    updateKeywords();
    
    // Only initialize framebuffers if WebGL is available
    if (webGLAvailable) {
      try {
        initFramebuffers();
      } catch (error) {
        console.warn('Failed to initialize framebuffers:', error);
        setWebGLAvailable(false);
        return;
      }
    }

    let lastUpdateTime = Date.now();
    let colorUpdateTimer = 0.0;

    function updateFrame() {
      // Don't run if WebGL is not available
      if (!webGLAvailable) return;
      
      const nowTs = performance.now();
      const frameMs = nowTs - prevTimestamp;
      prevTimestamp = nowTs;
      fpsSampleCount++;
      fpsSampleTimeMs += frameMs;

      const dt = calcDeltaTime();
      if (resizeCanvas()) {
        try {
          initFramebuffers();
        } catch (error) {
          console.warn('Failed to reinitialize framebuffers:', error);
          setWebGLAvailable(false);
          return;
        }
      }
      updateColors(dt);
      applyInputs();
      step(dt);
      render(null);
      // Adaptive quality every 30 frames
      if (fpsSampleCount >= 30) {
        const fps = (1000 * fpsSampleCount) / Math.max(1, fpsSampleTimeMs);
        fpsSampleCount = 0;
        fpsSampleTimeMs = 0;
        adaptQuality(fps);
      }

      // Auto-pause when idle
      if (nowTs - lastInteractionTime > IDLE_TIMEOUT_MS) {
        stopAnimation();
        return;
      }
      animationFrameId = requestAnimationFrame(updateFrame);
    }

    function calcDeltaTime() {
      const now = Date.now();
      let dt = (now - lastUpdateTime) / 1000;
      dt = Math.min(dt, 0.016666);
      lastUpdateTime = now;
      return dt;
    }

    function resizeCanvas() {
      const width = scaleByPixelRatio(canvas!.clientWidth);
      const height = scaleByPixelRatio(canvas!.clientHeight);
      if (canvas!.width !== width || canvas!.height !== height) {
        canvas!.width = width;
        canvas!.height = height;
        return true;
      }
      return false;
    }

    function adaptQuality(fps: number) {
      let shouldReinit = false;
      if (fps < 50) {
        const newQuality = Math.max(MIN_QUALITY, qualityScale - 0.1);
        if (newQuality !== qualityScale) {
          qualityScale = newQuality;
          shouldReinit = true;
        }
        const newIter = Math.max(8, Math.floor(currentPressureIterations * 0.8));
        if (newIter !== currentPressureIterations) {
          currentPressureIterations = newIter;
        }
        if (qualityScale <= 0.6 && config.SHADING) {
          config.SHADING = false;
          updateKeywords();
          shouldReinit = true;
        }
      } else if (fps > 58) {
        const newQuality = Math.min(MAX_QUALITY, qualityScale + 0.05);
        if (newQuality !== qualityScale) {
          qualityScale = newQuality;
          shouldReinit = true;
        }
        const baseIter = PRESSURE_ITERATIONS;
        if (currentPressureIterations < baseIter && fps > 60) {
          currentPressureIterations = Math.min(baseIter, currentPressureIterations + 1);
        }
        if (qualityScale >= 0.9 && !config.SHADING) {
          config.SHADING = true;
          updateKeywords();
          shouldReinit = true;
        }
      }
      if (shouldReinit) {
        try {
          initFramebuffers();
        } catch (e) {
          // if reinit fails, back off quality further
          qualityScale = Math.max(MIN_QUALITY, qualityScale - 0.1);
          config.SHADING = false;
          updateKeywords();
          setWebGLAvailable(false);
        }
      }
    }

    function updateColors(dt: number) {
      colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
      if (colorUpdateTimer >= 1) {
        colorUpdateTimer = wrap(colorUpdateTimer, 0, 1);
        pointers.forEach((p) => {
          p.color = generateColor();
        });
      }
    }

    function applyInputs() {
      for (const p of pointers) {
        if (p.moved) {
          p.moved = false;
          splatPointer(p);
        }
      }
    }

    function step(dt: number) {
      glContext.disable(glContext.BLEND);

      curlProgram.bind();
      if (curlProgram.uniforms.texelSize) {
        glContext.uniform2f(
          curlProgram.uniforms.texelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
      }
      if (curlProgram.uniforms.uVelocity) {
        glContext.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      }
      blit(curl);

      vorticityProgram.bind();
      if (vorticityProgram.uniforms.texelSize) {
        glContext.uniform2f(
          vorticityProgram.uniforms.texelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
      }
      if (vorticityProgram.uniforms.uVelocity) {
        glContext.uniform1i(
          vorticityProgram.uniforms.uVelocity,
          velocity.read.attach(0)
        );
      }
      if (vorticityProgram.uniforms.uCurl) {
        glContext.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
      }
      if (vorticityProgram.uniforms.curl) {
        glContext.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      }
      if (vorticityProgram.uniforms.dt) {
        glContext.uniform1f(vorticityProgram.uniforms.dt, dt);
      }
      blit(velocity.write);
      velocity.swap();

      divergenceProgram.bind();
      if (divergenceProgram.uniforms.texelSize) {
        glContext.uniform2f(
          divergenceProgram.uniforms.texelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
      }
      if (divergenceProgram.uniforms.uVelocity) {
        glContext.uniform1i(
          divergenceProgram.uniforms.uVelocity,
          velocity.read.attach(0)
        );
      }
      blit(divergence);

      clearProgram.bind();
      if (clearProgram.uniforms.uTexture) {
        glContext.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
      }
      if (clearProgram.uniforms.value) {
        glContext.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
      }
      blit(pressure.write);
      pressure.swap();

      pressureProgram.bind();
      if (pressureProgram.uniforms.texelSize) {
        glContext.uniform2f(
          pressureProgram.uniforms.texelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
      }
      if (pressureProgram.uniforms.uDivergence) {
        glContext.uniform1i(
          pressureProgram.uniforms.uDivergence,
          divergence.attach(0)
        );
      }
      for (let i = 0; i < currentPressureIterations; i++) {
        if (pressureProgram.uniforms.uPressure) {
          glContext.uniform1i(
            pressureProgram.uniforms.uPressure,
            pressure.read.attach(1)
          );
        }
        blit(pressure.write);
        pressure.swap();
      }

      gradienSubtractProgram.bind();
      if (gradienSubtractProgram.uniforms.texelSize) {
        glContext.uniform2f(
          gradienSubtractProgram.uniforms.texelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
      }
      if (gradienSubtractProgram.uniforms.uPressure) {
        glContext.uniform1i(
          gradienSubtractProgram.uniforms.uPressure,
          pressure.read.attach(0)
        );
      }
      if (gradienSubtractProgram.uniforms.uVelocity) {
        glContext.uniform1i(
          gradienSubtractProgram.uniforms.uVelocity,
          velocity.read.attach(1)
        );
      }
      blit(velocity.write);
      velocity.swap();

      advectionProgram.bind();
      if (advectionProgram.uniforms.texelSize) {
        glContext.uniform2f(
          advectionProgram.uniforms.texelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
      }
      if (
        !extContext.supportLinearFiltering &&
        advectionProgram.uniforms.dyeTexelSize
      ) {
        glContext.uniform2f(
          advectionProgram.uniforms.dyeTexelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
      }
      const velocityId = velocity.read.attach(0);
      if (advectionProgram.uniforms.uVelocity) {
        glContext.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
      }
      if (advectionProgram.uniforms.uSource) {
        glContext.uniform1i(advectionProgram.uniforms.uSource, velocityId);
      }
      if (advectionProgram.uniforms.dt) {
        glContext.uniform1f(advectionProgram.uniforms.dt, dt);
      }
      if (advectionProgram.uniforms.dissipation) {
        glContext.uniform1f(
          advectionProgram.uniforms.dissipation,
          config.VELOCITY_DISSIPATION
        );
      }
      blit(velocity.write);
      velocity.swap();

      if (
        !extContext.supportLinearFiltering &&
        advectionProgram.uniforms.dyeTexelSize
      ) {
        glContext.uniform2f(
          advectionProgram.uniforms.dyeTexelSize,
          dye.texelSizeX,
          dye.texelSizeY
        );
      }
      if (advectionProgram.uniforms.uVelocity) {
        glContext.uniform1i(
          advectionProgram.uniforms.uVelocity,
          velocity.read.attach(0)
        );
      }
      if (advectionProgram.uniforms.uSource) {
        glContext.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
      }
      if (advectionProgram.uniforms.dissipation) {
        glContext.uniform1f(
          advectionProgram.uniforms.dissipation,
          config.DENSITY_DISSIPATION
        );
      }
      blit(dye.write);
      dye.swap();
    }

    function render(target: FBO | null) {
      glContext.blendFunc(glContext.ONE, glContext.ONE_MINUS_SRC_ALPHA);
      glContext.enable(glContext.BLEND);
      drawDisplay(target);
    }

    function drawDisplay(target: FBO | null) {
      const width = target ? target.width : glContext.drawingBufferWidth;
      const height = target ? target.height : glContext.drawingBufferHeight;
      displayMaterial.bind();
      if (config.SHADING && displayMaterial.uniforms.texelSize) {
        glContext.uniform2f(displayMaterial.uniforms.texelSize, 1 / width, 1 / height);
      }
      if (displayMaterial.uniforms.uTexture) {
        glContext.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
      }
      blit(target, false);
    }

    function splatPointer(pointer: Pointer) {
      const dx = pointer.deltaX * config.SPLAT_FORCE;
      const dy = pointer.deltaY * config.SPLAT_FORCE;
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
    }

    function clickSplat(pointer: Pointer) {
      const color = generateColor();
      color.r *= 5; // Reduced from 10 for less intense effect
      color.g *= 5; // Reduced from 10 for less intense effect
      color.b *= 5; // Reduced from 10 for less intense effect
      const dx = 5 * (Math.random() - 0.5); // Reduced from 10 for less spread
      const dy = 15 * (Math.random() - 0.5); // Reduced from 30 for less spread
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, color);
    }

    function splat(
      x: number,
      y: number,
      dx: number,
      dy: number,
      color: ColorRGB
    ) {
      splatProgram.bind();
      if (splatProgram.uniforms.uTarget) {
        glContext.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      }
      if (splatProgram.uniforms.aspectRatio) {
        glContext.uniform1f(
          splatProgram.uniforms.aspectRatio,
          canvas!.width / canvas!.height
        );
      }
      if (splatProgram.uniforms.point) {
        glContext.uniform2f(splatProgram.uniforms.point, x, y);
      }
      if (splatProgram.uniforms.color) {
        glContext.uniform3f(splatProgram.uniforms.color, dx, dy, 0);
      }
      if (splatProgram.uniforms.radius) {
        glContext.uniform1f(
          splatProgram.uniforms.radius,
          correctRadius(config.SPLAT_RADIUS / 100)!
        );
      }
      blit(velocity.write);
      velocity.swap();

      if (splatProgram.uniforms.uTarget) {
        glContext.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
      }
      if (splatProgram.uniforms.color) {
        glContext.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
      }
      blit(dye.write);
      dye.swap();
    }

    function correctRadius(radius: number) {
      const aspectRatio = canvas!.width / canvas!.height;
      if (aspectRatio > 1) radius *= aspectRatio;
      return radius;
    }

    function updatePointerDownData(
      pointer: Pointer,
      id: number,
      posX: number,
      posY: number
    ) {
      pointer.id = id;
      pointer.down = true;
      pointer.moved = false;
      pointer.texcoordX = posX / canvas!.width;
      pointer.texcoordY = 1 - posY / canvas!.height;
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.deltaX = 0;
      pointer.deltaY = 0;
      pointer.color = generateColor();
    }

    function updatePointerMoveData(
      pointer: Pointer,
      posX: number,
      posY: number,
      color: ColorRGB
    ) {
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.texcoordX = posX / canvas!.width;
      pointer.texcoordY = 1 - posY / canvas!.height;
      pointer.deltaX = correctDeltaX(
        pointer.texcoordX - pointer.prevTexcoordX
      )!;
      pointer.deltaY = correctDeltaY(
        pointer.texcoordY - pointer.prevTexcoordY
      )!;
      pointer.moved =
        Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
      pointer.color = color;
    }

    function updatePointerUpData(pointer: Pointer) {
      pointer.down = false;
    }

    function correctDeltaX(delta: number) {
      const aspectRatio = canvas!.width / canvas!.height;
      if (aspectRatio < 1) delta *= aspectRatio;
      return delta;
    }

    function correctDeltaY(delta: number) {
      const aspectRatio = canvas!.width / canvas!.height;
      if (aspectRatio > 1) delta /= aspectRatio;
      return delta;
    }

    function generateColor(): ColorRGB {
      const c = HSVtoRGB(Math.random(), 1.0, 1.0);
      c.r *= 0.08; // Reduced from 0.15 for lower opacity
      c.g *= 0.08; // Reduced from 0.15 for lower opacity
      c.b *= 0.08; // Reduced from 0.15 for lower opacity
      return c;
    }

    function HSVtoRGB(h: number, s: number, v: number): ColorRGB {
      let r = 0,
        g = 0,
        b = 0;
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);

      switch (i % 6) {
        case 0:
          r = v;
          g = t;
          b = p;
          break;
        case 1:
          r = q;
          g = v;
          b = p;
          break;
        case 2:
          r = p;
          g = v;
          b = t;
          break;
        case 3:
          r = p;
          g = q;
          b = v;
          break;
        case 4:
          r = t;
          g = p;
          b = v;
          break;
        case 5:
          r = v;
          g = p;
          b = q;
          break;
      }
      return { r, g, b };
    }

    function wrap(value: number, min: number, max: number) {
      const range = max - min;
      if (range === 0) return min;
      return ((value - min) % range) + min;
    }

    const onMouseDown = (e: MouseEvent) => {
      if (isOverExcludedElement(e.clientX, e.clientY)) return;
      lastInteractionTime = performance.now();
      const pointer = pointers[0];
      const posX = scaleByPixelRatio(e.clientX);
      const posY = scaleByPixelRatio(e.clientY);
      updatePointerDownData(pointer, -1, posX, posY);
      clickSplat(pointer);
      if (!isRunning) startAnimation();
    };
    window.addEventListener("mousedown", onMouseDown);

    function handleFirstMouseMove(e: MouseEvent) {
      if (isOverExcludedElement(e.clientX, e.clientY)) return;
      lastInteractionTime = performance.now();
      const pointer = pointers[0];
      const posX = scaleByPixelRatio(e.clientX);
      const posY = scaleByPixelRatio(e.clientY);
      const color = generateColor();
      startAnimation();
      updatePointerMoveData(pointer, posX, posY, color);
      document.body.removeEventListener("mousemove", handleFirstMouseMove);
    }
    document.body.addEventListener("mousemove", handleFirstMouseMove);

    const onMouseMove = (e: MouseEvent) => {
      if (isOverExcludedElement(e.clientX, e.clientY)) return;
      lastInteractionTime = performance.now();
      const pointer = pointers[0];
      const posX = scaleByPixelRatio(e.clientX);
      const posY = scaleByPixelRatio(e.clientY);
      const color = pointer.color;
      updatePointerMoveData(pointer, posX, posY, color);
      if (!isRunning) startAnimation();
    };
    window.addEventListener("mousemove", onMouseMove);

    function handleFirstTouchStart(e: TouchEvent) {
      const touches = e.targetTouches;
      const pointer = pointers[0];
      for (let i = 0; i < touches.length; i++) {
        if (isOverExcludedElement(touches[i].clientX, touches[i].clientY)) continue;
        
        const posX = scaleByPixelRatio(touches[i].clientX);
        const posY = scaleByPixelRatio(touches[i].clientY);
        startAnimation();
        updatePointerDownData(pointer, touches[i].identifier, posX, posY);
      }
      document.body.removeEventListener("touchstart", handleFirstTouchStart);
    }
    document.body.addEventListener("touchstart", handleFirstTouchStart);

    // Do not auto-start; we start on first interaction to save work

    const onTouchStart = (e: TouchEvent) => {
      const touches = e.targetTouches;
      const pointer = pointers[0];
      for (let i = 0; i < touches.length; i++) {
        if (isOverExcludedElement(touches[i].clientX, touches[i].clientY)) continue;
        lastInteractionTime = performance.now();
        const posX = scaleByPixelRatio(touches[i].clientX);
        const posY = scaleByPixelRatio(touches[i].clientY);
        updatePointerDownData(pointer, touches[i].identifier, posX, posY);
      }
      if (!isRunning) startAnimation();
    };
    window.addEventListener("touchstart", onTouchStart, false);

    const onTouchMove = (e: TouchEvent) => {
      const touches = e.targetTouches;
      const pointer = pointers[0];
      for (let i = 0; i < touches.length; i++) {
        if (isOverExcludedElement(touches[i].clientX, touches[i].clientY)) continue;
        lastInteractionTime = performance.now();
        const posX = scaleByPixelRatio(touches[i].clientX);
        const posY = scaleByPixelRatio(touches[i].clientY);
        updatePointerMoveData(pointer, posX, posY, pointer.color);
      }
      if (!isRunning) startAnimation();
    };
    window.addEventListener("touchmove", onTouchMove, false);

    const onTouchEnd = (e: TouchEvent) => {
      const touches = e.changedTouches;
      const pointer = pointers[0];
      for (let i = 0; i < touches.length; i++) {
        updatePointerUpData(pointer);
      }
    };
    window.addEventListener("touchend", onTouchEnd);

    const onVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        lastInteractionTime = performance.now();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Cleanup function
    return () => {
      // Remove event listeners
      stopAnimation();
      document.body.removeEventListener("mousemove", handleFirstMouseMove);
      document.body.removeEventListener("touchstart", handleFirstTouchStart);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [
    SIM_RESOLUTION,
    DYE_RESOLUTION,
    CAPTURE_RESOLUTION,
    DENSITY_DISSIPATION,
    VELOCITY_DISSIPATION,
    PRESSURE,
    PRESSURE_ITERATIONS,
    CURL,
    SPLAT_RADIUS,
    SPLAT_FORCE,
    SHADING,
    COLOR_UPDATE_SPEED,
    BACK_COLOR,
    TRANSPARENT,
  ]);

  // Don't render anything if WebGL is not available
  if (webGLAvailable === false) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 50,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
      }}
    >
      <canvas
        ref={canvasRef}
        id="fluid"
        style={{
          width: "100vw",
          height: "100vh",
          display: "block",
        }}
      />
    </div>
  );
}