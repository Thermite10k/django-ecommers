# Generated by Django 4.0.1 on 2022-02-04 17:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0003_product_image'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='OredrItem',
            new_name='OrderItem',
        ),
    ]
