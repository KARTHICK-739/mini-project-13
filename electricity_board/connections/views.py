from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Connection
from .serializers import ConnectionSerializer
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token


# 🔐 LOGIN
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user:
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})
    else:
        return Response({'error': 'Invalid credentials'}, status=400)


# GET all connections
@api_view(['GET'])
def get_connections(request):
    connections = Connection.objects.all().order_by('id')
    serializer = ConnectionSerializer(connections, many=True)
    return Response(serializer.data)

# ⚠️ TEMPORARY - remove after use
@api_view(['GET'])
def create_superuser(request):
    from django.contrib.auth.models import User
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', '', 'admin123')
        return Response({'message': 'Superuser created!'})
    return Response({'message': 'Already exists!'})

# UPDATE connection
@api_view(['PUT'])
def update_connection(request, pk):
    try:
        connection = Connection.objects.get(id=pk)
    except Connection.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    serializer = ConnectionSerializer(connection, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)