from django.core.management.base import BaseCommand
from products.models import Category, Product, ProductVariant, ProductImage, CustomizationOption
import random

class Command(BaseCommand):
    help = 'Populate database with sample data for Emotis Regalos'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating sample data...')

        # Create more categories
        categories_data = [
            {'name': 'Vinos', 'slug': 'vinos', 'description': 'Vinos selectos para regalos'},
            {'name': 'Llaveros', 'slug': 'llaveros', 'description': 'Llaveros personalizados'},
            {'name': 'Tazones', 'slug': 'tazones', 'description': 'Tazones grandes personalizados'},
            {'name': 'Tazas Mágicas', 'slug': 'tazas-magicas', 'description': 'Tazas con cambio de color'},
            {'name': 'Botellas Térmicas', 'slug': 'botellas-termicas', 'description': 'Botellas térmicas personalizadas'},
            {'name': 'Lapiceros', 'slug': 'lapiceros', 'description': 'Lapiceros personalizados'},
            {'name': 'Agendas', 'slug': 'agendas', 'description': 'Agendas personalizadas'},
            {'name': 'Aniversarios', 'slug': 'aniversarios', 'description': 'Artículos para aniversarios'},
            {'name': 'Corporativo Premium', 'slug': 'corporativo-premium', 'description': 'Artículos premium para empresas'},
            {'name': 'Eventos Empresariales', 'slug': 'eventos-empresariales', 'description': 'Regalos para eventos de empresa'},
        ]

        created_categories = []
        for cat_data in categories_data:
            cat, created = Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults=cat_data
            )
            created_categories.append(cat)
            if created:
                self.stdout.write(f'Created category: {cat.name}')

        # Get or create base categories
        tazas_cat, _ = Category.objects.get_or_create(
            slug='tazas',
            defaults={'name': 'Tazas', 'description': 'Tazas personalizadas'}
        )
        polos_cat, _ = Category.objects.get_or_create(
            slug='polos',
            defaults={'name': 'Polos', 'description': 'Polos personalizados'}
        )
        piscos_cat, _ = Category.objects.get_or_create(
            slug='piscos-vinos',
            defaults={'name': 'Piscos y Vinos', 'description': 'Bebidas premium'}
        )
        
        created_categories.extend([tazas_cat, polos_cat, piscos_cat])

        # Create 200+ products with variants
        products_data = []
        product_count = 0

        # Tazas variations (30 products)
        for i in range(1, 31):
            product_count += 1
            products_data.append({
                'name': f'Taza Personalizada Modelo {i}',
                'slug': f'taza-personalizada-modelo-{i}',
                'description': f'Taza de cerámica personalizable. Modelo {i} con diseños únicos para regalos corporativos y eventos.',
                'category': random.choice([tazas_cat, random.choice(created_categories)]),
                'base_price': round(random.uniform(20, 45), 2),
                'is_customizable': True,
                'is_active': True,
            })

        # Polos variations (30 products)
        for i in range(1, 31):
            product_count += 1
            products_data.append({
                'name': f'Polo Evento Modelo {i}',
                'slug': f'polo-evento-modelo-{i}',
                'description': f'Polo de algodón premium. Modelo {i} ideal para personalizar con logos y textos.',
                'category': polos_cat,
                'base_price': round(random.uniform(40, 80), 2),
                'is_customizable': True,
                'is_active': True,
            })

        # Piscos/Vinos (20 products)
        for i in range(1, 21):
            product_count += 1
            products_data.append({
                'name': f'Pisco Premium Lote {i}',
                'slug': f'pisco-premium-lote-{i}',
                'description': f'Pisco premium de 750ml. Lote {i} ideal para regalos corporativos.',
                'category': piscos_cat,
                'base_price': round(random.uniform(70, 150), 2),
                'is_customizable': True,
                'is_active': True,
            })

        # More products for other categories
        for cat in created_categories:
            for i in range(1, 11):  # 10 products per new category
                product_count += 1
                products_data.append({
                    'name': f'{cat.name} Personalizado {i}',
                    'slug': f'{cat.slug}-personalizado-{i}',
                    'description': f'Artículo personalizable de {cat.name}. Producto {i} ideal para regalos.',
                    'category': cat,
                    'base_price': round(random.uniform(15, 100), 2),
                    'is_customizable': True,
                    'is_active': True,
                })

        created_products = []
        for prod_data in products_data:
            product, created = Product.objects.get_or_create(
                slug=prod_data['slug'],
                defaults=prod_data
            )
            created_products.append(product)
            if created:
                # Create sample image for each product
                image_url = f'/media/products/sample_{product.id}.jpg'
                ProductImage.objects.create(
                    product=product,
                    image=image_url,
                    alt_text=f'{product.name} - Imagen principal',
                    is_main=True,
                )
                
                # Create variants for each product
                for j in range(1, random.randint(2, 5)):
                    base_sku = prod_data["slug"][:3].upper()
                    sku = f'{base_sku}-{product.id}-{j}'
                    # Make sure SKU is unique
                    counter = 1
                    original_sku = sku
                    while ProductVariant.objects.filter(sku=sku).exists():
                        sku = f'{original_sku}-{counter}'
                        counter += 1
                    
                    attributes = {}
                    if 'polo' in prod_data['slug']:
                        attributes = {'talla': random.choice(['S', 'M', 'L', 'XL']), 'color': random.choice(['Blanco', 'Negro', 'Azul', 'Rojo'])}
                    elif 'taza' in prod_data['slug']:
                        attributes = {'capacidad': random.choice(['11oz', '15oz', '20oz']), 'color': random.choice(['Blanco', 'Negro', 'Rojo'])}
                    else:
                        attributes = {'tipo': random.choice(['Estándar', 'Premium', 'Deluxe'])}

                    ProductVariant.objects.create(
                        product=product,
                        sku=sku,
                        attributes=attributes,
                        price=round(prod_data['base_price'] * random.uniform(0.9, 1.2), 2),
                        stock_quantity=random.randint(10, 100),
                        is_active=True,
                    )

                # Add customization options
                if product.is_customizable:
                    CustomizationOption.objects.get_or_create(
                        product=product,
                        name='Texto personalizado',
                        defaults={'option_type': 'text', 'is_required': False}
                    )
                    CustomizationOption.objects.get_or_create(
                        product=product,
                        name='Logo/Empresa',
                        defaults={'option_type': 'image', 'is_required': False}
                    )

        self.stdout.write(self.style.SUCCESS(f'Successfully created {product_count}+ products with variants!'))
