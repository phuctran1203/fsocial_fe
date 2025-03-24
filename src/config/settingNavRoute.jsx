import { LockKeyholeIcon, ShieldCheckIcon, UserRound } from "lucide-react";

export const settingNavRoute = [
	{
		to: "/setting/account",
		icon: <UserRound />,
		content: "Thông tin cá nhân",
	},
	{
		to: "/setting/login-infomation",
		icon: <LockKeyholeIcon />,
		content: "Thông tin đăng nhập",
	},
	{
		to: "/setting/account-privacy",
		icon: <ShieldCheckIcon />,
		content: "Cài đặt riêng tư",
	},
];
