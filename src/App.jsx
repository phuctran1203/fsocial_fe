import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.scss";

import Home from "./pages/Home";
import UserLayout from "./layout/UserLayout";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Search from "./pages/Search";
import Follow from "./pages/Follow";
import Message from "./pages/Message";
import { useEffect } from "react";

function App() {
	useEffect(() => {
		const theme = localStorage.getItem("theme") || "light";
		if (theme === "light") {
			document.body.classList.remove("light");
		} else if (theme === "dark") {
			document.body.classList.add("dark");
		}
	}, []);

	return (
		<BrowserRouter basename={import.meta.env.BASE_URL}>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />

				<Route path="/" element={<UserLayout />}>
					<Route index element={<Home />} />
					<Route path="/home" element={<Home />} />
					<Route path="/follow" element={<Follow />} />
					<Route path="/search" element={<Search />} />
					<Route path="/message" element={<Message />} />
					<Route path="*" element={<NotFound />} />
				</Route>
				<Route pat="/admin"></Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
