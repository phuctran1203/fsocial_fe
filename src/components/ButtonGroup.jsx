import React, { useState } from 'react';
import Button from './Button';

export default function ButtonGroup({ items, onClick }) {
    const [activeIndex, setActiveIndex] = useState(0)

    const handleClick = (index) => {
        setActiveIndex(index)
        if (onClick) {
            onClick(index)
        }
    }

    return (
        <div className="inline-flex rounded-lg shadow overflow-hidden border border-gray-300">
            {items.map((item, index) => (
                <Button
                    key={index}
                    onClick={() => handleClick(index)}
                    className={`
                        px-4 py-2 
                        text-sm 
                        font-medium 
                        text-gray-700 
                        bg-white 
                        hover:bg-gray-100 
                        focus:outline-none
                        border-l 
                        border-gray-300
                        transition-colors
                        ${activeIndex === index ? 'bg-gray-100' : ''}
                        ${index === 0 ? 'border-l-0' : ''}
                    `}
                >
                    {item}
                </Button>
            ))}
        </div>
    );
}