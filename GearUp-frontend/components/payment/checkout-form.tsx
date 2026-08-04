"use client";

import * as React from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// TODO(API_INTEGRATION.md): this expects a clientSecret from POST
// /payments/create, obtained by the parent page and passed to the
// <Elements stripe={...} options={{ clientSecret }}> wrapper.

export function CheckoutForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success?rentalOrderId=${orderId}`,
      },
    });

    if (error) {
      toast.error(error.message ?? "Payment failed. Please try again.");
      setSubmitting(false);
    }
    // On success, Stripe redirects to return_url — no further action needed here.
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement />
      <Button type="submit" className="w-full" size="lg" loading={submitting} disabled={!stripe}>
        Pay now
      </Button>
    </form>
  );
}
