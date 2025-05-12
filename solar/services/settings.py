from solar.models import SettingsEntry


class SettingsService:
    @staticmethod
    def get_setting(*, name: str) -> bool:
        try:
            return SettingsEntry.objects.get(name=name).checked
        except SettingsEntry.DoesNotExist:
            return False

    @staticmethod
    def put_setting(*, name: str, checked: bool) -> None:
        SettingsEntry.objects.update_or_create(name=name, defaults={"checked": checked})
