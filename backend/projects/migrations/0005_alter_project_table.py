# Generated by Django 4.0.5 on 2022-10-22 23:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0004_remove_project_description_project_user_id'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='project',
            table='projects',
        ),
    ]
