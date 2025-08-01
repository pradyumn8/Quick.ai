import React, { useEffect, useState } from 'react'
import { dummyCreationData } from '../assets/assets'
import { Gem, Sparkle } from 'lucide-react'
import { Protect, useAuth } from '@clerk/clerk-react'
import CreationItem from '../components/CreationItem'
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {

  const [creations, setCreations] = useState([])
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth()

  const getDashboardData = async () => {
    // setCreations(dummyCreationData)
    try {
      const { data } = await axios.get('/api/user/get-suer-creations', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setCreations(data.creations)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    getDashboardData()
  }, [])

  return (
    <div className='h-full overflow-y-scroll p-6'>
      <div className='flex justify-start gap-4 flex-wrap'>
        {/* total creations card */}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
          <div className='text-slate-600'>
            <p className='text-sm'>Total Creations</p>
            <h2 className='text-xl font-semibold'>{creations.length}</h2>
          </div>
          <div className='w-10 h-10 bg-gradient-to-r from-[#3588f2] to-[#0BB0D7] text-white rounded-xl flex items-center justify-center'>
            <Sparkle className='w-5 text-white' />
          </div>
        </div>

        {/* Active plan card */}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
          <div className='text-slate-600'>
            <p className='text-sm'>Active Plan</p>
            <h2 className='text-xl font-semibold'>
              <Protect plan='premium' fallback="Free">
                Premium
              </Protect>
            </h2>
          </div>
          <div className='w-10 h-10 bg-gradient-to-r from-[#FF61C5] to-[#9E53EE] text-white rounded-xl flex items-center justify-center'>
            <Gem className='w-5 text-white' />
          </div>
        </div>

      </div>
      {
        // loading animation for whole content
        loading ? (
          <div className='flex justify-center items-center h-3/4'>
            <div className='animate-spin rounded-full h-11 w-11 border-3 border-purple-500 border-t-transparent'>
            </div>
          </div>
        )
          :
          (
            <div className='space-y-3'>
              <p className='mt-6 mb-4'>Recent Creation</p>
              {creations.map((item) => <CreationItem key={item.id} item={item} />)}
            </div>
          )
      }

    </div>
  )
}

export default Dashboard