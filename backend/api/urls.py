from django.urls import path
from .views import (
    hello_world, 
    login_view, 
    google_login,
    auth_complete,
    check_auth,
    sto_view,
    populate_users,
    signup_individuals,
    signup_business,
    generate_template
)

urlpatterns = [
    path('hello/', hello_world),
    path('user-login', login_view),
    path('google-login/', google_login),
    path('auth-complete/', auth_complete, name='auth-complete'),
    path('check-auth/', check_auth, name='check-auth'),
    path('sto/',sto_view, name = 'sto'),
    path('db-test/', populate_users),
    path('signup-individuals', signup_individuals),
    path('signup-business', signup_business),
    path('generate-template', generate_template)

]