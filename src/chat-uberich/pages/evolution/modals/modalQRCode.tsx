import { ConfigProvider, Modal, Spin } from "antd";
import { QRCodeSVG } from "qrcode.react";
import { useEffect } from "react";

export default function ModalQRCode({
  showModal,
  setShowModal,
  qrCodeQuery,
  isQRCodeFetching,
  connectionStatus,
}: {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  qrCodeQuery: any;
  isQRCodeFetching: any;
  connectionStatus?: string;
}) {
  const handleClose = () => {
    setShowModal(false);
  };
  const isLoading = isQRCodeFetching || !qrCodeQuery || !qrCodeQuery.code;

  useEffect(() => {
    if (connectionStatus === "open" && showModal) {
      setShowModal(false);
    }
  }, [connectionStatus, showModal, setShowModal]);

  return (
    <>
      <Modal
        centered
        title={<span style={{ color: "#252525" }}>Habilitar conta </span>}
        open={showModal}
        onCancel={handleClose}
        footer={null}
        width={600}
      >
        <ConfigProvider
          theme={{
            components: {
              Input: {
                hoverBorderColor: "#660099",
                activeBorderColor: "#660099",
                activeShadow: "none",
                colorBorder: "#bfbfbf",
                colorTextPlaceholder: "#666666",
              },
              Button: {
                colorBorder: "#660099",
                colorText: "#660099",
                colorPrimary: "#660099",
                colorPrimaryHover: "#883fa2",
              },
            },
          }}
        >
          <div
            className="flex flex-col justify-center items-center gap-4"
            style={{ minHeight: 220 }}
          >
            {isLoading ? (
              <Spin size="large" />
            ) : (
              <QRCodeSVG value={qrCodeQuery.code} size={200} />
            )}
          </div>
        </ConfigProvider>
      </Modal>
    </>
  );
}
