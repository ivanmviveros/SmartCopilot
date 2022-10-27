import os
from django.conf import settings
from sentence_transformers import util
from django.apps import apps


class SemanticSimilarity:
    def getSimilarity(self, query, corpus, minSimilarity):
        # Corpus with example sentences
        # corpus = [
        #     'We need to eat apples',
        #     'I am a boy',
        #     'What are you doing?',
        #     'Can you help me?',
        #     'A man is riding a horse.',
        #     'A woman is playing violin.',
        #     'A monkey is chasing after a goat',
        #     'The quick brown fox jumps over the lazy dog'
        # ]

        # Query sentences:
        # queries = ['We want fruit', 'I am in need of assistance',
        #            '我是男孩子', 'Qué estás haciendo']

        corpus_embedding = apps.get_app_config('association_rules').get_sentence_transformer_model().encode(
            corpus, convert_to_tensor=True, normalize_embeddings=True)

        top_k = min(5, len(corpus))

        query_embedding = apps.get_app_config('association_rules').get_sentence_transformer_model().encode(
            query, convert_to_tensor=True, normalize_embeddings=True)
        hits = util.semantic_search(
            query_embedding, corpus_embedding, score_function=util.dot_score)
        hits = hits[0]

        # print("Query:", query)
        # print("---------------------------")
        similarity = []
        for hit in hits[:top_k]:
            if (hit['score'] >= minSimilarity):
                similarity.append([round(hit['score'], 3),
                                   corpus[hit['corpus_id']]])
                # print(f"{round(hit['score'], 3)} | {corpus[hit['corpus_id']]}")
                break

        return similarity
