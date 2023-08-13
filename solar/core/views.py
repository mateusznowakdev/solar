from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import views
from rest_framework.request import Request
from rest_framework.response import Response

from solar.core.serializers import (
    LogEntrySerializer,
    SeriesRequestSerializer,
    SeriesResponseSerializer,
)
from solar.core.services import LogService, SeriesService


class LogAPIView(views.APIView):
    @extend_schema(responses={200: LogEntrySerializer(many=True)})
    def get(self, request: Request) -> Response:
        out_data = LogService.get_logs()
        out_serializer = LogEntrySerializer(instance=out_data, many=True)

        return Response(data=out_serializer.data)


class SeriesAPIView(views.APIView):
    field = OpenApiParameter("field", type=OpenApiTypes.STR, required=True, many=True)
    date_from = OpenApiParameter("date_from", type=OpenApiTypes.DATETIME, required=True)
    date_to = OpenApiParameter("date_to", type=OpenApiTypes.DATETIME, required=True)

    @extend_schema(
        parameters=[field, date_from, date_to],
        responses={200: SeriesResponseSerializer()},
    )
    def get(self, request: Request) -> Response:
        in_serializer = SeriesRequestSerializer(data=self.request.query_params)
        in_serializer.is_valid(raise_exception=True)

        out_data = SeriesService.get_series(
            fields=in_serializer.validated_data.get("field"),
            date_from=in_serializer.validated_data.get("date_from"),
            date_to=in_serializer.validated_data.get("date_to"),
        )
        return Response(data=out_data)
