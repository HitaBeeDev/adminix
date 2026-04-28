export function formatAccountDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getPaginationItems(currentPage: number, totalPages: number) {
  return Array.from({ length: totalPages }, (_, index) => index + 1)
    .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
    .reduce<(number | "...")[]>((items, page, index, pages) => {
      if (index > 0 && page - pages[index - 1] > 1) items.push("...");
      items.push(page);
      return items;
    }, []);
}
