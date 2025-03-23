import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";

async function getData(searchTerm, page) {
  const resp = await fetch(
    `https://library-api.uidotdev.workers.dev/books/search?q=${searchTerm}&page=${page}`
  );

  return await resp.json();
}

function useSearch(searchTerm, page) {
  const queryClient = useQueryClient();
  React.useEffect(() => {
    console.log("effect", page);
    queryClient.prefetchQuery({
      queryKey: ["search", searchTerm, page + 1],
      queryFn: () => getData(searchTerm, page + 1),
      staleTime: 3000,
    });
  }, [searchTerm, page, queryClient]);

  return useQuery({
    queryKey: ["search", searchTerm, page],
    queryFn: () => getData(searchTerm, page),
    enabled: !!searchTerm,
    staleTime: 3000,
    placeholderData: (previousData) => previousData,
  });
}

function BookList({ books, isPlaceholderData }) {
  return (
    <ul className={isPlaceholderData ? "opacity-book" : ""}>
      {books?.map((book) => {
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

function Pagination({ totalPages, activePage, setActivePage }) {
  const ref = React.useRef<HTMLUListElement>(null);

  // const queryClient = useQueryClient();
  // function hoverBtn(index) {

  // }

  function nextItem(index) {
    ref.current?.children[index].scrollIntoView();

    setActivePage(index);
  }
  return (
    <div className="pagination-contianer">
      <button>previous</button>
      <ul ref={ref} className="">
        {new Array(100).fill(0).map((item, index) => {
          return (
            <li key={index}>
              <button className={index == activePage ? "active" : ""}>
                {index + 1}
              </button>
            </li>
          );
        })}
      </ul>
      <button onClick={() => nextItem(activePage + 1)}>next</button>
    </div>
  );
}

function PaginatedBookList({ searchTerm }) {
  const [activePage, setActivePage] = React.useState(1);
  const { data, status, isPlaceholderData } = useSearch(searchTerm, activePage);

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
            activePage={activePage}
            setActivePage={() => {
              setActivePage(activePage + 1);
            }}
          />
        </header>
        <BookList isPlaceholderData={isPlaceholderData} books={data.books} />
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
export default function PaginationSample() {
  const [search, setSearch] = React.useState("");
  return (
    <div>
      <header className="app-header">
        <h1>
          <span>Query Library</span>
        </h1>
      </header>
      <main>
        <input
          type="text"
          name=""
          id=""
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <PaginatedBookList searchTerm={search} />
      </main>
    </div>
  );
}
