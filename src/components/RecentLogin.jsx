import React, { useEffect, useState } from "react";

export default function RecentLogin() {
  const [listUser, setListUser] = useState([
    {
      avatar:
        "https://res.cloudinary.com/dwf2vqohm/image/upload/v1736494136/c1297e51-9141-4a6f-95df-b2b12122fa4a_FPT_Polytechnic.png",
      name: "Ngô Tấn Cangdsaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
    {
      avatar:
        "https://res.cloudinary.com/dwf2vqohm/image/upload/v1736494136/c1297e51-9141-4a6f-95df-b2b12122fa4a_FPT_Polytechnic.png",
      name: "Ngô Tấn Cang",
    },
    undefined, // Thêm mới tài khoản
  ]);

  useEffect(() => {
    // Giả sử gọi API lấy danh sách người dùng gần đây
    fetch("https://api.example.com/recent-logins")
      .then((res) => res.json())
      .then((data) => {
        // Thêm API vào sau 3 phần mặc định
        setListUser((prevUsers) => [...prevUsers, ...data]);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex flex-shrink-0 h-[220px] overflow-y-hidden flex-nowrap text-center items-center">
      {listUser.map((item, index) => (
        <div
          key={index}
          className="flex flex-col flex-shrink-0 h-[220px] w-[170px] border border-[var(--gray-light-clr)] rounded mr-3 justify-content-center items-center cursor-pointer"
        >
          {item ? (
            <>
              <div className="h-[170px] w-full block whitespace-nowrap overflow-hidden text-ellipsis">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-[70px] flex items-center">
                <div className="block w-32 whitespace-nowrap overflow-hidden text-ellipsis">
                  <span>{item.name}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="h-[170px] w-full flex justify-center items-center">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="48" height="48" rx="24" fill="#E77127" />
                  <path
                    d="M31.7344 22.7969V25.5156H16.1406V22.7969H31.7344ZM25.3906 16.1562V32.7188H22.5V16.1562H25.3906Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div className="h-[70px] flex items-center">
                <span className="text-[var(--primary-clr)] w-32 block whitespace-nowrap overflow-hidden text-ellipsis">
                  Thêm mới tài khoản
                </span>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
