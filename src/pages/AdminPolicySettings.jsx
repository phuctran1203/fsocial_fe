import React, { useState, useEffect, useRef } from "react";
import { TrashCanIcon, XMarkIcon } from "../components/Icon";
import Button from "../components/Button";
import { Check, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import {
	addTermOfService,
	getTermOfService,
	removeTermOfService,
} from "@/api/termOfServiceApi";

export default function AdminPolicySettings() {
	const [policies, setPolicies] = useState([]);
	const inputAddPolicy = useRef(null);

	const [addPolicyClicked, setAddPolicyClicked] = useState(false);

	const handleAddPolicy = () => {
		setAddPolicyClicked(true);
		setTimeout(() => {
			inputAddPolicy.current.focus();
		}, 1);
	};

	const acceptPolicy = async () => {
		if (inputAddPolicy.current.value.trim() === "") {
			toast.warning("Không được để trống!");
			setTimeout(() => {
				inputAddPolicy.current.focus();
			}, 1);
			return;
		}
		console.log("Data ", inputAddPolicy.current.value);

		const res = await addTermOfService(inputAddPolicy.current.value);
		if (!res || res.statusCode !== 200) {
			toast.error("Thêm chính sách thất bại");
			return;
		}
		toast.success("Thêm chính sách thành công");
		const data = res.data;
		setPolicies((prev) => [
			{
				id: data.id,
				name: data.name,
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

	const handleRemovePolicy = (id) => {
		handleDeletePolicy(id);
		setPolicies(policies.filter((item) => item.id !== id));
	};

	const handleDeletePolicy = async (id) => {
		const res = await removeTermOfService(id);
		if (!res || res.statusCode !== 200) {
			toast.error("Xóa chính sách thất bại");
			return;
		}
		toast.success("Xóa chính sách thành công");
	};

	useEffect(() => {
		const fetchPolicy = async () => {
			const res = await getTermOfService();
			if (!res || res.statusCode !== 200) return;
			setPolicies(res.data);
		};

		fetchPolicy();
	}, []);

	return (
		<div className="flex-grow h-full grid grid-cols-2 bg-background rounded-lg border shadow">
			<div className="p-8 h-full flex flex-col min-h-0">
				<div className="px-1 space-y-4">
					<div>
						<h5>Cập nhật chính sách</h5>
						<p className="fs-sm text-gray">
							{" "}
							Cập nhật các chính sách, loại vi phạm mới cho mạng xã hội
						</p>
					</div>

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
							<Button
								className="btn-transparent border !size-8"
								onClick={acceptPolicy}
							>
								<Check className="size-5" />
							</Button>
							<Button
								className="btn-transparent border !size-8"
								onClick={declinePolicy}
							>
								<XMarkIcon className="size-5" />
							</Button>
						</div>
					</div>

					{policies.map((policy, index) => (
						<div
							className="flex items-center justify-between w-full bg-background p-5 rounded border"
							key={index}
						>
							<span>{policy.name}</span>
							<button onClick={() => handleRemovePolicy(policy.id)}>
								<TrashCanIcon />
							</button>
						</div>
					))}
				</div>
			</div>
			<img
				className="w-full mt-auto"
				src="../decor/rocket-launching.svg"
				alt="Rocket Illustration"
			/>
		</div>
	);
}
