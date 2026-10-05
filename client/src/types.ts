export type BookFormat = "Hardcover" | "Paperback" | "Ebook";

export interface Book {
  name: string;
  type: BookFormat;
}

export interface Owner {
  name: string;
  age: number;
  books: Book[];
}

export interface ListedBook extends Book {
  ownerName: string;
}
