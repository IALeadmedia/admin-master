import type { TableColumnsType } from "antd";
import { ConfigProvider, Switch, Tooltip } from "antd";
import type { EntityType } from "../config-page.const";
import { appSetting } from "@/constants/app-setting/config.const";

export function getColumns(canSeeOnlineSwitch: boolean): TableColumnsType<EntityType> {
    const columns: TableColumnsType<EntityType> = [
        {
            title: "Nome do Pacote",
            dataIndex: "name",
            key: "name",
            width: 250,
            render: (text: string) => <span className="font-medium">{text}</span>,
        },
        {
            title: "Taxa de Transação (%)",
            dataIndex: "tax_rate",
            key: "tax_rate",
            width: 180,

        },
        {
            title: "Mensalidade (R$)",
            dataIndex: "monthly_fee",
            key: "monthly_fee",
            width: 180,
        },
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
                        //   loading={updateMutation.isPending}
                        //   onChange={(checked) => {
                        //     updateMutation.mutate({
                        //       id: record.id,
                        //       entity: { online: checked },
                        //     });
                        //   }}
                        />
                    </Tooltip>
                </ConfigProvider>
            ),
        });
    }

    return columns;
}
