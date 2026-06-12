

import { Button, ConfigProvider, Modal, Table, Typography } from "antd";
import { useEvolutionFilterController } from "./controllers/filterController";
import { useState } from "react";
import { ModalCreateEvolution } from "./modals/modalCreate";
import ModalQRCode from "./modals/modalQRCode";
import { useEvolutionController } from "./controllers/dataController";
import { customLocale } from "@/chat-uberich/utils/customLocale";

// import { useEvolutionController } from "./controllers/dataController";

export default function Evolution() {
  const handleDeleteItem = (item: any) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };
  const handleOpenQRCodeItem = (item: any) => {
    setSelectedItem(item);
    setShowQRCodeModal(true);
  };
  const handleOpenDisconnectItem = (item: any) => {
    setSelectedItem(item);
    setShowDisconnectModal(true);
  };

  const [instanceName, setInstanceName] = useState<string | null>(null);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const {
    isFetching,
    evolution,
    createEvolutionInstance,
    removeEvolutionInstance,
    qrCodeQuery,
    isQRCodeFetching,
    disconnectEvolutionInstance,
  } = useEvolutionController(instanceName || undefined, showQRCodeModal);

  const { columns, styles } = useEvolutionFilterController({
    onDeleteItem: handleDeleteItem,
    onOpenQRCodeItem: handleOpenQRCodeItem,
    setInstanceName,
    onOpenDisconnectItem: handleOpenDisconnectItem,
  });
  const [showdModal, setShowModal] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  return (
    <>

      <div className="py-6 min-h-[calc(100vh-160px)]">

        <div className="w-full">
          <div className="flex  gap-8 justify-between">
            <Typography.Title level={3} style={{ marginBottom: 16 }}>
              Contas Conectadas
            </Typography.Title>
            <div>
              <ConfigProvider
                theme={{
                  components: {
                    Button: {
                      colorBorder: "#0026d9",
                      colorText: "#0026d9",
                      colorPrimary: "#0026d9",

                    },
                  },
                }}
              >
                <Button onClick={() => setShowModal(true)}>
                  Conectar conta
                </Button>
              </ConfigProvider>
            </div>
          </div>

          {/* Filtro */}
          {/* <FiltroOrderWorkspaceForm
                control={control}
                handleSubmit={handleSubmit}
                onClear={clearFilters}
                onSubmit={onSubmit}
                ordersWorkspace={ordersWorkspace}
                selectedRowKeys={selectedRowKeys}
              /> */}

        </div>
        <ConfigProvider
          locale={customLocale}
          theme={{
            token: {
              colorPrimary: "#0026d9",
              colorPrimaryHover: "#0026d9",
              colorLink: "#0026d9",
              colorPrimaryBg: "transparent",
            },
            components: {
              Checkbox: {
                borderRadius: 4,
                colorPrimary: "#0026d9",
                colorPrimaryHover: "#0026d9",
                controlInteractiveSize: 18,
                lineWidth: 2,
              },
            },
          }}
        >
          {/* Tabela */}
          <div className="overflow-y-auto ">
            <Table<any>
              className={styles.customTable}
              columns={columns}
              dataSource={evolution}
              loading={isFetching}
            //     onRow={(record) => ({
            //       onClick: () => {
            //         setSelectedWorkspaceOrder(record);
            //         showModal();
            //       },
            //       style: { cursor: "pointer" },
            //     })}
            //     pagination={{
            //       current: currentPage,
            //       onChange: (page, pageSize) => {
            //         const params = new URLSearchParams(window.location.search);
            //         params.set("page", page.toString());
            //         params.set("limit", pageSize.toString());
            //         navigate(`?${params.toString()}`);
            //       },
            //       pageSize: pageSize,
            //       pageSizeOptions: ["50", "100", "200", "500"],
            //       showLessItems: true,
            //       showSizeChanger: true,
            //       showTotal: (total) => `Total de ${total} pedidos`,
            //       total: totalItems,
            //     }}
            //     rowClassName={(record) => rowClassName(record) ?? ""}
            //     rowKey="id"
            //     rowSelection={rowSelection}
            //   />
            />
          </div>
        </ConfigProvider>
      </div>
      <ModalCreateEvolution
        showModal={showdModal}
        setShowModal={setShowModal}
        createEvolutionInstance={createEvolutionInstance}
      />
      <ModalQRCode
        showModal={showQRCodeModal}
        setShowModal={setShowQRCodeModal}
        isQRCodeFetching={isQRCodeFetching}
        qrCodeQuery={qrCodeQuery}
      />
      <ModalDelete
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        selectedItem={selectedItem}
        removeEvolutionInstance={removeEvolutionInstance}
      />
      <ModalDisconnect
        showDisconnectModal={showDisconnectModal}
        setShowDisconnectModal={setShowDisconnectModal}
        selectedItem={selectedItem}
        disconnectEvolutionInstance={disconnectEvolutionInstance}
      />

    </>
  );
}

