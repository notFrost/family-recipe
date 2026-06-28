import { redirect } from "next/navigation";
import Image from "next/image";
import { getSession } from "@/app/lib/auth";
import LoginForm from "@/app/components/LoginForm";

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const session = await getSession();
  if (session?.user?.id) {
    redirect("/");
  }

  const { callbackUrl } = await searchParams;
  const callback = typeof callbackUrl === "string" ? callbackUrl : "/";

  return (
    <div className="flex min-h-screen w-full">
      {/* ── Left: decorative image panel (hidden on mobile) ── */}
      <div className="relative hidden lg:block lg:w-[55%] shrink-0">
        <Image
          src="https://images.unsplash.com/photo-1610832958506-aa56368176cf"
          alt=""
          fill
          sizes="55vw"
          quality={80}
          preload
          style={{ objectFit: "cover" }}
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/70 via-zinc-900/40 to-transparent" />
        {/* Brand tagline */}
        <div className="absolute inset-0 flex flex-col justify-end p-12 pb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-lg font-bold text-white shadow-lg">
              R
            </span>
            <span className="text-2xl font-semibold tracking-tight text-white">
              Recipes
            </span>
          </div>
          <p className="text-lg font-light text-white/80 leading-relaxed max-w-xs">
            Cook. Share. Discover.
          </p>
        </div>
      </div>

      {/* ── Right: form panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-12 sm:px-10">
        <div className="w-full max-w-[420px]">
          {/* Heading */}
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              Welcome back
            </h1>
            <p className="text-base text-zinc-600">
              Sign in to add and manage your recipes.
            </p>
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <LoginForm callbackUrl={callback} />
          </div>
        </div>
      </div>
    </div>
  );
}
