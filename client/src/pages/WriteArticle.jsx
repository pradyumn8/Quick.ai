import { Edit, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {

  const articleLength = [
    { length: 800, text: 'Short (800 words)' },
    { length: 1500, text: 'Medium (1500 words)' },  
    { length: 3000, text: 'Long (3000 words)' },
  ]

  axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);  
  const [content, setContent] = useState('');

  const {getToken} = useAuth()

  // const onSubmitHandler = (e) => {
  //   e.preventDefault();
  //   try {
  //     setLoading(true);
  //     const prompt = `Write an article about ${input} in ${selectedLength.text}`;

  //     const {data} =await axios.post('/api/ai/generate-article', {prompt, length: selectedLength.length}, {prompt,
  //       headers: {
  //         Authorization: `Bearer ${await getToken()}`}
  //     })

  //     if(data.success){
  //       setContent(data.content);
  //     }else{
  //       toast.error(data.message || 'Failed to generate article');
  //     }
  //   } catch (error) {
  //     toast.error(error.message || 'An error occurred while generating the article');
  //   }
  //   setLoading(false);
  // }
const onSubmitHandler = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    const prompt = `Write an article about ${input} in ${selectedLength.text}`;

    const { data } = await axios.post(
      '/api/ai/generate-article',
      { prompt, length: selectedLength.length },
      {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      }
    );

    if (data.success) {
      setContent(data.content);
    } else {
      toast.error(data.message || 'Failed to generate article');
    }
  } catch (error) {
    toast.error(error.message || 'An error occurred while generating the article');
  }
  setLoading(false);
};

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* left col */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white border border-gray-200 rounded-lg'>
      <div className='flex items-center gap-2 mb-4'>
        <Sparkles className='w-6 text-[#4A7AFF]'/>
        <h1 className='text-xl font-semibold'>Generated Article</h1>
      </div>
      
        <p className='mt-6 text-sm font-medium'>Article Topic</p>
        <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='Enter the topic of your article' className='w-full h-10 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600' required />

        <p className='mt-4 text-sm font-medium'>Article Length</p>

      <div className='mt-3'>
        {articleLength.map((item,index) => (
          <span onClick={()=> setSelectedLength(item)} className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedLength.text === item.text ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 border-gray-300'} mr-2 mb-2`}
           key={index}>{item.text}</span>
        ))}
      </div>
        <br />
        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 rounded-lg curspor-pointer hover:opacity-90 transition-all duration-200'>
          {
            loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
            : <Edit className='w-5'/>
          }
          Generate Article
        </button>
      </form>
        {/* right col */}
        <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">

        <div className='flex items-center gap-3'>
          <Edit className='w-5 h-5 text-[#4A7AFF]'/>
          <h1 className='text-xl font-semibold'>Generated article</h1>
        </div>
        </div>
    </div>
  )
}

export default WriteArticle