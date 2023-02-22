from django.shortcuts import render
from django.http import HttpRequest
from django.contrib.auth.decorators import login_required

# Create your views here.
@login_required
def index(request : HttpRequest):
    return render(request, 'dashboard/AUS/pop6.html')