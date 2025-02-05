import React from 'react';
import { NavLink } from "react-router-dom";


export default function Nav() {
    return (
        <div className="w-1/5 bg-white p-5 shadow-md h-full flex flex-col justify-between">
            <div>
                <h1 className="text-orange-500 font-bold text-2xl">
                    <img src="/fsocial_fe//FSocial_logo.svg" alt="Logo" className="w-10 h-10" />
                </h1>
                <ul className="mt-5 space-y-4 text-gray-700">
                    <li>
                        <NavLink to="/" className={({ isActive }) => isActive ? "font-semibold flex" : "flex"}>

                            <span className='pe-4'>
                                <img src="/fsocial_fe/icon/home.svg" alt="Logo" />
                            </span>
                            Trang chủ
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/friends" className={({ isActive }) => isActive ? "font-semibold flex" : "flex"}>
                            <span className='pe-4'>
                                <img src="/fsocial_fe/icon/friend.svg" alt="Logo" />
                            </span>
                            Vòng bạn bè
                        </NavLink>
                    </li>

                    <li className="flex">
                        <span className='pe-4'>
                            <img src="/fsocial_fe/icon/search.svg" alt="Logo" />
                        </span>
                        Tìm kiếm</li>
                    <li className="flex">
                        <span className='pe-4'>
                            <img src="/fsocial_fe/icon/message.svg" alt="Logo" />
                        </span>
                        Tin nhắn</li>
                    <li className="flex">
                        <span className='pe-4'>
                            <img src="/fsocial_fe/icon/notification.svg" alt="Logo" />
                        </span>
                        Thông báo</li>
                    <li className="flex">
                        <span className='pe-4'>
                            <img src="/fsocial_fe/icon/post.svg" alt="Logo" />
                        </span>
                        Tạo bài viết</li>
                    <li className="flex">
                        <span className='pe-4'>
                            <img src="/fsocial_fe/icon/user.svg" alt="Logo" />
                        </span>
                        Hồ sơ</li>
                </ul>
            </div>
            <ul className="space-y-4 text-gray-700">
                <li className="flex">
                    <span className='pe-4'>
                        <img src="/fsocial_fe/icon/setting.svg" alt="Logo" />
                    </span>
                    Cài đặt</li>
                <li className="flex">
                    <span className='pe-4'>
                        <img src="/fsocial_fe/icon/logout.svg" alt="Logo" />
                    </span>
                    Đăng xuất</li>
            </ul>
        </div >
    )
}
