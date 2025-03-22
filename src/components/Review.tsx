import * as React from "react";

import { useQuery } from "@tanstack/react-query";

async function getReview() {
  const reviewresp = await fetch(
    `https://library-api.uidotdev.workers.dev/reviews`
  );

  return await reviewresp.json();
}

async function getBookbyID(bookid) {
  const reviewresp = await fetch(
    `https://library-api.uidotdev.workers.dev/books/${bookid}`
  );

  return await reviewresp.json();
}

function Loading() {
  return <p>loading....</p>;
}

function Error() {
  return <p>Error....</p>;
}

function useReview() {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: () => getReview(),
  });
}

function useBookDetails(bookID) {
  return useQuery({
    queryKey: ["books", { bookID }],
    queryFn: () => {
      return getBookbyID(bookID);
    },
    enabled: !!bookID,
  });
}

function BookCover({ bookid }) {
  console.log("BookCover", bookid);
  const bookQuery = useBookDetails(bookid);
  if (bookQuery.isSuccess) {
    return (
      <div>
        <span className="book-cover">
          <img src={bookQuery.data.thumbnail} alt={bookQuery.data.title} />
        </span>
      </div>
    );
  }

  return <></>;
}

function ReviewDetail() {
  const reviewQuery = useReview();

  if (reviewQuery.error) {
    return <Error />;
  }

  if (reviewQuery.isSuccess && reviewQuery.data) {
    return (
      <>
        {reviewQuery.data.map((item) => {
          return (
            <main className="book-detail">
              <BookCover bookid={item.bookId}></BookCover>

              <div className="reviews">
                <h2>Review</h2>
                <ul>
                  <li key={item.reviewId}>
                    <h3>{item.title}</h3>
                    <small>by Anonymous</small>
                    <span className="book-rating">{item.rating}</span>
                    <p>{item.text}</p>
                  </li>
                </ul>
              </div>
            </main>
          );
        })}
      </>
    );
  }

  return <Loading />;
}

export default function Review() {
  return (
    <div>
      <header className="app-header">
        <h1>
          <span>Query Library</span>
        </h1>
      </header>
      <ReviewDetail />
    </div>
  );
}
