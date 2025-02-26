import React, { useState, useEffect, useRef } from "react";
import { ArrowLeftIcon, Glyph, SearchIcon, SendIcon, SmileIcon } from "../components/Icon";
import { dateTimeToNotiTime } from "../utils/convertDateTime";
import { TextBox } from "../components/Field";

const listUsers = [
	{
		userId: "1",
		displayName: "Phúc Thịnh",
		latestMessage: "Chào bạn!",
		avatar: "./temp/user_2.png",
		time: "2025-02-10 10:00:00",
		read: true,
	},
	{
		userId: "2",
		displayName: "Phương Nam",
		latestMessage: "Lấy dùm tui cái laptop nha 🤧",
		avatar: "./temp/user_3.png",
		time: "2025-02-10 10:00:00",
		read: true,
	},
	{
		userId: "3",
		displayName: "Đức Khải",
		latestMessage: "",
		avatar: "./temp/user_4.png",
		time: "",
		read: false,
	},
	{
		userId: "4",
		displayName: "Cang Ngô",
		latestMessage: "",
		avatar: "./temp/user_5.png",
		time: "",
		read: false,
	},
	{
		userId: "5",
		displayName: "Tấn Đạt",
		latestMessage: "Biết ông lích không?",
		avatar: "./temp/user_6.png",
		time: "2025-02-10 10:00:00",
		read: false,
	},
];

const message = [
	{
		idMessage: "4h7ad2",
		data: {
			userId: 1,
			sendToId: 0,
			message: "",
		},
	},
];

