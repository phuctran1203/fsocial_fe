import React, { useState, useRef } from "react";
import { Field, Select } from "../components/Field";
import Button from "../components/Button";

import { adminStore } from "../store/adminStore";

const currentYear = new Date().getFullYear(); // 🔹 Định nghĩa biến năm hiện tại
import {
	EyeIcon,
	EyeSplashIcon,
	LoadingIcon,
	UserIcon,
	XMarkIcon,
	AtIcon,
	LogoNoBG,
} from "../components/Icon";
import {
	combineIntoAvatarName,
	combineIntoDisplayName,
} from "@/utils/combineName";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AdminProfile = () => {
	const { form, updateField } = adminStore();

	// Handle ẩn hiện mật khẩu
	const [isShowPassword, setIsShowPassword] = useState(false);
	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const fileInputRef = useRef(null);

	// Xử lý thay đổi dữ liệu nhập vào
	const handleChange = (field, value) => {
		setUserData((prev) => ({ ...prev, [field]: value }));
	};

	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			updateField("avatar", { value: imageUrl });
		}
	};

	// **🔹 Hàm xử lý cập nhật thông tin vào store**
	const handleUpdateProfile = () => {
		// Kiểm tra mật khẩu trước khi cập nhật
		if (
			userData.newPassword &&
			userData.newPassword !== userData.confirmPassword
		) {
			alert("Mật khẩu mới không khớp!");
			return;
		}

		alert("Cập nhật thông tin thành công!");
	};

	const hours = new Date().getHours();

	return (
		<div className="relative overflow-hidden bg-background shadow border rounded-lg flex-grow p-10">
			<LogoNoBG
				className="absolute left-0 bottom-0 translate-y-1/3 -rotate-12 size-56"
				fill="fill-gray-3light"
			/>
			{/* Tiêu đề */}
			<h5>
				{hours < 12 && "Chào buổi sáng"}
				{hours <= 18 && "Chào buổi chiều"}
				{hours > 18 && "Chào buổi tối"},{" "}
				<font className="text-primary-gradient">
					{combineIntoDisplayName(form.ten.value, form.ho.value)}
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
						<Field
							label="Tên"
							id="ten"
							required={true}
							pattern="^[A-Za-zÀ-ỹ\s]+$"
							errorMessage="Tên không được để trống và chỉ chứa chữ cái."
							store={adminStore}
						/>
						<Field
							label="Họ"
							id="ho"
							required={true}
							pattern="^[A-Za-zÀ-ỹ\s]+$"
							errorMessage="Họ không được để trống và chỉ chứa chữ cái."
							store={adminStore}
						/>
					</div>

					<div className="grid grid-cols-3 gap-2">
						<Select
							name="day"
							id="day"
							label="Ngày"
							store={adminStore}
							disable={true}
							options={Array.from(
								{ length: 31 },
								(_, index) => index + 1
							).reduce((acc, num) => {
								acc[num] = num;
								return acc;
							}, {})}
						/>
						<Select
							name="month"
							id="month"
							label="Tháng"
							store={adminStore}
							disable={true}
							options={Array.from(
								{ length: 12 },
								(_, index) => index + 1
							).reduce((acc, num) => {
								acc[num] = num;
								return acc;
							}, {})}
						/>
						<Select
							name="year"
							id="year"
							label="Năm"
							store={adminStore}
							disable={true}
							options={Array.from(
								{ length: new Date().getFullYear() - 19 - 1940 + 1 },
								(_, index) => 1940 + index
							).reduce((acc, num) => {
								acc[num] = num;
								return acc;
							}, {})}
						/>
					</div>

					<Select
						store={adminStore}
						id="gender"
						label="Giới tính"
						name="gender"
						options={{
							0: "Nam",
							1: "Nữ",
							2: "Khác",
							3: "Không muốn tiết lộ",
						}}
					/>

					{/* Avatar + Button thay ảnh đại diện */}
					<div className="p-6 flex items-center gap-6">
						<div className="ring-4 ring-offset-4 rounded-full ring-gray-2light">
							<Avatar className="size-32">
								<AvatarImage src={form.avatar.value} />
								<AvatarFallback>
									{combineIntoAvatarName(form.ten.value, form.ho.value)}
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
						<Field
							store={adminStore}
							id="username"
							label="Tên đăng nhập"
							name="username"
						>
							<UserIcon />
						</Field>

						<Field
							label="Email"
							id="email"
							type="email"
							required={true}
							pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
							//  compareFunction={async (value) => !(await checkDuplicate(value))} // phúc kt chỗ này nhé hihi (kt email đã tồn tại chưa)
							errorMessage="Email không hợp lệ hoặc đã tồn tại."
							store={adminStore}
						>
							<AtIcon />
						</Field>
					</div>
					{/* Đổi mật khẩu */}
					<div className="space-y-5">
						{/* Đổi mật khẩu */}
						<p className="font-medium">Đổi mật khẩu</p>
						<Field
							type={showOldPassword ? "text" : "password"}
							store={adminStore}
							id="oldPassword"
							label="Mật khẩu cũ"
							name="oldPassword"
						>
							<div
								onClick={() => setShowOldPassword(!showOldPassword)}
								className="cursor-pointer"
							>
								{showOldPassword ? (
									<EyeSplashIcon className="w-full" />
								) : (
									<EyeIcon className="w-full" />
								)}
							</div>
						</Field>

						<Field
							type={showNewPassword ? "text" : "password"}
							store={adminStore}
							id="newPassword"
							label="Mật khẩu mới"
							required={true}
							pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$"
							errorMessage="Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số."
						>
							<div
								onClick={() => setShowNewPassword(!showNewPassword)}
								className="cursor-pointer"
							>
								{showNewPassword ? (
									<EyeSplashIcon className="w-full" />
								) : (
									<EyeIcon className="w-full" />
								)}
							</div>
						</Field>

						<Field
							type={showConfirmPassword ? "text" : "password"}
							store={adminStore}
							id="confirmPassword"
							label="Nhập lại mật khẩu mới"
							required={true}
							compareFunction={(value) => value === form.newPassword.value}
							errorMessage="Mật khẩu xác nhận không khớp."
						>
							<div
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className="cursor-pointer"
							>
								{showConfirmPassword ? (
									<EyeSplashIcon className="w-full" />
								) : (
									<EyeIcon className="w-full" />
								)}
							</div>
						</Field>
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
