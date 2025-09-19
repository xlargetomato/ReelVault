// app/api/fb-download/route.ts
import { NextResponse } from "next/server";

// Extract Facebook video ID from various URL formats
const extractVideoId = (url: string) => {
  const patterns = [
    /facebook\.com\/.*\/videos\/(\d+)/,
    /facebook\.com\/watch\/?\?v=(\d+)/,
    /fb\.watch\/([^\/\?]+)/,
    /facebook\.com\/reel\/(\d+)/,
    /(?:www\.|web\.)?facebook\.com\/share\/v\/([^\/\?]+)/,
    /facebook\.com\/.*\/posts\/(\d+)/,
    /facebook\.com\/photo\.php\?fbid=(\d+)/,
    /facebook\.com\/.*\/videos\/vb\.\d+\/(\d+)/,
    /facebook\.com\/share\/r\/([^\/\?]+)/,
    /facebook\.com\/.*\/videos\/([^\/\?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("url");

  if (!target) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  try {
    // Scrape the Facebook page to find video URLs
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
        Referer: "https://www.facebook.com/",
      },
    });

    if (!pageRes.ok) {
      console.log(`Facebook returned ${pageRes.status} for URL: ${target}`);
      // Try alternative approach for blocked requests
      if (pageRes.status === 400 || pageRes.status === 403) {
        return NextResponse.json(
          {
            error:
              "Facebook blocked the request. Try opening the video directly and copying the video URL.",
          },
          { status: 403 }
        );
      }
      throw new Error(`HTTP ${pageRes.status}`);
    }

    const html = await pageRes.text();

    // Look for video URLs in various formats
    const videoPatterns = [
      /"playable_url":"([^"]+)"/g,
      /"playable_url_quality_hd":"([^"]+)"/g,
      /"browser_native_hd_url":"([^"]+)"/g,
      /"browser_native_sd_url":"([^"]+)"/g,
      /hd_src:"([^"]+)"/g,
      /sd_src:"([^"]+)"/g,
      /"video_url":"([^"]+)"/g,
    ];

    const videoUrls: string[] = [];

    for (const pattern of videoPatterns) {
      let match;
      while ((match = pattern.exec(html)) !== null) {
        let videoUrl = match[1];
        // Clean up the URL
        videoUrl = videoUrl
          .replace(/\\u0026/g, "&")
          .replace(/\\"/g, '"')
          .replace(/\\\//g, "/");

        if (videoUrl && !videoUrls.includes(videoUrl)) {
          videoUrls.push(videoUrl);
        }
      }
    }

    if (videoUrls.length === 0) {
      // Fallback: Try to extract video ID and use alternative method
      const videoId = extractVideoId(target);
      if (videoId) {
        // Try Facebook's mobile version which sometimes has different structure
        try {
          const mobileUrl = `https://m.facebook.com/watch/?v=${videoId}`;
          const mobileRes = await fetch(mobileUrl, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1",
            },
          });

          if (mobileRes.ok) {
            const mobileHtml = await mobileRes.text();
            // Look for video URLs in mobile version
            for (const pattern of videoPatterns) {
              let match;
              while ((match = pattern.exec(mobileHtml)) !== null) {
                const videoUrl = match[1]
                  .replace(/\\u0026/g, "&")
                  .replace(/\\"/g, '"')
                  .replace(/\\\//g, "/");

                if (videoUrl && !videoUrls.includes(videoUrl)) {
                  videoUrls.push(videoUrl);
                }
              }
            }
          }
        } catch {
          console.log("Mobile fallback failed");
        }
      }

      if (videoUrls.length === 0) {
        return NextResponse.json(
          {
            error:
              "No video found. The video might be private, deleted, or require login.",
          },
          { status: 404 }
        );
      }
    }

    // Return the best quality video URL (usually the first HD one)
    const bestUrl =
      videoUrls.find((url: string) => url.includes("hd")) || videoUrls[0];

    return NextResponse.json({
      downloadUrl: bestUrl,
      allUrls: videoUrls,
    });
  } catch (err) {
    console.error("Facebook download error:", err);
    return NextResponse.json(
      { error: "Failed to get download URL" },
      { status: 500 }
    );
  }
}
