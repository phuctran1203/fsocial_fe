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
} from "../components/Icon";

const AdminProfile = () => {
  const form = adminStore((state) => state.form) || {};

  // Handle ẩn hiện mật khẩu
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [userData, setUserData] = useState({
    ten: form.ten?.value || "",
    ho: form.ho?.value || "",
    day: form.day?.value || "",
    month: form.month?.value || "",
    year: form.year?.value || "",
    gender: form.gender?.value || "",
    username: form.username?.value || "",
    email: form.email?.value || "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    avatar: form.avatar?.value || "../temp/default_avatar.svg",
  });

  const fileInputRef = useRef(null);

  // Xử lý thay đổi dữ liệu nhập vào
  const handleChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);

      adminStore.setState((state) => ({
        form: {
          ...state.form,
          avatar: { ...state.form.avatar, value: imageUrl },
        },
      }));
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

    // Cập nhật dữ liệu vào Zustand store
    adminStore.setState((state) => ({
      form: {
        ...state.form,
        ten: { ...state.form.ten, value: userData.ten },
        ho: { ...state.form.ho, value: userData.ho },
        day: { ...state.form.day, value: userData.day },
        month: { ...state.form.month, value: userData.month },
        year: { ...state.form.year, value: userData.year },
        gender: { ...state.form.gender, value: userData.gender },
        username: { ...state.form.username, value: userData.username },
        email: { ...state.form.email, value: userData.email },
        avatar: { ...state.form.avatar, value: userData.avatar },
      },
    }));

    alert("Cập nhật thông tin thành công!");
  };

  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-lg mx-6 flex flex-col flex-grow p-10">
      {/* Tiêu đề */}
      <h1 className="text-2xl font-bold">
        Chào buổi tối, <span className="text-orange-500">{form.ten.value}</span>
      </h1>
      <p className="text-gray-600 text-sm">
        Cập nhật thông tin của bạn tại đây. Không chia sẻ thông tin để tránh rủi
        ro phát sinh.
      </p>

      {/* Form chỉnh sửa */}
      <div className="flex flex-grow gap-10 mt-12">
        <div className="w-1/2 flex flex-col gap-4 pl-24">
          <h2 className="text-lg font-semibold">Thông tin cá nhân</h2>

          <div className="grid grid-cols-2 gap-2 w-[480px]">
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

          <div className="grid grid-cols-3 gap-2 w-[480px]">
            <Field
              label="Ngày sinh"
              id="day"
              required={true}
              pattern="^(0?[1-9]|[12][0-9]|3[01])$"
              errorMessage="Ngày sinh phải từ 1 - 31."
              store={adminStore}
            />
            <Field
              label="Tháng sinh"
              id="month"
              required={true}
              pattern="^(0?[1-9]|1[0-2])$"
              errorMessage="Tháng sinh phải từ 1 - 12."
              store={adminStore}
            />
            <Field
              label="Năm sinh"
              id="year"
              required={true}
              pattern={`^(19[0-9]{2}|20[0-${currentYear % 10}][0-9])$`}
              errorMessage={`Năm sinh phải từ 1900 đến ${currentYear}.`}
              store={adminStore}
            />
          </div>

          <Select
            store={adminStore}
            id="gender"
            label="Giới tính"
            name="gender"
            options={{ male: "nam", female: "nu" }}
            className="w-[480px]"
          />

          {/* Avatar + Button thay ảnh đại diện */}
          <div className="flex items-center gap-6 mt-4">
            <img
              src={form.avatar?.value || "../temp/default_avatar.svg"}
              alt="Avatar"
              className="w-60 h-60 rounded-full object-cover border"
            />

            <label className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition cursor-pointer">
              Thay ảnh đại diện
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload} //  Cập nhật avatar khi chọn ảnh mới
              />
            </label>
          </div>
        </div>

        {/* Thông tin đăng nhập */}
        <form action="">
          <div className="flex-grow flex flex-col gap-4 -translate-x-3">
            <h2 className="text-lg font-semibold">Thông tin đăng nhập</h2>
            <Field
              store={adminStore}
              id="username"
              label="Tên đăng nhập"
              name="username"
              className="w-[480px]"
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

            {/* Đổi mật khẩu */}
            <h2 className="text-lg font-semibold mt-4">Đổi mật khẩu</h2>
            <Field
              type={showOldPassword ? "text" : "password"}
              store={adminStore}
              id="oldPassword"
              label="Mật khẩu cũ"
              name="oldPassword"
              className="w-[480px]"
            >
              <div
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="cursor-pointer"
              >
                {showOldPassword ? (
                  <EyeSplashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
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
              className="w-[480px]"
            >
              <div
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="cursor-pointer"
              >
                {showNewPassword ? (
                  <EyeSplashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
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
              className="w-[480px]"
            >
              <div
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeSplashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </div>
            </Field>
          </div>
        </form>
      </div>

      {/* 🔹 Cập nhật thông tin khi ấn nút */}
      <div className="mt-6 flex justify-center">
        <Button
          onClick={handleUpdateProfile}
          className="btn-primary px-6 py-2 max-w-fit rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-all"
        >
          Cập nhật thay đổi
        </Button>
      </div>
    </div>
  );
};

export default AdminProfile;
