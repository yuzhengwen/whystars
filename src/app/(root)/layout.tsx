import { SessionProvider } from "next-auth/react";
import NavBar from "../../components/navbar/NavBar";
import Providers from "@/components/Providers";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SessionProvider>
      <main suppressHydrationWarning>
        <Providers>
          <header className="w-full border-b">
            <NavBar />
          </header>
          <div className="flex flex-col min-h-screen bg-background pt-4">
              {children}
          </div>
        </Providers>
      </main>
    </SessionProvider>
  );
}
