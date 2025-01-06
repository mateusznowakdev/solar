from rest_framework import serializers

from solar.core import const
from solar.core.models import LogEntry, StateRaw, get_numeric_field_names
from solar.core.services.logging import LoggingService


class Serializer(serializers.Serializer):
    def create(self, validated_data):
        raise Exception("This serializer is read-only")

    def update(self, instance, validated_data):
        raise Exception("This serializer is read-only")


class ModelSerializer(serializers.ModelSerializer):
    pass


class LogRequestSerializer(Serializer):
    category = serializers.ListField(
        child=serializers.ChoiceField(choices=LoggingService.CATEGORIES), required=False
    )


class LogResponseSerializer(ModelSerializer):
    class Meta:
        model = LogEntry
        fields = "__all__"


class ProductionResponseSerializer(Serializer):
    timestamp = serializers.DateTimeField()
    pv_power = serializers.IntegerField()
    load_active_power = serializers.IntegerField()


class SeriesRequestSerializer(Serializer):
    field = serializers.ListField(
        child=serializers.ChoiceField(choices=get_numeric_field_names()),
        min_length=1,
        max_length=2,
    )
    date_from = serializers.DateTimeField()
    date_to = serializers.DateTimeField()


class SeriesItemResponseSerializer(Serializer):
    field = serializers.CharField()
    x = serializers.ListField(child=serializers.DateTimeField())
    y = serializers.ListField(child=serializers.FloatField())


class SeriesResponseSerializer(Serializer):
    date_from = serializers.DateTimeField()
    date_to = serializers.DateTimeField()
    values = SeriesItemResponseSerializer(many=True)


class SettingsSerializer(Serializer):
    charge_priority = serializers.IntegerField(
        required=False,
        min_value=min(const.CHARGE_PRIORITY_ALLOWED),
        max_value=max(const.CHARGE_PRIORITY_ALLOWED),
    )
    output_priority = serializers.IntegerField(
        required=False,
        min_value=min(const.OUTPUT_PRIORITY_ALLOWED),
        max_value=max(const.OUTPUT_PRIORITY_ALLOWED),
    )
    auto_charge_priority = serializers.BooleanField(required=False)
    auto_output_priority = serializers.BooleanField(required=False)


class SettingsRequestSerializer(SettingsSerializer):
    pass


class SettingsResponseSerializer(SettingsSerializer):
    pass


class StateSerializer(ModelSerializer):
    controller_faults = serializers.ListField(child=serializers.IntegerField())
    inverter_faults = serializers.ListField(child=serializers.IntegerField())

    class Meta:
        model = StateRaw
        fields = "__all__"
