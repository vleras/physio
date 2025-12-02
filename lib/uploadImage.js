import { supabase } from "@/lib/supabase";

/**
 * Upload an image file to Supabase Storage
 * @param {File} file - The image file to upload
 * @param {string} bucketName - The storage bucket name (default: "products")
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export async function uploadImage(file, bucketName = "products") {
  try {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("Image size must be less than 5MB");
    }

    // Generate a unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = fileName;

    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading image:", error);
      
      // Provide helpful error messages
      if (error.message.includes("Bucket not found") || error.message.includes("The resource was not found")) {
        throw new Error(
          `Storage bucket "${bucketName}" not found. Please create a public bucket named "${bucketName}" in your Supabase Storage.`
        );
      }
      
      throw error;
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Error in uploadImage:", error);
    throw error;
  }
}

/**
 * Upload multiple images to Supabase Storage
 * @param {File[]} files - Array of image files to upload
 * @param {string} bucketName - The storage bucket name (default: "products")
 * @returns {Promise<string[]>} - Array of public URLs
 */
export async function uploadImages(files, bucketName = "products") {
  try {
    const uploadPromises = Array.from(files).map((file) =>
      uploadImage(file, bucketName)
    );
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
}

