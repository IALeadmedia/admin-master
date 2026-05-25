
import { ConfigProvider, Switch, Tooltip, type TableColumnsType } from "antd";
import type { EntityType } from "../config-page.const";
import type { useUpdateProductMutation } from "@/hooks/products/useUpdateProductMutation";
import { appSetting } from "@/constants/app-setting/config.const";
import type { ICompany } from "@/types/ICompany.type";

type UpdateMutation = ReturnType<typeof useUpdateProductMutation>;

export function getColumns(
  updateMutation: UpdateMutation,
  canSeeOnlineSwitch: boolean,
  companies: ICompany[] = [],
): TableColumnsType<EntityType> {
  const columns: TableColumnsType<EntityType> = [
    {
      title: "Empresa",
      dataIndex: "company_id",
      key: "company_id",
      width: 100,
      render: (company_id: number) =>
        companies.find((c) => c.company_id === company_id)?.company_name ?? "-",
      sorter: (a, b) => {
        const nameA = companies.find((c) => c.company_id === a.company_id)?.company_name ?? "";
        const nameB = companies.find((c) => c.company_id === b.company_id)?.company_name ?? "";
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: "Plano",
      dataIndex: "name",
      key: "name",
      width: 140,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Valor ",
      dataIndex: ["pricing", "base_monthly"],
      width: 140,
      render: (_value, record) => {
        const monthlyCurrentPrice =
          typeof record?.pricing?.base_monthly === "number"
            ? record.pricing.base_monthly
            : Number(record?.pricing?.base_monthly?.current_price ?? 0);

        return `R$ ${monthlyCurrentPrice.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`;
      },
    },
    { title: " Tipo", dataIndex: "client_type", width: 100 },
  ];

  if (canSeeOnlineSwitch) {
    columns.push({
      title: "",
      dataIndex: "online",
      width: 50,
      render: (_value, record) => (
        <ConfigProvider
          theme={{
            components: {
              Switch: { colorPrimary: appSetting?.primaryColor, colorPrimaryHover: "gray" },
            },
          }}
        >
          <Tooltip
            title="Ative ou desative o aparelho da plataforma"
            placement="top"
            overlayInnerStyle={{ fontSize: "12px" }}
          >
            <Switch

              size="small"
              checked={!!record.online}
              loading={updateMutation.isPending}
              onChange={(checked) => {
                updateMutation.mutate({
                  id: record.id,
                  entity: { online: checked },
                });
              }}
            />
          </Tooltip>
        </ConfigProvider>
      ),
    });
  }

  return columns;
}
