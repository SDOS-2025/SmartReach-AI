import json
import csv
import random
import logging
from datetime import datetime, timedelta
from io import TextIOWrapper

import pandas as pd
import pytz
from django.core.cache import cache
from django.core.mail import send_mail, get_connection
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.utils.timezone import now, make_aware
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from django.contrib.auth import login, authenticate, logout, get_user_model
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError

from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token

from social_django.utils import load_strategy, load_backend
from social_core.backends.oauth import BaseOAuth2
from social_core.exceptions import MissingBackend

from api.models import User, Organization, CompanyUser, CampaignDetails, CompanyUserEngagement, CampaignStatistics
from .models import EmailLog
from .sto_model import get_optimal_send_time
from .tasks import send_scheduled_email
from .LLM_template_generator import TemplateGenerator

logger = logging.getLogger(__name__)

@api_view(['POST'])
def login_view(request):
    """Logs in the user and sets the authToken cookie"""
    username = request.data.get('username')
    password = request.data.get('password')

    if not all([username, password]):
        return Response({'error': 'Missing required fields'}, status=400)

    # Validate email format
    try:
        validate_email(username)

    except ValidationError:
        return JsonResponse({'error': 'Invalid email address'}, status=400)
    print("Trying...")
    # Try to get the user manually
    user = authenticate(request, username=username, password=password)
    print("user is authenticated")
    print(user)
    
    if user is None:
        user_ideal = User.objects.filter(username=username).first()
        if user_ideal:
            return Response({'error': 'Wrong password'}, status=400)
        else:
            return Response({'error': 'User not found'}, status=400)

    #Setting up the cache
    try:
        request.session['user_id'] = user.user_id
        org = Organization.objects.filter(org_id=user).first()
        request.session['org_id'] = org.org_id_id if org else None
        cache.set('user_id', user.user_id, timeout=3600)
        cache.set('org_id', request.session['org_id'], timeout=3600)
    except Exception as e:
        logger.error(f"Error setting up cache: {str(e)}")
        return Response({'error': 'Internal Server Error'}, status=500)

    # Create or fetch the token manually
    try:
        token = Token.objects.get(user=user)
    except Token.DoesNotExist:
        # If token doesn't exist, create it
        token = Token.objects.create(user=user)
    except Exception as e:
        logger.error(f"Error fetching or creating token: {str(e)}")
        return Response({'error': 'Internal Server Error'}, status=500)

    response = Response({
        'message': 'Login successful',
        'status': 'Normal' if org is None else 'Business'
    })

    response.set_cookie(
        'authToken',
        token.key,
        httponly=True,
        max_age=3600,
    )

    return response

    
@csrf_exempt
@api_view(['GET'])
def user_logout(request):
    """Log out the user and delete authToken cookie"""

    try:
        cache.delete('user_id')
        cache.delete('org_id')
        cache.delete('campaign_id')
        cache.delete('Template')
        response = Response({'message': 'Logged out successfully'})
        response.delete_cookie('authToken')
        return response

    except Exception as e:
        logger.error(f"Error during logout: {str(e)}")
        return Response({'error': 'Internal Server Error'}, status=500)

@api_view(['GET'])
def auth_complete(request):
    """Handle the OAuth callback and redirect with token"""
    if request.user.is_authenticated:
        try:
            cache.set('user_id', request.user.user_id, timeout=3600)
            token, _ = Token.objects.get_or_create(user=request.user)

            response = HttpResponse(
                f"""
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Redirecting...</title>
                </head>
                <body>
                    <script>
                        window.location.href = 'http://localhost:3000/write_email';

                    </script>
                </body>
                </html>
                """
            )

            response.set_cookie(
                'authToken',
                token.key,
                httponly=True,  # Prevent JavaScript access
                max_age=3600  # 1-hour expiry
            )

            return response
        except Exception as e:
            logger.error(f"Error during OAuth completion: {str(e)}")
            return Response({'error': 'Internal Server Error'}, status=500)

    else:
        return Response({'error': 'User not authenticated'}, status=401)

