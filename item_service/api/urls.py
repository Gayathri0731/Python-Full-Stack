from django.urls import path
from .views import ItemListCreateAPIView, ItemDetailView, ItemUpdateView, ItemDeleteView

urlpatterns = [
    path('api/items/', ItemListCreateAPIView.as_view(), name='item-list-create'),
    path('api/items/<str:pk>/', ItemDetailView.as_view(), name='item-detail'),
    path('api/items/<str:pk>/update/', ItemUpdateView.as_view(), name='item-update'),
    path('api/items/<str:pk>/delete/', ItemDeleteView.as_view(), name='item-delete'),
]