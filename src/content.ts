const VINTED_BASE_URL = "https://www.vinted.pt/catalog";

const VINTED_LANGUAGES = {
  portuguese: {
    label: "🇵🇹 Vinted",
    languageBookId: "6442",
  },
  english: {
    label: "🇬🇧 Vinted",
    languageBookId: "6435",
  },
} as const;

function getCellValue(row: HTMLTableRowElement, field: string): string {
  const cell = row.querySelector<HTMLElement>(`td.field.${field}`);

  if (!cell) {
    return "";
  }

  const value = cell.querySelector<HTMLElement>(".value");

  if (!value) {
    return "";
  }

  return value.textContent?.trim() ?? "";
}

function createVintedUrl(searchText: string, languageBookId: string): string {
  const params = new URLSearchParams();

  params.set("search_text", searchText);
  params.append("catalog[]", "2312");
  params.set("order", "price_low_to_high");
  params.append("language_book_ids[]", languageBookId);

  return `${VINTED_BASE_URL}?${params.toString()}`;
}

function createLink(label: string, searchText: string, languageBookId: string): HTMLAnchorElement {
  const link = document.createElement("a");

  link.href = createVintedUrl(searchText, languageBookId);
  link.textContent = label;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  link.className = "goodreads-vinted-link";

  return link;
}

function addVintedLinks(cell: HTMLElement, searchText: string): void {
  if (!searchText) {
    return;
  }

  // Prevent duplicate links if this row is processed again.
  if (cell.querySelector(".goodreads-vinted-links")) {
    return;
  }

  const linksContainer = document.createElement("div");
  linksContainer.className = "goodreads-vinted-links";

  for (const language of Object.values(VINTED_LANGUAGES)) {
    const link = createLink(language.label, searchText, language.languageBookId);

    linksContainer.appendChild(link);
  }

  cell.appendChild(linksContainer);
}

function processRow(row: HTMLTableRowElement): void {
  if (!row.classList.contains("review")) {
    return;
  }

  /*
   * Author links
   */
  const authorCell = row.querySelector<HTMLElement>("td.field.author");

  if (authorCell) {
    const author = getCellValue(row, "author");

    addVintedLinks(authorCell, author);
  }

  /*
   * ISBN-13 links
   */
  const isbn13Cell = row.querySelector<HTMLElement>("td.field.isbn13");

  if (isbn13Cell) {
    const isbn13 = getCellValue(row, "isbn13");

    if (isbn13) {
      addVintedLinks(isbn13Cell, isbn13);
    }
  }
}

function processAllRows(): void {
  const rows = document.querySelectorAll<HTMLTableRowElement>("tr.bookalike.review");

  for (const row of rows) {
    processRow(row);
  }
}

function observePage(): void {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) {
          continue;
        }

        if (node.matches("tr.bookalike.review")) {
          processRow(node);
        }

        const rows = node.querySelectorAll<HTMLTableRowElement>("tr.bookalike.review");

        for (const row of rows) {
          processRow(row);
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function addStyles(): void {
  if (document.getElementById("goodreads-vinted-links-style")) {
    return;
  }

  const style = document.createElement("style");

  style.id = "goodreads-vinted-links-style";

  style.textContent = `
    .goodreads-vinted-links {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-top: 4px;
      line-height: 1.4;
    }

    .goodreads-vinted-link {
      display: block;
      white-space: nowrap;
    }
  `;

  document.head.appendChild(style);
}

function main(): void {
  addStyles();
  processAllRows();
  observePage();
}

main();
