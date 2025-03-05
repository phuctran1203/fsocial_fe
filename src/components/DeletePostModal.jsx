import React, { useState } from "react";
import { LoadingIcon, TrashCanIcon } from "../components/Icon";
import { usePopupStore } from "@/store/popupStore";
import Button from "./Button";
import { toast } from "sonner";
import { deletePost } from "@/api/postsApi";
import { postsStore } from "@/store/postsStore";

export default function DeletePostModal({ id }) {
	const hidePopup = usePopupStore((state) => state.hidePopup);

	const deletePostInStore = postsStore((state) => state.deletePost);

	const closePopup = () => {
		hidePopup();
	};

	const [deleteClicked, setDeleteClicked] = useState(false);

	const handleDelete = async () => {
		setDeleteClicked(true);
		const respDelete = await deletePost(id);
		if (respDelete?.statusCode === 200) {
			toast.success("Đã xóa bài viết");
			deletePostInStore(id);
			hidePopup();
		} else {
			toast.error("Xóa bài viết thất bại");
			setDeleteClicked(false);
		}
	};

	return (
		<div className="sm:w-[500px] w-[90vw]">
			<div className="flex justify-center my-4">
				<img src="./decor/delete_post_decor.svg" alt="Delete Illustration" className="w-36 h-36" />
			</div>

			<h5 className="font-normal text-center">
				Sau khi xóa, bài viết sẽ <span className="text-primary font-semibold">không thể</span> khôi phục.
				<br /> Bạn vẫn xác nhận xóa?
			</h5>

			<div className="p-3 flex justify-between mt-6 gap-3">
				<Button className="btn-primary py-3" onClick={closePopup}>
					Hủy bỏ xóa
				</Button>

				<Button className={`btn-secondary py-3 gap-2 ${deleteClicked && "disable-btn"}`} onClick={handleDelete}>
					{deleteClicked ? (
						<LoadingIcon stroke="stroke-gray-light" />
					) : (
						<>
							<TrashCanIcon className="size-5" /> <span> Xác nhận xóa</span>
						</>
					)}
				</Button>
			</div>
		</div>
	);
}
