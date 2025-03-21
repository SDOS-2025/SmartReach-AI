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
  const [currentStep, setCurrentStep] = useState(1);
  const [forlgata, setForlgata] = useState({
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
  const [step2Data, setStep2Data] = useState({
    callToAction: '',
    urgency: '',
    additionalInfo: '',
  });
  const [step3Data, setStep3Data] = useState({
    scheduleDate: '',
    scheduleTime: '',
    goal: '',
    timezones: [],
    timezoneOther: '',
    behavior: '',
    dataUpload: null,
    frequency: '',
    frequencyCustom: '',
    industry: '',
    abTest: false,
  });
  const [showErrors, setShowErrors] = useState(false); // Controls error message visibility

  const handleSelectChange = (field: string) => (value: string) => {
    setForlgata((prev) => ({ ...prev, [field]: value }));
  };

  const handleTextChange = (field: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForlgata((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleStep2SelectChange = (field: string) => (value: string) => {
    setStep2Data((prev) => ({ ...prev, [field]: value }));
  };

  const handleStep2TextChange = (field: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStep2Data((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleStep3InputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setStep3Data((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleStep3SelectChange = (field: string) => (value: string) => {
    setStep3Data((prev) => ({ ...prev, [field]: value }));
  };

  const handleStep3TextChange = (field: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStep3Data((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleCheckboxChange = (field: string) => (checked: boolean) => {
    if (field === 'abTest') {
      setStep3Data((prev) => ({ ...prev, abTest: checked }));
    } else {
      setStep3Data((prev) => ({
        ...prev,
        timezones: checked
          ? [...prev.timezones, field]
          : prev.timezones.filter((tz) => tz !== field),
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStep3Data((prev) => ({ ...prev, dataUpload: e.target.files ? e.target.files[0] : null }));
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
    return step2Data.callToAction.trim() !== '' && step2Data.urgency.trim() !== '';
  };

  const isStep3Valid = () => {
    return (
      step3Data.scheduleDate.trim() !== '' &&
      step3Data.scheduleTime.trim() !== '' &&
      step3Data.goal.trim() !== '' &&
      (step3Data.timezones.length > 0 || step3Data.timezoneOther.trim() !== '') &&
      step3Data.frequency.trim() !== ''
    );
  };

  const renderStep1 = () => (
    <div className="flex-[6] overflow-y-auto h-full px-10 text-lg">
      <div className="mb-4">
        <Label htmlFor="category" className="text-lg">
          Category & Subcategory <span className="text-red-500">*</span>
        </Label>
        <Select name="category" value={forlgata.category} onValueChange={handleSelectChange('category')}>
          <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-lg">
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
          maxLength={100}
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
          {showErrors && !forlgata.customCta && <p className="text-red-500 text-sm mt-1">This field is required when "Other" is selected</p>}
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
      <div className="mb-4">
        <Label htmlFor="callToAction" className="text-lg">
          What is your call to action? <span className="text-red-500">*</span>
        </Label>
        <Select name="callToAction" value={step2Data.callToAction} onValueChange={handleStep2SelectChange('callToAction')}>
          <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-lg">
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
        {showErrors && !step2Data.callToAction && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </div>
      <div className="mb-4">
        <Label htmlFor="urgency" className="text-lg">
          How urgent is this email? <span className="text-red-500">*</span>
        </Label>
        <Select name="urgency" value={step2Data.urgency} onValueChange={handleStep2SelectChange('urgency')}>
          <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-lg">
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
        {showErrors && !step2Data.urgency && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </div>
      <div className="mb-4">
        <Label htmlFor="additionalInfo" className="text-lg">Any additional information to include?</Label>
        <Textarea
          name="additionalInfo"
          id="additionalInfo"
          placeholder="Enter Text"
          className="w-full h-20 mt-2 p-2 resize-none border border-gray-300 rounded-lg bg-gray-100"
          value={step2Data.additionalInfo}
          onChange={handleStep2TextChange('additionalInfo')}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="flex-[6] overflow-y-auto h-full px-10 text-lg">
      <div className="mb-6">
        <Label htmlFor="schedule" className="text-lg">
          When would you like to schedule your campaign? <span className="text-red-500">*</span>
        </Label>
        <div className="mt-2 flex gap-4">
          <Input
            type="date"
            name="scheduleDate"
            id="scheduleDate"
            className="w-1/2 h-14 p-2 border border-gray-300 rounded-lg bg-gray-100"
            value={step3Data.scheduleDate}
            onChange={handleStep3InputChange('scheduleDate')}
            required
          />
          {showErrors && !step3Data.scheduleDate && <p className="text-red-500 text-sm mt-1">Date is required</p>}
          <Input
            type="time"
            name="scheduleTime"
            id="scheduleTime"
            className="w-1/2 h-14 p-2 border border-gray-300 rounded-lg bg-gray-100"
            value={step3Data.scheduleTime}
            onChange={handleStep3InputChange('scheduleTime')}
            required
          />
          {showErrors && !step3Data.scheduleTime && <p className="text-red-500 text-sm mt-1">Time is required</p>}
        </div>
      </div>
      <div className="mb-6">
        <Label htmlFor="goal" className="text-lg">
          What is your primary goal for send-time optimization? <span className="text-red-500">*</span>
        </Label>
        <Select name="goal" value={step3Data.goal} onValueChange={handleStep3SelectChange('goal')}>
          <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-lg">
            <SelectValue placeholder="Select a goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open-rates">Maximize open rates</SelectItem>
            <SelectItem value="click-through">Increase click-through rates</SelectItem>
            <SelectItem value="conversions">Drive conversions (e.g., sales, sign-ups)</SelectItem>
            <SelectItem value="engagement">Boost overall engagement</SelectItem>
          </SelectContent>
        </Select>
        {showErrors && !step3Data.goal && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </div>
      <div className="mb-6">
        <Label className="text-lg">
          Which timezone(s) does your audience reside in? (Select at least one) <span className="text-red-500">*</span>
        </Label>
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="tz-america"
              name="timezone"
              value="America/New_York"
              className="w-5 h-5 border border-gray-400 rounded-sm bg-white data-[state=checked]:bg-blue-500"
              checked={step3Data.timezones.includes('America/New_York')}
              onCheckedChange={handleCheckboxChange('America/New_York')}
            />
            <Label htmlFor="tz-america">America (e.g., EST, PST)</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="tz-europe"
              name="timezone"
              value="Europe/London"
              className="w-5 h-5 border border-gray-400 rounded-sm bg-white data-[state=checked]:bg-blue-500"
              checked={step3Data.timezones.includes('Europe/London')}
              onCheckedChange={handleCheckboxChange('Europe/London')}
            />
            <Label htmlFor="tz-europe">Europe (e.g., GMT, CET)</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="tz-asia"
              name="timezone"
              value="Asia/Tokyo"
              className="w-5 h-5 border border-gray-400 rounded-sm bg-white data-[state=checked]:bg-blue-500"
              checked={step3Data.timezones.includes('Asia/Tokyo')}
              onCheckedChange={handleCheckboxChange('Asia/Tokyo')}
            />
            <Label htmlFor="tz-asia">Asia (e.g., IST, JST)</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="tz-other"
              name="timezone"
              value="other"
              className="w-5 h-5 border border-gray-400 rounded-sm bg-white data-[state=checked]:bg-blue-500"
              checked={step3Data.timezones.includes('other')}
              onCheckedChange={handleCheckboxChange('other')}
            />
            <Label htmlFor="tz-other">Other (specify below)</Label>
          </div>
          <Input
            type="text"
            name="timezoneOther"
            placeholder="Enter custom timezone (e.g., Australia/Sydney)"
            className="w-full h-12 mt-2 p-2 border border-gray-300 rounded-lg bg-gray-100"
            value={step3Data.timezoneOther}
            onChange={handleStep3InputChange('timezoneOther')}
          />
          {showErrors && step3Data.timezones.length === 0 && !step3Data.timezoneOther && (
            <p className="text-red-500 text-sm mt-1">At least one timezone is required</p>
          )}
        </div>
      </div>
      <div className="mb-6">
        <Label htmlFor="behavior" className="text-lg">When is your audience most active? (Optional)</Label>
        <Textarea
          name="behavior"
          id="behavior"
          placeholder="e.g., weekday mornings, weekend evenings"
          className="w-full h-20 mt-2 p-2 border border-gray-300 resize-none rounded-lg bg-gray-100"
          value={step3Data.behavior}
          onChange={handleStep3TextChange('behavior')}
        />
      </div>
      <div className="mb-6">
        <Label htmlFor="dataUpload" className="text-lg">Upload past campaign data (Optional)</Label>
        <Input
          type="file"
          name="dataUpload"
          id="dataUpload"
          accept=".csv,.pdf,.txt"
          className="w-full h-14 mt-2 p-2 border border-gray-300 rounded-lg bg-gray-100"
          onChange={handleFileChange}
        />
        <p className="text-sm text-gray-500 mt-1">Accepted formats: CSV, PDF, TXT</p>
      </div>
      <div className="mb-6">
        <Label htmlFor="frequency" className="text-lg">
          How often will this campaign run? <span className="text-red-500">*</span>
        </Label>
        <Select name="frequency" value={step3Data.frequency} onValueChange={handleStep3SelectChange('frequency')}>
          <SelectTrigger className="w-full h-14 mt-2 bg-gray-100 p-2 border border-gray-300 rounded-lg">
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
        {showErrors && !step3Data.frequency && <p className="text-red-500 text-sm mt-1">This field is required</p>}
        <Input
          type="text"
          name="frequencyCustom"
          placeholder="e.g., Every 3 days"
          className="w-full h-12 mt-2 p-2 border border-gray-300 rounded-lg bg-gray-100"
          value={step3Data.frequencyCustom}
          onChange={handleStep3InputChange('frequencyCustom')}
        />
      </div>
      <div className="mb-6">
        <Label htmlFor="industry" className="text-lg">What industry or audience segment are you targeting?</Label>
        <Input
          type="text"
          name="industry"
          id="industry"
          placeholder="e.g., e-commerce, B2B, healthcare"
          className="w-full h-14 mt-2 p-2 border border-gray-300 rounded-lg bg-gray-100"
          value={step3Data.industry}
          onChange={handleStep3InputChange('industry')}
        />
      </div>
      <div className="mb-6">
        <Label className="text-lg">Enable A/B testing for send times?</Label>
        <div className="mt-2 flex items-center gap-2">
          <Checkbox
            id="abTest"
            name="abTest"
            className="w-5 h-5 border border-gray-400 rounded-sm bg-white data-[state=checked]:bg-blue-500"
            checked={step3Data.abTest}
            onCheckedChange={handleCheckboxChange('abTest')}
          />
          <Label htmlFor="abTest">Yes, split my audience to test two send times</Label>
        </div>
      </div>
    </div>
  );

  const handleNextStep = (direction: number) => {
    setCurrentStep((prevStep) => {
      const newStep = prevStep + direction;
      if (newStep < 1) return 1;
      if (newStep > 3) return 3;
      return newStep;
    });
    setShowErrors(false); // Reset error visibility on step change
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    setShowErrors(false); // Reset error visibility on step change
  };

  const subjectRef = useRef<HTMLTextAreaElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const generateTemplate = async () => {
    setShowErrors(true);
    if (!isStep1Valid()) {
      console.error('Please fill all required fields in Step 1');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/generate-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(forlgata),
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

  const addStep2Data = async () => {
    setShowErrors(true);
    if (!isStep2Valid()) {
      console.error('Please fill all required fields in Step 2');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/generate-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(step2Data),
      });
      const data = await response.json();
      console.log('Step 2 data added:', data);
    } catch (error) {
      console.error('Error adding Step 2 data:', error);
    }
  };

  const addStep3Timings = async () => {
    setShowErrors(true);
    if (!isStep3Valid()) {
      console.error('Please fill all required fields in Step 3');
      return;
    }

    const formData = new FormData();
    Object.entries(step3Data).forEach(([key, value]) => {
      if (key === 'dataUpload' && value) {
        formData.append(key, value);
      } else if (key === 'timezones') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    try {
      const response = await fetch('http://localhost:8000/api/generate-template', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log('Step 3 timings added:', data);
    } catch (error) {
      console.error('Error adding Step 3 timings:', error);
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
            {FaDatabase({ className: "!w-[40%] !h-[40%]" })}
          </Button>
          <Button
            className={`w-16 h-16 rounded-full hover:bg-[#A3A4B3] flex items-center justify-center p-0 ${currentStep === 3 ? 'bg-[#DCDDEB] text-black' : 'bg-[#494965] text-black'}`}
            onClick={() => goToStep(3)}
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
              <Button
                className="text-lg lg:text-lg bg-[#0F142E] text-white p-4 md:p-6 mr-1 lg:mr-2 xl:py-[1.5rem] xl:px-[1rem] rounded-full hover:bg-[#434C7B]"
                onClick={() => handleNextStep(-1)}
              >
                {FaArrowLeft({})}
                <span className="hidden xl:inline xl:ml-2">Back</span>
              </Button>
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
                  onClick={addStep2Data}
                >
                  <span className="ml-2">Add Data</span>
                </Button>
              )}
              {currentStep === 3 && (
                <Button
                  className="text-lg lg:text-lg bg-[#0F142E] text-white p-4 md:p-6 mr-1 lg:mr-2 xl:py-[1.5rem] xl:px-[1rem] rounded-full hover:bg-[#434C7B]"
                  onClick={addStep3Timings}
                >
                  <span className="ml-2">Add Timings</span>
                </Button>
              )}
              <Button
                className="text-lg lg:text-lg bg-[#0F142E] text-white p-4 md:p-6 xl:py-[1.5rem] xl:px-[1rem] rounded-full hover:bg-[#434C7B]"
                onClick={() => handleNextStep(1)}
              >
                <span className="hidden xl:inline xl:mr-2">Next</span>
                {FaArrowRight({})}
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-[#0F142E] flex flex-col items-center justify-center h-[30rem] lg:h-full flex-auto p-10">
          <Textarea
            className="text-lg overflow-y-hidden w-full h-[8%] p-5 pl-10 bg-white rounded-t-lg resize-none"
            name="template_subject"
            placeholder="Subject"
            ref={subjectRef}
          />
          <Textarea
            className="text-lg w-full h-[82%] pl-10 pt-5 bg-white rounded-b-lg resize-none"
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