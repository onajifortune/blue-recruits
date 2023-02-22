from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='usa_dashboard'),
    path('my-info', views.info, name='usa_info'),
    path('my-verification', views.verification, name='usa_verification'),
]