# Generated by Django 5.0.2 on 2024-02-22 19:17

from django.db import migrations, models


def json_to_columns(apps, schema_editor):
    LogEntry = apps.get_model("core", "LogEntry")

    for entry in LogEntry.objects.all():
        entry.name = entry.data.get("event")
        entry.value = entry.data.get("value")

        if entry.data.get("event") in ("charge_priority", "output_priority"):
            entry.category = "automation"
        elif entry.data.get("event") in ("controller_faults", "inverter_faults"):
            entry.category = "errors"
        else:
            entry.category = "system"

        entry.save()


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0013_settingsentry"),
    ]

    operations = [
        migrations.AddField(
            model_name="logentry",
            name="category",
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name="logentry",
            name="name",
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name="logentry",
            name="value",
            field=models.JSONField(null=True),
        ),
        migrations.RunPython(json_to_columns),
        migrations.RemoveField(
            model_name="logentry",
            name="data",
        ),
        migrations.AlterField(
            model_name="logentry",
            name="category",
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name="logentry",
            name="name",
            field=models.CharField(max_length=100),
        ),
    ]
