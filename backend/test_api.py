#!/usr/bin/env python
"""Test script for Emotis Regalos API"""
import requests
import json

BASE_URL = 'http://127.0.0.1:8000/api'

def test_register():
    print("\n=== Testing User Registration ===")
    data = {
        'email': 'cliente@emotis.com',
        'first_name': 'Cliente',
        'last_name': 'Emotis',
        'phone': '987654321',
        'address': 'Av. Larco 123, Miraflores',
        'district': 'Miraflores',
        'password': 'cliente123',
        'password_confirm': 'cliente123'
    }
    r = requests.post(f'{BASE_URL}/users/register/', json=data)
    print(f'Status: {r.status_code}')
    if r.status_code == 201:
        print('[OK] Registration successful')
        return r.json()
    else:
        print(f'Response: {r.text}')
        return None

def test_login(email, password):
    print("\n=== Testing User Login ===")
    data = {'email': email, 'password': password}
    r = requests.post(f'{BASE_URL}/users/login/', json=data)
    print(f'Status: {r.status_code}')
    if r.status_code == 200:
        print('[OK] Login successful')
        return r.json()
    else:
        print(f'Response: {r.text}')
        return None

def test_get_products(token=None):
    print("\n=== Testing Get Products ===")
    headers = {'Authorization': f'Bearer {token}'} if token else {}
    r = requests.get(f'{BASE_URL}/products/products/', headers=headers)
    print(f'Status: {r.status_code}')
    if r.status_code == 200:
        data = r.json()
        print(f'[OK] Found {len(data.get("results", []))} products')
        return data
    else:
        print(f'Response: {r.text}')
        return None

def test_get_categories(token=None):
    print("\n=== Testing Get Categories ===")
    headers = {'Authorization': f'Bearer {token}'} if token else {}
    r = requests.get(f'{BASE_URL}/products/categories/', headers=headers)
    print(f'Status: {r.status_code}')
    if r.status_code == 200:
        data = r.json()
        print(f'[OK] Found {len(data.get("results", []))} categories')
        return data
    else:
        print(f'Response: {r.text}')
        return None

def test_get_cart(token):
    print("\n=== Testing Get Cart ===")
    headers = {'Authorization': f'Bearer {token}'}
    r = requests.get(f'{BASE_URL}/carts/cart/', headers=headers)
    print(f'Status: {r.status_code}')
    if r.status_code == 200:
        print('[OK] Cart retrieved')
        return r.json()
    else:
        print(f'Response: {r.text}')
        return None

if __name__ == '__main__':
    # Test registration
    reg_data = test_register()

    # Test login
    login_data = test_login('cliente@emotis.com', 'cliente123')
    if login_data:
        token = login_data.get('access')

        # Test getting products
        test_get_products(token)

        # Test getting categories
        test_get_categories(token)

        # Test getting cart
        test_get_cart(token)

    print("\n=== All tests completed ===")
