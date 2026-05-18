import { httpClientAxios } from "@/http/api";
import type {
  CreatedProductResponse,
  ICreateProductApiResponse,
  IProduct,
  IProductFilters,
  IProductsResponse,
  ProductModel,
  UploadedProductDetailImageResponse,
} from "@/types/IProduct.type";

export function isProductModel(value?: string): value is ProductModel {
  return value === "telecom" || value === "finances" || value === "benefits";
}

function resolveProductsBasePath(model: ProductModel): string {
  if (model.startsWith("telecom")) return "/telecom/products";
  if (model.startsWith("finances")) return "/finances/products";
  if (model.startsWith("benefits")) return "/benefits/products";
  throw new Error(`Segmento não mapeado: ${model}`);
}

function buildFilesFormData(files: File[], fields?: Record<string, string>) {
  const formData = new FormData();

  if (fields) {
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  files.forEach((file) => {
    formData.append("file", file);
  });

  return formData;
}

const multipartHeaders = {
  "Content-Type": "multipart/form-data",
};

export class ProductsService {
  static async getAll(
    filters?: IProductFilters,
    model: ProductModel = "telecom",
  ): Promise<IProductsResponse> {
    const { data } = await httpClientAxios.get<IProductsResponse>(
      resolveProductsBasePath(model),
      { params: filters },
    );

    return data;
  }

  static async create(
    entity: Record<string, unknown>,
    model: ProductModel = "telecom",
  ): Promise<CreatedProductResponse> {
    const { data } = await httpClientAxios.post<
      ICreateProductApiResponse | IProduct | { id?: number | string }
    >(resolveProductsBasePath(model), entity);

    const rawId =
      (data as IProduct)?.id ??
      (data as { id?: number | string })?.id ??
      (data as ICreateProductApiResponse)?.product?.id ??
      (data as { data?: { product?: { id?: number | string } } })?.data?.product
        ?.id;

    const id = Number(rawId);
    if (!Number.isFinite(id)) {
      throw new Error(
        "Falha ao obter id do produto criado para upload de arquivos",
      );
    }

    return { id };
  }

  static async update(
    id: number,
    entity: Partial<IProduct> | Record<string, unknown>,
    model: ProductModel = "telecom",
  ): Promise<void> {
    await httpClientAxios.put(
      `${resolveProductsBasePath(model)}/${id}`,
      entity,
    );
  }

  static async deleteItems({
    ids,
    model = "telecom",
  }: {
    ids: number[];
    model?: ProductModel;
  }): Promise<void> {
    for (const id of ids) {
      await httpClientAxios.delete(`${resolveProductsBasePath(model)}/${id}`);
    }
  }

  static async uploadConditions(
    id: number,
    files: File[],
    model: ProductModel = "telecom",
  ): Promise<unknown> {
    const formData = buildFilesFormData(files);

    const { data } = await httpClientAxios.post(
      `${resolveProductsBasePath(model)}/${id}/conditions`,
      formData,
      {
        headers: multipartHeaders,
      },
    );

    return data;
  }

  static async uploadDetails(
    id: number,
    detailIndex: number,
    files: File[],
    model: ProductModel = "telecom",
  ): Promise<UploadedProductDetailImageResponse> {
    const formData = buildFilesFormData(files, {
      detail_index: String(detailIndex),
    });

    const { data } =
      await httpClientAxios.post<UploadedProductDetailImageResponse>(
        `${resolveProductsBasePath(model)}/${id}/details`,
        formData,
        {
          headers: multipartHeaders,
        },
      );

    return data;
  }

  static async uploadExtras(
    id: number,
    extraId: string,
    files: File[],
    model: ProductModel = "telecom",
  ): Promise<UploadedProductDetailImageResponse> {
    const formData = buildFilesFormData(files, {
      extra_id: extraId,
    });

    const { data } =
      await httpClientAxios.post<UploadedProductDetailImageResponse>(
        `${resolveProductsBasePath(model)}/${id}/extras-images`,
        formData,
        {
          headers: multipartHeaders,
        },
      );

    return data;
  }
}
