import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import ActivityFeedWrapper from "./components/Activity";
import Review from "./components/Review";

const BASE_URL = "https://library-api.uidotdev.workers.dev";
async function getData(id: string): Promise<{
  title: string;
  authors: string[];
  thumbnail: string;
}> {
  const url = `${BASE_URL}/books/${id}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("unable to get data");
    }
    return res.json();
  } catch (error) {
    throw error;
  }
}

function usBook(id: string) {
  return useQuery({
    queryKey: ["book", { id }],
    queryFn: () => getData(id),
    // staleTime: 5000,
    gcTime: 5000,
  });
}

function Book() {
  const [selectedBookId, setSelectedBookId] = useState("pD6arNyKyi8C");

  const {
    data,
    isPending,
    refetch,
    isRefetching,
    isStale,
    error,
    isSuccess,
    status,
    fetchStatus,
  } = usBook(selectedBookId);

  console.log("status", status);

  console.log("isStale", isStale);
  return (
    <div>
      <header className="app-header">
        <h1>
          <span>Query Library</span>
        </h1>
        fetchStatus: {fetchStatus}--status {status}
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
      {isPending && <Loading></Loading>}
      {error && <ErrorComponent></ErrorComponent>}
      {isSuccess && (
        <main>
          <h2 className="book-title">{data.title}</h2>
          <p>By: {data.authors?.join(", ")}</p>
          <div>
            <button className="primary">Check Out</button>
          </div>
          {isRefetching && <p>BackgroundUpdateInProgress </p>}
          {!isStale && !isRefetching && <p>up to date</p>}
          {isStale && <StaleMessage refetch={refetch}></StaleMessage>}
          {data.thumbnail && <img src={data.thumbnail} alt={data.title} />}
        </main>
      )}
    </div>
  );
}

function StaleMessage({ refetch }) {
  return (
    <>
      <p>
        Data is stale
        <button onClick={refetch}>refersh data</button>
      </p>
    </>
  );
}
function Loading() {
  return <main>Loading...</main>;
}

function ErrorComponent() {
  return <main>Woops there was an error...</main>;
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <Book /> */}
      {/* <ActivityFeedWrapper></ActivityFeedWrapper> */}
      <Review></Review>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
