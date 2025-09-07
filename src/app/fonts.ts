import localFont from 'next/font/local';

export const quivertFont = localFont({
  src: [
    { path: '../../public/Font/quivert/Quivert.ttf', weight: '400', style: 'normal' },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-quivert',
});

export const tanNimbusFont = localFont({
  src: [
    { path: '../../public/Font/TAN_Nimbus/Web/TAN-NIMBUS.ttf', weight: '400', style: 'normal' },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-tannimbus',
});


