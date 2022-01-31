from tkinter import N
from urllib import response
from django.shortcuts import render
from django.http import JsonResponse
#from .products import products
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.models import Product
from django.contrib.auth.models import User
from base.serializer import ProductSerializer, UserSerializer, UserSerializerWithToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
# Create your views here.

from django.contrib.auth.hashers import make_password
from rest_framework import status
