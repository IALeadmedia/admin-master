
import { Button, ConfigProvider, Input, Modal } from "antd";
import { useState } from "react";

export function ModalCreateEvolution({
  showModal,
  setShowModal,
  createEvolutionInstance,
}: {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  createEvolutionInstance: any;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const selectedClientId = import.meta.env.VITE_CLIENT_ID;
  const handleClose = () => {
    setShowModal(false);
    setName("");
    setPhone("");
  };

  const handleSave = () => {
    createEvolutionInstance({
      instanceName: name,
      number: phone,
      qrcode: true,
      clientId: selectedClientId,
    });
    handleClose();
  };
  return (
    <>
      <Modal
        centered
        title={<span style={{ color: "#252525" }}>Conectar conta </span>}
        open={showModal}
        onCancel={handleClose}
        footer={null}
        width={600}
      >
        <ConfigProvider
          theme={{
            components: {
              Input: {
                hoverBorderColor: "#0026d9",
                activeBorderColor: "#0026d9",
                activeShadow: "none",
                colorBorder: "#bfbfbf",
                colorTextPlaceholder: "#666666",
              },
              Button: {
                colorBorder: "#0026d9",
                colorText: "#0026d9",
                colorPrimary: "#0026d9",

              },
            },
          }}
        >
          <div className="flex flex-col gap-4">
            {/* Campo Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-[16px] font-light text-[#353535]"
                placeholder="Digite o nome..."
              />
            </div>

            {/* Campo Telefone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-[16px] font-light text-[#353535]"
                placeholder="Digite o telefone..."
              />
            </div>
          </div>
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

              onClick={handleClose}
              style={{
                fontSize: "14px",
              }}
            >
              Cancelar
            </Button>
            <Button

              onClick={handleSave}
              style={{
                fontSize: "14px",
              }}
            >
              Salvar
            </Button>
          </div>
        </ConfigProvider>
      </Modal>
    </>
  );
}
