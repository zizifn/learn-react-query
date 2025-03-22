import * as React from "react";
import { useQuery } from "@tanstack/react-query";

async function getActivity() {
  try {
    const userActivitiesEsp = await fetch(
      "https://library-api.uidotdev.workers.dev/activity"
    );
    if (!userActivitiesEsp.ok) {
      throw new Error("error");
    }

    return await userActivitiesEsp.json();
  } catch (err) {
    throw err;
  }
}

function useActivities() {
  return useQuery({
    queryKey: ["activity"],
    queryFn: getActivity,
    refetchInterval: 5000,
  });
}

function ActivityFeed() {
  const { data, status, dataUpdatedAt, isSuccess, isRefetching } =
    useActivities();

  if (status === "pending") {
    return <p>loading..........</p>;
  }
  const time = new Date(dataUpdatedAt).toString();
  return (
    <section className="latest-activity">
      {isRefetching && <p>refetching</p>}
      <h2>Latest activity as of {time} </h2>
      {isSuccess && <ActivityList data={data} />}
    </section>
  );
}

function ActivityList({ data }) {
  return (
    <>
      {" "}
      {data?.activities.map((item) => {
        return (
          <p key={item.activityId}>
            {item.activityId}: {item.activityType} joined
          </p>
        );
      })}
    </>
  );
}

export default function ActivityFeedWrapper() {
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
