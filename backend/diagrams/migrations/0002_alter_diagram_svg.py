# Generated by Django 4.0.5 on 2022-11-18 23:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('diagrams', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='diagram',
            name='svg',
            field=models.TextField(default='Nothing'),
        ),
    ]
