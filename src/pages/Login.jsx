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
			console.log("đăng nhập thành công, ", result);
			
		} else {
			setLoginErr(result.message);
		}

		setSubmitClicked(false);
	};

	return (
		<div
			className="
			flex items-center justify-center max-w-[1440px] min-h-screen md:px-6
			md:gap-20 md:flex-nowrap
			sm:bg-transparent
			bg-background gap-4 flex-wrap"
		>
			<div className="h-fit w-[440px] rounded-lg bg-background sm:shadow-md sm:px-8 sm:py-10 px-3 py-6">
				<div className="mb-4">
					<h2>
						Chào mừng đến với <span className="font-semibold text-2xl text-primary">FSocial</span> 👋
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
					<div className="flex justify-center items-center text-gray">
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
						className={`btn-primary py-3 ${(isDisable || submitClicked) && "disable-btn"}`}
						onClick={() => (isDisable || submitClicked ? "" : handleSubmitLogin())}
					>
						{submitClicked ? <LoadingIcon /> : "Đăng nhập"}
					</Button>
				</div>
				<div className="flex items-center justify-center my-6">
					<div className="border-t border-gray-light flex-grow"></div>
					<span className="px-4 text-gray-light">Hoặc</span>
					<div className="border-t border-gray-light flex-grow"></div>
				</div>
				<div className="mb-4">
					<Button className="btn-secondary mb-5 gap-3 py-3">
						<img className="size-6" src="./decor/google_icon.svg" alt="" />
						Đăng nhập với Google
					</Button>
				</div>
				<div className="flex justify-center items-center">
					<span className="text-gray">
						Chưa có tài khoản?{" "}
						<Link to="/signup" className="underline cursor-pointer font-semibold text-primary-text">
							Tạo tài khoản mới
						</Link>
					</span>
				</div>
			</div>

			<div className="md:w-[550px] px-3 mb-28">
				<h1 className="mb-2 md:text-5xl text-4xl text-primary hidden sm:block">FSocial</h1>
				<div className="mb-3">
					<h1>Đăng nhập gần đây</h1>
					<p className="text-gray">Chọn ảnh tài khoản hoặc ấn dấu “+” để thêm tài khoản mới</p>
				</div>

				<RecentLogin />
			</div>
		</div>
	);
}
