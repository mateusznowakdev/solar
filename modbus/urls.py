from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from modbus.core.views import MetaAPIView, StateAPIView
from modbus.front.views import ChartView, IndexView

urlpatterns = [
    path("", IndexView.as_view(), name="front-index"),
    path("charts/", ChartView.as_view(), name="front-charts"),

    path("api/meta/", MetaAPIView.as_view(), name="state"),
    path("api/state/", StateAPIView.as_view(), name="state"),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/schema/ui/", SpectacularSwaggerView.as_view(), name="schema-ui"),
]
