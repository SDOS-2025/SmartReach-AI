"use client";
import React, { useState } from 'react';
import NavigationMenu from '../components/NavigationMenu';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaArrowRight, FaArrowLeft, FaQuestion, FaDatabase, FaTelegramPlane } from 'react-icons/fa';
import { Input } from '@/components/ui/input'
import { Checkbox } from '@radix-ui/react-checkbox';
 

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
      {/* Campaign Scheduling Preference */}
      <div className="mb-6">
        <Label htmlFor="schedule" className="text-lg">When would you like to schedule your campaign?</Label>
        <div className="mt-2 flex gap-4">
          <Input
            type="date"
            name="scheduleDate"
            id="scheduleDate"
            className="w-1/2 h-14 p-2 border border-gray-300 rounded-md bg-gray-100"
          />
          <Input
            type="time"
            name="scheduleTime"
            id="scheduleTime"
            className="w-1/2 h-14 p-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
      </div>
  
      {/* Primary Goal for Send-Time Optimization */}
      <div className="mb-6">
        <Label htmlFor="goal" className="text-lg">What is your primary goal for send-time optimization?</Label>
        <Select name="goal">
          <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-md">
            <SelectValue placeholder="Select a goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open-rates">Maximize open rates</SelectItem>
            <SelectItem value="click-through">Increase click-through rates</SelectItem>
            <SelectItem value="conversions">Drive conversions (e.g., sales, sign-ups)</SelectItem>
            <SelectItem value="engagement">Boost overall engagement</SelectItem>
          </SelectContent>
        </Select>
      </div>
  
      {/* Target Audience Timezone */}
      <div className="mb-6">
        <Label className="text-lg">Which timezone(s) does your audience reside in? (Select all that apply)</Label>
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox id="tz-america" name="timezone" value="America/New_York"  className="w-5 h-5 border border-gray-400 rounded-sm bg-white data-[state=checked]:bg-blue-500" />
            <Label htmlFor="tz-america">America (e.g., EST, PST)</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="tz-europe" name="timezone" value="Europe/London" className="w-5 h-5 border border-gray-400 rounded-sm bg-white data-[state=checked]:bg-blue-500"/>
            <Label htmlFor="tz-europe">Europe (e.g., GMT, CET)</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="tz-asia" name="timezone" value="Asia/Tokyo"  className="w-5 h-5 border border-gray-400 rounded-sm bg-white data-[state=checked]:bg-blue-500" />
            <Label htmlFor="tz-asia">Asia (e.g., IST, JST)</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="tz-other" name="timezone" value="other"  className="w-5 h-5 border border-gray-400 rounded-sm bg-white data-[state=checked]:bg-blue-500"/>
            <Label htmlFor="tz-other">Other (specify below)</Label>
          </div>
          <Input
            type="text"
            name="timezoneOther"
            placeholder="Enter custom timezone (e.g., Australia/Sydney)"
            className="w-full h-12 mt-2 p-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
      </div>
  
      {/* Audience Behavior Insight */}
      <div className="mb-6">
        <Label htmlFor="behavior" className="text-lg">When is your audience most active? (Optional)</Label>
        <Textarea
          name="behavior"
          id="behavior"
          placeholder="e.g., weekday mornings, weekend evenings"
          className="w-full h-20 mt-2 p-2 border border-gray-300 resize-none rounded-md bg-gray-100"
        />
      </div>
  
      {/* Historical Campaign Data */}
      <div className="mb-6">
        <Label htmlFor="dataUpload" className="text-lg">Upload past campaign data (Optional)</Label>
        <Input
          type="file"
          name="dataUpload"
          id="dataUpload"
          accept=".csv,.pdf,.txt"
          className="w-full h-14 mt-2 p-2 border border-gray-300 rounded-md bg-gray-100"
        />
        <p className="text-sm text-gray-500 mt-1">Accepted formats: CSV, PDF, TXT</p>
      </div>
  
      {/* Frequency Preference */}
      <div className="mb-6">
        <Label htmlFor="frequency" className="text-lg">How often will this campaign run?</Label>
        <Select name="frequency">
          <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-md">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="one-time">One-time send</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="custom">Custom (specify below)</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="text"
          name="frequencyCustom"
          placeholder="e.g., Every 3 days"
          className="w-full h-12 mt-2 p-2 border border-gray-300 rounded-md bg-gray-100"
        />
      </div>
  
      {/* Industry or Audience Type */}
      <div className="mb-6">
        <Label htmlFor="industry" className="text-lg">What industry or audience segment are you targeting?</Label>
        <Input
          type="text"
          name="industry"
          id="industry"
          placeholder="e.g., e-commerce, B2B, healthcare"
          className="w-full h-14 mt-2 p-2 border border-gray-300 rounded-md bg-gray-100"
        />
      </div>
  
      {/* A/B Testing Preference */}
      <div className="mb-6">
        <Label className="text-lg">Enable A/B testing for send times?</Label>
        <div className="mt-2 flex items-center gap-2">
          <Checkbox id="abTest" name="abTest"  className="w-5 h-5 border border-gray-400 rounded-sm bg-white data-[state=checked]:bg-blue-500" />
          <Label htmlFor="abTest">Yes, split my audience to test two send times</Label>
        </div>
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