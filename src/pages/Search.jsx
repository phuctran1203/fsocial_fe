import React, { useState, useEffect } from 'react';
import Post from '../components/Post';

export default function Search() {

  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const filteredUsers = users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()));
  const filteredPosts = posts.filter(post => post.content.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    setUsers([
      { id: 1, name: "Phương Nam", followers: 120, avatar: "user_1.png" },
      { id: 2, name: "Phúc Trần", followers: 120, avatar: "user_1.png" },
      { id: 3, name: "Cang Ngô", followers: 120, avatar: "user_2.png" },
      { id: 4, name: "Đức khải", followers: 120, avatar: "user_2.png" },
    ]);
    setPosts([
      {
        id: 1,
        userID: "1",
        user: "Phúc Trần",
        avatar: "user_1.png",
        content: "Tôi dẫn vợ tôi đi chơi. Hihi",
        image: "post_image_1.png",
        time: "1 giờ trước",
        likes: 123,
        comments: [
          {
            id: 1,
            userID: "3",
            user: "Tấn Cang",
            avatar: "/fsocial_fe/icon/user.svg",
            content: "Bữa tôi cũng đến đây mà không gặp fen nhỉ?",
            likes: 3,
            time: "1 giờ trước",
            replies: [
              {
                id: 1,
                userID: "1",
                user: "Phúc Trần",
                avatar: "/fsocial_fe/icon/user.svg",
                content: "Chắc là duyên chưa tới rồi. Haha!",
                likes: 1,
                time: "30 phút trước",
              },
            ],
          },
          {
            id: 2,
            userID: "3",
            user: "Phúc Thịnh",
            avatar: "/fsocial_fe/icon/user.svg",
            content: "Đỉnh quá, chụp chỗ nào đấy!!!! 🤩",
            likes: 5,
            time: "2 giờ trước",
            replies: [],
          },
        ],
      },
      {
        id: 2,
        userID: "1",
        user: "Phúc Trần",
        avatar: "user_1.png",
        content: "Hihi",
        image: "post_image_2.png",
        time: "1 giờ trước",
        likes: 9999,
        comments: [
          {
            id: 1,
            userID: "3",
            user: "Tấn Cang",
            avatar: "/fsocial_fe/icon/user.svg",
            content: "quá dễ thương",
            likes: 3,
            time: "1 giờ trước",
            replies: [],
          },
          {
            id: 2,
            userID: "3",
            user: "Phúc Thịnh",
            avatar: "/fsocial_fe/icon/user.svg",
            content: "chụp chỗ nào đấy 🤩",
            likes: 5,
            time: "2 giờ trước",
            replies: [],
          },
        ],
      },
    ]);
  }, []);

  return (
    <div className="p-5 flex flex-grow">
      <div className="p-5 flex-col w-full">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full p-2 border rounded mb-4"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex space-x-4 mb-4 justify-center">
          <button className={`px-40 py-2 rounded ${tab === "all" ? "bg-gray-300" : "bg-gray-100"}`} onClick={() => setTab("all")}>Tất cả</button>
          <button className={`px-40 py-2 rounded ${tab === "users" ? "bg-gray-300" : "bg-gray-100"}`} onClick={() => setTab("users")}>Mọi người</button>
          <button className={`px-40 py-2 rounded ${tab === "posts" ? "bg-gray-300" : "bg-gray-100"}`} onClick={() => setTab("posts")}>Bài viết</button>
        </div>
        {tab === "all" || tab === "users" ? (
          <div>
            <h2 className="font-semibold text-lg">Người dùng</h2>
            {filteredUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between p-2 border-b">
                <div className="flex items-center space-x-3">
                  <img src={`./temp/${user.avatar}`} alt="avatar" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.followers} Người theo dõi</p>
                  </div>
                </div>
                <button className="bg-orange-500 text-white px-3 py-1 rounded">Thêm bạn bè</button>
              </div>
            ))}
          </div>
        ) : null}
        {tab === "all" || tab === "posts" ? (
          <div>
            <h2 className="font-semibold text-lg mt-4">Bài viết</h2>
            {filteredPosts.map(post => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
