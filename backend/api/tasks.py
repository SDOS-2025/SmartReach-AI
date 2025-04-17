from celery import shared_task
from django.core.mail import get_connection, EmailMultiAlternatives
from django.utils.timezone import now
from .models import Organization, CompanyUserEngagement, CompanyUser, CampaignDetails,User
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=5, max_retries=3)
def send_scheduled_email(self, organization_id, campaign_id, user_email, subject, message, company_link):
    try:
        # Fetch organization and related instances
        organization = Organization.objects.get(org_id_id=organization_id)
        name = User.objects.get(user_id=organization_id).username
        user = CompanyUser.objects.get(email=user_email)
        campaign = CampaignDetails.objects.get(campaign_id=campaign_id)

        # Tracking URLs
        tracking_url = f"http://localhost:8000/api/track-click?email={user_email}&organization={organization_id}&campaign={campaign_id}&company_link={company_link}"
        open_url = f"http://localhost:8000/api/track-open?email={user_email}&organization={organization_id}&campaign={campaign_id}"

        # Ensure message is a string
        message = str(message)
        text_body = f"{message}\n\nClick here to learn more: {tracking_url}"

        # HTML template
        html_body = f"""
        <!DOCTYPE html>
        <html lang="en">
        <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #ffffff; line-height: 1.6;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff;">
                <tr>
                    <td align="center">
                        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; padding: 20px 0;">
                            <tr>
                                <td style="padding: 20px 0; text-align: center;">
                                    <h1 style="margin: 0; font-size: 28px; color: #222222; font-weight: bold;">{subject}</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 20px;">
                                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 0;">
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 20px; color: #333333; font-size: 16px;">
                                    <p style="margin: 0 0 20px;">{message}</p>
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 20px auto;">
                                        <tr>
                                            <td style="text-align: center;">
                                                <a href="{tracking_url}" target="_blank" 
                                                   style="display: inline-block; padding: 14px 30px; background-color: #ff5733; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
                                                    Shop Now
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 20px;">
                                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 0;">
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 20px; text-align: center; font-size: 12px; color: #666666;">
                                    <p style="margin: 0 0 10px;">You’re receiving this email because you subscribed to {name} updates.</p>
                                    <p style="margin: 10px 0 0;">©️ 2025 {name}. All rights reserved.</p>
                                    <!-- Tracking Pixel -->
                                    <img src="{open_url}" width="1" height="1" alt="" style="display:block!important;max-height:0px!important;max-width:0px!important;overflow:hidden!important;opacity:0!important;position:absolute!important;" />
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """

        connection = get_connection(
            backend="django.core.mail.backends.smtp.EmailBackend",
            host=organization.email_host,
            port=organization.email_port,
            username=organization.email_host_user,
            password=organization.email_host_password,
            use_tls=organization.email_use_tls,
        )

        user_email_ = user_email
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
        raise