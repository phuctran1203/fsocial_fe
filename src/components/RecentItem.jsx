// import React from 'react'

// export default function RecentItem({ item, onclick }) {

//     return (
//         <>

//             {item ? (
//                 <div className='flex flex-col flex-shrink-0 h-[220px] w-[170px] border border-[var(--gray-light-clr)]
//                                 rounded mr-3 justify-content-center items-center cursor-pointer' onClick={onclick}>
//                     <div className='h-[170px] w-full block whitespace-nowrap overflow-hidden text-ellipsis '><img src={item.avatar} alt={item.name} className='w-full h-full object-cover' /></div>
//                     <div className=' h-[70px] flex items-center  '><div className='block w-32 whitespace-nowrap overflow-hidden text-ellipsis' ><span>{item.name}</span></div></div>
//                 </div>
//             ) : (
//                 <div className='flex flex-col flex-shrink-0 h-[220px] w-[170px] border border-[var(--gray-light-clr)]
//                                 rounded mr-3 justify-content-center items-center cursor-pointer' onClick={onclick}>
//                     <div className='h-[170px] w-full flex justify-center items-center'><svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
//                         <rect width="48" height="48" rx="24" fill="#E77127" />
//                         <path d="M31.7344 22.7969V25.5156H16.1406V22.7969H31.7344ZM25.3906 16.1562V32.7188H22.5V16.1562H25.3906Z" fill="white" />
//                     </svg>
//                     </div>
//                     <div className='h-[70px] flex items-center'> <span className='text-[var(--primary-clr)] w-32 block whitespace-nowrap overflow-hidden text-ellipsis'>Thêm mới tài khoản</span></div>
//                 </div>
//             )}
//         </>
//     )
// }
