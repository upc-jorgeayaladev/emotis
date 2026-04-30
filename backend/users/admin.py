from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser, UserAddress

class CustomUserAdmin(BaseUserAdmin):
    list_display = ['email', 'first_name', 'last_name', 'phone', 'district', 'is_staff', 'is_active']
    list_filter = ['is_staff', 'is_active', 'department', 'province']
    search_fields = ['email', 'first_name', 'last_name', 'phone']
    ordering = ['email']

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Información Personal', {'fields': ('first_name', 'last_name', 'phone')}),
        ('Dirección', {'fields': ('address', 'district', 'province', 'department')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas Importantes', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2'),
        }),
    )

    filter_horizontal = ('groups', 'user_permissions',)

class UserAddressAdmin(admin.ModelAdmin):
    list_display = ['user', 'district', 'is_primary', 'created_at']
    list_filter = ['is_primary', 'district']
    search_fields = ['user__email', 'address']
    ordering = ['-created_at']

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(UserAddress, UserAddressAdmin)
