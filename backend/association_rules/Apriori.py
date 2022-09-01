import pandas as pd
import numpy as np
from apyori import apriori
class Apriori:

    def recommended(self,data_base, key):
        dataset = pd.read_csv(data_base, header=None)
        transactions = []

        for i in range(0, dataset.shape[0]):
            transactions.append([str(dataset.values[i, j])
                                for j in range(0, 2)])

        rules = apriori(transactions, min_support=0.02,
                        min_confidence=0.1, min_lift=1.1, min_length=2)
        results = list(rules)
        results = pd.DataFrame(results)
        # return list(list(results.iloc[1,2][1][1]))[0]
        fila = []
        for i in range(len(results.index)):
            for j in range(len(list(results.iloc[i,2]))):
                if(list(list(results.iloc[i,2][j][0]))[0] == key):
                    fila.append(list(list(results.iloc[i,2][j][1]))[0])
                else:
                    pass
        if(fila):
            return fila
        else:
            return "Nothing to show"


