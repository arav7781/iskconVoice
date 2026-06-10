import "./globals.css";

export const metadata = {
  title: "Graph Hierarchy Explorer | SIT Challenge",
  description: "Visualize complex data hierarchies with our tactile neomorphic graph engine.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body-lg text-body-lg min-h-screen flex flex-col relative overflow-x-hidden custom-scrollbar">
        {children}
      </body>
    </html>
  );
}
