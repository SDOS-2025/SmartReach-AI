"use client";
import React, { useState } from 'react';
import NavigationMenu from '../components/NavigationMenu';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaCode, FaEye, FaCopy } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';


function EmailPage() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    }
  }, []);
  
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


  const [viewMode, setViewMode] = useState<'RAW' | 'HTML'>('RAW');
  

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

  const handleToggleView = async () => {
    // Check if email is generated
    if (!isEmailGenerated) {
      toast.error('Please generate an email first.');
      return;
    }

    const newMode = viewMode === 'RAW' ? 'HTML' : 'RAW';
    setViewMode(newMode);
    setIsLoading(true);

    try {
      if (newMode === 'HTML') {
        await updateEmail();
        // Add 100ms delay before getEmail
        await new Promise((resolve) => setTimeout(resolve, 100));
        await getEmail();
      } else {
        await getEmailOriginal();
      }
    } catch (error) {
      console.error('Error toggling view:', error);
      toast.error('Failed to switch view. Please try again.');
      // Revert to previous mode on error
      setViewMode(viewMode);
    } finally {
      setIsLoading(false);
    }
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
      setViewMode("RAW")
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
    //   const getCsrfToken = () => {
    //     const value = `; ${document.cookie}`;
    //     const parts = value.split(`; csrftoken=`);
    //     if (parts.length === 2) return parts.pop().split(';').shift();
    //     return null;
    //   };
  
    //   const csrfToken = getCsrfToken();
    //   if (!csrfToken) {
    //     throw new Error('CSRF token not found in cookies');
    //   }
  
      console.log('Updating email with subject:', emailSubject);
      console.log('Updating email with body:', emailBody);
  
      const response = await fetch('/api/update-email/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        //   'X-CSRFToken': csrfToken, // Add CSRF token header
        },
        // credentials: 'include', // Ensure cookies (including csrftoken) are sent
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

  const copyHtmlToClipboard = () => {
    if (!isEmailGenerated) {
      toast.error('Please generate an email first.');
      return;
    }
    
    if (viewMode !== 'HTML') {
      toast.error('Switch to HTML view to copy HTML content.');
      return;
    }
    
    try {
      navigator.clipboard.writeText(emailBody);
      toast.success('HTML copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy HTML:', error);
      toast.error('Failed to copy to clipboard. Please try again.');
    }
  };
  

  return (
    <div className="flex flex-col justify-start w-screen h-screen">
      <div className="h-20 flex-none">
        <NavigationMenu />
      </div>
      <div className="flex flex-auto flex-col lg:flex-row">
        {/* Left Panel (unchanged) */}
        <div className="h-[calc(100vh-5rem)] w-screen lg:w-6/12 p-4 lg:p-10 flex flex-row">
          <div className="w-full h-full flex flex-col">
            <div className="flex-[1] flex flex-col justify-center items-center text-xl">
              AI Enabled Template Generator
            </div>
            {renderStep1()}
            <div className="flex justify-center mt-6 overflow-x-scroll">
              <Button
                className="text-lg lg:text-lg bg-[#0F142E] text-white p-4 md:p-6 mr-1 lg:mr-2 xl:py-[1.5rem] xl:px-[1rem] rounded-full hover:bg-[#434C7B]"
                onClick={generateTemplate}
              >
                <span className="ml-2">Generate Template</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel (Updated) */}
        <div className="bg-[#0F142E] flex flex-col w-screen lg:w-6/12 p-4 lg:p-10 items-center justify-center h-[30rem] lg:h-full flex-auto p-10">
          <div className="w-full h-full flex flex-col">
            <Textarea
              className="text-lg overflow-y-hidden w-full h-[8%] p-5 pl-10 bg-white rounded-t-lg resize-none"
              name="template_subject"
              placeholder="Subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
            />
            {viewMode === 'RAW' ? (
              <Textarea
                className="text-lg w-full h-[82%] pl-10 pt-5 bg-white rounded-b-lg resize-none"
                name="template_body"
                placeholder="Body"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
              />
            ) : (
              <div
                className="text-lg w-full h-[76%] pl-10 pt-5 bg-white rounded-b-lg overflow-scroll"
                dangerouslySetInnerHTML={{ __html: emailBody }}
              />
            )}
            <div className="mt-2 flex justify-between items-center">
              <label className="inline-flex items-center cursor-pointer">
                <span className="mr-3 text-white text-lg">Text</span>
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={viewMode === 'HTML'}
                  onChange={handleToggleView}
                  disabled={!isEmailGenerated}
                />
                <div
                  className={`relative w-11 h-6 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-blue-600 ${
                    isEmailGenerated ? 'bg-gray-200' : 'bg-gray-400 cursor-not-allowed'
                  }`}
                ></div>
                <span className="ml-3 text-white text-lg">HTML</span>
              </label>
              <Button
                className={`ml-4 text-sm flex items-center gap-1 ${
                  viewMode === 'HTML' && isEmailGenerated 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                onClick={copyHtmlToClipboard}
                disabled={viewMode !== 'HTML' || !isEmailGenerated}
              >
                <FaCopy className="mr-1" />
                Copy HTML
              </Button>
            </div>
          </div>

          {isLoading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 backdrop-blur-sm transition-opacity">
              <div className="flex flex-col items-center gap-5 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform transition-all">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-gray-700"></div>
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