import { Switch } from "@/components/ui/switch";
import React, { useEffect, useState } from "react";

export default function UserAccountPrivacy() {
	const [hideProfileChecked, setHideProfileChecked] = useState(false);
	const [postReactedChecked, setPostReactedChecked] = useState(false);

	const handleHideProfileChecked = (value) => {
		console.log("click switch: ", value);
		setHideProfileChecked(value);
	};

	const handlePostReactedChecked = (value) => {
		console.log("click switch: ", value);
		setPostReactedChecked(value);
	};
	useEffect(() => {
		// setHideProfileChecked(false);
	}, []);

	return (
		<div className="space-y-5 pt-7">
			<div>
				<p className="mb-3 font-medium">Tài khoản riêng tư</p>
				<div className="border border-field rounded-3xl py-5 px-6 flex items-center justify-between sm:gap-32 gap-2">
					<p>
						Khi bật riêng tư, chỉ những người theo dõi bạn mới có thể nhìn thấy
						bài đăng, hình ảnh, video,... của bạn.
					</p>
					<Switch
						className="bg-gray-2light scale-[85%]"
						checked={hideProfileChecked}
						onCheckedChange={handleHideProfileChecked}
					/>
				</div>
			</div>

			<div>
				<p className="mb-3 font-medium">Bài đăng đã tương tác</p>

				<div className="border border-field rounded-3xl py-5 px-6 flex items-center justify-between sm:gap-32 gap-2">
					<p>
						Cho phép người khác xem bài viết mà bạn đã tương tác khi xem trang
						cá nhân của bạn.
					</p>
					<Switch
						className="bg-gray-2light scale-[85%]"
						checked={postReactedChecked}
						onCheckedChange={handlePostReactedChecked}
					/>
				</div>
			</div>
		</div>
	);
}
