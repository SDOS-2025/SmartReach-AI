from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from django.core.cache import cache
from django.db import IntegrityError
from api.models import *
from uuid import uuid4
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.validators import validate_email
from django.utils.timezone import now

User = get_user_model()

# -------------------------
# Login Test Cases
# -------------------------
class LoginTests(TestCase):
    """
    Test suite for user authentication login functionality.
    
    Tests various login scenarios including valid login credentials,
    invalid email formats, missing parameters, and incorrect credentials.
    """
    
    def setUp(self):
        """
        Set up test environment before each test.
        Creates a test client, login URL, and a test user with auth token.
        """
        self.client = Client()
        self.url = reverse('user-login')

        # Create test user
        self.user = User.objects.create_user(
            email='test@example.com',
            username='test@example.com',
            password='secure123'
        )
        Token.objects.create(user=self.user)

    def test_invalid_email_format(self):
        """
        Tests that the API returns a 400 status code when an invalid email format is provided.
        The response should contain an appropriate error message.
        """
        res = self.client.post(self.url, {
            'username': 'not-an-email',
            'password': 'anything'
        }, content_type='application/json')

        self.assertEqual(res.status_code, 400)
        self.assertEqual(res.json()['error'], 'Invalid email address')

    def test_missing_parameters(self):
        """
        Tests that the API returns a 400 status code when required fields are missing.
        The response should contain an appropriate error message.
        """
        res = self.client.post(self.url, {}, content_type='application/json')

        self.assertEqual(res.status_code, 400)
        self.assertEqual(res.json()['error'], 'Missing required fields')

    def test_wrong_email_or_password(self):
        """
        Tests that the API correctly handles incorrect login attempts.
        
        Tests two scenarios:
        1. Wrong password for an existing user
        2. Non-existent email address
        
        Both should return appropriate error codes and messages.
        """
        # Case: Wrong password for existing user
        res = self.client.post(self.url, {
            'username': 'test@example.com',
            'password': 'wrongpass'
        }, content_type='application/json')
        self.assertEqual(res.status_code, 400)
        self.assertEqual(res.json()['error'], 'Wrong password')

        # Case: Email does not exist
        res = self.client.post(self.url, {
            'username': 'nonexistent@example.com',
            'password': 'anything'
        }, content_type='application/json')
        self.assertEqual(res.status_code, 400)
        self.assertEqual(res.json()['error'], 'User not found')

    def test_successful_login_sets_cookie(self):
        """
        Tests successful login functionality.
        
        Verifies that:
        1. The API returns a 200 status code
        2. An authToken cookie is set in the response
        3. The response contains a success message
        """
        res = self.client.post(self.url, {
            'username': 'test@example.com',
            'password': 'secure123'
        }, content_type='application/json')

        self.assertEqual(res.status_code, 200)
        self.assertIn('authToken', res.cookies)
        self.assertEqual(res.json()['message'], 'Login successful')


# -------------------------
# Logout Test Case
# -------------------------
class LogoutTests(TestCase):
    """
    Test suite for user logout functionality.
    
    Tests that the logout endpoint properly clears session data and authentication cookies.
    """
    
    def setUp(self):
        """
        Set up test environment before each test.
        
        Creates:
        1. A test client
        2. A test user with an auth token
        3. Simulates a logged-in state with cookies and cache data
        """
        self.client = Client()
        self.logout_url = reverse('user-logout')
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpass123')
        self.token = Token.objects.create(user=self.user)

        # Simulate login + cached data
        self.client.cookies['authToken'] = self.token.key
        cache.set('user_id', self.user.user_id)
        cache.set('org_id', 'dummy_org')
        cache.set('campaign_id', 'dummy_campaign')
        cache.set('Template', 'dummy_template')

    def test_user_logout_clears_cache_and_cookie(self):
        """
        Tests that the logout endpoint:
        
        1. Returns a 200 status code
        2. Returns a success message
        3. Clears the authToken cookie
        4. Clears all session data from the cache
        """
        res = self.client.get(self.logout_url)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['message'], 'Logged out successfully')
        self.assertEqual(res.cookies['authToken'].value, '')
        self.assertIsNone(cache.get('user_id'))
        self.assertIsNone(cache.get('org_id'))
        self.assertIsNone(cache.get('campaign_id'))
        self.assertIsNone(cache.get('Template'))


