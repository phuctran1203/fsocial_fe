import React from 'react'

export default function Post({ post, openModal }) {
    return (

        <div className="bg-white p-5 rounded shadow-md mb-4">

            <div className="flex items-start space-x-3">
                <img src={post.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                <div>
                    <h3 className="font-semibold">{post.user}</h3>
                    <div className="text-gray-500 text-sm">{post.time}</div>
                </div>
            </div>
            <p>{post.content}</p>
            {post.image && (
                <img
                    src={post.image}
                    alt="Bài đăng"
                    className="w-full h-auto mt-3 rounded"
                />
            )}
            <div className="flex justify-between mt-3 text-gray-600">
                <div className='flex cursor-pointer'>
                    <img src="/fsocial_fe/icon/like.svg" alt="Logo" /><span className='ms-3'>{post.likes}</span>
                </div>
                <div className='flex cursor-pointer' onClick={() => openModal(post)}>
                    <img src="/fsocial_fe/icon/comment.svg" alt="Logo" />
                    <button className='ms-3'>{post.comments.length}</button>
                </div>
                <div className='flex cursor-pointer'>
                    <img src="/fsocial_fe/icon/re_post.svg" alt="Logo" />
                    <span className='ms-3'>Đăng lại</span>
                </div>
                <div className='flex cursor-pointer'>
                    <img src="/fsocial_fe/icon/share.svg" alt="Logo" />
                    <span className='ms-3'>Chia sẻ</span>
                </div>
            </div>
        </div>
    )
}
