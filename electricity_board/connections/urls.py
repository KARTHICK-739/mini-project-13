from django.urls import path
from .views import get_connections, update_connection

urlpatterns = [
    path('connections/', get_connections),
    path('connections/<int:pk>/', update_connection),
]