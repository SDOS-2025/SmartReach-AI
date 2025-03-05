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