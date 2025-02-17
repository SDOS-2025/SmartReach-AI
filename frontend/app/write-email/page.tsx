import React from 'react'
import NavigationMenu from '../components/NavigationMenu'
import { Textarea } from '@/components/ui/textarea'

function EmailPage() {
  return (
    <div className='flex flex-col justify-start bg-blue-500 w-screen h-screen'>

        <div className='bg-white-500 h-20 flex-none'>
            <NavigationMenu></NavigationMenu>
        </div>
        <div className='bg-yellow-500 flex flex-auto flex-row'> 
            <div className='bg-red-100 h-full w-3/5 flex-none flex justify-center'>
                ASK QUESTIONS
            </div>
            <div className='bg-red-500 flex items-center justify-center h-full flex-auto p-10'>
                <Textarea className="w-full h-full p-10 bg-white rounded-lg"  name='textarea' id="textarea" placeholder="Type here..."/>
            </div>
        </div>
    </div>
  )
}

export default EmailPage