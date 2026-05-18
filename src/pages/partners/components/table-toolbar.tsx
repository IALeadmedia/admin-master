import { Button, Input, Space } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { entityPage } from "../config-page.const";

interface TableToolbarProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  selectedCount: number;
  onBulkDelete: () => void;
  onCreate: () => void;
}

export function TableToolbar({
  searchText,
  onSearchChange,
  selectedCount,
  onBulkDelete,
  onCreate,
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
        {selectedCount > 0 && (
          <Button danger icon={<DeleteOutlined />} onClick={onBulkDelete}>
            Deletar {selectedCount} {entityPage.plural.toLowerCase()}
          </Button>
        )}
      </Space>

      <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
        Novo(a) {entityPage.name.toLowerCase()}
      </Button>
    </div>
  );
}
