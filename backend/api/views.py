import json
from datetime import datetime
import pytz
from django.shortcuts import render, redirect
from django.core.mail import send_mail, get_connection
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from django.utils.timezone import make_aware
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth.decorators import login_required
from social_django.utils import load_strategy, load_backend
from social_core.backends.oauth import BaseOAuth2
from social_core.exceptions import MissingBackend
from django.contrib.auth import login, authenticate, logout, get_user_model
from api.models import User, Organization, CompanyUser, CampaignDetails, CompanyUserEngagement, CampaignStatistics
from .sto_model import get_optimal_send_time
from .tasks import send_scheduled_email
from .LLM_template_generator import TemplateGenerator
from django.http import JsonResponse, HttpResponseRedirect
from django.utils.timezone import now
from .models import EmailLog
from django.core.cache import cache

import logging
logger = logging.getLogger(__name__)


@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello from Django!"})


@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')


    user = User.objects.filter(username=username).first()
    if user is None:
        return Response({'error': 'Invalid username'}, status=400)

    request.session['user_id'] = user.user_id
    org_id = Organization.objects.filter(org_id=user).first()
    if org_id:
        request.session['org_id'] = org_id.org_id_id
    else:
        request.session['org_id'] = None

    cache.set(f'user_id', request.session['user_id'], timeout=3600)
    cache.set(f'org_id', request.session['org_id'], timeout=3600)

    return Response({'message': 'Login successful'})


@api_view(['GET'])
def google_login(request):
    pass

@api_view(['GET'])
def auth_complete(request):
    """Handle the OAuth callback"""
    if request.user.is_authenticated:
        return Response({
            'message': 'Authentication successful',
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'is_authenticated': True
            }
        })
    return Response({'error': 'Authentication failed'}, status=401)

@api_view(['GET'])
def check_auth(request):
    """Check if user is authenticated"""
    if request.user.is_authenticated:
        return Response({
            'is_authenticated': True,
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email
            }
        })
    return Response({'is_authenticated': False})

def convert_ist_to_utc(ist_date, ist_time):
    """Convert IST date and time to UTC."""
    ist = pytz.timezone("Asia/Kolkata")
    utc = pytz.utc

    # Combine date and time into a single datetime object
    ist_datetime_str = f"{ist_date} {ist_time}"
    ist_datetime = datetime.strptime(ist_datetime_str, "%Y-%m-%d %H:%M")

    # Localize and convert to UTC
    ist_datetime = ist.localize(ist_datetime)
    utc_datetime = ist_datetime.astimezone(utc)

    return utc_datetime

@api_view(['GET'])
def send_time_optim(request):
    org_id = cache.get('org_id')
    user_id = cache.get('user_id')
    campaign_id = cache.get('campaign_id')

    campaign = CampaignDetails.objects.get(campaign_id=campaign_id)

    return Response({'message': 'Send time optimization successful'})

@csrf_exempt
def sto_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            # Extract organization and users
            organization_id = data.get("organizationId")
            schedule_date = data.get("scheduleDate")  # Format: "YYYY-MM-DD"
            schedule_time = data.get("scheduleTime")  # Format: "HH:MM"

            print(schedule_date, schedule_time)

            campaign_id = data.get("campaignId")
            message = CampaignDetails.objects.get(campaign_id=campaign_id).campaign_mail_body
            sto_option = data.get("stoOption")
            subject = CampaignDetails.objects.get(campaign_id=campaign_id).campaign_mail_subject

            if not all([organization_id, schedule_date, schedule_time, subject, message,sto_option]):
                return JsonResponse({"error": "Missing required fields"}, status=400)

            #Fetch organization
            try:
                organization = Organization.objects.get(org_id_id=organization_id)
            except Organization.DoesNotExist:
                return JsonResponse({"error": "Invalid organization ID"}, status=400)

            #Get all users in the organization
            users = CompanyUser.objects.filter(org_id_id=organization_id)
            print(users)
            if not users.exists():
                return JsonResponse({"error": "No users found for this organization"}, status=400)

            # Convert schedule time from IST to UTC
            utc_send_time = convert_ist_to_utc("2025-03-13","12:54")

            # Loop through each user and schedule the email at the optimal time
            for user in users:

                # # Fetch engagement data
                # engagement = UserEngagement.objects.filter(user_id=user.user_id).first()
                # if not engagement:
                #     continue  # Skip users with no engagement data

                user_email = user.email
                print(utc_send_time)
                # Schedule email via Celery
                send_scheduled_email.apply_async(
                    args=[organization_id, user_email, subject, message],
                    eta=utc_send_time  # Schedule email at the converted UTC time
                )

            return JsonResponse({"message": "Emails scheduled successfully", "send_time": str(utc_send_time)})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)

