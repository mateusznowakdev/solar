from rest_framework import serializers

from solar.core.models import LogEntry, State, get_numeric_field_names


class LogEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LogEntry
        fields = "__all__"


class NullSerializer(serializers.Serializer):
    pass


class SeriesRequestSerializer(serializers.Serializer):
    source1 = serializers.ChoiceField(choices=get_numeric_field_names())
    source2 = serializers.ChoiceField(choices=get_numeric_field_names(), required=False)
    date_from = serializers.DateTimeField(required=False)
    date_to = serializers.DateTimeField(required=False)


class StateRequestSerializer(serializers.Serializer):
    output_priority = serializers.IntegerField(required=False)
    charge_priority = serializers.IntegerField(required=False)


class StateResponseSerializer(serializers.ModelSerializer):
    controller_faults = serializers.ListField(child=serializers.IntegerField())
    inverter_faults = serializers.ListField(child=serializers.IntegerField())

    class Meta:
        model = State
        exclude = ("id",)
