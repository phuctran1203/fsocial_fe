import React, { useState } from "react";
import { LogoFSAdmin, LogoutIcon } from "./Icon";
import { adminNavRout } from "@/config/adminNavRoute";
import Button from "./Button";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { themeStore } from "@/store/themeStore";
import styles from "./Nav.module.scss";
import {
  combineIntoAvatarName,
  combineIntoDisplayName,
} from "@/utils/combineName";
import { adminStore } from "@/store/adminStore";
import { Check, Moon, SunMedium } from "lucide-react";
import { useValidRefreshTokenStore } from "@/store/validRefreshTokenStore";

export default function AdminNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const navRoute = adminNavRout;
  const { user } = adminStore();
  const { theme, setTheme } = themeStore();
  const handleSetMode = (modePicked) => {
    setTheme(modePicked);
  };

  const [switchThemeOpen, setSwitchThemeOpen] = useState(false);
  const { setRefreshToken } = useValidRefreshTokenStore();
  const handleLogout = () => {
    setRefreshToken(null);
    navigate("/login");
  };

  return (
    <nav className="rounded-lg w-[280px] flex flex-col flex-shrink-0 bg-background h-full p-5 border shadow">
      <LogoFSAdmin />

      <div className="mt-8 space-y-3 flex-grow">
        {navRoute.map((route, index) => (
          <Button
            key={index}
            to={route.to}
            className={`btn-transparent justify-start p-3 py-3.5 gap-3
                            ${path === route.to && "bg-gray-3light font-medium"}
                            hover:bg-gray-3light`}
          >
            {route.icon}
            {route.name}
          </Button>
        ))}
        <Button
          to="/admin/profile"
          className={`btn-transparent justify-start p-3 py-3.5 gap-3
                        ${path === "/profile" && "bg-gray-3light font-medium"}
                        hover:bg-gray-3light`}
        >
          <Avatar className={`size-[26px]`}>
            <AvatarImage src={"../temp/default_avatar.svg"} />
            <AvatarFallback className="text-[10px] font-semibold">
              {combineIntoAvatarName(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <span>{combineIntoDisplayName(user.firstName, user.lastName)}</span>
        </Button>
      </div>
      <div>
        <Popover onOpenChange={setSwitchThemeOpen}>
          <PopoverTrigger
            className={`group btn-transparent justify-start p-3 py-3.5 gap-3 ${
              switchThemeOpen && "bg-gray-3light"
            }`}
          >
            {theme === "light" ? <SunMedium /> : <Moon />}
            <span>Chế độ hiển thị</span>
            <svg
              className={`ms-auto me-1 sm:group-hover:opacity-100 ${
                switchThemeOpen ? "sm:opacity-100 opacity-0" : "opacity-0"
              } size-4 transition`}
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                className="fill-primary-text"
                d="M12.7053 7.29365C13.0959 7.68428 13.0959 8.31865 12.7053 8.70928L6.70525 14.7093C6.31463 15.0999 5.68025 15.0999 5.28963 14.7093C4.899 14.3187 5.32226 13.5333 5.71289 13.1426L10.856 7.99979L5.42746 2.57122C5.03684 2.18059 4.90213 1.68115 5.29275 1.29053C5.68338 0.899902 6.31775 0.899902 6.70838 1.29053L12.7084 7.29053L12.7053 7.29365Z"
              />
            </svg>
          </PopoverTrigger>

          <PopoverContent
            side={"right"}
            align="end"
            sideOffset={20}
            className="bg-background p-2 sm:w-44 space-y-2 transition"
          >
            <button
              className={`${styles.navMore} !gap-2 border ${
                theme == "light" && "shadow-md"
              }`}
              onClick={() => handleSetMode("light")}
            >
              <SunMedium />
              <span>Sáng</span>
              <Check
                className={`ms-auto size-5 ${theme != "light" && "hidden"}`}
              />
            </button>

            <button
              className={`${styles.navMore} !gap-2 border ${
                theme == "dark" && "bg-gray-2light"
              }`}
              onClick={() => handleSetMode("dark")}
            >
              <Moon />
              <span>Tối</span>
              <Check
                className={`ms-auto size-5 ${theme != "dark" && "hidden"}`}
              />
            </button>
          </PopoverContent>
        </Popover>

        <button
          className={`btn-transparent justify-self-end justify-start p-3 py-3.5 gap-3 hover:bg-gray-3light`}
          onClick={handleLogout}
        >
          <LogoutIcon />
          Đăng xuất
        </button>
      </div>
    </nav>
  );
}
