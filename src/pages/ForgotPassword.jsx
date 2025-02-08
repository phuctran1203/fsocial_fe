import React, { useEffect, useRef, useState } from "react";
import { Field } from "../components/Field";
import { useForgotPasswordStore } from "../store/forgotPwStore";
import Button from "../components/Button";
import EnterOTPCode from "../components/EnterOTPCode";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, EyeIcon, EyeSplashIcon } from "../components/Icon";

export default function ForgotPassword() {
	const navigate = useNavigate();

	const { form } = useForgotPasswordStore();

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
			stepsWrapper.current.style.transform = `translateX(-${formContainer.current.offsetWidth * (currentStep - 1)}px)`;
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
	const [errMessageEmail, setErrMessageEmail] = useState("Email không đúng định dạng");

	//handle button Send OTP
	const [disableResendOTP, setDisableResendOTP] = useState(form.email.isValid);

	const interResend = useRef(null);

	const handleRequireOTP = (e) => {
		if (!form.email.isValid || (form.email.isValid && interResend.current != null)) return;
		const btn = e.target;
		btn.innerText = `Gửi lại (20)`;
		let time = 19;
		interResend.current = setInterval(() => {
			btn.innerText = `Gửi lại (${time})`;
			if (time <= 0) {
				clearInterval(interResend.current);
				btn.innerText = `Gửi lại`;
				interResend.current = null;
				setDisableResendOTP(!useForgotPasswordStore.getState().form.email.isValid);
			}
			time -= 1;
		}, 900);
		setDisableResendOTP(true);
	};

	useEffect(() => {
		if (interResend.current === null) setDisableResendOTP(!form.email.isValid);
	}, [form.email.isValid]);

	//handle submit OTP
	const [OTPValue, setOTPValue] = useState(["", "", "", ""]);

	const handleSubmitOTP = () => {
		let OTP = OTPValue.reduce((total, value) => total + value, "");
		let isAnyEmpty = OTPValue.find((otp) => otp === "");

		if (OTP === "" || isAnyEmpty !== undefined) {
			setOTPErrMessage("*Mã không đúng, hãy kiểm tra lại");
			return;
		}
		setOTPErrMessage("");
		console.log(OTP);
		gotoStep2();
	};

	//handle show & hide password
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
		form.password.isValid && form.rePassword.isValid && form.password.value === form.rePassword.value; //ảo vãi lìn

	const gotoStep3 = () => {
		if (!reValidateNewPassword()) {
			setNewPasswordErrMessage("Mật khẩu bla bla có vấn đề");
		} else {
			setCurrentStep(3);
			setTimeout(() => {
				navigate("/home");
			}, 2000);
		}
	};

	return (
		<div className="lg:w-[min(85%,1440px)] md:h-fit h-screen mx-auto relative bg-[--background-clr] xl:px-20 lg:px-12 lg:my-6 md:px-4  py-8 rounded-md">
			<img className="w-[max(72px,8%)] absolute bottom-0 left-0" src="./decor/form_decor.svg" alt="" />
			<div className="md:w-10/12 md:mx-auto mx-4 md:mb-2 grid grid-cols-[repeat(9,minmax(0,1fr))] grid-rows-2 items-center">
				<h3 className="z-0 col-start-2 justify-self-center bg-[--primary-clr] text-[--text-white-clr] font-semibold md:w-12 w-10 aspect-square rounded-full grid place-content-center">
					1
				</h3>
				<div
					className={`
					col-span-2 relative h-[1px] bg-gradient-to-r from-transparent from-50% to-[--gray-extra-light-clr] to-50% bg-[length:20px_100%]
					before:absolute before:left-0 before:h-full ${
						currentStep >= 2 ? "before:w-full" : "before:w-0"
					} before:bg-gradient-to-r before:from-transparent before:from-50% before:to-[--primary-clr] before:to-50% before:bg-[length:20px_100%]
					before:transition-all before:duration-700 before:ease-out`}
				/>
				<h3
					className={`z-0 justify-self-center font-semibold md:w-12 w-10 aspect-square rounded-full grid place-content-center ${
						currentStep >= 2
							? "bg-[--primary-clr] text-[--text-white-clr]"
							: "bg-[--secondary-clr] text-[--text-black-clr]"
					} transition-all duration-300 ease-in`}
				>
					2
				</h3>
				<div
					className={`
					col-span-2 relative h-[1px] bg-gradient-to-r from-transparent from-50% to-[--gray-extra-light-clr] to-50% bg-[length:20px_100%]
					before:absolute before:left-0 before:h-full ${
						currentStep >= 3 ? "before:w-full" : "before:w-0"
					} before:bg-gradient-to-r before:from-transparent before:from-50% before:to-[--primary-clr] before:to-50% before:bg-[length:20px_100%]
					before:transition-all before:duration-700 before:ease-out`}
				/>
				<h3
					className={`z-0 justify-self-center font-semibold md:w-12 w-10 aspect-square rounded-full grid place-content-center ${
						currentStep >= 3
							? "bg-[--primary-clr] text-[--text-white-clr]"
							: "bg-[--secondary-clr] text-[--text-black-clr]"
					} transition-all duration-300 ease-in`}
				>
					3
				</h3>
				<span className="col-span-3 fs-sm font-light text-center">Xác minh</span>
				<span className="col-span-3 fs-sm font-light text-center">Đổi mật khẩu</span>
				<span className="col-span-3 fs-sm font-light text-center">Hoàn tất</span>
			</div>
			<div className="flex md:gap-x-[5%] w-full justify-center">
				<div
					ref={formContainer}
					className={`md:py-8 py-4 overflow-hidden xl:basis-5/12 lg:basis-6/12 md:basis-7/12 basis-full md:ring-1 ring-inset ring-[--gray-extra-light-clr] rounded w-14
						${currentStep !== 3 ? "" : "hidden"}
						`}
				>
					<div ref={stepsWrapper} className="grid" style={{ transition: "transform 0.3s, height 0.2s" }}>
						{/* step 1 */}
						<div ref={setStepsRef(1)} className={`md:px-8 px-4 h-fit ${currentStep === 1 ? "" : "invisible"}`}>
							<div className="mb-4">
								<h2>Xác minh tài khoản</h2>
								<p className="text-[--gray-clr]">Hãy điền lại email đã đăng ký để khôi phục lại nhé</p>
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
										<svg className="w-full" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path
												d="M14 27C17.4729 27 20.7372 25.648 23.1929 23.1923L21.3541 21.3541C19.3898 23.3184 16.7781 24.4 14 24.4C8.2657 24.4 3.6 19.7343 3.6 14C3.6 8.2657 8.2657 3.6 14 3.6C19.7343 3.6 24.4 8.2657 24.4 14C24.4 15.4339 23.2339 16.6 21.8 16.6C20.3661 16.6 19.2 15.4339 19.2 14V8.8H16.6V9.50135C15.8343 9.05805 14.9483 8.8 14 8.8C11.1283 8.8 8.8 11.1283 8.8 14C8.8 16.8717 11.1283 19.2 14 19.2C15.5561 19.2 16.9484 18.5129 17.9019 17.43C18.8555 18.5123 20.2471 19.2 21.8 19.2C24.6671 19.2 27 16.8671 27 14C27 6.8318 21.1682 1 14 1C6.8318 1 1 6.8318 1 14C1 21.1682 6.8318 27 14 27ZM14 16.6C12.5661 16.6 11.4 15.4339 11.4 14C11.4 12.5661 12.5661 11.4 14 11.4C15.4339 11.4 16.6 12.5661 16.6 14C16.6 15.4339 15.4339 16.6 14 16.6Z"
												fill="#2E2E2E"
											/>
										</svg>
									</Field>
									<div>
										<Button
											className="md:py-3 py-3.5 text-nowrap"
											disabled={disableResendOTP}
											onClick={handleRequireOTP}
										>
											Gửi mã
										</Button>
									</div>
								</div>
								<p>Kiểm tra email để nhận mã xác minh gồm 4 số và nhập vào ô bên dưới</p>
								<EnterOTPCode OTPValue={OTPValue} setOTPValue={setOTPValue} allowTab={currentStep === 1} />
								<div>
									<p className="mb-1 text-red-600">{OTPErrMessage}</p>
									<Button onClick={handleSubmitOTP}>Xác nhận</Button>
								</div>
							</div>
						</div>
						{/* step 2 */}
						<div ref={setStepsRef(2)} className={`md:px-8 px-4 h-fit ${currentStep === 2 ? "" : "invisible"}`}>
							<div className="mb-4">
								<h2>Đổi mật khẩu</h2>
								<p className="text-[--gray-clr]">Luôn ghi nhớ mật khẩu mới</p>
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
										<EyeIcon className={`w-full ${isShowPassword ? "hidden" : "block"}`} />
										<EyeSplashIcon className={`w-full ${!isShowPassword ? "hidden" : "block"}`} />
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
										<EyeIcon className={`w-full ${isShowRePassword ? "hidden" : "block"}`} />
										<EyeSplashIcon className={`w-full ${!isShowRePassword ? "hidden" : "block"}`} />
									</div>
								</Field>

								<div className="space-y-4">
									<div>
										<p className="fs-sm text-[--gray-light-clr] mb-1">
											*Sau khi đổi mật khẩu, bạn sẽ được chuyển hướng để đăng nhập lại tài khoản bằng mật khẩu mới này
										</p>
										<p className="mb-1 text-red-600">{newPasswordErrMessage}</p>
										<Button onClick={gotoStep3} disabled={!reValidateNewPassword()}>
											Xác nhận
										</Button>
									</div>

									<Button type="secondary" onClick={gotoStep1}>
										<ArrowLeftIcon /> Quay lại
									</Button>
								</div>
							</div>
						</div>
					</div>

					<div className="relative md:px-8 px-4 bg-[--background-clr] pt-3 border-x">
						<div
							className="mt-6 mb-10
								relative w-10/12 mx-auto border-b-[1px] border-[--gray-light-clr] overflow-visible text-[--gray-light-clr]
								before:absolute before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['Hoặc'] before:size-fit before:bg-[--background-clr] before:px-2"
						/>
						<Button type="secondary" to="/login">
							Đăng nhập tài khoản khác
						</Button>
					</div>
				</div>
				<div className="relative overflow-hidden flex-grow">
					<img
						className={`absolute w-full left-0 mt-20 ${
							[1, 2].includes(currentStep) ? "translate-y-0 opacity-100" : "translate-y-1/4 opacity-0 invisible"
						} transition duration-300`}
						src="./decor/forgot-password_decor.svg"
						alt=""
					/>

					<div className={currentStep === 3 ? "flex flex-col items-center text-center mt-4 px-4" : "hidden"}>
						<h1 className="lg:text-4xl md:text-3xl text-2xl text-[--primary-clr] mb-2">
							Đã đổi mật khẩu thành công
							<br /> 🎉🎉🎉
						</h1>
						<h3 className="text-[--primary-clr]">Đang chuyển hướng về trang chủ...</h3>
						<img src="./decor/signup_step_4_decor.svg" alt="" />
					</div>
				</div>
			</div>
		</div>
	);
}
