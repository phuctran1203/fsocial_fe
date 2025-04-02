import React, { useEffect, useState } from "react";
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Area,
	AreaChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Label,
	Pie,
	PieChart,
} from "recharts";
import {
	CrownTop1Icon,
	CrownTop2Icon,
	CrownTop3Icon,
	GenderIcon,
	NewCreatedAccountIcon,
	PostProfileTabIcon,
} from "@/components/Icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { vi } from "date-fns/locale";
import { Link } from "react-router-dom";
import Button from "@/components/Button";
import {
	fakeChartDataPosts,
	fakeChartDataNumberCreatedAccounts,
	fakeChartDataNumberComplaints,
	fakeChartDataGender,
	fakeTopKOL,
} from "../data/fakeDataAdminReports";
import {
	combineIntoAvatarName,
	combineIntoDisplayName,
} from "@/utils/combineName";
import { MessageSquareWarning, Star } from "lucide-react";
import {
	dateClassToISO8601,
	dateTimeToReportsLabel,
} from "@/utils/convertDateTime";
import {
	getNumberOfComplaint,
	getNumberOfNewRegistration,
	getNumberOfPost,
} from "@/api/adminReportApi";

const RenderLineChart = (props) => {
	const {
		icon,
		label,
		total,
		idFill,
		colorClassName,
		data,
		config,
		amountHorizoneLine,
		legend,
	} = props;

	return (
		<>
			<div className="flex items-center gap-3">
				<span className="border shadow rounded-full size-8 grid place-content-center fill-gray">
					{icon}
				</span>
				<span className="flex-grow fs-xs text-gray">{label}</span>
				<div className="w-fit text-end">
					<span className="fs-xs text-gray">Tổng</span>
					<h4 className={colorClassName}>{total}</h4>
				</div>
			</div>
			<ChartContainer config={config} className="size-full flex-grow min-h-0">
				<AreaChart
					accessibilityLayer
					data={data}
					margin={{
						left: -20,
						right: 12,
					}}
				>
					<CartesianGrid
						vertical={false}
						strokeDasharray="3 3"
						className="stroke-1 stroke-gray-2light"
					/>

					<XAxis
						dataKey="label"
						tickLine={false}
						axisLine={false}
						tickMargin={8}
						tickFormatter={(value) => value.slice(0, 5)}
					/>
					<YAxis
						tickLine={false}
						axisLine={false}
						tickMargin={8}
						tickCount={amountHorizoneLine}
					/>
					<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
					<defs>
						<linearGradient id={`fill-${idFill}`} x1="0" y1="0" x2="0" y2="1">
							<stop
								offset="5%"
								stopColor={`var(--color-value)`}
								stopOpacity={0.9}
							/>
							<stop
								offset="95%"
								stopColor={`var(--color-value)`}
								stopOpacity={0.2}
							/>
						</linearGradient>
					</defs>

					<Area
						dataKey="value"
						type="natural"
						fill={`url(#fill-${idFill})`}
						fillOpacity={0.4}
						stroke={`var(--color-value)`}
						stackId="a"
					/>
					{legend && <ChartLegend content={<ChartLegendContent />} />}
				</AreaChart>
			</ChartContainer>
		</>
	);
};

const chartConfigPosts = {
	value: {
		label: "Số lượng bài đăng mới",
		color: "var(--orange-chart-clr)",
	},
};

const chartConfigNumberCreatedAccounts = {
	value: {
		label: "Số lượng tài khoản mới",
		color: "var(--blue-chart-clr)",
	},
};

const chartConfigNumberComplaints = {
	value: {
		label: "Số lượng khiếu nại",
		color: "var(--green-chart-clr)",
	},
};

const chartConfigGender = {
	amount: {
		label: "Số lượng",
	},
	male: {
		label: "Nam",
		color: "var(--orange-chart-clr)",
	},
	female: {
		label: "Nữ",
		color: "var(--blue-chart-clr)",
	},
	others: {
		label: "Khác",
		color: "var(--green-chart-clr)",
	},
};

