import React, { useState } from 'react';
import { TextBox } from "./Field";

export default function EditPostModal({ onClose, onUpdate, post }) {
    const [content, setContent] = useState(post.content);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-background rounded-lg p-4 w-[550px] shadow-lg">
                
                <div className="flex justify-between items-center pb-2">
                    <h2 className="text-lg font-semibold text-center flex-grow">
                        Chỉnh sửa bài viết
                    </h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900">✖</button>
                </div>

                
                <div className="flex items-center gap-2 mt-4">
                    <img src={post.userAvatar} alt="Avatar" className="w-10 h-10 rounded-full" />
                    <div>
                        <h4 className="font-semibold">{post.userName}</h4>
                        <p className="text-gray-500 text-sm">{post.time}</p>
                    </div>
                </div>

                
                <input
                    className="w-full rounded-lg p-2 mt-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

               
                <div className="mt-3">
                    <img src={post.image} alt="Post" className="w-full rounded-lg" />
                </div>

               
                <button
                    onClick={() => onUpdate(content)}
                    className="bg-orange-500 text-white w-full py-2 rounded-lg mt-4 hover:bg-orange-600"
                >
                    Cập nhật
                </button>
            </div>
        </div>
    )
}
