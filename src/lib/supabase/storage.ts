import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function uploadImage(
  file: File,
  bucket: string = "images",
): Promise<{ url: string; error: Error | null }> {
  try {
    // Generate a unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      return { url: "", error };
    }

    // Get the public URL of the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return { url: publicUrl, error: null };
  } catch (error) {
    return { url: "", error: error as Error };
  }
}

export async function deleteImage(url: string, bucket: string = "images"): Promise<{ error: Error | null }> {
  try {
    // Extract the file name from the URL
    const fileName = url.split("/").pop();

    if (!fileName) {
      return { error: new Error("Invalid URL") };
    }

    // Delete the file from Supabase Storage
    const { error } = await supabase.storage.from(bucket).remove([fileName]);

    return { error };
  } catch (error) {
    return { error: error as Error };
  }
}
