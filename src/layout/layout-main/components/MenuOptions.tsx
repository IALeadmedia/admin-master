import { useNavigate } from "@tanstack/react-router";
import { ConfigProvider, Dropdown } from "antd";
import { type JSX } from "react";
import { appSetting } from "../../../constants/app-setting/config.const";
import { useAuth } from "@/context/auth-provider";
import { canAccessRoute } from "@/helpers/access-control.helper";

export function MenuOptions(): JSX.Element {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentRole = user?.user?.role;
  const color = appSetting?.primaryColor;
  function navigeteTo(to?: string) {
    if (to) navigate({ to });
  }


  return (
    <div className="flex gap-6 text-neutral-800 dark:text-neutral-400">
      <ConfigProvider
        theme={{
          components: {
            Button: {
              textHoverBg: "transparent"
            },
          },
        }}
      >
        {appSetting.optionsMenu.map((item, index) => {
          const subItems = (item.items ?? [])
            .filter((subItem) => canAccessRoute(currentRole, subItem.to))
            .map((subItem, idx) => ({
              key: `${index}-${idx}`,
              label: <a onClick={() => navigeteTo(subItem.to)}>{subItem.label}</a>,
            }));

          if (subItems.length > 0)
            return (
              <Dropdown
                key={index}
                menu={{ items: subItems }}
                placement="bottomLeft"
                arrow={{ pointAtCenter: true }}
              >
                <a
                  key={index}
                  onClick={() => navigeteTo(item.to)}
                  className="logout-btn cursor-pointer text-[14px] "
                >
                  {item.label}
                </a>
              </Dropdown>
            );

          if (!item.to || !canAccessRoute(currentRole, item.to)) return null;

          return (
            <a
              key={index}
              onClick={() => navigeteTo(item.to)}
              className="logout-btn dark cursor-pointer text-[14px] "
            >
              {item.label}
            </a>
          );
        })}
        <style>
          {`
              .logout-btn:hover  {
                color: ${color} !important;
                font-weight: 500;
              }
         
    }
              `}
        </style>
      </ConfigProvider>

    </div>
  );
}
