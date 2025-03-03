import React from 'react'
import { LoadingIcon } from './Icon'

export default function Table({ renderRow, data, headers, loading, bgHover }) {

    return (
        <div className='relative overflow-x-auto sm:rounded-lg bg-white dark:bg-darkSecondary'>
            {loading ? (
                <div className='flex justify-center items-center h-64'><LoadingIcon /></div>
            )
                : (
                    <div className='overflow-x-auto'>
                        <div className='max-h-[680px] overflow-y-auto'>
                            <table className="min-w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-300 hidden md:table">
                                <thead className="text-xs  text-[#808EA1] dark:text-[#A0A0B1] bg-[#F8F8F8] dark:bg-darkSecondary sticky top-0 z-10">
                                    <tr className=''>
                                        <th scope="col" className="px-6 py-4">STT</th>
                                        {headers.map((header, index) => (
                                            <th key={index} scope="col" className="py-4">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className='h-9 cursor-pointer'>
                                    {data.map((item, index) => ( 
                                        <tr key={index} className={`${item.status?"bg-secondary hover:bg-secondary":""} dark:bg-darkSecondary border-t hover:text-black hover:bg-secondary 
                                        dark:hover:bg-[#3C3C4F] text-[#808EA1] dark:text-[#A0A0B1] text-xs `}>
                                            <td className="px-6 py-4">{index + 1}</td>
                                            {renderRow(item)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
        </div>

    )
}
