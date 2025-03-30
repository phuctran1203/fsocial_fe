export function getImageSize(url) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.src = url;
		img.onload = () => {
			resolve({ width: img.width, height: img.height });
		};
		img.onerror = reject;
	});
}

export function getVideoSize(url) {
	return new Promise((resolve, reject) => {
		const video = document.createElement("video");
		video.src = url;
		video.onloadedmetadata = () => {
			resolve({ width: video.videoWidth, height: video.videoHeight });
		};
		video.error = reject;
	});
}
