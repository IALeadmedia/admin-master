import { useMemo, useState } from "react";
import { Table } from "antd";
import type { Key } from "react";
import type { TableColumnsType } from "antd";
import { useAllTableColumns } from "./columns";
import { TableToolbar } from "./table-toolbar";
import { FormModal } from "./form-modal";
import { DeleteConfirmModal } from "./delete-confirm-modal";
import { entityPage } from "../config-page.const";
import { useStyle } from "@/style/tableStyle";
import { ViewModal } from "./view-modal";
import type { IOrderTelecom } from "@/types/IOrder.type";
import { useAuth } from "@/context/auth-provider";
import { can } from "@/helpers/access-control.helper";

interface CompaniesTableProps {
    data: IOrderTelecom[];
    isLoading: boolean;
    columns?: TableColumnsType<IOrderTelecom>;
    categorySelect?: {
        options: Array<{ label: string; value: string }>;
        value?: string;
        onChange: (value: string) => void;
    };
}

export function TableMain({ data, isLoading, columns, categorySelect }: CompaniesTableProps) {
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const [searchText, setSearchText] = useState("");
    const [viewingEntity, setViewingEntity] = useState<IOrderTelecom | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingEntity, setEditingEntity] = useState<IOrderTelecom | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [entitiesToDelete, setEntitiesToDelete] = useState<IOrderTelecom[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { user } = useAuth();
    const canDeleteOrders = can(user?.user?.role, "orders", "delete");
    const { styles } = useStyle();
    const filteredData = useMemo(() => {
        if (!searchText) return data;
        const lower = searchText.toLowerCase();
        return data.filter(
            (u) =>

                u.email?.toLowerCase().includes(lower),
        );
    }, [data, searchText]);

    function handleEdit(record: IOrderTelecom) {
        setEditingEntity(record);
        setIsFormModalOpen(true);
        setIsViewModalOpen(false);
    }
    function handleView(record: IOrderTelecom) {
        setViewingEntity(record);
        setIsViewModalOpen(true);
    }
    function handleDelete(record: IOrderTelecom) {
        setIsViewModalOpen(false);
        setEntitiesToDelete([record]);
        setIsDeleteModalOpen(true);
    }

    function handleBulkDelete() {
        const selected = data.filter((u) => selectedRowKeys.includes(u.id));
        setEntitiesToDelete(selected);
        setIsDeleteModalOpen(true);
    }


    function handleFormClose() {
        setIsFormModalOpen(false);
        setEditingEntity(null);
    }

    function handleDeleteClose() {
        setIsDeleteModalOpen(false);
        setEntitiesToDelete([]);
        setSelectedRowKeys([]);
    }
    function handleViewClose() {
        setIsViewModalOpen(false);
        setViewingEntity(null);
    }
    const resolvedColumns = useAllTableColumns({ columns });

    return (
        <>
            <TableToolbar
                searchText={searchText}
                onSearchChange={setSearchText}
                selectedCount={selectedRowKeys.length}
                onBulkDelete={handleBulkDelete}
                canDelete={canDeleteOrders}
                categorySelect={categorySelect}

            />
            <div className="flex overflow-y-auto">
                <Table
                    rowKey="id"
                    columns={resolvedColumns}
                    dataSource={filteredData}
                    className={styles.customTable}
                    loading={isLoading}
                    rowSelection={
                        canDeleteOrders
                            ? {
                                selectedRowKeys,
                                onChange: setSelectedRowKeys,
                            }
                            : undefined
                    }
                    pagination={{
                        pageSize: 10,
                        showTotal: (total) =>
                            `Total: ${total} ${entityPage.plural.toLowerCase()}`,
                    }}
                    scroll={{ y: 800 }}
                    onRow={(record) => ({
                        onClick: () => handleView(record),
                        style: { cursor: 'pointer' },
                    })}
                />
            </div>
            <FormModal
                open={isFormModalOpen}
                editingEntity={editingEntity}
                onClose={handleFormClose}
            />

            <ViewModal
                open={isViewModalOpen}
                viewingEntity={viewingEntity}
                onClose={handleViewClose}
                onEdit={(entity: IOrderTelecom) => {
                    handleEdit(entity);
                }}
                onDelete={(entity: IOrderTelecom) => {
                    handleDelete(entity);
                }}
                canDelete={canDeleteOrders}
            />
            <DeleteConfirmModal
                open={isDeleteModalOpen}
                entitiesToDelete={entitiesToDelete}
                onClose={handleDeleteClose}
            />
        </>
    );
}
