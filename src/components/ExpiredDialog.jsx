import { useValidRefreshTokenStore } from "@/store/validRefreshTokenStore";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function ExpiredDialog() {
	const { setRefreshToken } = useValidRefreshTokenStore();

	useEffect(() => {
		setRefreshToken(null);
	}, []);

	return (
		<div className="flex-grow grid place-content-center px-4">
			<div className="sm:w-[400px] w-screen border shadow p-3">
				<h5 className="text-center p-5">Phiên đăng nhập đã hết hạn</h5>
				<img src="./decor/expired_login_decor.svg" alt="" />
				<Link
					className="btn-primary py-2.5"
					to="/login"
					onClick={() => setRefreshToken(null)}
				>
					Xác nhận
				</Link>
			</div>
		</div>
	);
}
