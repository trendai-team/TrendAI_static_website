// frontend/scripts/fetch-medium.mjs
import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";
import { writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";

const HANDLE = process.env.MEDIUM_HANDLE || "your_medium_username";
const FEED = process.env.MEDIUM_FEED_URL || `https://medium.com/feed/@${HANDLE}`;
const OUT_PATH = "public/posts.json";

function stripHtml(html = "") {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Pull first candidate from <img>, data-src, or srcset
function firstImgFromHtml(html = "") {
  if (!html) return null;

  // 1) <img src="...">
  let m = html.match(/<img[^>]+src="([^"]+)"/i);
  if (m?.[1]) return normalizeMediumImgUrl(m[1]);

  // 2) <img data-src="...">
  m = html.match(/<img[^>]+data-src="([^"]+)"/i);
  if (m?.[1]) return normalizeMediumImgUrl(m[1]);

  // 3) <img srcset="url1 2x, url2 1x">
  m = html.match(/<img[^>]+srcset="([^"]+)"/i);
  if (m?.[1]) {
    const firstUrl = String(m[1]).split(",")[0].trim().split(" ")[0].trim();
    if (firstUrl) return normalizeMediumImgUrl(firstUrl);
  }

  // 4) <figure><source srcset="...">
  m = html.match(/<source[^>]+srcset="([^"]+)"/i);
  if (m?.[1]) {
    const firstUrl = String(m[1]).split(",")[0].trim().split(" ")[0].trim();
    if (firstUrl) return normalizeMediumImgUrl(firstUrl);
  }

  return null;
}

// Medium serves images on miro.medium.com; ensure we return a direct URL
function normalizeMediumImgUrl(u) {
  if (!u) return u;
  // strip parameters that sometimes hide images in some CDNs; keep it simple
  return u.replace(/&amp;/g, "&");
}

// Fetch <meta property="og:image" content="..."> from the article page
async function fetchOgImage(articleUrl, timeoutMs = 8000) {
  try {
    const ctrl = new AbortController();
    const id = setTimeout(() => ctrl.abort(), timeoutMs);

    const res = await fetch(articleUrl, {
      headers: {
        "User-Agent": "Static Build Fetch",
        "Accept": "text/html,application/xhtml+xml",
      },
      signal: ctrl.signal,
    });
    clearTimeout(id);
    if (!res.ok) return null;

    const html = await res.text();
    const m =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    return m?.[1] ? normalizeMediumImgUrl(m[1]) : null;
  } catch {
    return null;
  }
}

async function run() {
  console.log(`Fetching Medium feed: ${FEED}`);
  const res = await fetch(FEED, {
    headers: {
      "User-Agent": "Static Build Fetch",
      "Accept": "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
    },
  });
  if (!res.ok) throw new Error(`Feed request failed: ${res.status} ${res.statusText}`);

  const xml = await res.text();
  const rss = await parseStringPromise(xml, { explicitArray: false });

  // Limit to 8–12 so we don’t hammer Medium fetching og:image
  const rawItems = (rss?.rss?.channel?.item || []).slice(0, 8);

  const items = [];
  for (const it of rawItems) {
    const html = it["content:encoded"] || it.description || "";
    // Try common RSS image fields first
    let img =
      it?.["media:thumbnail"]?.["$"]?.url ||
      it?.["media:content"]?.["$"]?.url ||
      it?.enclosure?.url ||
      firstImgFromHtml(html);

    // Fallback: get og:image from the article page
    if (!img && it.link) {
      img = await fetchOgImage(it.link);
    }

    items.push({
      title: it.title || "Untitled",
      link: it.link,
      pubDate: it.pubDate || it.pubdate || "",
      author: it["dc:creator"] || "",
      image: img || null,
      preview: stripHtml(html).slice(0, 220),
    });
  }

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(
    OUT_PATH,
    JSON.stringify({ handle: HANDLE, generatedAt: new Date().toISOString(), items }, null, 2)
  );
  console.log(`✅ Wrote ${items.length} posts → ${OUT_PATH}`);
}

run().catch((err) => {
  console.error("❌ Medium fetch failed:", err.message);
  try {
    mkdirSync(dirname(OUT_PATH), { recursive: true });
    writeFileSync(
      OUT_PATH,
      JSON.stringify({ handle: HANDLE, generatedAt: new Date().toISOString(), items: [] }, null, 2)
    );
    console.log(`⚠️ Wrote empty posts file → ${OUT_PATH}`);
  } catch (e) {
    console.error("Failed to write fallback posts.json:", e.message);
    process.exit(1);
  }
});
