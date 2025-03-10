from django.urls import path
from .views import (
    hello_world, 
    login_view, 
    google_login,
    auth_complete,
    check_auth,
    sto_view
)

urlpatterns = [
    path('hello/', hello_world),
    path('user-login/', login_view),
    path('google-login/', google_login),
    path('auth-complete/', auth_complete, name='auth-complete'),
    path('check-auth/', check_auth, name='check-auth'),
    path('sto/',sto_view, name = 'sto')
]