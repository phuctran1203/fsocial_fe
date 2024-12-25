import React from "react";
import { Link } from "react-router-dom";
export default function Home() {
	return (
		<div>
			This is a home page
			<Link to="/login">switch to login</Link>
		</div>
	);
}
