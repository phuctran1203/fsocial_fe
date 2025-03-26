import React, { useEffect, useRef, useState } from "react";
import { JumpingInput } from "../components/Field";
import Button from "../components/Button";
// import EnterOTPCode from "../components/EnterOTPCode";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, LoadingIcon } from "../components/Icon";
import { requestOTP, validOTP, changePassword } from "../api/forgotPasswordApi";
import InputOTP4Digit from "@/components/InputOTP4Digit";
import { regexEmail, regexPassword } from "@/config/regex";
import { AtSign, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";

export default function ForgotPassword() {
	const navigate = useNavigate();

	const [OTPErrMessage, setOTPErrMessage] = useState("");

	// Handle animation cho các step
	const formContainer = useRef();

	const stepsWrapper = useRef();

	const [currentStep, setCurrentStep] = useState(1);

	const stepsRef = useRef([]);

	const setStepsRef = (index) => (element) => {
		stepsRef.current[index] = element;
	};

	useEffect(() => {
		if (!stepsRef.current[currentStep]?.offsetHeight) return;
		const stepHeight = stepsRef.current[currentStep].offsetHeight;
		stepsWrapper.current.style.height = `${stepHeight + 4}px`;
		const parent = formContainer.current;

		if (!parent) return;

		const resizeObserver = new ResizeObserver(() => {
			if (!stepsRef.current[currentStep]?.offsetHeight) return;
			// Cập nhật lại width cho stepsWrapper
			const parentWidth = parent.offsetWidth;
			stepsWrapper.current.style.gridTemplateColumns = `repeat(2, ${parentWidth}px)`;
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
	}, [currentStep, stepsRef.current[currentStep]?.offsetHeight]);

	// Step 1
	const {
		register: registerStep1,
		formState: { errors: errorsStep1, isValid: isValidStep1 },
		getValues: getValuesStep1,
	} = useForm({ mode: "all" });
	const [disableResendOTP, setDisableResendOTP] = useState(true);
	const interResend = useRef(null);

	useEffect(() => {
		if (!interResend.current) setDisableResendOTP(!isValidStep1);
	}, [isValidStep1]);

	//handle yêu cầu mã OTP
	const handleRequireOTP = (e) => {
		if (!isValidStep1 || disableResendOTP || interResend.current) return;

		const btn = e.target;
		btn.innerText = `Gửi lại (30)`;
		let time = 29;
		interResend.current = setInterval(() => {
			btn.innerText = `Gửi lại (${time})`;
			if (time <= 0) {
				clearInterval(interResend.current);
				btn.innerText = `Gửi lại`;
				interResend.current = null;
				setDisableResendOTP(!isValidStep1);
			}
			time -= 1;
		}, 900);

		setDisableResendOTP(true);

		//call api request OTP
		const dataSending = {
			email: getValuesStep1("email"),
			type: "RESET",
		};
		requestOTP(dataSending);
	};

	//handle gửi OTP
	const [validOTPClicked, setValidOTPClicked] = useState(false);
	const [OTPValue, setOTPValue] = useState("");

	const handleSubmitOTP = async () => {
		if (OTPValue === "") {
			setOTPErrMessage("*Mã OTP không được để trống");
			return;
		}
		setOTPErrMessage("");
		setValidOTPClicked(true);
		const sendingOTP = {
			email: getValuesStep1("email"),
			otp: OTPValue,
			type: "RESET",
		};
		const resp = await validOTP(sendingOTP);
		setValidOTPClicked(false);
		if (!resp) {
			setValidOTPClicked(false);
			return;
		}
		if (resp.statusCode === 200) {
			setCurrentStep(2);
		} else {
			setOTPErrMessage(resp.message);
		}
	};

	const backToStep1 = () => {
		setCurrentStep(1);
	};

	// Step 2
	//handle show & hide password
	// Handle ẩn hiện mật khẩu
	const [step2Err, setStep2Err] = useState("");
	const [isShowPassword, setIsShowPassword] = useState(false);
	const [isShowRePassword, setIsShowRePassword] = useState(false);
	const {
		register: registerStep2,
		formState: { errors: errorsStep2, isValid: isValidStep2 },
		getValues: getValuesStep2,
		watch: watchStep2,
	} = useForm({ mode: "all" });
	const password = watchStep2("password");

	const handleStep2 = async () => {
		if (!isValidStep2) return;

		const dataSending = {
			email: getValuesStep1("email"),
			newPassword: getValuesStep2("password"),
		};
		const respChangePw = await changePassword(dataSending);
		if (respChangePw.statusCode === 200) {
			setCurrentStep(3);
			setTimeout(() => {
				navigate("/login");
			}, 2500);
		} else {
			setStep2Err("Đã có lỗi xảy ra trong quá trình reset mật khẩu");
		}
	};

	return (
		<div className="lg:w-[min(85%,1440px)] md:h-fit h-screen mx-auto relative bg-background xl:px-20 lg:px-12 lg:my-6 md:px-4  py-8 rounded-md">
			<img
				className="w-[max(72px,8%)] absolute bottom-0 left-0"
				src="./decor/form_decor.svg"
				alt=""
			/>
			<div className="md:w-10/12 md:mx-auto mx-4 md:mb-2 grid grid-cols-[repeat(9,minmax(0,1fr))] grid-rows-2 items-center">
				<h3 className="z-0 col-start-2 justify-self-center bg-primary-gradient text-txtWhite md:w-12 w-10 aspect-square rounded-full grid place-content-center">
					1
				</h3>
				<div
					className={`
					col-span-2 relative h-[1px] bg-gradient-to-r from-transparent from-50% to-gray-2light to-50% bg-[length:20px_100%]
					before:absolute before:left-0 before:h-full ${
						currentStep >= 2 ? "before:w-full" : "before:w-0"
					} before:bg-gradient-to-r before:from-transparent before:from-50% before:to-primary before:to-50% before:bg-[length:20px_100%]
					before:transition-all before:duration-700 before:ease-out`}
				/>
				<h3
					className={`z-0 justify-self-center font-semibold md:w-12 w-10 aspect-square rounded-full grid place-content-center ${
						currentStep >= 2
							? "bg-primary-gradient text-txtWhite"
							: "bg-secondary"
					} transition-all duration-300 ease-in`}
				>
					2
				</h3>
				<div
					className={`
					col-span-2 relative h-[1px] bg-gradient-to-r from-transparent from-50% to-gray-2light to-50% bg-[length:20px_100%]
					before:absolute before:left-0 before:h-full ${
						currentStep >= 3 ? "before:w-full" : "before:w-0"
					} before:bg-gradient-to-r before:from-transparent before:from-50% before:to-primary before:to-50% before:bg-[length:20px_100%]
					before:transition-all before:duration-700 before:ease-out`}
				/>
				<h3
					className={`z-0 justify-self-center font-semibold md:w-12 w-10 aspect-square rounded-full grid place-content-center ${
						currentStep >= 3
							? "bg-primary-gradient text-txtWhite"
							: "bg-secondary"
					} transition-all duration-300 ease-in`}
				>
					3
				</h3>
				<span className="col-span-3 fs-sm font-light text-center">
					Xác minh
				</span>
				<span className="col-span-3 fs-sm font-light text-center">
					Đổi mật khẩu
				</span>
				<span className="col-span-3 fs-sm font-light text-center">
					Hoàn tất
				</span>
			</div>

			<div className="flex md:gap-x-[5%] w-full justify-center">
				<div
					ref={formContainer}
					className={`md:py-8 py-4 overflow-hidden xl:basis-5/12 lg:basis-6/12 md:basis-7/12 basis-full border rounded w-14
						${currentStep !== 3 ? "" : "hidden"}
						`}
				>
					<div
						ref={stepsWrapper}
						className="grid"
						style={{ transition: "transform 0.3s, height 0.2s" }}
					>
						{/* step 1 */}
						<div
							ref={setStepsRef(1)}
							className={`md:px-8 px-4 h-fit ${
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
								<div className="flex gap-2">
									<JumpingInput
										label="Email"
										name="email"
										className="flex-grow"
										register={registerStep1}
										errors={errorsStep1}
										validateOptions={{
											required: "Email không được để trống",
											pattern: {
												value: regexEmail,
												message: "Email không hợp lệ",
											},
										}}
										icon={<AtSign className="size-5" />}
									/>
									<div>
										<button
											className={cn(
												"btn-primary px-6 md:py-3 py-3.5 text-nowrap",
												disableResendOTP && "disable-btn"
											)}
											onClick={handleRequireOTP}
										>
											Gửi mã
										</button>
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
							className={`md:px-8 px-4 h-fit ${
								currentStep === 2 ? "" : "invisible"
							}`}
						>
							<div className="mb-4">
								<h2>Đổi mật khẩu</h2>
								<p className="text-gray">Luôn ghi nhớ mật khẩu mới</p>
							</div>
							<div className="space-y-5">
								<JumpingInput
									type={isShowPassword ? "text" : "password"}
									label="Mật khẩu"
									name="password"
									register={registerStep2}
									errors={errorsStep2}
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
											onClick={() => setIsShowPassword(!isShowPassword)}
										>
											{!isShowPassword ? (
												<Eye className="size-5" />
											) : (
												<EyeOff className="size-5" />
											)}
										</div>
									}
								/>

								<JumpingInput
									type={isShowRePassword ? "text" : "password"}
									label="Nhập lại Mật khẩu"
									name="rePassword"
									register={registerStep2}
									errors={errorsStep2}
									validateOptions={{
										required: "Mật khẩu nhập lại không được để trống",
										pattern: {
											value: regexPassword,
											message: "Mật khẩu từ 8-20 kí tự, bao gồm cả chữ và số",
										},
										validate: (value) =>
											value === password || "Mật khẩu nhập lại không khớp",
									}}
									icon={
										<div
											className="cursor-pointer"
											onClick={() => setIsShowRePassword(!isShowRePassword)}
										>
											{!isShowRePassword ? (
												<Eye className="size-5" />
											) : (
												<EyeOff className="size-5" />
											)}
										</div>
									}
								/>

								<div className="space-y-4">
									<div>
										<p className="fs-sm text-gray-light mb-1">
											*Sau khi đổi mật khẩu, bạn sẽ được chuyển hướng để đăng
											nhập lại tài khoản bằng mật khẩu mới này
										</p>
										<p className="mb-1 text-red-600">{step2Err}</p>
										<Button
											className={cn(
												"btn-primary px-8 py-3",
												!isValidStep2 && "disable-btn"
											)}
											onClick={handleStep2}
										>
											Xác nhận
										</Button>
									</div>

									<Button
										className="btn-transparent border px-8 py-3"
										onClick={backToStep1}
									>
										<ArrowLeftIcon /> Quay lại
									</Button>
								</div>
							</div>
						</div>
					</div>

					<div className="relative md:px-8 px-4 bg-background pt-3">
						<div
							className="
							mt-6 mb-10 relative w-10/12 mx-auto border-b-[1px] border-gray-light overflow-visible text-gray-light
							before:absolute before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['Hoặc'] before:size-fit before:bg-background before:px-2"
						/>
						<Button className="btn-transparent border px-8 py-3" to="/login">
							Quay lại đăng nhập
						</Button>
					</div>
				</div>
				<div className="relative overflow-hidden flex-grow">
					<img
						className={cn(
							"absolute w-full left-0 mt-20  transition duration-300",
							[1, 2].includes(currentStep)
								? "translate-y-0 opacity-100"
								: "translate-y-1/4 opacity-0 invisible"
						)}
						src="./decor/forgot-password_decor.svg"
						alt=""
					/>

					<div
						className={
							currentStep === 3
								? "flex flex-col items-center text-center mt-4 px-4"
								: "hidden"
						}
					>
						<h1 className="lg:text-4xl md:text-3xl text-2xl text-primary mb-2">
							Đã đổi mật khẩu thành công
							<br /> 🎉🎉🎉
						</h1>
						<h3 className="text-primary">
							Đang chuyển hướng về trang đăng nhập...
						</h3>
						<img src="./decor/signup_step_4_decor.svg" alt="" />
					</div>
				</div>
			</div>
		</div>
	);
}
