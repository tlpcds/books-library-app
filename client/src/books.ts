import type { ListedBook, Owner } from "./types";

export type BookFilter = "all" | "hardcover";
export type BookCategory = "adults" | "children";
export type GroupedBooks = Record<BookCategory, ListedBook[]>;

export function groupBooks(owners: Owner[], filter: BookFilter): GroupedBooks {
  const groups: GroupedBooks = { adults: [], children: [] };

  for (const owner of owners) {
    const category = owner.age >= 18 ? "adults" : "children";

    for (const book of owner.books) {
      if (filter === "hardcover" && book.type !== "Hardcover") {
        continue;
      }

      groups[category].push({ ...book, ownerName: owner.name });
    }
  }

  const sortBooks = (left: ListedBook, right: ListedBook) =>
    left.name.localeCompare(right.name, "en", { sensitivity: "base" }) ||
    left.ownerName.localeCompare(right.ownerName, "en", { sensitivity: "base" });

  groups.adults.sort(sortBooks);
  groups.children.sort(sortBooks);

  return groups;
}
