import { describe, expect, it } from "vitest";
import { groupBooks } from "./books";
import type { Owner } from "./types";

const owners: Owner[] = [
  {
    name: "Adult",
    age: 18,
    books: [
      { name: "zebra", type: "Paperback" },
      { name: "Alpha", type: "Hardcover" },
    ],
  },
  {
    name: "Child",
    age: 17,
    books: [
      { name: "Beta", type: "Hardcover" },
      { name: "alpha", type: "Ebook" },
    ],
  },
];

describe("groupBooks", () => {
  it("sorts all books alphabetically and assigns age 18 to adults", () => {
    const groups = groupBooks(owners, "all");

    expect(groups.adults.map((book) => book.name)).toEqual(["Alpha", "zebra"]);
    expect(groups.children.map((book) => book.name)).toEqual(["alpha", "Beta"]);
    expect(groups.adults[0]?.ownerName).toBe("Adult");
  });

  it("keeps hardcover books only in both categories", () => {
    const groups = groupBooks(owners, "hardcover");

    expect(groups.adults.map((book) => book.name)).toEqual(["Alpha"]);
    expect(groups.children.map((book) => book.name)).toEqual(["Beta"]);
  });

  it("preserves duplicate titles when different owners have copies", () => {
    const duplicateOwners: Owner[] = [
      { name: "One", age: 20, books: [{ name: "Hamlet", type: "Hardcover" }] },
      { name: "Two", age: 21, books: [{ name: "Hamlet", type: "Hardcover" }] },
    ];

    expect(groupBooks(duplicateOwners, "all").adults).toHaveLength(2);
  });
});
