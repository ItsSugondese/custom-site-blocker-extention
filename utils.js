export function extractSiteName(url) {
  const hostname = new URL(url).hostname; // Get the hostname from the URL
  const siteName = hostname.split(".")[1]; // Extract the site name (e.g., "instagram" from "www.instagram.com")
  return siteName;
}