# -------------------------
# Signup Test Cases
# -------------------------
class SignupTests(TestCase):
    """
    Test suite for user signup functionality.
    
    Tests both individual and business user signup processes, including
    successful registrations and handling of duplicate email errors.
    """
    
    def setUp(self):
        """
        Set up test environment before each test.
        
        Creates a test client and defines URLs for individual and business signup endpoints.
        """
        self.client = Client()
        self.individual_url = reverse('signup-individuals')
        self.business_url = reverse('signup-business')

    def test_individual_signup_success(self):
        """
        Tests successful individual user signup.
        
        Verifies:
        1. The API returns a 200 status code
        2. The response contains a success message
        3. A user is created in the database with the provided email
        """
        response = self.client.post(self.individual_url, {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'secure123'
        }, content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'User created successfully')
        self.assertTrue(User.objects.filter(email='testuser@example.com').exists())

    def test_individual_signup_integrity_error(self):
        """
        Tests that the API properly handles duplicate email registration attempts.
        
        Verifies that when a user tries to register with an email that already exists:
        1. The API returns a 200 status code (could be improved to 400)
        2. The response contains an appropriate error message
        """
        User.objects.create_user(username='testuser', email='testuser@example.com', password='secure123')

        response = self.client.post(self.individual_url, {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'secure123'
        }, content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['error'], 'A user with that username or email already exists.')

    def test_business_signup_success(self):
        """
        Tests successful business user signup with organization creation.
        
        Verifies:
        1. The API returns a 200 status code
        2. The response contains a success message
        3. A user is created in the database with the provided email
        4. An organization is created and linked to the user
        """
        response = self.client.post(self.business_url, {
            'username': 'bizuser',
            'email': 'biz@example.com',
            'password': 'bizpass123',
            'email_host_user': 'smtp-user',
            'email_host_password': 'smtp-pass',
            'email_host': 'smtp.example.com',
            'email_port': 587,
            'email_use_tls': True
        }, content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'User and organization created successfully')
        self.assertTrue(User.objects.filter(email='biz@example.com').exists())
        self.assertTrue(Organization.objects.filter(org_id__email='biz@example.com').exists())

    def test_business_signup_integrity_error(self):
        """
        Tests that the API properly handles duplicate business email registration attempts.
        
        Verifies that when a business tries to register with an email that already exists:
        1. The API returns a 200 status code (could be improved to 400)
        2. The response contains an appropriate error message
        """
        User.objects.create_user(username='bizuser', email='biz@example.com', password='bizpass123')

        response = self.client.post(self.business_url, {
            'username': 'bizuser',
            'email': 'biz@example.com',
            'password': 'bizpass123',
            'email_host_user': 'smtp-user',
            'email_host_password': 'smtp-pass',
            'email_host': 'smtp.example.com',
            'email_port': 587,
            'email_use_tls': True
        }, content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['error'], 'A user with that username or email already exists.')


# -------------------------
# OAuth Completion Test Cases
# -------------------------
class OAuthAuthCompleteTests(TestCase):
    """
    Test suite for OAuth authentication completion.
    
    Tests the functionality that handles the OAuth callback and establishes
    a user session after successful OAuth authentication.
    """
    
    def setUp(self):
        """
        Set up test environment before each test.
        
        Creates a test client, OAuth completion URL, and a test user.
        """
        self.client = Client()
        self.url = reverse('auth-complete')  # Make sure this matches your urls.py
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='secure123'
        )

    def test_authenticated_user_sets_token_and_redirects(self):
        """
        Tests that for an authenticated user, the OAuth completion:
        
        1. Returns a 200 status code
        2. Sets an authToken cookie
        3. Includes a JavaScript redirect in the response
        4. Sets the user_id in the cache
        """
        self.client.force_login(self.user)
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)
        self.assertIn('authToken', response.cookies)
        self.assertIn('window.location.href', response.content.decode())
        self.assertEqual(cache.get('user_id'), self.user.user_id)

    def test_unauthenticated_user_gets_401(self):
        """
        Tests that for an unauthenticated user, the OAuth completion:
        
        1. Returns a 401 status code
        2. Returns an appropriate error message
        """
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()['error'], 'User not authenticated')


