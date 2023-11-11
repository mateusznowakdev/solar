from django.conf import settings
from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from solar.core.views import (
    LogAPIView,
    ProductionAPIView,
    SeriesAPIView,
    SettingsAPIView,
)

urlpatterns = [
    path("api/log/", LogAPIView.as_view(), name="api-log"),
    path("api/production/", ProductionAPIView.as_view(), name="api-production"),
    path("api/series/", SeriesAPIView.as_view(), name="api-series"),
    path("api/settings/", SettingsAPIView.as_view(), name="api-settings"),
]

if settings.DEBUG:
    urlpatterns += [
        path("api/_schema/", SpectacularAPIView.as_view(), name="schema"),
        path("api/_schema/ui/", SpectacularSwaggerView.as_view(), name="schema-ui"),
    ]
