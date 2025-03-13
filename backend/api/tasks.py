from celery import shared_task
from django.core.mail import send_mail, get_connection
from django.utils.timezone import now
from django.urls import reverse
from .models import Organization, EmailLog
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=5, max_retries=3)
def send_scheduled_email(self, organization_id, user_email, subject, message):
    try:
        # Fetch organization details
        organization = Organization.objects.get(org_id_id=organization_id)

        # Create tracking link (this should point to your Django tracking endpoint)
        tracking_url = f"http://127.0.0.1:8000/api/track-click?email={user_email}&organization={organization_id}"
        user_email_ = 'rahul.omalur14@gmail.com'
        # Append tracking link to email message
        email_body = f"{message}\n\nTo track email engagement, click here: {tracking_url}"
        print(email_body)
        # Establish email connection
        connection = get_connection(
            backend="django.core.mail.backends.smtp.EmailBackend",
            host=organization.email_host,
            port=organization.email_port,
            username=organization.email_host_user,
            password=organization.email_host_password,
            use_tls=organization.email_use_tls,
        )

        # Send email
        send_mail(
            subject,
            email_body,  # Modified message with tracking link
            organization.email_host_user,
            [user_email_],
            connection=connection,
            fail_silently=False,
        )

        # Log email sent
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
        # Log email failure
        EmailLog.objects.create(
            organization_id=organization_id,
            user_email=user_email_,
            subject=subject,
            sent_at=now(),
            status=f"Failed: {str(e)}"
        )

        logger.error(f"Error sending email to {user_email_}: {str(e)}")
        return f"Error sending email: {str(e)}"
