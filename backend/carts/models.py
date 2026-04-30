from django.db import models
from django.contrib.sessions.models import Session
from users.models import CustomUser
from products.models import ProductVariant

class Cart(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, related_name='carts')
    session_key = models.CharField(max_length=40, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = [['user', 'session_key']]

    def __str__(self):
        if self.user:
            return f'Cart - {self.user.email}'
        return f'Cart - Session: {self.session_key}'

    @property
    def total(self):
        return sum(item.subtotal for item in self.items.all())


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product_variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    customization_data = models.JSONField(default=dict, blank=True, help_text='Datos de personalización: texto, logo, etc.')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = [['cart', 'product_variant']]

    def __str__(self):
        return f'{self.cart} - {self.product_variant.sku}'

    @property
    def subtotal(self):
        return self.quantity * self.product_variant.price
