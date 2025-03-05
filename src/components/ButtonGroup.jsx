import React, { useState } from "react";
import Button from "./Button";

export default function ButtonGroup({ items, onClick }) {
	const [activeIndex, setActiveIndex] = useState(0);

	const handleClick = (index) => {
		setActiveIndex(index);
		if (onClick) {
			onClick(index);
		}
	};

	return (
		<div className="inline-flex rounded-lg shadow-b overflow-hidden border border-gray-2light">
			{items.map((item, index) => (
				<Button
					key={index}
					onClick={() => handleClick(index)}
					className={`
                        btn-transparent !rounded-none px-4 text-nowrap text-sm font-medium border-l border-gray-2light
                        ${activeIndex === index ? "bg-secondary" : "!text-gray"}
                        ${index === 0 ? "border-l-0" : ""}
                    `}
				>
					{item}
				</Button>
			))}
		</div>
	);
}
