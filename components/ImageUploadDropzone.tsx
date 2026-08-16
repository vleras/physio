"use client";

import { useRef, useState } from "react";
import IonIcon from "@/components/IonIcon";

type ImageUploadDropzoneProps = {
  inputId: string;
  uploading: boolean;
  progress?: string;
  onFilesSelected: (files: FileList | File[]) => void | Promise<void>;
};

export default function ImageUploadDropzone({
  inputId,
  uploading,
  progress,
  onFilesSelected,
}: ImageUploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0 || uploading) return;
    void onFilesSelected(files);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!uploading) setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (uploading) return;
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      className={`image-dropzone ${isDragging ? "is-dragging" : ""} ${uploading ? "is-uploading" : ""}`}
      onDragOver={onDragOver}
      onDragEnter={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => {
        if (!uploading) inputRef.current?.click();
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!uploading) inputRef.current?.click();
        }
      }}
      aria-label="Upload images"
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        multiple
        disabled={uploading}
        className="sr-only"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
        onClick={(e) => e.stopPropagation()}
      />
      <IonIcon name="cloud-upload-outline" size={28} />
      <p className="image-dropzone-title">
        {uploading ? "Duke ngarkuar..." : "Hidhi imazhet këtu ose kliko për të zgjedhur"}
      </p>
      <p className="image-dropzone-hint">PNG, JPG, WEBP — max 5MB secila</p>
      {progress ? <p className="image-dropzone-progress">{progress}</p> : null}
    </div>
  );
}
