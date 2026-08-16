"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { useCreateProduct } from "@/hooks/useProducts";
import { uploadImages } from "@/lib/uploadImage";
import IonIcon from "@/components/IonIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploadDropzone from "@/components/ImageUploadDropzone";

const LOCALES = ["sq", "en", "mk"] as const;
const LOCALE_LABELS: Record<string, string> = {
  sq: "Shqip",
  en: "English",
  mk: "Македонски",
};

type TranslationData = {
  name: string;
  description_1: string;
  description_2: string;
  description_3: string;
};

export default function CreateProduct() {
  const router = useRouter();
  const createMutation = useCreateProduct();
  const [activeLocale, setActiveLocale] = useState<string>("sq");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [translations, setTranslations] = useState<Record<string, TranslationData>>({
    sq: { name: "", description_1: "", description_2: "", description_3: "" },
    en: { name: "", description_1: "", description_2: "", description_3: "" },
    mk: { name: "", description_1: "", description_2: "", description_3: "" },
  });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [imageDeleteConfirmation, setImageDeleteConfirmation] = useState<{
    show: boolean;
    imageIndex: number | null;
  }>({ show: false, imageIndex: null });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const desc1Ref = useRef<HTMLTextAreaElement>(null);
  const desc2Ref = useRef<HTMLTextAreaElement>(null);
  const desc3Ref = useRef<HTMLTextAreaElement>(null);

  const autoResizeTextarea = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  useEffect(() => {
    if (desc1Ref.current) autoResizeTextarea(desc1Ref.current);
    if (desc2Ref.current) autoResizeTextarea(desc2Ref.current);
    if (desc3Ref.current) autoResizeTextarea(desc3Ref.current);
  }, [translations, activeLocale]);

  const updateTranslation = (locale: string, field: keyof TranslationData, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({ price, images, translations });
      toast.success("Produkti u krijua me sukses!");
      router.push("/admin");
    } catch (error: any) {
      toast.error("Gabim në krijimin e produktit: " + error.message);
    }
  };

  const handleImageUpload = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length === 0) return;
    try {
      setUploadingImages(true);
      setUploadProgress("Duke ngarkuar imazhet...");
      const uploadedUrls = await uploadImages(list);
      setImages((prev) => [...prev, ...uploadedUrls]);
      toast.success(`U ngarkuan ${uploadedUrls.length} imazhe me sukses!`);
      setUploadProgress("");
    } catch (error: any) {
      console.error("Error uploading images:", error);
      toast.error(error?.message || "Gabim në ngarkimin e imazheve");
    } finally {
      setUploadingImages(false);
    }
  };

  const confirmImageDelete = (index: number) => {
    setImageDeleteConfirmation({ show: true, imageIndex: index });
  };

  const handleImageDelete = () => {
    if (imageDeleteConfirmation.imageIndex === null) return;
    setImages((prev) => prev.filter((_, i) => i !== imageDeleteConfirmation.imageIndex));
    setImageDeleteConfirmation({ show: false, imageIndex: null });
    toast.success("Imazhi u fshi!");
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    if (draggedIndex === null || draggedIndex === dropIndex) { setDraggedIndex(null); return; }
    const newImages = [...images];
    const dragged = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, dragged);
    setImages(newImages);
    setDraggedIndex(null);
  };

  const current = translations[activeLocale];

  return (
    <main className="main-content">
      <div className="container" style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
        <Button variant="secondary" onClick={() => router.push("/admin")} className="mb-4 gap-1.5">
          <IonIcon name="arrow-back-outline" size={18} />
          Kthehu në Panel
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Krijo Produkt të Ri</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="flex flex-col gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="price">Çmimi *</Label>
                <Input
                  id="price"
                  type="text"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g., €777,00"
                />
              </div>

              <div className="space-y-3">
                <Label>Përkthimet</Label>
                <div className="flex">
                  {LOCALES.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setActiveLocale(loc)}
                      className={`px-4 py-2 text-sm font-medium border transition-colors ${
                        activeLocale === loc
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-white text-foreground border-border hover:bg-muted"
                      } ${loc === "sq" ? "rounded-l-md" : loc === "mk" ? "rounded-r-md" : ""}`}
                    >
                      {loc.toUpperCase()} — {LOCALE_LABELS[loc]}
                      {loc === "sq" && " *"}
                    </button>
                  ))}
                </div>

                <div className="rounded-md border border-border p-4 space-y-4">
                  <div className="space-y-1.5">
                    <Label>Emri i Produktit {activeLocale === "sq" && "*"}</Label>
                    <Input
                      type="text"
                      required={activeLocale === "sq"}
                      value={current.name}
                      onChange={(e) => updateTranslation(activeLocale, "name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Përshkrimi 1</Label>
                    <Textarea
                      ref={desc1Ref}
                      value={current.description_1}
                      rows={3}
                      onChange={(e) => { updateTranslation(activeLocale, "description_1", e.target.value); autoResizeTextarea(e.target); }}
                      className="resize-none overflow-hidden"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Përshkrimi 2</Label>
                    <Textarea
                      ref={desc2Ref}
                      value={current.description_2}
                      rows={3}
                      onChange={(e) => { updateTranslation(activeLocale, "description_2", e.target.value); autoResizeTextarea(e.target); }}
                      className="resize-none overflow-hidden"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Përshkrimi 3</Label>
                    <Textarea
                      ref={desc3Ref}
                      value={current.description_3}
                      rows={3}
                      onChange={(e) => { updateTranslation(activeLocale, "description_3", e.target.value); autoResizeTextarea(e.target); }}
                      className="resize-none overflow-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Images</Label>
                <ImageUploadDropzone
                  inputId="image-upload-input"
                  uploading={uploadingImages}
                  progress={uploadProgress}
                  onFilesSelected={handleImageUpload}
                />
                {images.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      Imazhet e ngarkuara ({images.length}):
                    </p>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
                      {images.map((img, index) => (
                        <div
                          key={index}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragLeave={() => setDragOverIndex(null)}
                          onDrop={(e) => handleDrop(e, index)}
                          onDragEnd={() => { setDraggedIndex(null); setDragOverIndex(null); }}
                          className={`relative rounded-lg overflow-hidden border-2 ${
                            dragOverIndex === index ? "border-primary" : draggedIndex === index ? "border-dashed border-primary" : "border-border"
                          } ${draggedIndex === index ? "opacity-50 bg-accent" : "bg-muted/30"}`}
                          style={{ cursor: draggedIndex === index ? "grabbing" : "grab" }}
                        >
                          <div className="relative w-full" style={{ paddingTop: "100%" }}>
                            <Image src={img} alt={`Image ${index + 1}`} fill style={{ objectFit: "cover" }} sizes="150px" />
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); confirmImageDelete(index); }}
                            className="absolute top-1 right-1 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm"
                            aria-label="Fshi imazhin"
                          >
                            <IonIcon name="close-outline" size={16} color="#fff" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button type="submit">Krijo Produktin</Button>
                <Button type="button" variant="secondary" onClick={() => router.push("/admin")}>
                  Anulo
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {imageDeleteConfirmation.show && (
        <div className="notification-overlay" onClick={() => setImageDeleteConfirmation({ show: false, imageIndex: null })}>
          <div className="notification-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "400px", padding: "2rem" }}>
            <h3 className="mb-3 font-semibold">Konfirmo Fshirjen</h3>
            <p className="mb-3 text-sm">A jeni të sigurt që dëshironi të fshini këtë imazh?</p>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setImageDeleteConfirmation({ show: false, imageIndex: null })}>
                Anulo
              </Button>
              <Button variant="destructive" onClick={handleImageDelete}>
                Fshi
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
