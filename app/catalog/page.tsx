"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/getProducts";
import "./catalog.css";

interface SupabaseProduct {
  id: number;
  name: string;
  price: string;
  description_1?: string;
  description_2?: string;
  description_3?: string;
  images?: string[];
}

export default function Catalog() {
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 3;
    
    // Calculate the range of pages to show (always 3 pages)
    let startPage = currentPage - 1;
    let endPage = currentPage + 1;

    // Adjust if we're at the beginning
    if (currentPage === 1) {
      startPage = 1;
      endPage = Math.min(3, totalPages);
    } else if (currentPage === 2) {
      startPage = 1;
      endPage = Math.min(3, totalPages);
    } else if (currentPage >= totalPages - 1) {
      // Adjust if we're near the end
      endPage = totalPages;
      startPage = Math.max(1, totalPages - 2);
    }

    // Generate consecutive page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <main className="main-content catalog-page">
      <section className="page-section">
        <div className="container">
          <h1
            className="page-title"
            style={{ display: "flex", alignItems: "center", gap: "12px" }}
          >
            <Image
              src="/avalogo.svg"
              alt="AVA Logo"
              width={80}
              height={80}
              style={{ display: "inline-block" }}
            />
            AVACR7
          </h1>
          {loading ? (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              No products found.
            </div>
          ) : (
            <>
              <div className="catalog-container">
                {currentProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-card__media relative h-auto">
                      <button
                        type="button"
                        className="quick-view__button"
                        aria-label={`Quick view ${product.name}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Quick view functionality can be added here
                        }}
                      >
                        <svg
                          className="icon icon-eye icon-sm"
                          viewBox="0 0 20 20"
                          stroke="currentColor"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            d="M18.3334 10C18.3334 12.0833 15.8334 16.6667 10 16.6667C4.16669 16.6667 1.66669 12.0833 1.66669 10C1.66669 7.91668 4.16669 3.33334 10 3.33334C15.8334 3.33334 18.3334 7.91668 18.3334 10Z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            d="M12.5 10C12.5 11.3807 11.3807 12.5 10 12.5C8.61931 12.5 7.50002 11.3807 7.50002 10C7.50002 8.6193 8.61931 7.50001 10 7.50001C11.3807 7.50001 12.5 8.6193 12.5 10Z"
                          ></path>
                        </svg>
                        <span className="sr-only">View</span>
                      </button>
                      <Link
                        className="block relative media media--square media--contain"
                        href={`/product/${product.id}`}
                        aria-label={product.name}
                        tabIndex={-1}
                      >
                        <div className="product-image-container media media--height media--contain w-full h-full overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <>
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                className="product-card__image product-image-primary"
                                width={1000}
                                height={1000}
                                loading="lazy"
                              />
                              {product.images.length > 1 && (
                                <Image
                                  src={product.images[1]}
                                  alt={`${product.name} - Alternate view`}
                                  className="product-card__image product-image-secondary"
                                  width={1000}
                                  height={1000}
                                  loading="lazy"
                                />
                              )}
                            </>
                          ) : (
                            <Image
                              src="/images/services/hero1.png"
                              alt={product.name}
                              className="product-card__image product-image-primary"
                              width={1000}
                              height={1000}
                              loading="lazy"
                            />
                          )}
                        </div>
                      </Link>
                    </div>
                    <div className="product-card__content grow flex flex-col justify-start text-left">
                      <div className="product-card__top w-full">
                        <span className="sr-only">Vendor:</span>
                        <Link
                          className="caption reversed-link uppercase leading-none tracking-widest"
                          href={`/product/${product.id}`}
                          title="AVA STORE"
                        >
                          AVA STORE
                        </Link>
                      </div>
                      <div className="product-card__details">
                        <p className="grow">
                          <Link
                            className="product-card__title reversed-link text-base-xl font-medium leading-tight"
                            href={`/product/${product.id}`}
                          >
                            {product.name}
                          </Link>
                        </p>
                        <div className="price">
                          <span className="price__regular whitespace-nowrap">
                            {product.price || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>

                  <div className="pagination-numbers">
                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        className={`pagination-number ${
                          currentPage === page ? "active" : ""
                        }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
