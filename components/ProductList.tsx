'use client';

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/getProducts";
import Image from "next/image";

export default function ProductList() {
  const [products, setProducts] = useState([]);

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

          {p.images?.map((img, i) => (
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

