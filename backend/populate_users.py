from django.contrib.auth import get_user_model
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

User = get_user_model()

# List of users to create
users = [
    {'username': 'noeltiju', 'email': 'noelab04@gmail.com', 'password': 'sdos'},
    {'username': 'mehul', 'email': 'mehul@gmail.com', 'password': 'sdos'},
    {'username': 'tharun', 'email': 'tharun@gmail.com', 'password': 'sdos'},
    {'username': 'rahul', 'email': 'rahul@gmail.com', 'password': 'sdos'},
    {'username': 'rohit', 'email': 'rohit@gmail.com', 'password': 'sdos'},
    {'username': 'nidhi', 'email': 'nidhi@gmail.com', 'password': 'sdos'},
    {'username': 'kavya', 'email': 'kavya@gmail.com', 'password': 'sdos'},
    {'username': 'vikas', 'email': 'vikas@gmail.com', 'password': 'sdos'},
    {'username': 'ramesh', 'email': 'ramesh@gmail.com', 'password': 'sdos'},
    {'username': 'sneha', 'email': 'sneha@gmail.com', 'password': 'sdos'},
]

# Create users
for user_data in users:
    try:
        User.objects.create_user(
            email=user_data['email'],
            username=user_data['username'],
            password=user_data['password']
        )
        print(f"User {user_data['username']} added!")
    except Exception as e:
        print(f"Error adding user {user_data['username']}: {str(e)}")

print("All users added successfully!")

for user in User.objects.all():
    print(f"Username: {user.username}, Email: {user.email}, Date Joined: {user.date_joined}")
print('All users added successfully')