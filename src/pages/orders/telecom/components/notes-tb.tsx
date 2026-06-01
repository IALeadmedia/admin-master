import { Button, Card, Divider, Form, Input } from "antd";

export function OrderNotesTab({
    orderId,
}: {
    orderId: number;
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

    return (
        <div className="max-h-90 overflow-y-auto scrollbar-thin">

            <Form form={form}>
                <Form.Item name="note">

                    <Input.TextArea
                        rows={4}
                        placeholder="Adicionar observação..."
                    />

                </Form.Item>

                <Button type="primary">
                    Adicionar
                </Button>

            </Form>

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
    );
}