import React, { useEffect, useMemo, useState } from "react";
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Label, Pie, PieChart } from "recharts";
import { ComplaintIcon, GenderIcon, NewCreatedAccountIcon, PostProfileTabIcon } from "@/components/Icon";

const fakeChartDataPosts = [
	{ month: "T1", numberPosts: 186 },
	{ month: "T2", numberPosts: 305 },
	{ month: "T3", numberPosts: 237 },
	{ month: "T4", numberPosts: 73 },
	{ month: "T5", numberPosts: 209 },
	{ month: "T6", numberPosts: 214 },
	{ month: "T7", numberPosts: 280 },
	{ month: "T8", numberPosts: 350 },
	{ month: "T9", numberPosts: 260 },
	{ month: "T10", numberPosts: 190 },
	{ month: "T11", numberPosts: 240 },
	{ month: "T12", numberPosts: 300 },
];

const fakeChartDataNumberCreatedAccounts = [
	{ month: "T1", numberCreatedAccounts: 80 },
	{ month: "T2", numberCreatedAccounts: 95 },
	{ month: "T3", numberCreatedAccounts: 120 }, // Tăng lên đỉnh
	{ month: "T4", numberCreatedAccounts: 130 }, // Đỉnh nhẹ
	{ month: "T5", numberCreatedAccounts: 115 }, // Giảm sau đỉnh
	{ month: "T6", numberCreatedAccounts: 90 },
	{ month: "T7", numberCreatedAccounts: 105 },
	{ month: "T8", numberCreatedAccounts: 85 },
	{ month: "T9", numberCreatedAccounts: 100 },
	{ month: "T10", numberCreatedAccounts: 75 }, // Đáy thấp
	{ month: "T11", numberCreatedAccounts: 95 },
	{ month: "T12", numberCreatedAccounts: 110 },
];

const fakeChartDataNumberComplaints = [
	{ month: "T1", numberComplaints: 50 },
	{ month: "T2", numberComplaints: 70 },
	{ month: "T3", numberComplaints: 90 },
	{ month: "T4", numberComplaints: 60 },
	{ month: "T5", numberComplaints: 85 },
	{ month: "T6", numberComplaints: 100 },
	{ month: "T7", numberComplaints: 95 },
	{ month: "T8", numberComplaints: 120 },
	{ month: "T9", numberComplaints: 80 },
	{ month: "T10", numberComplaints: 65 },
	{ month: "T11", numberComplaints: 75 },
	{ month: "T12", numberComplaints: 90 },
];

const fakeChartDataGender = [
	{ gender: "male", amount: 275, fill: "var(--orange-chart-clr)" },
	{ gender: "female", amount: 200, fill: "var(--blue-chart-clr)" },
	{ gender: "others", amount: 287, fill: "var(--green-chart-clr)" },
];

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

const RenderLineChart = (props) => {
	const { icon, label, total, keyName, colorClassName, data, config, amountHorizoneLine, legend } = props;

	return (
		<>
			<div className="flex items-center gap-3">
				<span className="border shadow rounded-full size-8 grid place-content-center fill-gray">{icon}</span>
				<span className="flex-grow fs-xs text-gray">{label}</span>
				<div className="w-fit text-end">
					<span className="fs-xs text-gray">Tổng</span>
					<h5 className={colorClassName}>{total}</h5>
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
					<CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-1 stroke-gray-2light" />

					<XAxis
						dataKey="month"
						tickLine={false}
						axisLine={false}
						tickMargin={8}
						tickFormatter={(value) => value.slice(0, 3)}
					/>
					<YAxis tickLine={false} axisLine={false} tickMargin={8} tickCount={amountHorizoneLine} />
					<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
					<defs>
						<linearGradient id={`fill-${keyName}`} x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor={`var(--color-${keyName})`} stopOpacity={0.8} />
							<stop offset="95%" stopColor={`var(--color-${keyName})`} stopOpacity={0.1} />
						</linearGradient>
					</defs>

					<Area
						dataKey={keyName}
						type="natural"
						fill={`url(#fill-${keyName})`}
						fillOpacity={0.4}
						stroke={`var(--color-${keyName})`}
						stackId="a"
					/>
					{legend && <ChartLegend content={<ChartLegendContent />} />}
				</AreaChart>
			</ChartContainer>
		</>
	);
};

