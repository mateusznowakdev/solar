# Generated by Django 4.2.4 on 2023-08-06 11:35

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0005_controllog"),
    ]

    operations = [
        migrations.RenameModel(
            old_name="ControlLog",
            new_name="LogEntry",
        ),
    ]