def populate_users(request):

    # User.objects.all().delete()
    # Organization.objects.all().delete()
    # CompanyUser.objects.all().delete()
    # CampaignDetails.objects.all().delete()
    # CompanyUserEngagement.objects.all().delete()
    # CampaignStatistics.objects.all().delete()


    # # Create Users
    # users = [
    #     {'username': 'noeltiju', 'email': 'noelab04@gmail.com', 'password': 'sdos'},
    #     {'username': 'mehul', 'email': 'mehul@gmail.com', 'password': 'sdos'},
    #     {'username': 'tharun', 'email': 'tharun@gmail.com', 'password': 'sdos'},
    #     {'username': 'rahul', 'email': 'rahul@gmail.com', 'password': 'sdos'},
    # ]

    # for user in users:
    #     User.objects.create_user(
    #         username=user['username'],
    #         email=user['email'],
    #         password=user['password']
    #     )

    # # Create Organization
    # user = User.objects.get(username="rahul")
    # organizations = [
    #     {
    #         'org_id': user,
    #         'email_host_user': 'rahul22392@iiitd.ac.in',
    #         'email_host_password': '',
    #         'email_host': "smtp.gmail.com",
    #     },
    # ]

    # for organization in organizations:
    #     Organization.objects.create(**organization)

    # org_instance = Organization.objects.get(email_host_user="rahul22392@iiitd.ac.in")

    # # Create CompanyUsers (fix org_id to use Organization instance)
    # company_users = [
    #     {
    #         "org_id": org_instance,  # Use Organization instance, not User
    #         "email": "noel22338@iiitd.ac.in",  # Fixed typo
    #         "age": 21,
    #         "first_name": "Noel",
    #         "last_name": "Tiju",
    #         "gender": "M",
    #         "location": "Kerala",
    #         "timezone": "IST",
    #     },
    #     {
    #         "org_id": org_instance,
    #         "email": "mehul22294@iiitd.ac.in",
    #         "age": 20,
    #         "first_name": "Mehul",
    #         "last_name": "Agarwal",
    #         "gender": "F",
    #         "location": "Delhi",
    #         "timezone": "IST",
    #     },
    #     {
    #         "org_id": org_instance,
    #         "email": "tharun22541@iiitd.ac.in",
    #         "age": 22,
    #         "first_name": "Tharun",
    #         "last_name": "Harish",
    #         "gender": "M",
    #         "location": "Tamil Nadu",
    #         "timezone": "IST",
    #     },
    # ]

    # for company_user in company_users:
    #     CompanyUser.objects.create(**company_user)

    # campaign_details = [
    #     {
    #         'org_id': org_instance,  # Use Organization instance
    #         'campaign_name': 'Campaign 1',
    #         'campaign_description': 'Launch campaign for the new Tesla Model Y, targeting early adopters and tech-savvy consumers with exclusive pre-order offers and innovative technology highlights.',
    #         'campaign_start_date': datetime.strptime('2021-09-01 00:00', '%Y-%m-%d %H:%M'),
    #         'campaign_end_date': datetime.strptime('2021-09-30 23:59', '%Y-%m-%d %H:%M'),
    #         'campaign_mail_body': (
    #             'Hello,\n\n'
    #             'We are excited to introduce the Tesla Model Y, the latest in our lineup of cutting-edge vehicles. '
    #             'Join us for an exclusive pre-order experience and be among the first to experience its groundbreaking features. '
    #             'For more details, visit our website or contact our sales team.\n\n'
    #             'Best regards,\n'
    #             'Tesla Marketing Team'
    #         ),
    #         'campaign_mail_subject': 'Introducing the All-New Tesla Model Y – Pre-Order Now!',
    #         'send_time': datetime.strptime('2021-09-01 10:00', '%Y-%m-%d %H:%M'),
    #     },
    # ]

    # for campaign in campaign_details:
    #     CampaignDetails.objects.create(**campaign)

    # campaign = CampaignDetails.objects.get(campaign_name="Campaign 1")

    # company_user1 = CompanyUser.objects.get(email="noel22338@iiitd.ac.in")
    # company_user2 = CompanyUser.objects.get(email="mehul22294@iiitd.ac.in")
    # company_user3 = CompanyUser.objects.get(email="tharun22541@iiitd.ac.in")

    # company_user_engagement = [
    #     {
    #         "user_id": company_user1,
    #         "campaign_id": campaign,
    #         "org_id": org_instance,
    #         "send_time": datetime.strptime("2021-08-15 12:00", "%Y-%m-%d %H:%M"),
    #         "open_time": datetime.strptime("2021-08-15 12:05", "%Y-%m-%d %H:%M"),
    #         "click_rate": 0.80,
    #         "open_rate": 0.80,
    #         "engagement_delay": 5.0,  # In hours (should be 0.0833 for 5 minutes, see note below)
    #     },
    #     {
    #         "user_id": company_user2,
    #         "campaign_id": campaign,
    #         "org_id": org_instance,
    #         "send_time": datetime.strptime("2021-08-20 10:00", "%Y-%m-%d %H:%M"),
    #         "open_time": datetime.strptime("2021-08-20 10:03", "%Y-%m-%d %H:%M"),
    #         "click_rate": 0.60,
    #         "open_rate": 0.60,
    #         "engagement_delay": 3.0,  # In hours (should be 0.05 for 3 minutes)
    #     },
    #     {
    #         "user_id": company_user3,
    #         "campaign_id": campaign,
    #         "org_id": org_instance,
    #         "send_time": datetime.strptime("2021-08-25 15:00", "%Y-%m-%d %H:%M"),
    #         "open_time": datetime.strptime("2021-08-25 15:10", "%Y-%m-%d %H:%M"),
    #         "click_rate": 0.90,
    #         "open_rate": 0.90,
    #         "engagement_delay": 10.0,  # In hours (should be 0.1667 for 10 minutes)
    #     },
    # ]

    # for engagement in company_user_engagement:
    #     CompanyUserEngagement.objects.create(**engagement)

    # print('Done populating users, organizations, company users, campaigns, and engagements')

    # campaign_statistics = [
    #     {
    #         'campaign_id': campaign,
    #         'org_id': org_instance,
    #         'user_click_rate': 0.77,
    #         'user_open_rate': 0.77,
    #         'user_engagement_delay': 6.0,
    #         'user_engagement_rate': 0.77,
    #     },
    # ]

    # for stats in campaign_statistics:
    #     CampaignStatistics.objects.create(**stats)
    
    # print('Done populating campaign statistics')

    # print(User.objects.count())  # Should be 4
    # print(Organization.objects.count())  # Should be 1
    # print(CompanyUser.objects.count())  # Should be 3
    # print(CampaignDetails.objects.count())  # Should be 1
    # print(CompanyUserEngagement.objects.count())  # Should be 3

    orgs = Organization.objects.all()
    for org in orgs:
        print(org.org_id_id)





