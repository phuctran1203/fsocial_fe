import React, { useState, useEffect } from 'react';
import { TrashCanIcon } from '../components/Icon';
import Button from "../components/Button";


export default function AdminPolicySettings() {

    const [policies, setPolicies] = useState([]);
    const [newPolicy, setNewPolicy] = useState("");

    const policiesJson = [
        {
            id: 1,
            reason: "Có dấu hiệu lừa đảo",
        },
        {
            id: 2,
            reason: "Chứa nội dung/video/hình ảnh nhạy cảm",
        },
        {
            id: 3,
            reason: "Hành vi công kích, ngôn từ mất kiểm soát",
        },
    ];

    const handleAddPolicy = () => {
        if (newPolicy.trim() !== "") {
            setPolicies([...policies, { id: Date.now(), reason: newPolicy }]);
            setNewPolicy("");
        }
    };

    const handleRemovePolicy = (index) => {
        setPolicies(policies.filter((_, i) => i !== index));
    }

    useEffect(() => {
        setPolicies(policiesJson);
    }, []);

    return (
        <div className='flex h-full w-full bg-background rounded-lg border shadow overflow-hidden'>
            <div className="flex-1 p-8 bg-background flex flex-col w-full">
                
                <div className="flex flex-col h-[77px]">
                    <span className="text-lg font-semibold">Cập nhật chính sách</span>
                    <span className="text-sm text-gray"> Cập nhật các chính sách, loại vi phạm mới cho mạng xã hội</span>
                </div>

                <div className="w-[700px]">
                    {
                        policies.map((policy, index) => (
                            <div
                                className="flex items-center justify-between w-full bg-background p-5 rounded shadow mb-2"
                                key={index}
                            >
                                <span>{policy.reason}</span>
                                <button onClick={() => handleRemovePolicy(index)}>
                                    <TrashCanIcon />
                                </button>
                            </div>
                        ))
                    }
                    <div className="flex items-center mt-4">
                        <input
                            type="text"
                            value={newPolicy}
                            onChange={(e) => setNewPolicy(e.target.value)}
                            className='flex-1 p-2 border rounded'
                            placeholder='Thêm mới'
                        />
                        <Button className='ml-2' onClick={handleAddPolicy}>+</Button>
                    </div>
                    <div className="flex justify-end items-end mt-4 ">
                        <Button className={'w-[200px] bg-orange-500 text-white py-2 rounded'}>
                            Lưu cập nhật
                        </Button>
                    </div>
                </div>
            </div>
            <img
                src="/fsocial_fe/decor/rocket-launching.svg"
                alt="Rocket Illustration"
                className="w-full h-full"
            />
        </div>
    )
}
