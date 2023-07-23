from drf_spectacular.utils import extend_schema
from rest_framework import views
from rest_framework.request import Request
from rest_framework.response import Response

from modbus.core.serializers import NullSerializer, StateRequestSerializer, StateResponseSerializer
from modbus.core.services import get_state, patch_state


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
