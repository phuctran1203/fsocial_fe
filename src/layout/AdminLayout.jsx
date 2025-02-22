import AdminNav from '@/components/AdminNav'
import React from 'react'
import { Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <div className='flex m-3'>
      <div className='p-5 mr-5'>
        <AdminNav />
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  )
}