@api_view(['GET'])
def check_auth(request):
    logger.info("Checking authentication")
    auth_token = request.COOKIES.get('authToken')
    logger.info(f"Request cookies: {request.COOKIES}")
    logger.info(f"authToken: {auth_token}")

    if not auth_token:
        logger.warning("No authToken found in cookies")
        return JsonResponse({'is_authenticated': False}, status=401)

    try:
        token = Token.objects.get(key=auth_token)
        user = token.user
        logger.info(f"Authenticated user: {user.username}")
    except Token.DoesNotExist:
        logger.warning("Invalid authToken")
        return JsonResponse({'is_authenticated': False}, status=401)

    user_id = cache.get('user_id')
    if user_id != user.user_id:
        logger.warning("Cached user_id does not match token user")
        cache.set('user_id', user.user_id, timeout=3600)

    val = Organization.objects.filter(org_id=user.user_id).first()
    result = 'Business' if val else 'Normal'

    return JsonResponse({
        'is_authenticated': True,
        'status': result,
    })

def convert_ist_to_utc(ist_date, ist_time):
    """Convert IST date and time to UTC."""
    try:
        ist = pytz.timezone("Asia/Kolkata")
        utc = pytz.utc

        # Combine date and time into a single datetime object
        ist_datetime_str = f"{ist_date} {ist_time}"
        ist_datetime = datetime.strptime(ist_datetime_str, "%Y-%m-%d %H:%M")

        # Localize and convert to UTC
        ist_datetime = ist.localize(ist_datetime)
        utc_datetime = ist_datetime.astimezone(utc)

        return utc_datetime
    except Exception as e:
        logger.error(f"Error converting IST to UTC: {str(e)}")
        return Response({'error': 'Invalid date or time format'}, status=400)

@api_view(['GET'])
def send_time_optim(request):
    # Fetch cached values
    
    org_id = cache.get('org_id')
    user_id = cache.get('user_id')  # Unused in current logic; included for completeness
    campaign_id = cache.get('campaign_id')

    if not all([org_id, campaign_id]):
        return Response({"error": "Missing required cached fields"}, status=400)

    # Fetch campaign details
    try:
        campaign = CampaignDetails.objects.get(campaign_id=campaign_id)
        subject = campaign.campaign_mail_subject
        message = campaign.campaign_mail_body
        schedule_time = campaign.send_time  # Start datetime
        campaign_end_date = campaign.campaign_end_date  # End datetime
    except CampaignDetails.DoesNotExist:
        return Response({"error": "Invalid campaign ID"}, status=400)

    schedule_date, schedule_time_str = str(schedule_time).split(" ")
    schedule_time_str = schedule_time_str.split("+")[0][:-3]  # "HH:MM"
    end_date, end_time_str = str(campaign_end_date).split(" ")
    end_time_str = end_time_str.split("+")[0][:-3]  # "HH:MM"

    utc_start_time = convert_ist_to_utc(schedule_date, schedule_time_str)
    utc_end_time = convert_ist_to_utc(end_date, end_time_str)

    if utc_end_time < utc_start_time:
        return Response({"error": "End date must be after start date"}, status=400)

    # Fetch users
    users = CompanyUser.objects.filter(org_id_id=org_id)
    if not users.exists():
        return Response({"error": "No users found for this organization"}, status=400)

    # Schedule emails with statistical optimal time
    scheduled_times = {}
    for user in users:
        user_email = user.email  # Assuming email field exists; adjust if it’s user_email
        personalized_message = message.replace("[company_name]", "SmartReach").replace("[recipient_name]", user.first_name)

        # Get optimal send time statistically
        engagements = CompanyUserEngagement.objects.filter(
            user_id=user,
            click_time__isnull=False
        )

        if not engagements.exists():
            # Fallback to campaign start if no click data
            optimal_send_time = utc_start_time
        else:
            # Statistical method: most frequent click hour
            df = pd.DataFrame(list(engagements.values('click_time')))
            df['click_hour'] = df['click_time'].dt.hour
            optimal_hour = df['click_hour'].value_counts().idxmax()

            # Adjust to campaign window
            start_hour = utc_start_time.hour
            end_hour = 23 if utc_end_time.date() > utc_start_time.date() else utc_end_time.hour
            optimal_hour = max(start_hour, min(optimal_hour, end_hour))

            # Set to first valid day
            optimal_send_time = utc_start_time.replace(hour=optimal_hour)
            now_ = now()
            while optimal_send_time < now_ and optimal_send_time <= utc_end_time:
                optimal_send_time += timedelta(days=1)
            if optimal_send_time > utc_end_time:
                optimal_send_time = utc_start_time
        # Schedule email via Celery
        link = cache.get('company_link')
        if not link:
            link = "https://smartreachai.social"
        send_scheduled_email.apply_async(
            args=[org_id, campaign_id, user_email, subject, personalized_message, link],
            eta=now()
        )
        scheduled_times[user_email] = str(optimal_send_time)

    return Response({
        "message": "Emails scheduled successfully",
        "scheduled_times": scheduled_times
    })


