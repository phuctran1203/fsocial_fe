import React, { useEffect, useState } from "react";
import TextField from "../components/TextField";
import RecentLogin from "../components/recentLogin";

export default function Login() {

	const list = [
		{
			avatar: 'https://res.cloudinary.com/dwf2vqohm/image/upload/v1736494136/c1297e51-9141-4a6f-95df-b2b12122fa4a_FPT_Polytechnic.png',
			name: "Ngô Tấn Cangdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
		},
		{
			avatar: 'https://res.cloudinary.com/dwf2vqohm/image/upload/v1736494136/c1297e51-9141-4a6f-95df-b2b12122fa4a_FPT_Polytechnic.png',
			name: "Ngô Tấn Cang"
		},
		
		
		undefined
	]

	return <div className="flex p-24 h-screen bg-[var(--lower-backround-clr)]">
		<div className="w-3/6 h-full flex justify-center">
			<div className="wrapper w-[80%] bg-[var(--background-clr)] p-10">
				<div className="mb-4">
					<h2 className="font-medium">Chào mừng đến với <span className="font-bold text-2xl text-[var(--primary-clr)]">FSocial</span></h2>
					<span>Nền tảng mạng xã hội giới trẻ mới</span>
				</div>
				<div className="mb-4">
					<TextField name={"usename"} type={"text"}></TextField>
				</div>
				<div className="mb-4">
					<TextField name={"password"} type={"password"}></TextField>
				</div>
				<div className="flex justify-between mb-2">
					<div className="flex justify-center items-center text-[var(--gray-clr)]">
						<input type="checkbox" name="remmeberme" id="remmeberme"
							className="w-4 h-4 mr-1" />
						<label htmlFor="remmeberme" className="text-[14px]">Ghi nhớ đăng nhập</label>
					</div>
					<div>
						<button className="underline cursor-pointer ">Quên mật khẩu</button>
					</div>
				</div>
				<div className="mb-4">
					<button className="h-[48px] w-full bg-[var(--primary-clr)] hover:bg-[var(--primary-hover-clr)] 
					transition-colors text-white rounded-sm">Đăng nhập</button>
				</div>
				<div className="flex items-center justify-center my-6">
					<div className="border-t border-gray-300 flex-grow"></div>
					<span className="px-4 text-gray-500">Hoặc</span>
					<div className="border-t border-gray-300 flex-grow"></div>
				</div>
				<div className="mb-4">
					<button className="h-[48px] w-full bg-[var(--gray-light-clr)] hover:bg-[var(--gray-clr)] 
	   									transition-colors text-white rounded-sm flex items-center justify-center gap-2">
						<svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fillRule="evenodd" clipRule="evenodd" d="M5.60795 13.6889C5.60795 12.7997 5.75563 11.9473 6.0192 11.1477L1.40573 7.62469C0.506585 9.45029 0 11.5074 0 13.6889C0 15.8685 0.505962 17.9243 1.40386 19.7487L6.01484 16.2188C5.75376 15.423 5.60795 14.5737 5.60795 13.6889Z" fill="#FBBC05" />
							<path fillRule="evenodd" clipRule="evenodd" d="M13.7084 5.6C15.64 5.6 17.3847 6.28444 18.7555 7.40444L22.7434 3.42222C20.3133 1.30667 17.1978 0 13.7084 0C8.29108 0 3.63523 3.09804 1.40576 7.62471L6.01924 11.1477C7.08226 7.92089 10.1124 5.6 13.7084 5.6Z" fill="#EB4335" />
							<path fillRule="evenodd" clipRule="evenodd" d="M13.7084 21.7778C10.1124 21.7778 7.08226 19.4569 6.01924 16.23L1.40576 19.7524C3.63524 24.2797 8.29108 27.3778 13.7084 27.3778C17.052 27.3778 20.2441 26.1906 22.64 23.9661L18.2608 20.5806C17.0252 21.359 15.4693 21.7778 13.7084 21.7778Z" fill="#34A853" />
							<path fillRule="evenodd" clipRule="evenodd" d="M26.7937 13.6889C26.7937 12.88 26.6691 12.0089 26.4822 11.2H13.7085V16.4889H21.0611C20.6935 18.2921 19.6928 19.6784 18.2609 20.5806L22.6401 23.9661C25.1568 21.6303 26.7937 18.1509 26.7937 13.6889Z" fill="#4285F4" />
						</svg>
						Đăng nhập với Google</button>
				</div>
				<div className="flex justify-center items-center">
					<span className="text-[var(--gray-clr)]">Chưa có tài khoản?
						<button className="underline cursor-pointer font-bold text-[var(--text-black-clr)]">Tạo tài khoản mới</button>
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
	</div>;
}
