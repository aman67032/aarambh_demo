# Video Files for Sabrang 2025

## Current Issue
The main video `Hero_Video.mp4` (39MB) is too large for efficient web hosting on Vercel.

## Solutions

### Option 1: Compress the Video (Recommended)
Create a compressed version of `Hero_Video.mp4`:

**Target specifications:**
- File size: < 5MB
- Resolution: 1280x720 or 1920x1080
- Format: MP4 with H.264 codec
- Bitrate: 800kbps - 1500kbps

**Tools to use:**
- **Online:** CloudConvert, HandBrake Online
- **Desktop:** HandBrake (free), FFmpeg
- **FFmpeg command:**
  ```bash
  ffmpeg -i Hero_Video.mp4 -vf "scale=1280:720" -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 128k Hero_Video_compressed.mp4
  ```

### Option 2: Convert to WebM
Create a WebM version for better web compatibility:
```bash
ffmpeg -i Hero_Video.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus Hero_Video.webm
```

### Option 3: Host on External Service
- Upload to YouTube/Vimeo and embed
- Use Cloudinary, AWS S3, or similar CDN
- Update the video source in `src/app/HOME.tsx`

## File Structure
```
public/video/
├── Hero_Video.mp4 (39MB) - Original file
├── Hero_Video_compressed.mp4 (TODO: <5MB) - Compressed version
├── Hero_Video.webm (TODO) - WebM version
├── about-section/ - Other videos
└── README.md - This file
```

## Next Steps
1. Create compressed video version
2. Test on Vercel deployment
3. Remove or archive original 39MB file if not needed
4. Update video sources in code if using external hosting


