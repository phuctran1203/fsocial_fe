import React, { useEffect, useRef, useState } from "react";
import { JumpingInput } from "../components/Field";
import Button from "../components/Button";
import { ArrowLeftIcon, LoadingIcon } from "../components/Icon";
import { requestOTP, validOTP, changePassword } from "../api/forgotPasswordApi";
import { useNavigate } from "react-router-dom";
import InputOTP4Digit from "@/components/InputOTP4Digit";
import { AtSign, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { regexEmail, regexPassword } from "@/config/regex";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function UserForgotPassword() {
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
			toast.success("Đổi mật khẩu thành công");
			navigate("/");
		} else {
			setStep2Err("Đã có lỗi xảy ra trong quá trình reset mật khẩu");
		}
	};

	return (
		<div className="flex-grow flex justify-center items-center bg-background">
			<div
				ref={formContainer}
				className={`w-[450px] md:py-8 py-5 overflow-hidden md:border rounded shadow-md`}
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
											"btn-primary px-4 md:py-3 py-3.5 text-nowrap",
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
										*Sau khi đổi mật khẩu, bạn sẽ được chuyển hướng để đăng nhập
										lại tài khoản bằng mật khẩu mới này
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
			</div>
		</div>
	);
}
