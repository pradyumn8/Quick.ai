import { Eraser, Sparkles } from 'lucide-react';
import React, { useState } from 'react';

const RemoveBackground = () => {
  
    const [input, setInput] = useState('');
  
    const onSubmitHandler = (e) => {
      e.preventDefault();
      // Add logic to handle image upload and background removal here
    }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* left col */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white border border-gray-200 rounded-lg'>
      <div className='flex items-center gap-2 mb-4'>
        <Sparkles className='w-6 text-[#F6AB41]'/>
        <h1 className='text-xl font-semibold'>Background Removal</h1>
      </div>
        <p className='mt-6 text-sm font-medium'>Upload image</p>
        <input onChange={(e)=>setInput(e.target.files[0])} type="file" accept='image/*' className='w-full p-1 mt-2 outline-none text-sm rounded-md border-gray-200 border-2' required />

        <p className='text-xs text-gray-500 font-light mt-1 mb-4'>Supports JPG, PNG, and other image formats</p>

        <button className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 rounded-lg curspor-pointer hover:opacity-90 transition-all duration-200'>
          <Eraser className='w-5' />
          Remove Background
        </button>
      </form>
      {/* right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-3'>
        <Eraser className='w-5 h-5 text-[#F6AB41]' />
          <h1 className='text-xl font-semibold'>Remove Background</h1>
        </div>
        <div className='flex-1 flex justify-center items-center'>
        <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
        <Eraser className='w-9 h-9' />
        <p>Upload an image and click "Remove Background" to get started</p>
        </div>
        </div>
      </div>
    </div>
  )
}


export default RemoveBackground