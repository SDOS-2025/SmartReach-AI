import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const LoginCard = () => {
  return (
    <div className='p-8 my-auto bg-white rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold mb-4'>Welcome to SmartReachAI</h1>
        <h2 className='text-lg mb-3 flex justify-center'>Login</h2>
      
        <Label className='block mb-3'>
            <Input type='text'placeholder='Username' />
        </Label>
        
        <Label className='block mb-3'>
            <Input type='password'  placeholder='Password' />
        </Label>
        
        <a href="#" className='text-sm text-blue-500 hover:underline mb-3'>Forgot Password?</a>
        
        <Button className='w-full bg-blue-500 text-white py-2 mt-1 rounded-md hover:bg-blue-600'>Login</Button>
        
        <div className='flex items-center my-4'>
            <Separator className='flex-auto' />
            <span className='mx-2 flex-none text-gray-500'>or</span>
            <Separator className='flex-auto' />
        </div>
        
        <Button className='w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600'>Login with Google</Button>
    </div>
  );
};

export default LoginCard;