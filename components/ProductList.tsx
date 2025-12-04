'use client';

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/getProducts";
import Image from "next/image";

interface Product {
  id: any;
  name: any;
  price: any;
  description_1?: any;
  description_2?: any;
  description_3?: any;
  images?: any;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
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

          {p.images?.map((img: any, i: number) => (
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

