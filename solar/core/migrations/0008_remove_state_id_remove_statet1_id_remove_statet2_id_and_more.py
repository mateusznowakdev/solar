# Generated by Django 4.2.4 on 2023-08-21 23:18

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0007_state_tiers"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="state",
            name="id",
        ),
        migrations.RemoveField(
            model_name="statet1",
            name="id",
        ),
        migrations.RemoveField(
            model_name="statet2",
            name="id",
        ),
        migrations.RemoveField(
            model_name="statet3",
            name="id",
        ),
        migrations.RemoveField(
            model_name="statet4",
            name="id",
        ),
        migrations.AlterField(
            model_name="state",
            name="timestamp",
            field=models.DateTimeField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name="statet1",
            name="timestamp",
            field=models.DateTimeField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name="statet2",
            name="timestamp",
            field=models.DateTimeField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name="statet3",
            name="timestamp",
            field=models.DateTimeField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name="statet4",
            name="timestamp",
            field=models.DateTimeField(primary_key=True, serialize=False),
        ),
    ]
