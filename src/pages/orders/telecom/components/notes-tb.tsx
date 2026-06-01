import { appSetting } from "@/constants/app-setting/config.const";
import { Button, Card, ConfigProvider, Divider, Form, Input } from "antd";

export function OrderNotesTab({
    orderId,
    handleSaveObservacao
}: {
    orderId: number;
    handleSaveObservacao: any
}) {

    const [form] = Form.useForm();
    const mockNotes = [
        {
            id: 1,
            user_name: "Carlos Silva",
            created_at: "01/06/2026 09:15",
            message:
                "Cliente informou que prefere instalação após as 18h.",
        },
        {
            id: 2,
            user_name: "Maria Souza",
            created_at: "01/06/2026 10:30",
            message:
                "Entramos em contato por telefone e confirmamos os dados cadastrais.",
        },

    ];
    console.log("Order ID for notes:", orderId);
    // const { data } = useOrderNotes(orderId);
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
                <Form form={form} layout="vertical">
                    <Form.Item name="consultant_observation" style={{ marginBottom: 8 }}>
                        <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} className="text-[16px] font-light text-[#353535] w-full" placeholder="Adicione aqui uma observação sobre esse pedido..." />
                    </Form.Item>
                    <Button className="self-end" style={{ fontSize: "12px", height: "25px" }} onClick={handleSaveObservacao}>
                        Salvar
                    </Button>

                </Form>
            </ConfigProvider>
            <Divider />

            <div className="flex flex-col gap-3">

                {mockNotes?.map((note) => (

                    <Card key={note.id}>

                        <div className="flex justify-between">

                            <strong>
                                {note.user_name}
                            </strong>

                            <span>
                                {note.created_at}
                            </span>

                        </div>

                        <p className="mt-2">
                            {note.message}
                        </p>

                    </Card>

                ))}

            </div>
        </div>
        </div>
    );
}