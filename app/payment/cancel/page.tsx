import Link from "next/link";
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <Card className="w-full border-brass/40 bg-brass/5 py-10">
        <Clock className="mx-auto h-12 w-12 text-brass-dark" />
        <h1 className="mt-4 font-display text-2xl text-ink">Payment was cancelled</h1>
        <p className="mt-1 text-sm text-ink-soft">
          No charge was made. Your gear is still reserved for the next 15
          minutes — you can pick up where you left off.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/dashboard/customer/orders" className={buttonVariants({ variant: "outline" })}>
            Back to orders
          </Link>
          <Link href="/dashboard/customer/orders" className={buttonVariants()}>
            Try again
          </Link>
        </div>
      </Card>
    </div>
  );
}
