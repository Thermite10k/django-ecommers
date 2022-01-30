from tkinter import N
from django.shortcuts import render
from django.http import JsonResponse
#from .products import products
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product
from .serializer import ProductSerializer, UserSerializer, UserSerializerWithToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
# Create your views here.


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


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/products/',
        '/api/products/create/',

        '/api/products/upload/',

        '/api/products/<id>/reviews/',

        '/api/products/top/',
        '/api/products<id>/',

        '/api/products/delete/<id>/',
        '/api/products/<update>/<id>/',
        
    ]

    return Response(routes)


@api_view(['GET'])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
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