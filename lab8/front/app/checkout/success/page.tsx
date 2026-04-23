import Link from "next/link";

type SuccessPageProps = {
  searchParams?: Promise<{ session_id?: string }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const params = (await searchParams) || {};

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <h1 className="text-3xl font-semibold text-green-700">Payment Successful</h1>
      <p className="max-w-xl text-base text-zinc-700 dark:text-zinc-300">
        Your Premium Ghost Status purchase is complete. Stripe confirmed the
        payment in test mode.
      </p>
      {params.session_id ? (
        <p className="rounded-md bg-zinc-100 px-3 py-2 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
          Session ID: {params.session_id}
        </p>
      ) : null}
      <Link
        href="/"
        className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        Back to Home
      </Link>
    </main>
  );
}
