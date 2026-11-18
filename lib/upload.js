
export async function uploadToImgbb(file) {
  const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!key) {
    throw new Error("Image hosting is not configured (missing NEXT_PUBLIC_IMGBB_KEY)");
  }
  const fd = new FormData();
  fd.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: "POST",
    body: fd,
  });
  const json = await res.json();
  if (!json?.success) {
    throw new Error(json?.error?.message || "Image upload failed");
  }
  return json.data.display_url || json.data.url;
}
