/**
 * Lightweight JSON-LD validator.
 * Covers the schema.org types we emit: Article, BlogPosting, WebSite,
 * Organization, BreadcrumbList, FAQPage.
 */

export interface SchemaIssue {
  severity: "error" | "warning";
  field: string;
  message: string;
}

export interface SchemaValidation {
  ok: boolean;
  issues: SchemaIssue[];
  type: string;
}

const REQUIRED: Record<string, string[]> = {
  Article: ["headline", "author", "datePublished", "image"],
  BlogPosting: ["headline", "author", "datePublished", "image"],
  NewsArticle: ["headline", "author", "datePublished", "image"],
  WebSite: ["name", "url"],
  Organization: ["name", "url"],
  BreadcrumbList: ["itemListElement"],
  FAQPage: ["mainEntity"],
  Person: ["name"],
  VideoObject: ["name", "thumbnailUrl", "uploadDate"],
};

export const validateJsonLd = (schema: unknown): SchemaValidation => {
  const issues: SchemaIssue[] = [];
  if (!schema || typeof schema !== "object") {
    return {
      ok: false,
      issues: [{ severity: "error", field: "$", message: "Not a JSON object" }],
      type: "?",
    };
  }
  const s = schema as Record<string, unknown>;
  const context = s["@context"];
  const type = String(s["@type"] ?? "");

  if (context !== "https://schema.org" && context !== "http://schema.org") {
    issues.push({
      severity: "warning",
      field: "@context",
      message: "Should be https://schema.org",
    });
  }

  if (!type) {
    issues.push({
      severity: "error",
      field: "@type",
      message: "Missing @type",
    });
    return { ok: false, issues, type: "?" };
  }

  const required = REQUIRED[type];
  if (required) {
    for (const key of required) {
      if (!(key in s) || s[key] === undefined || s[key] === null || s[key] === "") {
        issues.push({
          severity: "error",
          field: key,
          message: `${type}.${key} is required`,
        });
      }
    }
  } else {
    issues.push({
      severity: "warning",
      field: "@type",
      message: `Unknown @type "${type}". Validator skipped field checks.`,
    });
  }

  if (type === "BreadcrumbList") {
    const items = Array.isArray(s.itemListElement) ? s.itemListElement : [];
    items.forEach((raw, i) => {
      const el = raw as Record<string, unknown>;
      if (el["@type"] !== "ListItem") {
        issues.push({
          severity: "error",
          field: `itemListElement[${i}].@type`,
          message: "Must be ListItem",
        });
      }
      if (!el.position) {
        issues.push({
          severity: "error",
          field: `itemListElement[${i}].position`,
          message: "Missing position",
        });
      }
    });
  }

  if (type === "FAQPage") {
    const mainEntity = Array.isArray(s.mainEntity) ? s.mainEntity : [];
    mainEntity.forEach((raw, i) => {
      const q = raw as Record<string, unknown>;
      if (!q.name) {
        issues.push({
          severity: "error",
          field: `mainEntity[${i}].name`,
          message: "Question missing name",
        });
      }
      const answer = q.acceptedAnswer as Record<string, unknown> | undefined;
      if (!answer?.text) {
        issues.push({
          severity: "error",
          field: `mainEntity[${i}].acceptedAnswer.text`,
          message: "Answer missing text",
        });
      }
    });
  }

  const errors = issues.filter((i) => i.severity === "error");
  return { ok: errors.length === 0, issues, type };
};
