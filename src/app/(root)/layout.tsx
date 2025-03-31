import NavBar from "../../components/NavBar";
import Providers from "@/components/Providers";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
      <Providers>
        <NavBar />
        <div className="flex flex-col min-h-screen bg-background">
          <div className="w-10/12 mx-auto mt-4 flex flex-col">{children}</div>
        </div>
      </Providers>
    </main>
  );
}
