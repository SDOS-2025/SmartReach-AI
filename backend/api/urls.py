from django.urls import path
from .views import (
    hello_world, 
    login, 
    google_login,
    auth_complete,
    check_auth
)

urlpatterns = [
    path('hello/', hello_world),
    path('login/', login),
    path('google-login/', google_login),
    path('auth-complete/', auth_complete, name='auth-complete'),
    path('check-auth/', check_auth, name='check-auth'),
]