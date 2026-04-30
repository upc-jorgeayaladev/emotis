from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, ProductViewSet,
    ProductVariantViewSet, ProductImageViewSet,
    CustomizationOptionViewSet
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'variants', ProductVariantViewSet)
router.register(r'images', ProductImageViewSet)
router.register(r'customization-options', CustomizationOptionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
