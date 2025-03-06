"use client";
import React, { useState } from 'react';
import NavigationMenu from '../components/NavigationMenu';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaArrowRight, FaArrowLeft, FaQuestion, FaDatabase, FaTelegramPlane } from 'react-icons/fa';


function EmailPage() {
  const [currentStep, setCurrentStep] = useState(1); // Track the current step

  // First set of questions (Step 1)
  const renderStep1 = () => (
    <div className="flex-[6] overflow-y-auto h-full px-10 text-lg">
      <div className="mb-4">
        <Label htmlFor="goal" className="text-lg">What is the goal of the email?</Label>
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
      <div className="mb-4">
        <Label htmlFor="tone" className="text-lg">What tone would you prefer for your mail?</Label>
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
      <div className="mb-4">
        <Label htmlFor="audience" className="text-lg">Who are your target audience?</Label>
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
      <div className="mb-4">
        <Label htmlFor="advertising" className="text-lg">What are you advertising?</Label>
        <Textarea
          name="advertising"
          id="advertising"
          placeholder="Enter Text"
          className="w-full h-20 mt-2 p-2 border border-gray-300 rounded-md bg-gray-100 resize-none"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="content" className="text-lg">What is the main content of your mail?</Label>
        <Textarea
          name="content"
          id="content"
          placeholder="Enter Text"
          className="w-full h-32 mt-2 p-2 border border-gray-300 rounded-md bg-gray-100 resize-none"
        />
      </div>
    </div>
  );

  // Second set of questions (Step 2)
  const renderStep2 = () => (
    <div className="flex-[6] overflow-y-auto h-full px-10 text-lg">
      <div className="mb-4">
        <Label htmlFor="callToAction" className="text-lg">What is your call to action?</Label>
        <Select name="callToAction">
          <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-md">
            <SelectValue placeholder="Choose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reply">Reply to this email</SelectItem>
            <SelectItem value="visit">Visit a website</SelectItem>
            <SelectItem value="purchase">Make a purchase</SelectItem>
            <SelectItem value="signup">Sign up</SelectItem>
            <SelectItem value="contact">Contact us</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <Label htmlFor="urgency" className="text-lg">How urgent is this email?</Label>
        <Select name="urgency">
          <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-md">
            <SelectValue placeholder="Choose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="immediate">Immediate</SelectItem>
            <SelectItem value="soon">Within a few days</SelectItem>
            <SelectItem value="week">Within a week</SelectItem>
            <SelectItem value="month">Within a month</SelectItem>
            <SelectItem value="noRush">No rush</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <Label htmlFor="additionalInfo" className="text-lg">Any additional information to include?</Label>
        <Textarea
          name="additionalInfo"
          id="additionalInfo"
          placeholder="Enter Text"
          className="w-full h-20 mt-2 p-2 resize-none border border-gray-300 rounded-md bg-gray-100"
        />
      </div>
    </div>
  );

  // Third set of questions (Step 3) - Placeholder (customize as needed)
  const renderStep3 = () => (
    <div className="flex-[6] overflow-y-auto h-full px-10 text-lg">
      <div className="mb-4">
        <Label htmlFor="subject" className="text-lg">What is the subject line?</Label>
        <Textarea
          name="subject"
          id="subject"
          placeholder="Enter Subject"
          className="w-full h-14 mt-2 p-2 border border-gray-300 resize-none rounded-md bg-gray-100"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="style" className="text-lg">What style do you prefer?</Label>
        <Select name="style">
          <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-md">
            <SelectValue placeholder="Choose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minimal">Minimal</SelectItem>
            <SelectItem value="bold">Bold</SelectItem>
            <SelectItem value="elegant">Elegant</SelectItem>
            <SelectItem value="modern">Modern</SelectItem>
            <SelectItem value="classic">Classic</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  // Handle "Next" button click (no looping)
  const handleNextStep = (direction: number) => {
    setCurrentStep((prevStep) => {
      const newStep = prevStep + direction;
      if (newStep < 1) return 1; // Prevent going below step 1
      if (newStep > 3) return 3; // Prevent going above step 3
      return newStep;
    });
  };

  // Handle sidebar button clicks
  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="flex flex-col justify-start w-screen h-screen">
      <div className="h-20 flex-none">
        <NavigationMenu />
      </div>
      <div className="flex flex-auto flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-screen md:w-[6rem] bg-[#0F142E] flex md:flex-col justify-center items-center py-5 space-x-6 md:space-y-12 md:space-x-0 ">
            <Button
              className={`w-16 h-16 rounded-full hover:bg-[#A3A4B3] flex items-center justify-center p-0 ${
                currentStep === 1 ? 'bg-[#DCDDEB] text-black' : 'bg-[#494965] text-black'
              }`}
              onClick={() => goToStep(1)}
            >
              <FaQuestion className="!w-[40%] !h-[40%]" /> 

            </Button>
            <Button
              className={`w-16 h-16 rounded-full hover:bg-[#A3A4B3] flex items-center justify-center p-0 ${
                currentStep === 2 ? 'bg-[#DCDDEB] text-black' : 'bg-[#494965] text-black'
              }`}
              onClick={() => goToStep(2)}
            >
               <FaDatabase className="!w-[40%] !h-[40%]" /> 

            </Button>
            <Button 
              className={`w-16 h-16 rounded-full hover:bg-[#A3A4B3] flex items-center justify-center p-0 ${
                currentStep === 3 ? 'bg-[#DCDDEB] text-black' : 'bg-[#494965] text-black'
              }`}
              onClick={() => goToStep(3)}
            >
              <FaTelegramPlane className="!w-[40%] !h-[40%]" /> {/* Increased size */}
            </Button>

          </div>

        {/* Main Section */}
        <div className="h-[calc(100vh-5rem)] w-screen md:w-6/12 px-10 py-10 flex flex-row">
          
          {/* Main Questions Area */}
          <div className="w-full  h-full flex flex-col">
            <div className="flex-[1] flex flex-col justify-center items-center text-xl">
              AI Enabled Template Generator
            </div>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            <div className="flex-[1] flex justify-center items-center">
              <Button
                className="text-lg bg-[#0F142E] text-white py-8 px-10 mr-2 rounded-full hover:bg-[#434C7B]"
                onClick={() => handleNextStep(-1)} // Assuming handleNextStep can handle going back
              >
                <FaArrowLeft />
                <span className="ml-2">Back</span>
              </Button>

              <Button
                className="text-lg bg-[#0F142E] text-white py-8 px-10 rounded-full hover:bg-[#434C7B]"
                onClick={() => handleNextStep(1)} // Assuming handleNextStep can handle going forward
              >
                <span className="mr-2">Choose this template</span>
                <FaArrowRight />
              </Button>
            </div>
          </div>
        </div>

        {/* Email content */}
        <div className="bg-[#0F142E] flex items-center justify-center h-[20rem] md:h-full flex-auto p-10">
          <Textarea
            className="text-lg w-full h-full p-10 bg-white rounded-lg resize-none"
            name="textarea"
            id="textarea"
            placeholder="Type here..."
          />
        </div>
      </div>
    </div>
  );
}

export default EmailPage;