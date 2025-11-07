import { LoaderIcon } from 'lucide-react'
import React from 'react'

const PageLoader = () => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <LoaderIcon className='animate-spin size-25 text-green-400'/>
    </div>
  )
}

export default PageLoader
