from ast import keyword
from django.core.paginator import Paginator, EmptyPage,PageNotAnInteger
from django.shortcuts import render
from django.http import JsonResponse
#from .products import products
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.models import Product, Review

from base.serializer import ProductSerializer
# Create your views here.


from rest_framework import status



@api_view(['GET'])
def getProducts(request):

    params = request.query_params
    keyword = params.get('keyword')
    page = (params.get('page'))
    
    
    if keyword == 'null' or keyword== None:
        keyword=''
    if page == 'null' or page== None:
        page=1

    products = Product.objects.filter(name__icontains=keyword)
    

    paginator = Paginator(products, 4)
    
    


    try:
        products = paginator.page(page)
    except PageNotAnInteger :
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    if page == None:
        page = 1    
    page = int(page)

        




    serializer = ProductSerializer(products, many=True)
    return Response({'products':serializer.data,'page': page, 'pages': paginator.num_pages})



@api_view(['GET'])
def getTopProducts(request):
    products = Product.objects.filter(rating__gte=4).order_by('-rating')[0:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data) #:(


@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    '''for i in products:
        if i['_id'] == pk:
           product= i
           break'''

    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user
    product = Product.objects.create(
        user=user,
        name='Sample Name',
        price=0,
        brand='Sample Brand',
        countInStock=0,
        category='Sample Category',
        description=''
    )
    serializer = ProductSerializer(product, many=False)
    
    return Response(serializer.data)    

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    product = Product.objects.get(_id=pk)
    product.name=data['name']
    product.price=data['price']
    product.brand=data['brand']
    product.countInStock=data['countInStock']
    product.category=data['category']
    product.description=data['description']

    product.save()
    serializer = ProductSerializer(product, many=False)
    

    return Response(serializer.data)    

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(_id=pk)
    product.delete()
    


    return Response('Product deleted')

@api_view(['POST'])
def uploadImage(request):
    data = request.data

    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)

    product.image = request.FILES.get('image')
    print(request.FILES.get('image'))
    product.save()
    return Response('Image Uploaded')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    product = Product.objects.get(_id=pk)
    user = request.user
    data = request.data

    #1 - Review already exists
    alreadyExists = product.review_set.filter(user=user).exists()
    
    if alreadyExists:
        content = {'detail':'Product already reviewd'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    #2 - No rating or zero
    elif data['rating'] == 0:
        print(data['rating'])
        content = {'detail':'Please select a rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    #3 - Create review
    else:
        review = Review.objects.create(
            user = user,
            product = product,
            name = user.first_name,
            rating = data['rating'],
            comment = data['comment'],
        )
        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating

        product.rating   = total / len(reviews) 
        product.save()
        
        return Response('Review Added')

            


    
