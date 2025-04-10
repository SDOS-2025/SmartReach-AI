from .oauth_settings import gemma_key, server_ip, server_port
import requests



def generate_content(data):
    try:
        url = f"http://{server_ip}:{server_port}/generate-email"
        response = requests.post(url, json = data)
        if response.status_code == 200:
            result = response.json()
            return result
        else:
            print("❌ Error:", response.status_code, response.text)
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
    except:
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