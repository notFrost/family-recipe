import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DoodleField from "../components/DoodleField";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Faint food-doodle wallpaper, fixed behind every page. */}
      <DoodleField className="fixed" />
      <Navbar />
      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
