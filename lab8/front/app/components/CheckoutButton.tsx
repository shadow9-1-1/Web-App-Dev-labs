"use client";

import { useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function CheckoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const buttonText = useMemo(
    () => (isLoading ? "Redirecting..." : "Buy Premium Ghost Status - $9.99"),
    [isLoading]
  );

  const handleCheckout = async () => {
    setErrorMessage("");
    setIsLoading(true);

    try {
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
      }

      const response = await fetch("/create-checkout-session", {
        method: "POST",
      });

      const data = (await response.json()) as {
        sessionId?: string;
        error?: string;
      };

      if (!response.ok || !data.sessionId) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe.js failed to initialize");
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong during checkout";
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isLoading}
        className="h-12 rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        {buttonText}
      </button>
      {errorMessage ? (
        <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
      ) : null}
    </div>
  );
}
