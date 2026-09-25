import { createFileRoute } from "@tanstack/react-router";

import { HomePage, prefetchRecentProjectStars } from "@/features/home";

export const Route = createFileRoute("/")({
  loader: () => {
    // Fire-and-forget: warm GitHub stars cache without blocking navigation.
    prefetchRecentProjectStars();
  },
  component: Home,
});

function Home() {
  return <HomePage />;
}
