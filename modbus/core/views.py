from drf_spectacular.utils import extend_schema
from rest_framework import views
from rest_framework.request import Request
from rest_framework.response import Response

from modbus.core.serializers import (
    MetaResponseSerializer,
    NullSerializer,
    SeriesRequestSerializer,
    StateRequestSerializer,
    StateResponseSerializer,
)
from modbus.core.services.endpoints import get_meta, get_series, get_state, patch_state


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

        patch_state(data=in_serializer.data)

        return Response(status=204)


class SeriesAPIView(views.APIView):
    def get(self, request: Request) -> Response:
        in_serializer = SeriesRequestSerializer(data=self.request.query_params)
        in_serializer.is_valid(raise_exception=True)

        out_data = get_series(
            source=in_serializer.data.get("source"),
            date_from=in_serializer.data.get("date_from"),
            date_to=in_serializer.data.get("date_to"),
        )
        return Response(data=out_data)
