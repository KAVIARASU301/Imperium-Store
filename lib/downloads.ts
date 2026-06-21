import { getSupabaseServerClient } from "@/lib/supabase";

export async function createSignedDownloadUrl(filePath: string) {
  const bucket = process.env.SUPABASE_DOWNLOADS_BUCKET ?? "product-files";
  const { data, error } = await getSupabaseServerClient(true).storage.from(bucket).createSignedUrl(filePath, 60 * 5);
  if (error) throw error;
  return data.signedUrl;
}
