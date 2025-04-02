import {
	FollowerProfileTabIcon,
	PictureProfileTabIcon,
	PostProfileTabIcon,
	ReactedProfileTabIcon,
	VideoProfileTabIcon,
} from "@/components/Icon";

export const listTabs = [
	{
		label: "Bài đăng",
		icon: <PostProfileTabIcon />,
	},
	{
		label: "Hình ảnh",
		icon: <PictureProfileTabIcon />,
	},
	{
		label: "Video",
		icon: <VideoProfileTabIcon />,
	},
	{
		label: "Người theo dõi",
		icon: <FollowerProfileTabIcon />,
	},
	{
		label: "Đã tương tác",
		icon: <ReactedProfileTabIcon />,
	},
];
