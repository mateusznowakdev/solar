from rest_framework import views
from rest_framework.request import Request
from rest_framework.response import Response

from modbus.core.models import State
from modbus.core.serializers import StateSerializer


class StateAPIView(views.APIView):
    serializer_class = StateSerializer

    def get(self, request: Request) -> Response:
        output = State.objects.last()
        output_serializer = self.serializer_class(instance=output)

        return Response(data=output_serializer.data)
