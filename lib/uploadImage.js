export async function uploadImage(file, bucketName = "products") {
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("Image size must be less than 5MB");
  }

  const formData = new FormData();
  formData.append("files", file);

  const res = await fetch("/api/admin/upload", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Upload failed with status ${res.status}`);
  }

  const { urls } = await res.json();
  return urls[0];
}

export async function uploadImages(files, bucketName = "products") {
  const formData = new FormData();
  for (const file of Array.from(files)) {
    formData.append("files", file);
  }

  const res = await fetch("/api/admin/upload", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Upload failed with status ${res.status}`);
  }

  const { urls } = await res.json();
  return urls;
}

export function getStoragePathFromUrl(url, bucketName = "products") {
  if (!url || typeof url !== "string") return null;

  const marker = `/object/public/${bucketName}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;

  const path = decodeURIComponent(url.slice(idx + marker.length).split("?")[0]);
  return path || null;
}

export async function deleteImagesFromStorage(urls, bucketName = "products") {
  if (!Array.isArray(urls) || urls.length === 0) return;
  // Deletion is handled server-side via the DELETE product API route
}
