import { appSetting } from "@/constants/app-setting/config.const";
import { formatRoleLabel } from "@/utils/role.util";
import { Button, Card, ConfigProvider, Divider, Form, Input } from "antd";

export function OrderNotesTab({
    viewingEntity,
    handleSaveObservacao
}: {
    viewingEntity: any;
    handleSaveObservacao: any
}) {

    const [form] = Form.useForm();

    const color = appSetting.primaryColor;
    return (
        <div className="max-h-90 overflow-y-auto scrollbar-thin flex flex-col gap-4 ">   <div className="bg-neutral-100 rounded-sm p-3 w-full">
            <ConfigProvider
                theme={{
                    components: {
                        Input: {
                            hoverBorderColor: color,
                            activeBorderColor: color,
                            activeShadow: "none",
                            colorBorder: "#bfbfbf",
                            colorTextPlaceholder: "#666666",
                        },
                        Button: {
                            colorBorder: color,
                            colorText: color,
                            colorPrimary: color,
                            colorPrimaryHover: color,
                        },
                    },
                }}
            >
                <Form form={form} layout="vertical" className="w-full flex flex-col">
                    <Form.Item name="consultant_observation" style={{ marginBottom: 8 }}>
                        <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} className="text-[16px] font-light text-[#353535] w-full" placeholder="Adicione aqui uma observação sobre esse pedido..." />
                    </Form.Item>
                    <Button className="self-end" style={{ fontSize: "12px", height: "25px" }} onClick={async () => {
                        const values = await form.validateFields();
                        handleSaveObservacao(values);
                        form.resetFields();
                    }}
                    >
                        Salvar
                    </Button>

                </Form>
            </ConfigProvider>
            <Divider />

            <div className="flex flex-col gap-3">

                {viewingEntity?.consultant_notes?.slice().reverse().map((note: any) => (

                    <Card key={note?.id}>

                        <div className="flex justify-between">

                            <strong>
                                {note?.user} - {formatRoleLabel(note?.role)}
                            </strong>

                            <span>
                                {note?.created_at}
                            </span>

                        </div>

                        <p className="mt-2">
                            {note?.obs}
                        </p>

                    </Card>

                ))}

            </div>
        </div>
        </div>
    );
}