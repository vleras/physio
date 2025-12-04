"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/getProducts";
import Image from "next/image";

// Define Product type locally to avoid any import conflicts
type Product = {
  id: number;
  name: string;
  price: string;
  description_1: string;
  description_2: string;
  description_3: string;
  images?: string[];
};

export default function ProductList() {
  // Explicitly type the state with our local Product type
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Type the promise explicitly
    getProducts().then((data: any) => {
      // Cast to our Product type
      setProducts(data as Product[]);
    });
  }, []);

  return (
    <div>
      {products.map((p) => (
        <div key={p.id}>
          <h2>{p.name}</h2>
          <p>{p.price}</p>
          <p>{p.description_1}</p>
          <p>{p.description_2}</p>
          <p>{p.description_3}</p>
          {p.images?.map((img: string, i: number) => (
            <Image
              key={i}
              src={img}
              alt={`${p.name} - Image ${i + 1}`}
              width={200}
              height={200}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
