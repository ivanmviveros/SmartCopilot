import os
from django.conf import settings
import spacy
import gc

class SemanticSimilarity:
    nlp = None

    def load_nlp(self):
        self.nlp = spacy.load(settings.SENTENCE_TRANSFORMER_MODEL_NAME)

    def unload_nlp(self):
        del self.nlp
        gc.collect()

    def getSimilarity(self, query, corpus, minSimilarity):
        self.load_nlp()
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
        self.unload_nlp()
        return similarDoc
