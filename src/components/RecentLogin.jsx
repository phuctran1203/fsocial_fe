import React from "react";
import { XMarkIcon } from "./Icon";
import Button from "./Button";

export default function RecentLogin() {
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

	const handleRemoveSavedAccount = () => {};
	return (
		<div className="grid gap-4 md:grid-cols-3 grid-cols-2">
			{list.map((user, index) => (
				<div
					key={index}
					className="group relative max-w-52 border border-gray-2light rounded cursor-pointer overflow-hidden"
				>
					<div className="aspect-square">
						<img src={user.avatar} alt={user.name} className="size-full object-cover" />
					</div>
					<p className="bg-gray-3light text-center py-2.5 font-semibold">{user.name}</p>
					<Button
						className="absolute right-1 top-1 btn-secondary border !size-7 opacity-0 group-hover:opacity-100 !rounded-full transition-[--transition]"
						onClick={handleRemoveSavedAccount}
					>
						<XMarkIcon />
					</Button>
				</div>
			))}

			<div className="overflow-hidden max-w-52 border border-gray-2light rounded cursor-pointer">
				<div className=" aspect-square grid place-content-center border-b-2">
					<div className="bg-primary size-10 rounded-full">
						<svg fill="none" viewBox="0 0 24 24">
							<path
								className="stroke-secondary-text"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 12h12m-6-6v12"
							/>
						</svg>
					</div>
				</div>
				<p className="bg-gray-3light text-center py-2.5 text-primary font-semibold">Thêm tài khoản</p>
			</div>
		</div>
	);
}
