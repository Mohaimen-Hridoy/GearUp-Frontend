import { PayOrderClient } from "@/components/payment/pay-order-client";

export default async function PayForOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PayOrderClient orderId={id} />;
}
