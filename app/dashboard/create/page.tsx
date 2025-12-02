"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createProduct } from "@/lib/productAdmin";
import { uploadImages } from "@/lib/uploadImage";

export default function CreateProduct() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description_1: "",
    description_2: "",
    description_3: "",
    images: [] as string[],
  });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });
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
  }, [formData.description_1, formData.description_2, formData.description_3]);

  const showNotification = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct(formData);
      showNotification("Produkti u krijua me sukses!", "success");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error: any) {
      showNotification(
        "Gabim në krijimin e produktit: " + error.message,
        "error"
      );
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingImages(true);
      setUploadProgress("Duke ngarkuar imazhet...");

      const uploadedUrls = await uploadImages(Array.from(files));
      setFormData({
        ...formData,
        images: [...formData.images, ...uploadedUrls],
      });

      setUploadProgress(`U ngarkuan ${uploadedUrls.length} imazhe me sukses!`);
      setTimeout(() => setUploadProgress(""), 2000);
    } catch (error: any) {
      console.error("Error uploading images:", error);
      setUploadProgress("Gabim në ngarkimin e imazheve");
      showNotification("Gabim në ngarkimin e imazheve", "error");
    } finally {
      setUploadingImages(false);
      e.target.value = "";
    }
  };

  const confirmImageDelete = (index: number) => {
    setImageDeleteConfirmation({ show: true, imageIndex: index });
  };

  const handleImageDelete = () => {
    if (imageDeleteConfirmation.imageIndex === null) return;

    const newImages = formData.images.filter(
      (_, index) => index !== imageDeleteConfirmation.imageIndex
    );
    setFormData({ ...formData, images: newImages });
    setImageDeleteConfirmation({ show: false, imageIndex: null });
    showNotification("Imazhi u fshi!", "success");
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newImages = [...formData.images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);

    setFormData({
      ...formData,
      images: newImages,
    });

    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <main className="main-content">
      <div className="container" style={{ padding: "2rem", maxWidth: "1400px" }}>
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "2rem",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "500",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Kthehu në Panel
        </button>

        <div
          style={{
            backgroundColor: "#f5f5f5",
            padding: "2rem",
            borderRadius: "8px",
            marginBottom: "2rem",
          }}
        >
          <h2 style={{ marginBottom: "1.5rem" }}>Krijo Produkt të Ri</h2>
          <form
            onSubmit={handleCreate}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                Emri i Produktit *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                Çmimi *
              </label>
              <input
                type="text"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="e.g., €777,00"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                Përshkrimi 1
              </label>
              <textarea
                ref={desc1Ref}
                value={formData.description_1}
                onChange={(e) => {
                  setFormData({ ...formData, description_1: e.target.value });
                  autoResizeTextarea(e.target);
                }}
                rows={3}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  resize: "none",
                  overflow: "hidden",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                Përshkrimi 2
              </label>
              <textarea
                ref={desc2Ref}
                value={formData.description_2}
                onChange={(e) => {
                  setFormData({ ...formData, description_2: e.target.value });
                  autoResizeTextarea(e.target);
                }}
                rows={3}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  resize: "none",
                  overflow: "hidden",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                Përshkrimi 3
              </label>
              <textarea
                ref={desc3Ref}
                value={formData.description_3}
                onChange={(e) => {
                  setFormData({ ...formData, description_3: e.target.value });
                  autoResizeTextarea(e.target);
                }}
                rows={3}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  resize: "none",
                  overflow: "hidden",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                Images
              </label>

              {/* File Upload Input */}
              <div
                style={{
                  marginBottom: "1rem",
                  padding: "1rem",
                  border: "2px dashed #ddd",
                  borderRadius: "8px",
                  backgroundColor: "#fafafa",
                  textAlign: "center",
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploadingImages}
                  style={{ display: "none" }}
                  id="image-upload-input"
                />
                <label
                  htmlFor="image-upload-input"
                  style={{
                    display: "inline-block",
                    padding: "0.75rem 1.5rem",
                    backgroundColor: uploadingImages ? "#ccc" : "#000",
                    color: "#fff",
                    borderRadius: "4px",
                    cursor: uploadingImages ? "not-allowed" : "pointer",
                    fontWeight: "600",
                  }}
                >
                  {uploadingImages ? "Duke ngarkuar..." : "📤 Ngarko Imazhe"}
                </label>
                {uploadProgress && (
                  <p
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "0.875rem",
                      color: "#666",
                    }}
                  >
                    {uploadProgress}
                  </p>
                )}
              </div>
              {/* Display uploaded images */}
              {formData.images.length > 0 && (
                <div style={{ marginTop: "1rem" }}>
                  <p
                    style={{
                      marginBottom: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#666",
                    }}
                  >
                    Imazhet e ngarkuara ({formData.images.length}):
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(150px, 1fr))",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {formData.images.map((img, index) => (
                      <div
                        key={index}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        style={{
                          position: "relative",
                          border:
                            dragOverIndex === index
                              ? "2px solid #20b2aa"
                              : draggedIndex === index
                              ? "2px dashed #20b2aa"
                              : "1px solid #ddd",
                          borderRadius: "8px",
                          overflow: "hidden",
                          backgroundColor:
                            draggedIndex === index
                              ? "rgba(32, 178, 170, 0.1)"
                              : "#f5f5f5",
                          cursor:
                            draggedIndex === index ? "grabbing" : "grab",
                          opacity: draggedIndex === index ? 0.5 : 1,
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            paddingTop: "100%",
                            position: "relative",
                          }}
                        >
                          <Image
                            src={img}
                            alt={`Image ${index + 1}`}
                            fill
                            style={{
                              objectFit: "cover",
                            }}
                            sizes="150px"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmImageDelete(index);
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          style={{
                            position: "absolute",
                            top: "0.25rem",
                            right: "0.25rem",
                            padding: "0.25rem 0.5rem",
                            backgroundColor: "rgba(220, 53, 69, 0.9)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            fontWeight: "bold",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                            zIndex: 10,
                          }}
                        >
                          ×
                        </button>
                        <div
                          style={{
                            padding: "0.5rem",
                            fontSize: "0.75rem",
                            color: "#666",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={img}
                        >
                          {img.length > 30 ? img.substring(0, 30) + "..." : img}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                type="submit"
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#000",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Krijo Produktin
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Anulo
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Custom Notification Modal */}
      {notification.show && (
        <div
          className="notification-overlay"
          onClick={() =>
            setNotification({ show: false, message: "", type: "success" })
          }
        >
          <div
            className={`notification-modal notification-${notification.type}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="notification-icon">
              {notification.type === "success" ? "✓" : "✕"}
            </div>
            <div className="notification-message">{notification.message}</div>
          </div>
        </div>
      )}

      {/* Image Delete Confirmation Modal */}
      {imageDeleteConfirmation.show && (
        <div
          className="notification-overlay"
          onClick={() =>
            setImageDeleteConfirmation({ show: false, imageIndex: null })
          }
        >
          <div
            className="notification-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "400px",
              padding: "2rem",
            }}
          >
            <h3 style={{ marginBottom: "1rem" }}>Konfirmo Fshirjen</h3>
            <p style={{ marginBottom: "1.5rem" }}>
              A jeni të sigurt që dëshironi të fshini këtë imazh?
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button
                onClick={() =>
                  setImageDeleteConfirmation({ show: false, imageIndex: null })
                }
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Anulo
              </button>
              <button
                onClick={handleImageDelete}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Fshi
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

