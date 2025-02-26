import React from 'react';
import { TrashIcon } from '../components/Icon';

export default function DeletePostModal({ onClose, onConfirm }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-background rounded-lg p-6 w-[550px] shadow-lg">

                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-center flex-grow">Xóa bài viết</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900">✖</button>
                </div>


                <div className="flex justify-center my-4">
                    <img
                        src="/fsocial_fe/temp/delete_post_decor.png"
                        alt="Delete Illustration"
                        className="w-36 h-36"
                    />
                </div>

                <p className="text-gray-600 text-center">
                    Sau khi xóa, bài viết sẽ <span className="text-red-500 font-semibold">không thể</span> khôi phục.
                    <br /> Bạn vẫn xác nhận xóa?
                </p>

                <div className="flex justify-between mt-6">
                    <button
                        onClick={onClose}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg w-1/2 mr-2 hover:bg-orange-600"
                    >
                        Hủy bỏ xóa
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg w-1/2 flex items-center justify-center hover:bg-gray-300"
                    >
                        <TrashIcon />  Xác nhận xóa
                    </button>
                </div>
            </div>
        </div>
    )
}
