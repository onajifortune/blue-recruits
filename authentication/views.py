from django.shortcuts import render, redirect
from django.http import HttpRequest
from django.contrib.auth import authenticate
from django.contrib.auth import login as login_user
from django.contrib.auth import logout as logout_user
from .models import Client

# Create your views here.

def login(request: HttpRequest):
    print(request.user)
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(request, email=email, password=password)
        print(user)
        try:
            if user.location == 'USA':
                login_user(request, user)
                return redirect('usa_dashboard')
            elif user.location == 'AUS':
                login_user(request, user)
                return redirect('aus_dashboard')
        except:
            return render(request, 'dashboard/login.html')
    return render(request, 'dashboard/login.html')
    

def register(request: HttpRequest):
    if request.method == 'POST':
        email = request.POST.get('email')
        username = request.POST.get('username')
        password = request.POST.get('password')
        rePassword = request.POST.get('rePassword')
        location = request.POST.get('location')
        new_user = Client.objects.create_user(email=email, username=username, password=password, location=location)
        # user = Client
        return redirect('login')
    return render(request, 'dashboard/register.html')

def logout(request):
    logout_user(request)
    return redirect('login')