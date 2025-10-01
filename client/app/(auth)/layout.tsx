export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">{children}</div>
      </main>
    </>
  );
}
