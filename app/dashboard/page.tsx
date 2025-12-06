"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAllProducts, deleteProduct } from "@/lib/productAdmin";

interface Product {
  id: number;
  name: string;
  price: string;
  description_1?: string;
  description_2?: string;
  description_3?: string;
  images?: string[];
}

export default function Dashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean;
    productId: number | null;
    productName: string;
  }>({ show: false, productId: null, productName: "" });
  const [draggedProductId, setDraggedProductId] = useState<number | null>(null);
  const [dragOverProductId, setDragOverProductId] = useState<number | null>(
    null
  );
  const [dragOverPageNumber, setDragOverPageNumber] = useState<number | null>(
    null
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  // Helper function to get page number for a product based on its index
  const getProductPage = (index: number, itemsPerPage: number = 12) => {
    return Math.floor(index / itemsPerPage) + 1;
  };

  // Group products by page number
  const groupProductsByPage = (itemsPerPage: number = 12) => {
    const grouped: { [page: number]: Product[] } = {};
    products.forEach((product, index) => {
      const pageNumber = getProductPage(index, itemsPerPage);
      if (!grouped[pageNumber]) {
        grouped[pageNumber] = [];
      }
      grouped[pageNumber].push(product);
    });
    return grouped;
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const confirmDelete = (id: number, productName: string) => {
    setDeleteConfirmation({ show: true, productId: id, productName });
  };

  const handleDelete = async () => {
    if (!deleteConfirmation.productId) return;

    try {
      await deleteProduct(deleteConfirmation.productId);
      setDeleteConfirmation({ show: false, productId: null, productName: "" });
      fetchProducts();
      showNotification("Produkti u fshi me sukses!", "success");
    } catch (error: any) {
      showNotification(
        "Gabim në fshirjen e produktit: " + error.message,
        "error"
      );
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, productId: null, productName: "" });
  };

  const startEdit = (product: Product) => {
    router.push(`/dashboard/edit/${product.id}`);
  };

  const handleDragEnd = () => {
    setDraggedProductId(null);
    setDragOverProductId(null);
    setDragOverPageNumber(null);
  };

  // Product row drag handlers
  const handleProductDragStart = (e: React.DragEvent, productId: number) => {
    setDraggedProductId(productId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", productId.toString());
  };

  const handleProductDragOver = (e: React.DragEvent, productId: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedProductId !== productId) {
      setDragOverProductId(productId);
    }
  };

  const handleProductDragLeave = () => {
    setDragOverProductId(null);
    setDragOverPageNumber(null);
  };

  const handleProductDrop = async (
    e: React.DragEvent,
    dropProductId: number
  ) => {
    e.preventDefault();
    setDragOverProductId(null);
    setDragOverPageNumber(null);

    if (!draggedProductId || draggedProductId === dropProductId) {
      setDraggedProductId(null);
      return;
    }

    // Find indices of dragged and drop products in the products array
    const draggedIndex = products.findIndex((p) => p.id === draggedProductId);
    const dropIndex = products.findIndex((p) => p.id === dropProductId);

    if (draggedIndex === -1 || dropIndex === -1) {
      setDraggedProductId(null);
      return;
    }

    // Reorder products
    const newProducts = [...products];
    const [draggedProduct] = newProducts.splice(draggedIndex, 1);
    newProducts.splice(dropIndex, 0, draggedProduct);

    // Update state
    setProducts(newProducts);
    setDraggedProductId(null);

    // Show notification
    showNotification("Produktet u riorganizuan!", "success");
  };

  const handlePageHeaderDragOver = (e: React.DragEvent, pageNumber: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedProductId) {
      setDragOverPageNumber(pageNumber);
    }
  };

  const handlePageHeaderDragLeave = () => {
    setDragOverPageNumber(null);
  };

  const handlePageHeaderDrop = async (
    e: React.DragEvent,
    pageNumber: number
  ) => {
    e.preventDefault();
    setDragOverPageNumber(null);

    if (!draggedProductId) {
      setDraggedProductId(null);
      return;
    }

    const itemsPerPage = 8;
    const targetIndex = (pageNumber - 1) * itemsPerPage;

    // Find index of dragged product
    const draggedIndex = products.findIndex((p) => p.id === draggedProductId);

    if (draggedIndex === -1) {
      setDraggedProductId(null);
      return;
    }

    // Reorder products - move to the beginning of the target page
    const newProducts = [...products];
    const [draggedProduct] = newProducts.splice(draggedIndex, 1);

    // Insert at the target position
    const insertIndex = Math.min(targetIndex, newProducts.length);
    newProducts.splice(insertIndex, 0, draggedProduct);

    // Update state
    setProducts(newProducts);
    setDraggedProductId(null);

    // Show notification
    showNotification(
      `Produkti u zhvendos në fillim të faqes ${pageNumber}!`,
      "success"
    );
  };

  return (
    <main className="main-content">
      <div
        className="container"
        style={{ padding: "2rem", maxWidth: "1400px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h1 className="Paneli" style={{ fontWeight: "bold" }}>
            Paneli i Administrimit
          </h1>
          <button
            onClick={() => router.push("/dashboard/create")}
            className="btn-modern btn-primary"
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
              style={{ marginRight: "0.5rem" }}
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Shto Produktin
          </button>
        </div>

        {/* Create and Edit forms are now on separate pages */}

        {/* Products Table */}
        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            Duke ngarkuar produktet...
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderBottom: "2px solid #dee2e6",
                    }}
                  >
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: "600",
                      }}
                    >
                      ID
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: "600",
                      }}
                    >
                      Imazhi
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: "600",
                      }}
                    >
                      Emri
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: "600",
                      }}
                    >
                      Çmimi
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: "600",
                      }}
                    >
                      Numri i imazheve
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: "600",
                      }}
                    >
                      Veprimet
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          padding: "2rem",
                          textAlign: "center",
                          color: "#6c757d",
                        }}
                      >
                        Nuk u gjetën produkte
                      </td>
                    </tr>
                  ) : (
                    (() => {
                      const itemsPerPage = 12;
                      const grouped = groupProductsByPage(itemsPerPage);
                      const pageNumbers = Object.keys(grouped)
                        .map(Number)
                        .sort((a, b) => a - b);

                      return pageNumbers.flatMap((pageNumber) => [
                        <tr
                          key={`page-header-${pageNumber}`}
                          onDragOver={(e) =>
                            handlePageHeaderDragOver(e, pageNumber)
                          }
                          onDragLeave={handlePageHeaderDragLeave}
                          onDrop={(e) => handlePageHeaderDrop(e, pageNumber)}
                          style={{
                            cursor: draggedProductId ? "pointer" : "default",
                            backgroundColor:
                              dragOverPageNumber === pageNumber
                                ? "rgba(62, 184, 182, 0.15)"
                                : "#f8f9fa",
                            transition: "background-color 0.2s ease",
                          }}
                        >
                          <td
                            colSpan={6}
                            style={{
                              padding: "1rem 1.5rem",
                              color: "#495057",
                              fontWeight: "700",
                              fontSize: "1.1rem",
                              borderBottom: "2px solidrgb(183, 189, 189)",
                            }}
                          >
                            Faqja {pageNumber} ({grouped[pageNumber].length}{" "}
                            produkte)
                            {dragOverPageNumber === pageNumber && (
                              <span
                                style={{
                                  marginLeft: "0.5rem",
                                  fontSize: "0.9rem",
                                  color: "#3eb8b6",
                                  fontWeight: "600",
                                }}
                              >
                                ← Lësho këtu
                              </span>
                            )}
                          </td>
                        </tr>,
                        ...grouped[pageNumber].map((product, pageIndex) => {
                          // Calculate the global index for chronological numbering
                          const globalIndex = (pageNumber - 1) * itemsPerPage + pageIndex;
                          return (
                          <tr
                            key={product.id}
                            draggable
                            onDragStart={(e) =>
                              handleProductDragStart(e, product.id)
                            }
                            onDragOver={(e) =>
                              handleProductDragOver(e, product.id)
                            }
                            onDragLeave={handleProductDragLeave}
                            onDrop={(e) => handleProductDrop(e, product.id)}
                            onDragEnd={handleDragEnd}
                            style={{
                              borderBottom: "1px solid #dee2e6",
                              cursor:
                                draggedProductId === product.id
                                  ? "grabbing"
                                  : "grab",
                              opacity:
                                draggedProductId === product.id ? 0.5 : 1,
                              backgroundColor:
                                dragOverProductId === product.id
                                  ? "rgba(62, 184, 182, 0.1)"
                                  : draggedProductId === product.id
                                  ? "rgba(62, 184, 182, 0.05)"
                                  : "transparent",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <td style={{ padding: "1rem" }}>{globalIndex + 1}</td>
                            <td style={{ padding: "1rem" }}>
                              {product.images && product.images.length > 0 ? (
                                <div
                                  style={{
                                    width: "60px",
                                    height: "60px",
                                    position: "relative",
                                    borderRadius: "4px",
                                    overflow: "hidden",
                                  }}
                                >
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    style={{ objectFit: "cover" }}
                                  />
                                </div>
                              ) : (
                                <div
                                  style={{
                                    width: "60px",
                                    height: "60px",
                                    backgroundColor: "#e9ecef",
                                    borderRadius: "4px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "0.75rem",
                                    color: "#6c757d",
                                  }}
                                >
                                  Pa Imazh
                                </div>
                              )}
                            </td>
                            <td style={{ padding: "1rem", fontWeight: "500" }}>
                              {product.name}
                            </td>
                            <td style={{ padding: "1rem" }}>{product.price}</td>
                            <td style={{ padding: "1rem" }}>
                              {product.images?.length || 0}
                            </td>
                            <td style={{ padding: "1rem" }}>
                              <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button
                                  onClick={() => startEdit(product)}
                                  className="btn-modern btn-edit"
                                  type="button"
                                >
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ marginRight: "0.375rem" }}
                                  >
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                  </svg>
                                  Ndrysho
                                </button>
                                <button
                                  onClick={() =>
                                    confirmDelete(product.id, product.name)
                                  }
                                  className="btn-modern btn-delete"
                                >
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ marginRight: "0.375rem" }}
                                  >
                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    <line x1="10" y1="11" x2="10" y2="17" />
                                    <line x1="14" y1="11" x2="14" y2="17" />
                                  </svg>
                                  Fshi
                                </button>
                              </div>
                            </td>
                          </tr>
                          );
                        }),
                      ]);
                    })()
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="confirmation-overlay" onClick={cancelDelete}>
          <div
            className="confirmation-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirmation-icon">⚠️</div>
            <h3 className="confirmation-title">Konfirmo Fshirjen</h3>
            <p className="confirmation-message">
              A jeni të sigurt që dëshironi të fshini këtë produkt?
            </p>
            {deleteConfirmation.productName && (
              <p className="confirmation-product-name">
                <strong>{deleteConfirmation.productName}</strong>
              </p>
            )}
            <p className="confirmation-warning">
              Kjo veprim nuk mund të zhbëhet.
            </p>
            <div className="confirmation-buttons">
              <button
                className="confirmation-btn confirmation-btn-cancel"
                onClick={cancelDelete}
              >
                Anulo
              </button>
              <button
                className="confirmation-btn confirmation-btn-confirm"
                onClick={handleDelete}
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
