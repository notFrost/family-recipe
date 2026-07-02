import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DoodleField from "../components/DoodleField";
import PreviewCta from "../components/PreviewCta";
import { designReviewEnabled } from "../lib/design-review";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The "Review designs" CTA shows only during design-review rounds (see
  // app/lib/design-review.ts — never in prod; DESIGN_REVIEW=0 mutes it
  // between rounds). It lives here, not in the shared preview layout, so it
  // never renders inside /preview itself.
  const showPreviewCta = designReviewEnabled();

  return (
    <>
      {/* Faint food-doodle wallpaper, fixed behind every page. */}
      <DoodleField className="fixed" />
      <Navbar />
      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {children}
      </main>
      <Footer />
      {showPreviewCta ? <PreviewCta /> : null}
    </>
  );
}
