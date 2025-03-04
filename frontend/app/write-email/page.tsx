import React from 'react'
import NavigationMenu from '../components/NavigationMenu'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button';

function EmailPage() {
  return (
    <div className='flex flex-col justify-start bg-blue-500 w-screen h-screen'>

        <div className='bg-white-500 h-20 flex-none'>
            <NavigationMenu></NavigationMenu>
        </div>
        <div className='bg-yellow-500 flex flex-auto flex-row'> 
            <div className='bg-red-100 h-full w-3/5 px-10 py-5'>
                <div className='bg-yellow-500 h-full flex flex-col'>
                    <div className='bg-yellow-100 flex-[1] flex flex-col justify-center items-center'>
                        AI Enabled Template Generator
                    </div>
                    <div className='bg-yellow-200 flex-[6]'>
                        Dropdown
                    </div>
                    <div className='bg-yellow-800 flex-[1] flex flex-col justify-center items-center'>
                        <Button className='bg-blue-500 text-white py-2 mt-1 rounded-md hover:bg-blue-600'>
                            Choose this template --next
                        </Button>
                    </div>

                </div>
            </div>
            <div className='bg-red-500 flex items-center justify-center h-full flex-auto p-10'>
                <Textarea className="w-full h-full p-10 bg-white rounded-lg"  name='textarea' id="textarea" placeholder="Type here..."/>
            </div>
        </div>
    </div>
  )
}

export default EmailPage