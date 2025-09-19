// app/api/insta-thumbnail/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("url");
  if (!target) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  // Extract Instagram post ID from various URL formats
  const getPostId = (url: string) => {
    const patterns = [
      /instagram\.com\/p\/([^\/\?]+)/,
      /instagram\.com\/reel\/([^\/\?]+)/,
      /instagram\.com\/tv\/([^\/\?]+)/,
      /instagram\.com\/stories\/[^\/]+\/([^\/\?]+)/,
      /instagram\.com\/[^\/]+\/p\/([^\/\?]+)/,
      /instagram\.com\/[^\/]+\/reel\/([^\/\?]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  const postId = getPostId(target);

  try {
    // Method 1: Try Instagram's oembed API (works for public posts)
    if (postId) {
      try {
        const oembedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(
          target
        )}`;
        const oembedRes = await fetch(oembedUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
          },
        });

        if (oembedRes.ok) {
          const oembedData = await oembedRes.json();
          if (oembedData.thumbnail_url) {
            return NextResponse.json({ thumbnail: oembedData.thumbnail_url });
          }
        }
      } catch {
        console.log("Instagram oembed failed, trying scraping method");
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

    // Enhanced meta tag patterns for Instagram
    const patterns = [
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      /<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+property=["']og:video:thumbnail["'][^>]+content=["']([^"']+)["']/i,
      // Instagram specific patterns
      /<meta[^>]+name=["']medium["'][^>]+content=["']image["'][^>]*>/i,
      // Look for JSON-LD structured data
      /"thumbnailUrl":\s*"([^"]+)"/i,
      /"image":\s*"([^"]+)"/i,
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
          .replace(/&#039;/g, "'")
          .replace(/\\u0026/g, "&");

        // Validate that it's actually an image URL
        if (
          thumbnailUrl.match(/\.(jpg|jpeg|png|gif|webp)/i) ||
          thumbnailUrl.includes("scontent") ||
          thumbnailUrl.includes("cdninstagram") ||
          thumbnailUrl.includes("fbcdn")
        ) {
          return NextResponse.json({ thumbnail: thumbnailUrl });
        }
      }
    }

    // Method 3: Try to extract from Instagram's JSON data in the page
    const jsonMatch = html.match(
      /<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/
    );
    if (jsonMatch) {
      try {
        const jsonData = JSON.parse(jsonMatch[1]);
        if (
          jsonData.image &&
          Array.isArray(jsonData.image) &&
          jsonData.image[0]
        ) {
          return NextResponse.json({ thumbnail: jsonData.image[0] });
        } else if (jsonData.image && typeof jsonData.image === "string") {
          return NextResponse.json({ thumbnail: jsonData.image });
        }
      } catch {
        console.log("Failed to parse JSON-LD data");
      }
    }

    // Method 4: Look for Instagram's internal data structures
    const sharedDataMatch = html.match(/window\._sharedData\s*=\s*({.*?});/);
    if (sharedDataMatch) {
      try {
        const sharedData = JSON.parse(sharedDataMatch[1]);
        const entryData =
          sharedData?.entry_data?.PostPage?.[0]?.graphql?.shortcode_media;
        if (entryData?.display_url) {
          return NextResponse.json({ thumbnail: entryData.display_url });
        }
      } catch {
        console.log("Failed to parse Instagram shared data");
      }
    }

    return NextResponse.json({ error: "No thumbnail found" }, { status: 404 });
  } catch (err) {
    console.error("Instagram thumbnail fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch thumbnail" },
      { status: 500 }
    );
  }
}
