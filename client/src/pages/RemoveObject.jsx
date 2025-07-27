import { Scissors, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [input, setInput] = useState('');
  const [object, setObject] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (object.trim().split(' ').length > 1) {
        toast.error('Please enter only one object name');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('image', input);
      formData.append('object', object);

      const { data } = await axios.post(
        '/api/ai/remove-object',
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred while removing the object');
    }
    setLoading(false);
  };

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* left col */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white border border-gray-200 rounded-lg'>
        <div className='flex items-center gap-2 mb-4'>
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Object Removal</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Upload image</p>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept='image/*'
          className='w-full p-1 mt-2 outline-none text-sm rounded-md border-gray-200 border-2'
          required
        />

        <p className='mt-6 text-sm font-medium'>Describe Object name to Remove</p>
        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          rows={4}
          className='w-full px-3 py-2 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='e.g., watch or spoon, only single object name'
          required
        />

        <button
          disabled={loading}
          className='mt-4 w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#9234EA] text-white px-4 py-2 rounded-lg cursor-pointer hover:opacity-90 transition-all duration-200'
        >
          {loading ? (
            <span className='h-4 w-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
          ) : (
            <Scissors className='w-5' />
          )}
          Remove Object
        </button>
      </form>

      {/* right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-3'>
          <Scissors className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Processed Image</h1>
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Scissors className='w-9 h-9' />
              <p>Upload an image and click "Remove Object" to get started</p>
            </div>
          </div>
        ) : (
          <img src={content} alt="processed result" className='mt-3 w-full h-full object-contain' />
        )}
      </div>
    </div>
  );
};

export default RemoveObject;
