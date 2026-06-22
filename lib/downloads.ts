import { getSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase";

export async function createSignedDownloadUrl(filePath: string) {
  if (!hasSupabaseEnv()) {
    const contents = `Imperium Store demo download\n\nConfigure Supabase Storage to serve the production file:\n${filePath}\n`;
    return `data:text/plain;charset=utf-8,${encodeURIComponent(contents)}`;
  }
  const bucket = process.env.SUPABASE_DOWNLOADS_BUCKET ?? "product-files";
  const { data, error } = await getSupabaseServerClient(true).storage.from(bucket).createSignedUrl(filePath, 60 * 5);
  if (error) throw error;
  return data.signedUrl;
}
