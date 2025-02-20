import React, { useEffect, useRef, useState } from "react";
import { LoadingIcon, UploadDecorIcon, XMarkIcon } from "./Icon";
import Button from "./Button";
import { popupCreatePostStore } from "../store/popupStore";
import { TextBox } from "./Field";
import { ownerAccountStore } from "../store/ownerAccountStore";
import { postsApi } from "../api/postsApi";
import { postsStore } from "../store/postsStore";

export default function CreatePost() {
	const { isVisible, setIsVisible } = popupCreatePostStore();

	const insertPost = postsStore((state) => state.insertPost);

	const user = ownerAccountStore((state) => state.user);

	const [fileUploads, setFileUploads] = useState([]);

	const [filePreviews, setFilePreviews] = useState([]);

	const [fileTypes, setFileTypes] = useState([]);

	const textbox = useRef();

	const closePopup = () => {
		setIsVisible(false);
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

		const respCreatePost = await postsApi.createPost(formData);

		if (respCreatePost.statusCode === 200) {
			const postCreated = {
				...respCreatePost.data,
				displayName: user.displayName,
				avatar: user.avatar,
			};
			insertPost(postCreated);
			closePopup();
		}
		setSubmitClicked(false);
	};

	useEffect(() => {
		if (!isVisible) return;
		setTimeout(() => {
			textbox.current.focus();
		}, 100);
	}, [isVisible]);

	return (
		<div
			className={`z-20 fixed inset-0 sm:py-2 bg-black flex items-center justify-center ${
				isVisible ? "bg-opacity-25 visible" : "bg-opacity-0 invisible"
			} 
			ct-transition`}
		>
			<div
				className={`
				pb-3 flex flex-col space-y-3 bg-[--background-clr] rounded-lg overflow-hidden w-[550px]
				sm:h-fit sm:max-h-full
				h-full
				${isVisible ? "translate-y-0" : "translate-y-[100vh]"}	
				ct-transition`}
			>
				<div className="bg-[--background-clr] border-b sticky top-0 py-2">
					<h4 className="text-center">Tạo bài viết</h4>
					<button className="absolute right-0 top-0 h-full px-4" onClick={closePopup}>
						<XMarkIcon />
					</button>
				</div>

				<div className="px-3 overflow-y-auto flex-grow scrollable-div space-y-2">
					<div className="flex space-x-2">
						<img src={`${user.avatar}`} alt="avatar" className="md:size-11 size-9 rounded-full" />
						<div className="flex flex-col justify-center">
							<span className="font-semibold">{user.displayName}</span>
						</div>
					</div>

					<TextBox texboxRef={textbox} className="" placeholder="Nói gì đó về bài viết của bạn" />

					<label
						htmlFor="file-upload"
						className={`rounded-md aspect-video cursor-pointer flex items-center justify-center border-[2px] border-[--gray-extra-light-clr] ${
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
								type="secondary"
								className="z-10 absolute m-2 max-w-7 h-7 right-0 rounded-full"
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
				<div className="sticky bottom-0 mx-3 space-y-2">
					{filePreviews.length > 0 && (
						<Button
							onClick={() => {
								document.querySelector("#file-upload").click();
							}}
							type="secondary"
							className="py-1"
						>
							Thêm ảnh/video
						</Button>
					)}
					<Button className="py-2 w-auto rounded-[4px]" onClick={handleSubmitPost} disabled={submitClicked}>
						{submitClicked ? <LoadingIcon /> : "Đăng bài"}
					</Button>
				</div>
			</div>
		</div>
	);
}
