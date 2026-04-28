"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#faf9f7",
          color: "#1c1917",
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#f97316",
            }}
          >
            500
          </div>
          <h1 style={{ fontSize: 48, margin: "16px 0", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Something broke on our end
          </h1>
          <p style={{ color: "#57534e", fontSize: 18, lineHeight: 1.6 }}>
            We’ve logged the error and the team is looking into it. Try refreshing the page.
          </p>
          {error?.digest && (
            <p style={{ marginTop: 12, color: "#a8a29e", fontFamily: "monospace", fontSize: 12 }}>
              ref: {error.digest}
            </p>
          )}
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 28 }}>
            <button
              onClick={reset}
              style={{
                padding: "12px 24px",
                borderRadius: 999,
                background: "#1c1917",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                border: "none",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                padding: "12px 24px",
                borderRadius: 999,
                background: "#fff",
                color: "#1c1917",
                fontWeight: 600,
                fontSize: 14,
                border: "1px solid #e7e5e4",
                textDecoration: "none",
              }}
            >
              Back to homepage
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
