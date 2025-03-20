"use client";
import React, { useState } from 'react';
import NavigationMenu from '../components/NavigationMenu';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaArrowRight, FaArrowLeft, FaQuestion, FaDatabase, FaTelegramPlane } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@radix-ui/react-checkbox';
import { useRef } from 'react';

function EmailPage() {
  const [currentStep, setCurrentStep] = useState(1); // Track the current step

  // State for Step 1 form fields
  const [formData, setFormData] = useState({
    category: '',
    tone: '',
    contentType: '',
    companyDescription: '',
    emailPurpose: '',
    audienceType: '',
    preferredLength: '',
    cta: '',
    customCta: '',
    emailStructure: '',
  });

  // Handle changes for Select components
  const handleSelectChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle changes for Textarea components
  const handleTextChange = (field: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // First set of questions (Step 1)
  const renderStep1 = () => (
    <div className="flex-[6] overflow-y-auto h-full px-10 text-lg">
      <div className="mb-4">
        <Label htmlFor="category" className="text-lg">Category & Subcategory <span className="text-red-500">*</span></Label>
        <Select name="category" value={formData.category} onValueChange={handleSelectChange('category')}>
          <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-md">
            <SelectValue placeholder="Choose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ecommerce">E-commerce</SelectItem>
            <SelectItem value="saas">SaaS</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="travel">Travel</SelectItem>
            <SelectItem value="events">Events</SelectItem>
          </SelectContent>
        </Select>
        {/* {!formData.category && (
          <p className="text-red-500 text-sm mt-1">This field is required</p>
        )} */}
      </div>
      <div className="mb-4">
        <Label htmlFor="tone" className="text-lg">Tone <span className="text-red-500">*</span></Label>
        <Select name="tone" value={formData.tone} onValueChange={handleSelectChange('tone')}>
          <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-md">
            <SelectValue placeholder="Choose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="friendly">Friendly</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="excited">Excited</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="persuasive">Persuasive</SelectItem>
            <SelectItem value="formal">Formal</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <Label htmlFor="contentType" className="text-lg">Content Type <span className="text-red-500">*</span></Label>
        <Select name="contentType" value={formData.contentType} onValueChange={handleSelectChange('contentType')}>
          <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-md">
            <SelectValue placeholder="Choose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="promotional">Promotional</SelectItem>
            <SelectItem value="informational">Informational</SelectItem>
            <SelectItem value="newsletter">Newsletter</SelectItem>
            <SelectItem value="eventInvite">Event Invite</SelectItem>
            <SelectItem value="productLaunch">Product Launch</SelectItem>
            <SelectItem value="discountOffer">Discount Offer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <Label htmlFor="companyDescription" className="text-lg">Company Description (up to 100 words) <span className="text-red-500">*</span></Label>
        <Textarea 
          name="companyDescription"
          id="companyDescription"
          placeholder="A short introduction about the brand"
          className="w-full h-20 mt-2 p-2 border border-gray-300 rounded-md bg-gray-100 resize-none"
          maxLength={100}
          value={formData.companyDescription}
          onChange={handleTextChange('companyDescription')}
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="emailPurpose" className="text-lg">Email Purpose (up to 100 words) <span className="text-red-500">*</span></Label>
        <Textarea
          name="emailPurpose"
          id="emailPurpose"
          placeholder="What is the goal of the email? (e.g., Announce a new product, Offer a discount)"
          className="w-full h-20 mt-2 p-2 border border-gray-300 rounded-md bg-gray-100 resize-none"
          maxLength={100}
          value={formData.emailPurpose}
          onChange={handleTextChange('emailPurpose')}
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="audienceType" className="text-lg">Audience Type <span className="text-red-500">*</span></Label>
        <Select name="audienceType" value={formData.audienceType} onValueChange={handleSelectChange('audienceType')}>
          <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-md">
            <SelectValue placeholder="Choose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="subscribedCustomers">Subscribed Customers</SelectItem>
            <SelectItem value="openSourceAudience">Open-Source Audience</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <Label htmlFor="preferredLength" className="text-lg">Preferred Length <span className="text-red-500">*</span></Label>
        <Select name="preferredLength" value={formData.preferredLength} onValueChange={handleSelectChange('preferredLength')}>
          <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-md">
            <SelectValue placeholder="Choose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="short">Short (Under 100 words)</SelectItem>
            <SelectItem value="medium">Medium (100-200 words)</SelectItem>
            <SelectItem value="long">Long (200+ words)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <Label htmlFor="cta" className="text-lg">Call-to-Action (CTA) <span className="text-red-500">*</span></Label>
        <Select name="cta" value={formData.cta} onValueChange={handleSelectChange('cta')}>
          <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-md">
            <SelectValue placeholder="Choose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buyNow">Buy Now</SelectItem>
            <SelectItem value="signUp">Sign Up</SelectItem>
            <SelectItem value="learnMore">Learn More</SelectItem>
            <SelectItem value="getDiscount">Get Discount</SelectItem>
            <SelectItem value="bookADemo">Book a Demo</SelectItem>
            <SelectItem value="other">Other (Specify below)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.cta === 'other' && (
        <div className="mb-4">
          <Label htmlFor="customCta" className="text-lg">
            Custom CTA <span className="text-red-500">*</span>
          </Label>
          <Textarea
          
            name="customCta"
            id="customCta"
            placeholder="Enter custom call-to-action"
            className="w-full h-20 mt-2 p-2 border border-gray-300 rounded-md bg-gray-100 resize-none"
            value={formData.customCta}
            onChange={handleTextChange('customCta')}
          />
          {/* {!formData.customCta && <p className="text-red-500 text-sm mt-1">This field is required when "Other" is selected</p>} */}
        </div>
      )}

      <div className="mb-4">
        <Label htmlFor="emailStructure" className="text-lg">Email Structure</Label>
        <Select name="emailStructure" value={formData.emailStructure} onValueChange={handleSelectChange('emailStructure')}>
          <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-md">
            <SelectValue placeholder="Choose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="promotional">Promotional</SelectItem>
            <SelectItem value="informational">Informational</SelectItem>
            <SelectItem value="newsletter">Newsletter</SelectItem>
            <SelectItem value="eventInvite">Event Invite</SelectItem>
          </SelectContent>
        </Select>
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

  // Third set of questions (Step 3)
  const renderStep3 = () => (
    <div className="flex-[6] overflow-y-auto h-full px-10 text-lg">
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
      <div className="mb-6">
        <Label className="text-lg">Which timezone(s) does your audience reside in? (Select all that apply)</Label>
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox id="tz-america" name="timezone" value="America/New_York" className="w-5 h-5 border border-gray-400 rounded-sm bg-white data-[state=checked]:bg-blue-500" />
            <Label htmlFor="tz-america">America (e.g., EST, PST)</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="tz-europe" name="timezone" value="Europe/London" className="w-5 h-5 border border-gray-400 rounded-sm bg-white data-[state=checked]:bg-blue-500"/>
            <Label htmlFor="tz-europe">Europe (e.g., GMT, CET)</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="tz-asia" name="timezone" value="Asia/Tokyo" className="w-5 h-5 border border-gray-400 rounded-sm bg-white data-[state=checked]:bg-blue-500" />
            <Label htmlFor="tz-asia">Asia (e.g., IST, JST)</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="tz-other" name="timezone" value="other" className="w-5 h-5 border border-gray-400 rounded-sm bg-white data-[state=checked]:bg-blue-500"/>
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
      <div className="mb-6">
        <Label htmlFor="behavior" className="text-lg">When is your audience most active? (Optional)</Label>
        <Textarea
          name="behavior"
          id="behavior"
          placeholder="e.g., weekday mornings, weekend evenings"
          className="w-full h-20 mt-2 p-2 border border-gray-300 resize-none rounded-md bg-gray-100"
        />
      </div>
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
      <div className="mb-6">
        <Label className="text-lg">Enable A/B testing for send times?</Label>
        <div className="mt-2 flex items-center gap-2">
          <Checkbox id="abTest" name="abTest" className="w-5 h-5 border border-gray-400 rounded-sm bg-white data-[state=checked]:bg-blue-500" />
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

  const subjectRef = useRef<HTMLTextAreaElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Handle "Generate Template" button click
  const generate_template = async () => {

    try {
      const response = await fetch('http://localhost:8000/api/generate-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
    
      if (subjectRef.current && bodyRef.current) {
        subjectRef.current.value = data.Subject;
        bodyRef.current.value = data.Body;
      }
      
    } catch (error) {
      console.error('Error fetching email data:', error);
    }
  };

  return (
    <div className="flex flex-col justify-start w-screen h-screen">
      <div className="h-20 flex-none">
        <NavigationMenu />
      </div>
      <div className="flex flex-auto flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-screen md:w-[6rem] bg-[#0F142E] flex md:flex-col justify-center items-center py-5 space-x-6 md:space-y-12 md:space-x-0">
          <Button
            className={`w-16 h-16 rounded-full hover:bg-[#A3A4B3] flex items-center justify-center p-0 ${
              currentStep === 1 ? 'bg-[#DCDDEB] text-black' : 'bg-[#494965] text-black'
            }`}
            onClick={() => goToStep(1)}
          >
            {FaQuestion({ className: "!w-[40%] !h-[40%]" })}
          </Button>
          <Button
            className={`w-16 h-16 rounded-full hover:bg-[#A3A4B3] flex items-center justify-center p-0 ${
              currentStep === 2 ? 'bg-[#DCDDEB] text-black' : 'bg-[#494965] text-black'
            }`}
            onClick={() => goToStep(2)}
          >
            {FaDatabase({ className: "!w-[40%] !h-[40%]" })}
          </Button>
          <Button
            className={`w-16 h-16 rounded-full hover:bg-[#A3A4B3] flex items-center justify-center p-0 ${
              currentStep === 3 ? 'bg-[#DCDDEB] text-black' : 'bg-[#494965] text-black'
            }`}
            onClick={() => goToStep(3)}
          >
            {FaTelegramPlane({className: "!w-[40%] !h-[40%]"})}
          </Button>
        </div>

        {/* Main Section */}
        <div className="h-[calc(100vh-5rem)] w-screen md:w-6/12 px-10 py-10 flex flex-row">
          {/* Main Questions Area */}
          <div className="w-full h-full flex flex-col">
            <div className="flex-[1] flex flex-col justify-center items-center text-xl">
              AI Enabled Template Generator
            </div>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            <div className="flex-[1] flex justify-center items-center">
              <Button
                className="text-lg bg-[#0F142E] text-white py-8 px-10 mr-2 rounded-full hover:bg-[#434C7B]"
                onClick={() => handleNextStep(-1)}
              >
                {FaArrowLeft({})}
                <span className="ml-2">Back</span>
              </Button>
              <Button
                className="text-lg bg-[#0F142E] text-white py-8 px-10 mr-2 rounded-full hover:bg-[#434C7B]"
                onClick={generate_template}
              >
                <span className="ml-2">Generate Template</span>
              </Button>
              <Button
                className="text-lg bg-[#0F142E] text-white py-8 px-10 rounded-full hover:bg-[#434C7B]"
                onClick={() => handleNextStep(1)}
              >
                <span className="mr-2">Choose this template</span>
                {FaArrowRight({})}
              </Button>
            </div>
          </div>
        </div>

        {/* Email content */}
        <div className="bg-[#0F142E] flex-col items-center justify-center h-[20rem] md:h-full flex-auto p-10">
          <Textarea
              className="text-lg w-full h-[8%] p-5 pl-10 bg-white rounded-t-lg resize-none"
              name="template_subject"
              placeholder="Subject"
              ref={subjectRef}
            />
          <Textarea
            className="text-lg w-full h-[92%] pl-10 bg-white rounded-b-lg resize-none"
            name="template_body"
            placeholder="Body"
            ref={bodyRef}
          />
        </div>
      </div>
    </div>
  );
}

export default EmailPage;