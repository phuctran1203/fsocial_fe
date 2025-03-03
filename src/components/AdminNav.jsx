import React, { useEffect, useState } from 'react'
import { LogoFSAdmin } from './Icon'
import { adminNavRout } from '@/config/adminNavRout'
import Button from './Button'
import { ownerAccountStore } from '@/store/ownerAccountStore'

export default function AdminNav() {
    const [active, setActive] = useState(null)
    const navRoute = adminNavRout
    const user = ownerAccountStore(state => state.user)
    const handleActive = (index) => {
        setActive(index)
    }

    return (
        <div className="w-[260px] bg-[#ffff] min-h-[600px]">
            <div>
                <LogoFSAdmin />
            </div>
            <div className="flex flex-col mt-8">
                {navRoute.map((route, index) => (
                    <Button
                        key={index}
                        to={route.to}
                        onClick={() => handleActive(index)}
                        className={`w-full h-12 flex items-center rounded-md
                            ${active === index ? 'bg-[#F5F5F5] font-bold' : ''}
                            hover:bg-[#F5F5F5] hover:font-bold`}    >
                        <i className="mr-3 ">{route.icon}</i>
                        {route.name}
                    </Button>
                ))}
                <Button>
                    <Button
                        to="/admin/profile"
                        className={`w-full h-12 flex items-center  hover:bg-[#F5F5F5] hover:font-bold rounded-md`}    >
                        <div className='mr-3 w-7 h-7'><img className="w-full h-full object-cover rounded-full" src={user.avatar} /></div>
                        {user.displayName}
                    </Button>
                </Button>
            </div>
        </div>

    )
}
