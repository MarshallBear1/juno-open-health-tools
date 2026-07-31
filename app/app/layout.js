export const metadata = {
  title: "Juno Health Tools",
  description: "Free tools for clearer symptom notes and appointment preparation."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: "#14201d", background: "#f4f7f5" }}>
        {children}
      </body>
    </html>
  );
}

