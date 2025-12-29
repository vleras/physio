const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicon() {
  const logoPath = path.join(__dirname, '../public/logo.png');
  const publicDir = path.join(__dirname, '../public');

  // Check if logo exists
  if (!fs.existsSync(logoPath)) {
    console.error('Error: logo.png not found in public directory');
    process.exit(1);
  }

  try {
    // Get logo metadata
    const metadata = await sharp(logoPath).metadata();
    console.log(`Logo dimensions: ${metadata.width}x${metadata.height}`);

    // Create square versions with transparent background
    const createSquareIcon = async (size) => {
      // Calculate scaling to fit the logo within the square (with minimal padding)
      const padding = size * 0.05; // 5% padding for bigger logo
      const maxLogoSize = size - (padding * 2);
      const logoAspectRatio = metadata.width / metadata.height;
      
      let logoWidth, logoHeight;
      if (metadata.width > metadata.height) {
        logoWidth = Math.min(maxLogoSize, metadata.width);
        logoHeight = logoWidth / logoAspectRatio;
      } else {
        logoHeight = Math.min(maxLogoSize, metadata.height);
        logoWidth = logoHeight * logoAspectRatio;
      }
      
      // Create the square canvas with transparent background
      const canvas = sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
        }
      });
      
      // Resize and composite the logo
      const resizedLogo = await sharp(logoPath)
        .resize(Math.round(logoWidth), Math.round(logoHeight), {
          fit: 'inside',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toBuffer();
      
      const resizedMetadata = await sharp(resizedLogo).metadata();
      
      return canvas
        .composite([
          {
            input: resizedLogo,
            top: Math.floor((size - resizedMetadata.height) / 2),
            left: Math.floor((size - resizedMetadata.width) / 2)
          }
        ])
        .png()
        .toBuffer();
    };

    // Generate icon-32.png (32x32) - for compatibility
    const icon32Buffer = await createSquareIcon(32);
    fs.writeFileSync(path.join(publicDir, 'icon-32.png'), icon32Buffer);
    console.log('✓ Generated icon-32.png');

    // Generate icon-192.png (192x192) - for Android
    const icon192Buffer = await createSquareIcon(192);
    fs.writeFileSync(path.join(publicDir, 'icon-192.png'), icon192Buffer);
    console.log('✓ Generated icon-192.png');

    // Generate icon-512.png (512x512) - for high-res displays
    const icon512Buffer = await createSquareIcon(512);
    fs.writeFileSync(path.join(publicDir, 'icon-512.png'), icon512Buffer);
    console.log('✓ Generated icon-512.png');

    // Generate favicon.ico (96x96 PNG saved as .ico) - bigger main favicon
    // Note: Next.js accepts PNG files named favicon.ico
    const faviconBuffer = await createSquareIcon(96);
    fs.writeFileSync(path.join(publicDir, 'favicon.ico'), faviconBuffer);
    console.log('✓ Generated favicon.ico (96x96)');

    console.log('\n✅ All favicon files generated successfully!');
  } catch (error) {
    console.error('Error generating favicon:', error);
    process.exit(1);
  }
}

generateFavicon();

