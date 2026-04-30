from django.contrib import admin
from .models import Order, OrderItem, ShippingMethod

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    raw_id_fields = ['product_variant']

@admin.register(ShippingMethod)
class ShippingMethodAdmin(admin.ModelAdmin):
    list_display = ['name', 'cost', 'estimated_days', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'payment_status', 'final_amount', 'created_at']
    list_filter = ['status', 'payment_status', 'created_at']
    search_fields = ['user__email', 'id']
    readonly_fields = ['created_at', 'updated_at', 'total_amount', 'discount_amount', 'final_amount']
    inlines = [OrderItemInline]
    raw_id_fields = ['user', 'shipping_method', 'coupon']

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product_variant', 'quantity', 'unit_price', 'subtotal']
    list_filter = ['order__status']
    search_fields = ['order__id', 'product_variant__sku']
    raw_id_fields = ['order', 'product_variant']
