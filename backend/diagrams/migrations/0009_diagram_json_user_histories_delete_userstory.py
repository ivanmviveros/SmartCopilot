# Generated by Django 4.0.5 on 2022-09-10 15:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('diagrams', '0008_rename_user_diagram_user_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='diagram',
            name='json_user_histories',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.DeleteModel(
            name='UserStory',
        ),
    ]