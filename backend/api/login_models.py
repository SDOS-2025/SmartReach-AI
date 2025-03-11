from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

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

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username

    class Meta:
        app_label = 'api'

class Organization(models.Model):
    org_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="organizations", to_field="user_id")
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
