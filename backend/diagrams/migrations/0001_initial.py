# Generated by Django 4.0.5 on 2022-12-09 17:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('projects', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Diagram',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
                ('description', models.TextField(blank=True, null=True)),
                ('xml', models.TextField()),
                ('svg', models.TextField(default='Nothing')),
                ('json_user_histories', models.JSONField(blank=True, null=True)),
                ('creation_date', models.DateTimeField(blank=True, null=True)),
                ('update_date', models.DateTimeField(blank=True, null=True)),
                ('id_project', models.ForeignKey(blank=True, db_column='id_project', null=True, on_delete=django.db.models.deletion.CASCADE, to='projects.project')),
            ],
            options={
                'db_table': 'diagrams',
            },
        ),
    ]
