import { Link } from "react-router-dom";
import "./Button.scss";

export default function Button({ to, onClick = () => {}, className, children = "Need content", allowTab = true }) {
	if (to) {
		return (
			<Link to={to} className={className} onClick={onClick} tabIndex={allowTab ? 0 : -1}>
				{children}
			</Link>
		);
	}

	return (
		<button className={className} tabIndex={allowTab ? 0 : -1} onClick={onClick}>
			{children}
		</button>
	);
}
