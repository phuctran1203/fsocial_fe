import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { Field, Select } from "../components/Field";
import { useSignupStore } from "../store/signupStore";
import { useEffect, useRef, useState } from "react";

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
		if (parent) {
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
		}
	}, [currentStep, stepsRef.current[currentStep]?.offsetHeight]);

	// Check điều kiện vượt qua step 1 và sinh username mặc định
	const hoten = useRef(form.ten.value + form.ho.value);

	const [countStepPassed, setCountStepPassed] = useState({ s1: false, s2: false, s3: false, s4: false });

	const handleStep1 = () => {
		if (!form.ho.isValid || !form.ten.isValid) {
			setCountStepPassed((prev) => ({ ...prev, s1: false }));
		} else {
			setCountStepPassed((prev) => ({ ...prev, s1: true }));
			hoten.current = form.ten.value + form.ho.value + (Math.floor(Math.random() * 9000) + 1000);
		}
	};

	useEffect(() => {
		handleStep1();
	}, [form.ho.value, form.ten.value]);

	// Check điều kiện vượt qua step 2
	const handleStep2 = () => {
		if (!form.username.isValid || !form.email.isValid || !form.password.isValid) {
			setCountStepPassed((prev) => ({ ...prev, s2: false }));
		} else {
			setCountStepPassed((prev) => ({ ...prev, s2: true }));
		}
	};

	useEffect(() => {
		handleStep2();
	}, [form.username.isValid, form.email.isValid, form.password.isValid, form.rePassword.isValid]);

	const gotoStep1 = () => setCurrentStep(1);

	const goToStep2 = () => setCurrentStep(2);

	const goToStep3 = () => {
		setCurrentStep(3);
		setTimeout(() => {
			inputsOTPRef.current[0].focus();
		}, 200);
		// call request gửi code
	};

	const goToStep4 = () => {
		// sending post tạo account
		setCurrentStep(4);
		setTimeout(() => {
			navigate("/home");
		}, 3000);
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
	const inputsOTPRef = useRef([]);

	const [OTPValue, setOTPValue] = useState(["", "", "", ""]);

	const setInputsOTPRef = (index) => (element) => {
		inputsOTPRef.current[index] = element;
	};

	const jump = (index) => {
		inputsOTPRef.current[index]?.focus();
	};

	const handleInputOTPChange = (e, currentInputIndex) => {
		const nextInputIndex = currentInputIndex + 1;
		const oldValue = OTPValue[currentInputIndex];
		const currentValue = e.target.value;

		if (currentValue === "") {
			// có kí tự vừa bị xóa trong input
			setOTPValue((prev) => {
				const arr = [...prev];
				arr[currentInputIndex] = "";
				return arr;
			});
			return;
		}
		// có kí tự vừa được nhập vào input
		// Input trước đấy đã có giá trị -> nhảy đến input kế tiếp
		if (oldValue !== "") {
			e.target.value = oldValue;
			jump(nextInputIndex);
			return;
		}
		// Input trước đấy chưa có giá trị -> update giá trị mới
		setOTPValue((prev) => {
			const arr = [...prev];
			arr[currentInputIndex] = currentValue;
			return arr;
		});
		jump(nextInputIndex);
	};

	const handleInputOTPKeyDown = (e, currentInputIndex) => {
		// Xóa giá trị mà input hiện tại đang rỗng -> tự lùi về + xóa luôn giá trị input đằng trước
		if (e.key === "Backspace" && OTPValue[currentInputIndex] === "") {
			e.preventDefault(); // ngăn onChange chạy ngay sau
			const previousInputIndex = currentInputIndex - 1;
			if (previousInputIndex < 0) return;
			inputsOTPRef.current[previousInputIndex].value = "";
			setOTPValue((prev) => {
				const arr = [...prev];
				arr[previousInputIndex] = "";
				return arr;
			});
			jump(previousInputIndex);
		}
	};

	return (
		<div className="lg:w-[min(85%,1440px)] mx-auto relative bg-[--background-clr] lg:my-6 pt-9 pb-20 xl:px-20 lg:px-12 md:px-4 p-0 rounded-md">
			<img className="w-[max(72px,8%)] absolute bottom-0 left-0" src="./decor/form_decor.svg" alt="" />
			<div className="md:w-10/12 md:mx-auto mx-4 md:mb-2 grid grid-cols-[repeat(15,minmax(0,1fr))] grid-rows-2 items-center">
				<h3 className="z-0 col-start-2 justify-self-center bg-[--primary-clr] text-[--text-white-clr] font-semibold md:w-12 w-10 aspect-square rounded-full grid place-content-center">
					1
				</h3>
				<div
					className={`
					col-span-3 relative h-[1px] bg-gradient-to-r from-transparent from-50% to-[--gray-extra-light-clr] to-50% bg-[length:20px_100%]
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
					col-span-3 relative h-[1px] bg-gradient-to-r from-transparent from-50% to-[--gray-extra-light-clr] to-50% bg-[length:20px_100%]
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
				<div
					className={`
					col-span-3 relative h-[1px] bg-gradient-to-r from-transparent from-50% to-[--gray-extra-light-clr] to-50% bg-[length:20px_100%]
					before:absolute before:left-0 before:h-full ${
						currentStep == 4 ? "before:w-full" : "before:w-0"
					} before:bg-gradient-to-r before:from-transparent before:from-50% before:to-[--primary-clr] before:to-50% before:bg-[length:20px_100%]
					before:transition-all before:duration-700 before:ease-out`}
				/>
				<h3
					className={`z-0 justify-self-center font-semibold md:w-12 w-10 aspect-square rounded-full grid place-content-center ${
						currentStep >= 4
							? "bg-[--primary-clr] text-[--text-white-clr]"
							: "bg-[--secondary-clr] text-[--text-black-clr]"
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
					className={`md:py-8 py-4 overflow-hidden xl:basis-5/12 lg:basis-6/12 md:basis-7/12 basis-full md:ring-1 ring-inset ring-[--gray-extra-light-clr] rounded w-14
						${currentStep !== 4 ? "" : "hidden"}
						`}
				>
					<div ref={stepsWrapper} className="grid" style={{ transition: "transform 0.3s, height 0.2s" }}>
						{/* step 1 */}
						<div ref={setStepsRef(1)} className="md:px-8 px-4 h-fit">
							<div className="mb-4">
								<h2>Thông tin cơ bản</h2>
								<p className="text-[--gray-clr]">Hãy điền vào form bên dưới để hoàn tất quá trình đăng ký nhé</p>
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
									options={{ 0: "nam", 1: "nữ", 2: "khác", 3: "Không muốn tiết lộ" }}
									allowTab={currentStep === 1}
								/>

								<Button
									className={!countStepPassed.s1 ? "cursor-not-allowed" : ""}
									onClick={!countStepPassed.s1 ? () => {} : goToStep2}
									allowTab={currentStep === 1}
								>
									Tiếp theo
								</Button>
							</div>
						</div>
						{/* step 2 */}
						<div ref={setStepsRef(2)} className={`md:px-8 px-4 h-fit`}>
							<div className="mb-4">
								<h2>Thông tin đăng nhập</h2>
								<p className="text-[--gray-clr]">Đây là thông tin quan trọng. Hãy luôn giữ bảo mật nhé!</p>
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
									<svg className="w-full" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path
											d="M18.625 7C18.625 5.83968 18.1641 4.72688 17.3436 3.90641C16.5231 3.08594 15.4103 2.625 14.25 2.625C13.0897 2.625 11.9769 3.08594 11.1564 3.90641C10.3359 4.72688 9.875 5.83968 9.875 7C9.875 8.16032 10.3359 9.27312 11.1564 10.0936C11.9769 10.9141 13.0897 11.375 14.25 11.375C15.4103 11.375 16.5231 10.9141 17.3436 10.0936C18.1641 9.27312 18.625 8.16032 18.625 7ZM7.25 7C7.25 5.14348 7.9875 3.36301 9.30025 2.05025C10.613 0.737498 12.3935 0 14.25 0C16.1065 0 17.887 0.737498 19.1997 2.05025C20.5125 3.36301 21.25 5.14348 21.25 7C21.25 8.85652 20.5125 10.637 19.1997 11.9497C17.887 13.2625 16.1065 14 14.25 14C12.3935 14 10.613 13.2625 9.30025 11.9497C7.9875 10.637 7.25 8.85652 7.25 7ZM4.69609 25.375H23.8094C23.3227 21.9133 20.3477 19.25 16.7547 19.25H11.7562C8.16328 19.25 5.18828 21.9133 4.70156 25.375H4.69609ZM2 26.3758C2 20.9891 6.36406 16.625 11.7508 16.625H16.7492C22.1359 16.625 26.5 20.9891 26.5 26.3758C26.5 27.2727 25.7727 28 24.8758 28H3.62422C2.72734 28 2 27.2727 2 26.3758Z"
											fill="#2E2E2E"
										/>
									</svg>
								</Field>
								<Field
									type="email"
									name="email"
									id="email"
									label="Email"
									store={useSignupStore}
									required={true}
									pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
									errorMessage="Điền đúng định dạng email"
									allowTab={currentStep === 2}
								>
									<svg className="w-full" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path
											d="M14 27C17.4729 27 20.7372 25.648 23.1929 23.1923L21.3541 21.3541C19.3898 23.3184 16.7781 24.4 14 24.4C8.2657 24.4 3.6 19.7343 3.6 14C3.6 8.2657 8.2657 3.6 14 3.6C19.7343 3.6 24.4 8.2657 24.4 14C24.4 15.4339 23.2339 16.6 21.8 16.6C20.3661 16.6 19.2 15.4339 19.2 14V8.8H16.6V9.50135C15.8343 9.05805 14.9483 8.8 14 8.8C11.1283 8.8 8.8 11.1283 8.8 14C8.8 16.8717 11.1283 19.2 14 19.2C15.5561 19.2 16.9484 18.5129 17.9019 17.43C18.8555 18.5123 20.2471 19.2 21.8 19.2C24.6671 19.2 27 16.8671 27 14C27 6.8318 21.1682 1 14 1C6.8318 1 1 6.8318 1 14C1 21.1682 6.8318 27 14 27ZM14 16.6C12.5661 16.6 11.4 15.4339 11.4 14C11.4 12.5661 12.5661 11.4 14 11.4C15.4339 11.4 16.6 12.5661 16.6 14C16.6 15.4339 15.4339 16.6 14 16.6Z"
											fill="#2E2E2E"
										/>
									</svg>
								</Field>
								<Field
									type={isShowPassword ? "text" : "password"}
									name="password"
									id="password"
									label="Mật khẩu"
									store={useSignupStore}
									required={true}
									pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$"
									errorMessage="Mật khẩu từ 6-20 kí tự, bao gồm cả chữ và số"
									allowTab={currentStep === 2}
								>
									<div onClick={() => setIsShowPassword(!isShowPassword)}>
										<img src="./icon/eye.svg" className={`w-full ${isShowPassword ? "hidden" : "block"}`} />
										<img src="./icon/eye_splash.svg" className={`w-full ${isShowPassword ? "block" : "hidden"}`} />
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
										<img src="./icon/eye.svg" className={`w-full ${isShowRePassword ? "hidden" : "block"}`} />
										<img src="./icon/eye_splash.svg" className={`w-full ${isShowRePassword ? "block" : "hidden"}`} />
									</div>
								</Field>
								<div className="space-y-4">
									<Button
										type="primary"
										className={!countStepPassed.s2 ? "cursor-not-allowed" : ""}
										onClick={!countStepPassed.s2 ? () => {} : goToStep3}
										allowTab={currentStep === 2}
									>
										Tiếp theo
									</Button>
									<Button type="secondary" className="gap-2" onClick={gotoStep1} allowTab={currentStep === 2}>
										<img src="./icon/arrow_left.svg" alt="" /> Quay lại
									</Button>
								</div>
							</div>
						</div>
						{/* step 3 */}
						<div ref={setStepsRef(3)} className="md:px-8 px-4 h-fit">
							<div className="mb-4">
								<h2>Xác minh tài khoản</h2>
								<p className="text-[--gray-clr]">Yeah! Chỉ còn một bước cuối cùng thôi</p>
							</div>
							<p>Hãy kiểm tra email để nhận mã xác minh gồm 4 số và điền vào bên dưới nhé</p>
							<div className="px-6 my-6 flex justify-center lg:gap-6 gap-4">
								<input
									ref={setInputsOTPRef(0)}
									type="text"
									tabIndex={currentStep === 3 ? 0 : -1}
									className="bg-transparent text-xl border-2 border-[--gray-light-clr] md:size-14 size-12 text-center rounded-md focus:border-[--gray-clr] outline-none"
									inputMode="numeric"
									autoComplete="off"
									onChange={(e) => handleInputOTPChange(e, 0)}
									onKeyDown={(e) => handleInputOTPKeyDown(e, 0)}
									onPaste={(e) => e.preventDefault()}
								/>
								<input
									ref={setInputsOTPRef(1)}
									type="text"
									tabIndex={currentStep === 3 ? 0 : -1}
									className="bg-transparent text-xl border-2 border-[--gray-light-clr] md:size-14 size-12 text-center rounded-md focus:border-[--gray-clr] outline-none"
									inputMode="numeric"
									autoComplete="off"
									onChange={(e) => handleInputOTPChange(e, 1)}
									onKeyDown={(e) => handleInputOTPKeyDown(e, 1)}
									onPaste={(e) => e.preventDefault()}
								/>
								<input
									ref={setInputsOTPRef(2)}
									type="text"
									tabIndex={currentStep === 3 ? 0 : -1}
									className="bg-transparent text-xl border-2 border-[--gray-light-clr] md:size-14 size-12 text-center rounded-md focus:border-[--gray-clr] outline-none"
									inputMode="numeric"
									autoComplete="off"
									onChange={(e) => handleInputOTPChange(e, 2)}
									onKeyDown={(e) => handleInputOTPKeyDown(e, 2)}
									onPaste={(e) => e.preventDefault()}
								/>
								<input
									ref={setInputsOTPRef(3)}
									type="text"
									tabIndex={currentStep === 3 ? 0 : -1}
									className="bg-transparent text-xl border-2 border-[--gray-light-clr] md:size-14 size-12 text-center rounded-md focus:border-[--gray-clr] outline-none"
									inputMode="numeric"
									autoComplete="off"
									onChange={(e) => handleInputOTPChange(e, 3)}
									onKeyDown={(e) => handleInputOTPKeyDown(e, 3)}
									onPaste={(e) => e.preventDefault()}
								/>
							</div>

							<p className="hidden mb-1 text-red-600">*Mã không đúng, hãy kiểm tra lại</p>

							<div className="space-y-4">
								<Button type="primary" allowTab={currentStep === 3} onClick={goToStep4}>
									Xác nhận
								</Button>
								<Button type="secondary" className="gap-2" allowTab={currentStep === 3} onClick={goToStep2}>
									<img src="./icon/arrow_left.svg" alt="" /> Quay lại
								</Button>
							</div>
						</div>
					</div>

					<div className="relative md:px-8 px-4 bg-[--background-clr] pt-3 border-x">
						<div
							className="mt-6 mb-10
								relative w-10/12 mx-auto border-b-[1px] border-[--gray-light-clr] overflow-visible text-[--gray-light-clr]
								before:absolute before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['Hoặc'] before:size-fit before:bg-[--background-clr] before:px-2"
						/>
						<div>
							<Button type="secondary" className="mb-5 gap-3">
								<img className="size-6" src="./decor/google_icon.svg" alt="" />
								Đăng ký với Google
							</Button>
							<p className="text-[--gray-clr] text-center">
								Bạn đã có tài khoản?{" "}
								<Link to="/login" className="underline font-semibold text-[--text-black-clr]">
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
					<div className={currentStep === 4 ? "flex flex-col items-center text-center mt-8 px-4" : "hidden"}>
						<h1 className="lg:text-4xl md:text-3xl text-2xl text-[--primary-clr] mb-2">
							Đã tạo tài khoản thành công
							<br /> 🎉🎉🎉
						</h1>
						<h3>
							Bạn sẽ sớm được chuyển hướng về <br /> trang chủ
						</h3>
						<img src="./decor/signup_step_4_decor.svg" alt="" />
					</div>
				</div>
			</div>
		</div>
	);
}
