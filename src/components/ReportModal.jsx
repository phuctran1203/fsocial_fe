import React, { useState, useEffect } from 'react';

export default function ReportModal({ isOpen, onClose }) {

    const [selectedReason, setSelectedReason] = useState("");
    const [reportOptions, setReportOptions] = useState([]);

    const reportOptionsJson = [
        {
            "id": 1,
            "reason": "Có dấu hiệu lừa đảo"
        },
        {
            "id": 2,
            "reason": "Chứa nội dung/video/hình ảnh nhạy cảm"
        },
        {
            "id": 3,
            "reason": "Hành vi công kích, ngôn từ mất kiểm soát"
        }
    ]

    useEffect(() => {
        setReportOptions(reportOptionsJson)
        
      }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-background rounded-lg shadow-lg p-6 w-[550px]">
                <div className="flex justify-center items-center">
                    <h2 className="text-lg font-semibold flex-grow text-center">Báo cáo vi phạm</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900">✖</button>
                </div>

                <div className="mt-4">
                    {reportOptions.map((option) => (
                        <label key={option.id} className="flex items-center space-x-2 p-3 space-y-1 mb-2 border rounded-lg hover:bg-gray-100 cursor-pointer">
                            <input
                                type="radio"
                                name="reportReason"
                                value={option.reason}
                                checked={selectedReason === option.reason}
                                onChange={() => setSelectedReason(option.reason)}
                            />
                            <span>{option.reason}</span>
                        </label>
                    ))}
                </div>

                <button
                    className="w-full bg-orange-500 text-white py-2 mt-4 rounded-lg hover:bg-orange-600 transition"
                    onClick={() => alert(`Đã báo cáo: ${selectedReason}`)}
                    disabled={!selectedReason}
                >
                    Báo cáo
                </button>
            </div>
        </div>
    )
}
