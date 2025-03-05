import React, { useState, useEffect } from "react";
import Button from "./Button";
import { toast } from "sonner";
import { usePopupStore } from "@/store/popupStore";
import { LoadingIcon } from "./Icon";

export default function ReportModal({ id }) {
	const hidePopup = usePopupStore((state) => state.hidePopup);

	const [selectedReason, setSelectedReason] = useState("Có dấu hiệu lừa đảo");
	const [reportOptions, setReportOptions] = useState([]);

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

	const [submitClicked, setSubmitClicked] = useState(false);

	const submitReport = async () => {
		setSubmitClicked(true);

		setTimeout(() => {
			toast.success("Đã gửi báo cáo");
			hidePopup();
		}, 1000);
	};

	useEffect(() => {
		setReportOptions(reportOptionsJson);
	}, []);

	return (
		<div className="relative flex-grow flex flex-col sm:w-[550px] sm:min-h-[50dvh] sm:h-fit sm:max-h-[90dvh] w-screen h-[100dvh]">
			<div className="px-4 flex-grow space-y-3 pt-3 overflow-y-auto">
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

			<div className="sticky bottom-0 p-3 bg-background">
				<Button className={`btn-primary py-2.5 ${submitClicked && "disable-btn"}`} onClick={submitReport}>
					{submitClicked ? <LoadingIcon /> : "Báo cáo"}
				</Button>
			</div>
		</div>
	);
}
