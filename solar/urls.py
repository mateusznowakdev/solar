from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from solar.core.views import MetaAPIView, SeriesAPIView, StateAPIView
from solar.front.views import ChartView, IndexView

urlpatterns = [
    # UI
    path("", IndexView.as_view(), name="front-index"),
    path("charts/", ChartView.as_view(), name="front-charts"),
    # API
    path("api/meta/", MetaAPIView.as_view(), name="api-state"),
    path("api/state/", StateAPIView.as_view(), name="api-state"),
    path("api/series/", SeriesAPIView.as_view(), name="api-series"),
    path("api/_schema/", SpectacularAPIView.as_view(), name="api--schema"),
    path("api/_schema/ui/", SpectacularSwaggerView.as_view(), name="api--schema-ui"),
]
