from celery import shared_task
from django.core.mail import get_connection, EmailMultiAlternatives
from django.utils.timezone import now
from .models import Organization, CompanyUserEngagement, CompanyUser, CampaignDetails
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=5, max_retries=3)
def send_scheduled_email(self, organization_id, campaign_id, user_email, subject, message):
    try:
        # Fetch organization and related instances
        print(organization_id,campaign_id,user_email)
        organization = Organization.objects.get(org_id_id=organization_id)
        user = CompanyUser.objects.get(email=user_email)
        campaign = CampaignDetails.objects.get(campaign_id=campaign_id)
        print(user)
        # Tracking URL
        tracking_url = f"http://localhost:8000/api/track-click?email={user_email}&organization={organization_id}&campaign={campaign_id}"

        # Ensure message is a string
        message = str(message)
        text_body = f"{message}\n\nClick here to learn more: {tracking_url}"

        # HTML-formatted message
        paragraphs = message.split('\n\n')
        html_message = ''.join('<p>' + p.replace("\n", "<br>") + '</p>' for p in paragraphs)
        html_body = f"""
        <html>
          <body>
            {html_message}
            <p>
              <a href="{tracking_url}">Click here to learn more</a>
            </p>
          </body>
        </html>
        """

        # Email connection
        connection = get_connection(
            backend="django.core.mail.backends.smtp.EmailBackend",
            host=organization.email_host,
            port=organization.email_port,
            username=organization.email_host_user,
            password=organization.email_host_password,
            use_tls=organization.email_use_tls,
        )

        # Send email
        user_email_ = 'rahul.omalur14@gmail.com'
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_body,
            from_email=organization.email_host_user,
            to=[user_email_],
            connection=connection
        )
        email.attach_alternative(html_body, "text/html")
        email.send()

        # Log success in CompanyUserEngagement
        CompanyUserEngagement.objects.create(
            user_id=user,
            campaign_id=campaign,
            org_id=organization,
            send_time=now(),
            open_time=None,
            click_time=None,
            engagement_delay=0.0
        )

        logger.info(f"Email successfully sent to {user_email} from {organization.email_host_user}")
        return f"Email successfully sent to {user_email} from {organization.email_host_user}"

    except Organization.DoesNotExist:
        logger.error(f"Organization {organization_id} not found")
        raise
    except CompanyUser.DoesNotExist:
        logger.error(f"User {user_email} not found")
        raise
    except CampaignDetails.DoesNotExist:
        logger.error(f"Campaign {campaign_id} not found")
        raise
    except Exception as e:
        logger.error(f"Error sending email to {user_email}: {str(e)}")
        raise  # Re-raise for Celery retry