
from django.shortcuts import render
from django.http import JsonResponse
#from .products import products
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.core.paginator import Paginator, EmptyPage,PageNotAnInteger
from base.models import Product, Order, OrderItem, ShippingAddress
from django.contrib.auth.models import User
from base.serializer import ProductSerializer, OrderSerializer
from rest_framework import status

from datetime import datetime

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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer  (orders, many=True)
    return Response(serializer.data)  

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):

    user = request.user
    try:
        order = Order.objects.get(_id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)

            return Response(serializer.data)

        else:
            Response({'detail':'Not authorizet to view this order'}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)       

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(_id=pk)

    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()

    return Response('Order was paid')

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):

    params = request.query_params
    page = params.get('page')
    print('page',page)

    if page == 'null' or page == None:
        page = 1


   
    orders = Order.objects.all()

    paginator = Paginator(orders,10)

    try:
        orders = paginator.page(page)
    except PageNotAnInteger:
        orders = paginator.page(1)
    except EmptyPage:
        orders = paginator.page(paginator.num_pages)

    if page == None:
        page = 1    
    page = int(page)        


    serializer = OrderSerializer  (orders, many=True)
    
    return Response({'orders':serializer.data,'page':page, 'pages':paginator.num_pages}) 

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(_id=pk)

    order.isDelivered = True
    order.deliveredAt = datetime.now()
    order.save()

    return Response('Order was Delivered')