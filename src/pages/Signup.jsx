import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { JumpingInput, JumpingSelect } from "../components/Field";
import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, LoadingIcon } from "../components/Icon";
import {
	checkDuplicate,
	requestOTP,
	validOTP,
	sendingCreateAccount,
} from "../api/signupApi";
import { getCookie } from "@/utils/cookie";
import { removeVietnameseAccents } from "@/utils/removeSpecialWord";
import InputOTP4Digit from "@/components/InputOTP4Digit";
import { useForm } from "react-hook-form";
import { AtSign, ChevronDown, Eye, EyeOff, UserRoundIcon } from "lucide-react";
import { regexEmail, regexName, regexPassword } from "@/config/regex";

export default function Signup() {
	const navigate = useNavigate();
	const dayOptions = useRef(
		Array.from({ length: 31 }, (_, index) => index + 1).reduce((acc, num) => {
			acc[num] = num;
			return acc;
		}, {})
	);
	const monthOptions = useRef(
		Array.from({ length: 12 }, (_, index) => index + 1).reduce((acc, num) => {
			acc[num] = num;
			return acc;
		}, {})
	);
	const yearOptions = useRef(
		Array.from(
			{ length: new Date().getFullYear() - 19 - 1940 + 1 },
			(_, index) => 1940 + index
		).reduce((acc, num) => {
			acc[num] = num;
			return acc;
		}, {})
	);

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
	}, [currentStep, stepsRef.current[currentStep]?.offsetHeight]);

	// Step 1
	const {
		register: registerStep1,
		trigger: triggerValidStep1,
		formState: { errors: errorsStep1, isValid: isValidStep1 },
		getValues: getValuesStep1,
	} = useForm({ mode: "all" });

	const handleStep1 = () => {
		triggerValidStep1();
		const data = getValuesStep1();

		if (!isValidStep1) return;

		setValueStep2(
			"username",
			removeVietnameseAccents(data.firstName) +
				removeVietnameseAccents(data.lastName) +
				(Math.floor(Math.random() * 9000) + 10000)
		);
		setCurrentStep(2);
	};

	const backToStep1 = () => {
		setCurrentStep(1);
	};

	// Step 2
	const [checkDuplicateClicked, setCheckDuplicateClicked] = useState(false);
	const [step2Err, setStep2Err] = useState("");
	const {
		register: registerStep2,
		watch: watchStep2,
		trigger: triggerValidateStep2, // Dùng để gọi validate theo yêu cầu
		formState: { errors: errorsStep2, isValid: isValidStep2 },
		setError: setErrorStep2,
		setValue: setValueStep2,
		getValues: getValuesStep2,
	} = useForm({ mode: "all" });

	const password = watchStep2("password");

	const handleStep2 = async () => {
		triggerValidateStep2();
		const dataStep2 = getValuesStep2();
		if (!isValidStep2) return;
		setCheckDuplicateClicked(true);

		const dataCheck = {
			username: dataStep2.username,
			email: dataStep2.email,
		};

		const respCheckDuplicateInto = await checkDuplicate(dataCheck);

		setCheckDuplicateClicked(false);

		if (!respCheckDuplicateInto) {
			setStep2Err(
				`*Đã có lỗi phía máy chủ, FSocial đang cố gắng khắc phục nha`
			);
			return;
		}

		if (respCheckDuplicateInto.statusCode !== 200) {
			const errorMessages = respCheckDuplicateInto.data;
			if (errorMessages.username)
				setErrorStep2("username", {
					type: "server",
					message: errorMessages.username,
				});
			if (errorMessages.email)
				setErrorStep2("email", {
					type: "server",
					message: errorMessages.email,
				});
			return;
		}
		// gửi yêu cầu lấy OTP
		setCurrentStep(3);
		requestOTP({
			email: dataStep2.email,
			type: "REGISTER",
		});
	};

	const backToStep2 = () => {
		setCurrentStep(2);
	};

	// Step 3
	const [OTPValue, setOTPValue] = useState("");
	const [validOTPClicked, setValidOTPClicked] = useState(false);
	const [step3Err, setStep3Err] = useState("");

	const handleStep3 = async () => {
		setValidOTPClicked(true);
		const dataStep1 = getValuesStep1();
		const dataStep2 = getValuesStep2();

		const sending = {
			username: dataStep2.username,
			password: dataStep2.password,
			email: dataStep2.email,
			firstName: dataStep1.firstName,
			lastName: dataStep1.lastName,
			dob: `${dataStep1.year}-${dataStep1.month
				.toString()
				.padStart(2, "0")}-${dataStep1.day.toString().padStart(2, "0")}`,
			gender: dataStep1.gender,
		};

		const sendingOTP = {
			email: dataStep2.email,
			otp: OTPValue,
			type: "REGISTER",
		};

		const respValidOTP = await validOTP(sendingOTP);
		setValidOTPClicked(false);
		if (respValidOTP.statusCode != 200) {
			setStep3Err(respValidOTP.message);
			return;
		}

		const responseCreateAccount = await sendingCreateAccount(sending);
		if (responseCreateAccount.statusCode === 200) {
			setCurrentStep(4);
			setTimeout(() => {
				navigate("/login");
			}, 2500);
		} else {
			setStep3Err("Đã xảy ra lỗi trong quá trình tạo tài khoản");
		}
	};

	// Handle ẩn hiện mật khẩu
	const [isShowPassword, setIsShowPassword] = useState(false);

	const [isShowRePassword, setIsShowRePassword] = useState(false);

	return (
		<div className="lg:w-[min(85%,1440px)] md:h-fit h-[100dvh] mx-auto relative bg-background xl:px-20 lg:px-12 lg:my-4 md:px-4 py-6 rounded-md">
			<img
				className="w-[max(72px,8%)] absolute bottom-0 left-0"
				src="./decor/form_decor.svg"
				alt=""
			/>
			<div className="md:w-10/12 md:mx-auto mx-6 md:mb-2 grid grid-cols-[repeat(15,minmax(0,1fr))] grid-rows-2 items-center">
				<h3 className="z-0 col-start-2 justify-self-center bg-primary-gradient text-txtWhite font-semibold md:w-12 w-10 aspect-square rounded-full grid place-content-center">
					1
				</h3>
				<div
					className={`
					col-span-3 relative h-[1px] bg-gradient-to-r from-transparent from-50% to-gray-2light to-50% bg-[length:20px_100%]
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
					col-span-3 relative h-[1px] bg-gradient-to-r from-transparent from-50% to-gray-2light to-50% bg-[length:20px_100%]
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
				<div
					className={`
					col-span-3 relative h-[1px] bg-gradient-to-r from-transparent from-50% to-gray-2light to-50% bg-[length:20px_100%]
					before:absolute before:left-0 before:h-full ${
						currentStep == 4 ? "before:w-full" : "before:w-0"
					} before:bg-gradient-to-r before:from-transparent before:from-50% before:to-primary before:to-50% before:bg-[length:20px_100%]
					before:transition-all before:duration-700 before:ease-out`}
				/>
				<h3
					className={`z-0 justify-self-center font-semibold md:w-12 w-10 aspect-square rounded-full grid place-content-center ${
						currentStep >= 4
							? "bg-primary-gradient text-txtWhite"
							: "bg-secondary"
					} transition-all duration-300 ease-in`}
				>
					4
				</h3>
				<div />
				<span className="col-span-3 fs-sm font-light text-center">
					Thông tin cơ bản
				</span>
				<div />
				<span className="col-span-3 fs-sm font-light text-center">
					Thông tin đăng nhập
				</span>
				<div />
				<span className="col-span-3 fs-sm font-light text-center">
					Xác minh tài khoản
				</span>
				<div />
				<span className="col-span-3 fs-sm font-light text-center">
					Hoàn tất tạo tài khoản
				</span>
			</div>

			<div className="flex md:gap-x-[5%] w-full justify-center">
				<div
					ref={formContainer}
					className={`md:py-8 py-4 overflow-hidden xl:basis-5/12 lg:basis-6/12 md:basis-7/12 basis-full md:border rounded-lg w-14
						${currentStep !== 4 ? "" : "hidden"}
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
							className={`md:px-8 px-6 h-fit ${
								currentStep === 1 ? "" : "invisible"
							}`}
						>
							<div className="mb-4">
								<h2>Thông tin cơ bản</h2>
								<p className="text-gray">
									Hãy điền vào form bên dưới để hoàn tất quá trình đăng ký nhé
								</p>
							</div>
							<div className="space-y-5">
								<div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
									<JumpingInput
										label="Tên"
										name="firstName"
										register={registerStep1}
										errors={errorsStep1}
										validateOptions={{
											required: "Tên không được để trống",
											pattern: {
												value: regexName,
												message: "Tên không được chứa số và ký tự đặc biệt",
											},
										}}
									/>
									<JumpingInput
										label="Họ"
										name="lastName"
										register={registerStep1}
										errors={errorsStep1}
										validateOptions={{
											required: "Họ không được để trống",
											pattern: {
												value: regexName,
												message: "Họ không được chứa số và ký tự đặc biệt",
											},
										}}
									/>
								</div>
								<div className="grid grid-cols-3 gap-3">
									<JumpingSelect
										label="Ngày"
										name="day"
										register={registerStep1}
										errors={errorsStep1}
										options={dayOptions.current}
										icon={<ChevronDown />}
									/>
									<JumpingSelect
										label="Tháng"
										name="month"
										register={registerStep1}
										errors={errorsStep1}
										options={monthOptions.current}
										icon={<ChevronDown />}
									/>
									<JumpingSelect
										label="Năm"
										name="year"
										register={registerStep1}
										errors={errorsStep1}
										options={yearOptions.current}
										icon={<ChevronDown />}
									/>
								</div>
								<JumpingSelect
									label="Giới tính"
									name="gender"
									register={registerStep1}
									errors={errorsStep1}
									options={{
										0: "Nam",
										1: "Nữ",
										2: "Khác",
										3: "Không muốn tiết lộ",
									}}
									icon={<ChevronDown />}
								/>

								<button
									className={"btn-primary py-3"}
									onClick={handleStep1}
									tabIndex={isValidStep1 && currentStep === 1 ? 0 : -1}
								>
									Tiếp theo
								</button>
							</div>
						</div>

						{/* step 2 */}
						<div
							ref={setStepsRef(2)}
							className={`md:px-8 px-6 h-fit ${
								currentStep === 2 ? "" : "invisible"
							}`}
						>
							<div className="mb-4">
								<h2>Thông tin đăng nhập</h2>
								<p className="text-gray">
									Đây là thông tin quan trọng. Hãy luôn giữ bảo mật nhé!
								</p>
							</div>
							<div className="space-y-5">
								<JumpingInput
									label="Tên đăng nhập"
									name="username"
									register={registerStep2}
									errors={errorsStep2}
									validateOptions={{
										required: "Tên đăng nhập không được để trống",
									}}
									icon={<UserRoundIcon className="size-5" />}
								/>

								<JumpingInput
									label="Email"
									name="email"
									register={registerStep2}
									errors={errorsStep2}
									validateOptions={{
										required: "Email không được để trống",
										pattern: {
											value: regexEmail,
											message: "Email không hợp lệ",
										},
									}}
									icon={<AtSign className="size-5" />}
								/>

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
										!isShowPassword ? (
											<Eye
												className="size-5"
												onClick={() => setIsShowPassword(true)}
											/>
										) : (
											<EyeOff
												className="size-5"
												onClick={() => setIsShowPassword(false)}
											/>
										)
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
										!isShowRePassword ? (
											<Eye
												className="size-5"
												onClick={() => setIsShowRePassword(true)}
											/>
										) : (
											<EyeOff
												className="size-5"
												onClick={() => setIsShowRePassword(false)}
											/>
										)
									}
								/>
								<p className="text-red-500">{step2Err}</p>

								<div className="space-y-4">
									<Button
										className={`btn-primary py-3`}
										onClick={handleStep2}
										tabIndex={isValidStep2 && currentStep === 2 ? 0 : -1}
									>
										{checkDuplicateClicked ? <LoadingIcon /> : "Tiếp theo"}
									</Button>
									<Button
										className="btn-transparent border gap-2 py-3"
										onClick={backToStep1}
										allowTab={currentStep === 2}
									>
										<ArrowLeftIcon /> Quay lại
									</Button>
								</div>
							</div>
						</div>
						{/* step 3 */}
						<div
							ref={setStepsRef(3)}
							className={`space-y-5 md:px-8 px-6 h-fit ${
								currentStep === 3 ? "" : "invisible"
							}`}
						>
							<div className="mb-4">
								<h2>Xác minh tài khoản</h2>
								<p className="text-gray">
									Yeah! Chỉ còn một bước cuối cùng thôi
								</p>
							</div>

							<p>
								Hãy kiểm tra email để nhận mã xác minh gồm 4 số và điền vào bên
								dưới nhé
							</p>

							<div className="flex justify-center">
								<InputOTP4Digit value={OTPValue} setValue={setOTPValue} />
							</div>

							<div className="space-y-4">
								<div>
									<p className="text-red-600">{step3Err}</p>
									<Button
										className={`btn-primary py-3`}
										allowTab={currentStep === 3}
										onClick={handleStep3}
									>
										{validOTPClicked ? <LoadingIcon /> : "Xác nhận"}
									</Button>
								</div>
								<Button
									className="btn-transparent border gap-2 py-3"
									allowTab={currentStep === 3}
									onClick={backToStep2}
								>
									<ArrowLeftIcon /> Quay lại
								</Button>
							</div>
						</div>
					</div>

					<div className="relative md:px-8 px-6 bg-background pt-3 border-x">
						<div
							className="mt-6 mb-10
								relative w-10/12 mx-auto border-b-[1px] border overflow-visible text-gray-light
								before:absolute before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['Hoặc'] before:size-fit before:bg-background before:px-2"
						/>
						<div>
							<Button className="btn-transparent border mb-5 gap-3 py-3">
								<img className="size-6" src="./decor/google_icon.svg" alt="" />
								Đăng ký với Google
							</Button>
							<p className="text-gray text-center">
								Bạn đã có tài khoản?{" "}
								<Link
									to="/login"
									className="underline font-semibold text-primary-text"
								>
									Quay lại đăng nhập
								</Link>
							</p>
						</div>
					</div>
				</div>

				<div className="relative overflow-hidden flex-grow">
					<img
						className={`absolute w-full left-0 mt-20 ${
							currentStep === 1
								? "translate-y-0 opacity-100"
								: "translate-y-1/4 opacity-0 invisible"
						} transition duration-300`}
						src="./decor/signup_step_1_decor.svg"
						alt=""
					/>
					<img
						className={`absolute w-11/12 left-1/2 -translate-x-1/2 ${
							currentStep === 2
								? "translate-y-0 opacity-100"
								: "translate-y-1/4 opacity-0 invisible"
						} transition duration-300`}
						src="./decor/signup_step_2_decor.svg"
						alt=""
					/>
					<img
						className={`absolute w-11/12 left-1/2 -translate-x-1/2 mt-12 ${
							currentStep === 3
								? "translate-y-0 opacity-100 transition duration-300"
								: "translate-y-1/4 opacity-0 invisible"
						} `}
						src="./decor/signup_step_3_decor.svg"
						alt=""
					/>
					<div
						className={
							currentStep === 4
								? "flex flex-col items-center text-center mt-4 px-4"
								: "hidden"
						}
					>
						<h1 className="lg:text-4xl md:text-3xl text-2xl text-primary mb-2">
							Đã tạo tài khoản thành công
							<br /> 🎉🎉🎉
						</h1>
						<h3 className="text-primary">Đang chuyển hướng về trang chủ...</h3>
						<img src="./decor/signup_step_4_decor.svg" alt="" />
					</div>
				</div>
			</div>
		</div>
	);
}
