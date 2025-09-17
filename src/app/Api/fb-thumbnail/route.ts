// app/api/fb-thumbnail/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("url");
  if (!target) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  // Extract Facebook video ID from various URL formats
  const getVideoId = (url: string) => {
    const patterns = [
      /facebook\.com\/.*\/videos\/(\d+)/,
      /facebook\.com\/watch\/?\?v=(\d+)/,
      /fb\.watch\/([^\/\?]+)/,
      /facebook\.com\/reel\/(\d+)/,
      /(?:www\.|web\.)?facebook\.com\/share\/v\/([^\/\?]+)/,
      /facebook\.com\/.*\/posts\/(\d+)/,
      /facebook\.com\/photo\.php\?fbid=(\d+)/,
      /facebook\.com\/.*\/videos\/vb\.\d+\/(\d+)/,
      // Additional patterns for share URLs
      /facebook\.com\/share\/r\/([^\/\?]+)/,
      /facebook\.com\/.*\/videos\/([^\/\?]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        console.log(`Pattern matched: ${pattern}, ID: ${match[1]}`);
        return match[1];
      }
    }
    return null;
  };

  const videoId = getVideoId(target);
  console.log(`Processing Facebook URL: ${target}`);
  console.log(`Extracted video ID: ${videoId}`);

  try {
    // Method 1: Try Facebook Graph API (only if we have a video ID)
    if (videoId) {
      const graphUrl = `https://graph.facebook.com/${videoId}/picture?type=large`;

      try {
        const graphRes = await fetch(graphUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            Accept: "image/*,*/*;q=0.8",
          },
        });

        if (
          graphRes.ok &&
          graphRes.headers.get("content-type")?.startsWith("image/")
        ) {
          return NextResponse.json({ thumbnail: graphUrl });
        }
      } catch (e) {
        console.log("Graph API failed, trying scraping method");
      }
    }

    // Method 2: Scrape the page for meta tags
    const pageRes = await fetch(target, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Upgrade-Insecure-Requests": "1",
      },
    });

    if (!pageRes.ok) {
      throw new Error(`HTTP ${pageRes.status}`);
    }

    const html = await pageRes.text();

    // Enhanced meta tag patterns for Facebook
    const patterns = [
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      /<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+property=["']og:video:thumbnail["'][^>]+content=["']([^"']+)["']/i,
      // Facebook specific patterns
      /<img[^>]+class=["'][^"']*spotlight[^"']*["'][^>]+src=["']([^"']+)["']/i,
      /<img[^>]+data-src=["']([^"']+)["'][^>]*class=["'][^"']*spotlight[^"']*["']/i,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        let thumbnailUrl = match[1];

        // Clean up the URL
        thumbnailUrl = thumbnailUrl
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'");

        // Validate that it's actually an image URL
        if (
          thumbnailUrl.match(/\.(jpg|jpeg|png|gif|webp)/i) ||
          thumbnailUrl.includes("scontent") ||
          thumbnailUrl.includes("fbcdn")
        ) {
          return NextResponse.json({ thumbnail: thumbnailUrl });
        }
      }
    }

    // If we still haven't found a thumbnail and don't have a video ID,
    // it might be a URL format we don't recognize, but we can still try to scrape
    if (!videoId) {
      console.log("No video ID found, but attempting to scrape anyway");
    }

    return NextResponse.json({ error: "No thumbnail found" }, { status: 404 });
  } catch (err) {
    console.error("Thumbnail fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch thumbnail" },
      { status: 500 }
    );
  }
}
