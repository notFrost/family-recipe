import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DoodleField from "../components/DoodleField";
import PreviewFab from "../components/PreviewFab";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Show the design-preview shortcut everywhere EXCEPT the production
  // deployment (so real users never see it). VERCEL_ENV is "production" only on
  // the prod deployment; "preview" on branch builds; undefined locally.
  const showPreviewFab = process.env.VERCEL_ENV !== "production";

  return (
    <>
      {/* Faint food-doodle wallpaper, fixed behind every page. */}
      <DoodleField className="fixed" />
      <Navbar />
      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {children}
      </main>
      <Footer />
      {showPreviewFab ? <PreviewFab /> : null}
    </>
  );
}
