import React, { useEffect, useRef } from "react";
import { XMarkIcon } from "./Icon";
import Button from "./Button";

export default function CreatePost() {
	const textbox = useRef();

	const handleSubmitPost = () => {
		console.log(textbox.current.innerHTML);
	};

	return (
		<div className="z-20 absolute size-full bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-[--background-clr] rounded w-[600px] overflow-y-auto h-fit max-h-full scrollable-div">
				<div className="bg-[--background-clr] border-b sticky top-0 py-2">
					<h4 className="text-center">Tạo bài viết</h4>
					<button className="absolute right-0 top-0 h-full px-4" onClick={() => {}}>
						<XMarkIcon />
					</button>
				</div>

				<div className="flex space-x-2">
					<img src={`./temp/user_1.png`} alt="avatar" className="md:size-12 size-9 rounded-full" />
					<div className="flex flex-col justify-center">
						<span className="font-semibold">Phúc Trần</span>
					</div>
				</div>
				<div ref={textbox} className="w-full" contentEditable="true"></div>
				<Button className="py-2" onClick={handleSubmitPost}>
					Đăng bài
				</Button>
			</div>
		</div>
	);
}
