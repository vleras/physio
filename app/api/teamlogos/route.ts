import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET() {
  try {
    // Try to read from root images/teamlogos first, then public/images/teamlogos
    const rootPath = join(process.cwd(), 'images', 'teamlogos');
    const publicPath = join(process.cwd(), 'public', 'images', 'teamlogos');
    
    let teamlogosPath: string;
    if (existsSync(rootPath)) {
      teamlogosPath = rootPath;
    } else if (existsSync(publicPath)) {
      teamlogosPath = publicPath;
    } else {
      return NextResponse.json(
        { error: 'Teamlogos directory not found', images: [] },
        { status: 404 }
      );
    }
    
    // Read the directory
    const files = await readdir(teamlogosPath);
    
    // Filter for image files and map to public paths
    const imageExtensions = ['.webp', '.jpg', '.jpeg', '.png', '.avif'];
    const imageFiles = files
      .filter(file => {
        const ext = file.toLowerCase().substring(file.lastIndexOf('.'));
        return imageExtensions.includes(ext);
      })
      .map(file => `/images/teamlogos/${file}`)
      .sort(); // Sort alphabetically
    
    return NextResponse.json({ images: imageFiles });
  } catch (error) {
    console.error('Error reading teamlogos directory:', error);
    return NextResponse.json(
      { error: 'Failed to read teamlogos directory', images: [] },
      { status: 500 }
    );
  }
}

