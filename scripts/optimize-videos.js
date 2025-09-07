#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const videosDir = path.join(__dirname, '../public/videos/aboutsection');
const optimizedDir = path.join(__dirname, '../public/videos/optimized');

// Create optimized directory if it doesn't exist
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}

const videoFiles = [
  'aboutop.mp4',
  'bandjam.mp4',
  'dance.mp4',
  'panache.mp4'
];

console.log('🚀 Starting video optimization...');

videoFiles.forEach(videoFile => {
  const inputPath = path.join(videosDir, videoFile);
  const outputPath = path.join(optimizedDir, videoFile);
  
  if (fs.existsSync(inputPath)) {
    console.log(`📹 Optimizing ${videoFile}...`);
    
    try {
      // Use ffmpeg to optimize videos for web
      const command = `ffmpeg -i "${inputPath}" -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 128k -movflags +faststart -y "${outputPath}"`;
      
      execSync(command, { stdio: 'inherit' });
      
      const originalSize = fs.statSync(inputPath).size;
      const optimizedSize = fs.statSync(outputPath).size;
      const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
      
      console.log(`✅ ${videoFile} optimized! Size reduced by ${reduction}%`);
      console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(1)}MB`);
      console.log(`   Optimized: ${(optimizedSize / 1024 / 1024).toFixed(1)}MB`);
      
    } catch (error) {
      console.error(`❌ Error optimizing ${videoFile}:`, error.message);
    }
  } else {
    console.log(`⚠️  ${videoFile} not found, skipping...`);
  }
});

console.log('🎉 Video optimization complete!');
console.log('💡 Update your video paths to use /videos/optimized/ instead of /videos/aboutsection/');
