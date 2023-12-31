from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import views
from rest_framework.request import Request
from rest_framework.response import Response

from solar.core.serializers import (
    LogEntrySerializer,
    ProductionRequestSerializer,
    ProductionResponseSerializer,
    SeriesRequestSerializer,
    SeriesResponseSerializer,
    SettingsRequestSerializer,
    SettingsResponseSerializer,
)
from solar.core.services.web import (
    LogAPIService,
    ProductionAPIService,
    SeriesAPIService,
    SettingsAPIService,
)


class LogAPIView(views.APIView):
    @extend_schema(responses={200: LogEntrySerializer(many=True)})
    def get(self, request: Request) -> Response:
        out_data = LogAPIService.get_logs()
        out_serializer = LogEntrySerializer(instance=out_data, many=True)

        return Response(data=out_serializer.data)


class ProductionAPIView(views.APIView):
    timestamp = OpenApiParameter(
        "timestamp", type=OpenApiTypes.DATETIME, required=True, many=True
    )

    @extend_schema(
        parameters=[timestamp], responses={200: ProductionResponseSerializer(many=True)}
    )
    def get(self, request: Request) -> Response:
        in_serializer = ProductionRequestSerializer(data=self.request.query_params)
        in_serializer.is_valid(raise_exception=True)

        out_data = ProductionAPIService.get_production(
            timestamps=in_serializer.validated_data.get("timestamp"),
        )
        out_serializer = ProductionResponseSerializer(out_data, many=True)

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

        out_data = SeriesAPIService.get_series(
            fields=in_serializer.validated_data.get("field"),
            date_from=in_serializer.validated_data.get("date_from"),
            date_to=in_serializer.validated_data.get("date_to"),
        )
        out_serializer = SeriesResponseSerializer(out_data)

        return Response(data=out_serializer.data)


class SettingsAPIView(views.APIView):
    @extend_schema(responses={200: SettingsResponseSerializer()})
    def get(self, request: Request) -> Response:
        out_data = SettingsAPIService.get_settings()
        out_serializer = SettingsResponseSerializer(out_data)

        return Response(data=out_serializer.data)

    @extend_schema(
        request=SettingsRequestSerializer(),
        responses={200: SettingsResponseSerializer()},
    )
    def put(self, request: Request) -> Response:
        in_serializer = SettingsRequestSerializer(data=request.data)
        in_serializer.is_valid(raise_exception=True)
        in_data = in_serializer.validated_data

        out_data = SettingsAPIService.update_settings(settings=in_data)
        out_serializer = SettingsResponseSerializer(out_data)

        return Response(data=out_serializer.data)
