"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { gearSchema, type GearInput } from "@/lib/validation";
import { gearApi, showApiError } from "@/lib/api-service";
import type { Gear, Category } from "@/lib/types";

export function GearForm({ initial, mode }: { initial?: Gear; mode: "create" | "edit" }) {
  const router = useRouter();
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => gearApi.getCategories(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GearInput>({
    resolver: zodResolver(gearSchema),
    defaultValues: initial
      ? {
          title: initial.title,
          description: initial.description,
          brand: initial.brand,
          categoryId: initial.categoryId,
          pricePerDay: initial.pricePerDay / 100,
          stock: initial.stock,
          imageUrl: initial.imageUrl,
          images: (initial.images ?? []).filter((url) => url !== initial.imageUrl).join("\n"),
          available: initial.available,
        }
      : { available: true },
  });

  async function onSubmit(data: GearInput) {
    try {
      const galleryUrls = (data.images ?? "")
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean);

      const invalidUrl = galleryUrls.find((url) => !/^https?:\/\//i.test(url));
      if (invalidUrl) {
        toast.error(`Not a valid image URL: ${invalidUrl}`);
        return;
      }

      const gearData = {
        ...data,
        pricePerDay: data.pricePerDay,
        images: galleryUrls,
      };

      if (mode === "create") {
        await gearApi.createGear(gearData);
        toast.success("Gear listed successfully");
      } else if (initial) {
        await gearApi.updateGear(initial.id, gearData);
        toast.success("Gear updated successfully");
      }
      router.push("/dashboard/provider/gear");
    } catch (error) {
      showApiError(error);
    }
  }

  return (
    <Card>
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label="Title" htmlFor="title" error={errors.title?.message}>
          <Input id="title" invalid={!!errors.title} {...register("title")} />
        </FormField>

        <FormField label="Description" htmlFor="description" error={errors.description?.message}>
          <Textarea id="description" invalid={!!errors.description} {...register("description")} />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Brand" htmlFor="brand" error={errors.brand?.message}>
            <Input id="brand" invalid={!!errors.brand} {...register("brand")} />
          </FormField>
          <FormField label="Category" htmlFor="categoryId" error={errors.categoryId?.message}>
            <Select id="categoryId" invalid={!!errors.categoryId} defaultValue="" {...register("categoryId")}>
              <option value="" disabled>
                Choose category
              </option>
              {categories.map((c: Category) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Price / day ($)" htmlFor="pricePerDay" error={errors.pricePerDay?.message}>
            <Input id="pricePerDay" type="number" step="0.01" invalid={!!errors.pricePerDay} {...register("pricePerDay")} />
          </FormField>
          <FormField label="Stock" htmlFor="stock" error={errors.stock?.message}>
            <Input id="stock" type="number" invalid={!!errors.stock} {...register("stock")} />
          </FormField>
        </div>

        <FormField label="Cover image URL" htmlFor="imageUrl" error={errors.imageUrl?.message}>
          <Input id="imageUrl" invalid={!!errors.imageUrl} {...register("imageUrl")} />
        </FormField>

        <FormField
          label="Gallery images (optional)"
          htmlFor="images"
          error={errors.images?.message}
        >
          <Textarea
            id="images"
            placeholder={"One image URL per line, e.g.\nhttps://example.com/photo-1.jpg\nhttps://example.com/photo-2.jpg"}
            rows={3}
            {...register("images")}
          />
        </FormField>

        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" className="accent-moss" {...register("available")} />
          Available for rent
        </label>

        <Button type="submit" size="lg" loading={isSubmitting}>
          {mode === "create" ? "List gear" : "Save changes"}
        </Button>
      </form>
    </Card>
  );
}
