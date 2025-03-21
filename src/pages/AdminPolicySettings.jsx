import React, { useState, useEffect, useRef } from "react";
import { CheckIcon, TrashCanIcon, XMarkIcon } from "../components/Icon";
import Button from "../components/Button";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

export default function AdminPolicySettings() {
	const [policies, setPolicies] = useState([]);
	const siblingRef = useRef(null);
	const inputAddPolicy = useRef(null);

	const policiesJson = [
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

	const [addPolicyClicked, setAddPolicyClicked] = useState(false);

	const handleAddPolicy = () => {
		setAddPolicyClicked(true);
		setTimeout(() => {
			inputAddPolicy.current.focus();
		}, 1);
	};

	const acceptPolicy = () => {
		if (inputAddPolicy.current.value.trim() === "") {
			toast.warning("Không được để trống!");
			setTimeout(() => {
				inputAddPolicy.current.focus();
			}, 1);
			return;
		}
		const reason = inputAddPolicy.current.value;
		setPolicies((prev) => [
			{
				id: Date.now(),
				reason: reason,
			},
			...prev,
		]);
		setAddPolicyClicked(false);
		inputAddPolicy.current.value = "";
	};

	const declinePolicy = () => {
		inputAddPolicy.current.value = "";
		setAddPolicyClicked(false);
	};

	const handleRemovePolicy = (index) => {
		setPolicies(policies.filter((_, i) => i !== index));
	};

	const submitPolicies = () => {};

	useEffect(() => {
		setPolicies(policiesJson);
	}, []);

	return (
		<div className="flex-grow h-full grid grid-cols-2 bg-background rounded-lg border shadow">
			<div className="p-8 h-full flex flex-col min-h-0">
				<div className="px-1 space-y-4">
					<div>
						<h5>Cập nhật chính sách</h5>
						<p className="fs-sm text-gray"> Cập nhật các chính sách, loại vi phạm mới cho mạng xã hội</p>
					</div>

					<Button className={"btn-primary ms-auto !w-[200px] py-2.5"} onClick={submitPolicies}>
						Lưu cập nhật
					</Button>
					<Button
						className="z-10 btn-transparent !bg-background sticky top-0 border p-4 !justify-start"
						onClick={handleAddPolicy}
					>
						<PlusIcon /> Thêm
					</Button>
				</div>

				<div className="space-y-2 relative flex-grow overflow-y-auto px-1">
					<div className={`mt-1 relative ${!addPolicyClicked && "hidden"}`}>
						<input
							ref={inputAddPolicy}
							className="bg-transparent p-5 border w-full rounded"
							placeholder="Điền nội dung vi phạm"
						/>
						<div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
							<Button className="btn-transparent border !size-8" onClick={acceptPolicy}>
								<CheckIcon className="size-5" />
							</Button>
							<Button className="btn-transparent border !size-8" onClick={declinePolicy}>
								<XMarkIcon className="size-3.5" />
							</Button>
						</div>
					</div>

					{policies.map((policy, index) => (
						<div className="flex items-center justify-between w-full bg-background p-5 rounded border" key={index}>
							<span>{policy.reason}</span>
							<button onClick={() => handleRemovePolicy(index)}>
								<TrashCanIcon />
							</button>
						</div>
					))}
				</div>
			</div>
			<img className="w-full mt-auto" src="../decor/rocket-launching.svg" alt="Rocket Illustration" />
		</div>
	);
}
