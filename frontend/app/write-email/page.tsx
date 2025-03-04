import React from 'react'
import NavigationMenu from '../components/NavigationMenu'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function EmailPage() {
  return (
    <div className='flex flex-col justify-start bg-blue-500 w-screen h-screen'>

        <div className='bg-white-500 h-20 flex-none'>
            <NavigationMenu></NavigationMenu>
        </div>
        <div className='bg-yellow-500 flex flex-auto flex-col md:flex-row'> 
            <div className='bg-red-100 h-[calc(100vh-5rem)] w-screen md:w-3/5 px-10 py-5'>
                <div className='bg-yellow-500 h-full flex flex-col'>
                    <div className='bg-yellow-100 flex-[1] flex flex-col justify-center items-center text-xl'>
                        AI Enabled Template Generator
                    </div>
                    <div className='bg-yellow-200 flex-[6] overflow-y-auto h-full px-20 text-lg'>
                        <div className='mb-4 text-lg'>
                            <Label htmlFor="goal" className='text-lg'>What is the goal of the email?</Label>
                            <Select name="goal">
                                <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-md">
                                    <SelectValue placeholder="Choose" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="inform">Inform</SelectItem>
                                    <SelectItem value="persuade">Persuade</SelectItem>
                                    <SelectItem value="sell">Sell</SelectItem>
                                    <SelectItem value="engage">Engage</SelectItem>
                                    <SelectItem value="follow-up">Follow-up</SelectItem>
                                </SelectContent>
                            </Select>
                            
                        </div>
                        <div className='mb-4'>
                            <Label htmlFor="tone" className='text-lg'>What tone would you prefer for your mail?</Label>
                            <Select name="tone">
                                <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-md">
                                    <SelectValue placeholder="Choose" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="formal">Formal</SelectItem>
                                    <SelectItem value="casual">Casual</SelectItem>
                                    <SelectItem value="friendly">Friendly</SelectItem>
                                    <SelectItem value="professional">Professional</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='mb-4'>
                            <Label htmlFor="audience" className='text-lg'>Who are your target audience?</Label>
                            <Select name="audience">
                                <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-md">
                                    <SelectValue placeholder="Choose" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="customers">Customers</SelectItem>
                                    <SelectItem value="employees">Employees</SelectItem>
                                    <SelectItem value="partners">Partners</SelectItem>
                                    <SelectItem value="investors">Investors</SelectItem>
                                    <SelectItem value="general">General Public</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='mb-4'>
                            <Label htmlFor="advertising" className='text-lg'>What are you advertising?</Label>
                            <Textarea
                                name="advertising"
                                id="advertising"
                                placeholder="Enter Text"
                                className="w-full h-20 mt-2 p-2 border border-gray-300 rounded-md bg-gray-100"
                            />

                        </div>
                        <div className='mb-4' >
                            <Label htmlFor="content" className='text-lg'>What is the main content of your mail?</Label>
                            <Textarea
                                name="content"
                                id="content"
                                placeholder="Enter Text"
                                className="w-full h-32 mt-2 p-2 border border-gray-300 rounded-md bg-gray-100"
                            />

                        </div>
                    </div>
                    <div className='bg-yellow-800 flex-[1] flex flex-col justify-center items-center'>
                        <Button className='text-lg bg-blue-500 text-white py-2 mt-1 rounded-md hover:bg-blue-600'>
                            Choose this template --next
                        </Button>
                    </div>

                </div>
            </div>
            <div className='bg-red-500 flex items-center justify-center h-[20rem] md:h-full flex-auto p-10'>
                <Textarea className="text-lg w-full h-full p-10 bg-white rounded-lg resize-none"  name='textarea' id="textarea" placeholder="Type here..."/>
            </div>
        </div>
    </div>
  )
}

export default EmailPage