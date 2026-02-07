import './globals.css';

export const metadata = {
  title: 'Hackathon Tool',
  description: 'Collaborate, communicate, and showcase your hackathon project',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
