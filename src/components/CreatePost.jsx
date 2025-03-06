import React, { useEffect, useRef, useState } from "react";
import { LoadingIcon, UploadDecorIcon, XMarkIcon } from "./Icon";
import Button from "./Button";
import { usePopupStore } from "../store/popupStore";
import { TextBox } from "./Field";
import { ownerAccountStore } from "../store/ownerAccountStore";
import { createPost } from "../api/postsApi";
import { postsStore } from "../store/postsStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function CreatePost() {
	const { isOpen, hidePopup } = usePopupStore();

	const insertPost = postsStore((state) => state.insertPost);

	const user = ownerAccountStore((state) => state.user);

	const [fileUploads, setFileUploads] = useState([]);

	const [filePreviews, setFilePreviews] = useState([]);

	const [fileTypes, setFileTypes] = useState([]);

	const textbox = useRef();

	const closePopup = () => {
		hidePopup(false);
		textbox.current.innerHTML = "";
		setFileUploads([]);
		setFilePreviews([]);
		setFileTypes([]);
	};

	const handleOnFileChange = (e) => {
		const files = e.target.files;
		const previewUrls = [];
		const types = [];

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const type = file.type.split("/")[0];
			previewUrls.push(URL.createObjectURL(file));
			types.push(type);
		}

		// Cập nhật trạng thái đúng cách
		setFileUploads((prev) => {
			return [...prev, ...files]; // Chuyển files thành mảng nếu cần
		});

		setFilePreviews((prev) => {
			return [...prev, ...previewUrls];
		});

		setFileTypes((prev) => {
			return [...prev, ...types];
		});
	};

	const deleteFile = (index) => {
		setFileUploads((prev) => {
			const newArr = [...prev];
			newArr.splice(index, 1);
			return newArr;
		});
		setFilePreviews((prev) => {
			const newArr = [...prev];
			newArr.splice(index, 1);
			return newArr;
		});
		setFileTypes((prev) => {
			const newArr = [...prev];
			newArr.splice(index, 1);
			return newArr;
		});
	};

	const [submitClicked, setSubmitClicked] = useState(false);

	const handleSubmitPost = async () => {
		setSubmitClicked(true);

		const formData = new FormData();
		formData.append("userId", user.userId);
		formData.append("text", textbox.current.innerText);
		formData.append("HTMLText", textbox.current.innerHTML);
		fileUploads.forEach((file) => {
			formData.append("media", file);
		});

		const respCreatePost = await createPost(formData);

		if (respCreatePost.statusCode === 100) {
			const postCreated = {
				...respCreatePost.data,
				displayName: user.firstName + " " + user.lastName,
				avatar: user.avatar,
			};
			insertPost(postCreated);
			toast.success("Bài viết của bạn đã được đăng tải");
			closePopup();
		}
		setSubmitClicked(false);
	};

	return (
		<div className="relative flex-grow flex flex-col sm:w-[550px] w-screen sm:h-fit sm:max-h-[90dvh] h-[100dvh]">
			<div className="overflow-y-auto flex-grow scrollable-div space-y-2">
				<div className="flex space-x-2 px-3 pt-3">
					<Avatar className={`md:size-11 size-9 grid`}>
						<AvatarImage src={user.avatar} />
						<AvatarFallback className="font-semibold">{user.firstName.charAt(0) ?? "?"}</AvatarFallback>
					</Avatar>

					<div className="flex flex-col justify-center">
						<span className="font-semibold">{user.firstName + " " + user.lastName}</span>
					</div>
				</div>

				<TextBox texboxRef={textbox} autoFocus={true} placeholder="Nói gì đó về bài viết của bạn" className="px-3" />

				<label
					htmlFor="file-upload"
					className={`mx-3 rounded-md aspect-video cursor-pointer flex items-center justify-center border-[2px] border-gray-2light ${
						fileUploads.length > 0 ? "hidden" : ""
					}`}
					onDragOver={(e) => {
						e.preventDefault(); // Chặn hành động mặc định để không mở tệp
						e.stopPropagation();
						e.currentTarget.style = `background-color: black; opacity: 20%;`;
					}}
					onDragLeave={(e) => {
						e.currentTarget.style = "";
					}}
					onDrop={(e) => {
						e.preventDefault();
						e.stopPropagation();
						const files = e.dataTransfer.files;
						if (files.length > 0) {
							handleOnFileChange({ target: { files } }); // Gọi hàm xử lý tệp
						}
					}}
				>
					<div className="flex flex-col items-center pointer-events-none">
						<UploadDecorIcon className="size-24" />
						<span>Chọn hoặc kéo thả ảnh/video vào đây</span>
					</div>
					<input type="file" id="file-upload" onChange={handleOnFileChange} hidden multiple />
				</label>

				{filePreviews.map((preview, index) => (
					<div key={index} className="relative">
						<Button
							className="btn-secondary z-10 absolute m-2 max-w-7 h-7 right-0 rounded-full shadow-md"
							onClick={() => deleteFile(index)}
						>
							<XMarkIcon className="size-[15px] pointer-events-none" />
						</Button>
						{fileTypes[index] === "image" ? (
							<img src={preview} alt={`Preview ${index}`} className="w-full h-auto" />
						) : fileTypes[index] === "video" ? (
							<video controls className="w-full h-auto">
								<source src={preview} type="video/mp4" />
								Your browser does not support the video tag.
							</video>
						) : null}
					</div>
				))}
			</div>

			<div className="z-10 sticky bottom-0 space-y-3 p-3">
				{filePreviews.length > 0 && (
					<Button
						onClick={() => {
							document.querySelector("#file-upload").click();
						}}
						className="btn-secondary py-2.5"
					>
						Thêm ảnh/video
					</Button>
				)}

				<Button className={`btn-primary py-2.5 ${submitClicked && "disable-btn"}`} onClick={handleSubmitPost}>
					{submitClicked ? <LoadingIcon /> : "Đăng bài"}
				</Button>
			</div>
		</div>
	);
}
