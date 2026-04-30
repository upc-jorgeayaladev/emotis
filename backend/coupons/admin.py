from django.contrib import admin
from .models import Coupon, CouponUsage

class CouponUsageInline(admin.TabularInline):
    model = CouponUsage
    extra = 0
    readonly_fields = ['used_at']
    raw_id_fields = ['user', 'order']

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_type', 'discount_value', 'is_valid', 'used_count', 'valid_to']
    list_filter = ['discount_type', 'applies_to', 'is_active', 'valid_from', 'valid_to']
    search_fields = ['code']
    inlines = [CouponUsageInline]
    readonly_fields = ['used_count']

    def is_valid(self, obj):
        return obj.is_valid
    is_valid.boolean = True
    is_valid.short_description = 'Válido'

@admin.register(CouponUsage)
class CouponUsageAdmin(admin.ModelAdmin):
    list_display = ['coupon', 'user', 'order', 'used_at']
    list_filter = ['used_at']
    search_fields = ['coupon__code', 'user__email']
    raw_id_fields = ['coupon', 'user', 'order']
    readonly_fields = ['used_at']
