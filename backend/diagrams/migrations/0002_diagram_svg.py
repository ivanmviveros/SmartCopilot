# Generated by Django 4.0.8 on 2022-12-05 04:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('diagrams', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='diagram',
            name='svg',
            field=models.TextField(default='Nothing'),
        ),
    ]
