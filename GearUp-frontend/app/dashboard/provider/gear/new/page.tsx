import { GearForm } from "@/components/gear/gear-form";

export default function NewGearPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-6 font-display text-3xl text-ink">List new gear</h1>
      <GearForm mode="create" />
    </div>
  );
}
