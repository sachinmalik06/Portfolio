import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Upload, X, Loader2, Image as ImageIcon, Crop } from "lucide-react";
import Cropper from "react-easy-crop";

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageUploadWithCropProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  bucket?: string;
  folder?: string;
  label?: string;
  description?: string;
  acceptedFormats?: string;
  maxSizeMB?: number;
  aspectRatio?: number; // e.g., 16/9, 1/1, etc.
  cropShape?: "rect" | "round";
}

export default function ImageUploadWithCrop({
  currentImageUrl = "",
  onImageUploaded,
  bucket = "images",
  folder = "hero",
  label = "Upload Image",
  description = "Click to upload or drag and drop. Recommended: PNG, JPG, WEBP (max 5MB)",
  acceptedFormats = "image/png,image/jpeg,image/jpg,image/webp",
  maxSizeMB = 5,
  aspectRatio = 16 / 9,
  cropShape = "rect"
}: ImageUploadWithCropProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const [dragActive, setDragActive] = useState(false);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file type
    if (!acceptedFormats.split(',').some(format => file.type === format)) {
      toast.error("Invalid file type. Please upload an image file.");
      return;
    }

    // Validate file size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setOriginalFile(file);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageSrc(reader.result as string);
      setShowCropDialog(true);
    });
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async (): Promise<Blob> => {
    if (!imageSrc || !croppedAreaPixels) {
      throw new Error("No image to crop");
    }

    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }

    // Set canvas size to match the cropped area
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    // Draw the cropped image
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to create blob"));
        }
      }, originalFile?.type || "image/jpeg", 0.95);
    });
  };

  const handleCropConfirm = async () => {
    if (!croppedAreaPixels || !originalFile) return;

    setUploading(true);
    setShowCropDialog(false);

    try {
      const croppedBlob = await createCroppedImage();
      
      // Create a File from the Blob
      const fileExt = originalFile.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, croppedBlob, {
          cacheControl: '3600',
          upsert: false,
          contentType: originalFile.type
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      setPreviewUrl(publicUrl);
      onImageUploaded(publicUrl);
      toast.success("Image uploaded successfully!");
      
      // Reset crop state
      setImageSrc(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setOriginalFile(null);
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleCropCancel = () => {
    setShowCropDialog(false);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setOriginalFile(null);
  };

  const handleRemove = async () => {
    if (!previewUrl) return;

    try {
      // Extract path from URL if it's a Supabase URL
      const urlParts = previewUrl.split(`/storage/v1/object/public/${bucket}/`);
      if (urlParts.length > 1) {
        const path = urlParts[1];
        await supabase.storage.from(bucket).remove([path]);
      }
      
      setPreviewUrl("");
      onImageUploaded("");
      toast.success("Image removed successfully");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image");
    }
  };

  const handleEditCrop = () => {
    if (previewUrl) {
      setImageSrc(previewUrl);
      setShowCropDialog(true);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <div className="flex gap-2">
          {previewUrl && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleEditCrop}
                className="text-primary hover:text-primary"
              >
                <Crop className="w-4 h-4 mr-1" />
                Crop
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Preview */}
      {previewUrl ? (
        <div className="relative border-2 border-border rounded-lg overflow-hidden bg-muted">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-contain"
          />
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={acceptedFormats}
            onChange={handleChange}
            disabled={uploading}
          />
          
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {previewUrl && (
        <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <ImageIcon className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-green-500">Image URL (auto-saved)</p>
            <p className="text-xs text-muted-foreground break-all mt-1">{previewUrl}</p>
          </div>
        </div>
      )}

      {/* Crop Dialog */}
      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[400px] bg-black">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                cropShape={cropShape}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Zoom</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCropCancel}>
              Cancel
            </Button>
            <Button onClick={handleCropConfirm} disabled={uploading}>
              {uploading ? "Uploading..." : "Crop & Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper function to create an image element from a source
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });
}
