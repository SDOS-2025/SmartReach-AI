from celery import shared_task
from django.core.mail import send_mail, get_connection
from django.utils.timezone import now
from django.urls import reverse
from .models import Organization, EmailLog
import logging
from django.core.mail import get_connection, EmailMultiAlternatives

logger = logging.getLogger(__name__)

@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=5, max_retries=3)
def send_scheduled_email(self, organization_id, user_email, subject, message):
    try:
        # Fetch organization details
        organization = Organization.objects.get(org_id_id=organization_id)
        tracking_url = f"http://smartreachai.social/api/track-click?email={user_email}&organization={organization_id}"
        user_email_ = user_email
        # TEXT fallback version
        text_body = f"{message}\n\nClick here to learn more: {tracking_url}"

        # HTML-formatted version of the message
        paragraphs = message.split('\n\n')  # preserve paragraph spacing
        html_message = ''.join(f'<p>{p.replace("\n", "<br>")}</p>' for p in paragraphs)

        # Full HTML body with the tracking link
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

        # Setup email connection
        connection = get_connection(
            backend="django.core.mail.backends.smtp.EmailBackend",
            host=organization.email_host,
            port=organization.email_port,
            username=organization.email_host_user,
            password=organization.email_host_password,
            use_tls=organization.email_use_tls,
        )

        # Send email with both plain text and HTML
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_body,
            from_email=organization.email_host_user,
            to=[user_email_],
            connection=connection
        )
        email.attach_alternative(html_body, "text/html")
        email.send()

        # Log success
        EmailLog.objects.create(
            organization_id=organization_id,
            user_email=user_email_,
            subject=subject,
            sent_at=now(),
            status="Sent"
        )

        logger.info(f"Email successfully sent to {user_email_} from {organization.email_host_user}")
        return f"Email successfully sent to {user_email_} from {organization.email_host_user}"

    except Exception as e:
        # Log failure
        EmailLog.objects.create(
            organization_id=organization_id,
            user_email=user_email_,
            subject=subject,
            sent_at=now(),
            status=f"Failed: {str(e)}"
        )

        logger.error(f"Error sending email to {user_email_}: {str(e)}")
        return f"Error sending email: {str(e)}"
