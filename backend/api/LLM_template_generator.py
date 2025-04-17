from .oauth_settings import gemma_key, server_ip, server_port, groq_api_key, google_api_key, oopspam_key

# LangChain Core
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableLambda, Runnable
from langchain_core.output_parsers import StrOutputParser
from langchain.schema import Document

# LangChain Community integrations
from langchain_community.chat_models import ChatOpenAI
from langchain_community.llms import HuggingFacePipeline, OpenAI
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings, OpenAIEmbeddings
from langchain_community.document_loaders import TextLoader

# LangChain Utility modules
from langchain.prompts import ChatPromptTemplate
from langchain.chains import RetrievalQA
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Transformers
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline, BitsAndBytesConfig
import torch
import gc

# External APIs
from huggingface_hub import login
import requests

# Typing
from typing import List, Dict

class TemplateGenerator:
    def __init__(self,
        category_subcategory: str,
        tone: str,
        content_type: str,
        company_description: str,
        email_purpose: str,
        audience_type: str,
        preferred_length: str,
        cta: str,
        email_structure: str,
        use_rag = False, 
        vector_db_path = None):
        """
        Args:
            category_subcategory (str): Category and subcategory (e.g., 'E-commerce', 'SaaS')
            tone (str): Tone of the email (e.g., 'Friendly', 'Professional')
            content_type (str): Type of content (e.g., 'Promotional', 'Product Launch')
            company_description (str): Short company intro (up to 100 words)
            email_purpose (str): Marketing goal of the email (up to 100 words)
            audience_type (str): Target audience (e.g., 'Subscribed Customers', 'Open-Source Audience')
            preferred_length (str): Length (e.g., 'Short', 'Medium', 'Long')
            cta (str): Call-to-action (e.g., 'Buy Now', 'Sign Up')
            email_structure (str): Structure (e.g., 'Promotional', 'Newsletter')
        """
        self.category_subcategory = category_subcategory
        self.tone = tone
        self.content_type = content_type
        self.email_purpose = email_purpose
        self.company_description = company_description
        self.audience_type = audience_type
        self.preferred_length = preferred_length
        self.cta = cta
        self.email_structure = email_structure
        self.threshold = 5
        self.max_attempts = 1
        self.use_rag = use_rag
        self.vector_db_path = vector_db_path
        self.local_llm_loaded = False
        self.local_llm = None
        self.local_tokenizer = None
        if self.use_rag:
            self.init_rag()


    def init_rag(self):
        print("Initializing RAG pipeline...")
        embeds = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        self.vectorstore = FAISS.load_local(self.vector_db_path, embeddings)
        model_name = "TheBloke/Mistral-7B-Instruct-v0.1-GGUF"  # Example local model
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForCausalLM.from_pretrained(model_name)

        # Create text generation pipeline
        hf_pipeline = pipeline(
            "text-generation",
            model=model,
            tokenizer=tokenizer,
            max_new_tokens=512,
            do_sample=True,
            top_p=0.95,
            temperature=0.7
        )

        local_llm = HuggingFacePipeline(pipeline=hf_pipeline)
        self.rag_chain = RetrievalQA.from_chain_type(
            llm = local_llm,
            retrievier = self.vectorstore.as_retrievier(),
            return_score_documents = True
        )

    def generate_marketing_email_prompt(self):    
        """
        Generate a structured ChatPromptTemplate for an AI email content generator tailored for marketing campaigns.
        Returns:
            ChatPromptTemplate: A LangChain template ensuring separate subject and body output.
        """
        # Define length constraints
        length_map = {
            "Short": "under 100 words",
            "Medium": "100 to 200 words",
            "Long": "over 200 words"
        }
        length_instruction = length_map.get(self.preferred_length, "100 to 200 words")

        # System prompt: Define the role and rules
        system_prompt = (
            "You are an expert Marketing Copywriter tasked with crafting a highly effective plain text email for a marketing campaign. "
            "Your goal is to generate a finalized email with a subject line and body, adhering strictly to the provided attributes and instructions. "
            "Use the following guidelines:\n\n"
            "- Include mandatory placeholders: '[recipient_name]' in the greeting (e.g., 'Hey [recipient_name],') and '[company_name]' in the sign-off (e.g., 'Regards,\n[company_name]').\n"
            "- Format the email with tags: subject between `<S>` and `</S>`, body between `<B>` and `</B>`.\n"
            "- Lead with the core marketing message tied to the email purpose.\n"
            "- Follow the specified email structure (e.g., Promotional: highlight benefits and urgency; Newsletter: mix value and promotion).\n"
            "- Integrate the company description to reinforce brand trust.\n"
            "- Use persuasive, industry-specific language for the target audience.\n"
            "- Make the call-to-action urgent and actionable.\n"
            "- Maintain the specified tone consistently.\n"
            "- Do not include extra comments or assumptions beyond the provided attributes.\n"
            "If spam-proofing context is provided, use it to avoid spam triggers (e.g., excessive caps, spammy phrases)."
        )

        # User prompt: Provide attributes and request structured output
        user_prompt = (
            "Generate a marketing email based on these attributes:\n"
            "- Target industry: {category_subcategory}\n"
            "- Tone: {tone} (e.g., Friendly is warm and casual, Professional is polished and formal)\n"
            "- Email structure: {email_structure} with {content_type} content\n"
            "- Brand identity: {company_description}\n"
            "- Purpose: {email_purpose}\n"
            "- Audience: {audience_type}\n"
            "- Length: {preferred_length}, meaning {length_instruction}\n"
            "- Call-to-action (CTA): {cta}\n\n"
            "Optional spam-proofing context from vector DB (use if provided): {rag_context}\n\n"
            "Output the email in this exact format:\n"
            "<S>subject line here</S>\n"
            "<B>email body here</B>"
        )

        # Create the ChatPromptTemplate
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("user", user_prompt)
        ])

        return prompt_template.format(
            category_subcategory=self.category_subcategory,
            tone=self.tone,
            email_structure=self.email_structure,
            content_type=self.content_type,
            company_description=self.company_description,
            email_purpose=self.email_purpose,
            audience_type=self.audience_type,
            preferred_length=self.preferred_length,
            length_instruction=length_instruction,
            cta=self.cta,
            rag_context="" if not self.use_rag else "{rag_context_placeholder}"  # Placeholder for RAG
        )
    
    def generate_email_content(self, prompt: str) -> str:
        """
        Generate email content using RAG with multiple API fallbacks.
        Tries APIs in this order:
        1. Google AI Studio (Gemini 2.0 Flash)
        2. OpenRouter (gemma-3-27b-it:free)
        3. Groq AI (llama-4-scout-17b)
        
        Retrieval is performed using FAISS vector DB for relevant context.
        """
        if self.use_rag:
            print("Retrieving context using RAG...")
            rag_result = self.rag_chain.run(prompt)
            print("Retrieved context:", rag_result)
            prompt = f"""Use the following context to write a spam-proof engaging email:\n\n{rag_result}\n\nPrompt: {prompt}"""
        else:
            print("Warning: RAG pipeline not initialized. Using raw prompt.")

        # Try Google AI Studio (Gemini 2.0 Flash) first
        try:
            from google import genai
            client = genai.Client(api_key=google_api_key)
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt
            )
            return response.text
        except Exception as e:
            print(f"Google AI Studio API failed: {str(e)}")

        # Fallback to OpenRouter (gemma-3-27b-it:free)
        try:
            from openai import OpenAI
            client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=gemma_key,
            )
            completion = client.chat.completions.create(
                extra_headers={
                    "HTTP-Referer": "<YOUR_SITE_URL>",
                    "X-Title": "<YOUR_SITE_NAME>",
                },
                model="google/gemma-3-27b-it:free",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": prompt,
                            }
                        ]
                    }
                ]
            )
            return completion.choices[0].message.content
        except Exception as e:
            print(f"OpenRouter API failed: {str(e)}")

        # Fallback to Groq AI (llama-4-scout-17b)
        try:
            from groq import Groq
            client = Groq(api_key=groq_api_key)
            completion = client.chat.completions.create(
                model="meta-llama/llama-4-scout-17b-16e-instruct",
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
            return completion.choices[0].message.content
        except Exception as e:
            print(f"Groq AI API failed: {str(e)}. All API attempts exhausted.")
        
        email_template = {
            'Subject': 'Boost Your Email Campaigns with SmartReach AI 🚀',
            'Body': """
Hi [recipient_name],

I hope you’re doing well!

I wanted to introduce you to SmartReach AI, a tool designed to optimize email campaigns with:
✅ AI-driven personalized email generation
✅ Optimal send-time prediction for higher engagement
✅ Real-time analytics & compliance with the Indian DPDP Act

Would you be open to a quick chat this week to explore how SmartReach AI can enhance your email marketing efforts?

Looking forward to your thoughts!

Best regards,
[company_name]
"""
        }
        return email_template


    def get_spam_score(self, email_content):
        """
        Get the spam score for the given email content using the Postmark Spam Check API.
        Prints the spam score and returns it.
        
        Args:
            email_content (str): The email text to check for spam.
        
        Returns:
            dict or None: The spam score details if successful, None if the request fails.
        """
        
        url = "https://spamcheck.postmarkapp.com/filter"
        
        headers = {
            "Content-Type": "application/json"
        }
        
        # Postmark expects raw email content with headers
        payload = {
            "email": email_content,
            "options": "long"  # "long" for detailed results, "short" for only the score
        }
        
        try:
            response = requests.post(url, json=payload, headers=headers)
            
            if response.status_code == 200:
                result = response.json()
                
                spam_score = result.get("score")
                spam_report = result.get("report")
                
                print(f"\n Spam Score: {spam_score}")
                print(f"Report:\n{spam_report}")
                
                return {
                    "score": spam_score,
                    "report": spam_report
                }
            
            else:
                print(f"Error: {response.status_code} - {response.text}")
                return None
        
        except requests.exceptions.RequestException as e:
            print(f"Exception during API call: {e}")
            return None

    def parse_email_content(self, email_string: str) -> dict:
        """
        Parse email content into subject and body, ensuring \n after 'Hey [recipient_name],' and before 'Regards,'.
        Args:
            email_string (str): Raw email content with <S> and <B> tags.
        Returns:
            dict: {"Subject": str, "Body": str} with formatted body.
        """
        subject_start = "<S>"
        subject_end = "</S>"
        body_start = "<B>"
        body_end = "</B>"

        subject = ""
        body = ""

        # Extract Subject
        sub_start_idx = email_string.find(subject_start)
        sub_end_idx = email_string.find(subject_end)
        if sub_start_idx != -1 and sub_end_idx != -1:
            subject = email_string[sub_start_idx + len(subject_start):sub_end_idx].strip()

        # Extract Body
        body_start_idx = email_string.find(body_start)
        body_end_idx = email_string.find(body_end)
        if body_start_idx != -1 and body_end_idx != -1:
            body = email_string[body_start_idx + len(body_start):body_end_idx].strip()

            # Step 1: Ensure \n after 'Hey [recipient_name],'
            greeting = "Hey [recipient_name],"
            if body.startswith(greeting):
                body = body.replace(greeting, f"{greeting}\n", 1)

            # Step 2: Ensure \n before 'Regards,' and \n before '[company_name]'
            regards = "Regards,"
            company_name = "[company_name]"
            if regards in body:
                # Replace 'Regards,' with 'Regards,\n' (only the last occurrence to avoid mid-text issues)
                parts = body.rsplit(regards, 1)
                if len(parts) > 1:
                    body = f"{parts[0]}{regards}\n{parts[1]}"
                # Ensure '[company_name]' is on a new line
                body = body.replace(f"{regards}\n{company_name}", f"{regards}\n{company_name}")
                body = body.replace(f"{regards} {company_name}", f"{regards}\n{company_name}")

            # Step 3: Clean up any double newlines or trailing whitespace
            body = '\n'.join(line.strip() for line in body.split('\n') if line.strip())
            body = body.strip()

        return {"Subject": subject, "Body": body}

    def generate(self):
        prompt = self.generate_marketing_email_prompt()
        email_content = self.generate_email_content(prompt)
        for attempt in range(1, self.max_attempts + 1):
            print(email_content)
            spam_return = self.get_spam_score(email_content)
            spam_score = float(spam_return["score"])
            spam_report = spam_return["report"]
            if spam_score is None:
                print("Failed to get spam score")
                break
            if spam_score < self.threshold:
                print("Pass")
                break
            elif attempt < self.max_attempts:
                print(f"Spam score too high ({spam_score}), refining prompt...")
                revision_prompt = f"Here is an email that was flagged as spam:\n\n{email_content}\n. Refine the email following: {prompt}"
                email_content = self.generate_email_content(revision_prompt)
            else:
                print(f"Unable to generate non-spammy email after {self.max_attempts} attempts.")
        
        result = self.parse_email_content(email_content)
        return result