# -------------------------
# Email Template Fetch Tests
# -------------------------
class GetEmailTests(TestCase):
    """
    Test suite for email template retrieval functionality.
    
    Tests the endpoints that fetch email templates in both original/raw
    format and HTML format from the cache.
    """
    
    def setUp(self):
        """
        Set up test environment before each test.
        
        Creates:
        1. A test client
        2. A test user with auth token
        3. Sets authentication cookies and user ID in cache
        4. Defines URLs for retrieving email templates
        """
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='secure123')
        self.token = Token.objects.create(user=self.user)
        self.client.cookies['authToken'] = self.token.key
        cache.set('user_id', self.user.user_id)

        self.original_url = reverse('get-email-original')  # Use correct route name
        self.html_url = reverse('get-email')               # Use correct route name

    def test_get_email_original_template_present(self):
        """
        Tests that when an email template is present in the cache,
        the API returns it in raw/original format correctly.
        
        Verifies:
        1. The API returns a 200 status code
        2. The response contains the expected template subject and body
        """
        cache.set('Template', {'Subject': 'Test Subject', 'Body': 'Test Body'})
        response = self.client.get(self.original_url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['Subject'], 'Test Subject')
        self.assertIn('Body', response.json())

    def test_get_email_original_template_missing(self):
        """
        Tests that when no email template is present in the cache,
        the API returns an appropriate error.
        
        Verifies:
        1. The API returns a 404 status code
        2. The response contains an appropriate error message
        """
        cache.delete('Template')
        response = self.client.get(self.original_url)

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'No email template found')

    def test_get_email_template_html_present(self):
        """
        Tests that when an email template is present in the cache,
        the API returns it in HTML format correctly.
        
        Verifies:
        1. The API returns a 200 status code
        2. The response contains HTML markup in the body
        3. The subject is preserved
        """
        cache.set('Template', {'Subject': 'Test Subject', 'Body': 'Test Body'})
        response = self.client.get(self.html_url)

        self.assertEqual(response.status_code, 200)
        self.assertIn('<html', response.json()['Body'])
        self.assertIn('Test Subject', response.json()['Subject'])

    def test_get_email_template_html_missing(self):
        """
        Tests that when no email template is present in the cache,
        the API returns an appropriate error when requesting HTML format.
        
        Verifies:
        1. The API returns a 404 status code
        2. The response contains an appropriate error message
        """
        cache.delete('Template')
        response = self.client.get(self.html_url)

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'No email template found')

# -------------------------
# Company User Test Cases
# -------------------------
class CompanyUserTests(TestCase):
    """
    Test suite for managing company users within an organization.

    Tests the functionality for adding, deleting, and bulk uploading company users
    via CSV, ensuring proper integration with the organization model and database.
    """

    def setUp(self):
        """
        Set up test environment before each test.

        Creates:
        1. A test client
        2. A test user with an associated organization
        3. Sets the organization ID in the cache for authentication simulation
        """
        self.client = Client()
        self.user = User.objects.create_user(
            username='orguser',
            email='org@example.com',
            password='secure123'
        )
        self.org = Organization.objects.create(
            org_id=self.user,
            email_host_user="smtp-user@example.com",
            email_host_password="smtp-pass",
            email_host="smtp.example.com",
            email_port=587,
            email_use_tls=True
        )
        cache.set("org_id", self.user.user_id)

    def test_add_user_success(self):
        """
        Tests adding a single valid user to the organization.

        Verifies:
        1. The API returns a 201 status code
        2. The response contains the added user's email
        3. The user is persisted in the database
        """
        data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@example.com",
            "age": 28,
            "gender": "M",
            "location": "Delhi",
            "timezone": "Asia/Kolkata"
        }
        response = self.client.post(reverse('add-user'), data, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["user"]["email"], "john@example.com")
        self.assertTrue(CompanyUser.objects.filter(email="john@example.com").exists())

    def test_delete_users(self):
        """
        Tests deleting a user from the organization.

        Verifies:
        1. The API returns a 200 status code
        2. The response confirms the number of deleted users
        3. The user is removed from the database
        """
        user = CompanyUser.objects.create(
            first_name="Jane",
            last_name="Smith",
            email="jane@example.com",
            age=30,
            gender="F",
            location="Mumbai",
            timezone="IST",
            date_joined=now(),
            org_id=self.org
        )
        response = self.client.post(
            reverse("delete-users"),
            {"user_ids": [user.id]},
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["deleted"], 1)
        self.assertFalse(CompanyUser.objects.filter(id=user.id).exists())

    def test_upload_company_users_csv(self):
        """
        Tests uploading a CSV file to add multiple company users.

        Verifies:
        1. The API returns a 201 status code
        2. The users from the CSV are persisted in the database
        3. The response contains the correct number of added users
        """
        csv_data = (
            "first_name,last_name,email,age,gender,location,timezone\n"
            "Alice,Wonderland,alice@example.com,25,F,Bangalore,IST\n"
        )
        file = SimpleUploadedFile("users.csv", csv_data.encode(), content_type="text/csv")
        response = self.client.post(reverse("upload-company-users-csv"), {"file": file})

        self.assertEqual(response.status_code, 201)
        self.assertTrue(CompanyUser.objects.filter(email="alice@example.com").exists())
        self.assertEqual(len(response.json()["users"]), 1)


