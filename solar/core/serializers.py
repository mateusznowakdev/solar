from django.db.models import FloatField, IntegerField
from rest_framework import serializers

from solar.core.models import State


class NullSerializer(serializers.Serializer):
    pass


class SeriesRequestSerializer(serializers.Serializer):
    source = serializers.ChoiceField(
        choices=[
            f.name
            for f in State._meta.concrete_fields
            if type(f) in (FloatField, IntegerField)
        ]
    )
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
