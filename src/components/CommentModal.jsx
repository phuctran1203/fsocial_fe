import React, { useState } from 'react'

export default function CommentModal({ post, setIsModalOpen }) {

    const [comments, setComments] = useState(post.comments || []);
    const [newComment, setNewComment] = useState("");
    const [replyingTo, setReplyingTo] = useState(null); // chứa ID của comment đang được phản hồi
    const [replyContent, setReplyContent] = useState("");

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        const newCommentObj = {
            id: Date.now(),
            userID: "0",
            user: "ADMIN",
            avatar: "/fsocial_fe/icon/user.svg",
            content: newComment,
            likes: 0,
            time: "Vừa xong",
            replies: [],
        };
        setComments([...comments, newCommentObj]);
        setNewComment("");
    };

    const handleReplyComment = (commentId) => {
        if (!replyContent.trim()) return;
        setComments(
            comments.map((comment) =>
                comment.id === commentId
                    ? {
                        ...comment,
                        replies: [
                            ...comment.replies,
                            {
                                id: Date.now(),
                                userID: "0",
                                user: "ADMIN",
                                avatar: "/fsocial_fe/icon/user.svg",
                                content: replyContent,
                                likes: 0,
                                time: "Vừa xong",
                            },
                        ],
                    }
                    : comment
            )
        );
        setReplyingTo(null);
        setReplyContent("");
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded shadow-md w-1/3 overflow-y-auto h-full scrollable-div">
                <button className="float-right text-lg" onClick={() => setIsModalOpen(false)}>✖</button>

                <div className="border-b pb-3 mb-3">
                    <div className="flex items-start space-x-3">
                        <img src={post.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                        <div>
                            <h3 className="font-semibold">{post.user}</h3>
                            <div className="text-gray-500 text-sm">{post.time}</div>
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm">{post.content}</p>
                    {post.image && (
                        <img
                            src={post.image}
                            alt="Bài đăng"
                            className="w-full h-auto mt-3 rounded"
                        />
                    )}
                </div>

                <h3 className="font-semibold">Bình luận</h3>
                <div className="mt-3 space-y-3">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex flex-col space-y-2">
                            <div className="flex items-start space-x-3">
                                <img src={comment.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                                <div>
                                    <p className="font-semibold">{comment.user} <span className="text-gray-500 text-sm">{comment.time}</span></p>
                                    <p>{comment.content}</p>
                                    <div className="text-gray-500 text-sm flex space-x-3">
                                        <img src="/fsocial_fe/icon/like.svg" alt="Logo" />
                                        <span>{comment.likes}</span>
                                        <button onClick={() => setReplyingTo(comment.id)}>Phản hồi</button>
                                    </div>
                                </div>
                            </div>

                            {replyingTo === comment.id && (
                                <div className="ml-12 flex items-center mt-2">
                                    <input
                                        type="text"
                                        placeholder="Nhập phản hồi..."
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                    <button className="ml-2 px-3 py-1 rounded" onClick={() => handleReplyComment(comment.id)}>
                                        <img src="/fsocial_fe/icon/send.svg" alt="Logo" />

                                    </button>
                                </div>
                            )}

                            {comment.replies.length > 0 && (
                                <div className="ml-12 space-y-2">
                                    {comment.replies.map((reply) => (
                                        <div key={reply.id} className="flex items-start space-x-3">
                                            <img src={reply.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                                            <div>
                                                <p className="font-semibold">{reply.user} <span className="text-gray-500 text-sm">{reply.time}</span></p>
                                                <p>{reply.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>


                {/* Ô nhập bình luận */}
                <div className="flex items-center mt-3 rounded p-2 border-t">
                    <img src={post.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                    <input type="text"
                        placeholder="Điền bình luận"
                        className="w-full p-2 border-0 focus:outline-none"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button className="ml-2 px-3 py-1 rounded" onClick={handleAddComment}>
                        <img src="/fsocial_fe/icon/send.svg" alt="Logo" />
                    </button>
                </div>
            </div>
        </div>
    )
}
