from django.shortcuts import render
from django.http import HttpRequest
from django.contrib.auth.decorators import login_required

# Create your views here.
@login_required
def index(request: HttpRequest):
    print(request)
    return render(request, 'dashboard/USA/index.html')

@login_required
def info(request: HttpRequest):
    return render(request, 'dashboard/USA/personal.html')

@login_required
def verification(request: HttpRequest):
    return render(request, 'dashboard/USA/verification.html')