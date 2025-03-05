import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { Field, Select } from "../components/Field";
import { useSignupStore } from "../store/signupStore";
import { useEffect, useRef, useState } from "react";
import EnterOTPCode from "../components/EnterOTPCode";
import { ArrowLeftIcon, AtIcon, EyeIcon, EyeSplashIcon, LoadingIcon, UserIcon } from "../components/Icon";
import { checkDuplicate, requestOTP, validOTP, sendingCreateAccount } from "../api/signupApi";
import { getCookie } from "@/utils/cookie";
import { removeVietnameseAccents } from "@/utils/removeSpecialWord";

export default function Signup() {
	const navigate = useNavigate();

	const { form, updateField } = useSignupStore();

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
	}, [currentStep, form.ten.isTouched, form.ho.isTouched, stepsRef.current[currentStep]?.offsetHeight]);

	// Check điều kiện vượt qua step 1 và sinh username mặc định
	const hoten = useRef(form.ten.value + form.ho.value + (Math.floor(Math.random() * 9000) + 1000));

	const [stepsPass, setStepsPass] = useState({ s1: false, s2: false });

	const handleStep1 = () => {
		const valid = form.ho.isValid && form.ten.isValid;
		setStepsPass((prev) => {
			if (prev.s1 === valid) return prev;
			return { ...prev, s1: valid };
		});
	};

	useEffect(() => {
		handleStep1();
	}, [form.ho.value, form.ten.value]);

	// Check điều kiện vượt qua step 2
	const handleStep2 = () => {
		const valid = form.username.isValid && form.email.isValid && form.password.isValid && form.rePassword.isValid;
		setStepsPass((prev) => {
			if (prev.s2 === valid) return prev;
			return { ...prev, s2: valid };
		});
	};

	useEffect(() => {
		handleStep2();
	}, [form.username.isValid, form.email.isValid, form.password.isValid, form.rePassword.isValid]);

	const gotoStep1 = () => {
		setCurrentStep(1);
	};

	const goToStep2 = () => {
		hoten.current =
			removeVietnameseAccents(form.ten.value) +
			removeVietnameseAccents(form.ho.value) +
			(Math.floor(Math.random() * 9000) + 10000);
		setCurrentStep(2);
		autoFocusOTP.current = false;
	};

	const [errMessageEmail, setErrMessageEmail] = useState("Điền đúng định dạng email");

	const [requestOTPClicked, setRequestOTPClicked] = useState(false);

	const autoFocusOTP = useRef(false);

	const goToStep3 = async () => {
		// const duplicateInto = await ;
		setRequestOTPClicked(true);
		// check đã tồn tại username và email
		const dataCheck = {
			username: form.username.value,
			email: form.email.value,
		};

		const respCheckDuplicateInto = await checkDuplicate(dataCheck);
		console.log(respCheckDuplicateInto);

		if (respCheckDuplicateInto?.status === 500 || respCheckDuplicateInto.message != "Thông tin hợp lệ.") {
			// updateField("username", { isValid: false });
			// updateField("email", { isValid: false });
			// setErrMessageUsernname(respCheckDuplicateInto.data.username);
			// setErrMessageEmail(respCheckDuplicateInto.data.email);
			setRequestOTPClicked(false);
			return;
		}
		// gửi yêu cầu lấy OTP
		const result = await requestOTP({
			email: form.email.value,
			type: "REGISTER",
		});

		setCurrentStep(3);
		if (result.statusCode === 200) {
			autoFocusOTP.current = true;
			updateField("username", { isValid: true });
			updateField("email", { isValid: true });
		} else {
			updateField("email", { isValid: false });
			setErrMessageEmail(result);
		}
		setRequestOTPClicked(false);
	};

	// xác thực OTP đã gửi về email client
	const [validOTPClicked, setValidOTPClicked] = useState(false);

	const [OTPErr, setOTPErr] = useState("");

	const goToStep4 = async () => {
		setValidOTPClicked(true);

		const sending = {
			username: form.username.value,
			password: form.password.value,
			email: form.email.value,
			firstName: form.ten.value,
			lastName: form.ho.value,
			dob: `${form.year.value}-${form.month.value.toString().padStart(2, "0")}-${form.day.value
				.toString()
				.padStart(2, "0")}`,
			gender: form.gender.value,
			otp: OTPValue.join(""),
		};

		const sendingOTP = {
			email: form.email.value,
			otp: OTPValue.join(""),
			type: "REGISTER",
		};

		const respValidOTP = await validOTP(sendingOTP);

		if (respValidOTP.statusCode != 200) {
			setOTPErr(respValidOTP.message);
			setValidOTPClicked(false);
			return;
		}

		setCurrentStep(4);
		const responseCreateAccount = await sendingCreateAccount(sending);
		console.log(responseCreateAccount);
		if (responseCreateAccount.statusCode === 200) {
			setTimeout(() => {
				navigate("/login");
			}, 2500);
		}
	};

	// Handle ẩn hiện mật khẩu
	const [isShowPassword, setIsShowPassword] = useState(false);

	const [isShowRePassword, setIsShowRePassword] = useState(false);

	const handleshowHidePassword = () => {
		if (form.password.value !== form.rePassword.value) {
			updateField(rePassword, { isValid: false });
		} else {
			updateField(rePassword, { isValid: true });
		}
	};

	useEffect(() => {
		handleshowHidePassword();
	}, [form.password.value, form.rePassword.value]);

	// Handle nhập mã OTP xác minh email
	const [OTPValue, setOTPValue] = useState(["", "", "", ""]);

	useEffect(() => {
		if (getCookie("refresh-token")) navigate("/home");
	}, []);

	return (
		<div className="lg:w-[min(85%,1440px)] md:h-fit h-[100dvh] mx-auto relative bg-background xl:px-20 lg:px-12 lg:my-4 md:px-4 py-6 rounded-md">
			<img className="w-[max(72px,8%)] absolute bottom-0 left-0" src="./decor/form_decor.svg" alt="" />
			<div className="md:w-10/12 md:mx-auto mx-6 md:mb-2 grid grid-cols-[repeat(15,minmax(0,1fr))] grid-rows-2 items-center">
				<h3 className="z-0 col-start-2 justify-self-center bg-primary text-txtWhite font-semibold md:w-12 w-10 aspect-square rounded-full grid place-content-center">
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
						currentStep >= 2 ? "bg-primary text-txtWhite" : "bg-secondary"
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
						currentStep >= 3 ? "bg-primary text-txtWhite" : "bg-secondary"
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
						currentStep >= 4 ? "bg-primary text-txtWhite" : "bg-secondary"
					} transition-all duration-300 ease-in`}
				>
					4
				</h3>
				<div />
				<span className="col-span-3 fs-sm font-light text-center">Thông tin cơ bản</span>
				<div />
				<span className="col-span-3 fs-sm font-light text-center">Thông tin đăng nhập</span>
				<div />
				<span className="col-span-3 fs-sm font-light text-center">Xác minh tài khoản</span>
				<div />
				<span className="col-span-3 fs-sm font-light text-center">Hoàn tất tạo tài khoản</span>
			</div>

			<div className="flex md:gap-x-[5%] w-full justify-center">
				<div
					ref={formContainer}
					className={`md:py-8 py-4 overflow-hidden xl:basis-5/12 lg:basis-6/12 md:basis-7/12 basis-full md:border rounded-lg w-14
						${currentStep !== 4 ? "" : "hidden"}
						`}
				>
					<div ref={stepsWrapper} className="grid" style={{ transition: "transform 0.3s, height 0.2s" }}>
						{/* step 1 */}
						<div ref={setStepsRef(1)} className={`md:px-8 px-6 h-fit ${currentStep === 1 ? "" : "invisible"}`}>
							<div className="mb-4">
								<h2>Thông tin cơ bản</h2>
								<p className="text-gray">Hãy điền vào form bên dưới để hoàn tất quá trình đăng ký nhé</p>
							</div>
							<div className="space-y-5">
								<div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
									<Field
										type="text"
										name="ten"
										id="ten"
										label="Tên"
										store={useSignupStore}
										required={true}
										errorMessage="Tên không được để trống và không chứa ký tự đặc biệt"
										allowTab={currentStep === 1}
									/>
									<Field
										type="text"
										name="ho"
										id="ho"
										label="Họ"
										store={useSignupStore}
										required={true}
										errorMessage="Họ không được để trống và không chứa kí tự đặc biệt"
										allowTab={currentStep === 1}
									/>
								</div>
								<div className="grid grid-cols-3 gap-3">
									<Select
										name="day"
										id="day"
										label="Ngày"
										store={useSignupStore}
										options={Array.from({ length: 31 }, (_, index) => index + 1).reduce((acc, num) => {
											acc[num] = num;
											return acc;
										}, {})}
										allowTab={currentStep === 1}
									/>
									<Select
										name="month"
										id="month"
										label="Tháng"
										store={useSignupStore}
										options={Array.from({ length: 12 }, (_, index) => index + 1).reduce((acc, num) => {
											acc[num] = num;
											return acc;
										}, {})}
										allowTab={currentStep === 1}
									/>
									<Select
										name="year"
										id="year"
										label="Năm"
										store={useSignupStore}
										options={Array.from(
											{ length: new Date().getFullYear() - 19 - 1940 + 1 },
											(_, index) => 1940 + index
										).reduce((acc, num) => {
											acc[num] = num;
											return acc;
										}, {})}
										allowTab={currentStep === 1}
									/>
								</div>
								<Select
									name="gender"
									id="gender"
									label="Giới tính"
									store={useSignupStore}
									options={{ 0: "Nam", 1: "Nữ", 2: "Khác", 3: "Không muốn tiết lộ" }}
									allowTab={currentStep === 1}
								/>

								<Button
									className={`btn-primary py-3 ${!stepsPass.s1 && "disable-btn"}`}
									onClick={!stepsPass.s1 ? () => {} : goToStep2}
									allowTab={currentStep === 1}
								>
									Tiếp theo
								</Button>
							</div>
						</div>

						{/* step 2 */}
						<div ref={setStepsRef(2)} className={`md:px-8 px-6 h-fit ${currentStep === 2 ? "" : "invisible"}`}>
							<div className="mb-4">
								<h2>Thông tin đăng nhập</h2>
								<p className="text-gray">Đây là thông tin quan trọng. Hãy luôn giữ bảo mật nhé!</p>
							</div>
							<div className="space-y-5">
								<Field
									type="text"
									name="username"
									id="username"
									label="Tên đăng nhập"
									initValue={hoten.current}
									store={useSignupStore}
									required={true}
									errorMessage="Tên đăng nhập không được để trống"
									allowTab={currentStep === 2}
								>
									<UserIcon />
								</Field>
								<Field
									type="email"
									name="email"
									id="email"
									label="Email"
									store={useSignupStore}
									required={true}
									pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
									errorMessage={errMessageEmail}
									allowTab={currentStep === 2}
								>
									<AtIcon />
								</Field>
								<Field
									type={isShowPassword ? "text" : "password"}
									name="password"
									id="password"
									label="Mật khẩu"
									store={useSignupStore}
									required={true}
									pattern="^(?=.*[A-Za-z])[A-Za-z\d]{8,20}$"
									errorMessage="Mật khẩu từ 8-20 kí tự, bao gồm cả chữ và số"
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
									label="Nhập lại mật khẩu"
									store={useSignupStore}
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
									<Button
										className={`btn-primary py-3 ${(!stepsPass.s2 || requestOTPClicked) && "disable-btn"}`}
										onClick={!stepsPass.s2 ? () => {} : goToStep3}
										allowTab={currentStep === 2}
									>
										{requestOTPClicked ? <LoadingIcon /> : "Tiếp theo"}
									</Button>
									<Button className="btn-secondary gap-2 py-3" onClick={gotoStep1} allowTab={currentStep === 2}>
										<ArrowLeftIcon /> Quay lại
									</Button>
								</div>
							</div>
						</div>
						{/* step 3 */}
						<div
							ref={setStepsRef(3)}
							className={`space-y-5 md:px-8 px-6 h-fit ${currentStep === 3 ? "" : "invisible"}`}
						>
							<div className="mb-4">
								<h2>Xác minh tài khoản</h2>
								<p className="text-gray">Yeah! Chỉ còn một bước cuối cùng thôi</p>
							</div>

							<p>Hãy kiểm tra email để nhận mã xác minh gồm 4 số và điền vào bên dưới nhé</p>

							<EnterOTPCode
								OTPValue={OTPValue}
								setOTPValue={setOTPValue}
								allowTab={currentStep === 1}
								autoFocus={autoFocusOTP.current}
							/>

							<div className="space-y-4">
								<div>
									<p className="text-red-600">{OTPErr}</p>
									<Button className={`btn-primary py-3`} allowTab={currentStep === 3} onClick={goToStep4}>
										{validOTPClicked ? <LoadingIcon /> : "Xác nhận"}
									</Button>
								</div>
								<Button className="btn-secondary gap-2 py-3" allowTab={currentStep === 3} onClick={goToStep2}>
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
							<Button className="btn-secondary mb-5 gap-3 py-3">
								<img className="size-6" src="./decor/google_icon.svg" alt="" />
								Đăng ký với Google
							</Button>
							<p className="text-gray text-center">
								Bạn đã có tài khoản?{" "}
								<Link to="/login" className="underline font-semibold text-primary-text">
									Quay lại đăng nhập
								</Link>
							</p>
						</div>
					</div>
				</div>

				<div className="relative overflow-hidden flex-grow">
					<img
						className={`absolute w-full left-0 mt-20 ${
							currentStep === 1 ? "translate-y-0 opacity-100" : "translate-y-1/4 opacity-0 invisible"
						} transition duration-300`}
						src="./decor/signup_step_1_decor.svg"
						alt=""
					/>
					<img
						className={`absolute w-11/12 left-1/2 -translate-x-1/2 ${
							currentStep === 2 ? "translate-y-0 opacity-100" : "translate-y-1/4 opacity-0 invisible"
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
					<div className={currentStep === 4 ? "flex flex-col items-center text-center mt-4 px-4" : "hidden"}>
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
