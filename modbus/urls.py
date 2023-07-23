from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from modbus.core.views import StateAPIView

urlpatterns = [
    path("api/state/", StateAPIView.as_view(), name="state"),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/schema/ui/", SpectacularSwaggerView.as_view(), name="schema-ui"),
]
