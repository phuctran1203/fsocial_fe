import React from "react";
import { LoadingIcon } from "./Icon";

export default function Table({ headers, loading, children }) {
	return (
		<div className="relative flex-grow overflow-y-auto">
			<table className="w-full text-left">
				<thead className="bg-gray-3light fs-xs text-gray sticky top-0 z-10">
					<tr>
						<th scope="col" align="center" className="ps-2 pe-4 py-3 font-normal">
							STT
						</th>
						{headers.map((header, index) => (
							<th key={index} scope="col" className="px-2 font-normal">
								{header}
							</th>
						))}
					</tr>
				</thead>

				<tbody className="cursor-pointer">
					{loading && (
						<tr className="h-52">
							<td colSpan={7} className="">
								<div className="mx-auto w-fit">
									<LoadingIcon stroke="stroke-gray" size="size-8" />
								</div>
							</td>
						</tr>
					)}
					{children}
				</tbody>
			</table>
		</div>
	);
}
