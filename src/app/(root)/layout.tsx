import { SessionProvider } from "next-auth/react";
import NavBar from "../../components/NavBar";
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
          <div className="flex flex-col min-h-screen bg-background">
            <div className="w-full mt-4 flex flex-col justify-center items-center">
              {children}
            </div>
          </div>
        </Providers>
      </main>
    </SessionProvider>
  );
}
