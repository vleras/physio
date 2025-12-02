import { supabase } from "@/lib/supabase";

export default async function TestSupabase() {
  const { data, error } = await supabase.from("Products").select("*");

  console.log("SUPABASE PRODUCTS TEST:", { data, error });

  return (
    <div style={{ padding: 24 }}>
      <h1>Supabase Test Page</h1>
      <p>Check the server terminal for console logs.</p>
      
      <div style={{ marginTop: 24, padding: 16, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
        <h2>Connection Status:</h2>
        {error ? (
          <div style={{ color: "red", marginTop: 12 }}>
            <strong>Error:</strong> {error.message}
            <pre style={{ marginTop: 8, padding: 8, backgroundColor: "#fff", borderRadius: 4, overflow: "auto" }}>
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        ) : (
          <div style={{ color: "green", marginTop: 12 }}>
            <strong>✓ Connected successfully!</strong>
          </div>
        )}
        
        <h3 style={{ marginTop: 24 }}>Products Data:</h3>
        {data ? (
          <div style={{ marginTop: 12 }}>
            <p><strong>Number of products:</strong> {data.length}</p>
            <pre style={{ marginTop: 8, padding: 8, backgroundColor: "#fff", borderRadius: 4, overflow: "auto", maxHeight: "400px" }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        ) : (
          <p style={{ color: "gray" }}>No data returned</p>
        )}
      </div>
    </div>
  );
}