# -------------------------
# Model Constraints Test Cases
# -------------------------
class ModelConstraintsTests(TestCase):
    """
    Test suite for verifying database model constraints.

    Tests the integrity constraints across various models including User,
    Organization, CompanyUser, CampaignDetails, CompanyUserEngagement,
    CampaignStatistics, and EmailLog to ensure uniqueness and relational
    integrity are enforced.
    """

    def setUp(self):
        """
        Set up test environment before each test.

        Creates:
        1. A test user
        2. An organization associated with the test user
        """
        self.user = User.objects.create_user(
            email="test@example.com",
            username="testuser",
            password="secure123"
        )
        self.org = Organization.objects.create(
            org_id=self.user,
            email_host_user="org@example.com",
            email_host_password="password",
            email_host="smtp.example.com",
            email_port=587,
            email_use_tls=True
        )

    def test_email_uniqueness_constraint(self):
        """
        Tests that the User model enforces email uniqueness.

        Verifies that attempting to create a user with a duplicate email
        raises an IntegrityError.
        """
        User.objects.create_user(email="unique@example.com", username="user1", password="1234")
        with self.assertRaises(IntegrityError):
            User.objects.create_user(email="unique@example.com", username="user2", password="1234")

    def test_username_uniqueness_constraint(self):
        """
        Tests that the User model enforces username uniqueness.

        Verifies that attempting to create a user with a duplicate username
        raises an IntegrityError.
        """
        User.objects.create_user(email="another@example.com", username="uniqueuser", password="1234")
        with self.assertRaises(IntegrityError):
            User.objects.create_user(email="another2@example.com", username="uniqueuser", password="1234")

    def test_unique_email_host_user(self):
        """
        Tests that the Organization model enforces uniqueness for email_host_user.

        Verifies that attempting to create an organization with a duplicate
        email_host_user raises an IntegrityError.
        """
        with self.assertRaises(IntegrityError):
            Organization.objects.create(
                org_id=self.user,
                email_host_user="org@example.com",
                email_host_password="password",
                email_port=587,
                email_use_tls=True
            )

    def test_company_user_constraints(self):
        """
        Tests that the CompanyUser model enforces email uniqueness within an organization.

        Verifies that attempting to create a company user with a duplicate email
        raises an IntegrityError.
        """
        user = CompanyUser.objects.create(
            org_id=self.org,
            email="user1@example.com",
            first_name="John",
            last_name="Doe",
            age=25,
            gender="M",
            location="NY",
            timezone="UTC"
        )
        with self.assertRaises(IntegrityError):
            CompanyUser.objects.create(
                org_id=self.org,
                email="user1@example.com",
                first_name="Jane",
                last_name="Doe",
                age=30,
                gender="F",
                location="LA",
                timezone="PST"
            )

    def test_campaign_details_creation(self):
        """
        Tests successful creation of a CampaignDetails instance.

        Verifies that a campaign can be created and assigned a unique campaign_id.
        """
        campaign = CampaignDetails.objects.create(
            org_id=self.org,
            campaign_name="Campaign 1",
            campaign_description="A sample campaign",
            campaign_start_date=now(),
            campaign_end_date=now(),
            campaign_mail_subject="Hello",
            campaign_mail_body="Body text",
            send_time=now()
        )
        self.assertIsNotNone(campaign.campaign_id)

    def test_engagement_constraints(self):
        """
        Tests successful creation of a CompanyUserEngagement instance.

        Verifies that an engagement record can be created linking a company user
        and a campaign, with a valid primary key assigned.
        """
        company_user = CompanyUser.objects.create(
            org_id=self.org,
            email="user2@example.com",
            first_name="Alice",
            last_name="Smith",
            age=28,
            gender="F",
            location="Delhi",
            timezone="IST"
        )
        campaign = CampaignDetails.objects.create(
            org_id=self.org,
            campaign_name="Campaign 2",
            campaign_description="Another campaign",
            campaign_start_date=now(),
            campaign_end_date=now(),
            campaign_mail_subject="Subject",
            campaign_mail_body="Body",
            send_time=now()
        )
        engagement = CompanyUserEngagement.objects.create(
            user_id=company_user,
            campaign_id=campaign,
            org_id=self.org,
            send_time=now(),
            engagement_delay=0.0
        )
        self.assertTrue(engagement.pk is not None)

    def test_statistics_constraints(self):
        """
        Tests successful creation of a CampaignStatistics instance.

        Verifies that campaign statistics can be created with valid metrics
        and a primary key is assigned.
        """
        campaign = CampaignDetails.objects.create(
            org_id=self.org,
            campaign_name="Campaign Stats",
            campaign_description="Stats test",
            campaign_start_date=now(),
            campaign_end_date=now(),
            campaign_mail_subject="Subject",
            campaign_mail_body="Body",
            send_time=now()
        )
        stat = CampaignStatistics.objects.create(
            campaign_id=campaign,
            org_id=self.org,
            user_click_rate=0.3,
            user_open_rate=0.5,
            user_engagement_delay=12.5
        )
        self.assertTrue(stat.pk is not None)

    def test_email_log_constraints(self):
        """
        Tests successful creation of an EmailLog instance.

        Verifies that an email log entry can be created with a valid primary key.
        """
        log = EmailLog.objects.create(
            organization_id=1,
            user_email="log@example.com",
            subject="Test Email",
            status="Sent"
        )
        self.assertTrue(log.pk is not None)