import { getComplaint } from "@/api/complaintApi";
import Button from "@/components/Button";
import ButtonGroup from "@/components/ButtonGroup";
import { TrashCanIcon, CalendarIcon, PencilIcon } from "@/components/Icon";
import Search from "@/components/Search";
import Table from "@/components/Table";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminComplaint() {
	const [searchValue, setSearchValue] = useState("");

	const buttonItems = ["Tất cả", "Bài viết", "Người dùng"];
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState("Tất cả");
	const headers = [
		"Người báo cáo",
		"Loại báo cáo",
		"Người dùng/Bài viết bị báo cáo",
		"Nội dung báo cáo",
		"Ngày báo cáo",
		"Hành động",
	];
	const fetchComplant = async () => {
		const res = await getComplaint();
		console.log("complaint :", res);

		return res.data;
	};
	useEffect(() => {
		const fetchData = async () => {
			const fetch = await fetchComplant();
			setData(fetch);
			setFilteredData(fetch);
		};

		fetchData();
	}, []);

	useEffect(() => {
		const result = data.filter((item) =>
			Object.values(item).some((val) => val?.toString().toLowerCase().includes(searchValue.toLowerCase()))
		);
		setFilteredData(result);
	}, [searchValue, data]);

	const handleSearch = (value) => {
		setSearchValue(value);
	};

	const handleSelected = (value) => {
		const currentSelected = buttonItems[value];
		console.log(currentSelected.toLowerCase());

		if (currentSelected.toLowerCase() != "tất cả") {
			setFilteredData(
				data.filter((item) => {
					return item.complaintType.toLowerCase() === currentSelected.toLocaleLowerCase();
				})
			);
		} else {
			setFilteredData(data);
		}
		setSelected(currentSelected);
	};

	const handleReadComplaint = (id) => {
		setData(
			filteredData.map((item) => {
				if (item.id === id) item.status = true;
				return {
					...item,
				};
			})
		);
	};

	const handleRemoveComplaint = (id) => {
		setData(
			filteredData.filter((item) => {
				if (item.id !== id)
					return {
						...item,
					};
			})
		);
	};

	return (
		<div className="pb-1 bg-background rounded-lg flex-grow border shadow flex flex-col gap-3">
			<div className="px-4 pt-4">
				<h5>Lịch sử báo báo</h5>
				<p className="fs-sm text-gray">Quản lý báo cáo vi phạm người dùng, bài viết</p>
			</div>

			<div className="px-4 flex justify-between flex-shrink-0 h-[40px]">
				<ButtonGroup onClick={(e) => handleSelected(e)} items={buttonItems} />
				<div className="flex justify-between w-[400px] gap-3">
					<Search value={searchValue} onChange={(e) => handleSearch(e.target.value)} placeholder={"Tìm kiếm"} />
					<Button className="btn-transparent !w-fit px-2 border !rounded-lg">
						<CalendarIcon />
					</Button>
				</div>
			</div>

			<Table loading={loading} headers={headers}>
				{filteredData.length === 0 && (
					<tr>
						<td colSpan={7} align="center" className="py-5">
							Không có khiếu nại nào
						</td>
					</tr>
				)}
				{filteredData.map((item, index) => (
					<tr key={index} className={`hover:bg-secondary border-t ${item.status && "bg-secondary"}`}>
						<td align="center" className="ps-2 pe-4 py-5 fs-xs text-gray">
							{index + 1}
						</td>
						<td className="px-2">
							<p className="pt-1 leading-5 fs-xs font-medium">{item.firstName + " " + item.lastName}</p>
							<Link to="" className="fs-xs text-gray hover:underline">
								{item.userName}
							</Link>
						</td>
						<td className="px-2 fs-xs">{item.complaintType}</td>
						<td className="px-2 text-primary">
							<Link to={item.profileId} className="fs-xs font-medium hover:underline">
								{item.profileId}
							</Link>
						</td>
						<td className="px-2 fs-xs">{item.termOfService}</td>
						<td className="px-2 fs-xs text-gray">{item.dateTime}</td>
						<td align="center" className="px-2">
							<button className="me-3" onClick={() => handleRemoveComplaint(item.id)}>
								<TrashCanIcon className="size-5" />
							</button>
							<button className="relative" onClick={() => handleReadComplaint(item.id)}>
								<PencilIcon />
								{!item.status && <div className="absolute -top-1 left-full size-2 bg-primary rounded-full" />}
							</button>
						</td>
					</tr>
				))}
			</Table>
		</div>
	);
}
