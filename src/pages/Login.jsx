import React, { useEffect, useState } from "react";
import RecentLogin from "../components/recentLogin";
import { Field } from "../components/Field";
import { useLoginStore } from "../store/loginStore";
import { AtIcon, EyeIcon, EyeSplashIcon } from "../components/Icon";
import Button from "../components/Button";
import { Link } from "react-router-dom";

export default function Login() {
	const list = [
		{
			avatar:
				"https://res.cloudinary.com/dwf2vqohm/image/upload/v1736494136/c1297e51-9141-4a6f-95df-b2b12122fa4a_FPT_Polytechnic.png",
			name: "Ngô Tấn Cangdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
		},
		{
			avatar:
				"https://res.cloudinary.com/dwf2vqohm/image/upload/v1736494136/c1297e51-9141-4a6f-95df-b2b12122fa4a_FPT_Polytechnic.png",
			name: "Ngô Tấn Cang",
		},

		undefined,
	];

	const form = useLoginStore((state) => state.form);

	// Handle ẩn hiện mật khẩu
	const [isShowPassword, setIsShowPassword] = useState(false);

	//handle click submit button
	const [isDisable, setIsDisable] = useState(true);

	const handleValidate = () => {
		setIsDisable(!(form.email.isValid && form.password.isValid));
	};

	useEffect(() => {
		handleValidate();
	}, [form.email.isValid, form.password.isValid]);

	const handleSubmitLogin = () => {
		const data = {
			email: form.email.value,
			password: form.password.value,
		};
		console.log(data);
	};

	return (
		<div className="flex p-24 h-screen bg-[var(--lower-backround-clr)]">
			<div className="w-3/6 h-full flex justify-center">
				<div className="w-[481px] h-[500px] rounded-lg bg-[var(--background-clr)] shadow-md absolute top-[131px] left-[280px] p-8">
					<div className="mb-4">
						<h2 className="font-medium">
							Chào mừng đến với <span className="font-bold text-2xl text-[var(--primary-clr)]">FSocial</span> 👋
						</h2>

						<span>Nền tảng mạng xã hội giới trẻ mới</span>
					</div>
					<div className="mb-4">
						<Field
							type="email"
							name="email"
							id="email"
							label="Email"
							store={useLoginStore}
							errorMessage="Sai định dạng email"
							pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
						>
							<AtIcon />
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
							<input type="checkbox" name="remmeberme" id="remmeberme" className="w-4 h-4 mr-1" />
							<label htmlFor="remmeberme" className="text-[14px]">
								Ghi nhớ đăng nhập
							</label>
						</div>
						<div>
							<Link to="/forgot-password" className="underline font-semibold">
								Quên mật khẩu?
							</Link>
						</div>
					</div>
					<div className="mb-4">
						<Button className="py-3" onClick={() => (isDisable ? handleSubmitLogin() : "")} disabled={isDisable}>
							Đăng nhập
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
			</div>
			<div className="w-3/6 h-full p-10">
				<div className="mb-3">
					<h1 className="font-medium text-5xl text-[var(--primary-clr)]">FSocial</h1>
				</div>
				<div className="flex flex-col mb-4">
					<span className="font-medium text-2xl">Đăng nhập gần đây</span>
					<span className="text-[var(--gray-clr)]">Chọn ảnh tài khoản hoặc ấn dấu “+” để thêm tài khoản mới</span>
				</div>
				<RecentLogin listUser={list} />
			</div>
		</div>
	);
}
