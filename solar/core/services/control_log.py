from django.db.models import QuerySet

from solar.core.models import ControlLog


class ControlLogService:
    @staticmethod
    def get_logs() -> QuerySet[ControlLog]:
        return ControlLog.objects.all()[:100]
