import React, { useState, useEffect } from 'react';
import { Field} from "./Field";
import { EyeIcon, EyeSplashIcon, LoadingIcon } from "./Icon";
import { useChangePasswordModalStore } from "../store/ChangePasswordModalStore";



export default function ChangePasswordModal() {

    const { form, updateField } = useChangePasswordModalStore();

    // Handle ẩn hiện mật khẩu
    const [isShowOldPassword, setIsShowOldPassword] = useState(false);
    const [isShowNewPassword, setIsShowNewPassword] = useState(false);
    const [isShowReNewPassword, setIsShowReNewPassword] = useState(false);


    const handleshowHidePassword = () => {
        if (form.newPassword.value !== form.reNewPassword.value) {
            updateField(reNewPassword, { isValid: false });
        } else {
            updateField(reNewPassword, { isValid: true });
        }
    };

    useEffect(() => {
        handleshowHidePassword();
    }, [form.oldPassword.value, form.newPassword.value, form.reNewPassword.value]);

    return (
        <div className='relative flex flex-col m-2
         mb-4 bg-background sm:w-[550px] sm:min-h-[50dvh] sm:h-fit sm:max-h-[90dvh] w-screen h-[100dvh]'>
            <p className="text-base text-gray-500 mb-4">Luôn giữ bảo mật cho tài khoản của bạn</p>
            <div className='mb-1'>
                <Field
                    type={isShowOldPassword ? "text" : "password"}
                    name="oldPassword"
                    id="oldPassword"
                    label="Mật khẩu"
                    store={useChangePasswordModalStore}
                    required={true}
                    pattern="^(?=.*[A-Za-z])[A-Za-z\d]{7,20}$"
                    errorMessage="Mật khẩu từ 7-20 kí tự, bao gồm cả chữ và số"
                    className='m-4'
                >
                    <div onClick={() => setIsShowOldPassword(!isShowOldPassword)}>
                        <EyeIcon className={`w-full ${isShowOldPassword ? "hidden" : "block"}`} />
                        <EyeSplashIcon className={`w-full ${!isShowOldPassword ? "hidden" : "block"}`} />
                    </div>
                </Field>

                <Field
                    type={isShowNewPassword ? "text" : "password"}
                    name="newPassword"
                    id="newPassword"
                    label="Nhập mật khẩu mới"
                    store={useChangePasswordModalStore}
                    required={true}
                    compareFunction={(value) => form.oldPassword.value !== value}
                    errorMessage="Nhập lại chính xác mật khẩu của bạn"
                    className='m-4'
                >
                    <div onClick={() => setIsShowNewPassword(!isShowNewPassword)}>
                        <EyeIcon className={`w-full ${isShowNewPassword ? "hidden" : "block"}`} />
                        <EyeSplashIcon className={`w-full ${!isShowNewPassword ? "hidden" : "block"}`} />
                    </div>
                </Field>
                <Field
                    type={isShowReNewPassword ? "text" : "password"}
                    name="reNewPassword"
                    id="reNewPassword"
                    label="Nhập lại mật khẩu mới"
                    store={useChangePasswordModalStore}
                    required={true}
                    compareFunction={(value) => form.newPassword.value === value}
                    errorMessage="Nhập lại chính xác mật khẩu của bạn"
                    className='m-4'
                >
                    <div onClick={() => setIsShowReNewPassword(!isShowReNewPassword)}>
                        <EyeIcon className={`w-full ${isShowReNewPassword ? "hidden" : "block"}`} />
                        <EyeSplashIcon className={`w-full ${!isShowReNewPassword ? "hidden" : "block"}`} />
                    </div>
                </Field>
            </div>
            <div className="m-4 text-base text-balance cursor-pointer hover:underline font-semibold">
                Quên mật khẩu?
            </div>
            <button className="w-full mt-4 p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                Xác nhận thay đổi
            </button>
        </div>
    )
}
