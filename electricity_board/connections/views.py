from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Connection
from .serializers import ConnectionSerializer


# GET all connections
@api_view(['GET'])
def get_connections(request):
    connections = Connection.objects.all().order_by('id')
    serializer = ConnectionSerializer(connections, many=True)
    return Response(serializer.data)


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