import * as React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersectionObserver } from "usehooks-ts";
async function getData(page) {
  const resp = await fetch(
    `https://library-api.uidotdev.workers.dev/activity?page=${page}`
  );

  return resp.json();
}

function useActivities() {
  return useInfiniteQuery({
    queryKey: ["Activities"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getData(pageParam),
    maxPages: 5,
    getNextPageParam(lastPage, allPages, lastPageParam) {
      console.log("getNextPageParam", lastPage, allPages, lastPageParam);
      if (lastPage.length < 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }

      return firstPageParam - 1;
    },
  });
}

function ActivityFeed() {
  const rootRef = React.useRef(null);
  const { ref, entry } = useIntersectionObserver();
  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useActivities();
  console.log("ActivityFeed", data?.pages);

  React.useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage]);

  if (status === "pending") {
    return <div>...</div>;
  }
  if (status === "error") {
    return <div>Error fetching data 😔</div>;
  }

  const activities = data?.pages.flatMap((item) => item.activities);
  const hasResults = activities.length > 0;

  return (
    <section className="latest-activity">
      <h2>Latest activity</h2>
      {hasResults ? (
        <ol ref={rootRef} className="activities">
          {activities.map((activity, i, pages) => {
            return (
              <ActivityListItem
                ref={i === pages.length - 2 ? ref : null}
                key={i}
                activity={activity}
              />
            );
          })}
          {/* <NoMoreActivities
            onBackToTop={() => {
              rootRef.current.scrollTo({ top: 0, behavior: "smooth" });
            }}
          /> */}
        </ol>
      ) : null}
    </section>
  );
}

function ActivityListItem({ ref, activity }) {
  if (ref) {
    return <li ref={ref}>{activity.activityType}</li>;
  } else {
    return <li>{activity.activityType}</li>;
  }
}

export default function InfiniteExample() {
  return (
    <>
      <header className="app-header">
        <h1>
          <span>Query Library</span>
        </h1>
      </header>
      <main className="dashboard">
        <ActivityFeed />
      </main>
    </>
  );
}
