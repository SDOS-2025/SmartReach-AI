from celery import shared_task
from django.core.mail import send_mail, get_connection
# from users.models import Organization

@shared_task
def send_scheduled_email(organization_id, user_email, subject, message):
    try:
        organization = Organization.objects.get(org_id=organization_id)


        connection = get_connection(
            backend="django.core.mail.backends.smtp.EmailBackend",
            host=organization.email_host,
            port=organization.email_port,
            username=organization.email_host_user,
            password=organization.email_host_password,
            use_tls=organization.email_use_tls,
        )

        send_mail(
            subject,
            message,
            organization.email_host_user,
            [user_email],
            connection=connection,
            fail_silently=False,
        )

        return f"Email successfully sent to {user_email} from {organization.email_host_user}"

    except Exception as e:
        return f"Error sending email: {str(e)}"
