import { useTheme } from "@/context/theme-provider";
import { createStyles } from "antd-style";

const useTableStyles = createStyles(({ css }, isDarkMode: boolean) => {
  const headerBg = isDarkMode ? "#2b2b2b" : "#e9e9e9";
  const headerColor = isDarkMode ? "#fff" : "#000";
  const bodyBg = isDarkMode ? "#1f1f1f" : "#fff";
  const hoverBg = isDarkMode ? "#333" : "#e9e9e9";
  return {
    customTable: css`
      .ant-table-container .ant-table-body,
      .ant-table-container .ant-table-content {
        scrollbar-width: thin;
        scrollbar-color: #eaeaea transparent;
        scrollbar-gutter: stable;
      }
      /* Diminui fonte do header */
      .ant-table-thead > tr > th {
        font-size: 12px !important;
      }
      /* Diminui fonte do body */
      .ant-table-tbody > tr > td {
        font-size: 12px !important;
      }
      /* Cor de fundo do header */
      .ant-table-thead > tr > th {
        background: ${headerBg} ;
        color: ${headerColor} ;
      }
      /* Cor de fundo do body */
      .ant-table-tbody > tr > td {
        background: ${bodyBg} !important;
      }
      /* Destaca a linha ao passar o mouse (mantém o efeito padrão do Ant Design) */
      .ant-table-tbody > tr.ant-table-row:hover > td {
        background: ${hoverBg} !important;
      }
      .ant-table-pagination {
        display: flex;
        justify-content: center;
        margin-top: 16px; 
        colorText: "#0026d9",
        colorTextActive: "#0026d9", 
      }
    `,
  };
});

export function useStyle() {
  const { isDarkMode } = useTheme();
  return useTableStyles(isDarkMode);
}
