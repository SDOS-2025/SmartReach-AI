from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

from django.db import models
from django.utils.timezone import now
class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError('Users must have an email address')
        if not username:
            raise ValueError('Users must have a username')

        user = self.model(
            email=self.normalize_email(email),
            username=username,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(verbose_name='email', max_length=60, unique=True)
    username = models.CharField(max_length=30, unique=True)
    date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add=True)
    last_login = models.DateTimeField(verbose_name='last login', auto_now=True)
    is_active = models.BooleanField(default=True)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username

    class Meta:
        app_label = 'api'

class Organization(models.Model):
    org_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="organizations", to_field="user_id", unique=True)
    email_host_user = models.EmailField(unique=True)
    email_host_password = models.CharField(max_length=255)
    email_host = models.CharField(max_length=255, default="smtp.gmail.com")
    email_port = models.IntegerField(default=587)
    email_use_tls = models.BooleanField(default=True)

    class Meta:
        db_table = 'organizations'
        app_label = 'api'

    def __str__(self):
        return self.email_host_user


class CompanyUser(models.Model):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="company_users", to_field="org_id")
    email = models.EmailField(verbose_name='email', max_length=60, unique=True)
    age = models.IntegerField()
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    gender = models.CharField(max_length=1)
    location = models.CharField(max_length=30)
    timezone = models.CharField(max_length=30)
    date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add=True)

    class Meta:
        db_table = 'company_users'
        app_label = 'api'

    def __str__(self):
        return self.email

class CampaignDetails(models.Model):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="campaign_details", to_field="org_id")
    campaign_id = models.AutoField(primary_key=True)
    campaign_name = models.CharField(max_length=30)
    campaign_description = models.CharField(max_length=255)
    campaign_start_date = models.DateTimeField()
    campaign_end_date = models.DateTimeField()
    campaign_mail_body = models.TextField()
    campaign_mail_subject = models.CharField(max_length=255)

    send_time = models.DateTimeField()

    class Meta:
        db_table = 'campaign_details'
        app_label = 'api'

    def __str__(self):
        return self.campaign_name

class CompanyUserEngagement(models.Model):
    user_id = models.ForeignKey(CompanyUser, on_delete=models.CASCADE, related_name="company_user_engagement")
    campaign_id = models.ForeignKey(CampaignDetails, on_delete=models.CASCADE, related_name="campaign_user_engagement", to_field="campaign_id")
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="org_user_engagement", to_field="org_id")
    send_time = models.DateTimeField()
    open_time = models.DateTimeField(null=True, blank=True)
    click_time = models.DateTimeField(null = True,blank = True)
    engagement_delay = models.FloatField()

    class Meta:
        db_table = 'company_user_engagement'
        app_label = 'api'

    def __str__(self):
        return str(self.user_id)

class CampaignStatistics(models.Model):
    campaign_id = models.ForeignKey(CampaignDetails, on_delete=models.CASCADE, related_name="campaign_statistics", to_field="campaign_id")
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="org_campaign_statistics", to_field="org_id")
    user_click_rate = models.FloatField()
    user_open_rate = models.FloatField()
    user_engagement_delay = models.FloatField()

    class Meta:
        db_table = 'campaign_statistics'
        app_label = 'api'

    def __str__(self):
        return self.campaign_id
        
class EmailLog(models.Model):
    organization_id = models.IntegerField()
    user_email = models.EmailField()
    subject = models.CharField(max_length=1024)
    sent_at = models.DateTimeField(default=now)
    status = models.CharField(max_length=1024)  # Sent, Failed, Clicked
    clicked_at = models.DateTimeField(null=True, blank=True)
    class Meta:
        db_table = 'email_log'
        app_label = 'api'
    def __str__(self):
        return f"{self.user_email} - {self.subject} - {self.status}"
