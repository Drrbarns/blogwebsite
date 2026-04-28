import * as React from "react";
import Link from "next/link";

interface PostRef {
  id: number | string;
  title?: string;
  slug?: string;
  _status?: string;
  updatedAt?: string;
}

interface Props {
  posts: PostRef[];
  adminBase: string;
}

function relativeTime(iso?: string) {
  if (!iso) return "—";
  const ts = new Date(iso).getTime();
  if (Number.isNaN(ts)) return "—";
  const diff = Math.max(0, Date.now() - ts);
  const min = Math.round(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
  const d = Math.round(hr / 24);
  if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString();
}

export function RecentPosts({ posts, adminBase }: Props) {
  if (!posts || posts.length === 0) {
    return (
      <div className="om-dash__panel om-dash__empty">
        <p className="om-dash__empty-title">No posts yet</p>
        <p className="om-dash__empty-copy">
          Your editorial pipeline is empty.{" "}
          <Link
            className="om-dash__empty-link"
            href={`${adminBase}/collections/posts/create`}
          >
            Write the first one →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="om-dash__panel om-dash__panel--list">
      <ul className="om-dash__posts">
        {posts.map((post) => (
          <li key={post.id} className="om-dash__post">
            <Link
              href={`${adminBase}/collections/posts/${post.id}`}
              className="om-dash__post-link"
            >
              <div className="om-dash__post-main">
                <span className="om-dash__post-title">
                  {post.title || "Untitled draft"}
                </span>
                {post.slug && (
                  <span className="om-dash__post-slug">/blog/{post.slug}</span>
                )}
              </div>
              <div className="om-dash__post-side">
                <span
                  className={`om-dash__post-status om-dash__post-status--${post._status ?? "draft"}`}
                >
                  {post._status === "published" ? "Live" : "Draft"}
                </span>
                <span className="om-dash__post-time">
                  {relativeTime(post.updatedAt)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
