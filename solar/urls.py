from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from solar.core.views import ControlLogAPIView, SeriesAPIView, StateAPIView

urlpatterns = [
    path("api/log/", ControlLogAPIView.as_view(), name="api-log"),
    path("api/state/", StateAPIView.as_view(), name="api-state"),
    path("api/series/", SeriesAPIView.as_view(), name="api-series"),
    path("api/_schema/", SpectacularAPIView.as_view(), name="api--schema"),
    path("api/_schema/ui/", SpectacularSwaggerView.as_view(), name="api--schema-ui"),
]
