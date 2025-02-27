import { popupReportPostStore } from "@/store/popupStore";
import React, { useState, useEffect } from "react";
import { XMarkIcon } from "./Icon";
import Button from "./Button";
import { themeStore } from "@/store/themeStore";

export default function ReportModal() {
	const [selectedReason, setSelectedReason] = useState("");
	const [reportOptions, setReportOptions] = useState([]);

	const { id, isVisible, setIsVisible } = popupReportPostStore();

	const reportOptionsJson = [
		{
			id: 1,
			reason: "Có dấu hiệu lừa đảo",
		},
		{
			id: 2,
			reason: "Chứa nội dung/video/hình ảnh nhạy cảm",
		},
		{
			id: 3,
			reason: "Hành vi công kích, ngôn từ mất kiểm soát",
		},
	];

	const submitReport = () => {};

	useEffect(() => {
		setReportOptions(reportOptionsJson);
	}, []);

	const theme = themeStore((state) => state.theme);

	return (
		<div
			className={`z-20 fixed inset-0 sm:py-2 bg-black flex items-center justify-center ${
				isVisible ? "bg-opacity-30 visible" : "bg-opacity-0 invisible"
			}
			transition`}
			onClick={() => setIsVisible(false)}
		>
			<div
				className={` 
				pb-3 flex flex-col bg-background rounded-lg w-[550px] min-h-full sm:min-h-[70dvh] max-h-full overflow-hidden ${
					theme === "dark" && "sm:border"
				}
				${isVisible ? "translate-y-0" : "translate-y-[100vh]"}
				transition-all`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="sticky top-0 py-3 border-b">
					<h4 className="text-center">Báo cáo vi phạm</h4>
					<button className="absolute right-0 top-0 h-full px-4" onClick={() => setIsVisible(false)}>
						<XMarkIcon />
					</button>
				</div>

				<div className="px-3 flex-grow flex flex-col relative overflow-y-auto">
					<div className=" flex-grow space-y-3 my-4">
						{reportOptions.map((option) => (
							<label
								key={option.id}
								className="flex items-center space-x-2 p-3 border rounded hover:bg-gray-3light cursor-pointer transition"
							>
								<input
									type="radio"
									name="reportReason"
									value={option.reason}
									checked={selectedReason === option.reason}
									onChange={() => setSelectedReason(option.reason)}
								/>
								<span>{option.reason}</span>
							</label>
						))}
					</div>

					<Button className="sticky bottom-0 btn-primary py-2.5" onClick={submitReport}>
						Báo cáo
					</Button>
				</div>
			</div>
		</div>
	);
}
