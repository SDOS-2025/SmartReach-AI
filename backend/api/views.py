from django.shortcuts import render, redirect
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from social_django.utils import load_strategy, load_backend
from django.views.decorators.csrf import csrf_exempt
from social_core.backends.oauth import BaseOAuth2
from social_core.exceptions import MissingBackend
from django.contrib.auth import login, authenticate, logout, get_user_model

# Create your views here.
@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello from Django!"})


@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(request, email=email, password=password)
    if user is not None:
        login(request, user)
        return Response({'message': 'Login successful'})
    else:
        return Response({'error': 'Invalid credentials'}, status=401)


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







from django.shortcuts import render
from django.core.mail import send_mail, get_connection
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from django.utils.timezone import make_aware
from datetime import datetime
import pytz
import json

from api.tasks import send_scheduled_email
from api.sto_model import get_optimal_send_time
# from api.models import UserEngagement
# from api.models import Organization, CompanyUser

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

@csrf_exempt
def sto_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            # Extract organization and users
            organization_id = data.get("organizationId")
            schedule_date = data.get("scheduleDate")  # Format: "YYYY-MM-DD"
            schedule_time = data.get("scheduleTime")  # Format: "HH:MM"
            subject = data.get("subject")
            message = data.get("message")
            sto_option = data.get("stoOption")

            if not all([organization_id, schedule_date, schedule_time, subject, message,sto_option]):
                return JsonResponse({"error": "Missing required fields"}, status=400)

            # Fetch organization
            # try:
            #     organization = Organization.objects.get(org_id=organization_id)
            # except Organization.DoesNotExist:
            #     return JsonResponse({"error": "Invalid organization ID"}, status=400)

            # Get all users in the organization
            # users = CompanyUser.objects.filter(organization=organization)

            # if not users.exists():
            #     return JsonResponse({"error": "No users found for this organization"}, status=400)

            # Convert schedule time from IST to UTC
            utc_send_time = convert_ist_to_utc(schedule_date, schedule_time)
            return JsonResponse({"message": "Emails scheduled successfully", "send_time": str(utc_send_time)})
            # Loop through each user and schedule the email at the optimal time
            for user in users:
                optimal_time = get_optimal_send_time(user.user_id)

                # Fetch engagement data
                engagement = UserEngagement.objects.filter(user_id=user.user_id).first()
                if not engagement:
                    continue  # Skip users with no engagement data

                user_email = user.email

                # Schedule email via Celery
                send_scheduled_email.apply_async(
                    args=[organization_id, user_email, subject, message],
                    eta=utc_send_time  # Schedule email at the converted UTC time
                )

            return JsonResponse({"message": "Emails scheduled successfully", "send_time": str(utc_send_time)})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)