export function ModalDelete({
  showDeleteModal,
  setShowDeleteModal,
  selectedItem,
  removeEvolutionInstance,
}: {
  showDeleteModal: boolean;
  setShowDeleteModal: (show: boolean) => void;
  selectedItem: any | null;
  removeEvolutionInstance: any;
}) {
  const handleDelete = () => {
    if (selectedItem) {
      removeEvolutionInstance(selectedItem?.name);
    }
    setShowDeleteModal(false);
  };

  return (
    <>
      <Modal
        centered
        title={
          <span style={{ color: "#252525" }}>
            Tem certeza que deseja remover essa conta?
          </span>
        }
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        footer={null}
        width={600}
      >
        {selectedItem && (
          <div className="mb-4">
            <p>
              <strong>Nome:</strong> {selectedItem.name}
            </p>
          </div>
        )}
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorBorder: "#0026d9",
                colorText: "#0026d9",
                colorPrimary: "#0026d9",
                colorPrimaryHover: "#0026d9",
              },
            },
          }}
        >
          <div
            className="flex justify-end gap-4 z-10"
            style={{
              position: "sticky",
              bottom: -1,
              left: 0,
              right: 0,
              paddingTop: "8px",
              paddingBottom: "8px",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setShowDeleteModal(false)}
              style={{
                fontSize: "14px",
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="outlined"
              onClick={handleDelete}
              style={{
                fontSize: "14px",
              }}
              danger
            >
              Remover
            </Button>
          </div>
        </ConfigProvider>
      </Modal>
    </>
  );
}

export function ModalDisconnect({
  showDisconnectModal,
  setShowDisconnectModal,
  selectedItem,
  disconnectEvolutionInstance,
}: {
  showDisconnectModal: boolean;
  setShowDisconnectModal: (show: boolean) => void;
  selectedItem: any | null;
  disconnectEvolutionInstance: any;
}) {
  const handleDisconnect = () => {
    if (selectedItem) {
      disconnectEvolutionInstance(selectedItem?.name);
    }
    setShowDisconnectModal(false);
  };

  return (
    <>
      <Modal
        centered
        title={
          <span style={{ color: "#252525" }}>
            Tem certeza que deseja desconectar essa conta?
          </span>
        }
        open={showDisconnectModal}
        onCancel={() => setShowDisconnectModal(false)}
        footer={null}
        width={600}
      >
        {selectedItem && (
          <div className="mb-4">
            <p>
              <strong>Nome:</strong> {selectedItem.name}
            </p>
          </div>
        )}
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorBorder: "#0026d9",
                colorText: "#0026d9",
                colorPrimary: "#0026d9",
                colorPrimaryHover: "#0026d9",
              },
            },
          }}
        >
          <div
            className="flex justify-end gap-4 z-10"
            style={{
              position: "sticky",
              bottom: -1,
              left: 0,
              right: 0,
              paddingTop: "8px",
              paddingBottom: "8px",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setShowDisconnectModal(false)}
              style={{
                fontSize: "14px",
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="outlined"
              onClick={handleDisconnect}
              style={{
                fontSize: "14px",
              }}
              danger
            >
              Desconectar
            </Button>
          </div>
        </ConfigProvider>
      </Modal>
    </>
  );
}
