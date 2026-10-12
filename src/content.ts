import "./styles.css";

const VINTED_BASE_URL = "https://www.vinted.pt/catalog";

const LANGUAGES = [
  { label: "🇬🇧 Vinted", languageBookId: "6435" },
  { label: "🇵🇹 Vinted", languageBookId: "6442" },
] as const;

function buildVintedUrl(searchText: string, languageBookId: string): string {
  const params = new URLSearchParams();

  params.set("search_text", searchText);
  params.append("catalog[]", "2312");
  params.set("order", "price_low_to_high");
  params.append("language_book_ids[]", languageBookId);

  return `${VINTED_BASE_URL}?${params.toString()}`;
}

function makeLinks(searchText: string): HTMLDivElement | null {
  const query = searchText.trim();
  if (!query) return null;

  const container = document.createElement("div");
  container.className = "goodreads-vinted-links";
  container.setAttribute("aria-label", "Search this book on Vinted");

  for (const language of LANGUAGES) {
    const link = document.createElement("a");

    link.className = "goodreads-vinted-link";
    link.href = buildVintedUrl(query, language.languageBookId);
    link.textContent = language.label;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.title = `Search Vinted for “${query}”`;

    container.append(link);
  }

  return container;
}

function addLinks(cell: HTMLElement | null, searchText: string, key: string): void {
  if (!cell || cell.querySelector(`:scope > .value > .goodreads-vinted-links[data-vinted-for="${key}"]`)) {
    return;
  }

  const links = makeLinks(searchText);
  if (!links) return;

  links.dataset.vintedFor = key;

  const value = cell.querySelector<HTMLElement>(":scope > .value");

  if (value) {
    value.append(links);
  } else {
    cell.append(links);
  }
}

function cellText(row: HTMLTableRowElement, field: string): string {
  const value = row.querySelector<HTMLElement>(`td.field.${field} .value`);

  return value?.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

function titleWithoutSeries(row: HTMLTableRowElement): string {
  const titleLink = row.querySelector<HTMLAnchorElement>("td.field.title .value > a");

  if (!titleLink) return "";

  // Goodreads renders the series suffix in a separate span.
  // Read only direct text nodes to exclude that suffix.
  return Array.from(titleLink.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent ?? "")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function processRow(row: HTMLTableRowElement): void {
  if (!row.matches("tr.bookalike.review")) return;

  addLinks(row.querySelector<HTMLElement>("td.field.author"), cellText(row, "author"), "author");

  addLinks(row.querySelector<HTMLElement>("td.field.title"), titleWithoutSeries(row), "title");

  const isbn13 = cellText(row, "isbn13");

  if (isbn13) {
    addLinks(row.querySelector<HTMLElement>("td.field.isbn13"), isbn13, "isbn13");
  }
}

function processNode(node: Node): void {
  if (!(node instanceof Element)) return;

  if (node.matches("tr.bookalike.review") && node instanceof HTMLTableRowElement) {
    processRow(node);
  }

  node.querySelectorAll<HTMLTableRowElement>("tr.bookalike.review").forEach(processRow);
}

function init(): void {
  document.querySelectorAll<HTMLTableRowElement>("tr.bookalike.review").forEach(processRow);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(processNode);

      if (mutation.target instanceof Element) {
        const row = mutation.target.closest<HTMLTableRowElement>("tr.bookalike.review");

        if (row) processRow(row);
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, {
    once: true,
  });
} else {
  init();
}
