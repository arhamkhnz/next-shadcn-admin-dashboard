"use client";

import { useState, useRef, ChangeEvent } from "react";

import { X, Upload, Link, Image as ImageIcon, Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { uploadImage } from "@/lib/supabase/storage";

interface PicturesFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
}

export function PicturesField({ form, name, label, placeholder }: PicturesFieldProps) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [externalUrl, setExternalUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize previews from existing values
  const fieldValue = form.watch(name);
  const imageUrls = fieldValue
    ? Array.isArray(fieldValue)
      ? fieldValue
      : fieldValue
          .split(",")
          .map((url: string) => url.trim())
          .filter(Boolean)
    : [];

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const newPreviews: string[] = [];
      const newUrls: string[] = [];

      for (const file of Array.from(files)) {
        // Create preview
        const previewUrl = URL.createObjectURL(file);
        newPreviews.push(previewUrl);

        // Upload to Supabase Storage
        const { url, error } = await uploadImage(file);

        if (error) {
          toast.error(`Failed to upload ${file.name}: ${error.message}`);
          // Clean up preview if upload failed
          URL.revokeObjectURL(previewUrl);
          continue;
        }

        newUrls.push(url);
      }

      // Update form value
      const currentUrls = form.getValues(name) ?? [];
      const updatedUrls = [...currentUrls, ...newUrls];
      form.setValue(name, updatedUrls);

      // Update previews
      setImagePreviews((prev) => [...prev, ...newPreviews]);

      toast.success(`Successfully uploaded ${newUrls.length} image(s)`);
    } catch (error) {
      toast.error("An error occurred during upload");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddExternalUrl = () => {
    if (!externalUrl.trim()) return;

    const currentUrls = form.getValues(name) ?? [];
    const updatedUrls = [...currentUrls, externalUrl.trim()];
    form.setValue(name, updatedUrls);

    setExternalUrl("");
  };

  const removeImage = (index: number) => {
    const currentUrls = form.getValues(name) ?? [];
    const updatedUrls = currentUrls.filter((_: any, i: number) => i !== index);
    form.setValue(name, updatedUrls);

    // Also remove the preview
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="url" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Add URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4 space-y-4">
          <div className="rounded-lg border-2 border-dashed p-6 text-center">
            <ImageIcon className="text-muted-foreground mx-auto h-12 w-12" />
            <p className="text-muted-foreground mt-2 text-sm">Drag and drop your images here, or click to browse</p>
            <Button
              type="button"
              variant="secondary"
              className="mt-4"
              onClick={triggerFileInput}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Files
                </>
              )}
            </Button>
            <Input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              multiple
              accept="image/*"
              disabled={isUploading}
            />
          </div>
        </TabsContent>

        <TabsContent value="url" className="mt-4 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com/image.jpg"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddExternalUrl()}
            />
            <Button type="button" onClick={handleAddExternalUrl}>
              Add
            </Button>
          </div>

          <div className="text-muted-foreground text-sm">
            <p>Enter the URL of an image hosted online</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Display current images */}
      {imageUrls.length > 0 && (
        <div className="space-y-2">
          <Label>Current Images</Label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {imageUrls.map((url: string, index: number) => (
              <div key={index} className="group relative">
                <div className="bg-muted aspect-square overflow-hidden rounded-lg border">
                  {imagePreviews[index] ? (
                    <img
                      src={imagePreviews[index]}
                      alt={`Preview ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="text-muted-foreground h-6 w-6" />
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
                <div className="mt-1 truncate text-center text-xs">Image {index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hidden textarea for form submission */}
      <input type="hidden" {...form.register(name)} value={imageUrls.join(",")} />
    </div>
  );
}
