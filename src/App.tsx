import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

async function getData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        title: "The Hobbit",
        authors: ["J.R.R. Tolkien"],
        thumbnail: "https://ui.dev/images/courses/query/hobbit.jpg",
      });
    }, 1000);
  });
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
      {error && <Error></Error>}
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

function Error() {
  return <main>Woops there was an error...</main>;
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Book />;
    </QueryClientProvider>
  );
}
