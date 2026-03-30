export const metadata = {
  title: "QD Calculator",
  description: "Quiet Dissent ROI Calculator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
