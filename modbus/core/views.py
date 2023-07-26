from datetime import datetime

from django.core.exceptions import FieldError
from django.db.models import Q
from drf_spectacular.utils import extend_schema
from rest_framework import views
from rest_framework.request import Request
from rest_framework.response import Response

from modbus.core.models import State
from modbus.core.serializers import (
    MetaResponseSerializer,
    NullSerializer,
    SeriesRequestSerializer,
    StateRequestSerializer,
    StateResponseSerializer,
)
from modbus.core.services import get_meta, get_state, patch_state


class MetaAPIView(views.APIView):
    @extend_schema(responses={200: MetaResponseSerializer(many=True)})
    def get(self, request: Request) -> Response:
        return Response(data=get_meta())


class StateAPIView(views.APIView):
    @extend_schema(responses={200: StateResponseSerializer})
    def get(self, request: Request) -> Response:
        out_data = get_state()
        out_serializer = StateResponseSerializer(instance=out_data)

        return Response(data=out_serializer.data)

    @extend_schema(request=StateRequestSerializer, responses={204: NullSerializer})
    def patch(self, request: Request) -> Response:
        in_serializer = StateRequestSerializer(data=request.data)
        in_serializer.is_valid(raise_exception=True)

        patch_state(in_serializer.data)

        return Response(status=204)


class SeriesAPIView(views.APIView):
    def get(self, request: Request) -> Response:
        in_serializer = SeriesRequestSerializer(data=self.request.query_params)
        in_serializer.is_valid(raise_exception=True)

        filters = Q()

        if date_from_str := in_serializer.data.get("date_from"):
            filters &= Q(timestamp__gte=datetime.fromisoformat(date_from_str))
        if date_to_str := in_serializer.data.get("date_to"):
            filters &= Q(timestamp__lte=datetime.fromisoformat(date_to_str))

        try:
            values = State.objects.filter(filters).values_list("timestamp", in_serializer.data["source"])
        except FieldError:
            values = []

        return Response(data=values)
