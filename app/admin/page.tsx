"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAdminProducts, useDeleteProduct, useUpdateProductOrder } from "@/hooks/useProducts";
import IonIcon from "@/components/IonIcon";
import AdminToolbar from "@/components/AdminToolbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  price: string;
  images?: string[];
  display_order?: number;
  translations?: any[];
}

export default function Dashboard() {
  const router = useRouter();
  const { data: fetchedProducts = [], isLoading: loading } = useAdminProducts();
  const deleteMutation = useDeleteProduct();
  const reorderMutation = useUpdateProductOrder();
  const [products, setProducts] = useState<Product[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean;
    productId: number | null;
    productName: string;
  }>({ show: false, productId: null, productName: "" });
  const [draggedProductId, setDraggedProductId] = useState<number | null>(null);
  const [dragOverProductId, setDragOverProductId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchedIds = fetchedProducts.map((p: Product) => p.id).join(",");
    const currentIds = products.map((p: Product) => p.id).join(",");
    if (fetchedIds !== currentIds || fetchedProducts.length !== products.length) {
      setProducts(fetchedProducts as Product[]);
    }
  }, [fetchedProducts]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const confirmDelete = (id: number, productName: string) => {
    setDeleteConfirmation({ show: true, productId: id, productName });
  };

  const handleDelete = async () => {
    if (!deleteConfirmation.productId) return;

    deleteMutation.mutate(deleteConfirmation.productId, {
      onSuccess: () => {
        setDeleteConfirmation({ show: false, productId: null, productName: "" });
        toast.success("Produkti u fshi me sukses!");
      },
      onError: (error: any) => {
        toast.error("Gabim në fshirjen e produktit: " + error.message);
      },
    });
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, productId: null, productName: "" });
  };

  const startEdit = (product: Product) => {
    router.push(`/admin/edit/${product.id}`);
  };

  const handleDragEnd = () => {
    setDraggedProductId(null);
    setDragOverProductId(null);
    setTimeout(() => {
      setIsDragging(false);
    }, 100);
  };

  const handleProductDragStart = (e: React.DragEvent, productId: number) => {
    setDraggedProductId(productId);
    setIsDragging(true);
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
  };

  const handleProductDrop = async (e: React.DragEvent, dropProductId: number) => {
    e.preventDefault();
    setDragOverProductId(null);

    if (!draggedProductId || draggedProductId === dropProductId) {
      setDraggedProductId(null);
      setIsDragging(false);
      return;
    }

    const draggedIndex = products.findIndex((p) => p.id === draggedProductId);
    const dropIndex = products.findIndex((p) => p.id === dropProductId);

    if (draggedIndex === -1 || dropIndex === -1) {
      setDraggedProductId(null);
      return;
    }

    const newProducts = [...products];
    const [draggedProduct] = newProducts.splice(draggedIndex, 1);
    newProducts.splice(dropIndex, 0, draggedProduct);

    setProducts(newProducts);
    setDraggedProductId(null);

    const productOrders = newProducts.map((product, index) => ({
      id: product.id,
      display_order: index + 1,
    }));
    reorderMutation.mutate(productOrders, {
      onSuccess: () => {
        toast.success("Produktet u riorganizuan dhe u ruajtën!");
      },
      onError: (error: any) => {
        toast.error("Gabim në ruajtjen e rendit: " + error.message);
      },
      onSettled: () => {
        setIsDragging(false);
      },
    });
  };

  const handleRowClick = (e: React.MouseEvent, product: Product) => {
    if (
      isDragging ||
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest(".btn-modern")
    ) {
      return;
    }
    startEdit(product);
  };

  return (
    <main className="main-content">
      <div className="container" style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <h1 className="text-xl font-bold">Paneli i Administrimit</h1>
          <AdminToolbar />
        </div>
        <div className="mb-4">
          <Button onClick={() => router.push("/admin/create")} className="gap-1.5">
            <IonIcon name="add-outline" size={18} />
            Shto Produktin
          </Button>
        </div>

        {loading ? (
          <div className="modern-loader">
            <div className="modern-loader-spinner" />
            <span className="modern-loader-text">Duke ngarkuar produktet...</span>
          </div>
        ) : (
          <>
          <div className="rounded-lg border border-border bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-12">#</TableHead>
                  <TableHead className="w-16">Imazhi</TableHead>
                  <TableHead>Emri</TableHead>
                  <TableHead>Çmimi</TableHead>
                  <TableHead className="w-40">Veprimet</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      Nuk u gjetën produkte
                    </TableCell>
                  </TableRow>
                ) : (
                  currentProducts.map((product, index) => (
                    <TableRow
                      key={product.id}
                      draggable
                      onDragStart={(e) => handleProductDragStart(e, product.id)}
                      onDragOver={(e) => handleProductDragOver(e, product.id)}
                      onDragLeave={handleProductDragLeave}
                      onDrop={(e) => handleProductDrop(e, product.id)}
                      onDragEnd={handleDragEnd}
                      onClick={(e) => handleRowClick(e, product)}
                      className={`
                        ${draggedProductId === product.id ? "opacity-50" : ""}
                        ${dragOverProductId === product.id ? "bg-accent" : ""}
                        ${!isDragging ? "cursor-pointer" : draggedProductId === product.id ? "cursor-grabbing" : "cursor-grab"}
                      `}
                    >
                      <TableCell className="font-medium text-muted-foreground">{startIndex + index + 1}</TableCell>
                      <TableCell>
                        {product.images && product.images.length > 0 ? (
                          <div className="relative w-10 h-10 rounded overflow-hidden">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                            Pa Imazh
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(product);
                            }}
                            className="gap-1"
                          >
                            <IonIcon name="create-outline" size={14} />
                            Ndrysho
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete(product.id, product.name);
                            }}
                            className="gap-1"
                          >
                            <IonIcon name="trash-outline" size={14} />
                            Fshi
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                {startIndex + 1}–{Math.min(startIndex + itemsPerPage, products.length)} nga {products.length} produkte
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <IonIcon name="chevron-back-outline" size={14} />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="min-w-[36px]"
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <IonIcon name="chevron-forward-outline" size={14} />
                </Button>
              </div>
            </div>
          )}
          </>
        )}
      </div>

      {deleteConfirmation.show && (
        <div className="confirmation-overlay" onClick={cancelDelete}>
          <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
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
              <button className="confirmation-btn confirmation-btn-cancel" onClick={cancelDelete}>
                Anulo
              </button>
              <button className="confirmation-btn confirmation-btn-confirm" onClick={handleDelete}>
                Fshi
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
