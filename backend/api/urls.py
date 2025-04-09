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
    generate_template,
    track_email_click,
    generate_template_additional_info,
    generate_template_send_time,
    send_time_optim,
    user_login_details,
    get_campaigns,
    get_campaign_details,
    get_chart_data

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
    path('generate-template', generate_template),
    path('track-click/', track_email_click, name='track-email-click'),
    path('additional-info-template', generate_template_additional_info),
    path('send-time-instructions-template', generate_template_send_time),
    path('sto', send_time_optim),
    path('user-login-details', user_login_details),
    path('campaigns',get_campaigns),
    path('get-campaign-details',get_campaign_details),
    path('get_chart_data', get_chart_data)

]