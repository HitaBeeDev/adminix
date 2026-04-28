import { SEGMENT_LABELS } from "./topbar.constants";

export function buildBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const path = "/" + segments.slice(0, index + 1).join("/");
    const label = SEGMENT_LABELS[segment]
      ? SEGMENT_LABELS[segment]
      : segments[index - 1] === "users"
        ? "User Detail"
        : segments[index - 1] === "accounts"
          ? "Account Detail"
          : "Detail";

    return { label, path };
  });
}

export function getTopbarTitle(pathname: string) {
  const breadcrumbs = buildBreadcrumbs(pathname);
  const pageLabel = breadcrumbs.at(-1)?.label;

  return pageLabel ? `Adminix — ${pageLabel}` : "Adminix";
}
