"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, getProductById, type Locale, type Product } from "@/lib/getProducts";
import {
  getAllProducts,
  getProductById as getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductOrder,
} from "@/lib/productAdmin";

export function useProducts(locale: Locale) {
  return useQuery<Product[]>({
    queryKey: ["products", locale],
    queryFn: () => getProducts(locale),
  });
}

export function useProduct(id: number, locale: Locale) {
  return useQuery<Product | null>({
    queryKey: ["product", id, locale],
    queryFn: () => getProductById(id, locale),
    enabled: !isNaN(id),
  });
}

export function useAdminProducts() {
  return useQuery({
    queryKey: ["adminProducts"],
    queryFn: getAllProducts,
  });
}

export function useAdminProduct(id: number) {
  return useQuery({
    queryKey: ["adminProduct", id],
    queryFn: () => getAdminProductById(id),
    enabled: !isNaN(id),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, product }: { id: number; product: any }) =>
      updateProduct(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["adminProduct"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProductOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProductOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
