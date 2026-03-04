import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import Alerts from "./pages/Alerts";
import Charts from "./pages/Charts";
import DeveloperAPI from "./pages/DeveloperAPI";
import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Tools from "./pages/Tools";

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-usa-white">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors position="top-center" />
    </div>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const apiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/developer-api",
  component: DeveloperAPI,
});

const chartsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/charts",
  component: Charts,
});

const alertsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/alerts",
  component: Alerts,
});

const toolsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tools",
  component: Tools,
});

const learnRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/learn",
  component: Learn,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  apiRoute,
  chartsRoute,
  alertsRoute,
  toolsRoute,
  learnRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
