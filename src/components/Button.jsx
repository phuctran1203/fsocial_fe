import { Link } from "react-router-dom";

const baseStyle =
	"flex justify-center items-center w-full rounded outline-none hover:transition hover:duration-100 focus-visible:ring-2 focus-visible:ring-offset-2";

const primaryButton =
	"bg-[--primary-clr] text-[--text-white-clr] hover:bg-[--primary-hover-clr] focus-visible:ring-[--primary-clr] active:bg-[--primary-active-clr]";

const secondaryButton =
	"bg-[--secondary-clr] text-[--text-black-clr] hover:bg-[--secondary-hover-clr] focus-visible:ring-[--gray-light-clr] active:bg-[--secondary-active-clr]";

const transparentButton =
	"text-[--text-black-clr] hover:bg-[--secondary-hover-clr] focus-visible:ring-[--secondary-clr] active:bg-[--secondary-active-clr]";

const ghostButton = "bg-[--primary-ghost-clr] text-[--primary-clr]";

const disabledMask =
	"relative overflow-hidden pointer-events-none before:absolute before:inset-0 before:bg-white before:opacity-25";

// Button đảm nhận cả a tag và button tag, chỉ nên truyền vào "to" hoặc "onClick"
//"type" nhận vào các key giống trong "styleMap"
// Sử dụng: <Button key=value>children</Button>

export default function Button({
	disabled = false,
	type = "",
	to,
	onClick = () => {},
	className = "",
	children = "Need content",
	allowTab = true,
}) {
	const styleDefind = () => {
		let styleMap = {
			"": primaryButton,
			primary: primaryButton,
			secondary: secondaryButton,
			transparent: transparentButton,
			ghost: ghostButton,
		};
		return `${baseStyle} ${styleMap[type]} ${className} ${disabled ? disabledMask : ""}`;
	};

	if (to) {
		return (
			<Link to={to} className={`${styleDefind()}`} tabIndex={allowTab ? 0 : -1}>
				{children}
			</Link>
		);
	}

	return (
		<button className={`${styleDefind()}`} tabIndex={allowTab ? 0 : -1} onClick={onClick}>
			{children}
		</button>
	);
}
