import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/app/lib/auth";
import BrandMark from "@/app/components/BrandMark";
import SignupForm from "@/app/components/SignupForm";
import ThemeToggle from "@/app/components/ThemeToggle";
import DoodleField from "@/app/components/DoodleField";

export default async function SignupPage() {
  const session = await getSession();
  if (session?.user?.id) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Decorative image panel (hidden on mobile). */}
      <div className="relative hidden shrink-0 lg:block lg:w-[55%]">
        <Image
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80&auto=format&fit=crop"
          alt=""
          fill
          sizes="55vw"
          quality={80}
          preload
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#241a12]/85 via-[#3b2417]/45 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-12 pb-16">
          <Link href="/" className="mb-4 flex w-fit items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-lg text-primary-foreground shadow-lg">
              <BrandMark className="h-6 w-6" />
            </span>
            <span className="text-2xl font-bold tracking-tight text-white">
              Kitchen Heirloom
            </span>
          </Link>
          <p className="max-w-xs text-lg font-light leading-relaxed text-white/85">
            Keep your family&apos;s recipes together, discover new ones, and pass
            them down — even after everyone moves out.
          </p>
        </div>
      </div>

      {/* Form panel. */}
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-background px-6 py-12 sm:px-10">
        <DoodleField className="absolute" />
        <div className="absolute right-5 top-5 z-10">
          <ThemeToggle />
        </div>
        <div className="relative z-10 w-full max-w-[420px]">
          <Link href="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-base text-primary-foreground shadow-sm">
              <BrandMark className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Kitchen Heirloom
            </span>
          </Link>

          <div className="mb-8 flex flex-col gap-2">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Welcome
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Create your account
            </h1>
            <p className="text-base text-muted-foreground">
              Join the table and start sharing recipes with your family.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}
