import { REPO, RELEASES_URL } from './site'

export type Platform = 'windows' | 'mac' | 'linux'

export interface Release {
  version?: string
  publishedAt?: string
  pageUrl: string
  downloads: Record<Platform, string>
}

// Releases also hold the command line executables and the portable Windows build.
const APP_PREFIX = 'OrpheusApi-'
const SUFFIXES: Record<Platform, string> = {
  windows: '-win-x64.exe',
  mac: '.dmg',
  linux: '.AppImage',
}

let cached: Promise<Release> | undefined

export function latestRelease(): Promise<Release> {
  cached ??= load()
  return cached
}

async function load(): Promise<Release> {
  const fallback: Release = {
    pageUrl: RELEASES_URL,
    downloads: { windows: RELEASES_URL, mac: RELEASES_URL, linux: RELEASES_URL },
  }
  try {
    const headers: Record<string, string> = { Accept: 'application/vnd.github+json' }
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    const response = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers })
    if (!response.ok) return fallback

    const data = await response.json() as {
      tag_name: string
      html_url: string
      published_at: string
      assets: { name: string; browser_download_url: string }[]
    }
    const downloads = { ...fallback.downloads }
    for (const platform of Object.keys(SUFFIXES) as Platform[]) {
      const asset = data.assets.find(a => a.name.startsWith(APP_PREFIX) && a.name.endsWith(SUFFIXES[platform]))
      if (asset) downloads[platform] = asset.browser_download_url
    }
    return {
      version: data.tag_name.replace(/^v/, ''),
      publishedAt: data.published_at,
      pageUrl: data.html_url,
      downloads,
    }
  } catch {
    return fallback
  }
}
