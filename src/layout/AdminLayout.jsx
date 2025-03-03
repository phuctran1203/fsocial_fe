import AdminNav from '@/components/AdminNav'
import React from 'react'
import { Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <div className='flex m-3 h-screen'>
      <div className='p-5 mr-5 bg-[#ffff] rounded-md'>
        <AdminNav />
      </div>
      <div className='bg-[#ffff] rounded-md w-full'>
        <Outlet />
      </div>
    </div>
  )
}
