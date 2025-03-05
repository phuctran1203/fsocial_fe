import { ComplaintIcon, PolicySettingIcon, StatisticalIcon, UserManagementIcon } from "@/components/Icon";

export const adminNavRout = [
	{
		name: "Khiếu nại",
		to: "/admin/complaint",
		icon: <ComplaintIcon className="size-6" />,
	},
	{
		name: "Quản lý người dùng",
		to: "/admin/user-management",
		icon: <UserManagementIcon />,
	},
	{
		name: "Thống kê",
		to: "/admin/statistical",
		icon: <StatisticalIcon />,
	},
	{
		name: "Cài đặt chính sách",
		to: "/admin/policy-setting",
		icon: <PolicySettingIcon />,
	},
];
