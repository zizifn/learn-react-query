import { useQueries } from "@tanstack/react-query";
import React from "react";

function useBookDetails(bookId) {
  const results = useQueries({
    queries: [
      {
        queryKey: ["books", bookId],
        queryFn: async () => {
          const bookResp = await fetch(
            `https://library-api.uidotdev.workers.dev/books/${bookId}`
          );

          return await bookResp.json();
        },
      },
      {
        queryKey: ["reviews", bookId],
        queryFn: async () => {
          const reviewsResp = await fetch(
            `https://library-api.uidotdev.workers.dev/reviews/${bookId}`
          );

          return await reviewsResp.json();
        },
      },
    ],

    // combine(result) {
    //   return {};
    // },
  });

  console.log(results);

  return {
    isPending: results.every((result) => result.isPending),
    isError: results.every((result) => result.isError),
    book: results[0].data,
    reviews: results[1].data,
  };
}

function Book({ bookId }) {
  const { isPending, isError, reviews, book } = useBookDetails(bookId);

  console.log("-----", isPending, isError, reviews, book);

  return (
    <main className="book-detail">
      <div>
        <span className="book-cover">
          <img src={book?.thumbnail} alt={book?.title} />
        </span>
        {reviews &&
          reviews.map((review) => {
            return <p>{review.title}</p>;
          })}
      </div>
      <div></div>
    </main>
  );
}

export default function BookReview() {
  const [selectedBookId, setSelectedBookId] = React.useState("pD6arNyKyi8C");

  return (
    <div>
      <header className="app-header">
        <h1>
          <span>Query Library</span>
        </h1>
        <div className="select">
          <select
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
          >
            <option value="pD6arNyKyi8C">The Hobbit</option>
            <option value="aWZzLPhY4o0C">The Fellowship Of The Ring</option>
            <option value="12e8PJ2T7sQC">The Two Towers</option>
            <option value="WZ0f_yUgc0UC">The Return Of The King</option>
          </select>
        </div>
      </header>

      <Book bookId={selectedBookId} />
    </div>
  );
}
