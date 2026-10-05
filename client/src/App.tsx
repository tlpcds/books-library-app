import { useState } from "react";
import { fetchOwners } from "./booksApi";
import { groupBooks, type BookCategory, type BookFilter } from "./books";
import type { Owner } from "./types";
import "./styles.css";

type LoadState = "idle" | "loading" | "loaded" | "error";

const categoryNames: Record<BookCategory, string> = {
  adults: "Adults",
  children: "Children",
};

function App() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [filter, setFilter] = useState<BookFilter | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function loadBooks(nextFilter: BookFilter) {
    setLoadState("loading");
    setFilter(nextFilter);
    setErrorMessage("");

    try {
      const data = await fetchOwners();
      setOwners(data);
      setLoadState("loaded");
    } catch (error) {
      setLoadState("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Books could not be loaded. Please try again.",
      );
    }
  }

  const groupedBooks = groupBooks(owners, filter ?? "all");
  const hasBooks = groupedBooks.adults.length + groupedBooks.children.length > 0;
  const isHardcover = filter === "hardcover";

  return (
    <div className="app-shell">
      <header className="topbar">
      </header>

      <main>
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow">THE BOOK LIBRARY</p>
        </section>

        <section className="collection-panel" aria-label="Book collection">
          <div className="panel-heading">
            <div>
              <h2>Owners and Books</h2>
            </div>
            {loadState === "loaded" && hasBooks && (
              <span className="collection-count">
                {groupedBooks.adults.length + groupedBooks.children.length}{" "}
                {isHardcover ? "hardcover " : ""}
                {groupedBooks.adults.length + groupedBooks.children.length === 1
                  ? "book"
                  : "books"}
              </span>
            )}
          </div>

          
          <div className="results" aria-live="polite" aria-busy={loadState === "loading"}>
            {loadState === "idle" && (
              <div className="empty-state">
                <span className="empty-illustration" aria-hidden="true">
                  <svg viewBox="0 0 80 64" fill="none">
                    <path d="M11 17c0-3 2.4-5 5.5-5H37v38H16.5C13.5 50 11 52 11 55V17Z" />
                    <path d="M69 17c0-3-2.4-5-5.5-5H43v38h20.5c3 0 5.5 2 5.5 5V17Z" />
                    <path d="M16 20h15M16 27h15M49 20h15M49 27h15" />
                    <path d="M40 11v43" />
                  </svg>
                </span>
                <h3>Your next favorite is in here</h3>
                <p>Select an option above to browse the collection.</p>
              </div>
            )}

            {loadState === "loading" && (
              <div className="status-message" role="status">
                <span className="spinner" aria-hidden="true" />
                Loading the collection…
              </div>
            )}

            {loadState === "error" && (
              <div className="error-message" role="alert">
                <p>{errorMessage}</p>
                <button
                  className="text-button"
                  type="button"
                  onClick={() => void loadBooks(filter ?? "all")}
                >
                  Try again
                </button>
              </div>
            )}

            {loadState === "loaded" && !hasBooks && (
              <div className="empty-state compact-empty">
                <h3>No books in this collection yet</h3>
                <p>Try another view to see what readers have shared.</p>
              </div>
            )}

            {loadState === "loaded" && hasBooks && (
              <div className="category-grid">
                {(["adults", "children"] as const).map((category) => {
                  const books = groupedBooks[category];
                  const heading = isHardcover
                    ? `Books owned by ${categoryNames[category]}`
                    : `Books owned by ${categoryNames[category]}`;

                  return (
                    <section
                      className="category-card"
                      key={category}
                      aria-labelledby={`${category}-heading`}
                    >
                      <div className="category-heading">
                        <div>
                          <span className={`category-dot ${category}`} aria-hidden="true" />
                          <h3 id={`${category}-heading`}>{heading}</h3>
                        </div>
                        <span className="category-total">{books.length}</span>
                      </div>
                      {books.length === 0 ? (
                        <p className="category-empty">No books in this category.</p>
                      ) : (
                        <ul className="book-list">
                          {books.map((book, index) => (
                            <li className="book-item" key={`${category}-${book.name}-${book.ownerName}-${index}`}>
                              <span className="book-cover" aria-hidden="true">
                                <span />
                              </span>
                              <span className="book-details">
                                <span className="book-title">{book.name}</span>
                                <span className="book-owner">Owned by {book.ownerName}</span>
                              </span>
                              <span className="book-format">{book.type}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>
                  );
                })}
              </div>
            )}
          </div>
          <div className="action-row">
            <button
              className="button button-primary"
              type="button"
              onClick={() => void loadBooks("all")}
              disabled={loadState === "loading"}
            >
              <span>Get Books</span>
              <span className="button-arrow" aria-hidden="true">
                →
              </span>
            </button>
            <button
              className="button button-secondary"
              type="button"
              onClick={() => void loadBooks("hardcover")}
              disabled={loadState === "loading"}
            >
              <span className="hardcover-icon" aria-hidden="true">
                ▤
              </span>
              Hardcover only
            </button>
          </div>

        </section>
      </main>

      <footer className="footer">
      </footer>
    </div>
  );
}

export default App;
