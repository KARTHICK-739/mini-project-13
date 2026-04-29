from django.urls import path
from .views import get_connections, update_connection, login_view

urlpatterns = [
    path('login/', login_view),
    path('connections/', get_connections),
    path('connections/<int:pk>/', update_connection),
       path('create-superuser/', create_superuser),  # ⚠️ temporar
]