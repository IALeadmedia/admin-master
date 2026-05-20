import { CopyOutlined } from "@ant-design/icons";
import { message, Tooltip, Typography } from "antd";
import { useState } from "react";

interface EmpresasDisplayProps {
    empresas?: any;
}

export function EmpresasDisplay({ empresas }: EmpresasDisplayProps) {
    const [tooltipTitle, setTooltipTitle] = useState("Copiar");

    const empresasFormatadas =
        empresas && empresas.length > 0
            ? empresas
                .map(
                    (empresa: any) =>
                        `${empresa.cnpj || "-"}, ${empresa.nome || "-"}, ${empresa.porte || "-"}`
                )
                .join("; \n")
            : "-";

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(empresasFormatadas);
            setTooltipTitle("Copiado!");
            message.success("Copiado!");
            setTimeout(() => {
                setTooltipTitle("Copiar");
            }, 2000);
        } catch {
            message.error("Erro ao copiar");
        }
    };

    const maxLength = 80;
    const isLongText = empresasFormatadas.length > maxLength;
    const previewText = isLongText
        ? `${empresasFormatadas.substring(0, maxLength)}...`
        : empresasFormatadas;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Typography.Text type="secondary">Empresas</Typography.Text>
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
                {isLongText ? (
                    <Tooltip placement="topLeft" title={<div style={{ whiteSpace: "pre-line" }}>{empresasFormatadas}</div>}>
                        <Typography.Text style={{ cursor: "pointer", flex: 1 }}>
                            {previewText}
                        </Typography.Text>
                    </Tooltip>
                ) : (
                    <Typography.Text style={{ whiteSpace: "pre-line", flex: 1 }}>
                        {previewText}
                    </Typography.Text>
                )}
                {empresasFormatadas !== "-" && (
                    <Tooltip title={tooltipTitle}>
                        <CopyOutlined
                            onClick={handleCopy}
                            style={{
                                color: "#8c8c8c",
                                cursor: "pointer",
                                flexShrink: 0,
                            }}
                        />
                    </Tooltip>
                )}
            </div>
        </div>
    );
}