const chartConfigPosts = {
	numberPosts: {
		label: "Số lượng bài đăng mới",
		color: "var(--orange-chart-clr)",
	},
};

const chartConfigNumberCreatedAccounts = {
	numberCreatedAccounts: {
		label: "Số lượng tài khoản mới",
		color: "var(--blue-chart-clr)",
	},
};

const chartConfigNumberComplaints = {
	numberComplaints: {
		label: "Số lượng khiếu nại",
		color: "var(--green-chart-clr)",
	},
};

export default function AdminReports() {
	const [chartDataPosts, setChartDataPosts] = useState([]);
	const [chartDataNumberCreatedAccounts, setChartDataNumberCreatedAccounts] = useState([]);
	const [chartDataNumberComplaints, setChartDataNumberComplaints] = useState([]);
	// tính total
	const totalPosts = chartDataPosts.reduce((sum, item) => item.numberPosts + sum, 0);
	const totalCreatedAccount = chartDataNumberCreatedAccounts.reduce((sum, item) => item.numberCreatedAccounts + sum, 0);
	const totalComplaint = chartDataNumberComplaints.reduce((sum, item) => item.numberComplaints + sum, 0);
	const totalVisitors = fakeChartDataGender.reduce((acc, curr) => acc + curr.amount, 0);

	useEffect(() => {
		// get data
		setChartDataPosts(fakeChartDataPosts);
		setChartDataNumberCreatedAccounts(fakeChartDataNumberCreatedAccounts);
		setChartDataNumberComplaints(fakeChartDataNumberComplaints);
	}, []);

	return (
		<div className="flex-grow grid grid-cols-12 gap-4 grid-rows-2">
			<div className="col-span-8 p-3 bg-background rounded-lg border shadow flex flex-col">
				<RenderLineChart
					icon={<PostProfileTabIcon className="size-3.5" />}
					label="Số lượng bài đăng"
					total={totalPosts}
					keyName="numberPosts"
					colorClassName="text-chart-orange"
					data={chartDataPosts}
					config={chartConfigPosts}
					amountHorizoneLine={5}
					legend={true}
				/>
			</div>
			{/* lịch */}
			<div className="col-span-4 bg-background rounded-lg border shadow">2</div>
			{/* chart đôi */}
			<div className="col-span-6 bg-background p-3 rounded-lg border shadow grid grid-rows-2 gap-2">
				<div className="flex flex-col">
					<RenderLineChart
						icon={<NewCreatedAccountIcon />}
						label="Lượt tạo tài khoản mới"
						total={totalCreatedAccount}
						keyName="numberCreatedAccounts"
						colorClassName="text-chart-blue"
						data={chartDataNumberCreatedAccounts}
						config={chartConfigNumberCreatedAccounts}
						amountHorizoneLine={2}
						legend={false}
					/>
				</div>
				<div className="flex flex-col">
					<RenderLineChart
						icon={<ComplaintIcon className="size-3.5" />}
						label="Lượt khiếu nại"
						total={totalComplaint}
						keyName="numberComplaints"
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
						<Pie data={fakeChartDataGender} dataKey="amount" nameKey="gender" innerRadius={55} strokeWidth={5}>
							<Label
								content={({ viewBox }) => {
									if (viewBox && "cx" in viewBox && "cy" in viewBox) {
										return (
											<text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
												<tspan x={viewBox.cx} y={viewBox.cy} className="fill-primary-text text-3xl font-bold">
													{totalVisitors.toLocaleString()}
												</tspan>
												<tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-gray">
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
			<div className="col-span-3 bg-background rounded-lg border shadow">5</div>
		</div>
	);
}
