import { Outlet, useNavigate } from "@tanstack/react-router";
import { Avatar, Button, ConfigProvider, Divider, Layout, Popover, Select } from "antd";
import { Content } from "antd/es/layout/layout";
import { appSetting, isAdminDomain } from "../../constants/app-setting/config.const";
import { MenuOptions } from "./components/MenuOptions";
import { useAuth } from "../../context/auth-provider";
import { summarizeName } from "../../utils/text.util";
import { useTheme } from "../../context/theme-provider";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { usePartnerQuery } from "../../hooks/partners/usePartnerQuery";
import { useCompanyQuery } from "../../hooks/companies/useCompanyQuery";
import { useAdminScope } from "../../context/admin-scope-provider";
import { useMemo } from "react";
import { useLocation } from "@tanstack/react-router";

const segmentOptions = [
  { label: "Financeiro", value: "finances" },
  { label: "Beneficios", value: "benefits" },
  { label: "Telecom", value: "telecom" },
];

export function LayoutMain() {

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout, isGlobalAdmin } = useAuth();
  const { toggleDarkMode, isDarkMode } = useTheme();
  const {
    selectedSegmentId,
    selectedCompanyId,
    selectedPartnerId,
    setSelectedSegmentId,
    setSelectedCompanyId,
    setSelectedPartnerId,
  } = useAdminScope();
  const shouldShowAdminScope = isAdminDomain && isGlobalAdmin;
  const shouldFetchPartners = shouldShowAdminScope ? selectedCompanyId != null : true;

  const { data: companiesData } = useCompanyQuery({ enabled: shouldShowAdminScope });
  const { data: partnersData } = usePartnerQuery({ enabled: shouldFetchPartners });

  const companyOptions = useMemo(
    () => companiesData?.companies.map((c) => ({ label: c.company_name, value: c.company_id })) ?? [],
    [companiesData],
  );

  const partnerOptions = useMemo(
    () => (partnersData?.partners ?? []).map((p) => ({ label: p.partner_name, value: p.partner_id })),
    [partnersData],
  );

  const previewPartner = user?.user?.partner_id
    ? partnersData?.partners?.find(
      (partner) => partner.partner_id === user.user.partner_id,
    )
    : null;

  const handleSignOut = async () => {
    await logout();

    navigate({
      to: "/login",
      search: { redirect: location.href },
      replace: true,
    });
  };
  const color = appSetting?.primaryColor
  const isChatRoute = pathname === "/app/chat";

  return (
    <Layout>
      <header className="px-6 md:px-10 lg:px-14 py-4 dark:bg-neutral-800 bg-[#c5c5c5] flex items-center justify-between w-full">
        <div className="flex items-center justify-between gap-1 w-full">
          <img className="h-7" src={appSetting.logo} alt="Logo" />

          {(previewPartner?.logo_url || user?.user?.partner_url_logo) && (
            <img
              className="h-7"
              src={previewPartner?.logo_url ?? user?.user?.partner_url_logo}
              alt="Partner Logo"
            />
          )}
        </div>
      </header>

      <div className="bg-[#d4d4d4] dark:bg-neutral-700 px-6 md:px-10 lg:px-14 py-2 flex items-center justify-between w-full" >
        <MenuOptions />
        <div className="flex items-center text-neutral-800 dark:text-neutral-400 gap-3">
          {shouldShowAdminScope && (
            <>
              <Select
                allowClear
                placeholder="Segmento"
                options={segmentOptions}
                value={selectedSegmentId}
                onChange={setSelectedSegmentId}
                style={{ minWidth: 140 }}
              />
              <Select
                allowClear
                placeholder="Empresa"
                options={companyOptions}
                value={selectedCompanyId}
                onChange={setSelectedCompanyId}
                disabled={!selectedSegmentId}
                style={{ minWidth: 140 }}
              />
              <Select
                allowClear
                placeholder="Parceiro"
                options={partnerOptions}
                value={selectedPartnerId}
                onChange={setSelectedPartnerId}
                disabled={!selectedCompanyId}
                style={{ minWidth: 140 }}
              />
            </>
          )}
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  textHoverBg: "transparent",
                },
              },
            }}
          >   <Button
              type="text"
              onClick={toggleDarkMode}
              icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
              className="logout-btn "
            />
            <style>
              {`
              .logout-btn:hover .anticon {
                color: ${color} !important;
                font-size: 17px;
              }
            
              `}
            </style>
            <Popover
              placement="bottomRight"
              content={
                <div>
                  <div className="flex flex-col text-neutral-800 dark:text-neutral-400">
                    <span>{user?.user?.name}</span>
                    <span>{user?.user?.email}</span>
                  </div>

                  <Divider className="my-3!" />

                  <Button
                    type="default"
                    className="w-full"
                    onClick={handleSignOut}
                  >
                    Sair
                  </Button>
                </div>
              }
            >
              <Avatar className="cursor-pointer">
                {user ? summarizeName(user?.user?.name) : ""}
              </Avatar>
            </Popover>
          </ConfigProvider>


        </div>
      </div>

      <Content className={isChatRoute ? "px-0" : "px-6 md:px-10 lg:px-14"}>
        <div
          style={{
            minHeight: 280,
          }}
        >
          <Outlet />
        </div>
      </Content>

      <footer className="flex dark:bg-neutral-800 text-neutral-800 dark:text-neutral-400 bg-[#c5c5c5] items-center justify-between text-sm h-14 px-6 md:px-10 lg:px-14">
        <p className="text-center text-[13px] m-0">
          © {new Date().getFullYear()} – Todos os direitos reservados
        </p>

        <p className="text-center text-[13px] flex items-center gap-1 m-0">
          Powered by
          <img src="/megalead.png" className="h-7" />
        </p>
      </footer>
    </Layout>
  );
}