const analyzeTemplate = [
	{
		label: "Hôm nay",
		from: new Date(),
		to: new Date(),
	},
	{
		label: "7 ngày trước",
		from: new Date(new Date().setDate(new Date().getDate() - 7)),
		to: new Date(),
	},
	{
		label: "14 ngày trước",
		from: new Date(new Date().setDate(new Date().getDate() - 14)),
		to: new Date(),
	},
	{
		label: "Tháng trước",
		from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), // Ngày 1 của tháng trước
		to: new Date(
			new Date().getFullYear(),
			new Date().getMonth(),
			0,
			23,
			59,
			59
		), // Ngày cuối cùng của tháng trước
	},
	{
		label: "Từ đầu năm",
		from: new Date(new Date().getFullYear(), 0, 1),
		to: new Date(),
	},
];

export default function AdminReports() {
	const [chartDataPosts, setChartDataPosts] = useState([]);
	const [chartDataNumberCreatedAccounts, setChartDataNumberCreatedAccounts] =
		useState([]);
	const [chartDataNumberComplaints, setChartDataNumberComplaints] = useState(
		[]
	);
	const [topKOL, setTopKOL] = useState([]);
	// tính total
	const totalPosts = chartDataPosts.reduce((sum, item) => item.value + sum, 0);
	const totalCreatedAccount = chartDataNumberCreatedAccounts.reduce(
		(sum, item) => item.value + sum,
		0
	);
	const totalComplaint = chartDataNumberComplaints.reduce(
		(sum, item) => item.value + sum,
		0
	);
	const totalVisitors = fakeChartDataGender.reduce(
		(sum, item) => sum + item.value,
		0
	);

	// state for date picker
	const [templateSelect, setTemplateSelect] = useState(-1); //active UI các template tự chọn date
	const [date, setDate] = useState({ from: new Date(), to: new Date() });

	const handleOnSelectDate = (data) => {
		setTemplateSelect(-1);
		setDate(data);
	};

	const handleAcceptDate = () => {
		fetchReports();
	};

	const handleCancleDate = () => {
		setTemplateSelect(-1);
		setDate({ from: new Date(), to: new Date() });
	};

	const handleSetTemplate = (template, index) => {
		setTemplateSelect(index);
		setDate({ from: template.from, to: template.to });
	};

	const reFormatDataReports = (data) => {
		return data.map((item) => {
			let label;
			if (item.hour) label = item.hour.toString().padStart(2, "0") + ":00";
			else label = dateTimeToReportsLabel(item.date);
			return {
				label: label,
				value: item.count,
			};
		});
	};

	const fetchReports = async () => {
		const start = dateClassToISO8601(date?.from ? date.from : new Date());
		const end =
			date?.from &&
			date?.to &&
			date.from.toDateString() !== date.to.toDateString()
				? dateClassToISO8601(date.to)
				: null;

		console.log("start: ", start, "end: ", end);

		const [respPostCreated, respRegistration, respComplaint] =
			await Promise.all([
				getNumberOfPost(start, end),
				getNumberOfNewRegistration(start, end),
				getNumberOfComplaint(start, end),
			]);

		if (respPostCreated && respPostCreated.statusCode === 200) {
			const processData = reFormatDataReports(respComplaint.data);
			setChartDataPosts(processData);
		}

		if (respRegistration && respRegistration.statusCode === 200) {
			const processData = reFormatDataReports(respRegistration.data);
			setChartDataNumberCreatedAccounts(processData);
		}

		if (respComplaint && respComplaint.statusCode === 200) {
			const processData = reFormatDataReports(respComplaint.data);
			setChartDataNumberComplaints(processData);
		}

		setTopKOL(fakeTopKOL);
	};

	useEffect(() => {
		fetchReports();
	}, []);

	return (
		<div className="flex-grow grid grid-cols-12 gap-4 grid-rows-2">
			<div className="col-span-8 p-3 bg-background rounded-lg border shadow flex flex-col">
				<RenderLineChart
					icon={<PostProfileTabIcon className="size-3.5" />}
					label="Số lượng bài đăng"
					total={totalPosts}
					idFill="numberPosts"
					colorClassName="text-chart-orange"
					data={chartDataPosts}
					config={chartConfigPosts}
					amountHorizoneLine={5}
					legend={true}
				/>
			</div>
			{/* lịch */}
			<div className="col-span-4 bg-background rounded-lg border shadow flex gap-2 p-2">
				<div className="flex-grow space-y-1">
					{analyzeTemplate.map((templatePicker, index) => (
						<button
							key={index}
							className={`w-full text-left p-2 rounded-md hover:bg-gray-3light font-medium text-gray fs-xs ${
								templateSelect === index && "bg-gray-2light text-primary-text"
							}`}
							onClick={() => handleSetTemplate(templatePicker, index)}
						>
							{templatePicker.label}
						</button>
					))}
				</div>
				<div>
					<Calendar
						locale={vi}
						mode="range"
						selected={date}
						onSelect={handleOnSelectDate}
						className="p-0"
					/>
					<div className="flex gap-4 mt-1">
						<Button
							className="fs-xs px-8 py-1.5 btn-primary text-nowrap"
							onClick={handleAcceptDate}
						>
							Thống kê
						</Button>
						<Button
							className="fs-xs px-8 py-1.5 btn-transparent border text-nowrap"
							onClick={handleCancleDate}
						>
							Đặt lại
						</Button>
					</div>
				</div>
			</div>
			{/* chart đôi */}
			<div className="col-span-6 bg-background p-3 rounded-lg border shadow grid grid-rows-2 gap-2">
				<div className="flex flex-col">
					<RenderLineChart
						icon={<NewCreatedAccountIcon />}
						label="Lượt tạo tài khoản mới"
						total={totalCreatedAccount}
						idFill="numberCreatedAccounts"
						colorClassName="text-chart-blue"
						data={chartDataNumberCreatedAccounts}
						config={chartConfigNumberCreatedAccounts}
						amountHorizoneLine={2}
						legend={false}
					/>
				</div>
				<div className="flex flex-col">
					<RenderLineChart
						icon={<MessageSquareWarning className="size-4 stroke-gray" />}
						label="Lượt khiếu nại"
						total={totalComplaint}
						idFill="numberComplaints"
						colorClassName="text-chart-green"
						data={chartDataNumberComplaints}
						config={chartConfigNumberComplaints}
						amountHorizoneLine={2}
						legend={false}
					/>
				</div>
			</div>
			{/* chart pie giới tính */}
			<div className="col-span-3 bg-background p-3 rounded-lg border shadow">
				<div className="flex items-center gap-3">
					<span className="border shadow rounded-full size-8 grid place-content-center fill-gray">
						<GenderIcon />
					</span>
					<span className="flex-grow fs-xs text-gray">Thống kê giới tính</span>
				</div>
				<ChartContainer config={chartConfigGender} className="aspect-square">
					<PieChart>
						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
						<Pie
							data={fakeChartDataGender}
							dataKey="value"
							nameKey="label"
							innerRadius={55}
							strokeWidth={5}
						>
							<Label
								content={({ viewBox }) => {
									if (viewBox && "cx" in viewBox && "cy" in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="middle"
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className="fill-primary-text text-3xl font-bold"
												>
													{totalVisitors.toLocaleString()}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className="fill-gray"
												>
													tài khoản
												</tspan>
											</text>
										);
									}
								}}
							/>
						</Pie>
						<ChartLegend content={<ChartLegendContent />} />
					</PieChart>
				</ChartContainer>
			</div>
			{/* top KOL */}
			<div className="pb-1 col-span-3 bg-background rounded-lg border shadow flex flex-col">
				<div className="p-3 flex items-center gap-3">
					<span className="border shadow rounded-full size-8 grid place-content-center">
						<Star className="size-4 stroke-gray" />
					</span>
					<span className="flex-grow fs-xs text-gray">Bảng xếp hạng KOL</span>
				</div>
				<div className="flex-grow overflow-y-auto">
					{topKOL.map((kol, index) => (
						<div
							key={kol.id}
							className="px-4 py-2 flex gap-3 items-center hover:bg-gray-3light"
						>
							<span className="fs-xs">{index + 1}</span>
							<div className="relative">
								<Avatar className={`size-10`}>
									<AvatarImage src={kol.avatar} />
									<AvatarFallback className="text-[12px]">
										{combineIntoAvatarName(kol.firstName, kol.lastName)}
									</AvatarFallback>
								</Avatar>
								<div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/3">
									{index + 1 === 1 && <CrownTop1Icon />}
									{index + 1 === 2 && <CrownTop2Icon />}
									{index + 1 === 3 && <CrownTop3Icon />}
								</div>
							</div>
							<div className="flex-grow">
								<p className="font-medium fs-sm">
									{combineIntoDisplayName(kol.firstName, kol.lastName)}
								</p>
								<Link to="" className="fs-xs text-gray hover:underline">
									{kol.username}
								</Link>
							</div>
							<span className="fs-xs">{kol.numberFollowers}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
