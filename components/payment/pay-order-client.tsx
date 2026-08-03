"use client";

import * as React from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Card } from "@/components/ui/card";
import { CheckoutForm } from "@/components/payment/checkout-form";
import { formatCurrency, formatDate } from "@/lib/utils";
import { paymentApi, rentalApi, showApiError } from "@/lib/api-service";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "pk_test_placeholder"
);

// Stripe's Payment Element renders in its own iframe and ignores our
// Tailwind classes entirely — by default it uses Stripe's light theme
// (white panels, dark text), which looks jarring dropped into this
// dark "Field Journal" UI. This maps it onto the same design tokens
// (globals.css can't be reached from inside the iframe, so the hex
// values are duplicated here on purpose).
const stripeAppearance: StripeElementsOptions["appearance"] = {
  theme: "night",
  variables: {
    colorPrimary: "#4f8f6d", // --moss
    colorBackground: "#16262d", // --paper-dim
    colorText: "#f4f7f6", // --ink
    colorTextSecondary: "#93a6a3", // --ink-soft
    colorTextPlaceholder: "#93a6a3", // --ink-soft
    colorDanger: "#e2694a", // --rust
    borderRadius: "3px",
    fontFamily: "Inter, \"Segoe UI\", system-ui, sans-serif",
  },
  rules: {
    ".Tab, .Input, .Block": {
      border: "1px solid #24343b", // --line
    },
  },
};

export function PayOrderClient({ orderId }: { orderId: string }) {
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const { data: order, isLoading } = useQuery({
    queryKey: ["rental", orderId],
    queryFn: () => rentalApi.getRentalById(orderId),
  });

  React.useEffect(() => {
    async function createPaymentIntent() {
      if (!order) return;

      try {
        const response = await paymentApi.createPayment({ rentalOrderId: order.id });
        setClientSecret(response.clientSecret);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to initialize payment";
        setError(errorMessage);
        showApiError(err);
      }
    }

    if (order) {
      createPaymentIntent();
    }
  }, [order]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-md px-4 py-14">
        <h1 className="font-display text-2xl text-ink">Complete payment</h1>
        <div className="mt-6 h-64 animate-pulse rounded-sm bg-paper-dim" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-md px-4 py-14">
        <h1 className="font-display text-2xl text-ink">Payment Error</h1>
        <Card className="mt-6">
          <p className="text-ink-soft">{error || "Order not found"}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="font-display text-2xl text-ink">Complete payment</h1>

      <Card className="mt-6">
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 overflow-hidden rounded-sm bg-paper-dim">
            <Image src={order.gear.imageUrl} alt="" fill className="object-cover" />
          </div>
          <div>
            <p className="font-medium text-ink">{order.gear.title}</p>
            <p className="text-sm text-ink-soft">
              {formatDate(order.startDate)} – {formatDate(order.endDate)}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <span className="text-sm text-ink-soft">Total due</span>
          <span className="font-tag text-lg text-brass-dark">{formatCurrency(order.totalCents)}</span>
        </div>
      </Card>

      <Card className="mt-4">
        {clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance }}>
            <CheckoutForm orderId={order.id} />
          </Elements>
        ) : (
          <div className="h-40 animate-pulse rounded-sm bg-paper-dim" />
        )}
      </Card>
    </div>
  );
}
