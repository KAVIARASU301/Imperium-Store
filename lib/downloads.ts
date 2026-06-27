import type { ProductFile } from "@/types/product";

interface GitHubReleaseAsset {
  name: string;
  browser_download_url: string;
}

interface GitHubRelease {
  body: string | null;
  assets: GitHubReleaseAsset[];
}

export async function createGithubReleaseDownloadUrl(file: ProductFile) {
  const release = await fetchLatestRelease(file.release_repository);
  const platform = file.platform.toLowerCase();
  const asset = release.assets.find((item) => isPlatformZip(item.name, platform));
  if (asset) return asset.browser_download_url;

  const bodyUrl = findReleaseBodyZipUrl(release.body, platform);
  if (bodyUrl) return bodyUrl;

  throw new Error(`No ${file.platform} zip found in ${file.release_repository} latest release`);
}

async function fetchLatestRelease(repository: string): Promise<GitHubRelease> {
  const res = await fetch(`https://api.github.com/repos/${repository}/releases/latest`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "imperium-store",
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`Unable to load latest release from ${repository}`);
  return res.json();
}

function isPlatformZip(name: string, platform: string) {
  const normalized = name.toLowerCase();
  return normalized.endsWith(".zip") && normalized.includes(platform);
}

function findReleaseBodyZipUrl(body: string | null, platform: string) {
  if (!body) return null;
  const urls = body.match(/https:\/\/[^\s)]+\.zip/g) ?? [];
  return urls.find((url) => isPlatformZip(url, platform)) ?? null;
}
