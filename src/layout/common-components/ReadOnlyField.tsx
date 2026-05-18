import { Space, Typography, Tooltip, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";

interface ReadonlyFieldProps {
    label: string;
    value?: string | null;
    copyable?: boolean;
}

export default function ReadonlyField({ label, value, copyable }: ReadonlyFieldProps) {
    const handleCopy = () => {
        if (!value) return;
        navigator.clipboard.writeText(value);
        message.success("Copiado!");
    };

    return (
        <Space orientation="vertical" size={4} style={{ display: "flex" }}>
            <Typography.Text type="secondary">{label}</Typography.Text>
            <div
                style={{
                    minHeight: 30,
                    padding: "4px 10px",
                    border: "1px solid #d9d9d9",
                    borderRadius: 8,
                    backgroundColor: "rgba(0, 0, 0, 0.015)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                }}
            >
                <Typography.Text>{value || "-"}</Typography.Text>
                {copyable && value && (
                    <Tooltip title="Copiar">
                        <CopyOutlined
                            onClick={handleCopy}
                            style={{ color: "#8c8c8c", cursor: "pointer", flexShrink: 0 }}
                        />
                    </Tooltip>
                )}
            </div>
        </Space>
    );
}