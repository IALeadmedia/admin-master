
import { ConfigProvider, Switch, Tooltip, type TableColumnsType } from "antd";
import type { EntityType } from "../config-page.const";
import type { useUpdateProductMutation } from "@/hooks/products/useUpdateProductMutation";
import { appSetting } from "@/constants/app-setting/config.const";

type UpdateMutation = ReturnType<typeof useUpdateProductMutation>;

export function getColumns(updateMutation: UpdateMutation): TableColumnsType<EntityType> {

  return [
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

    {
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
    },
  ];
}
