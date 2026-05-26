import type { ProductModel } from "@/types/IProduct.type";
import type { ProductsService } from "@/services/products.service";

interface UploadProductFilesParams {
  conditionFiles?: File[];
  detailsImages?: { detailIndex: number; files: File[] }[];
  extrasImages?: { extraId: string; files: File[] }[];
}

export async function uploadProductFiles(
  id: number,
  { conditionFiles, detailsImages, extrasImages }: UploadProductFilesParams,
  model: ProductModel,
  service: typeof ProductsService,
): Promise<void> {
  if (conditionFiles?.length) {
    await service.uploadConditions(id, conditionFiles, model);
  }

  if (detailsImages?.length) {
    for (const { detailIndex, files } of detailsImages) {
      await service.uploadDetails(id, detailIndex, files, model);
    }
  }

  if (extrasImages?.length) {
    for (const { extraId, files } of extrasImages) {
      await service.uploadExtras(id, extraId, files, model);
    }
  }
}
