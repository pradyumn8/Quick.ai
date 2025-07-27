import { useAuth } from '@clerk/clerk-react';
import {  Hash, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import axios from 'axios';


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
const BlogTitles = () => {
  
    const blogCategories = ['Technology', 'Health', 'Lifestyle', 'Travel', 'Food', 'Education'];
  
    const [selectedCategory, setSelectedCategory] = useState(blogCategories[0]);
    const [input, setInput] = useState('')

    const [loading, setLoading] = useState(false)
    const [content, setContent] = useState('')

    const {getToken} = useAuth()
  
    const onSubmitHandler = async (e) => {
      e.preventDefault();
      try {
        setLoading(true)
        const prompt= `Generate a blog title for the keyword ${input} in the category ${selectedCategory}`

        const {data} = await axios.post('/api/ai/generate-blog-title',{prompt},{headers:{Authorization: `Bearer ${await getToken()}`}})
        if(data.success){
          setContent(data.content)
        }else{
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
        <Sparkles className='w-6 text-[#8E37EB]'/>
        <h1 className='text-xl font-semibold'>AI Title Generation</h1>
      </div>
        <p className='mt-6 text-sm font-medium'>Keyword</p>
        <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='Enter the topic of your article' className='w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600' required />

        <p className='mt-4 text-sm font-medium'>Category</p>

      <div className='mt-3'>
        {blogCategories.map((item, index) => (
          <span onClick={() => setSelectedCategory(item)} className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedCategory === item ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 border-gray-300'} mr-2 mb-2`}
           key={index}>{item}</span>
        ))}
      </div>
        <br />
        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-4 py-2 rounded-lg curspor-pointer hover:opacity-90 transition-all duration-200'>
         {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <Hash className='w-5' />}
          Generate title
        </button>
      </form>
      {/* right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-3'>
        <Hash className='w-5 h-5 text-[#8E37EB]' />
          <h1 className='text-xl font-semibold'>Generated titles</h1>
        </div>

        {
          !content ? (
        <div className='flex-1 flex justify-center items-center'>
        <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
        <Hash className='w-9 h-9' />
        <p>Enter a topic and click "Generate title" to get started</p>
        </div>
        </div>
        ) : (
          <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-600'>
            <div className='reset-tw'>
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )
        } 
      </div>
    </div>
  )
}

export default BlogTitles