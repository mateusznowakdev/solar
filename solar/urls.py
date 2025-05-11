from django.conf import settings
from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from solar.core.views import (
    HealthcheckAPIView,
    LogAPIView,
    ProductionDailyAPIView,
    ProductionMonthlyAPIView,
    SeriesAPIView,
    SettingsAPIView,
)

urlpatterns = [
    path("api/healthcheck/", HealthcheckAPIView.as_view()),
    path("api/log/", LogAPIView.as_view()),
    path("api/production/daily/", ProductionDailyAPIView.as_view()),
    path("api/production/monthly/", ProductionMonthlyAPIView.as_view()),
    path("api/series/", SeriesAPIView.as_view()),
    path("api/settings/", SettingsAPIView.as_view()),
]

if settings.DEBUG:
    urlpatterns += [
        path("api/_schema/", SpectacularAPIView.as_view(), name="schema"),
        path("api/_schema/ui/", SpectacularSwaggerView.as_view(), name="schema-ui"),
    ]
