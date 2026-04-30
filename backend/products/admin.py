from django.contrib import admin
from .models import Category, Product, ProductVariant, ProductImage, CustomizationOption

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1

class CustomizationOptionInline(admin.TabularInline):
    model = CustomizationOption
    extra = 1

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'parent', 'created_at']
    list_filter = ['parent']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'category', 'base_price', 'is_customizable', 'is_active', 'created_at']
    list_filter = ['category', 'is_customizable', 'is_active']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductVariantInline, ProductImageInline, CustomizationOptionInline]

@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ['sku', 'product', 'price', 'stock_quantity', 'is_active']
    list_filter = ['is_active', 'product']
    search_fields = ['sku', 'product__name']
    raw_id_fields = ['product']

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'is_main', 'created_at']
    list_filter = ['is_main']
    search_fields = ['product__name']

@admin.register(CustomizationOption)
class CustomizationOptionAdmin(admin.ModelAdmin):
    list_display = ['product', 'name', 'option_type', 'is_required']
    list_filter = ['option_type', 'is_required']
    search_fields = ['product__name', 'name']