@api_view(['POST'])
def signup_individuals(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()
        return Response({'message': 'User created successfully'})
    
    except IntegrityError:
        return Response({'error': 'A user with that username or email already exists.'})

    except Exception as e:
        return Response({'error': str(e)})

@api_view(['POST'])
def signup_business(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    email_host_user = request.data.get('email_host_user')
    email_host_password = request.data.get('email_host_password')
    email_host = request.data.get('email_host')
    email_port = request.data.get('email_port')
    email_use_tls = request.data.get('email_use_tls')

    try:
        user = User.objects.create_user(username=username, email=email, password=password)
        org = Organization(org_id=user, email_host_user=email_host_user, email_host_password=email_host_password, email_host=email_host, email_port=email_port, email_use_tls=email_use_tls)
        org.save()
        return Response({'message': 'User and organization created successfully'})

    except IntegrityError:
        return Response({'error': 'A user with that username or email already exists.'})
    
    except Exception as e:
        return Response({'error': str(e)})


@api_view(['POST'])
def generate_template(request):
    category = request.data.get('category')
    tone = request.data.get('tone')
    content_type = request.data.get('contentType')
    company_description = request.data.get('companyDescription')
    email_purpose = request.data.get('emailPurpose')
    audience_type = request.data.get('audienceType')
    preferred_length = request.data.get('preferredLength')
    cta = request.data.get('cta')
    # custom_cta = request.data.get('customCta')
    email_structure = request.data.get('emailStructure')

    response_data = {
        'category_subcategory': category,
        'tone': tone,
        'content_type': content_type,
        'company_description': company_description,
        'email_purpose': email_purpose,
        'audience_type': audience_type,
        'preferred_length': preferred_length,
        'cta': cta,
        'email_structure': email_structure
    }
    template_generator = TemplateGenerator(**response_data)
    template = template_generator.generate()
    request.session['generated_template'] = template
    org_id = cache.get('org_id')
    user_id = cache.get('user_id')

    cache.set('Template', template, timeout=3600)    

    if not template:
        return Response(
            {'Subject':'Internal Server Error', 'Body': 'Error generating template'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    return Response(template, status=status.HTTP_201_CREATED)

    
    
from django.http import JsonResponse, HttpResponseRedirect
from django.utils.timezone import now
from .models import EmailLog
import logging

logger = logging.getLogger(__name__)

def track_email_click(request):
    user_email = request.GET.get("email")
    organization_id = request.GET.get("organization")
    redirect_url = "https://google.com"  # Redirect to your content page

    if user_email and organization_id:
        try:
            # Find and update email log to mark as clicked
            email_log = EmailLog.objects.filter(organization_id=organization_id, user_email=user_email).first()
            if email_log and not email_log.clicked_at:
                email_log.clicked_at = now()
                email_log.status = "Clicked"
                email_log.save()
                logger.info(f"Email {organization_id} clicked by {user_email}")

        except Exception as e:
            logger.error(f"Error tracking email click: {str(e)}")

    return HttpResponseRedirect(redirect_url)  # Redirect user to content

@api_view(['POST'])
def generate_template_additional_info(request):
    call_to_action = request.data.get('callToAction')
    urgency = request.data.get('urgency')
    additional_info = request.data.get('additionalInfo')

    if not all([call_to_action, urgency, additional_info]):
        return Response({'error': 'Missing required fields'}, status=400)
    else:
        return Response({'message': 'Additional info received successfully'})

import csv
from io import TextIOWrapper

@api_view(['POST'])
def generate_template_send_time(request):
    start_date = request.data.get('startDate')
    start_time = request.data.get('startTime')
    end_date = request.data.get('endDate')

    print(start_date, start_time, end_date)
    print(cache.get('org_id'))
    print(cache.get('user_id'))
    print(cache.get('Template'))
    campaign_details = {}

    campaign_start_date = datetime.strptime(f"{start_date} {start_time}", '%Y-%m-%d %H:%M')
    campaign_start_time = datetime.strptime(f"{start_date} {start_time}", '%Y-%m-%d %H:%M')
    campaign_end_date = datetime.strptime(f"{end_date} 23:59", '%Y-%m-%d %H:%M')

    uploaded_file = request.FILES.get('dataUpload')

    org_instance = Organization.objects.get(org_id_id=cache.get('org_id'))

    campaign_details = {
        'org_id': org_instance,
        'campaign_name': 'Test Campaign',
        'campaign_description': 'Test Campaign Description',
        'campaign_start_date': campaign_start_date,
        'campaign_end_date': campaign_end_date,
        'campaign_mail_body': cache.get('Template')['Body'],
        'campaign_mail_subject': cache.get('Template')['Subject'],
        'send_time': campaign_start_time
    }

    campaign_object = CampaignDetails.objects.create(**campaign_details)
    campaign_id = campaign_object.campaign_id

    cache.set('campaign_id', campaign_id, timeout=3600)

    if uploaded_file:
        csv_file = TextIOWrapper(uploaded_file, encoding='utf-8')
        reader = csv.DictReader(csv_file)
        
        data = [row for row in reader]

        csv_file.seek(0)

        org_id = cache.get('org_id')
        campaign_id = cache.get('campaign_id')

        for row in data:
            row['org_id'] = org_instance

            email = row.get('email')

            user = CompanyUser.objects.all().filter(email=email).first()

            if not user:
                CompanyUser.objects.create(**row)

        response_data = {
            'message': 'Timings and file received successfully',
            'start_date': start_date,
            'start_time': start_time,
            'end_date': end_date,
            'file_uploaded': bool(uploaded_file),
        }
        return JsonResponse(response_data, status=200)

    return JsonResponse({'error': 'Invalid request method'}, status=400)