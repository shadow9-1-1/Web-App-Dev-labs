import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
        Checkout Canceled
      </h1>
      <p className="max-w-xl text-base text-zinc-700 dark:text-zinc-300">
        No payment was captured. You can return home and try checkout again
        at any time.
      </p>
      <Link
        href="/"
        className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        Back to Home
      </Link>
    </main>
  );
}
