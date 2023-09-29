from datetime import timedelta

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from solar.core.models import LogEntry, StateRaw, get_numeric_field_names


class LogEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LogEntry
        fields = "__all__"


class ProductionRequestSerializer(serializers.Serializer):
    MAX_TIMESTAMPS = 14

    timestamp = serializers.ListField(
        child=serializers.DateTimeField(), min_length=1, max_length=MAX_TIMESTAMPS
    )

    def validate(self, attrs):
        attrs = super().validate(attrs)

        timestamps = attrs["timestamp"]
        max_days_allowed = ProductionRequestSerializer.MAX_TIMESTAMPS + 1

        if max(timestamps) - min(timestamps) > timedelta(days=max_days_allowed):
            raise ValidationError()  # someone is abusing API, return useless message

        return attrs


class ProductionResponseSerializer(serializers.Serializer):
    timestamp = serializers.DateTimeField()
    pv_power = serializers.IntegerField()
    load_active_power = serializers.IntegerField()


class SeriesRequestSerializer(serializers.Serializer):
    field = serializers.ListField(
        child=serializers.ChoiceField(choices=get_numeric_field_names()),
        min_length=1,
        max_length=2,
    )
    date_from = serializers.DateTimeField()
    date_to = serializers.DateTimeField()


class SeriesItemResponseSerializer(serializers.Serializer):
    field = serializers.CharField()
    x = serializers.ListField(child=serializers.DateTimeField())
    y = serializers.ListField(child=serializers.FloatField())


class SeriesResponseSerializer(serializers.Serializer):
    date_from = serializers.DateTimeField()
    date_to = serializers.DateTimeField()
    values = SeriesItemResponseSerializer(many=True)


class StateSerializer(serializers.ModelSerializer):
    controller_faults = serializers.ListField(child=serializers.IntegerField())
    inverter_faults = serializers.ListField(child=serializers.IntegerField())

    class Meta:
        model = StateRaw
        fields = "__all__"
