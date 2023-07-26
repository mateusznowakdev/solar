from datetime import datetime, timedelta

from django.core.exceptions import FieldError
from django.utils import timezone
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

        try:
            date_from = datetime.fromisoformat(in_serializer.data.get("date_from"))
        except TypeError:
            date_from = None

        try:
            date_to = datetime.fromisoformat(in_serializer.data.get("date_to"))
        except TypeError:
            date_to = None

        days_limit = 7

        if date_from and date_to:
            date_limit = date_from + timedelta(days=days_limit)
            date_to = min(date_to, date_limit)

        elif date_from and not date_to:
            date_to = timezone.now()
            date_limit = date_from + timedelta(days=days_limit)

            if date_to < date_limit:
                # user cannot enter second and microsecond, therefore it needs to be aligned here
                date_from = date_from.replace(second=date_to.second, microsecond=date_to.microsecond)
            else:
                date_to = date_limit

        elif not date_from and date_to:
            date_from = date_to - timedelta(days=days_limit)

        else:
            date_to = timezone.now()
            date_from = date_to - timedelta(days=days_limit)

        try:
            values = State.objects.filter(
                timestamp__gte=date_from, timestamp__lte=date_to
            ).values_list("timestamp", in_serializer.data["source"])
        except FieldError:
            values = []

        return Response(data=values)
