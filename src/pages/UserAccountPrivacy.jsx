import { Switch } from "@/components/ui/switch";
import React, { useEffect, useState } from "react";

export default function UserAccountPrivacy() {
	const [checked, setChecked] = useState(false);

	const handlechecked = (value) => {
		console.log("click switch: ", value);
		setChecked(value);
	};
	useEffect(() => {
		setChecked(false);
	}, []);
	return (
		<div className="space-y-4 pt-7">
			<p className="font-medium">Tài khoản riêng tư</p>
			<div className="border rounded-3xl py-5 px-6 flex items-center justify-between sm:gap-32 gap-2">
				<p>
					Khi bật riêng tư, chỉ những người theo dõi bạn mới có thể nhìn thấy
					bài đăng, hình ảnh, video,... của bạn.
				</p>
				<Switch
					className="bg-gray-2light scale-[85%]"
					checked={checked}
					onCheckedChange={handlechecked}
				/>
			</div>
		</div>
	);
}
