from rest_framework import serializers
from .models import Order, OrderItem, ShippingMethod
from products.serializers import ProductVariantSerializer

class ShippingMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingMethod
        fields = ['id', 'name', 'description', 'cost', 'estimated_days', 'is_active', 'created_at']


class OrderItemSerializer(serializers.ModelSerializer):
    product_variant = ProductVariantSerializer(read_only=True)
    product_variant_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product_variant', 'product_variant_id', 'quantity', 'unit_price', 'customization_data', 'subtotal']
        read_only_fields = ['id', 'unit_price', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    coupon_code = serializers.CharField(write_only=True, required=False, allow_blank=True)
    shipping_address_data = serializers.JSONField(write_only=True)
    shipping_method_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'shipping_address', 'shipping_method', 'total_amount',
                  'discount_amount', 'final_amount', 'status', 'payment_status',
                  'coupon', 'notes', 'items', 'created_at', 'updated_at',
                  'coupon_code', 'shipping_address_data', 'shipping_method_id']
        read_only_fields = ['id', 'user', 'shipping_address', 'shipping_method',
                           'total_amount', 'discount_amount', 'final_amount',
                           'status', 'payment_status', 'coupon', 'created_at', 'updated_at']

    def create(self, validated_data):
        from carts.models import Cart
        from coupons.models import Coupon

        items_data = validated_data.pop('items')
        coupon_code = validated_data.pop('coupon_code', '')
        shipping_address_data = validated_data.pop('shipping_address_data')
        shipping_method_id = validated_data.pop('shipping_method_id')

        user = self.context['request'].user
        cart = Cart.objects.filter(user=user).first()

        if not cart or not cart.items.exists():
            raise serializers.ValidationError('El carrito está vacío')

        # Calculate totals
        total_amount = sum(item.subtotal for item in cart.items.all())
        discount_amount = 0
        coupon = None

        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code, is_active=True)
                if coupon.is_valid:
                    discount_amount = coupon.calculate_discount(total_amount)
                    coupon.used_count += 1
                    coupon.save()
            except Coupon.DoesNotExist:
                pass

        final_amount = total_amount - discount_amount

        # Create order
        order = Order.objects.create(
            user=user,
            shipping_address=shipping_address_data,
            shipping_method_id=shipping_method_id,
            total_amount=total_amount,
            discount_amount=discount_amount,
            final_amount=final_amount,
            coupon=coupon,
            notes=validated_data.get('notes', '')
        )

        # Create order items
        for item_data in items_data:
            variant = item_data['product_variant']
            OrderItem.objects.create(
                order=order,
                product_variant=variant,
                quantity=item_data['quantity'],
                unit_price=variant.price,
                customization_data=item_data.get('customization_data', {}),
                subtotal=item_data['quantity'] * variant.price
            )

        # Clear cart
        cart.items.all().delete()

        return order
