"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { paymentApi, showApiError } from "@/lib/api-service";

type State = "loading" | "success" | "error";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [state, setState] = React.useState<State>("loading");

  const confirm = React.useCallback(async () => {
    setState("loading");
    const paymentIntent = searchParams.get("payment_intent");
    const rentalOrderId = searchParams.get("rentalOrderId");

    if (!paymentIntent || !rentalOrderId) {
      setState("error");
      return;
    }

    try {
      await paymentApi.confirmPayment({
        payment_intent: paymentIntent,
        rentalOrderId,
      });
      setState("success");
    } catch (error) {
      showApiError(error);
      setState("error");
    }
  }, [searchParams]);

  React.useEffect(() => {
    confirm();
  }, [confirm]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      {state === "loading" && (
        <Card className="w-full animate-pulse py-12">
          <div className="mx-auto h-12 w-12 rounded-full bg-paper-dim" />
          <div className="mx-auto mt-4 h-5 w-40 rounded-sm bg-paper-dim" />
        </Card>
      )}

      {state === "success" && (
        <Card className="w-full border-moss/40 bg-moss/5 py-10">
          <CheckCircle2 className="mx-auto h-12 w-12 text-moss" />
          <h1 className="mt-4 font-display text-2xl text-ink">Payment confirmed</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Your rental is booked. The provider will prep it for pickup.
          </p>
          <Link href="/dashboard/customer/orders" className={buttonVariants({ className: "mt-6" })}>
            View my orders
          </Link>
        </Card>
      )}

      {state === "error" && (
        <Card className="w-full border-rust/40 bg-rust/5 py-10">
          <TriangleAlert className="mx-auto h-12 w-12 text-rust" />
          <h1 className="mt-4 font-display text-2xl text-ink">Couldn&apos;t confirm yet</h1>
          <p className="mt-1 text-sm text-ink-soft">
            This is usually just a network hiccup — your payment may still have gone through.
          </p>
          <Button className="mt-6" onClick={confirm}>
            Retry
          </Button>
        </Card>
      )}
    </div>
  );
}
