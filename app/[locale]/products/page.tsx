"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { type Locale } from "@/lib/getProducts";
import { useProducts } from "@/hooks/useProducts";
import IonIcon from "@/components/IonIcon";
import "./catalog.css";

export default function Catalog() {
  const locale = useLocale() as Locale;
  const t = useTranslations("products");
  const router = useRouter();
  const { data: products = [], isLoading: loading } = useProducts(locale);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    window.scrollTo(0, 0);
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
          <div className="mb-8 flex w-full items-center justify-center">
            <div className="inline-flex items-center justify-center gap-3">
              <Image
                src="/avalogo.svg"
                alt="AVA Logo"
                width={120}
                height={120}
                className="h-[100px] w-[100px] object-contain md:h-[120px] md:w-[120px]"
                priority
              />
              <h1 className="m-0 flex items-center p-0 text-black">
                <span className="inline-flex items-center gap-1 text-[1rem] font-bold leading-none md:text-[1.4rem]">
                  <span>AVA</span>
                  <span className="hidden items-baseline md:inline-flex">
                    CR
                    <Image
                      src="/7.png"
                      alt="7"
                      width={24}
                      height={24}
                      className="ml-0.5 inline-block h-[0.75em] w-auto object-contain align-baseline"
                    />
                  </span>
                  <Image
                    src="/cr7.jpg"
                    alt="CR7"
                    width={80}
                    height={40}
                    className="ml-1 inline-block h-[0.8em] w-auto object-contain align-baseline md:hidden"
                  />
                </span>
              </h1>
            </div>
          </div>
          {loading ? (
            <div className="modern-loader">
              <div className="modern-loader-spinner" />
              <span className="modern-loader-text">{t("loadingProducts")}</span>
            </div>
          ) : products.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              {t("noProductsFound")}
            </div>
          ) : (
            <>
              <div className="catalog-container">
                {currentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="product-card"
                    onClick={() => router.push(`/product/${product.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="product-card__media relative h-auto">
                      <button
                        type="button"
                        className="quick-view__button"
                        aria-label={t("quickView", { name: product.name })}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/product/${product.id}`);
                        }}
                      >
                        <IonIcon name="eye-outline" size={16} className="icon icon-eye icon-sm" />
                        <span className="sr-only">{t("view")}</span>
                      </button>
                      <Link
                        className="block relative media media--square media--contain"
                        href={{ pathname: "/product/[id]", params: { id: String(product.id) } }}
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
                        <span className="sr-only">{t("vendor")}</span>
                        <Link
                          className="caption reversed-link uppercase leading-none tracking-widest"
                          href={{ pathname: "/product/[id]", params: { id: String(product.id) } }}
                          title="AVA STORE"
                        >
                          AVA STORE
                        </Link>
                      </div>
                      <div className="product-card__details">
                        <p className="grow">
                          <Link
                            className="product-card__title reversed-link text-base-xl font-medium leading-tight"
                            href={{ pathname: "/product/[id]", params: { id: String(product.id) } }}
                          >
                            {product.name}
                          </Link>
                        </p>
                        <div className="price price-desktop">
                          <span className="price__regular whitespace-nowrap">
                            {product.price || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="price price-mobile">
                      <span className="price__regular whitespace-nowrap">
                        {product.price || "N/A"}
                      </span>
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
                    aria-label={t("previousPage")}
                  >
                    <IonIcon name="chevron-back-outline" size={16} />
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
                    aria-label={t("nextPage")}
                  >
                    <IonIcon name="chevron-forward-outline" size={16} />
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
