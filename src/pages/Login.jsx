import React, { useEffect, useState } from "react";
import RecentLogin from "../components/RecentLogin";
import { Field } from "../components/Field";
import { useLoginStore } from "../store/loginStore";
import { AtIcon, EyeIcon, EyeSplashIcon, LoadingIcon, UserIcon } from "../components/Icon";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { loginAPI } from "../api/loginApi";

export default function Login() {
	const navigate = useNavigate();

	const form = useLoginStore((state) => state.form);

	// Handle ẩn hiện mật khẩu
	const [isShowPassword, setIsShowPassword] = useState(false);

	//handle click submit button
	const [isDisable, setIsDisable] = useState(true);

	const handleValidate = () => {
		setIsDisable(!(form.loginName.isValid && form.password.isValid));
	};

	const [submitClicked, setSubmitClicked] = useState(false);

	useEffect(() => {
		handleValidate();
	}, [form.loginName.isValid, form.password.isValid]);

	const [loginErr, setLoginErr] = useState("");

	const handleSubmitLogin = async () => {
		setSubmitClicked(true);
		const data = {
			username: form.loginName.value.trim(),
			password: form.password.value.trim(),
		};

		const result = await loginAPI.login(data);

		if (result.statusCode === 200) {
			navigate("/home");
		} else {
			setLoginErr(result.message);
		}

		setSubmitClicked(false);
	};

	return (
		<div
			className="
			flex items-center justify-center max-w-[1440px] mx-auto min-h-screen md:px-6
			md:gap-20 md:flex-nowrap
			sm:bg-transparent
			bg-[--background-clr] gap-4 flex-wrap"
		>
			<div className="h-fit w-[440px] rounded-lg bg-[--background-clr] sm:shadow-md sm:px-8 sm:py-10 px-3 py-6">
				<div className="mb-4">
					<h2>
						Chào mừng đến với <span className="font-semibold text-2xl text-[--primary-clr]">FSocial</span> 👋
					</h2>

					<span>Nền tảng mạng xã hội giới trẻ mới</span>
				</div>
				<div className="mb-4">
					<Field
						type="text"
						name="loginName"
						id="loginName"
						label="Tên đăng nhập/Email"
						store={useLoginStore}
						required={true}
						errorMessage="Không để trống"
					>
						<UserIcon />
					</Field>
				</div>
				<div className="mb-4">
					<Field
						type={isShowPassword ? "text" : "password"}
						name="password"
						id="password"
						label="Mật khẩu"
						store={useLoginStore}
						required={true}
						errorMessage="Không được để trống"
					>
						<div onClick={() => setIsShowPassword(!isShowPassword)}>
							<EyeIcon className={`w-full ${isShowPassword ? "hidden" : "block"}`} />
							<EyeSplashIcon className={`w-full ${!isShowPassword ? "hidden" : "block"}`} />
						</div>
					</Field>
				</div>

				<div className="flex justify-between mb-2">
					<div className="flex justify-center items-center text-[var(--gray-clr)]">
						<label htmlFor="remmeberme" className="cursor-pointer flex items-center">
							<input type="checkbox" name="remmeberme" id="remmeberme" className="size-4 mr-1" />
							<span className="fs-sm">Ghi nhớ đăng nhập</span>
						</label>
					</div>
					<div>
						<Link to="/forgot-password" className="underline fs-sm font-semibold">
							Quên mật khẩu?
						</Link>
					</div>
				</div>
				<div className="mb-4">
					{!submitClicked && <p className="text-red-600">{loginErr}</p>}
					<Button
						className="py-3"
						onClick={() => (isDisable || submitClicked ? "" : handleSubmitLogin())}
						disabled={isDisable || submitClicked}
					>
						{submitClicked ? <LoadingIcon /> : "Đăng nhập"}
					</Button>
				</div>
				<div className="flex items-center justify-center my-6">
					<div className="border-t border-gray-300 flex-grow"></div>
					<span className="px-4 text-gray-500">Hoặc</span>
					<div className="border-t border-gray-300 flex-grow"></div>
				</div>
				<div className="mb-4">
					<Button type="secondary" className="mb-5 gap-3 py-3">
						<img className="size-6" src="./decor/google_icon.svg" alt="" />
						Đăng nhập với Google
					</Button>
				</div>
				<div className="flex justify-center items-center">
					<span className="text-[--gray-clr]">
						Chưa có tài khoản?{" "}
						<Link to="/signup" className="underline cursor-pointer font-semibold text-[--text-black-clr]">
							Tạo tài khoản mới
						</Link>
					</span>
				</div>
			</div>

			<div className="md:w-[550px] px-3 mb-28">
				<h1 className="mb-2 md:text-5xl text-4xl text-[--primary-clr] hidden sm:block">FSocial</h1>
				<div className="mb-3">
					<h1>Đăng nhập gần đây</h1>
					<p className="text-[var(--gray-clr)]">Chọn ảnh tài khoản hoặc ấn dấu “+” để thêm tài khoản mới</p>
				</div>

				<RecentLogin />
			</div>
		</div>
	);
}
