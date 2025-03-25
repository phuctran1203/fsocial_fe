import { PencilChangeImageIcon } from "@/components/Icon";
import ModalCropImage from "@/components/ModalCropImage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ownerAccountStore } from "@/store/ownerAccountStore";
import { usePopupStore } from "@/store/popupStore";
import { combineIntoAvatarName } from "@/utils/combineName";
import React from "react";

export default function UserAccountBasic() {
	const { user, setUser } = ownerAccountStore();
	const { showPopup, hidePopup } = usePopupStore();

	const handleSelectBanner = (e) => {
		const el = e.target;
		const file = el.files[0];
		if (file) {
			const previewURL = URL.createObjectURL(file);
			console.log("have file");
			showPopup(
				null,
				<ModalCropImage
					image={previewURL}
					ratio={3 / 1}
					acceptCropCallback={(imageCroped) => {
						setUser({ banner: imageCroped });
						hidePopup();
					}}
				/>
			);
		}
	};

	const handleSelectAvatar = (e) => {
		const el = e.target;
		const file = el.files[0];
		if (file) {
			const previewURL = URL.createObjectURL(file);
			console.log("have file");
			showPopup(
				null,
				<ModalCropImage
					image={previewURL}
					ratio={1 / 1}
					acceptCropCallback={(imageCroped) => {
						setUser({ avatar: imageCroped });
						hidePopup();
					}}
				/>
			);
		}
	};

	return (
		<div className="sm:mt-5 mt-2 space-y-5">
			{/* banner */}
			<div className="space-y-3">
				<p className="font-medium">Ảnh bìa</p>
				<div className="relative aspect-[3/1] overflow-hidden lg:rounded-lg border">
					{user.banner ? (
						<img src={user.banner} alt="" />
					) : (
						<div className="size-full grid place-content-center">
							<p>Cập nhật ảnh bìa của bạn</p>
						</div>
					)}
					<label className="btn-secondary w-fit absolute bottom-2 right-2 py-1 ps-2.5 pe-4 border cursor-pointer">
						<PencilChangeImageIcon />
						Đổi ảnh bìa
						<input
							type="file"
							hidden
							onChange={handleSelectBanner}
							onClick={(e) => {
								e.target.value = "";
							}}
						/>
					</label>
				</div>
			</div>
			{/* avatar */}
			<div className="space-y-3">
				<p className="font-medium">Ảnh đại diện</p>
				<div className="relative bg-background border-4 rounded-full p-1 w-fit transition">
					<Avatar className={`size-[120px]`}>
						<AvatarImage src={user.avatar} />
						<AvatarFallback className="text-[40px] transition">
							{combineIntoAvatarName(user.firstName, user.lastName)}
						</AvatarFallback>
					</Avatar>
					<label className="btn-secondary w-fit absolute bottom-0 right-0 p-1 rounded-full shadow border cursor-pointer">
						<input
							type="file"
							hidden
							onChange={handleSelectAvatar}
							onClick={(e) => {
								e.target.value = "";
							}}
						/>
						<PencilChangeImageIcon />
					</label>
				</div>
			</div>
			{/* bio */}
		</div>
	);
}
