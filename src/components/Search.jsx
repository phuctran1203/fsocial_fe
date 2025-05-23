import { SearchIcon } from "lucide-react";
import React from "react";

export default function Search({ value, onChange, placeholder }) {
	return (
		<div className="relative size-full">
			<input
				type="text"
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				className="size-full pl-8 pr-4 border rounded-lg bg-transparent hover:border-gray"
			/>
			<div className="absolute left-2 top-1/2 -translate-y-1/2">
				<SearchIcon className="size-[18px] text-gray" />
			</div>
		</div>
	);
}
