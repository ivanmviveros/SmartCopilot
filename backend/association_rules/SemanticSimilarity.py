import os
from django.conf import settings
from sentence_transformers import util
from django.apps import apps
import spacy


class SemanticSimilarity:
    nlp = spacy.load("en_core_web_md")

    def getSimilarity(self, query, corpus, minSimilarity):
        query = self.nlp(query)
        corpus = self.nlp.pipe(corpus)

        similarDoc = []
        # print('---------------------')
        # print('------', query.text, '------')
        for doc in corpus:
            if (query.similarity(doc) >= minSimilarity and (len(similarDoc) == 0 or query.similarity(doc) >= similarDoc[0])):
                similarDoc = [round(query.similarity(doc), 3), doc.text]
                # print(f"{doc.text}: {round(query.similarity(doc), 3)}")
        # print('---------------------')

        return similarDoc
