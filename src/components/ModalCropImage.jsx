import React, { useState } from "react";
import Cropper from "react-easy-crop";
import { LoadingIcon } from "./Icon";
import { cn } from "@/lib/utils";

export default function ModalCropImage({ image, ratio, acceptCropCallback }) {
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
	const [submitClicked, setSubmitClicked] = useState(false);

	const onCropComplete = (croppedArea, croppedAreaPixels) => {
		console.log(croppedArea, croppedAreaPixels);
		setCroppedAreaPixels(croppedAreaPixels);
	};

	// Hàm lấy ảnh đã crop ở định dạng PNG
	const getCroppedImage = async () => {
		if (!image || !croppedAreaPixels) return null;

		const imageObj = new Image();
		imageObj.src = image;
		await new Promise((resolve) => (imageObj.onload = resolve));

		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		canvas.width = croppedAreaPixels.width;
		canvas.height = croppedAreaPixels.height;

		ctx.drawImage(
			imageObj,
			croppedAreaPixels.x,
			croppedAreaPixels.y,
			croppedAreaPixels.width,
			croppedAreaPixels.height,
			0,
			0,
			croppedAreaPixels.width,
			croppedAreaPixels.height
		);

		return new Promise((resolve) => {
			canvas.toBlob((blob) => {
				resolve(blob);
			}, "image/png"); // Xuất ảnh dưới dạng PNG
		});
	};

	const handleAccept = async () => {
		setSubmitClicked(true);
		const croppedImageBlob = await getCroppedImage();
		if (croppedImageBlob) {
			const croppedURL = URL.createObjectURL(croppedImageBlob);
			acceptCropCallback(croppedURL);
		}
		setSubmitClicked(false);
	};

	return (
		<div className="sm:w-[600px] w-[90vw] sm:h-fit p-2">
			<div className="relative w-full aspect-[4/3] overflow-hidden">
				<Cropper
					image={image}
					crop={crop}
					zoom={zoom}
					aspect={ratio}
					onCropChange={setCrop}
					onCropComplete={onCropComplete}
					onZoomChange={setZoom}
				/>
			</div>
			<button
				className={cn("btn-primary py-2.5", submitClicked && "disable-btn")}
				onClick={handleAccept}
			>
				{submitClicked ? <LoadingIcon /> : "Cập nhật"}
			</button>
		</div>
	);
}
