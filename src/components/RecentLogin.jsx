import React from 'react'
import RecentItem from './RecentItem'

export default function RecentLogin({ listUser }) {

    return (
        <>
            <div className='flex flex-shrink-0 h-[220px] overflow-y-hidden flex-nowrap text-center items-center'>
                {listUser.map((user,index) => {
                    return <RecentItem key={index} item={user} />
                })}
            </div>
        </>
    )
}
