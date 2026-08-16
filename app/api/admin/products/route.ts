import { NextRequest, NextResponse } from "next/server";
import { verifySession, ADMIN_SESSION_COOKIE } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const LOCALES = ["sq", "en", "mk"];

async function requireAuth(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const { data, error } = await supabaseAdmin
      .from("Products")
      .select("id, price, images, display_order, product_translations ( locale, name, description_1, description_2, description_3 )")
      .eq("id", parseInt(id))
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const translations: Record<string, any> = {};
    for (const loc of LOCALES) {
      const t = (data as any).product_translations?.find((tr: any) => tr.locale === loc);
      translations[loc] = {
        name: t?.name || "",
        description_1: t?.description_1 || "",
        description_2: t?.description_2 || "",
        description_3: t?.description_3 || "",
      };
    }

    return NextResponse.json({
      id: data.id,
      price: data.price,
      images: data.images || [],
      display_order: data.display_order,
      translations,
    });
  }

  const { data, error } = await supabaseAdmin
    .from("Products")
    .select("id, price, images, display_order, product_translations ( locale, name, description_1, description_2, description_3 )");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const sorted = [...(data || [])].sort((a, b) => {
    if (a.display_order != null && b.display_order != null) return a.display_order - b.display_order;
    if (a.display_order != null) return -1;
    if (b.display_order != null) return 1;
    return a.id - b.id;
  });

  const products = sorted.map((row) => {
    const sq = (row as any).product_translations?.find((t: any) => t.locale === "sq");
    return {
      id: row.id,
      price: row.price,
      images: row.images,
      display_order: row.display_order,
      name: sq?.name || (row as any).product_translations?.[0]?.name || "",
      translations: (row as any).product_translations || [],
    };
  });

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const product = await request.json();

  if (!product.translations?.sq?.name?.trim()) {
    return NextResponse.json({ error: "Albanian product name is required" }, { status: 400 });
  }
  if (!product.price?.trim()) {
    return NextResponse.json({ error: "Product price is required" }, { status: 400 });
  }

  const { data: allProducts } = await supabaseAdmin
    .from("Products")
    .select("display_order");

  let nextOrder = 1;
  if (allProducts && allProducts.length > 0) {
    const maxOrder = Math.max(
      ...allProducts.map((p) => p.display_order).filter((order: any) => order != null)
    );
    if (maxOrder != null && !isNaN(maxOrder)) nextOrder = maxOrder + 1;
  }

  const { data, error } = await supabaseAdmin
    .from("Products")
    .insert([{
      price: product.price.trim(),
      images: Array.isArray(product.images) ? product.images : [],
      display_order: nextOrder,
    }])
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const newProduct = Array.isArray(data) ? data[0] : data;
  if (!newProduct) return NextResponse.json({ error: "No data returned" }, { status: 500 });

  const translationRows = LOCALES
    .filter((loc) => product.translations?.[loc]?.name?.trim())
    .map((loc) => ({
      product_id: newProduct.id,
      locale: loc,
      name: product.translations[loc].name.trim(),
      description_1: product.translations[loc].description_1?.trim() || null,
      description_2: product.translations[loc].description_2?.trim() || null,
      description_3: product.translations[loc].description_3?.trim() || null,
    }));

  if (translationRows.length > 0) {
    const { error: transError } = await supabaseAdmin
      .from("product_translations")
      .insert(translationRows);

    if (transError) return NextResponse.json({ error: `Product created but translations failed: ${transError.message}` }, { status: 500 });
  }

  return NextResponse.json(newProduct, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const { id, product } = await request.json();
  if (!id) return NextResponse.json({ error: "Product ID is required" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("Products")
    .update({
      price: product.price?.trim() || "",
      images: Array.isArray(product.images) ? product.images : [],
    })
    .eq("id", id)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (product.translations) {
    for (const loc of LOCALES) {
      const t = product.translations[loc];
      if (!t || !t.name?.trim()) {
        await supabaseAdmin
          .from("product_translations")
          .delete()
          .eq("product_id", id)
          .eq("locale", loc);
        continue;
      }

      const row = {
        product_id: id,
        locale: loc,
        name: t.name.trim(),
        description_1: t.description_1?.trim() || null,
        description_2: t.description_2?.trim() || null,
        description_3: t.description_3?.trim() || null,
      };

      const { error: upsertError } = await supabaseAdmin
        .from("product_translations")
        .upsert(row, { onConflict: "product_id,locale" });

      if (upsertError) {
        return NextResponse.json({ error: `Failed to update ${loc} translation: ${upsertError.message}` }, { status: 500 });
      }
    }
  }

  return NextResponse.json(Array.isArray(data) ? data[0] : data);
}

function getStoragePathFromUrl(url: string, bucketName: string): string | null {
  const marker = `/storage/v1/object/public/${bucketName}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  const path = decodeURIComponent(url.slice(idx + marker.length).split("?")[0]);
  return path || null;
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "Product ID is required" }, { status: 400 });

  const { data: product } = await supabaseAdmin
    .from("Products")
    .select("images")
    .eq("id", id)
    .single();

  const imageUrls = Array.isArray(product?.images) ? product.images : [];
  if (imageUrls.length > 0) {
    const paths = imageUrls
      .map((url: string) => getStoragePathFromUrl(url, "products"))
      .filter(Boolean) as string[];
    if (paths.length > 0) {
      await supabaseAdmin.storage.from("products").remove(paths);
    }
  }

  const { error: transError } = await supabaseAdmin
    .from("product_translations")
    .delete()
    .eq("product_id", id);

  if (transError) return NextResponse.json({ error: transError.message }, { status: 500 });

  const { error } = await supabaseAdmin
    .from("Products")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
