"use client";

import { useState } from "react";
import { FiChevronDown, FiSliders } from "react-icons/fi";

import { PropertyFilters } from "@/components/properties/PropertyFilters";
import { Button } from "@/components/ui/button";
import type { PropertySearchInput } from "@/lib/core/contracts/property";
import { cn } from "@/lib/utils";

interface PropertyFiltersToggleProps {
  action?: string;
  values: PropertySearchInput;
  defaultOpen?: boolean;
}

function hasActiveAdvancedFilters(values: PropertySearchInput) {
  return Boolean(
    values.city ||
      values.propertyType ||
      values.listingPurpose ||
      values.minPrice !== undefined ||
      values.maxPrice !== undefined ||
      values.bedrooms !== undefined ||
      values.bathrooms !== undefined ||
      values.sortBy,
  );
}

export function PropertyFiltersToggle({
  action,
  values,
  defaultOpen,
}: PropertyFiltersToggleProps) {
  const [open, setOpen] = useState(
    defaultOpen ?? hasActiveAdvancedFilters(values),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          className="h-11 rounded-xl"
        >
          <FiSliders />
          {open ? "Hide advanced filters" : "Advanced filters"}
          <FiChevronDown
            className={cn("transition-transform", open && "rotate-180")}
          />
        </Button>
      </div>
      {open ? <PropertyFilters action={action} values={values} /> : null}
    </div>
  );
}
