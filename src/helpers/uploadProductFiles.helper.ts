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
    await Promise.all(
      detailsImages.map(({ detailIndex, files }) =>
        service.uploadDetails(id, detailIndex, files, model),
      ),
    );
  }

  if (extrasImages?.length) {
    await Promise.all(
      extrasImages.map(({ extraId, files }) =>
        service.uploadExtras(id, extraId, files, model),
      ),
    );
  }
}
