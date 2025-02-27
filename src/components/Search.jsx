import React from 'react'
import { SearchIconAdmin } from './Icon'

export default function Search({value, onChange, placeholder}) {
    return (
        <div className="relative w-full max-w-sm">
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-700 placeholder-gray-400"
            />
            <SearchIconAdmin />
        </div>
    )
}
