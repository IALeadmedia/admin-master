import { formatBRL } from "@/utils/number.utils";
import { Col, Row, Space, Typography } from "antd";
import { type EntityType } from "../config-page.const";

type ExtraGroup = NonNullable<EntityType["extras"]>["client"][number];
type ExtraOption = ExtraGroup["options"][number];
type ExtraBonus = NonNullable<ExtraOption["bonus"]>;

function getFileNameFromUrl(url: string, fallback: string) {
    return url.split("/").pop() || fallback;
}

type ExtraBonusCardProps = {
    bonus: ExtraBonus;
    color: string;
};

function ExtraBonusCard({ bonus, color }: ExtraBonusCardProps) {
    return (
        <div
            style={{
                marginTop: 6,
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                padding: "8px 10px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                    style={{
                        fontSize: 10,
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        background: color,
                        color: "#fff",
                        borderRadius: 4,
                        padding: "2px 8px",
                    }}
                >
                    Bônus
                </span>

                {bonus.type && (
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        {bonus.type}
                    </Typography.Text>
                )}
            </div>

            <Space size={16}>
                {bonus.speed > 0 && (
                    <div>
                        <Typography.Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase", display: "block" }}>
                            Velocidade
                        </Typography.Text>
                        <Typography.Text style={{ fontSize: 12 }}>{bonus.speed} Mbps</Typography.Text>
                    </div>
                )}

                {typeof bonus.price !== "undefined" && (
                    <div>
                        <Typography.Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase", display: "block" }}>
                            Preço
                        </Typography.Text>
                        <Typography.Text style={{ fontSize: 12, color }}>
                            {bonus.price > 0 ? formatBRL(bonus.price) : "-"}
                        </Typography.Text>
                    </div>
                )}
            </Space>

            {bonus.description && (
                <div>
                    <Typography.Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase", display: "block" }}>
                        Descrição
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        {bonus.description}
                    </Typography.Text>
                </div>
            )}
        </div>
    );
}

type ExtraOptionCardProps = {
    option: ExtraOption;
    color: string;
};

function ExtraOptionCard({ option, color }: ExtraOptionCardProps) {
    return (
        <div
            style={{
                border: "1px solid #f3f4f6",
                borderRadius: 6,
                padding: "8px 12px",
                display: "flex",
                flexDirection: "column",
                gap: 4,
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <Typography.Text style={{ fontSize: 13, display: "block" }}>{option.label}</Typography.Text>
                    {option.description && (
                        <Typography.Text type="secondary" style={{ fontSize: 12, display: "block" }}>
                            {option.description}
                        </Typography.Text>
                    )}
                </div>

                <Typography.Text strong style={{ fontSize: 13, marginLeft: 8, whiteSpace: "nowrap" }}>
                    {option.price > 0 ? formatBRL(option.price) : "-"}
                </Typography.Text>
            </div>

            {option.bonus && <ExtraBonusCard bonus={option.bonus} color={color} />}
        </div>
    );
}
type ExtraImagesProps = {
    images?: string[];
    color: string;
};

function ExtraImages({ images, color }: ExtraImagesProps) {
    if (!Array.isArray(images) || images.length === 0) return null;

    return (
        <Space wrap size={8} style={{ marginBottom: 12 }}>
            {images.map((imgUrl, imgIdx) => {
                const imgName = getFileNameFromUrl(imgUrl, `imagem_${imgIdx + 1}`);

                return (
                    <a
                        key={imgIdx}
                        href={imgUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={imgName}
                        style={{ color, display: "flex", flexDirection: "column", alignItems: "center" }}
                    >
                        <img
                            src={imgUrl}
                            alt={imgName}
                            style={{
                                width: 40,
                                height: 40,
                                objectFit: "cover",
                                borderRadius: 4,
                                border: "1px solid #e5e7eb",
                                marginBottom: 4,
                            }}
                        />
                    </a>
                );
            })}
        </Space>
    );
}

type ExtraGroupCardProps = {
    group: ExtraGroup;
    color: string;
};

function ExtraGroupCard({ group, color }: ExtraGroupCardProps) {
    return (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, height: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <Typography.Text strong style={{ flex: 1 }}>
                    {group.label}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase" }}>
                    {group.input_type}
                </Typography.Text>
            </div>

            <ExtraImages images={group.images} color={color} />

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(group.options ?? []).map((option, optionIdx) => (
                    <ExtraOptionCard key={`${option.id}-${optionIdx}`} option={option} color={color} />
                ))}
            </div>
        </div>
    );
}

type ExtraSectionProps = {
    title: string;
    groups?: ExtraGroup[];
    color: string;
};

export function ExtraSection({ title, groups = [], color }: ExtraSectionProps) {
    if (groups.length === 0) return null;

    return (
        <div>
            <Typography.Text strong style={{ display: "block", marginBottom: 12, fontSize: 14 }}>
                {title}
            </Typography.Text>
            <Row gutter={[16, 16]}>
                {groups.map((group, idx) => (
                    <Col xs={24} md={12} lg={8} key={`${group.id}-${idx}`}>
                        <ExtraGroupCard group={group} color={color} />
                    </Col>
                ))}
            </Row>
        </div>
    );
}