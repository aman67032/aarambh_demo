#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Video diagnostic script for Sabrang 2025
// This script checks video file status and accessibility

const VIDEO_DIR = path.join(__dirname, '../public/video');

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function checkVideoFile(filePath, fileName) {
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const size = formatFileSize(stats.size);
      const isLarge = stats.size > 10 * 1024 * 1024; // 10MB
      
      console.log(`✅ ${fileName}`);
      console.log(`   Size: ${size} ${isLarge ? '⚠️  (LARGE - Consider optimizing)' : ''}`);
      console.log(`   Path: ${filePath}`);
      
      return {
        exists: true,
        size: stats.size,
        isLarge,
        path: filePath
      };
    } else {
      console.log(`❌ ${fileName} - NOT FOUND`);
      console.log(`   Expected path: ${filePath}`);
      return { exists: false, path: filePath };
    }
  } catch (error) {
    console.log(`❌ ${fileName} - ERROR`);
    console.log(`   Error: ${error.message}`);
    return { exists: false, error: error.message, path: filePath };
  }
}

function checkVideoDirectory() {
  console.log('🎬 Video File Diagnostic Report for Sabrang 2025\n');
  
  if (!fs.existsSync(VIDEO_DIR)) {
    console.log(`❌ Video directory not found: ${VIDEO_DIR}`);
    return;
  }
  
  console.log(`📁 Video directory: ${VIDEO_DIR}\n`);
  
  // Check main videos
  const mainVideos = [
    { name: 'Hero Video (Original)', path: path.join(VIDEO_DIR, 'herovideo.mp4') },
    { name: 'Hero Video 2 (Optimized)', path: path.join(VIDEO_DIR, 'herovideo2.mp4') },
    { name: 'Loading Video', path: path.join(VIDEO_DIR, 'loadingvideo.mp4') }
  ];
  
  console.log('🎥 Main Videos:');
  console.log('='.repeat(50));
  
  const mainResults = mainVideos.map(video => 
    checkVideoFile(video.path, video.name)
  );
  
  // Check about section videos
  const aboutDir = path.join(VIDEO_DIR, 'about-section');
  const aboutVideos = [
    { name: 'About OP Video', path: path.join(aboutDir, 'about-op.mp4') },
    { name: 'Panache Video', path: path.join(aboutDir, 'panache.mp4') },
    { name: 'Band Jam Video', path: path.join(aboutDir, 'BandJAM.mp4') },
    { name: 'Dance Video', path: path.join(aboutDir, 'Dance (2).mp4') }
  ];
  
  // Check for WebM versions
  const webmVideos = [
    { name: 'Hero Video 2 WebM', path: path.join(VIDEO_DIR, 'herovideo2.webm') },
    { name: 'About OP WebM', path: path.join(aboutDir, 'about-op.webm') },
    { name: 'Panache WebM', path: path.join(aboutDir, 'panache.webm') },
    { name: 'Band Jam WebM', path: path.join(aboutDir, 'BandJAM.webm') },
    { name: 'Dance WebM', path: path.join(aboutDir, 'Dance (2).webm') }
  ];
  
  console.log('\n🎭 About Section Videos:');
  console.log('='.repeat(50));
  
  const aboutResults = aboutVideos.map(video => 
    checkVideoFile(video.path, video.name)
  );
  
  console.log('\n🌐 WebM Videos (for better compatibility):');
  console.log('='.repeat(50));
  
  const webmResults = webmVideos.map(video => 
    checkVideoFile(video.path, video.name)
  );
  
  // Summary
  console.log('\n📊 Summary:');
  console.log('='.repeat(50));
  
  const allResults = [...mainResults, ...aboutResults, ...webmResults];
  const existingVideos = allResults.filter(r => r.exists);
  const largeVideos = existingVideos.filter(r => r.isLarge);
  const missingVideos = allResults.filter(r => !r.exists);
  
  console.log(`Total videos checked: ${allResults.length}`);
  console.log(`✅ Found: ${existingVideos.length}`);
  console.log(`❌ Missing: ${missingVideos.length}`);
  console.log(`⚠️  Large (>10MB): ${largeVideos.length}`);
  
  if (largeVideos.length > 0) {
    console.log('\n⚠️  Large videos that need optimization:');
    largeVideos.forEach(video => {
      const fileName = path.basename(video.path);
      console.log(`   - ${fileName} (${formatFileSize(video.size)})`);
    });
  }
  
  if (missingVideos.length > 0) {
    console.log('\n❌ Missing videos:');
    missingVideos.forEach(video => {
      const fileName = path.basename(video.path);
      console.log(`   - ${fileName}`);
    });
  }
  
  // Recommendations
  console.log('\n💡 Recommendations:');
  console.log('='.repeat(50));
  
  if (largeVideos.length > 0) {
    console.log('1. 🎬 Optimize large videos:');
    console.log('   Run: npm run optimize-videos');
    console.log('   This will compress videos and create WebM versions');
  }
  
  if (missingVideos.length > 0) {
    console.log('2. 📁 Add missing videos to the public/video directory');
  }
  
  console.log('3. 🌐 Test video accessibility in browser:');
  console.log('   - Open browser console');
  console.log('   - Look for video loading messages');
  console.log('   - Check for CORS or file access errors');
  
  console.log('4. 📱 Test on different devices and browsers');
  
  // Check for optimized directory
  const optimizedDir = path.join(VIDEO_DIR, 'optimized');
  if (fs.existsSync(optimizedDir)) {
    console.log('\n✅ Optimized videos found in: public/video/optimized/');
    console.log('   Consider replacing original videos with optimized versions');
  } else {
    console.log('\n📝 No optimized videos found');
    console.log('   Run: npm run optimize-videos to create optimized versions');
  }
}

// Run the diagnostic
if (require.main === module) {
  checkVideoDirectory();
}

module.exports = { checkVideoDirectory };
