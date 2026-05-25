import { useTheme } from "@/context/theme-provider";
import { createStyles } from "antd-style";
import { appSetting } from "@/constants/app-setting/config.const";
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
      /* Coloração de linhas por disponibilidade */
      .ant-table-tbody > tr.ant-table-row-green > td {
        background-color: #e6ffed !important;
      }
      .ant-table-tbody > tr.ant-table-row-green:hover > td {
        background-color: #c6f6d5 !important;
      }
      .ant-table-tbody > tr.ant-table-row-yellow > td {
        background-color: #fff6c7 !important;
      }
      .ant-table-tbody > tr.ant-table-row-yellow:hover > td {
        background-color: #fdeea0 !important;
      }
      .ant-table-tbody > tr.ant-table-row-red > td {
        background-color: #ffeaea !important;
      }
      .ant-table-tbody > tr.ant-table-row-red:hover > td {
        background-color: #ffc9c9 !important;
      }
      .ant-table-pagination {
        display: flex;
        justify-content: center;
        margin-top: 16px; 
        colorText: "${appSetting.primaryColor}",
        colorTextActive: "${appSetting.primaryColor}", 
      }
    `,
  };
});

export function useStyle() {
  const { isDarkMode } = useTheme();
  return useTableStyles(isDarkMode);
}
