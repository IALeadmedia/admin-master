import { useEffect, useMemo, useState } from "react";
import { Form, message } from "antd";
import type { UploadFile } from "antd";
import { useCompanyQuery } from "@/hooks/companies/useCompanyQuery";
import { useAuth } from "@/context/auth-provider";
import { useAdminScope } from "@/context/admin-scope-provider";
import {
  buildInitialBonusVisible,
  mapExistingConditionsToUploadFiles,
  mapExistingImagesToUploadFiles,
  prepareExtrasGroup,
  resolveConditionUrl,
  toExtraTemplate,
} from "@/utils/products.utils";
import { parseDecimalValue } from "@/utils/number.utils";
import type { ReusableExtraTemplate } from "@/pages/product/telecom/components/form-extras";
import {
  useCreateEntity,
  useListEntity,
  useUpdateEntity,
  type FormValues,
} from "@/pages/product/telecom/config-page.const";

type ExtrasTab = "non_client" | "client";

export function useFormModal({ open, editingEntity, category, onClose }: any) {
  const [form] = Form.useForm<FormValues>();
  const createMutation = useCreateEntity();
  const updateMutation = useUpdateEntity();
  const { user, isGlobalAdmin } = useAuth();
  const { selectedCompanyId } = useAdminScope();
  const [modalCompanyId, setModalCompanyId] = useState<number | undefined>(
    undefined,
  );
  const { data: reusableProductsData, isLoading: isLoadingReusableProducts } =
    useListEntity(category);
  const { data: companiesData } = useCompanyQuery({ enabled: isGlobalAdmin });
  const [activeExtrasTab, setActiveExtrasTab] =
    useState<ExtrasTab>("non_client");
  const [bonusVisibleOverrides, setBonusVisibleOverrides] = useState<
    Record<string, boolean>
  >({});
  const isEditing = !!editingEntity;
  const isPending = createMutation.isPending || updateMutation.isPending;
  const bonusVisible = useMemo(
    () => ({
      ...buildInitialBonusVisible(editingEntity),
      ...bonusVisibleOverrides,
    }),
    [editingEntity, bonusVisibleOverrides],
  );

  const handleToggleBonus = (optionKey: string) => {
    setBonusVisibleOverrides((prev) => ({
      ...prev,
      [optionKey]: !bonusVisible[optionKey],
    }));
  };
  const reusableExtraTemplates = useMemo<ReusableExtraTemplate[]>(
    () =>
      (reusableProductsData?.products ?? [])
        .filter((product) => !editingEntity || product.id !== editingEntity.id)
        .flatMap((product) => [
          ...(product.extras?.non_client ?? []).map((extra, idx) =>
            toExtraTemplate(product, extra, idx, "non_client"),
          ),
          ...(product.extras?.client ?? []).map((extra, idx) =>
            toExtraTemplate(product, extra, idx, "client"),
          ),
        ]),
    [editingEntity, reusableProductsData?.products],
  );
  const companyOptions = useMemo(
    () =>
      companiesData?.companies.map((company) => ({
        label: company.company_name,
        value: company.company_id,
      })) ?? [],
    [companiesData],
  );

  function handleTemplateApplied(
    fieldName: "extras_non_client" | "extras_client",
    groupIndex: number,
    group: ReusableExtraTemplate["group"],
  ) {
    setBonusVisibleOverrides((prev) => {
      const next = { ...prev };

      (group.options ?? []).forEach((option, optionIndex) => {
        const hasBonus =
          !!option.bonus &&
          Object.values(option.bonus).some(
            (value) => value != null && value !== "",
          );

        if (hasBonus) {
          next[`${fieldName}_${groupIndex}_${optionIndex}`] = true;
        }
      });

      return next;
    });
  }

  function handleClose() {
    setBonusVisibleOverrides({});
    onClose();
  }

  function handleSelectCompany(companyId: number | undefined) {
    setModalCompanyId(companyId);
  }

  useEffect(() => {
    if (!open || !isGlobalAdmin) return;

    if (editingEntity) {
      setModalCompanyId(editingEntity.company_id ?? undefined);
      return;
    }

    setModalCompanyId(selectedCompanyId ?? undefined);
  }, [open, isGlobalAdmin, editingEntity, selectedCompanyId]);

  useEffect(() => {
    if (open && editingEntity) {
      form.setFieldsValue({
        ...editingEntity,
        offer_conditions: mapExistingConditionsToUploadFiles(
          editingEntity.offer_conditions,
        ),
        extras_non_client: (editingEntity.extras?.non_client ?? []).map(
          (group: any) => ({
            ...group,
            images: mapExistingImagesToUploadFiles(group.images),
          }),
        ),
        extras_client: (editingEntity.extras?.client ?? []).map(
          (group: any) => ({
            ...group,
            images: mapExistingImagesToUploadFiles(group.images),
          }),
        ),
      });
    } else if (open) {
      form.resetFields();
    }
  }, [open, editingEntity, form]);

  async function handleSubmit() {
    const values = await form.validateFields();

    const effectiveCompanyId = isGlobalAdmin
      ? (modalCompanyId ?? null)
      : (user?.user.company_id ?? null);

    if (isGlobalAdmin && effectiveCompanyId == null) {
      message.error("Selecione uma empresa para associar o produto.");
      return;
    }

    const conditionFiles = (values.offer_conditions ?? [])
      .filter((f) => f.originFileObj)
      .map((f) => f.originFileObj as File);

    const persistedOfferConditions = (values.offer_conditions ?? [])
      .filter((f) => !f.originFileObj && f.status === "done")
      .map((f) => ({
        url: resolveConditionUrl(f)!,
        type: f.type ?? "file",
      }))
      .filter((condition) => !!condition.url);

    const detailsImages = (values.details ?? [])
      .map((detail, idx) => ({
        detailIndex: idx,
        files: (detail.images ?? [])
          .filter(
            (f): f is UploadFile => typeof f !== "string" && !!f.originFileObj,
          )
          .map((f) => f.originFileObj as File),
      }))
      .filter((d) => d.files.length > 0);

    const extrasNonClient = values.extras_non_client ?? [];
    const extrasClient = values.extras_client ?? [];

    const normalizedExtrasNonClient = prepareExtrasGroup(
      extrasNonClient,
      "non_client",
    );
    const normalizedExtrasClient = prepareExtrasGroup(extrasClient, "client");

    const extrasImages = [
      ...normalizedExtrasNonClient,
      ...normalizedExtrasClient,
    ]
      .map((extra) => ({
        extraId: extra.extraId,
        files: extra.files,
      }))
      .filter((extra) => extra.files.length > 0);

    const {
      pricing: rawPricing,
      offer_conditions: _oc,
      extras_non_client: _enc,
      extras_client: _ec,
      ...restValues
    } = values;
    void _oc;
    void _enc;
    void _ec;

    const entityPayload = {
      ...restValues,
      offer_conditions: persistedOfferConditions,
      pricing: {
        base_monthly: {
          current_price: parseDecimalValue(
            rawPricing?.base_monthly?.current_price,
          ),
          ...(rawPricing?.base_monthly?.original_price != null && {
            original_price: parseDecimalValue(
              rawPricing.base_monthly.original_price,
            ),
          }),
        },
        installation: {
          current_price: parseDecimalValue(
            rawPricing?.installation?.current_price,
          ),
        },
      },
      details: (values.details ?? []).map((detail) => ({
        ...detail,
        images: (detail.images ?? [])
          .filter((f): f is UploadFile => typeof f !== "string")
          .filter((f) => !f.originFileObj && f.status === "done" && !!f.url)
          .map((f) => f.url!),
      })),
      extras: {
        non_client: normalizedExtrasNonClient.map((extra) => extra.payload),
        client: normalizedExtrasClient.map((extra) => extra.payload),
      },
    };

    if (isEditing && editingEntity)
      updateMutation.mutate(
        {
          id: editingEntity.id,
          entity: {
            ...entityPayload,
            online: editingEntity.online,
            company_id: effectiveCompanyId,
            uf: values.uf ?? [],
          },
          conditionFiles,
          detailsImages,
          extrasImages,
        },
        { onSuccess: handleClose },
      );
    else
      createMutation.mutate(
        {
          entity: {
            ...entityPayload,
            category,
            company: "TIM",
            company_id: effectiveCompanyId,
            uf: values.uf ?? [],
          },
          conditionFiles,
          detailsImages,
          extrasImages,
        },
        { onSuccess: handleClose },
      );
  }

  return {
    form,
    isPending,
    isEditing,
    isGlobalAdmin,
    companyOptions,
    reusableExtraTemplates,
    isLoadingReusableProducts,
    activeExtrasTab,
    setActiveExtrasTab,
    bonusVisible,
    handleToggleBonus,
    handleTemplateApplied,
    selectedCompanyId: modalCompanyId,
    setSelectedCompanyId: handleSelectCompany,
    handleSubmit,
    handleClose,
  };
}
