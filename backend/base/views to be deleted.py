from tkinter import N
from urllib import response
from django.shortcuts import render
from django.http import JsonResponse
#from .products import products
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .models import Product
from django.contrib.auth.models import User
from .serializer import ProductSerializer, UserSerializer, UserSerializerWithToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
# Create your views here.

from django.contrib.auth.hashers import make_password
from rest_framework import status


class MyTokenObtainPairSerializer(TokenObtainPairSerializer): # Ths is nit a view, we are modifying the TokenObtainPairSerializer and adding what we need, view is defined later.
    '''@classmethod
    
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['message'] = 'hello world'
        # ...

        return token'''
        # Returns decoded data

    
    def validate(self, attrs): # returns non decoded next to token so no need for decoding which is usefull
        data = super().validate(attrs)

        serializer =  UserSerializerWithToken(self.user).data

        for k, v in serializer.items(): # serializer fields
            data[k] = v

        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name = data['name'],
            username = data['email'],
            email = data['email'],
            password = make_password(data['password']))


        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)   
    except:
        message = {'detail': 'User with this Email already exists.'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)    


@api_view(['GET'])
def getProducts(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)






@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    '''for i in products:
        if i['_id'] == pk:
           product= i
           break'''

    return Response(serializer.data)