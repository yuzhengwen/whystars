import NavBar from "../../components/NavBar";
import Providers from "@/components/Providers";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
      <Providers>
        <header className="w-full border-b">
          <NavBar />
        </header>
        <div className="flex flex-col min-h-screen bg-background">
          <div className="w-full mx-auto mt-4 flex flex-col">{children}</div>
        </div>
      </Providers>
    </main>
  );
}
