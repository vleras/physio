import https from "https";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type SuggestProduct = {
  handle?: string;
  title?: string;
};

type SuggestResponse = {
  resources?: {
    results?: {
      products?: SuggestProduct[];
    };
  };
};

function collectionsUrl() {
  return "https://avacr7.com/collections/all";
}

function productUrl(handle: string) {
  return `https://avacr7.com/products/${handle}`;
}

function searchUrl(q: string) {
  return `https://avacr7.com/search?q=${encodeURIComponent(q)}`;
}

function fetchSuggestJson(url: string): Promise<SuggestResponse> {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: { Accept: "application/json" },
          // Local/dev TLS interception can break default Node cert trust
          rejectUnauthorized: false,
        },
        (res) => {
          let body = "";
          res.setEncoding("utf8");
          res.on("data", (chunk) => {
            body += chunk;
          });
          res.on("end", () => {
            try {
              resolve(JSON.parse(body) as SuggestResponse);
            } catch (error) {
              reject(error);
            }
          });
        }
      )
      .on("error", reject);
  });
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q) {
    return NextResponse.redirect(collectionsUrl(), 302);
  }

  try {
    const suggestUrl =
      "https://avacr7.com/search/suggest.json" +
      `?q=${encodeURIComponent(q)}` +
      "&resources%5Btype%5D=product&resources%5Blimit%5D=5";

    const data = await fetchSuggestJson(suggestUrl);
    const products = data.resources?.results?.products ?? [];
    if (!products.length) {
      return NextResponse.redirect(searchUrl(q), 302);
    }

    const normalized = q.toLowerCase();
    const exact =
      products.find((p) => p.title?.trim().toLowerCase() === normalized) ??
      products.find((p) => p.title?.toLowerCase().includes(normalized)) ??
      products[0];

    if (exact?.handle) {
      return NextResponse.redirect(productUrl(exact.handle), 302);
    }
  } catch (error) {
    console.error("AVACR7 product lookup failed:", error);
  }

  return NextResponse.redirect(searchUrl(q), 302);
}
