import React from 'react'
import NavigationMenu from '../components/NavigationMenu'
import LoginCard from '../components/LoginCard'

function LoginPage() {
  return (
    <div className='flex flex-col justify-start bg-blue-500 w-screen h-screen'>

        <div className='bg-white-500 h-20 flex-none'>
            <NavigationMenu></NavigationMenu>
        </div>
        <div className='bg-yellow-500 flex flex-auto flex-row'> 
            <div className='bg-red-100 h-full w-3/5 flex-none flex justify-center'>
                <LoginCard></LoginCard>
            </div>
            <div className='bg-red-500 flex items-center justify-center h-full flex-auto'>
                <h2 className='text-white text-2xl'>Signup Card</h2>
            </div>
        </div>

    </div>
  )
}

export default LoginPage