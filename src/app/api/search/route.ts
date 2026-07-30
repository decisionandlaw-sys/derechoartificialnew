import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/mdx-utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim().toLowerCase() ?? "";

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const posts = getAllPosts();

  const results = posts
    .filter((post) => {
      const title = (post.frontmatter.title || "").toString().toLowerCase();
      const excerpt = (post.excerpt || "").toString().toLowerCase();
      const category = (post.frontmatter.category || "").toString().toLowerCase();
      const tags = (post.frontmatter.tags || []).join(" ").toLowerCase();
      const haystack = `${title} ${excerpt} ${category} ${tags}`;
      return haystack.includes(query);
    })
    .slice(0, 8)
    .map((post) => {
      const category = (post.frontmatter.category || "blog").toString().toLowerCase();
      return {
        slug: post.slug,
        title: post.frontmatter.title,
        category,
        date: post.frontmatter.date,
        excerpt: post.excerpt,
        url: `/${category}/${post.slug}`,
      };
    });

  return NextResponse.json({ results });
}

