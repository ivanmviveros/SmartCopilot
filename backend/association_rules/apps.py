from django.apps import AppConfig


class AssociationRulesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'association_rules'

    def __init__(self, app_name, app_module):
        super().__init__(app_name, app_module)
        self._SENTENCE_TRANSFORMER_MODEL = None

    def get_sentence_transformer_model(self):
        from sentence_transformers import SentenceTransformer
        from django.conf import settings
        import os

        if self._SENTENCE_TRANSFORMER_MODEL is None:
            self._SENTENCE_TRANSFORMER_MODEL = SentenceTransformer(
                "paraphrase-multilingual-mpnet-base-v2",
                device="cpu",
                cache_folder=os.path.join(settings.BASE_DIR, "cache"),
            )
        return self._SENTENCE_TRANSFORMER_MODEL
