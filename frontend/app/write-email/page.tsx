"use client";
import React, { useState } from 'react';
import NavigationMenu from '../components/NavigationMenu';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaArrowRight, FaArrowLeft, FaQuestion, FaDatabase, FaTelegramPlane } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';


function EmailPage() {

  
  
  const [currentStep, setCurrentStep] = useState(1);
  useEffect(() => {
    if (currentStep === 3) {
      const timeout = setTimeout(() => {
        alert("Campaign scheduled successfully!");
        router.push("/home");
      }, 3000);
  
      return () => clearTimeout(timeout);
    }
  }, [currentStep]);
  const [forlgata, setForlgata] =useState<{
    category: string,
    companyURL: string,
    tone: string,
    contentType: string,
    companyDescription: string,
    emailPurpose: string,
    audienceType: string,
    preferredLength: string,
    cta: string,
    customCta: string,
    emailStructure: string,
  }>({
    category: 'ecommerce',
    companyURL: 'smartreachai.social',
    tone: 'friendly',
    contentType: 'promotional',
    companyDescription: 'This is for test',
    emailPurpose: 'This is for test',
    audienceType: 'subscribedCustomers',
    preferredLength: 'short',
    cta: 'buyNow',
    customCta: '',
    emailStructure: 'promotional',
  });
  
  const [step2Data, setStep2Data] = useState<{
    campaignName: string;
    campaignDesc: string;
    startDate: string;
    startTime: string;
    endDate: string;
    dataUpload: File | null; 

  }>({
    campaignName: '',
    campaignDesc: '',
    startDate: '',
    startTime: '',
    endDate: '',
    dataUpload: null,
  });
  const [showErrors, setShowErrors] = useState(false); 
  const [isEmailGenerated, setIsEmailGenerated] = useState(false);
  const [isTimeDataAdded, setIsTimeDataAdded] = useState(false);

  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);

  const handleSelectChange = (field: string) => (value: string) => {
    setForlgata((prev) => ({ ...prev, [field]: value }));
  };

  const handleTextChange = (field: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let text = e.target.value;
    let words = text.trim().split(/\s+/); 

    if (words.length > 100) {
      text = words.slice(0, 100).join(" "); 
    }

    setForlgata((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleStep2InputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setStep2Data((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleStep2TextChange = (field: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let text = e.target.value;
    let words = text.trim().split(/\s+/); 

    if (words.length > 100) {
      text = words.slice(0, 100).join(" "); 
    }

    setStep2Data((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStep2Data((prev) => ({ ...prev, dataUpload: e.target.files ? e.target.files[0] : null }));
  };

  // Validation functions
  const isStep1Valid = () => {
    const requiredFields = [
      forlgata.category,
      forlgata.tone,
      forlgata.contentType,
      forlgata.companyDescription,
      forlgata.emailPurpose,
      forlgata.audienceType,
      forlgata.preferredLength,
      forlgata.cta,
    ];
    if (forlgata.cta === 'other') {
      requiredFields.push(forlgata.customCta);
    }
    return requiredFields.every((field) => field.trim() !== '');
  };

  const isStep2Valid = () => {
    return (
      step2Data.campaignName.trim() !== '' &&
      step2Data.campaignDesc.trim() !== '' &&
      step2Data.startDate.trim() !== '' &&
      step2Data.startTime.trim() !== '' &&
      step2Data.endDate.trim() != ''
    );
  };

  const renderStep1 = () => (
    <div className="flex-[6] overflow-y-auto h-full px-10 text-lg">
      <div className="mb-6">
        <Label htmlFor="companyURL" className="text-lg">
          What is the company website ?
        </Label>
        <div className="mt-2 flex gap-4">
          <Input
            type="text"
            name="companyURL"
            id="companyURL"
            maxLength={100}
            className="w-1/2 h-14 p-2 border border-gray-300 rounded-lg bg-gray-100"
            value={forlgata.companyURL}
            onChange={handleTextChange('companyURL')}
            required
          />          
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="category" className="text-lg">
          Category & Subcategory <span className="text-red-500">*</span>
        </Label>
        <Select name="category" value={forlgata.category} onValueChange={handleSelectChange('category')}>
          <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-lg">
            <SelectValue placeholder="Choose"  />
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
        {showErrors && !forlgata.category && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </div>
      <div className="mb-4">
        <Label htmlFor="tone" className="text-lg">
          Tone <span className="text-red-500">*</span>
        </Label>
        <Select name="tone" value={forlgata.tone} onValueChange={handleSelectChange('tone')}>
          <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-lg">
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
        {showErrors && !forlgata.tone && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </div>
      <div className="mb-4">
        <Label htmlFor="contentType" className="text-lg">
          Content Type <span className="text-red-500">*</span>
        </Label>
        <Select name="contentType" value={forlgata.contentType} onValueChange={handleSelectChange('contentType')}>
          <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-lg">
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
        {showErrors && !forlgata.contentType && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </div>
      <div className="mb-4">
        <Label htmlFor="companyDescription" className="text-lg">
          Company Description (up to 100 words) <span className="text-red-500">*</span>
        </Label>
        <Textarea
          name="companyDescription"
          id="companyDescription"
          placeholder="A short introduction about the brand"
          className="w-full h-20 mt-2 p-2 border border-gray-300 rounded-lg bg-gray-100 resize-none"
          value={forlgata.companyDescription}
          onChange={handleTextChange('companyDescription')}
          required
        />
        {showErrors && !forlgata.companyDescription && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </div>
      <div className="mb-4">
        <Label htmlFor="emailPurpose" className="text-lg">
          Email Purpose (up to 100 words) <span className="text-red-500">*</span>
        </Label>
        <Textarea
          name="emailPurpose"
          id="emailPurpose"
          placeholder="What is the goal of the email? (e.g., Announce a new product, Offer a discount)"
          className="w-full h-20 mt-2 p-2 border border-gray-300 rounded-lg bg-gray-100 resize-none"
          maxLength={100}
          value={forlgata.emailPurpose}
          onChange={handleTextChange('emailPurpose')}
          required
        />
        {showErrors && !forlgata.emailPurpose && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </div>
      <div className="mb-4">
        <Label htmlFor="audienceType" className="text-lg">
          Audience Type <span className="text-red-500">*</span>
        </Label>
        <Select name="audienceType" value={forlgata.audienceType} onValueChange={handleSelectChange('audienceType')}>
          <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-lg">
            <SelectValue placeholder="Choose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="subscribedCustomers">Subscribed Customers</SelectItem>
            <SelectItem value="openSourceAudience">Open-Source Audience</SelectItem>
          </SelectContent>
        </Select>
        {showErrors && !forlgata.audienceType && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </div>
      <div className="mb-4">
        <Label htmlFor="preferredLength" className="text-lg">
          Preferred Length <span className="text-red-500">*</span>
        </Label>
        <Select name="preferredLength" value={forlgata.preferredLength} onValueChange={handleSelectChange('preferredLength')}>
          <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-lg">
            <SelectValue placeholder="Choose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="short">Short (Under 100 words)</SelectItem>
            <SelectItem value="medium">Medium (100-200 words)</SelectItem>
            <SelectItem value="long">Long (200+ words)</SelectItem>
          </SelectContent>
        </Select>
        {showErrors && !forlgata.preferredLength && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </div>
      <div className="mb-4">
        <Label htmlFor="cta" className="text-lg">
          Call-to-Action (CTA) <span className="text-red-500">*</span>
        </Label>
        <Select name="cta" value={forlgata.cta} onValueChange={handleSelectChange('cta')}>
          <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-lg">
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
        {showErrors && !forlgata.cta && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </div>
      {forlgata.cta === 'other' && (
        <div className="mb-4">
          <Label htmlFor="customCta" className="text-lg">
            Custom CTA <span className="text-red-500">*</span>
          </Label>
          <Textarea
            name="customCta"
            id="customCta"
            placeholder="Enter custom call-to-action"
            className="w-full h-20 mt-2 p-2 border border-gray-300 rounded-lg bg-gray-100 resize-none"
            value={forlgata.customCta}
            onChange={handleTextChange('customCta')}
            required
          />
          {showErrors && !forlgata.customCta && <p className="text-red-500 text-sm mt-1">This field is required when {"Other"} is selected</p>}
        </div>
      )}
      <div className="mb-4">
        <Label htmlFor="emailStructure" className="text-lg">Email Structure</Label>
        <Select name="emailStructure" value={forlgata.emailStructure} onValueChange={handleSelectChange('emailStructure')}>
          <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-lg">
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

  const renderStep2 = () => (
    <div className="flex-[6] overflow-y-auto h-full px-10 text-lg">
      <div className="mb-6">
        <Label htmlFor="campaignName" className="text-lg">
          What is the campaign name ?<span className="text-red-500">*</span>
        </Label>
        <div className="mt-2 flex gap-4">
          <Input
            type="text"
            name="campaignName"
            id="campaignName"
            maxLength={100}
            className="w-1/2 h-14 p-2 border border-gray-300 rounded-lg bg-gray-100"
            value={step2Data.campaignName}
            onChange={handleStep2InputChange('campaignName')}
            required
          />
          {showErrors && !step2Data.campaignName && <p className="text-red-500 text-sm mt-1">campaignName is required</p>}
          
        </div>
      </div>


      <div className="mb-6">
        <Label htmlFor="campaignDesc" className="text-lg">
          Enter the campaign description <span className="text-red-500">*</span>
        </Label>
        <div className="mt-2 flex gap-4">
          <Textarea
            name="campaignDesc"
            id="campaignDesc"
            placeholder="A short introduction about the campaign"
            className="w-full h-20 mt-2 p-2 border border-gray-300 rounded-lg bg-gray-100 resize-none"
            value={step2Data.campaignDesc}
            onChange={handleStep2TextChange('campaignDesc')}
            required
          />
          {showErrors && !step2Data.campaignDesc && <p className="text-red-500 text-sm mt-1">campaignDesc is required</p>}
          
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center">
    <Label htmlFor="schedule" className="text-lg">
      When would you like to start your campaign? <span className="text-red-500">*</span>
    </Label>
    <button
      type="button"
      onClick={fetchAndAutofillOptimalStartTime}
      className="text-sm text-blue-600 hover:underline"
    >
      Autofill Optimal Time
    </button>
      </div>

        <div className="mt-2 flex gap-4">
          <Input
            type="date"
            name="startDate"
            id="startDate"
            className="w-1/2 h-14 p-2 border border-gray-300 rounded-lg bg-gray-100"
            value={step2Data.startDate}
            onChange={handleStep2InputChange('startDate')}
            required
          />
          {showErrors && !step2Data.startDate && <p className="text-red-500 text-sm mt-1">Date is required</p>}
          <Input
            type="time"
            name="scheduleTime"
            id="scheduleTime"
            className="w-1/2 h-14 p-2 border border-gray-300 rounded-lg bg-gray-100"
            value={step2Data.startTime}
            onChange={handleStep2InputChange('startTime')}
            required
          />
          {showErrors && !step2Data.startTime && <p className="text-red-500 text-sm mt-1">Time is required</p>}
        </div>
      </div>

      <div className="mb-6">
        <Label htmlFor="schedule" className="text-lg">
          When would you like to end your campaign? <span className="text-red-500">*</span>
        </Label>
        <div className="mt-2 flex gap-4">
          <Input
            type="date"
            name="scheduleDate"
            id="scheduleDate"
            className="w-1/2 h-14 p-2 border border-gray-300 rounded-lg bg-gray-100"
            value={step2Data.endDate}
            onChange={handleStep2InputChange('endDate')}
            required
          />
          {showErrors && !step2Data.endDate && <p className="text-red-500 text-sm mt-1">Date is required</p>}
          
        </div>
      </div>
      
      <div className="mb-6">
        <Label htmlFor="dataUpload" className="text-lg">Upload past campaign data (Optional)</Label>
        <Input
          type="file"
          name="dataUpload"
          id="dataUpload"
          accept=".csv"
          className="w-full h-14 mt-2 p-2 border border-gray-300 rounded-lg bg-gray-100"
          onChange={handleFileChange}
          
        />
        <p className="text-sm text-gray-500 mt-1">Accepted formats: CSV</p>
      </div>
      
    </div>
  );

  const renderStep3 = () => (
    <div className="flex-[6] overflow-y-auto h-full px-10 text-lg flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 3: Congrats!</h2>
      <audio autoPlay loop className="hidden">
        Your browser does not support the audio element.
      </audio>
      <p className="text-gray-600 mt-4">Mails have been sent!</p>
    </div>
  );

  const handleNextStep = async (direction) => {
    // Helper function to wait for a specified time
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    setCurrentStep((prevStep) => {
      const newStep = prevStep + direction;
      if (newStep < 1) return 1;

      if (prevStep === 1 && direction === 1) {
        updateEmail();
        // Use an IIFE to handle the async delay within setState
        (async () => {
          await delay(50); // Wait 5 seconds
          await getEmail();  // Then call getEmail
        })();
      }

      if (prevStep === 2 && direction === -1) {
        getEmailOriginal();
      }

      if (prevStep === 2 && direction === 1) {
        sendTimeOptim();
      }

      if (newStep > 3) return 3;
      return newStep;
    });
    setShowErrors(false);
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    setShowErrors(false); 
  };

  const generateTemplate = async () => {
    setShowErrors(true);
    if (!isStep1Valid()) {
      console.error('Please fill all required fields in Step 1');
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();
    let timerInterval = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      setLoadingTime(elapsedTime);
    }, 1000);

    try {
      const response = await fetch('/api/generate-template/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(forlgata),
      });
      const data = await response.json();
      setEmailSubject(data.Subject);
      setEmailBody(data.Body);
      setIsEmailGenerated(true);
    } catch (error) {
      console.error('Error fetching email data:', error);
      setIsEmailGenerated(false);
    } finally {
      clearInterval(timerInterval);
      setIsLoading(false);
    }
  };

  const updateEmail = async () => {
    try {
      // Function to get the CSRF token from cookies
      const getCsrfToken = () => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; csrftoken=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
      };
  
      const csrfToken = getCsrfToken();
      if (!csrfToken) {
        throw new Error('CSRF token not found in cookies');
      }
  
      console.log('Updating email with subject:', emailSubject);
      console.log('Updating email with body:', emailBody);
  
      const response = await fetch('/api/update-email/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken, // Add CSRF token header
        },
        credentials: 'include', // Ensure cookies (including csrftoken) are sent
        body: JSON.stringify({
          Subject: emailSubject,
          Body: emailBody,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update email');
      }
  
      const data = await response.json();
      console.log('Email updated successfully:', data);
    } catch (error) {
      console.error('Error updating email:', error);
      toast.error('Failed to update email. Please try again.');
    }
  };


  const getEmailOriginal = async () => {
    setIsLoading(true);
    const startTime = Date.now();
    let timerInterval = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      setLoadingTime(elapsedTime);
    }, 1000);

    try {
      const response = await fetch('/api/get-email-original/', {
        method: 'GET',
      });
      const data = await response.json();
      setEmailSubject(data.Subject);
      setEmailBody(data.Body);
      setIsEmailGenerated(true);
    } catch (error) {
      console.error('Error fetching email data:', error);
      setIsEmailGenerated(false);
    } finally {
      clearInterval(timerInterval);
      setIsLoading(false);
    }
  }

  const getEmail = async () => {
    setIsLoading(true);
    const startTime = Date.now();
    let timerInterval = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      setLoadingTime(elapsedTime);
    }, 1000);

    try {
      const response = await fetch('/api/get-email/', {
        method: 'GET',
      });
      const data = await response.json();
      setEmailSubject(data.Subject);
      setEmailBody(data.Body);
      setIsEmailGenerated(true);
    } catch (error) {
      console.error('Error fetching email data:', error);
      setIsEmailGenerated(false);
    } finally {
      clearInterval(timerInterval);
      setIsLoading(false);
    }
  }

  const sendTimeOptim = async () => {
    try {
      const response = await fetch('/api/sto/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to trigger Step 3 endpoint');
      }
      const data = await response.json();
      console.log('Step 3 GET request successful:', data);
    } catch (error) {
      console.error('Error with Step 3 GET request:', error);
    }
  }

  const fetchAndAutofillOptimalStartTime = async () => {
    try {
      const response = await fetch('/api/optimal-start-time/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) throw new Error('Failed to fetch optimal start time');
  
      const data = await response.json(); // expecting: { optimalStartDate: "2025-04-10", optimalStartTime: "10:30" }
  
      setStep2Data((prev) => ({
        ...prev,
        startDate: prev.startDate || data.optimalStartDate,
        startTime: prev.startTime || data.optimalStartTime,
      }));
  
      toast.success(
        `Optimal start time recommended: ${data.optimalStartDate} at ${data.optimalStartTime}. Feel free to change.`,
        {
          duration: 6000,
        }
      );
    } catch (error) {
      console.error('Error fetching optimal start time:', error);
      toast.error('Could not fetch recommended start time.');
    }
  };
  
  const addStep2Timings = async () => {
    if (!isStep2Valid()) {
      console.log(step2Data)
      console.error('Please fill all required fields in Step 2');
      setShowErrors(true);
      return;
    }

    const formData = new FormData();
    Object.entries(step2Data).forEach(([key, value]) => {
      if (key === 'dataUpload' && value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === 'string') {
        formData.append(key, value); 
      }
    });

    try {
      const response = await fetch('/api/send-time-instructions-template/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log('Step 2 timings added:', data);
      setIsTimeDataAdded(true);
    } catch (error) {
      console.error('Error adding Step 2 timings:', error);
    }
  };

  return (
    <div className="flex flex-col justify-start w-screen h-screen">
      <div className="h-20 flex-none">
      <NavigationMenu />
      </div>
      <div className="flex flex-auto flex-col lg:flex-row">
        <div className="w-screen lg:w-[6rem] bg-[#0F142E] flex lg:flex-col justify-center items-center py-5 space-x-6 lg:space-y-12 lg:space-x-0">
          <Button
            className={`w-16 h-16 rounded-full hover:bg-[#A3A4B3] flex items-center justify-center p-0 ${currentStep === 1 ? 'bg-[#DCDDEB] text-black' : 'bg-[#494965] text-black'}`}
            onClick={() => goToStep(1)}
          >
            {FaQuestion({ className: "!w-[40%] !h-[40%]" })}
          </Button>
          <Button
            className={`w-16 h-16 rounded-full hover:bg-[#A3A4B3] flex items-center justify-center p-0 ${currentStep === 2 ? 'bg-[#DCDDEB] text-black' : 'bg-[#494965] text-black'}`}
            onClick={() => goToStep(2)}
          >
            {FaTelegramPlane({ className: "!w-[40%] !h-[40%]" })}
          </Button>
        </div>
        <div className="h-[calc(100vh-5rem)] w-screen lg:w-6/12 p-4 lg:p-10 flex flex-row">
          <div className="w-full h-full flex flex-col">
            <div className="flex-[1] flex flex-col justify-center items-center text-xl">
              AI Enabled Template Generator
            </div>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            <div className="flex justify-center mt-6 overflow-x-scroll">
              {currentStep !== 1 && (
                <Button
                  className="text-lg lg:text-lg bg-[#0F142E] text-white p-4 md:p-6 mr-1 lg:mr-2 xl:py-[1.5rem] xl:px-[1rem] rounded-full hover:bg-[#434C7B]"
                  onClick={() => handleNextStep(-1)}
                >
                  {FaArrowLeft({})}
                  <span className="hidden xl:inline xl:ml-2">Back</span>
                </Button>
              )}
              
              {currentStep === 1 && (
                <Button
                  className="text-lg lg:text-lg bg-[#0F142E] text-white p-4 md:p-6 mr-1 lg:mr-2 xl:py-[1.5rem] xl:px-[1rem] rounded-full hover:bg-[#434C7B]"
                  onClick={generateTemplate}
                >
                  <span className="ml-2">Generate Template</span>
                </Button>
              )}
              {currentStep === 2 && (
                <Button
                  className="text-lg lg:text-lg bg-[#0F142E] text-white p-4 md:p-6 mr-1 lg:mr-2 xl:py-[1.5rem] xl:px-[1rem] rounded-full hover:bg-[#434C7B]"
                  onClick={addStep2Timings}
                >
                  <span className="ml-2">Add Timings</span>
                </Button>
              )}
              {currentStep !== 3 && (
                <Button
                  className="text-lg lg:text-lg bg-[#0F142E] text-white p-4 md:p-6 xl:py-[1.5rem] xl:px-[1rem] rounded-full hover:bg-[#434C7B]"
                  onClick={() => handleNextStep(1)}
                  disabled={(currentStep === 1 && !isEmailGenerated) || (currentStep === 2 && !isTimeDataAdded) }
                >
                  <span className="hidden xl:inline xl:mr-2">Next</span>
                  {FaArrowRight({})}
                </Button>
              )}
              
            </div>
          </div>
        </div>
        <div className="bg-[#0F142E] flex flex-col w-screen lg:w-6/12 p-4 lg:p-10 items-center justify-center h-[30rem] lg:h-full flex-auto p-10">
          {currentStep === 1 && (
            <>
              <Textarea
                className="text-lg overflow-y-hidden w-full h-[8%] p-5 pl-10 bg-white rounded-t-lg resize-none"
                name="template_subject"
                placeholder="Subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
              <Textarea
                className="text-lg w-full h-[82%] pl-10 pt-5 bg-white rounded-b-lg resize-none"
                name="template_body"
                placeholder="Body"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
              />
            </>
          )}
          
          {currentStep === 2 && (
          <>
          <div
            className="text-lg overflow-y-hidden w-full h-[8%] p-5 pl-10 rounded border-b border-gray-400 bg-white rounded-t-lg resize-none"
            dangerouslySetInnerHTML={{ __html: emailSubject }}
          />
          <div
            className="text-lg w-full h-[82%] pl-10 p-5 bg-white rounded resize-none overflow-auto"
            dangerouslySetInnerHTML={{ __html: emailBody }}
          />
        </>
        )}
          
          {isLoading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 backdrop-blur-sm transition-opacity">
              <div className="flex flex-col items-center gap-5 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform transition-all">
                <div className="relative w-16 h-16">
                  {/* Outer spinner */}
                  <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-gray-700"></div>
                  {/* Animated spinner */}
                  <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Processing Your Request
                  </h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    Elapsed time: <span className="font-mono">{loadingTime}s</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default EmailPage;