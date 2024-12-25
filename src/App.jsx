import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import UserLayout from "./UserLayout";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

function App() {
	return (
		<BrowserRouter basename={import.meta.env.BASE_URL}>
			<Routes>
				<Route path="/" element={<UserLayout />}>
					<Route index element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
