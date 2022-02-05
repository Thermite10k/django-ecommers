
from django.shortcuts import render
from django.http import JsonResponse
#from .products import products
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from base.models import Product, Order, OrderItem, ShippingAddress
from django.contrib.auth.models import User
from base.serializer import ProductSerializer, OrderSerializer



from rest_framework import status

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    
    user = request.user
    data = request.data

    orderItems = data['orderItems']

    if orderItems and len(orderItems)==0:
        return Response({'detail': 'No Order Item'}, status=status.HTTP_400_BAD_REQUEST)
    else:

        # 1 - create order
        order = Order.objects.create(
            user = user,
            paymentMethod = data['paymentMethod'],
            taxPrice = data['taxPrice'],
            shippingPrice= data['shippingPrice'],
            totalPrice = data['totalPrice']
        )

        # 2 - create shipping address

        shipping = ShippingAddress.objects.create(
            order = order,
            address = data['shippingAddress']['address'],
            postalCode = data['shippingAddress']['postalCode'],
            country = data['shippingAddress']['country'],
            city = data['shippingAddress']['city'],
        )
        # 3 - Create Order ITems and set the order to OrderItem relationship

        for i in orderItems:
            product = Product.objects.get(_id=i['product'])
            item = OrderItem.objects.create(
                product = product,
                order = order,
                name = product.name,
                qty = i['qty'],
                price = i['price'],
                image = product.image.url

            )
            # 4 update stock
            product.countInStock -= int(item.qty)
            product.save()

        




    serializer = OrderSerializer(order, many=False)
    return Response(serializer.data)
