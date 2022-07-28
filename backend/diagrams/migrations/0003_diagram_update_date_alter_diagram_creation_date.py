# Generated by Django 4.0.5 on 2022-07-15 02:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('diagrams', '0002_rename_diagrams_diagram'),
    ]

    operations = [
        migrations.AddField(
            model_name='diagram',
            name='update_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='diagram',
            name='creation_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]