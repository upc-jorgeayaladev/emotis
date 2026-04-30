from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ShippingMethodViewSet, OrderListCreateView, OrderDetailView

router = DefaultRouter()
router.register(r'shipping-methods', ShippingMethodViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('orders/', OrderListCreateView.as_view(), name='order-list-create'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
]
