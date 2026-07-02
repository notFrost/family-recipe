import { notFound } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DoodleField from "../components/DoodleField";
import PreviewSidebar from "../components/PreviewSidebar";
import { designReviewEnabled } from "../lib/design-review";

/**
 * Preview harness layout: the tool's collapsible sidebar on the left, and to its
 * right the REAL app chrome (Navbar + Footer) wrapping the page — so each style's
 * pages can be judged in their real context, not in isolation.
 *
 * The whole harness (every /preview route) is gated on the design-review flag:
 * 404 in production always, and 404 between review rounds when DESIGN_REVIEW=0.
 */
export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!designReviewEnabled()) {
    notFound();
  }
  return (
    <div className="min-h-screen">
      <PreviewSidebar />
      <div className="flex min-h-screen flex-col lg:pl-72">
        <DoodleField className="fixed" />
        <Navbar />
        <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
