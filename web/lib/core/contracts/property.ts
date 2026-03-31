import type { PropertyProviderContract } from "@/lib/shared/types/property";

export type {
  CreatePropertyInput,
  PropertyCardDto,
  PropertyDetailDto,
  PropertySearchInput,
} from "@/lib/shared/types/property";

export interface PropertyProvider extends PropertyProviderContract {}
