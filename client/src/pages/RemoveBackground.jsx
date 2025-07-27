import { Eraser, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()


  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // Add logic to handle image upload and background removal here
 try {
      setLoading(true)
      
      const formData = new FormData()
      formData.append('image', input)

      const { data } = await axios.post('/api/ai/remove-background',  formData , { headers: { Authorization: `Bearer ${await getToken()}` } })

      if (data.success) {
        setContent(data.content)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* left col */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white border border-gray-200 rounded-lg'>
        <div className='flex items-center gap-2 mb-4'>
          <Sparkles className='w-6 text-[#F6AB41]' />
          <h1 className='text-xl font-semibold'>Background Removal</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Upload image</p>
        <input onChange={(e) => setInput(e.target.files[0])} type="file" accept='image/*' className='w-full p-1 mt-2 outline-none text-sm rounded-md border-gray-200 border-2' required />

        <p className='text-xs text-gray-500 font-light mt-1 mb-4'>Supports JPG, PNG, and other image formats</p>

        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 rounded-lg curspor-pointer hover:opacity-90 transition-all duration-200'>
          {
            loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
            : <Eraser className='w-5'/>
          }
          Remove Background
        </button>
      </form>
      {/* right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-3'>
          <Eraser className='w-5 h-5 text-[#F6AB41]' />
          <h1 className='text-xl font-semibold'>Processed Image</h1>
        </div>
        {
          !content ? 
          (
            <div className='flex-1 flex justify-center items-center'>
          <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
            <Eraser className='w-9 h-9' />
            <p>Upload an image and click "Remove Background" to get started</p>
          </div>
        </div>
          ) : (
            <img src={content} alt="image" className='mt-3 w-full h-full' />
          )
        }
        
      </div>
    </div>
  )
}


export default RemoveBackground