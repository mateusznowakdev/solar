from rest_framework import serializers

from solar.core.models import LogEntry, State, get_numeric_field_names


class LogEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LogEntry
        fields = "__all__"


class NullSerializer(serializers.Serializer):
    pass


class SeriesRequestSerializer(serializers.Serializer):
    field = serializers.ListField(
        child=serializers.ChoiceField(choices=get_numeric_field_names()),
        min_length=1,
        max_length=2,
    )
    date_from = serializers.DateTimeField()
    date_to = serializers.DateTimeField()


class StateRequestSerializer(serializers.Serializer):
    output_priority = serializers.IntegerField(required=False)
    charge_priority = serializers.IntegerField(required=False)


class StateResponseSerializer(serializers.ModelSerializer):
    controller_faults = serializers.ListField(child=serializers.IntegerField())
    inverter_faults = serializers.ListField(child=serializers.IntegerField())

    class Meta:
        model = State
        exclude = ("id",)
