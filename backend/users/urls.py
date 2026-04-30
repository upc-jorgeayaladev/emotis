from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, LogoutView,
    ProfileView, UserAddressListCreateView, UserAddressDetailView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('addresses/', UserAddressListCreateView.as_view(), name='address-list-create'),
    path('addresses/<int:pk>/', UserAddressDetailView.as_view(), name='address-detail'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
