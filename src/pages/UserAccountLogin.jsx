import ChangePasswordModal from "@/components/ChangePasswordModal";
import { JumpingInput } from "@/components/Field";
import { ownerAccountStore } from "@/store/ownerAccountStore";
import { usePopupStore } from "@/store/popupStore";
import { AtSign, UserRound } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function UserAccountLogin() {
	const { showPopup } = usePopupStore();
	const user = ownerAccountStore((state) => state.user);
	const {
		register,
		formState: { errors },
		reset,
	} = useForm({ mode: "all" });

	const handlePopupChangePassword = () => {
		showPopup(null, <ChangePasswordModal />);
	};

	useEffect(() => {
		if (!user?.userId) return;
		reset({
			username: user.username,
			email: user.email,
			password: "****************",
		});
	}, [user?.userId]);

	return (
		<div className="mt-16 flex gap-12">
			<div>
				<p className="mb-5">
					Tiết lộ thông tin đăng nhập có thể dẫn tới mất tài khoản.
				</p>
				<form className="space-y-5">
					<JumpingInput
						label="Tên đăng nhập"
						name="username"
						register={register}
						errors={errors}
						icon={<UserRound className="size-5" />}
						disabled={true}
					/>
					<JumpingInput
						label="Email"
						name="email"
						register={register}
						errors={errors}
						icon={<AtSign className="size-5" />}
						disabled={true}
					/>
					<div>
						<div className="flex gap-2">
							<JumpingInput
								type="password"
								label="Mật khẩu"
								name="password"
								register={register}
								errors={errors}
								disabled={true}
								className="flex-grow"
							/>
							<button
								type="button"
								className="btn-ghost w-32"
								onClick={handlePopupChangePassword}
							>
								Đổi mật khẩu
							</button>
						</div>
						<p className="fs-sm text-gray">
							*Vì lý do bảo mật, mật khẩu sẽ không được hiển thị
						</p>
					</div>
				</form>
			</div>
			<img
				className="max-w-80"
				src="../decor/account_login_info_decor.svg"
				alt=""
			/>
		</div>
	);
}
