from .settings import *
from .oauth_settings import *
DATABASES['default'] = {
    'ENGINE': 'django.db.backends.postgresql',
    'NAME': test_database,
    'USER': test_user,
    'PASSWORD': test_password,
    'HOST': 'smartreachai-tests-smartreachai-tests.k.aivencloud.com',
    'PORT': 27244,
}
SILENCED_SYSTEM_CHECKS = [
    "staticfiles.W004",
    "fields.W342",
]