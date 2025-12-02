import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default async function TestSupabase() {
  // Try explicit column selection matching the actual table structure
  const { data, error } = await supabase
    .from("Products")
    .select(
      "id, name, price, description_1, description_2, description_3, images"
    );

  console.log("SUPABASE PRODUCTS TEST:", { data, error });
  console.log("Data length:", data?.length);
  console.log("Error details:", error);

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <h1>Supabase Test Page</h1>
      <p>Check the server terminal for console logs.</p>

      <div
        style={{
          marginTop: 24,
          padding: 16,
          backgroundColor: "#f5f5f5",
          borderRadius: 8,
        }}
      >
        <h2>Connection Status:</h2>
        {error ? (
          <div style={{ color: "red", marginTop: 12 }}>
            <strong>Error:</strong> {error.message}
            <pre
              style={{
                marginTop: 8,
                padding: 8,
                backgroundColor: "#fff",
                borderRadius: 4,
                overflow: "auto",
              }}
            >
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        ) : (
          <div style={{ color: "green", marginTop: 12 }}>
            <strong>✓ Connected successfully!</strong>
            <p style={{ marginTop: 8, fontSize: "14px" }}>
              <strong>Number of products:</strong> {data?.length || 0}
            </p>
          </div>
        )}
      </div>

      {/* Products Display */}
      {data && data.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ marginBottom: 24 }}>Products ({data.length})</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {data.map((product: any) => (
              <div
                key={product.id}
                className="product-card-test"
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  padding: 16,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                }}
              >
                {/* Product Image */}
                {product.images &&
                product.images.length > 0 &&
                product.images[0] ? (
                  <div
                    style={{
                      width: "100%",
                      height: 200,
                      position: "relative",
                      marginBottom: 16,
                      borderRadius: 8,
                      overflow: "hidden",
                      backgroundColor: "#f0f0f0",
                    }}
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name || "Product image"}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: 200,
                      backgroundColor: "#e0e0e0",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                      color: "#999",
                    }}
                  >
                    No Image
                  </div>
                )}

                {/* Product Name */}
                <h3
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#333",
                  }}
                >
                  {product.name || "Unnamed Product"}
                </h3>

                {/* Product Price */}
                <p
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#000",
                  }}
                >
                  {product.price || "N/A"}
                </p>

                {/* Product Description */}
                {product.description_1 && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      color: "#666",
                      lineHeight: "1.5",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {product.description_1}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debug Info (Collapsible) */}
      {data && data.length > 0 && (
        <details style={{ marginTop: 32 }}>
          <summary
            style={{
              cursor: "pointer",
              padding: 12,
              backgroundColor: "#f5f5f5",
              borderRadius: 4,
            }}
          >
            <strong>View Raw Data (Debug)</strong>
          </summary>
          <pre
            style={{
              marginTop: 8,
              padding: 16,
              backgroundColor: "#fff",
              borderRadius: 4,
              overflow: "auto",
              maxHeight: "400px",
              fontSize: "12px",
            }}
          >
            {JSON.stringify(data, null, 2)}
          </pre>
        </details>
      )}

      {data && data.length === 0 && (
        <div
          style={{
            color: "orange",
            marginTop: 24,
            padding: 12,
            backgroundColor: "#fff3cd",
            borderRadius: 4,
          }}
        >
          <strong>⚠️ Warning:</strong> Query succeeded but returned 0 products.
          This could mean:
          <ul style={{ marginTop: 8, marginLeft: 20 }}>
            <li>RLS policies are blocking the query</li>
            <li>The table is empty</li>
            <li>Column names don't match</li>
          </ul>
        </div>
      )}
    </div>
  );
}
