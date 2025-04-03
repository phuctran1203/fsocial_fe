import React, { useEffect, useState } from "react";
import { JumpingInput, JumpingSelect } from "../components/Field";
import Button from "../components/Button";

import { adminStore } from "../store/adminStore";

import { LogoNoBG } from "../components/Icon";
import {
	combineIntoAvatarName,
	combineIntoDisplayName,
} from "@/utils/combineName";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { regexEmail, regexName, regexPassword } from "@/config/regex";
import { AtSign, ChevronDown, Eye, EyeOff, UserRoundIcon } from "lucide-react";
import {
	dayOptions,
	monthOptions,
	yearOptions,
} from "@/config/globalVariables";

const AdminProfile = () => {
	const { user } = adminStore();
	const {
		register,
		formState: { errors, isValid },
		reset,
		getValues,
		watch,
	} = useForm({ mode: "all" });
	const newPassword = watch("newPassword");

	useEffect(() => {
		reset({
			firstName: user.firstName,
			lastName: user.lastName,
			day: user.day,
			month: user.month,
			year: user.year,
			gender: user.gender,
			username: user.username,
			email: user.email,
		});
	}, []);

	// Handle ẩn hiện mật khẩu
	const [isShowOldPassword, setIsShowOldPassword] = useState(false);
	const [isShowNewPassword, setIsShowNewPassword] = useState(false);
	const [isShowReNewPassword, setIsShowReNewPassword] = useState(false);

	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			updateField("avatar", { value: imageUrl });
		}
	};

	// **🔹 Hàm xử lý cập nhật thông tin vào store**
	const handleUpdateProfile = () => {};

	const hours = new Date().getHours();

	return (
		<div className="relative overflow-hidden bg-background shadow border rounded-lg flex-grow p-10">
			<LogoNoBG
				className="absolute left-0 bottom-0 translate-y-1/2 -rotate-12 size-56"
				fill="fill-gray-3light"
			/>
			{/* Tiêu đề */}
			<h5>
				{hours < 12 && "Chào buổi sáng"}
				{hours <= 18 && "Chào buổi chiều"}
				{hours > 18 && "Chào buổi tối"},{" "}
				<font className="text-primary-gradient">
					{combineIntoDisplayName(user.firstName, user.lastName)}
				</font>
				👋
			</h5>
			<p className="text-gray fs-sm">
				Cập nhật thông tin của bạn tại đây. Không chia sẻ thông tin để tránh rủi
				ro phát sinh.
			</p>

			{/* Form chỉnh sửa */}
			<div className="max-w-[1080px] mx-auto grid grid-cols-2 gap-10 mt-12">
				{/* thông tin cá nhân */}
				<div className="space-y-5">
					<p className="font-medium">Thông tin cá nhân</p>

					<div className="grid grid-cols-2 gap-2">
						<JumpingInput
							label="Tên"
							name="firstName"
							register={register}
							errors={errors}
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
							register={register}
							errors={errors}
							validateOptions={{
								required: "Họ không được để trống",
								pattern: {
									value: regexName,
									message: "Họ không được chứa số và ký tự đặc biệt",
								},
							}}
						/>
					</div>

					<div className="grid grid-cols-3 gap-2">
						<JumpingSelect
							label="Ngày"
							name="day"
							register={register}
							errors={errors}
							options={dayOptions}
							disabled={true}
							icon={<ChevronDown />}
						/>
						<JumpingSelect
							label="Tháng"
							name="month"
							register={register}
							errors={errors}
							options={monthOptions}
							disabled={true}
							icon={<ChevronDown />}
						/>
						<JumpingSelect
							label="Năm"
							name="year"
							register={register}
							errors={errors}
							options={yearOptions}
							disabled={true}
							icon={<ChevronDown />}
						/>
					</div>

					<JumpingSelect
						label="Giới tính"
						name="gender"
						register={register}
						errors={errors}
						options={{
							0: "Nam",
							1: "Nữ",
							2: "Khác",
							3: "Không muốn tiết lộ",
						}}
						icon={<ChevronDown />}
					/>

					{/* Avatar + Button thay ảnh đại diện */}
					<div className="p-6 flex items-center gap-6">
						<div className="ring-4 ring-offset-4 rounded-full ring-gray-2light">
							<Avatar className="size-32">
								<AvatarImage src={user.avatar} />
								<AvatarFallback>
									{combineIntoAvatarName(user.firstName, user.lastName)}
								</AvatarFallback>
							</Avatar>
						</div>

						<label className="btn-secondary w-fit px-8 py-3 cursor-pointer">
							Thay ảnh đại diện
							<input
								type="file"
								className="hidden"
								onChange={handleImageUpload} //  Cập nhật avatar khi chọn ảnh mới
							/>
						</label>
					</div>
				</div>

				<div className="space-y-8">
					{/* thông tin đăng nhập */}
					<div className="space-y-5">
						<p className="font-medium">Thông tin đăng nhập</p>
						<JumpingInput
							label="Tên đăng nhập"
							name="username"
							register={register}
							errors={errors}
							validateOptions={{
								required: "Tên đăng nhập không được để trống",
							}}
							icon={<UserRoundIcon className="size-5" />}
						/>

						<JumpingInput
							label="Email"
							name="email"
							register={register}
							errors={errors}
							validateOptions={{
								required: "Email không được để trống",
								pattern: {
									value: regexEmail,
									message: "Email không hợp lệ",
								},
							}}
							icon={<AtSign className="size-5" />}
						/>
					</div>
					{/* Đổi mật khẩu */}
					<div className="space-y-5">
						{/* Đổi mật khẩu */}
						<p className="font-medium">Đổi mật khẩu</p>
						<JumpingInput
							type={isShowOldPassword ? "text" : "password"}
							label="Mật khẩu cũ"
							name="oldPassword"
							register={register}
							errors={errors}
							validateOptions={{
								required: "Mật khẩu không được để trống",
							}}
							icon={
								<div
									className="cursor-pointer"
									onClick={() => setIsShowOldPassword(!isShowOldPassword)}
								>
									{!isShowOldPassword ? (
										<Eye className="size-5" />
									) : (
										<EyeOff className="size-5" />
									)}
								</div>
							}
						/>

						<JumpingInput
							type={isShowNewPassword ? "text" : "password"}
							label="Mật khẩu mới"
							name="newPassword"
							register={register}
							errors={errors}
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
									onClick={() => setIsShowNewPassword(!isShowNewPassword)}
								>
									{!isShowNewPassword ? (
										<Eye className="size-5" />
									) : (
										<EyeOff className="size-5" />
									)}
								</div>
							}
						/>

						<JumpingInput
							type={isShowReNewPassword ? "text" : "password"}
							label="Nhập lại mật khẩu mới"
							name="reNewPassword"
							register={register}
							errors={errors}
							validateOptions={{
								required: "Mật khẩu không được để trống",
								pattern: {
									value: regexPassword,
									message: "Mật khẩu từ 8-20 kí tự, bao gồm cả chữ và số",
								},
								validate: (value) =>
									value === newPassword ||
									"Mật khẩu nhập lại không khớp với mật khẩu mới",
							}}
							icon={
								<div
									className="cursor-pointer"
									onClick={() => setIsShowReNewPassword(!isShowReNewPassword)}
								>
									{!isShowReNewPassword ? (
										<Eye className="size-5" />
									) : (
										<EyeOff className="size-5" />
									)}
								</div>
							}
						/>
					</div>
				</div>
			</div>

			{/* 🔹 Cập nhật thông tin khi ấn nút */}
			<div className="mt-6 flex justify-center">
				<Button
					onClick={handleUpdateProfile}
					className="btn-primary px-8 py-3 w-fit"
				>
					Cập nhật thay đổi
				</Button>
			</div>
		</div>
	);
};

export default AdminProfile;
