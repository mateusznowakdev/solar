from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from solar.core.views import MetaAPIView, SeriesAPIView, StateAPIView

urlpatterns = [
    path("api/meta/", MetaAPIView.as_view(), name="api-state"),
    path("api/state/", StateAPIView.as_view(), name="api-state"),
    path("api/series/", SeriesAPIView.as_view(), name="api-series"),
    path("api/_schema/", SpectacularAPIView.as_view(), name="api--schema"),
    path("api/_schema/ui/", SpectacularSwaggerView.as_view(), name="api--schema-ui"),
]
