import * as React from "react";

function useSearch() {
  return {
    data: [],
    status: "pending",
  };
}

function BookList({ books }) {
  return (
    <ul>
      {books.map((book) => {
        return (
          <li key={book.id}>
            <span className="book-cover">
              <img src={book.thumbnail} alt={book.title} />
            </span>
            <h3 className="book-title">{book.title}</h3>
            <small className="book-author">{book.authors.join(", ")}</small>
            <span className="book-rating">book.averageRating</span>
          </li>
        );
      })}
    </ul>
  );
}

function PaginatedBookList() {
  const { data, status } = useSearch();

  if (status === "pending") {
    return <Loading />;
  }

  if (status === "error") {
    return <ErrorMessage />;
  }

  return (
    <section className="search-results book-grid">
      <div>
        <header>
          <h2>
            Search results for <strong>{searchTerm}</strong>
          </h2>
          <Pagination
            totalPages={100}
            activePage={1}
            setActivePage={() => {}}
          />
        </header>
        <BookList books={data.books} />
      </div>
    </section>
  );
}
function Loading() {
  return <p>loading....</p>;
}

function ErrorMessage() {
  return <p>Error....</p>;
}
export default function Pagination() {
  return (
    <div>
      <header className="app-header">
        <h1>
          <span>Query Library</span>
        </h1>
      </header>
      <main>
        <PaginatedBookList />
      </main>
    </div>
  );
}
