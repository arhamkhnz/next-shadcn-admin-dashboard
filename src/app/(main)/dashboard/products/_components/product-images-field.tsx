"use client";

import { type Ref, useEffect, useRef, useState } from "react";

import Image from "next/image";

import { ImageOff, ImagePlus, X } from "lucide-react";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";

export const productImageTypes = ["image/jpeg", "image/png", "image/webp"];
export const maxProductImageSize = 5 * 1024 * 1024;

interface ProductImagePreview {
  file: File;
  url?: string;
  rejection?: string;
}

interface ProductImagesFieldProps {
  files: File[];
  onChange: (files: File[]) => void;
  onBlur: () => void;
  inputRef: Ref<HTMLButtonElement>;
  error?: string;
}

export function ProductImagesField({ files, onChange, onBlur, inputRef, error }: ProductImagesFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<ProductImagePreview[]>([]);

  useEffect(() => {
    const images = files.map((file): ProductImagePreview => {
      if (!productImageTypes.includes(file.type)) return { file, rejection: "Use JPG, PNG, or WebP images." };
      if (file.size === 0) return { file, rejection: "This file is empty." };
      if (file.size > maxProductImageSize) return { file, rejection: "Image exceeds the 5 MB limit." };
      return { file, url: URL.createObjectURL(file) };
    });
    setPreviews(images);
    return () => {
      for (const image of images) {
        if (image.url) URL.revokeObjectURL(image.url);
      }
    };
  }, [files]);

  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor="add-product-images-trigger">Product images (optional)</FieldLabel>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        accept={productImageTypes.join(",")}
        onChange={(event) => {
          const selected = Array.from(event.target.files ?? []);
          const next = [...files];
          for (const file of selected) {
            const duplicate = next.some(
              (current) =>
                current.name === file.name && current.size === file.size && current.lastModified === file.lastModified,
            );
            if (!duplicate) next.push(file);
          }
          onChange(next);
          event.target.value = "";
        }}
      />
      <Button
        id="add-product-images-trigger"
        ref={inputRef}
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() => fileInputRef.current?.click()}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? "add-product-images-help add-product-images-error" : "add-product-images-help"}
      >
        <ImagePlus data-icon="inline-start" />
        Add images
      </Button>
      <FieldDescription id="add-product-images-help">Up to 5 JPG, PNG, or WebP images, 5 MB each.</FieldDescription>
      {error && <FieldError id="add-product-images-error">{error}</FieldError>}
      {previews.length > 0 && (
        <AttachmentGroup aria-label="Selected product images">
          {previews.map(({ file, url, rejection }, index) => (
            <Attachment
              key={`${file.name}-${file.size}-${file.lastModified}`}
              orientation="vertical"
              state={rejection ? "error" : "idle"}
              className="w-40"
            >
              <AttachmentMedia variant={url ? "image" : "icon"}>
                {url && <Image src={url} alt={file.name} width={160} height={160} unoptimized />}
                {rejection && <ImageOff aria-hidden="true" />}
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle title={file.name}>{file.name}</AttachmentTitle>
                <AttachmentDescription title={rejection}>
                  {rejection}
                  {!rejection && (
                    <>
                      {Math.max(1, Math.round(file.size / 1024))} KB{index === 0 && " · Cover image"}
                    </>
                  )}
                </AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                <AttachmentAction
                  type="button"
                  variant="secondary"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => onChange(files.filter((item) => item !== file))}
                >
                  <X />
                </AttachmentAction>
              </AttachmentActions>
            </Attachment>
          ))}
        </AttachmentGroup>
      )}
      {files.length > 0 && (
        <Button type="button" variant="ghost" size="sm" className="w-fit" onClick={() => onChange([])}>
          Clear images
        </Button>
      )}
    </Field>
  );
}
