import React from "react";
import { TrashCanIcon, XMarkIcon } from "../components/Icon";
import { popupDeletePostStore } from "@/store/popupStore";
import { themeStore } from "@/store/themeStore";
import Button from "./Button";

export default function DeletePostModal() {
	const { id, isVisible, setIsVisible } = popupDeletePostStore();

	const closePopup = () => {
		setIsVisible(false);
	};

	const handleDelete = () => {};

	const theme = themeStore((state) => state.theme);
	return (
		<div
			className={`z-20 fixed inset-0 sm:py-2 bg-black flex items-center justify-center ${
				isVisible ? "bg-opacity-25 visible" : "bg-opacity-0 invisible"
			} 
			transition`}
			onClick={() => setIsVisible(false)}
		>
			<div
				className={`
				mx-5 pb-3 flex flex-col space-y-3 bg-background rounded-lg overflow-hidden w-[500px] ${theme === "dark" && "sm:border"}
				h-fit
				${isVisible ? "translate-y-0" : "translate-y-[100vh]"}	
				transition-all`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="bg-background sticky top-0 py-3">
					<h4 className="text-center">Xóa bài viết</h4>
					<button className="absolute right-0 top-0 h-full px-4" onClick={closePopup}>
						<XMarkIcon />
					</button>
				</div>

				<div className="flex justify-center my-4">
					<img src="./decor/delete_post_decor.svg" alt="Delete Illustration" className="w-36 h-36" />
				</div>
				<h5 className="font-normal text-center">
					Sau khi xóa, bài viết sẽ <span className="text-primary font-semibold">không thể</span> khôi phục.
					<br /> Bạn vẫn xác nhận xóa?
				</h5>
				<div className="px-3 flex justify-between mt-6 gap-3">
					<Button className="btn-primary py-3" onClick={closePopup}>
						Hủy bỏ xóa
					</Button>

					<Button className="btn-secondary py-3 gap-2" onClick={handleDelete}>
						<TrashCanIcon className="size-5" /> Xác nhận xóa
					</Button>
				</div>
			</div>
		</div>
	);
}
