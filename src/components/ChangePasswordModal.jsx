import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Field } from "./Field";
import Button from './Button';
import { EyeIcon, EyeSplashIcon, LoadingIcon } from "./Icon";
import { useChangePasswordModalStore } from "../store/ChangePasswordModalStore";
import { usePopupStore } from "@/store/popupStore";


export default function ChangePasswordModal() {

    const navigate = useNavigate();
    const { hidePopup } = usePopupStore();
    const { form, updateField } = useChangePasswordModalStore();

    // Handle ẩn hiện mật khẩu
    const [isShowOldPassword, setIsShowOldPassword] = useState(false);
    const [isShowNewPassword, setIsShowNewPassword] = useState(false);
    const [isShowReNewPassword, setIsShowReNewPassword] = useState(false);

    const [validClicked, setValidClicked] = useState(false);

    const handleshowHidePassword = () => {
        if (form.oldPassword.value !== form.newPassword.value) {
            updateField(newPassword, { isValid: false });
        } else {
            updateField(newPassword, { isValid: true });
        }
    };

    const reValidateNewPassword = () =>
        form.oldPassword.isValid &&
        form.newPassword.isValid &&
        form.reNewPassword.isValid &&
        form.newPassword.value === form.reNewPassword.value &&
        form.oldPassword.value !== form.newPassword.value;


    const gotoForgetPassword = async () => {
        hidePopup();
        setTimeout(() => {
            navigate("/user-forgot-password");
        }, 1500);
    };


    const gotoHome = async () => {
        if (!reValidateNewPassword()) {
            return;
        }

        setTimeout(() => {
            navigate("/home");
        }, 2500);
    };

    useEffect(() => {
        handleshowHidePassword();
    }, [form.oldPassword.value, form.newPassword.value, form.reNewPassword.value]);

    return (
        <div className='relative flex-grow flex flex-col m-2
         bg-background sm:w-[550px] sm:min-h-[50dvh] sm:h-fit sm:max-h-[90dvh] w-screen h-[100dvh]'>
            <div className="overflow-y-auto flex-grow space-y-2">

                <p className="text-base text-gray my-5">Luôn giữ bảo mật cho tài khoản của bạn</p>
                <div className='space-y-3'>
                    <div className='grid gap-5'>
                        <Field
                            type={isShowOldPassword ? "text" : "password"}
                            name="oldPassword"
                            id="oldPassword"
                            label="Mật khẩu"
                            store={useChangePasswordModalStore}
                            required={true}
                            pattern="^(?=.*[A-Za-z])[A-Za-z\d]{7,20}$"
                            errorMessage="Mật khẩu từ 7-20 kí tự, bao gồm cả chữ và số"

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

                        >
                            <div onClick={() => setIsShowReNewPassword(!isShowReNewPassword)}>
                                <EyeIcon className={`w-full ${isShowReNewPassword ? "hidden" : "block"}`} />
                                <EyeSplashIcon className={`w-full ${!isShowReNewPassword ? "hidden" : "block"}`} />
                            </div>
                        </Field>
                    </div>
                    <div className="m-4 text-base text-balance cursor-pointer hover:underline font-semibold"
                        onClick={gotoForgetPassword}
                    >
                        Quên mật khẩu?
                    </div>

                    <Button
                        className={`btn-primary mt-4 px-8 py-3`}
                        onClick={gotoHome}
                    >
                        {validClicked ? <LoadingIcon /> : "Xác nhận thay đổi"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
