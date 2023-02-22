from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='aus_dashboard'),
    path('my-info', views.info, name='aus_info'),
    path('my-verification', views.verification, name='aus_verification'),
]