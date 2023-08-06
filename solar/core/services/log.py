from django.db.models import QuerySet

from solar.core.models import LogEntry


class LogService:
    @staticmethod
    def get_logs() -> QuerySet[LogEntry]:
        return LogEntry.objects.all()[:100]
