import React from "react";

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
	return (
		<div className="grid gap-4 md:grid-cols-3 grid-cols-2">
			{list.map((user, index) => (
				<div
					key={index}
					className="max-w-52 border border-[--gray-extra-light-clr] rounded cursor-pointer overflow-hidden"
				>
					<div className="aspect-square">
						<img src={user.avatar} alt={user.name} className="size-full object-cover" />
					</div>
					<p className="text-center py-2.5 font-semibold">{user.name}</p>
				</div>
			))}

			<div className="max-w-52 border border-[--gray-extra-light-clr] rounded cursor-pointer">
				<div className=" aspect-square grid place-content-center border-b-2">
					<div className="bg-[--primary-clr] sm:size-15 size-14 rounded-full">
						<svg fill="none" viewBox="0 0 24 24">
							<path
								className="stroke-[--text-white-clr]"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 12h12m-6-6v12"
							/>
						</svg>
					</div>
				</div>
				<p className="text-center py-2.5 text-[--primary-clr] font-semibold">Thêm tài khoản</p>
			</div>
		</div>
	);
}
