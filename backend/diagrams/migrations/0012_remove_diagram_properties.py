# Generated by Django 4.0.5 on 2022-09-19 00:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('diagrams', '0011_remove_diagram_user_id_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='diagram',
            name='properties',
        ),
    ]