import React, { useState } from "react";
import { JumpingInput } from "../components/Field";
import { LoadingIcon, XMarkIcon } from "../components/Icon";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/loginApi";
import { setCookie } from "@/utils/cookie";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, UserRoundIcon } from "lucide-react";
import { useValidRefreshTokenStore } from "@/store/validRefreshTokenStore";
import { useGoogleLogin } from "@react-oauth/google";
import { getUserDOBByGoogle, getUserInfoByGoole } from "@/api/googleApi";
import { toast } from "sonner";

const list = [
  {
    avatar: "./temp/user_1.png",
    name: "Ngô Tấn Hehe",
  },
  {
    avatar: "./temp/user_1.png",
    name: "Ngô Tấn Cang",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { setRefreshToken } = useValidRefreshTokenStore();

  const {
    register,
    formState: { errors, isValid },
    trigger,
    getValues,
  } = useForm({ mode: "all" });

  // Handle ẩn hiện mật khẩu
  const [isShowPassword, setIsShowPassword] = useState(false);

  const [submitClicked, setSubmitClicked] = useState(false);

  const [loginErr, setLoginErr] = useState("");

  const handleSubmitLogin = async () => {
    trigger();
    if (!isValid) return;
    setSubmitClicked(true);
    const data = getValues();
    const sending = {
      username: data.loginName.trim(),
      password: data.password.trim(),
    };

    const result = await login(sending);
    setSubmitClicked(false);

    if (!result || result.statusCode !== 200) {
      setLoginErr(
        result?.message ||
          "Có lỗi xảy ra trong quá trình login, FSocial sẽ sớm khắc phục"
      );
      return;
    }

    // save token and refresh token
    setCookie("access-token", result.data.accessToken, 360 * 10); // 10 năm
    setCookie("refresh-token", result.data.refreshToken, 360 * 10); // 10 năm
    setRefreshToken(result.data.refreshToken);
    navigate("/home");
  };

  // Handle login/signup bằng google
  const hanldeLoginThrowGG = useGoogleLogin({
    scope:
      "openid email profile https://www.googleapis.com/auth/user.birthday.read",
    onSuccess: async (tokenResponse) => {
      const access_token = tokenResponse.access_token;

      const dataBasicUserInfo = await getUserInfoByGoole(access_token);
      if (!dataBasicUserInfo) {
        toast.error(
          "Đã xảy ra lỗi trong quá trình login bằng tài khoản google của bạn"
        );
        return;
      }

      const dataDOBUser = await getUserDOBByGoogle(access_token);
      if (!dataDOBUser) return;

      const date = dataDOBUser.birthdays[0].date;
      const sendingData = {
        userId: dataBasicUserInfo.sub,
        email: dataBasicUserInfo.email,
        firstName: dataBasicUserInfo.given_name,
        lastName: dataBasicUserInfo.family_name,
        avatar: dataBasicUserInfo.picture,
        dob: `${date.year}-${date.month.toString().padStart(2, "0")}-${date.day
          .toString()
          .padStart(2, "0")}`,
      };

      console.log("Data send to BE: ", sendingData);
    },
  });

  const handleRemoveSavedAccount = () => {};

  return (
    <div
      className="
			flex items-center justify-center max-w-[1440px] mx-auto min-h-[100dvh] md:px-6
			md:gap-20 md:flex-nowrap
			sm:bg-transparent
			bg-background gap-4 flex-wrap"
    >
      <div className="h-fit w-[440px] rounded-lg bg-background sm:border sm:shadow-lg sm:px-8 sm:py-10 p-6">
        <div className="mb-4">
          <h2>
            Chào mừng đến với{" "}
            <span className="font-bold text-2xl text-primary-gradient">
              FSocial
            </span>
            👋
          </h2>

          <span>Nền tảng mạng xã hội giới trẻ mới</span>
        </div>
        <div className="mb-4">
          <JumpingInput
            label="Tên đăng nhập/Email"
            name="loginName"
            register={register}
            errors={errors}
            validateOptions={{
              required: "Tên đăng nhập/email không được để trống",
            }}
            icon={<UserRoundIcon className="size-5" />}
          />
        </div>
        <div className="mb-4">
          <JumpingInput
            type={isShowPassword ? "text" : "password"}
            label="Mật khẩu"
            name="password"
            register={register}
            errors={errors}
            validateOptions={{
              required: "Mật khẩu không được để trống",
            }}
            icon={
              !isShowPassword ? (
                <Eye
                  className="size-5"
                  onClick={() => setIsShowPassword(true)}
                />
              ) : (
                <EyeOff
                  className="size-5"
                  onClick={() => setIsShowPassword(false)}
                />
              )
            }
          />
        </div>

        <div className="flex justify-between mb-2">
          <div className="order-2 flex justify-center items-center text-gray">
            {/* <label htmlFor="remmeberme" className="cursor-pointer flex items-center">
							<input type="checkbox" name="remmeberme" id="remmeberme" className="size-4 mr-1" />
							<span className="fs-sm">Ghi nhớ đăng nhập</span>
						</label> */}
          </div>
          <div>
            <Link
              to="/forgot-password"
              className="order-1 underline fs-sm font-semibold"
            >
              Quên mật khẩu?
            </Link>
          </div>
        </div>

        <div className="mb-4">
          {!submitClicked && <p className="text-red-600">{loginErr}</p>}
          <Button className={`btn-primary py-3`} onClick={handleSubmitLogin}>
            {submitClicked ? <LoadingIcon /> : "Đăng nhập"}
          </Button>
        </div>
        <div className="flex items-center justify-center my-6">
          <div className="border-t border-gray-light flex-grow"></div>
          <span className="px-4 text-gray-light">Hoặc</span>
          <div className="border-t border-gray-light flex-grow"></div>
        </div>
        <div className="mb-4">
          <button
            className="btn-outline mb-5 gap-3 py-3"
            onClick={hanldeLoginThrowGG}
          >
            <img className="size-6" src="./decor/google_icon.svg" alt="" />
            Đăng nhập với Google
          </button>
        </div>
        <div className="flex justify-center items-center">
          <span className="text-gray">
            Chưa có tài khoản?{" "}
            <Link
              to="/signup"
              className="underline cursor-pointer font-semibold text-primary-text"
            >
              Tạo tài khoản mới
            </Link>
          </span>
        </div>
      </div>

      <div className="md:w-[550px] px-6 mb-28">
        <h1 className="mb-2 md:text-5xl text-4xl text-primary-gradient hidden sm:block">
          FSocial
        </h1>
        <div className="mb-3">
          <h1>Đăng nhập gần đây</h1>
          <p className="text-gray">
            Chọn ảnh tài khoản hoặc ấn dấu “+” để thêm tài khoản mới
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 grid-cols-2">
          {list.map((user, index) => (
            <div
              key={index}
              className="group relative max-w-52 border border-field rounded cursor-pointer overflow-hidden"
            >
              <div className="aspect-square border-b">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="size-full object-cover"
                />
              </div>

              <p className="text-center py-2.5 font-semibold">{user.name}</p>

              <Button
                className="absolute right-1 top-1 btn-secondary border border-field size-7 sm:opacity-0 group-hover:opacity-100 rounded-full transition"
                onClick={handleRemoveSavedAccount}
              >
                <XMarkIcon className="size-5" strokeWidth={3} />
              </Button>
            </div>
          ))}

          <div className="overflow-hidden max-w-52 border border-field rounded cursor-pointer">
            <div className=" aspect-square grid place-content-center border-b border-field">
              <div className="bg-primary-gradient lg:size-12 size-10 rounded-full">
                <svg fill="none" viewBox="0 0 24 24">
                  <path
                    className="stroke-txtWhite"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 12h12m-6-6v12"
                  />
                </svg>
              </div>
            </div>

            <p className="text-center py-2.5 text-primary-text font-semibold">
              Thêm tài khoản
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
