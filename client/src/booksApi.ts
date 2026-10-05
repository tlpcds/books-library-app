import type { Owner } from "./types";

export async function fetchOwners(): Promise<Owner[]> {
  const apiBaseUrl = import.meta.env.VITE_API_URL ?? "";
  const response = await fetch(`${apiBaseUrl}/api/books`);

  if (!response.ok) {
    throw new Error(`Books could not be loaded (server returned ${response.status}).`);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("The books service returned an invalid response.");
  }

  const isOwner = (value: unknown): value is Owner => {
    if (typeof value !== "object" || value === null) {
      return false;
    }

    const owner = value as Record<string, unknown>;
    return (
      typeof owner.name === "string" &&
      typeof owner.age === "number" &&
      Array.isArray(owner.books) &&
      owner.books.every((book: unknown) => {
        if (typeof book !== "object" || book === null) {
          return false;
        }

        const candidate = book as Record<string, unknown>;
        return (
          typeof candidate.name === "string" &&
          (candidate.type === "Hardcover" ||
            candidate.type === "Paperback" ||
            candidate.type === "Ebook")
        );
      })
    );
  };

  const validatedOwners: Owner[] = [];
  for (const owner of data) {
    if (!isOwner(owner)) {
      throw new Error("The books service returned an invalid response.");
    }
    validatedOwners.push(owner);
  }

  return validatedOwners;
}
