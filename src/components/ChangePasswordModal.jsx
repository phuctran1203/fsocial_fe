import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { JumpingInput } from "./Field";
import Button from "./Button";
import { LoadingIcon } from "./Icon";
import { usePopupStore } from "@/store/popupStore";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { regexPassword } from "@/config/regex";
import { changePassword } from "@/api/changePassword";
import { toast } from "sonner";

export default function ChangePasswordModal() {
	const navigate = useNavigate();
	const { hidePopup } = usePopupStore();
	const {
		register,
		getValues,
		watch,
		formState: { errors, isValid },
		trigger,
	} = useForm({ mode: "all" });
	const newPassword = watch("newPassword");
	// Handle ẩn hiện mật khẩu
	const [isShowOldPassword, setIsShowOldPassword] = useState(false);
	const [isShowNewPassword, setIsShowNewPassword] = useState(false);
	const [isShowReNewPassword, setIsShowReNewPassword] = useState(false);

	const [submitClicked, setSubmitClicked] = useState(false);

	const gotoForgetPassword = async () => {
		hidePopup();
		navigate("/user-forgot-password");
	};

	const handleChangePassword = async () => {
		trigger();
		if (!isValid) return;
		setSubmitClicked(true);
		const formData = getValues();
		const sending = {
			oldPassword: formData.oldPassword,
			newPassword: formData.newPassword,
		};
		console.log(sending);
		const resp = await changePassword(sending);
		setSubmitClicked(false);
		if (!resp || resp.statusCode !== 200) {
			toast.error("Đã có lỗi xảy ra trong quá trình đổi mật khẩu");
			return;
		}
		toast.success("Đổi mật khẩu thành công");
		hidePopup();
	};

	return (
		<div className="relative pt-10 flex flex-col bg-background sm:w-[500px] sm:h-fit w-screen h-[100dvh]">
			<div className="flex-grow space-y-5 px-7 pb-7">
				<div>
					<h4>Đổi mật khẩu</h4>
					<p className="text-gray">Luôn giữ bảo mật cho tài khoản của bạn</p>
				</div>
				<div className="space-y-4">
					<JumpingInput
						type={isShowOldPassword ? "text" : "password"}
						label="Mật khẩu cũ"
						name="oldPassword"
						register={register}
						errors={errors}
						validateOptions={{
							required: "Mật khẩu không được để trống",
						}}
						icon={
							<div
								className="cursor-pointer"
								onClick={() => setIsShowOldPassword(!isShowOldPassword)}
							>
								{!isShowOldPassword ? (
									<Eye className="size-5" />
								) : (
									<EyeOff className="size-5" />
								)}
							</div>
						}
					/>

					<JumpingInput
						type={isShowNewPassword ? "text" : "password"}
						label="Mật khẩu mới"
						name="newPassword"
						register={register}
						errors={errors}
						validateOptions={{
							required: "Mật khẩu không được để trống",
							pattern: {
								value: regexPassword,
								message: "Mật khẩu từ 8-20 kí tự, bao gồm cả chữ và số",
							},
						}}
						icon={
							<div
								className="cursor-pointer"
								onClick={() => setIsShowNewPassword(!isShowNewPassword)}
							>
								{!isShowNewPassword ? (
									<Eye className="size-5" />
								) : (
									<EyeOff className="size-5" />
								)}
							</div>
						}
					/>

					<JumpingInput
						type={isShowReNewPassword ? "text" : "password"}
						label="Nhập lại mật khẩu mới"
						name="reNewPassword"
						register={register}
						errors={errors}
						validateOptions={{
							required: "Mật khẩu không được để trống",
							pattern: {
								value: regexPassword,
								message: "Mật khẩu từ 8-20 kí tự, bao gồm cả chữ và số",
							},
							validate: (value) =>
								value === newPassword ||
								"Mật khẩu nhập lại không khớp với mật khẩu mới",
						}}
						icon={
							<div
								className="cursor-pointer"
								onClick={() => setIsShowReNewPassword(!isShowReNewPassword)}
							>
								{!isShowReNewPassword ? (
									<Eye className="size-5" />
								) : (
									<EyeOff className="size-5" />
								)}
							</div>
						}
					/>
				</div>
				<div className="">
					<button
						className="mb-2 underline font-semibold"
						onClick={gotoForgetPassword}
					>
						Quên mật khẩu?
					</button>

					<Button
						className="btn-primary py-3 mb-3"
						onClick={handleChangePassword}
					>
						{submitClicked ? <LoadingIcon /> : "Xác nhận thay đổi"}
					</Button>
					<Button className="btn-secondary py-3" onClick={hidePopup}>
						Hủy bỏ
					</Button>
				</div>
			</div>
		</div>
	);
}
