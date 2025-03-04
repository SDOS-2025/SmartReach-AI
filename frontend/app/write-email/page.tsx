"use client";
import React, { useState } from 'react';
import NavigationMenu from '../components/NavigationMenu';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function EmailPage() {
  const [currentStep, setCurrentStep] = useState(1); // Track the current step

  // First set of questions (Step 1)
  const renderStep1 = () => (
    <div className="bg-yellow-200 flex-[6] overflow-y-auto h-full px-10 text-lg">
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
          className="w-full h-20 mt-2 p-2 border border-gray-300 rounded-md bg-gray-100"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="content" className="text-lg">What is the main content of your mail?</Label>
        <Textarea
          name="content"
          id="content"
          placeholder="Enter Text"
          className="w-full h-32 mt-2 p-2 border border-gray-300 rounded-md bg-gray-100"
        />
      </div>
    </div>
  );

  // Second set of questions (Step 2)
  const renderStep2 = () => (
    <div className="bg-yellow-200 flex-[6] overflow-y-auto h-full px-10 text-lg">
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
          className="w-full h-20 mt-2 p-2 border border-gray-300 rounded-md bg-gray-100"
        />
      </div>
    </div>
  );

  // Third set of questions (Step 3) - Placeholder (customize as needed)
  const renderStep3 = () => (
    <div className="bg-yellow-200 flex-[6] overflow-y-auto h-full px-10 text-lg">
      <div className="mb-4">
        <Label htmlFor="subject" className="text-lg">What is the subject line?</Label>
        <Textarea
          name="subject"
          id="subject"
          placeholder="Enter Subject"
          className="w-full h-14 mt-2 p-2 border border-gray-300 rounded-md bg-gray-100"
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
  const handleNextStep = () => {
    setCurrentStep((prevStep) => (prevStep < 3 ? prevStep + 1 : 3)); // Stop at Step 3
  };

  // Handle sidebar button clicks
  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="flex flex-col justify-start bg-blue-500 w-screen h-screen">
      <div className="bg-white h-20 flex-none">
        <NavigationMenu />
      </div>
      <div className="bg-yellow-500 flex flex-auto flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-screen md:w-1/12 bg-gray-200 flex flex-col justify-start items-center py-5 space-y-4">
            <Button
              className={`w-3/4 py-2 rounded-md text-lg ${currentStep === 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
              onClick={() => goToStep(1)}
            >
              Step 1
            </Button>
            <Button
              className={`w-3/4 py-2 rounded-md text-lg ${currentStep === 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
              onClick={() => goToStep(2)}
            >
              Step 2
            </Button>
            <Button
              className={`w-3/4 py-2 rounded-md text-lg ${currentStep === 3 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
              onClick={() => goToStep(3)}
            >
              Step 3
            </Button>
          </div>

        {/* Main Section */}
        <div className="bg-red-100 h-[calc(100vh-5rem)] w-screen md:w-7/12 px-10 py-10 flex flex-row">
          
          {/* Main Questions Area */}
          <div className="w-full bg-yellow-500 h-full flex flex-col">
            <div className="bg-yellow-100 flex-[1] flex flex-col justify-center items-center text-xl">
              AI Enabled Template Generator
            </div>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            <div className="bg-yellow-800 flex-[1] flex flex-col justify-center items-center">
              <Button
                className="text-lg bg-blue-500 text-white py-2 mt-1 rounded-md hover:bg-blue-600"
                onClick={handleNextStep}
              >
                Choose this template --next
              </Button>
            </div>
          </div>
        </div>

        {/* Email content */}
        <div className="bg-red-500 flex items-center justify-center h-[20rem] md:h-full flex-auto p-10">
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