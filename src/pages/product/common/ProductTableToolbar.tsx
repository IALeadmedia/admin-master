import { Button, Input, Select, Space } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useAuth } from "@/context/auth-provider";
import { can } from "@/helpers/access-control.helper";

interface CategorySelectProps {
    options: Array<{ label: string; value: string }>;
    value: string;
    onChange: (value: string) => void;
}

interface ProductTableToolbarProps {
    searchText: string;
    onSearchChange: (value: string) => void;
    selectedCount: number;
    entityName: string;
    entityPlural: string;
    onBulkDelete: () => void;
    onCreate: () => void;
    categorySelect?: CategorySelectProps;
}

export function ProductTableToolbar({
    searchText,
    onSearchChange,
    selectedCount,
    entityName,
    entityPlural,
    onBulkDelete,
    onCreate,
    categorySelect,
}: ProductTableToolbarProps) {
    const { user } = useAuth();
    const canCreate = can(user?.user?.role, "products", "create");
    const canDelete = can(user?.user?.role, "products", "delete");

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
                    placeholder="Buscar por nome..."
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
                        style={{ minWidth: 200 }}
                    />
                )}
                {canDelete && selectedCount > 0 && (
                    <Button danger icon={<DeleteOutlined />} onClick={onBulkDelete}>
                        Deletar {selectedCount} {entityPlural.toLowerCase()}
                    </Button>
                )}
            </Space>

            {canCreate && (
                <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
                    Novo(a) {entityName.toLowerCase()}
                </Button>
            )}
        </div>
    );
}
