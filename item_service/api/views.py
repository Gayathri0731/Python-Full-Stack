from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Item
from .serializer import ItemSerializer
from rest_framework.exceptions import NotFound

class ItemListCreateAPIView(APIView):
    def get(self, request):
        items = Item.objects.all()
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ItemDetailView (APIView):
    def get(self, request,pk, format = None):
        try:
            item = Item.objects.get(item_id=pk)
            serializer = ItemSerializer(item)
            return Response(serializer.data)
        except Item.DoesNotExist:
            return NotFound("Item not found",code=404)
        
class ItemUpdateView(APIView):
    def put(self, request, pk, format=None):
        item = Item.objects.get(item_id=pk)
        serializer = ItemSerializer(item, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ItemDeleteView(APIView):
    def delete(self, request, pk):
        try:
            item = Item.objects.get(item_id=pk)
            item.delete()
            return Response({"message": "Item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Item.DoesNotExist:
            return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)