export default function Message() {
	const textbox = useRef(null);

	const [selectedUser, setSelectedUser] = useState(null);

	const [messages, setMessages] = useState(null);

	const messagesEndRef = useRef(null);

	const handleUserClick = (userId) => {
		setTimeout(() => {
			textbox.current.focus();
		}, 500);
		setSelectedUser(userId);
		//call API lấy tin nhắn về
	};

	const handleGoBack = () => {
		setRealHeight(window.innerHeight);
		setSelectedUser(null);
	};

	const typingMessageRef = useRef(null);

	const [submitMsgClicked, setSubmitMsgClicked] = useState(false);

	const textBoxOnKeyDown = (e) => {
		if (window.innerWidth <= 640) return;
		if (e.key === "Enter" && !e.shiftKey) {
			sendMessage();
		}
	};

	const sendMessage = () => {
		if (textbox.current.innerText.trim() == "") {
			setTimeout(() => {
				textbox.current.innerHTML = "";
			}, 1);
			return;
		}
		setSubmitMsgClicked(true);

		console.log("message sent");
		setTimeout(() => {
			textbox.current.innerHTML = "";
			textbox.current.focus();
			setSubmitMsgClicked(false);
		}, 1);
	};

	const [realHeight, setRealHeight] = useState(window.visualViewport.height);

	useEffect(() => {
		const handleRezise = () => {
			const height = window.visualViewport.height;

			if (textbox.current) textbox.current.innerText = height;
			setRealHeight(height);
		};
		window.addEventListener("resize", handleRezise);
		return () => window.removeEventListener("resize", handleRezise);
	}, []);

	useEffect(() => {
		let touchStartY = 0; // Lưu vị trí bắt đầu của touch

		const handleTouchStart = (e) => {
			touchStartY = e.touches[0].clientY;
		};

		const preventScroll = (e) => {
			const element = e.target;

			if (element.id === "allow-scroll") {
				const atTop = element.scrollTop === 0;
				const atBottom = Math.abs(element.scrollTop + element.clientHeight - element.scrollHeight) < 50; // Fix điều kiện kịch đáy

				let isScrollingUp = false;
				let isScrollingDown = false;

				// Kiểm tra hướng scroll theo loại sự kiện
				if (e.type === "wheel") {
					isScrollingUp = e.deltaY < 0;
					isScrollingDown = e.deltaY > 0;
				} else if (e.type === "touchmove") {
					const touchEndY = e.touches[0].clientY;
					isScrollingUp = touchEndY > touchStartY; // Vuốt xuống => scroll lên
					isScrollingDown = touchEndY < touchStartY; // Vuốt lên => scroll xuống
				}

				// Log để kiểm tra giá trị
				console.log("scrollTop:", element.scrollTop);
				console.log("clientHeight:", element.clientHeight);
				console.log("scrollHeight:", element.scrollHeight);
				console.log("atBottom:", atBottom);

				// Nếu đang ở đỉnh mà muốn cuộn lên → Chặn
				if (atTop && isScrollingUp) {
					console.log("⚠️ Kịch đỉnh - Chặn scroll lên");
					e.preventDefault();
				}
				// Nếu đang ở đáy mà muốn cuộn xuống → Chặn
				else if (atBottom && isScrollingDown) {
					console.log("⚠️ Kịch đáy - Chặn scroll xuống");
					e.preventDefault();
				}
				// Nếu đang ở giữa thì không chặn
				else {
					return;
				}
			}

			// Chặn scroll mặc định nếu không phải "allow-scroll"
			e.preventDefault();
		};

		if (window.visualViewport.height < window.innerHeight) {
			window.addEventListener("wheel", preventScroll, { passive: false });
			window.addEventListener("touchstart", handleTouchStart, { passive: true });
			window.addEventListener("touchmove", preventScroll, { passive: false });
		} else {
			window.removeEventListener("wheel", preventScroll);
			window.removeEventListener("touchstart", handleTouchStart);
			window.removeEventListener("touchmove", preventScroll);
		}

		return () => {
			window.removeEventListener("wheel", preventScroll);
			window.removeEventListener("touchstart", handleTouchStart);
			window.removeEventListener("touchmove", preventScroll);
		};
	}, []);

	return (
		<div
			style={{ height: realHeight }}
			className={`${selectedUser && "fixed top-0 z-10"} flex-grow sm:flex bg-background overflow-hidden transition`}
		>
			{/* Danh sách hội thoại */}
			<div
				className="
				flex flex-col pt-4 h-full
				sm:w-2/5 sm:min-w-[300px] sm:max-w-[350px] sm:gap-4 sm:border-r
				w-screen gap-2 transition"
			>
				<h2 className="px-4">Tin nhắn</h2>
				{/* search bar */}
				<label
					htmlFor="search-message"
					className="flex gap-2 p-2 mx-4 border rounded-full hover:border-gray-light transition"
				>
					<SearchIcon className="size-5 ms-1" color="stroke-[--gray-clr]" />
					<input
						type="text"
						id="search-message"
						placeholder="Tìm cuộc trò chuyện"
						className="w-full outline-none bg-transparent"
					/>
				</label>
				{/* list user's messages */}
				<div className="h-full px-2 flex-grow overflow-auto">
					{listUsers.map((user) => (
						<div
							key={user.userId}
							className="px-3 py-2.5 rounded-md flex items-center gap-3 hover:bg-gray-3light ct-transition cursor-pointer"
							onClick={() => handleUserClick(user.userId)}
						>
							<div className="max-w-12 aspect-square rounded-full overflow-hidden">
								<img src={user.avatar} className="size-full object-cover" alt="" />
							</div>
							<div>
								<div className="flex items-center gap-3">
									<span className="font-semibold">{user.displayName}</span>
									{user.latestMessage !== "" && !user.read && <span className="size-2 bg-primary rounded-full" />}
								</div>
								{user.latestMessage !== "" && (
									<div className="flex gap-1">
										<p className={`line-clamp-1 ${!user.read && "font-semibold"}`}>{user.latestMessage}</p>
										<span className="text-[--gray-clr] text-nowrap">{dateTimeToNotiTime(user.time).textTime}</span>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Cửa sổ tin nhắn */}
			<div
				ref={typingMessageRef}
				style={{ height: realHeight }}
				className={`w-screen flex flex-col bg-background ${
					selectedUser && "sm:translate-y-0 -translate-y-full"
				} transition`}
			>
				{/* header info */}
				<div className={`py-3 px-4 border-b flex items-center justify-between ${!selectedUser && "hidden"} `}>
					<div className="flex items-center">
						<button onClick={handleGoBack}>
							<ArrowLeftIcon className={"sm:hidden me-3"} />
						</button>
						<img src="./temp/default_avatar.svg" className="size-9 me-2" alt="" />
						<p className="font-semibold">Phúc Trần</p>
					</div>
					<Glyph />
				</div>

				{!selectedUser ? (
					<div className="size-full grid place-content-center">Cùng bắt đầu trò chuyện với người theo dõi của bạn</div>
				) : (
					<div className="flex-grow overflow-auto" id="allow-scroll">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Error quibusdam alias voluptatibus quisquam
						sapiente accusamus similique culpa beatae amet recusandae ab nobis obcaecati repudiandae possimus vero,
						exercitationem quo repellat rerum! Suscipit ut eligendi exercitationem vitae beatae? Rem ratione maxime
						similique blanditiis, expedita fuga qui enim autem doloremque ab dicta deserunt id quasi maiores illum,
						nulla nemo quae debitis? Ex, alias! Dolores assumenda labore consequatur natus animi possimus in deserunt
						optio sunt, odio repellat a nesciunt voluptatum cumque, blanditiis fugit nemo tempore alias autem.
						Laboriosam provident modi ipsum doloribus facere voluptatum. Est ab, quasi et porro voluptatem, omnis at
						libero dolore maiores laborum, provident exercitationem reprehenderit? Eligendi voluptatem, atque tempora,
						quisquam corrupti voluptate quos quia dolorum ea, porro perspiciatis ut aspernatur? Ullam aut, repudiandae,
						impedit delectus cumque error ducimus illum eum deserunt obcaecati officia. Veritatis laboriosam inventore
						et veniam laudantium? Vitae vel reprehenderit placeat aliquam esse vero dolor reiciendis tenetur et. Nostrum
						aut magni officiis illum recusandae quod deserunt, laborum sint quisquam doloremque, tempora odio modi
						provident repellat adipisci inventore explicabo aspernatur natus! Voluptatibus numquam error quibusdam
						aspernatur reiciendis esse aperiam. Maiores amet harum ab itaque alias mollitia at sapiente dolorem
						molestias, placeat asperiores similique dolorum! Id sed quaerat repudiandae vel facilis temporibus ullam
						tempore enim commodi error velit, laboriosam debitis? Rerum eos porro autem laudantium est inventore
						officiis illum nihil vel dolorum? Non, repellendus maxime ullam accusantium corporis hic quam voluptatum cum
						fuga illum eos dolore quos repellat at? Iste? Corporis, asperiores molestiae nam aperiam sequi obcaecati
						neque cum sint magni similique dolorem repudiandae perferendis commodi dolorum praesentium labore impedit!
						Aut, ut? Amet quo labore alias optio ipsum cumque accusantium. Porro expedita quos maiores ipsam commodi,
						unde ullam natus! Aperiam non nihil suscipit incidunt iusto sit quod consequuntur reiciendis explicabo ea
						nesciunt, dicta laborum vel eligendi tempora veritatis officia esse! Beatae, quia nisi! Excepturi voluptate
						cupiditate impedit facere deleniti, ad sed atque sunt facilis totam tenetur non eius! Consequuntur ut itaque
						natus adipisci deserunt, quis optio tempora eos at ipsa! Dignissimos eaque natus sunt consequuntur incidunt?
						Placeat illo consequatur id neque quidem facilis saepe earum doloremque repudiandae similique, vero
						reiciendis minus in laborum esse distinctio rem doloribus reprehenderit molestias ex? Ratione illum fugit
						non eos saepe. Incidunt, non quis explicabo sunt exercitationem placeat possimus natus provident fugit.
						Perspiciatis nemo cumque, error eligendi illo ipsa itaque corporis iste, doloribus, fugit impedit. Eum
						fugiat labore ea magnam nihil ex quia dolores neque tempora, dolorem hic eos dolore expedita illo natus cum
						exercitationem, repudiandae deleniti atque laborum, voluptatibus repellat. Facere deleniti repellendus
						totam. Alias, aliquam sint perspiciatis eum dolorem accusamus aperiam dolorum laborum porro vel temporibus,
						neque tenetur totam veritatis. Quaerat nulla, molestias ipsam quia aliquid similique vel asperiores esse aut
						reiciendis voluptates. Expedita reprehenderit tempora aliquid ipsam ea sunt qui dolores alias consectetur
						et? Optio libero necessitatibus voluptate fugiat quaerat natus distinctio est veniam laborum numquam odio,
						voluptatum a. Aut, saepe esse. Tempora hic assumenda expedita, recusandae illo ratione est distinctio odit
						facilis veniam itaque vel dicta commodi, obcaecati beatae, delectus corrupti vero velit sequi. Rerum
						mollitia nulla libero aliquid laudantium nostrum? Debitis officia culpa architecto fugit? Repudiandae
						adipisci illum natus reiciendis quasi suscipit enim itaque neque sint necessitatibus, cum exercitationem?
						Nobis mollitia voluptatem animi dolorum dolor! Suscipit deleniti autem aut facere. Laboriosam pariatur
						quidem repellendus assumenda corrupti commodi laudantium obcaecati cupiditate dolorum dolor consectetur
						atque minima ducimus veritatis incidunt placeat voluptas doloribus, exercitationem molestias. Minus nemo
						ducimus labore natus perferendis provident. Quos provident perferendis, totam ipsum autem tenetur hic natus
						deserunt quo a illum enim assumenda praesentium rem, sapiente sunt illo odit? Unde repellendus eos,
						laudantium alias optio hic facilis molestias?
					</div>
				)}

				{/* Thanh nhập tin nhắn */}
				{selectedUser && (
					<div className="bg-background border-t sm:px-6 px-4 sm:py-4 py-3 flex items-end gap-3">
						<div className="md:py-2 py-1.5">
							<SmileIcon className="size-6" />
						</div>
						<TextBox
							texboxRef={textbox}
							placeholder="Soạn tin nhắn"
							className="sm:py-2 py-1.5 max-h-[120px] bg-gray-3light border rounded-3xl px-5 flex-grow scrollable-div"
							contentEditable={!submitMsgClicked}
							onKeyDown={textBoxOnKeyDown}
						/>
						<button onClick={sendMessage} className="bg-primary sm:py-2 py-1.5 px-5 rounded-full">
							<SendIcon color="stroke-txtWhite" />
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
