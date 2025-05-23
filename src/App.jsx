import {
	BrowserRouter,
	Routes,
	Route,
	Navigate,
	useLocation,
} from "react-router-dom";

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
import Profile from "./pages/Profile";
import { themeStore } from "./store/themeStore";
import AdminLayout from "./layout/AdminLayout";
import AdminManagerUser from "./pages/AdminManageUser";
import AdminComplaint from "./pages/AdminComplaint";
import AdminPolicySettings from "./pages/AdminPolicySettings";
import AdminReports from "./pages/AdminReports";
import AdminProfile from "./pages/AdminProfile";
import UserForgotPassword from "./pages/UserForgotPassword";
import SinglePost from "./pages/SinglePost";
import SettingLayout from "./layout/SettingLayout";
import UserAccountPrivacy from "./pages/UserAccountPrivacy";
import UserAccountBasic from "./pages/UserAccountBasic";
import UserAccountLogin from "./pages/UserAccountLogin";
import GuestRoute from "./routes/GuestRoute";
import UserRoute from "./routes/UserRoute";
import AdminRoute from "./routes/AdminRoute";

function App() {
	const theme = themeStore((state) => state.theme);
	useEffect(() => {
		if (theme === "light") {
			document.body.classList.remove("dark");
		} else if (theme === "dark") {
			document.body.classList.add("dark");
		}
	}, [theme]);

	return (
		<BrowserRouter basename="/">
			<Routes>
				<Route element={<GuestRoute />}>
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/forgot-password" element={<ForgotPassword />} />
				</Route>

				<Route element={<UserRoute />}>
					<Route path="/" element={<UserLayout />}>
						<Route index element={<Home />} />
						<Route path="home" element={<Home />} />
						<Route path="follow" element={<Follow />} />
						<Route path="search" element={<Search />} />
						<Route path="message" element={<Message />} />
						<Route path="profile" element={<Profile />} />
						<Route
							path="user-forgot-password"
							element={<UserForgotPassword />}
						/>
						<Route path="post" element={<SinglePost />} />
						<Route path="setting" element={<SettingLayout />}>
							{/* replace props: trình duyệt sẽ không lưu lịch sử route  */}
							<Route index element={<Navigate to="account-basic" replace />} />
							<Route path="account-basic" element={<UserAccountBasic />} />
							<Route path="account-login" element={<UserAccountLogin />} />
							<Route path="account-privacy" element={<UserAccountPrivacy />} />
						</Route>
					</Route>
				</Route>

				<Route element={<AdminRoute />}>
					<Route path="/admin" element={<AdminLayout />}>
						<Route index element={<Navigate to="reports" replace />} />
						<Route path="complaint" element={<AdminComplaint />} />
						<Route path="user-management" element={<AdminManagerUser />} />
						<Route path="reports" element={<AdminReports />} />
						<Route path="policy-setting" element={<AdminPolicySettings />} />
						<Route path="profile" element={<AdminProfile />} />
					</Route>
				</Route>

				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
