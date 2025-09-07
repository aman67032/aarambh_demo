const fs = require('fs');
const path = require('path');

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

console.log('🚀 Copying videos to optimized directory...');

videoFiles.forEach(videoFile => {
  const inputPath = path.join(videosDir, videoFile);
  const outputPath = path.join(optimizedDir, videoFile);
  
  if (fs.existsSync(inputPath)) {
    console.log(`📹 Copying ${videoFile}...`);
    
    try {
      fs.copyFileSync(inputPath, outputPath);
      const size = fs.statSync(outputPath).size;
      console.log(`✅ ${videoFile} copied! Size: ${(size / 1024 / 1024).toFixed(1)}MB`);
    } catch (error) {
      console.error(`❌ Error copying ${videoFile}:`, error.message);
    }
  } else {
    console.log(`⚠️  ${videoFile} not found, skipping...`);
  }
});

console.log('🎉 Video copying complete!');
console.log('💡 Videos are now available at /videos/optimized/');
