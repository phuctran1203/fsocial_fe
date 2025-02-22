import React from 'react'
import { LogoFSAdmin } from './Icon'
import { adminNavRout } from '@/config/adminNavRout'
import Button from './Button'

export default function AdminNav() {

    const navRoute = adminNavRout


    return (
        <div className="w-[260px]">
            <div>
                <LogoFSAdmin />
            </div>
            <div className="flex flex-col mt-8">
                {navRoute.map((route, index) => (
                    <Button
                        key={index}
                        to={route.to}
                        className="w-full h-12 flex items-center hover:bg-[#F5F5F5] hover:text-[#404040] ">
                        <i className="mr-3">{route.icon}</i>
                        {route.name}
                    </Button>
                ))}
            </div>
        </div>

    )
}
