from django.conf import settings
from django.http import JsonResponse
from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from solar.views import (
    HealthcheckAPIView,
    LogAPIView,
    ProductionDailyAPIView,
    ProductionMonthlyAPIView,
    SeriesAPIView,
    SettingsAPIView,
)


def handler400(request, exception):  # pylint:disable=unused-argument
    return JsonResponse({"detail": "Bad request."}, status=400)


def handler403(request, exception):  # pylint:disable=unused-argument
    return JsonResponse({"detail": "Permission denied."}, status=403)


def handler404(request, exception):  # pylint:disable=unused-argument
    return JsonResponse({"detail": "Not found."}, status=404)


def handler500(request):  # pylint:disable=unused-argument
    return JsonResponse({"detail": "Server error."}, status=500)


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
