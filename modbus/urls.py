from django.urls import path, include
from django.contrib.auth.models import User
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework import routers, serializers, viewsets


# Serializers define the API representation.
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "email", "is_staff"]


# ViewSets define the view behavior.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r"users", UserViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path("api/", include(router.urls)),
    path("api/schema", SpectacularAPIView.as_view(), name="schema"),
    path("api/schema/ui", SpectacularSwaggerView.as_view(), name="schema-ui"),
]
