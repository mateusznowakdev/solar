# Generated by Django 4.2.4 on 2023-08-23 19:51

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0008_remove_state_id_remove_statet1_id_remove_statet2_id_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="StateCache",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("table", models.CharField(max_length=20, unique=True)),
                ("timestamp_max", models.DateTimeField()),
            ],
        ),
        migrations.RemoveField(
            model_name="logentry",
            name="id",
        ),
        migrations.AlterField(
            model_name="logentry",
            name="timestamp",
            field=models.DateTimeField(primary_key=True, serialize=False),
        ),
    ]
