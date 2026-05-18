import { Button, Input, Select, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { entityPage } from "../config-page.const";

interface CategorySelectProps {
    options: Array<{ label: string; value: string }>;
    value?: string;
    onChange: (value: string) => void;
}

interface TableToolbarProps {
    searchText: string;
    onSearchChange: (value: string) => void;
    selectedCount: number;
    onBulkDelete: () => void;
    canDelete: boolean;
    categorySelect?: CategorySelectProps;

}

export function TableToolbar({
    searchText,
    onSearchChange,
    selectedCount,
    onBulkDelete,
    canDelete,
    categorySelect,

}: TableToolbarProps) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                gap: 8,
                flexWrap: "wrap",
            }}
        >
            <Space wrap>
                <Input.Search
                    placeholder="Buscar por nome ou email..."
                    value={searchText}
                    onChange={(e) => onSearchChange(e.target.value)}
                    allowClear
                    style={{ width: 300 }}
                />
                {categorySelect && (
                    <Select
                        options={categorySelect.options}
                        value={categorySelect.value}
                        onChange={categorySelect.onChange}
                        style={{ minWidth: 220 }}
                    />
                )}
                {canDelete && selectedCount > 0 && (
                    <Button danger icon={<DeleteOutlined />} onClick={onBulkDelete}>
                        Deletar {selectedCount} {entityPage.plural.toLowerCase()}
                    </Button>
                )}
            </Space>


        </div>
    );
}
