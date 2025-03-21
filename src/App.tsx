import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const BASE_URL = "https://library-api.uidotdev.workers.dev";
async function getData(): Promise<{
  title: string;
  authors: string[];
  thumbnail: string;
}> {
  const url = `${BASE_URL}/books/pD6arNyKyi8C`;

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

function usBook() {
  return useQuery({
    queryKey: ["test"],
    queryFn: getData,
  });
}

function Book() {
  const { data, isPending, error, isSuccess, status } = usBook();
  return (
    <div>
      <header className="app-header">
        <h1>
          <span>Query Library</span>
        </h1>
      </header>
      {isPending && <Loading></Loading>}
      {error && <ErrorComponent></ErrorComponent>}
      {isSuccess && (
        <main>
          <h2 className="book-title">{data.title}</h2>
          <p>By: {data.authors?.join(", ")}</p>
          {data.thumbnail && <img src={data.thumbnail} alt={data.title} />}
        </main>
      )}
    </div>
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
      <Book />;
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
