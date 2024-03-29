# Generated by Django 5.0.2 on 2024-02-22 21:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0015_update_logentry_name"),
    ]

    operations = [
        migrations.RunSQL("CREATE TABLE core_logentry_copy AS TABLE core_logentry"),
        migrations.DeleteModel(
            name="LogEntry",
        ),
        migrations.CreateModel(
            name="LogEntry",
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
                ("timestamp", models.DateTimeField()),
                ("name", models.CharField(max_length=100)),
                ("category", models.CharField(max_length=100)),
                ("value", models.JSONField(null=True)),
            ],
            options={
                "ordering": ("-timestamp",),
            },
        ),
        migrations.RunSQL(
            """INSERT INTO core_logentry (timestamp, name, category, value)
            SELECT timestamp, name, category, value
            FROM core_logentry_copy
            ORDER BY timestamp ASC"""
        ),
        migrations.RunSQL("DROP TABLE core_logentry_copy"),
    ]
