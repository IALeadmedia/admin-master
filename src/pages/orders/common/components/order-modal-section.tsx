import { Divider } from "antd";
import type { ReactNode } from "react";

type OrderModalSectionProps = {
    title: string;
    children: ReactNode;
};

export function OrderModalSection({ title, children }: OrderModalSectionProps) {
    return (
        <>
            <Divider style={{ fontSize: 13, color: "#666" }}>{title}</Divider>
            <div className="bg-neutral-100 rounded-sm p-3 w-full">{children}</div>
        </>
    );
}
