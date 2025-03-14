import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Field } from "./Field";
import Button from "./Button";
import { EyeIcon, EyeSplashIcon, LoadingIcon } from "./Icon";
import { useChangePasswordModalStore } from "../store/ChangePasswordModalStore";
import { usePopupStore } from "@/store/popupStore";

export default function ChangePasswordModal() {
	const navigate = useNavigate();
	const { hidePopup } = usePopupStore();
	const { form, updateField } = useChangePasswordModalStore();

	// Handle ẩn hiện mật khẩu
	const [isShowOldPassword, setIsShowOldPassword] = useState(false);
	const [isShowNewPassword, setIsShowNewPassword] = useState(false);
	const [isShowReNewPassword, setIsShowReNewPassword] = useState(false);

	const [validClicked, setValidClicked] = useState(false);

	const handleshowHidePassword = () => {
		if (form.oldPassword.value === form.newPassword.value) {
			updateField(newPassword, { isValid: false });
		} else {
			updateField(newPassword, { isValid: true });
		}
	};

	const reValidateNewPassword = () =>
		form.oldPassword.isValid &&
		form.newPassword.isValid &&
		form.reNewPassword.isValid &&
		form.newPassword.value === form.reNewPassword.value &&
		form.oldPassword.value !== form.newPassword.value;

	const gotoForgetPassword = async () => {
		hidePopup();
		navigate("/user-forgot-password");
	};

	const gotoHome = async () => {
		if (!reValidateNewPassword()) {
			return;
		}
		// call api reset password
		navigate("/home");
	};

	useEffect(() => {
		handleshowHidePassword();
	}, [
		form.oldPassword.value,
		form.newPassword.value,
		form.reNewPassword.value,
	]);

	return (
		<div className="relative flex-grow flex flex-col bg-background sm:w-[500px] sm:h-fit w-screen h-[100dvh]">
			<div className="flex-grow space-y-5 px-7 pb-7">
				<div>
					<h4>Đổi mật khẩu</h4>
					<p className="text-gray">Luôn giữ bảo mật cho tài khoản của bạn</p>
				</div>
				<div className="space-y-4">
					<Field
						type={isShowOldPassword ? "text" : "password"}
						name="oldPassword"
						id="oldPassword"
						label="Mật khẩu cũ"
						store={useChangePasswordModalStore}
						required={true}
						pattern="^(?=.*[A-Za-z])[A-Za-z\d]{7,20}$"
						errorMessage="Mật khẩu từ 7-20 kí tự, bao gồm cả chữ và số"
					>
						<div onClick={() => setIsShowOldPassword(!isShowOldPassword)}>
							<EyeIcon
								className={`w-full ${isShowOldPassword ? "hidden" : "block"}`}
							/>
							<EyeSplashIcon
								className={`w-full ${!isShowOldPassword ? "hidden" : "block"}`}
							/>
						</div>
					</Field>

					<Field
						type={isShowNewPassword ? "text" : "password"}
						name="newPassword"
						id="newPassword"
						label="Mật khẩu mới"
						store={useChangePasswordModalStore}
						required={true}
						compareFunction={(value) => form.oldPassword.value !== value}
						errorMessage="Nhập lại chính xác mật khẩu của bạn"
					>
						<div onClick={() => setIsShowNewPassword(!isShowNewPassword)}>
							<EyeIcon
								className={`w-full ${isShowNewPassword ? "hidden" : "block"}`}
							/>
							<EyeSplashIcon
								className={`w-full ${!isShowNewPassword ? "hidden" : "block"}`}
							/>
						</div>
					</Field>
					<Field
						type={isShowReNewPassword ? "text" : "password"}
						name="reNewPassword"
						id="reNewPassword"
						label="Nhập lại mật khẩu mới"
						store={useChangePasswordModalStore}
						required={true}
						compareFunction={(value) => form.newPassword.value === value}
						errorMessage="Nhập lại chính xác mật khẩu của bạn"
					>
						<div onClick={() => setIsShowReNewPassword(!isShowReNewPassword)}>
							<EyeIcon
								className={`w-full ${isShowReNewPassword ? "hidden" : "block"}`}
							/>
							<EyeSplashIcon
								className={`w-full ${
									!isShowReNewPassword ? "hidden" : "block"
								}`}
							/>
						</div>
					</Field>
				</div>
				<div className="">
					<button
						className="mb-2 underline font-semibold"
						onClick={gotoForgetPassword}
					>
						Quên mật khẩu?
					</button>

					<Button className="btn-primary py-3 mb-3" onClick={gotoHome}>
						{validClicked ? <LoadingIcon /> : "Xác nhận thay đổi"}
					</Button>
					<Button className="btn-secondary py-3" onClick={hidePopup}>
						Hủy bỏ
					</Button>
				</div>
			</div>
		</div>
	);
}
