import { Scissors, Sparkles } from 'lucide-react';
import React, { useState } from 'react'

const RemoveObject = () => {
  
    const [input, setInput] = useState('');
    const [object, setObject] = useState('');
  
    const onSubmitHandler = (e) => {
      e.preventDefault();
      // Add logic to handle image upload and Object removal here
    }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* left col */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white border border-gray-200 rounded-lg'>
      <div className='flex items-center gap-2 mb-4'>
        <Sparkles className='w-6 text-[#4A7AFF]'/>
        <h1 className='text-xl font-semibold'>Object Removal</h1>
      </div>
        <p className='mt-6 text-sm font-medium'>Upload image</p>
        <input onChange={(e)=>setInput(e.target.files[0])} type="file" accept='image/*' className='w-full p-1 mt-2 outline-none text-sm rounded-md border-gray-200 border-2' required />

       <p className='mt-6 text-sm font-medium'>Describe Object name to Remove</p>
        
        <textarea onChange={(e)=>setObject(e.target.value)} value={object} rows={4} cols={5} className='w-full h-10 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' placeholder='e.g., watch or spoon, Only single object name' required/>


        <button className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#9234EA] text-white px-4 py-2 rounded-lg curspor-pointer hover:opacity-90 transition-all duration-200'>
          <Scissors className='w-5' />
          Remove Object
        </button>
      </form>
      {/* right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-3'>
        <Scissors className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Remove Object</h1>
        </div>
        <div className='flex-1 flex justify-center items-center'>
        <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
        <Scissors className='w-9 h-9' />
        <p>Upload an image and click "Remove Object" to get started</p>
        </div>
        </div>
      </div>
    </div>
  )
}

export default RemoveObject