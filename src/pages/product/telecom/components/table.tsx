import { Table } from "antd";
import { getColumns } from "./columns";
import { useUpdateEntity, useDeleteEntity, entityPage } from "../config-page.const";
import { FormModal } from "./form-modal";
import { ViewModal } from "./view-modal";
import { useStyle } from "@/style/tableStyle";
import type { IProduct } from "@/types/IProduct.type";
import { useProductTable } from "../../common/useProductTable";
import { ProductTableToolbar } from "../../common/ProductTableToolbar";
import { ProductDeleteModal } from "../../common/ProductDeleteModal";
import { useAuth } from "@/context/auth-provider";
import type { UserRole } from "@/types/IUser.type";

const canSeeSwitchRoles: UserRole[] = ["ADMIN", "GESTOR", "DIRETOR", "GERENTE"];

interface ProductsTableProps {
  data: IProduct[];
  isLoading: boolean;
  category: string;
  categorySelect?: {
    options: Array<{ label: string; value: string }>;
    value: string;
    onChange: (value: string) => void;
  };
}

export function TableMain({ data, isLoading, category, categorySelect }: ProductsTableProps) {
  const { styles } = useStyle();
  const updateMutation = useUpdateEntity();
  const deleteMutation = useDeleteEntity();
  const { user } = useAuth();
  const canSeeOnlineSwitch = canSeeSwitchRoles.includes(user?.user?.role as UserRole);
  const columns = getColumns(updateMutation, canSeeOnlineSwitch);

  const {
    selectedRowKeys,
    setSelectedRowKeys,
    searchText,
    setSearchText,
    viewingEntity,
    isViewModalOpen,
    editingEntity,
    isFormModalOpen,
    entitiesToDelete,
    isDeleteModalOpen,
    filteredData,
    handleEdit,
    handleView,
    handleDelete,
    handleBulkDelete,
    handleCreate,
    handleFormClose,
    handleDeleteClose,
    handleViewClose,
  } = useProductTable(data);

  return (
    <>
      <ProductTableToolbar
        searchText={searchText}
        onSearchChange={setSearchText}
        selectedCount={selectedRowKeys.length}
        entityName={entityPage.name}
        entityPlural={entityPage.plural}
        onBulkDelete={handleBulkDelete}
        onCreate={handleCreate}
        categorySelect={categorySelect}
      />
      <div className="flex overflow-y-auto">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          className={styles.customTable}
          loading={isLoading}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          pagination={{
            pageSize: 10,
            showTotal: (total) =>
              `Total: ${total} ${entityPage.plural.toLowerCase()}`,
          }}
          scroll={{ y: 800 }}
          onRow={(record) => ({
            onClick: () => handleView(record),
            style: { cursor: "pointer" },
          })}
        />
      </div>
      <FormModal
        open={isFormModalOpen}
        editingEntity={editingEntity}
        category={category}
        onClose={handleFormClose}
      />

      <ViewModal
        open={isViewModalOpen}
        viewingEntity={viewingEntity}
        onClose={handleViewClose}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProductDeleteModal
        open={isDeleteModalOpen}
        entitiesToDelete={entitiesToDelete}
        entityName={entityPage.name}
        entityPlural={entityPage.plural}
        onClose={handleDeleteClose}
        deleteMutation={deleteMutation}
      />
    </>
  );
}
