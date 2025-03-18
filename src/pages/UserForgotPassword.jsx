import React, { useEffect, useRef, useState } from "react";
import { Field } from "../components/Field";
import { useForgotPasswordStore } from "../store/forgotPwStore";
import Button from "../components/Button";
import EnterOTPCode from "../components/EnterOTPCode";
import {
	ArrowLeftIcon,
	EyeIcon,
	EyeSplashIcon,
	LoadingIcon,
} from "../components/Icon";
import { requestOTP, validOTP, changePassword } from "../api/forgotPasswordApi";
import { getCookie } from "@/utils/cookie";
import { useNavigate } from "react-router-dom";
import InputOTP4Digit from "@/components/InputOTP4Digit";

export default function UserForgotPassword() {
	const navigate = useNavigate();

	const form = useForgotPasswordStore((state) => state.form);

	const [OTPErrMessage, setOTPErrMessage] = useState("");

	const [newPasswordErrMessage, setNewPasswordErrMessage] = useState("");

	// Handle animation cho các step
	const formContainer = useRef();

	const stepsWrapper = useRef();

	const [currentStep, setCurrentStep] = useState(1);

	const stepsRef = useRef([]);

	const setStepsRef = (index) => (element) => {
		stepsRef.current[index] = element;
	};

	useEffect(() => {
		const parent = formContainer.current;

		if (!parent) return;

		const resizeObserver = new ResizeObserver(() => {
			// Cập nhật lại width cho stepsWrapper
			const parentWidth = parent.offsetWidth;
			stepsWrapper.current.style.gridTemplateColumns = `repeat(3, ${parentWidth}px)`;
			// Cập nhật lại height cho stepsWrapper
			const stepHeight = stepsRef.current[currentStep].offsetHeight;
			stepsWrapper.current.style.height = `${stepHeight + 4}px`;
			// Cập nhật lại translate X cho stepWrapper
			stepsWrapper.current.style.transform = `translateX(-${
				formContainer.current.offsetWidth * (currentStep - 1)
			}px)`;
		});
		resizeObserver.observe(parent);
		return () => {
			resizeObserver.disconnect();
		};
	}, [
		currentStep,
		form.email.isTouched,
		OTPErrMessage,
		newPasswordErrMessage,
		stepsRef.current[currentStep]?.offsetHeight,
	]);

	//handle email
	const [errMessageEmail, setErrMessageEmail] = useState(
		"Điền đúng định dạng email"
	);

	//handle button Send OTP
	const [disableResendOTP, setDisableResendOTP] = useState(form.email.isValid);

	const interResend = useRef(null);

	const handleRequireOTP = (e) => {
		if (
			!form.email.isValid ||
			(form.email.isValid && interResend.current != null)
		)
			return;
		const btn = e.target;
		btn.innerText = `Gửi lại (30)`;
		let time = 29;
		interResend.current = setInterval(() => {
			btn.innerText = `Gửi lại (${time})`;
			if (time <= 0) {
				clearInterval(interResend.current);
				btn.innerText = `Gửi lại`;
				interResend.current = null;
				setDisableResendOTP(
					!useForgotPasswordStore.getState().form.email.isValid
				);
			}
			time -= 1;
		}, 900);
		setDisableResendOTP(true);

		//call api request OTP
		const dataSending = {
			email: form.email.value,
			type: "RESET",
		};
		requestOTP(dataSending);
	};

	useEffect(() => {
		if (interResend.current === null) setDisableResendOTP(!form.email.isValid);
	}, [form.email.isValid]);

	//handle submit OTP
	const [validOTPClicked, setValidOTPClicked] = useState(false);

	const [OTPValue, setOTPValue] = useState("");

	const handleSubmitOTP = async () => {
		setValidOTPClicked(true);
		if (OTPValue === "") {
			setOTPErrMessage("*Mã không đúng, hãy kiểm tra lại");
			return;
		}

		const sendingOTP = {
			email: form.email.value,
			otp: OTPValue,
			type: "RESET",
		};
		const resp = await validOTP(sendingOTP);
		if (resp && resp.statusCode === 200) {
			gotoStep2();
		} else {
			setOTPErrMessage(resp.message);
		}
		setValidOTPClicked(false);
	};

	// Handle ẩn hiện mật khẩu
	const [isShowPassword, setIsShowPassword] = useState(false);

	const [isShowRePassword, setIsShowRePassword] = useState(false);

	const gotoStep1 = () => {
		setCurrentStep(1);
	};

	const gotoStep2 = () => {
		setCurrentStep(2);
	};

	//check lại validate new password trước khi submit lên bước 3
	const reValidateNewPassword = () =>
		form.password.isValid &&
		form.rePassword.isValid &&
		form.password.value === form.rePassword.value; //ảo vãi lìn

	const gotoStep3 = async () => {
		if (!reValidateNewPassword()) {
			setNewPasswordErrMessage(
				"Mật khẩu mới và mật khẩu nhập lại không thỏa mãn"
			);
			return;
		}
		const dataSending = {
			email: form.email.value,
			newPassword: form.password.value,
		};
		const respChangePw = await changePassword(dataSending);
		if (respChangePw.statusCode === 200) {
			setCurrentStep(3);
			setTimeout(() => {
				navigate("/home");
			}, 2500);
		} else {
			console.log("Lỗi đổi mật khẩu");
		}
	};

	return (
		<div className="flex-grow flex justify-center items-center bg-background">
			<div
				ref={formContainer}
				className={`w-[450px] md:py-8 py-5 overflow-hidden md:border rounded`}
			>
				<div
					ref={stepsWrapper}
					className="grid"
					style={{ transition: "transform 0.3s, height 0.2s" }}
				>
					{/* step 1 */}
					<div
						ref={setStepsRef(1)}
						className={`md:px-8 px-5 h-fit ${
							currentStep === 1 ? "" : "invisible"
						}`}
					>
						<div className="mb-4">
							<h2>Xác minh tài khoản</h2>
							<p className="text-gray">
								Hãy điền lại email đã đăng ký để khôi phục lại nhé
							</p>
						</div>
						<div className="space-y-5">
							<div className="grid grid-cols-4 gap-2">
								<Field
									type="email"
									name="email"
									id="email"
									label="Email"
									className="col-span-3"
									store={useForgotPasswordStore}
									required={true}
									pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
									errorMessage={errMessageEmail}
									allowTab={currentStep === 1}
								>
									<svg
										className="w-full"
										viewBox="0 0 28 28"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											className="fill-gray"
											d="M14 27C17.4729 27 20.7372 25.648 23.1929 23.1923L21.3541 21.3541C19.3898 23.3184 16.7781 24.4 14 24.4C8.2657 24.4 3.6 19.7343 3.6 14C3.6 8.2657 8.2657 3.6 14 3.6C19.7343 3.6 24.4 8.2657 24.4 14C24.4 15.4339 23.2339 16.6 21.8 16.6C20.3661 16.6 19.2 15.4339 19.2 14V8.8H16.6V9.50135C15.8343 9.05805 14.9483 8.8 14 8.8C11.1283 8.8 8.8 11.1283 8.8 14C8.8 16.8717 11.1283 19.2 14 19.2C15.5561 19.2 16.9484 18.5129 17.9019 17.43C18.8555 18.5123 20.2471 19.2 21.8 19.2C24.6671 19.2 27 16.8671 27 14C27 6.8318 21.1682 1 14 1C6.8318 1 1 6.8318 1 14C1 21.1682 6.8318 27 14 27ZM14 16.6C12.5661 16.6 11.4 15.4339 11.4 14C11.4 12.5661 12.5661 11.4 14 11.4C15.4339 11.4 16.6 12.5661 16.6 14C16.6 15.4339 15.4339 16.6 14 16.6Z"
										/>
									</svg>
								</Field>
								<div>
									<Button
										className={`btn-primary md:py-3 py-3.5 text-nowrap ${
											disableResendOTP && "disable-btn"
										}`}
										onClick={handleRequireOTP}
									>
										Gửi mã
									</Button>
								</div>
							</div>
							<p>
								Kiểm tra email để nhận mã xác minh gồm 4 số và nhập vào ô bên
								dưới
							</p>
							<div className="flex justify-center">
								<InputOTP4Digit value={OTPValue} setValue={setOTPValue} />
							</div>
							<div>
								<p className="mb-1 text-red-600">{OTPErrMessage}</p>
								<Button
									className={`btn-primary px-8 py-3 ${
										validOTPClicked && "disable-btn"
									}`}
									onClick={handleSubmitOTP}
								>
									{validOTPClicked ? <LoadingIcon /> : "Xác nhận"}
								</Button>
							</div>
						</div>
					</div>
					{/* step 2 */}
					<div
						ref={setStepsRef(2)}
						className={`md:px-8 px-5 h-fit ${
							currentStep === 2 ? "" : "invisible"
						}`}
					>
						<div className="mb-4">
							<h2>Đổi mật khẩu</h2>
							<p className="text-gray">Luôn ghi nhớ mật khẩu mới</p>
						</div>
						<div className="space-y-5">
							<Field
								type={isShowPassword ? "text" : "password"}
								name="password"
								id="password"
								label="Mật khẩu mới"
								store={useForgotPasswordStore}
								required={true}
								pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$"
								errorMessage="Mật khẩu từ 6-20 kí tự, bao gồm cả chữ và số"
								allowTab={currentStep === 2}
							>
								<div onClick={() => setIsShowPassword(!isShowPassword)}>
									<EyeIcon
										className={`w-full ${isShowPassword ? "hidden" : "block"}`}
									/>
									<EyeSplashIcon
										className={`w-full ${!isShowPassword ? "hidden" : "block"}`}
									/>
								</div>
							</Field>

							<Field
								type={isShowRePassword ? "text" : "password"}
								name="rePassword"
								id="rePassword"
								label="Nhập lại mật khẩu mới"
								store={useForgotPasswordStore}
								required={true}
								compareFunction={(value) => form.password.value === value}
								errorMessage="Nhập lại chính xác mật khẩu của bạn"
								allowTab={currentStep === 2}
							>
								<div onClick={() => setIsShowRePassword(!isShowRePassword)}>
									<EyeIcon
										className={`w-full ${
											isShowRePassword ? "hidden" : "block"
										}`}
									/>
									<EyeSplashIcon
										className={`w-full ${
											!isShowRePassword ? "hidden" : "block"
										}`}
									/>
								</div>
							</Field>

							<div className="space-y-4">
								<div>
									<p className="mb-1 text-red-600">{newPasswordErrMessage}</p>
									<Button
										className={`btn-primary px-8 py-3 ${
											!reValidateNewPassword() && "disable-btn"
										}`}
										onClick={gotoStep3}
									>
										Xác nhận
									</Button>
								</div>

								<Button
									className="btn-transparent border px-8 py-3"
									onClick={gotoStep1}
								>
									<ArrowLeftIcon /> Quay lại
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
