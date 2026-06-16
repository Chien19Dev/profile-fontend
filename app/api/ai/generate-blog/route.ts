import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-3-flash",
  "gemini-3.1-flash-lite",
  "gemini-3.1-flash",
  "gemini-3-pro",
] as const;

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 2000;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryable(statusCode: number, message: string): boolean {
  return (
    statusCode === 429 ||
    statusCode === 503 ||
    statusCode === 529 ||
    /high demand|overloaded|try again|resource_exhausted/i.test(message)
  );
}

async function callGemini(prompt: string, maxTokens = 2048) {
  for (const model of MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: maxTokens,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          console.error(`[${model}] Empty response:`, JSON.stringify(data, null, 2));
          throw new Error("AI did not return any content");
        }
        return text;
      }

      const errMsg = data.error?.message || "";
      console.error(`[${model}] attempt ${attempt + 1} — ${response.status}: ${errMsg}`);

      if (isRetryable(response.status, errMsg) && attempt < MAX_RETRIES) {
        await delay(RETRY_DELAY_MS * (attempt + 1));
        continue;
      }
      break;
    }

    console.warn(`[${model}] exhausted, trying next model...`);
  }

  throw new Error(
    "Tất cả các model AI đều đang quá tải. Vui lòng thử lại sau ít phút.",
  );
}

export async function POST(req: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 },
      );
    }

    const body = await req.json();
    const { keyword, title, style, length, step } = body;

    if (step === "outline") {
      return await generateOutline(keyword, title, style, length);
    } else if (step === "content") {
      const { outline, notes } = body;
      return await generateContent(keyword, title, style, outline, notes);
    }

    return NextResponse.json(
      { error: "Invalid step. Use 'outline' or 'content'" },
      { status: 400 },
    );
  } catch (error) {
    console.error("AI generate blog error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 },
    );
  }
}

async function generateOutline(
  keyword: string,
  title: string,
  style: string,
  length: string,
) {
  const prompt = `Bạn là một chuyên gia viết bài SEO hàng đầu Việt Nam. Hãy tạo dàn ý chi tiết cho bài viết blog với thông tin sau:

- Từ khóa mục tiêu: ${keyword}
- Tiêu đề bài viết: ${title}
- Phong cách viết: ${style}
- Độ dài mong muốn: ${length}

Yêu cầu:
- Tạo dàn ý với các heading H2 và H3
- Mỗi H2 có 2-4 H3 con
- Dàn ý phải logic, mạch lạc, chuẩn SEO
- Không tạo nội dung chi tiết, chỉ tạo dàn ý

Trả về JSON với format:
{
  "outline": [
    {
      "level": "H2",
      "title": "Tiêu đề H2"
    },
    {
      "level": "H3",
      "title": "Tiêu đề H3",
      "parent": 0
    }
  ]
}`;

  try {
    const text = await callGemini(prompt, 2048);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { outline: [] };
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("generateOutline error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate outline" },
      { status: 500 },
    );
  }
}

async function generateContent(
  keyword: string,
  title: string,
  style: string,
  outline: Array<{ level: string; title: string }>,
  notes?: string,
) {
  const outlineText = outline
    .map((item) => `${item.level}: ${item.title}`)
    .join("\n");

  const prompt = `Bạn là một chuyên gia viết bài SEO hàng đầu Việt Nam. Hãy viết nội dung bài viết blog hoàn chỉnh với thông tin sau:

- Từ khóa mục tiêu: ${keyword}
- Tiêu đề bài viết: ${title}
- Phong cách viết: ${style}
${notes ? `- Ghi chú thêm: ${notes}` : ""}

Dàn ý bài viết:
${outlineText}

Yêu cầu:
- Viết nội dung chi tiết, đầy đủ cho từng phần trong dàn ý
- Sử dụng HTML format (h2, h3, p, strong, em, ul, ol, li)
- Bài viết phải tự nhiên, hấp dẫn, chuẩn SEO
- Mật độ từ khóa "${keyword}" xuất hiện tự nhiên, khoảng 1-2%
- Mở bài hấp dẫn, kết bài có CTA (call to action)
- Không dùng markdown, chỉ dùng HTML tags
- Không bao gồm thẻ <html>, <head>, <body>
- Tạo 5-8 tags/keywords liên quan đến nội dung bài viết, bằng tiếng Việt, ngăn cách bởi dấu phẩy

Trả về JSON với format:
{
  "title": "Tiêu đề bài viết (có thể cải thiện SEO hơn)",
  "slug": "duong-dan-bai-viet",
  "summary": "Tóm tắt 150-160 ký tự cho SEO",
  "content": "Nội dung HTML đầy đủ",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`;

  try {
    const text = await callGemini(prompt, 8192);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch
      ? JSON.parse(jsonMatch[0])
      : { title, slug: "", summary: "", content: text };
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("generateContent error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate content" },
      { status: 500 },
    );
  }
}
