from rest_framework import serializers

from modbus.core.models import State


class MetaResponseSerializer(serializers.Serializer):
    description = serializers.CharField(required=False)
    choices = serializers.DictField(required=False, child=serializers.CharField())
    unit = serializers.CharField(required=False)


class NullSerializer(serializers.Serializer):
    pass


class StateRequestSerializer(serializers.Serializer):
    output_priority = serializers.IntegerField(required=False)
    charge_priority = serializers.IntegerField(required=False)


class StateResponseSerializer(serializers.ModelSerializer):
    controller_faults = serializers.ListField(child=serializers.IntegerField())
    inverter_faults = serializers.ListField(child=serializers.IntegerField())

    class Meta:
        model = State
        exclude = ("id",)
