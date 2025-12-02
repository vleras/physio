import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET() {
  try {
    // Read from public/images/teamlogos
    const teamlogosPath = join(process.cwd(), 'public', 'images', 'teamlogos');
    
    if (!existsSync(teamlogosPath)) {
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

