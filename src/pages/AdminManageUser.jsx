import ButtonGroup from "@/components/ButtonGroup";
import { ReadIcon, TrashCanIcon, SearchInApiIcon, UnReadIcon } from "@/components/Icon";
import Search from "@/components/Search";
import Table from "@/components/Table";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminManagerUser() {
	const [searchValue, setSearchValue] = useState("");

	const buttonItems = ["Tất cả", "Bị cấm", "Bình thường"];
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState("Tất cả");
	const headers = [
		"Người báo cáo",
		"Đường dẫn tài khoản",
		"Ngày tạo tài khoản",
		"Lần hoạt động cuối cùng",
		"Hành động",
	];
	const fetchComplant = () => {
		const currenData = [
			{
				status: true,
				id: "lạdlfka",
				displayName: "Cang Ngô 123",
				complaint: "http://localhost:3000/postId?=bai-viet-hoi-nhay-cam-hihi",
				createDate: "11/02/2004",
				onlineLated: "11/02/2025",
				userName: "cangngo",
			},
			{
				status: false,
				id: "lạdlfkaư",
				displayName: "Cang Ngô",
				complaintType: "Người dùng",
				complaint: "http://localhost:3000/postId?=bai-viet-hoi-nhay-cam-hihi",
				createDate: "11/02/2004",
				onlineLated: "11/02/2025",
				userName: "cangngo",
			},
			{
				status: false,
				id: "lạdlfkea",
				displayName: "Cang Ngô",
				complaintType: "Người dùng",
				complaint: "http://localhost:3000/postId?=bai-viet-hoi-nhay-cam-hihi",
				createDate: "11/02/2004",
				onlineLated: "11/02/2025",
				userName: "cangngo",
			},
			{
				status: false,
				id: "lạdlưfka",
				displayName: "Cang Ngô",
				complaintType: "Người dùng",
				complaint: "http://localhost:3000/postId?=bai-viet-hoi-nhay-cam-hihi",
				createDate: "11/02/2004",
				onlineLated: "11/02/2025",
				userName: "cangngo",
			},
			{
				status: false,
				id: "lạdlfqka",
				displayName: "Cang Ngô",
				complaint: "http://localhost:3000/postId?=bai-viet-hoi-nhay-cam-hihi",
				createDate: "11/02/2004",
				onlineLated: "11/02/2025",
				userName: "cangngo",
			},
			{
				status: false,
				id: "lạdlfska",
				displayName: "Cang Ngô",
				complaint: "http://localhost:3000/postId?=bai-viet-hoi-nhay-cam-hihi",
				createDate: "11/02/2004",
				onlineLated: "11/02/2025",
				userName: "cangngo",
			},
			{
				status: false,
				id: "lạdlfkfa",
				displayName: "Cang Ngô",
				complaint: "http://localhost:3000/postId?=bai-viet-hoi-nhay-cam-hihi",
				createDate: "11/02/2004",
				onlineLated: "11/02/2025",
				userName: "cangngo",
			},
			{
				status: false,
				id: "lạdlfkca",
				displayName: "Cang Ngô",
				complaint: "http://localhost:3000/postId?=bai-viet-hoi-nhay-cam-hihi",
				createDate: "11/02/2004",
				onlineLated: "11/02/2025",
				userName: "cangngo",
			},

			{
				status: false,
				id: "lạdlfxka",
				displayName: "Cang Ngô",
				complaint: "http://localhost:3000/postId?=bai-viet-hoi-nhay-cam-hihi",
				createDate: "11/02/2004",
				onlineLated: "11/02/2025",
				userName: "cangngo",
			},
			{
				status: false,
				id: "lạdlzfka",
				displayName: "Cang Ngô",
				complaint: "http://localhost:3000/postId?=bai-viet-hoi-nhay-cam-hihi",
				createDate: "11/02/2004",
				onlineLated: "11/02/2025",
				userName: "cangngo",
			},
			{
				status: false,
				id: "lạdvlfka",
				displayName: "Cang Ngô",
				complaint: "http://localhost:3000/postId?=bai-viet-hoi-nhay-cam-hihi",
				createDate: "11/02/2004",
				onlineLated: "11/02/2025",
				userName: "cangngo",
			},
			{
				status: false,
				id: "lạdlfkba",
				displayName: "Cang Ngô",
				complaint: "http://localhost:3000/postId?=bai-viet-hoi-nhay-cam-hihi",
				createDate: "11/02/2004",
				onlineLated: "11/02/2025",
				userName: "cangngo",
			},
			{
				status: false,
				id: "lạdlfka",
				displayName: "Cang Ngô",
				complaint: "http://localhost:3000/postId?=bai-viet-hoi-nhay-cam-hihi",
				createDate: "11/02/2004",
				onlineLated: "11/02/2025",
				userName: "cangngo",
			},
		];

		return currenData;
	};
	useEffect(() => {
		const fetch = fetchComplant();
		setData(fetch);
		setFilteredData(fetch);
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

		if (currentSelected.toLowerCase() != buttonItems[0].toLowerCase()) {
			setFilteredData(
				data.filter((item) => {
					if (currentSelected.toLowerCase() === buttonItems[1].toLowerCase()) {
						return item.status == false;
					} else {
						return item.status == true;
					}
				})
			);
		} else {
			setFilteredData(data);
		}
		setSelected(currentSelected);
	};

	const handlechecked = (id) => {
		setData(
			filteredData.map((item) => {
				if (item.id === id) item.status = !item.status;
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

	const renderRow = (item) => {
		return (
			<>
				<td className=" text-[#404040]">
					<div className="text-black">{item.displayName}</div>
					<div className="text-gray">{item.userName}</div>
				</td>
				<td className="text-primary hover:cursor-pointer">
					<Link to={item.complaint}>{item.complaint}</Link>
				</td>
				<td>{item.createDate}</td>
				<td>{item.onlineLated}</td>
				<td className="flex">
					<div onClick={() => handleRemoveComplaint(item.id)}>
						<TrashCanIcon />
					</div>
					<div>
						<input
							type="checkbox"
							name="status-user"
							id="status-user"
							checked={item.status === true}
							onChange={() => handlechecked(item.id)}
						/>
					</div>
				</td>
			</>
		);
	};
	return (
		<div className="bg-background rounded-lg flex-grow border shadow">
			<div className="flex flex-col h-[77px] pt-5 pl-6">
				<span className="text-lg">Quản lý người dùng</span>
				<span className="text-sm text-gray">Hành động đối với tài khoản người dùng</span>
			</div>
			<div className="flex justify-between items-center h-[68px] px-4">
				<ButtonGroup onClick={(e) => handleSelected(e)} items={buttonItems} />
				<div className="flex w-[455px] justify-between">
					<Search value={searchValue} onChange={(e) => handleSearch(e.target.value)} placeholder={"Tìm kiếm"} />
					<SearchInApiIcon />
				</div>
			</div>
			<div>
				<Table loading={loading} data={filteredData} renderRow={renderRow} headers={headers} />
			</div>
		</div>
	);
}
