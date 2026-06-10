import "./globals.css";

export const metadata = {
  title: "Graph Hierarchy Explorer | SIT Challenge",
  description:
    "Visualize node hierarchies, detect cycles, and analyze graph structures interactively.",
  keywords: ["graph", "hierarchy", "tree", "cycle detection", "SIT"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