@api_view(['GET'])
def user_login_details(request):
    user_id = cache.get('user_id')

    if user_id is None:
        return Response({'error': 'User not logged in'}, status=400)
        
    user = User.objects.get(user_id=user_id)

    return Response({
        'username': user.username,
        'email': user.email
    })


@csrf_exempt
@api_view(['POST'])
def sto_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print(data)
            # Extract organization and users
            organization_id = data.get("organizationId")
            schedule_date = data.get("scheduleDate")  # Format: "YYYY-MM-DD"
            schedule_time = data.get("scheduleTime")  # Format: "HH:MM"


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
            if not users.exists():
                return JsonResponse({"error": "No users found for this organization"}, status=400)

            # Convert schedule time from IST to UTC
            utc_send_time = convert_ist_to_utc("2025-03-13","12:54")

            # Loop through each user and schedule the email at the optimal time
            for user in users:

                user_email = user.email

                send_scheduled_email.apply_async(
                    args=[organization_id, user_email, subject, message],
                    eta=utc_send_time
                )

            return JsonResponse({"message": "Emails scheduled successfully", "send_time": str(utc_send_time)})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@api_view(['POST'])
def signup_individuals(request):
    """Sign up a new individual normal user"""
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not all([username, email, password]):
        return Response({'error': 'Missing required fields'}, status=400)

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
    """Sign up a new business user"""
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    email_host_user = request.data.get('email_host_user')
    email_host_password = request.data.get('email_host_password')
    email_host = request.data.get('email_host')
    email_port = request.data.get('email_port')
    email_use_tls = request.data.get('email_use_tls')

    if not all([username, email, password, email_host_user, email_host_password, email_host, email_port, email_use_tls]):
        return Response({'error': 'Missing required fields'}, status=400)

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
    """Generate email template based on user input (first page)"""
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
    company_link = request.data.get('companyURL')
    response_data = {
        'category_subcategory': category,
        'tone': tone,
        'content_type': content_type,
        'company_description': company_description,
        'email_purpose': email_purpose,
        'audience_type': audience_type,
        'preferred_length': preferred_length,
        'cta': cta,
        'email_structure': email_structure,
        # 'company_link': company_link,
        "use_rag": False,
        "vector_db_path": None 
    }

    if not all([category, tone, content_type, company_description, email_purpose, audience_type, preferred_length, cta]):
        return Response({'error': 'Missing required fields'}, status=400)
    try:
        template_generator = TemplateGenerator(**response_data)
        template = template_generator.generate()
        request.session['generated_template'] = template
        org_id = cache.get('org_id')
        user_id = cache.get('user_id')

        cache.set('Template', template, timeout=3600)
        cache.set('company_link', company_link, timeout=3600)    

        if not template:
            return Response(
                {'Subject':'Internal Server Error', 'Body': 'Error generating template'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        return Response(template, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"Error generating template: {str(e)}")
        return Response({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def track_email_click(request):
    """Track email click and update the database"""

    try:
        user_email = request.GET.get("email")
        organization_id = request.GET.get("organization")
        campaign_id = request.GET.get("campaign")
        redirect_url = request.GET.get("company_link")

        if not redirect_url:
            redirect_url = "https://smartreachai.social"

        if user_email and organization_id:
            try:
                # Fetch related instances
                user = CompanyUser.objects.get(email=user_email)
                organization = Organization.objects.get(org_id_id=organization_id)
                # Find the most recent unclicked engagement for this user/org
                engagement = CompanyUserEngagement.objects.filter(
                    user_id=user.id,
                    org_id=organization.org_id_id,
                    campaign_id = campaign_id,
                    click_time__isnull=True 
                ).order_by('-send_time').first()

                if engagement:
                    engagement.click_time = now()
                    engagement.engagement_delay = (engagement.click_time - engagement.send_time).total_seconds()
                    engagement.save()
                    logger.info(f"Email click tracked for {user_email} in organization {organization_id}")
                else:
                    logger.warning(f"No unclicked engagement found for {user_email} in {organization_id}")

            except CompanyUser.DoesNotExist:
                logger.error(f"User with email {user_email} not found")
            except Organization.DoesNotExist:
                logger.error(f"Organization with ID {organization_id} not found")
            except Exception as e:
                logger.error(f"Error tracking email click: {str(e)}")

        return HttpResponseRedirect(redirect_url)

    except Exception as e:
        logger.error(f"Error in track_email_click: {str(e)}")
        return JsonResponse({'error': 'Internal Server Error'}, status=500)

@api_view(['POST'])
def generate_template_additional_info(request):
    """Generate email template based on additional info (second page)"""
    call_to_action = request.data.get('callToAction')
    urgency = request.data.get('urgency')
    additional_info = request.data.get('additionalInfo')

    if not all([call_to_action, urgency, additional_info]):
        return Response({'error': 'Missing required fields'}, status=400)
    else:
        return Response({'message': 'Additional info received successfully'})

@api_view(['POST'])
def generate_template_send_time(request):
    """Generate email template based on send time (third page)"""
    start_date = request.data.get('startDate')
    start_time = request.data.get('startTime')
    end_date = request.data.get('endDate')
    campaign_name = request.data.get('campaignName')
    campaign_description = request.data.get('campaignDesc')

    if not all([start_date, start_time, end_date, campaign_name, campaign_description]):
        return Response({'error': 'Missing required fields'}, status=400)

    campaign_details = {}


    try:
        campaign_start_date = datetime.strptime(f"{start_date} {start_time}", '%Y-%m-%d %H:%M')

        campaign_start_time = datetime.strptime(f"{start_date} {start_time}", '%Y-%m-%d %H:%M')

        campaign_end_date = datetime.strptime(f"{end_date} 23:59", '%Y-%m-%d %H:%M')
    

    except Exception as e:
        return Response({'error': 'Invalid date or time format'}, status=400)

    # uploaded_file = request.FILES.get('dataUpload')
    uploaded_file = False
    # if not uploaded_file:
    #     return Response({'error': 'No file uploaded'}, status=400)

    org_instance = Organization.objects.get(org_id_id=cache.get('org_id'))

    campaign_details = {
        'org_id': org_instance,
        'campaign_name': campaign_name,
        'campaign_description': campaign_description,
        'campaign_start_date': campaign_start_date,
        'campaign_end_date': campaign_end_date,
        'campaign_mail_body': cache.get('Template')['Body'],
        'campaign_mail_subject': cache.get('Template')['Subject'],
        'send_time': campaign_start_time
    }
    try:
        campaign_object = CampaignDetails.objects.create(**campaign_details)
        campaign_id = campaign_object.campaign_id
        campaign_object.save()

        cache.set('campaign_id', campaign_id, timeout=3600)

        # if uploaded_file:
        #     csv_file = TextIOWrapper(uploaded_file, encoding='utf-8')
        #     reader = csv.DictReader(csv_file)
            
        #     data = [row for row in reader]

        #     csv_file.seek(0)

        #     org_id = cache.get('org_id')
        #     campaign_id = cache.get('campaign_id')

        #     for row in data:
        #         row['org_id'] = org_instance

        #         email = row.get('email')

        #         user = CompanyUser.objects.all().filter(email=email).first()

        #         if not user:
        #             CompanyUser.objects.create(**row)

        response_data = {
            'message': 'Timings and file received successfully',
            'start_date': start_date,
            'start_time': start_time,
            'end_date': end_date
        }
        #     return JsonResponse(response_data, status=200)

        return JsonResponse(response_data, status=200)

    except Exception as e:
        logger.error(f"Error generating template: {str(e)}")
        return Response({'error': 'Internal Server Error'}, status=500)


def get_campaigns(request):
    """Fetch all campaigns for the logged-in user"""
    org_id = cache.get('org_id')
    campaigns = CampaignDetails.objects.filter(org_id_id=org_id).values('campaign_id','campaign_name', 'campaign_description')
    if not campaigns:
        return JsonResponse({'error': 'No campaigns found'}, status=404)

    return JsonResponse({'campaigns': list(campaigns)})



def get_campaign_details(request):
    """Fetch details of a specific campaign"""
    org_id = cache.get('org_id')
    campaign_id = request.GET.get('campaign_id')

    if not org_id or not campaign_id:
        return JsonResponse({'error': 'Missing required parameters'}, status=400)

    campaign_meta_details = CampaignDetails.objects.filter(
        org_id_id=org_id,
        campaign_id=campaign_id
    ).values('campaign_start_date', 'campaign_end_date', 'campaign_name', 'campaign_description')

    campaign_details = CampaignStatistics.objects.filter(
        org_id_id=org_id,
        campaign_id=campaign_id
    ).values('user_click_rate', 'user_open_rate', 'user_engagement_delay')

    if not campaign_meta_details.exists() or not campaign_details.exists():
        return JsonResponse({'error': 'No campaign details found'}, status=404)

    return JsonResponse({
        'campaign_details': list(campaign_details),
        'campaign_meta_details': list(campaign_meta_details)
    })

def get_chart_data(request):
    """Fetch chart data for the logged-in user"""
    org_id = cache.get('org_id')
    if not org_id:
        return JsonResponse({'error': 'Organization not found'}, status=400)

    campaigns = CampaignStatistics.objects.filter(org_id_id=org_id).values(
        'id',
        'user_click_rate',
        'user_open_rate',
        'user_engagement_delay',
        'campaign_id_id'
    )

    chart_data = []
    for campaign in campaigns:
        chart_data.append({
            'id': campaign['id'],
            'campaignName': CampaignDetails.objects.get(campaign_id=campaign['campaign_id_id']).campaign_name,
            'start_date': CampaignDetails.objects.get(campaign_id=campaign['campaign_id_id']).campaign_start_date,
            'clickRate': campaign['user_click_rate'],
            'openRate': campaign['user_open_rate'],
            'engagementDelay': campaign['user_engagement_delay'],
            'campaignId': campaign['campaign_id_id']
        })

    if not chart_data:
        return JsonResponse({'error': 'No campaign data found'}, status=404)
    return JsonResponse({'chart_data': chart_data})



@api_view(['GET'])
def autofill_time(request):
    try:
        org_id = cache.get('org_id')

        if not org_id:
            return Response({"error": "Organization not found"}, status=400)

        open_times_qs = CompanyUserEngagement.objects.filter(org_id_id=org_id)
        times = []

        for record in open_times_qs:
            try:
                time_obj = record.open_time.time()
                delta = timedelta(hours=time_obj.hour, minutes=time_obj.minute, seconds=time_obj.second)
                times.append(delta)
            except Exception as e:
                print(f"Error parsing datetime object: {e}")

        if not times:
            return Response({"message": "No valid open times found"}, status=404)

        total_seconds = sum(t.total_seconds() for t in times)
        avg_seconds = total_seconds / len(times)
        avg_time = (datetime.min + timedelta(seconds=avg_seconds)).time()

        return Response({
            "optimalStartTime": avg_time.strftime("%H:%M")
        })
    except Exception as e:
        logger.error(f"Error in autofill_time: {str(e)}")
        return Response({"error": "Internal Server Error"}, status=500)

def track_email_open(request):
    """Track email open and update the database"""
    
    user_email = request.GET.get("email")
    organization_id = request.GET.get("organization")
    campaign_id = request.GET.get("campaign")

    if not all([user_email, organization_id, campaign_id]):
        return JsonResponse({'error': 'Missing required parameters'}, status=400)


    if user_email and organization_id:
        try:
            user = CompanyUser.objects.get(email=user_email)
            organization = Organization.objects.get(org_id_id=organization_id)
            engagement = CompanyUserEngagement.objects.filter(
                user_id=user.id,
                org_id=organization.org_id_id,
                campaign_id = campaign_id,
                click_time__isnull=True 
            ).order_by('-send_time').first()

            if engagement:
                engagement.open_time = now()
                engagement.engagement_delay = (engagement.click_time - engagement.open_time).total_seconds()
                engagement.save()
                logger.info(f"Email click tracked for {user_email} in organization {organization_id}")
            else:
                logger.warning(f"No unclicked engagement found for {user_email} in {organization_id}")

        except CompanyUser.DoesNotExist:
            logger.error(f"User with email {user_email} not found")
        except Organization.DoesNotExist:
            logger.error(f"Organization with ID {organization_id} not found")
        except Exception as e:
            logger.error(f"Error tracking email click: {str(e)}")

    return JsonResponse({'status':'hottie'})

@api_view(['POST'])
def update_email(request):
    """Update the email template"""
    data = json.loads(request.body.decode('utf-8'))
    subject = data.get('Subject')
    body = data.get('Body')
    template = cache.get('Template')
    if template:
        template['Subject'] = subject
        template['Body'] = body
        cache.set('Template', template)
        return JsonResponse({'message': 'Email updated successfully'})
    else:
        return JsonResponse({'error': 'No email template found'}, status=404)

@api_view(['GET'])
def get_email_original(request):
    """Fetch the original email template"""
    template = cache.get('Template')
    if template:
        subject = template['Subject']
        message = template['Body']

        return JsonResponse({'Subject': subject, 'Body': message})

    else:
        return JsonResponse({'error': 'No email template found'}, status=404)

@api_view(['GET'])
def get_email(request):
    """Fetch the email template with HTML formatting"""
    template = cache.get('Template')

    if not template:
        return JsonResponse({'error': 'No email template found'}, status=404)
    subject = template['Subject']
    message = f"{template['Body']}\n\n"

    if not subject or not message:
        return JsonResponse({'error': 'No email template found'}, status=404)

    company_link = cache.get('company_link')
    if company_link:
        tracking_url = f"{company_link}"
    else:
        tracking_url = "https://smartreachai.social"

    name = User.objects.get(user_id=cache.get('user_id')).username
    html_body = f"""
    <!DOCTYPE html>
        <html lang="en">
        <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #ffffff; line-height: 1.6;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff;">
                <tr>
                    <td align="center">
                        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; padding: 20px 0;">
                            <tr>
                                <td style="padding: 20px 0; text-align: center;">
                                    <h1 style="margin: 0; font-size: 28px; color: #222222; font-weight: bold;">{subject}</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 20px;">
                                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 0;">
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 20px; color: #333333; font-size: 16px;">
                                    <p style="margin: 0 0 20px;">{message}</p>
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 20px auto;">
                                        <tr>
                                            <td style="text-align: center;">
                                                <a href="{tracking_url}" target="_blank" 
                                                   style="display: inline-block; padding: 14px 30px; background-color: #ff5733; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
                                                    Shop Now
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 20px;">
                                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 0;">
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 20px; text-align: center; font-size: 12px; color: #666666;">
                                    <p style="margin: 0 0 10px;">You’re receiving this email because you subscribed to {name} updates.</p>
                                    <p style="margin: 10px 0 0;">©️ 2025 {name}. All rights reserved.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    """
    html_template = {'Subject': template['Subject'], 'Body': html_body}

    return JsonResponse(html_template)


def get_email_normal(request):
    """Fetch the email template without HTML formatting for normal users"""
    template = cache.get('Template')

    if not template:
        return JsonResponse({'error': 'No email template found'}, status=404)
    subject = template['Subject']
    message = f"{template['Body']}\n\n"

    if not subject or not message:
        return JsonResponse({'error': 'No email template found'}, status=404)

    company_link = cache.get('company_link')
    if company_link:
        tracking_url = f"{company_link}"
    else:
        tracking_url = "https://smartreachai.social"

    html_body = f"""
    <!DOCTYPE html>
        <html lang="en">
        <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #ffffff; line-height: 1.6;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff;">
                <tr>
                    <td align="center">
                        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; padding: 20px 0;">
                            <tr>
                                <td style="padding: 20px 0; text-align: center;">
                                    <h1 style="margin: 0; font-size: 28px; color: #222222; font-weight: bold;">{subject}</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 20px;">
                                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 0;">
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 20px; color: #333333; font-size: 16px;">
                                    <p style="margin: 0 0 20px;">{message}</p>
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 20px auto;">
                                        <tr>
                                            <td style="text-align: center;">
                                                <a href="{tracking_url}" target="_blank" 
                                                   style="display: inline-block; padding: 14px 30px; background-color: #ff5733; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
                                                    Shop Now
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 20px;">
                                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 0;">
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    """
    html_template = {'Subject': template['Subject'], 'Body': html_body}

    return JsonResponse(html_template)

@api_view(['GET'])
def get_company_users(request):
    """Fetch all users in the organization"""
    org_id = cache.get('org_id')
    if not org_id:
        return JsonResponse({'error': 'Organization not found'}, status=400)
        
    company_users = CompanyUser.objects.filter(org_id_id = org_id)
    return JsonResponse({'company_users':list(company_users.values())})



@api_view(["POST"])
def add_user(request):
    """Add a new user to the organization"""
    org_id = cache.get("org_id")
    data = request.data
    required_fields = ["first_name", "last_name", "email", "age", "gender", "location", "timezone"]

    if not org_id:
        return Response({"error": "Organization not found."}, status=status.HTTP_400_BAD_REQUEST)

    for field in required_fields:
        if field not in data or not str(data[field]).strip():
            return Response({"error": f"{field} is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        validate_email(data["email"])
    except ValidationError:
        return Response({"error": "Invalid email format."}, status=status.HTTP_400_BAD_REQUEST)

    if CompanyUser.objects.filter(email=data["email"]).exists():
        return Response({"error": "User with this email already exists."}, status=status.HTTP_409_CONFLICT)

    try:
        user = CompanyUser.objects.create(
            first_name=data["first_name"],
            last_name=data["last_name"],
            email=data["email"],
            age=data["age"],
            gender=data["gender"],
            location=data["location"],
            timezone=data["timezone"],
            date_joined=now(),
            org_id_id = cache.get('org_id')
        )


        return Response({
            "user": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "age": user.age,
                "gender": user.gender,
                "location": user.location,
                "timezone": user.timezone,
                "date_joined": user.date_joined,
                "org_id_id":org_id
            }
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
def upload_company_users_csv(request):
    """Upload a CSV file to add multiple users to the organization"""
    if "file" not in request.FILES:
        return Response({"error": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)

    file = request.FILES["file"]
    decoded_file = TextIOWrapper(file.file, encoding="utf-8")
    reader = csv.DictReader(decoded_file)

    created_users = []
    for row in reader:
        email = row.get("email")
        try:
            validate_email(email)
        except ValidationError:
            print('invalid email')  # Skip invalid emails

        if CompanyUser.objects.filter(email=email).exists():
            continue  # Skip duplicates

        try:
            user = CompanyUser.objects.create(
                first_name=row.get("first_name", ""),
                last_name=row.get("last_name", ""),
                email=email,
                age=row.get("age"),
                gender=row.get("gender"),
                location=row.get("location"),
                timezone=row.get("timezone"),
                date_joined= now(),
                org_id_id = cache.get("org_id")
            )
            print(user)
            created_users.append({
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "age": user.age,
                "gender": user.gender,
                "location": user.location,
                "timezone": user.timezone,
                "date_joined": user.date_joined,
                "org_id_id":user.org_id_id
            })
        except Exception as e:
            print(e)

    return Response({"users": created_users}, status=status.HTTP_201_CREATED)

@csrf_exempt
@api_view(['POST'])
def delete_users(request):
    """Delete users from the organization"""
    user_ids = request.data.get('user_ids', [])
    if not isinstance(user_ids, list):
        return Response({"error": "user_ids must be a list"}, status=status.HTTP_400_BAD_REQUEST)
    deleted_count, _ = CompanyUser.objects.filter(id__in=user_ids).delete()
    return Response({"status": "success", "deleted": deleted_count}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_username(request):
    """Fetch the username of the logged-in user"""
    user_id = cache.get('user_id')
    user = User.objects.filter(user_id=user_id)

    if not user:
        return JsonResponse({'error': 'User not found'}, status=404)
        
    data = user.values('username', 'email')[0]
    data['username'] = data['username'].title()
    return JsonResponse(data)

@api_view(['POST'])
def forgot_password(request):
    """Send OTP for password reset"""
    email = request.data.get('email')
    if not email:
        return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)

    otp = str(random.randint(100000, 999999))

    cache.set(f"otp_{email}", otp, timeout=300)

    subject = 'Your SmartReachAI Password Reset OTP'
    message = f"""
    Hello {user.username},

    We received a request to reset your SmartReachAI password.

    Your OTP is: {otp}

    This OTP will expire in 10 minutes. If you didn't request this, please ignore this email.

    Thank you,
    SmartReachAI Team
    """
    send_mail(subject, message, 'noelab04@gmail.com', [email])

    return Response({'message': 'OTP sent to your email.'})

@api_view(['POST'])
def verify_otp(request):
    """Verify OTP for password reset"""
    email = request.data.get('email')
    otp = request.data.get('otp')

    if not email or not otp:
        return Response({"error": "Email and OTP are required."}, status=status.HTTP_400_BAD_REQUEST)

    cached_otp = cache.get(f"otp_{email}")
    if not cached_otp:
        return Response({"error": "OTP expired or invalid."}, status=status.HTTP_400_BAD_REQUEST)

    if cached_otp != otp:
        return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({"message": "OTP verified successfully."})

@api_view(['POST'])
def reset_password(request):
    """Reset password after OTP verification"""
    email = request.data.get('email')
    new_password = request.data.get('new_password')

    if not email or not new_password:
        return Response({"error": "Email and new password are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        user.set_password(new_password)
        user.save()
        cache.delete(f"otp_{email}")
        return Response({"message": "Password reset successfully."})
    except User.DoesNotExist:
        return Response({"error": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)