import type { ProductFile } from "@/types/product";

interface GitHubReleaseAsset {
  id: number;
  name: string;
  url: string;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name: string;
  name: string | null;
  body: string | null;
  published_at: string | null;
  assets: GitHubReleaseAsset[];
}

export type ReleaseMetadata = {
  version: string;
  title: string;
  notes: string;
  published_at: string;
};

export async function getGithubReleaseMetadata(repository: string): Promise<ReleaseMetadata> {
  const release = await fetchLatestRelease(repository);
  if (!release.tag_name) throw new Error(`Latest release for ${repository} has no version tag`);
  return {
    version: release.tag_name,
    title: release.name?.trim() || release.tag_name,
    notes: release.body?.trim() || "",
    published_at: release.published_at || "",
  };
}

export async function resolveGithubReleaseDownloadUrl(file: ProductFile) {
  const release = await fetchLatestRelease(file.release_repository);
  const platform = file.platform.toLowerCase();
  const asset = release.assets.find((item) => isPlatformZip(item.name, platform));
  if (asset) {
    const res = await fetch(asset.url, {
      headers: getGitHubHeaders({
        Accept: "application/octet-stream",
        "User-Agent": "imperium-store",
      }),
      redirect: "manual",
      cache: "no-store",
    });
    await res.body?.cancel();
    const location = res.headers.get("location");
    // No redirect means GitHub is serving the bytes directly; let the
    // streaming path handle it instead of a direct URL.
    return location ?? null;
  }

  const bodyUrl = findReleaseBodyZipUrl(release.body, platform);
  if (bodyUrl) return bodyUrl;

  throw new Error(`No ${file.platform} zip found in ${file.release_repository} latest release`);
}

export async function createGithubReleaseDownloadResponse(file: ProductFile) {
  const release = await fetchLatestRelease(file.release_repository);
  const platform = file.platform.toLowerCase();
  const asset = release.assets.find((item) => isPlatformZip(item.name, platform));
  if (asset) return fetchReleaseAsset(asset);

  const bodyUrl = findReleaseBodyZipUrl(release.body, platform);
  if (bodyUrl) return fetch(bodyUrl, { cache: "no-store" });

  throw new Error(`No ${file.platform} zip found in ${file.release_repository} latest release`);
}

async function fetchLatestRelease(repository: string): Promise<GitHubRelease> {
  const res = await fetch(`https://api.github.com/repos/${repository}/releases/latest`, {
    headers: getGitHubHeaders({
      Accept: "application/vnd.github+json",
      "User-Agent": "imperium-store",
    }),
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`Unable to load latest release from ${repository}`);
  return res.json();
}

async function fetchReleaseAsset(asset: GitHubReleaseAsset) {
  const response = await fetch(asset.url, {
    headers: getGitHubHeaders({
      Accept: "application/octet-stream",
      "User-Agent": "imperium-store",
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Unable to load release asset ${asset.name}`);
  return response;
}

function getGitHubHeaders(headers: Record<string, string>) {
  const token = process.env.GITHUB_RELEASE_TOKEN?.trim();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
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
