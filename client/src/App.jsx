import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import WriteArticle from './pages/WriteArticle'
import BlogTitles from './pages/BlogTitles'
import Community from './pages/Community'
import ReviewResume from './pages/ReviewResume'
import RemoveBackground from './pages/RemoveBackground'
import RemoveObject from './pages/RemoveObject'
import GenerateImages from './pages/GenerateImages'
import { useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import {Toaster} from 'react-hot-toast'

function App() {

  const {getToken} = useAuth  ()
  useEffect(()=>{
    getToken().then((token)=>console.log(token));
  },[])

  return (
    <>
    <Toaster/>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<Home />} />
        {/* last time due to this issue i was getting a lots of errors */}  
        {/* <Route path='/ai' element={<Layout />} /> */}
      
        <Route path="/ai" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="write-article" element={<WriteArticle />} />
          <Route path="blog-titles" element={<BlogTitles />} />
          <Route path="community" element={<Community />} />
          <Route path="review-resume" element={<ReviewResume />} />
          <Route path="remove-background" element={<RemoveBackground />} />
          <Route path="remove-object" element={<RemoveObject />} />
          <Route path="generate-images" element={<GenerateImages />} />
        </Route>
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
