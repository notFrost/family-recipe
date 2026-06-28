import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/app/lib/auth";
import SignupForm from "@/app/components/SignupForm";
import ThemeToggle from "@/app/components/ThemeToggle";

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
          src="https://images.unsplash.com/photo-1610832958506-aa56368176cf"
          alt=""
          fill
          sizes="55vw"
          quality={80}
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-stone-950/80 via-stone-900/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-12 pb-16">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-lg shadow-lg">
              🍳
            </span>
            <span className="text-2xl font-bold tracking-tight text-white">
              Family Recipe
            </span>
          </div>
          <p className="max-w-xs text-lg font-light leading-relaxed text-white/85">
            Keep your family&apos;s recipes together, discover new ones, and pass
            them down — even after everyone moves out.
          </p>
        </div>
      </div>

      {/* Form panel. */}
      <div className="relative flex flex-1 flex-col items-center justify-center bg-background px-6 py-12 sm:px-10">
        <div className="absolute right-5 top-5">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-[420px]">
          <Link href="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-base shadow-sm">
              🍳
            </span>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Family Recipe
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
