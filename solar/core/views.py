from drf_spectacular.utils import extend_schema
from rest_framework import views
from rest_framework.request import Request
from rest_framework.response import Response

from solar.core.serializers import (
    NullSerializer,
    SeriesRequestSerializer,
    StateRequestSerializer,
    StateResponseSerializer,
)
from solar.core.services import WebSeriesService, WebStateService


class SeriesAPIView(views.APIView):
    def get(self, request: Request) -> Response:
        in_serializer = SeriesRequestSerializer(data=self.request.query_params)
        in_serializer.is_valid(raise_exception=True)

        out_data = WebSeriesService.get_series(
            source1=in_serializer.data.get("source1"),
            source2=in_serializer.data.get("source2"),
            date_from=in_serializer.data.get("date_from"),
            date_to=in_serializer.data.get("date_to"),
        )
        return Response(data=out_data)


class StateAPIView(views.APIView):
    @extend_schema(responses={200: StateResponseSerializer})
    def get(self, request: Request) -> Response:
        out_data = WebStateService.get_state()
        out_serializer = StateResponseSerializer(instance=out_data)

        return Response(data=out_serializer.data)

    @extend_schema(request=StateRequestSerializer, responses={204: NullSerializer})
    def patch(self, request: Request) -> Response:
        in_serializer = StateRequestSerializer(data=request.data)
        in_serializer.is_valid(raise_exception=True)

        WebStateService.patch_state(data=in_serializer.data)

        return Response(status=204)
