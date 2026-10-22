import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.jeevansutra.co.in"
  return ["/website", "/website/services"].map(path => ({ url: base + path }))
}
