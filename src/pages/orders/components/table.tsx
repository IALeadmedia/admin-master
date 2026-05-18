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

interface CompaniesTableProps {
    data: IOrderTelecom[];
    isLoading: boolean;
    columns?: TableColumnsType<IOrderTelecom>;
}

export function TableMain({ data, isLoading, columns }: CompaniesTableProps) {
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const [searchText, setSearchText] = useState("");
    const [viewingEntity, setViewingEntity] = useState<IOrderTelecom | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingEntity, setEditingEntity] = useState<IOrderTelecom | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [entitiesToDelete, setEntitiesToDelete] = useState<IOrderTelecom[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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

            />
            <div className="flex overflow-y-auto">
                <Table
                    rowKey="id"
                    columns={resolvedColumns}
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
            />
            <DeleteConfirmModal
                open={isDeleteModalOpen}
                entitiesToDelete={entitiesToDelete}
                onClose={handleDeleteClose}
            />
        </>
    );
}
