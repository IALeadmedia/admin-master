import type {
  EntityType,
  FormValues,
} from "@/pages/product/telecom/config-page.const";
import { parseDecimalValue } from "./number.utils";
import type { UploadFile } from "antd";
import type { Extra } from "@/types/IProduct.type";
import type { ReusableExtraTemplate } from "@/pages/product/telecom/components/form-extras";

export function resolveImageUrl(value: unknown): string | null {
  if (typeof value === "string" && value.trim().length > 0) return value;
  if (!value || typeof value !== "object") return null;

  const candidate = value as {
    url?: unknown;
    thumbUrl?: unknown;
    response?: { url?: unknown };
    originFileObj?: { name?: unknown };
    name?: unknown;
  };

  if (typeof candidate.url === "string" && candidate.url.trim().length > 0) {
    return candidate.url;
  }

  if (
    candidate.response &&
    typeof candidate.response.url === "string" &&
    candidate.response.url.trim().length > 0
  ) {
    return candidate.response.url;
  }

  if (
    typeof candidate.thumbUrl === "string" &&
    candidate.thumbUrl.trim().length > 0
  ) {
    return candidate.thumbUrl;
  }

  return null;
}

export function buildInitialBonusVisible(
  entity: EntityType | null,
): Record<string, boolean> {
  if (!entity) return {};

  const nextState: Record<string, boolean> = {};

  const groups = [
    { fieldName: "extras_non_client", items: entity.extras?.non_client ?? [] },
    { fieldName: "extras_client", items: entity.extras?.client ?? [] },
  ] as const;

  groups.forEach(({ fieldName, items }) => {
    items.forEach((group, groupIndex) => {
      group.options?.forEach((option, optionIndex) => {
        const hasBonus =
          !!option.bonus &&
          Object.values(option.bonus).some(
            (value) => value != null && value !== "",
          );

        if (hasBonus) {
          nextState[`${fieldName}_${groupIndex}_${optionIndex}`] = true;
        }
      });
    });
  });

  return nextState;
}
type ExtraFormItem = NonNullable<FormValues["extras_non_client"]>[number];

export function prepareExtrasGroup(
  extras: ExtraFormItem[],
  prefix: "non_client" | "client",
) {
  return extras.map((extra, idx) => {
    const extraId = String(extra.id ?? `extra_${prefix}_${idx}`);

    return {
      extraId,
      files: (extra.images ?? [])
        .filter(
          (f): f is UploadFile => typeof f !== "string" && !!f.originFileObj,
        )
        .map((f) => f.originFileObj as File),
      payload: {
        ...extra,
        id: extraId,
        input_type:
          extra.input_type && extra.input_type !== "select"
            ? extra.input_type
            : "checkbox_group",
        images: (extra.images ?? [])
          .filter((f): f is UploadFile => typeof f !== "string")
          .filter((f) => !f.originFileObj && f.status === "done" && !!f.url)
          .map((f) => f.url!),
        options: (extra.options ?? []).map((option, optionIdx) => ({
          ...option,
          id: String(option.id ?? `option_${prefix}_${idx}_${optionIdx}`),
          price: parseDecimalValue(option.price),
          bonus: option.bonus
            ? {
                ...option.bonus,
                price: parseDecimalValue(option.bonus.price),
                speed: Number(option.bonus.speed ?? 0),
              }
            : undefined,
        })),
      },
    };
  });
}

export function mapExistingImagesToUploadFiles(
  images?: string[],
): UploadFile[] {
  if (!images?.length) return [];

  return images.map((url, idx) => ({
    uid: `${url}-${idx}`,
    name: url.split("/").pop() || `imagem_${idx + 1}`,
    status: "done",
    url,
  }));
}

export function resolveConditionUrl(condition: unknown): string | undefined {
  if (typeof condition === "string" && condition.trim()) return condition;
  if (!condition || typeof condition !== "object") return undefined;

  const candidate = condition as {
    url?: unknown;
    thumbUrl?: unknown;
    path?: unknown;
    response?: { url?: unknown };
  };

  if (typeof candidate.url === "string" && candidate.url.trim())
    return candidate.url;
  if (typeof candidate.thumbUrl === "string" && candidate.thumbUrl.trim())
    return candidate.thumbUrl;
  if (typeof candidate.path === "string" && candidate.path.trim())
    return candidate.path;
  if (
    typeof candidate.response?.url === "string" &&
    candidate.response.url.trim()
  ) {
    return candidate.response.url;
  }

  return undefined;
}

export function resolveConditionName(
  condition: unknown,
  index: number,
): string {
  if (typeof condition === "string" && condition.trim()) {
    return condition.split("/").pop() || `arquivo_${index + 1}`;
  }

  if (!condition || typeof condition !== "object") {
    return `arquivo_${index + 1}`;
  }

  const candidate = condition as {
    name?: unknown;
    url?: unknown;
    path?: unknown;
  };

  if (typeof candidate.name === "string" && candidate.name.trim())
    return candidate.name;

  const fallbackUrl =
    (typeof candidate.url === "string" &&
      candidate.url.trim() &&
      candidate.url) ||
    (typeof candidate.path === "string" &&
      candidate.path.trim() &&
      candidate.path);

  if (fallbackUrl) {
    return fallbackUrl.split("/").pop() || `arquivo_${index + 1}`;
  }

  return `arquivo_${index + 1}`;
}

export function mapExistingConditionsToUploadFiles(
  conditions?: Array<{ url?: string; type?: string } | string | UploadFile>,
): UploadFile[] {
  if (!conditions?.length) return [];

  return conditions.map((condition, idx) => {
    const url = resolveConditionUrl(condition);
    const name = resolveConditionName(condition, idx);
    const type =
      typeof condition === "object" && condition && "type" in condition
        ? (condition as { type?: string }).type
        : undefined;

    return {
      uid: `${url ?? name}-${idx}`,
      name,
      status: "done",
      ...(url ? { url } : {}),
      ...(type ? { type } : {}),
    } satisfies UploadFile;
  });
}

export function toExtraTemplate(
  product: EntityType,
  extra: Extra,
  idx: number,
  scope: "non_client" | "client",
): ReusableExtraTemplate {
  return {
    id: `${product.id}-${scope}-${extra.id ?? idx}`,
    sourceProductId: product.id,
    sourceProductName: product.name,
    scope,
    group: {
      id: undefined,
      label: extra.label,
      description: extra.description,
      input_type: extra.input_type,
      images: mapExistingImagesToUploadFiles(extra.images),
      options: (extra.options ?? []).map((option) => ({
        id: undefined,
        label: option.label,
        price: option.price,
        description: option.description,
        bonus: option.bonus
          ? {
              type: option.bonus.type,
              price: option.bonus.price,
              speed: option.bonus.speed,
              description: option.bonus.description,
            }
          : undefined,
      })),
    },
  };
}
