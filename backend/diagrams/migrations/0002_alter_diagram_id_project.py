# Generated by Django 4.0.5 on 2022-10-25 04:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0006_alter_project_user_id'),
        ('diagrams', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='diagram',
            name='id_project',
            field=models.ForeignKey(blank=True, db_column='id_project', null=True, on_delete=django.db.models.deletion.CASCADE, to='projects.project'),
        ),
    ]
