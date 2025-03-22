from .oauth_settings import gemma_key
from openai import OpenAI
import requests

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
        email_structure: str):
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
        self.max_attempts = 3

    
    def generate_marketing_email_prompt(self) -> str:
        """
        Generate a prompt for an AI email content generator tailored for marketing campaign emails.
        Returns:
            str: A formatted prompt for the LLM to generate a marketing campaign email.
        """
        # Define length constraints for clarity
        length_map = {
            "Short": "under 100 words",
            "Medium": "100 to 200 words",
            "Long": "over 200 words"
        }
        length_instruction = length_map.get(self.preferred_length, "100 to 200 words")  # Default to Medium if invalid

        # Construct the marketing-focused prompt
        prompt = (
            "You are an expert Marketing Copywriter tasked with crafting a highly effective plain text email for a marketing campaign. "
            "Your goal is to strictly adhere to the provided attributes and instructions to generate a finalized email without placeholders or extraneous details, "
            "while ensuring the use of specific tags and mandatory placeholders.\n\n"

            "Attributes:\n"
            f"- Target industry: '{self.category_subcategory}'.\n"
            f"- Tone: '{self.tone}' (e.g., Friendly is warm and casual, Professional is polished and formal).\n"
            f"- Email structure: '{self.email_structure}' (e.g., Promotional, Newsletter, Event Invite) with '{self.content_type}' content.\n"
            f"- Brand identity: '{self.company_description}'.\n"
            f"- Purpose: '{self.email_purpose}'.\n"
            f"- Audience: '{self.audience_type}' (e.g., Subscribed Customers for loyalty focus, Open-Source Audience for community appeal).\n"
            f"- Length: '{self.preferred_length}', meaning {length_instruction}.\n"
            f"- Call-to-action (CTA): '{self.cta}'.\n\n"

            "Instructions:\n"
            "- **Include the following mandatory placeholders**:\n"
            "    - Salutation: Use '[recipient_name]' as a placeholder for the recipient’s name in the greeting (e.g., 'Hey [recipient_name],' or 'Dear [recipient_name],').\n"
            "    - Sign-off: Use '[company_name]' as a placeholder for the company's name in the salutation 'Regards,\n[company_name]'.\n\n"

            "- **Format the email using specific tags**:\n"
            "    - The subject line must be enclosed between `<S>` and `</S>` tags.\n"
            "    - The email body must be enclosed between `<B>` and `</B>` tags.\n\n"

            "- **Email guidelines**:\n"
            "    - Lead with the core marketing message tied to '{email_purpose}' (e.g., discount, product launch).\n"
            "    - Follow the '{email_structure}' format: Promotional emails highlight benefits and urgency, Newsletters mix value and promotion, Event Invites build excitement.\n"
            "    - Integrate '{company_description}' to reinforce brand trust.\n"
            "    - Use persuasive, '{category_subcategory}'-specific language to resonate with the audience.\n"
            "    - Make '{cta}' urgent and actionable (e.g., 'Shop now before it’s gone!').\n"
            "    - Maintain a consistent '{tone}' throughout.\n"
            
            "- **Do not include placeholders, product details, or assumptions beyond the attributes provided.** Work strictly with the given information.\n\n"

            "- Generate a finalized plain text email with the proper subject and body tags, including the required placeholders '[recipient_name]' and '[company_name]'."
        )



        return prompt
    
    def generate_email_content(self,prompt: str) -> str:
        """
        Generate email content using google/gemma-3-27b-it via OpenRouter API.

        Args:
            prompt (str): The input prompt (e.g., from generate_marketing_email_prompt).

        Returns:
            str: AI-generated email content.
        """
        client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=gemma_key,
        )

        completion = client.chat.completions.create(
        extra_headers={
            "HTTP-Referer": "<YOUR_SITE_URL>", # Optional. Site URL for rankings on openrouter.ai.
            "X-Title": "<YOUR_SITE_NAME>", # Optional. Site title for rankings on openrouter.ai.
        },
        extra_body={},
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

    def parse_email_content(self, email_string):
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

        result = {"Subject":subject, "Body":body}
        return result
        
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