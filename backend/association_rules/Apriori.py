import pandas as pd
import numpy as np
from apyori import apriori
from .SemanticSimilarity import SemanticSimilarity


class Apriori:

    def recommended(self, rulesUrl, baseGroupsUrl, resultGroupsUrl, key):
        arrRules = self.formatRules(rulesUrl)
        [arrBaseGroups, sentenceBaseGroups, numberBaseGroups] = self.formatBaseGroups(
            baseGroupsUrl)
        [arrResultGroups, sentenceResultGroups, numberResultGroups] = self.formatResultGroups(
            resultGroupsUrl)
        arrResultGroups = np.array(arrResultGroups)

        recommendations = []

        if (len(arrRules) > 0):
            # Apply association rules
            rules = apriori(arrRules, min_support=0.02,
                            min_confidence=0.3, min_lift=1.0001, min_length=2)
            results = list(rules)
            results = pd.DataFrame(results)

            group = self.searchGroup(arrBaseGroups, key, sentenceBaseGroups)

            if (group[0] == -1 or group[0] == -2):
                for i in range(len(results.index)):
                    for j in range(len(list(results.iloc[i, 2]))):
                        if(len(list(list(results.iloc[i, 2][j][0]))) > 0 and list(list(results.iloc[i, 2][j][0]))[0] == group[1]):
                            index = np.where(arrResultGroups == list(
                                list(results.iloc[i, 2][j][1]))[0])[0][0]
                            recommendations.append(
                                arrResultGroups[index][0].capitalize())
                        else:
                            pass

        return recommendations

    def add(self, rulesUrl, baseGroupsUrl, resultGroupsUrl, request):
        arrRules = self.formatRules(rulesUrl)
        [arrBaseGroups, sentenceBaseGroups, numberBaseGroups] = self.formatBaseGroups(
            baseGroupsUrl)
        [arrResultGroups, sentenceResultGroups, numberResultGroups] = self.formatResultGroups(
            resultGroupsUrl)
        newRules = request.data['rules']

        existNewBaseGroups = False
        existNewResultGroups = False
        for rule in newRules:
            # Create new base groups and change key per base group
            group = self.searchGroup(
                arrBaseGroups, rule[0], sentenceBaseGroups)
            if (group[0] == -3):  # No similar user stories exist
                nextGroupNumber = max(numberBaseGroups) + 1 \
                    if (len(numberBaseGroups) > 0) else 1
                arrBaseGroups.extend([[rule[0], 'B-' + str(nextGroupNumber)]])
                sentenceBaseGroups.extend([rule[0]])
                numberBaseGroups.extend([nextGroupNumber])
                rule[0] = str('B-' + str(nextGroupNumber))
                existNewBaseGroups = True
            elif (group[0] == -1):  # This user story does not exactly exist
                arrBaseGroups.extend([[rule[0], group[1]]])
                sentenceBaseGroups.extend([rule[0]])
                rule[0] = str(group[1])
                existNewBaseGroups = True
            elif (group[0] == -2):  # This user story already exists exactly
                rule[0] = str(group[1])

            # Create new result groups and change key per result group
            group = self.searchGroup(
                arrResultGroups, rule[1], sentenceResultGroups)
            if (group[0] == -3):  # No similar user stories exist
                nextGroupNumber = max(numberResultGroups) + 1 \
                    if (len(numberResultGroups) > 0) else 1
                arrResultGroups.extend(
                    [[rule[1], 'R-' + str(nextGroupNumber)]])
                sentenceResultGroups.extend([rule[1]])
                numberResultGroups.extend([nextGroupNumber])
                rule[1] = str('R-' + str(nextGroupNumber))
                existNewResultGroups = True
            elif (group[0] == -1):  # This user story does not exactly exist
                arrResultGroups.extend([[rule[1], group[1]]])
                sentenceResultGroups.extend([rule[1]])
                rule[1] = str(group[1])
                existNewResultGroups = True
            elif (group[0] == -2):  # This user story already exists exactly
                rule[1] = str(group[1])

        # Add base groups in csv
        if (existNewBaseGroups):
            baseGroups = pd.DataFrame(arrBaseGroups)
            baseGroups.to_csv(baseGroupsUrl, index=False,
                              na_rep='Unknown', header=None)

        # Add result groups in csv
        if (existNewResultGroups):
            resultGroups = pd.DataFrame(arrResultGroups)
            resultGroups.to_csv(resultGroupsUrl, index=False,
                                na_rep='Unknown', header=None)

        # Add rules in csv
        if (len(newRules) > 0):
            arrRules.extend(newRules)
            arrRules = pd.DataFrame(arrRules)
            arrRules.to_csv(rulesUrl, index=False,
                            na_rep='Unknown', header=None)

        return True

    def assignGroup(self, groups, element):
        return self.searchGroup(groups, element[0])

    def searchGroup(self, groups, key, sentenceGroups):
        if (len(sentenceGroups) > 0):
            similaries = SemanticSimilarity().getSimilarity(
                key, sentenceGroups, 0.605)
            if(len(similaries) > 0):
                index = sentenceGroups.index(similaries[0][1])
                if (similaries[0][0] < 1):  # This user story does not exactly exist
                    return [-1, str(groups[index][1])]
                else:  # This user story already exists exactly
                    return [-2, str(groups[index][1])]

        return [-3]  # No similar user stories exist

    def formatRules(self, url):
        try:
            rules = pd.read_csv(url, header=None)
            arrRules = []
            for i in range(0, rules.shape[0]):
                arrRules.append([str(rules.values[i, j])
                                 for j in range(0, 2)])

            return arrRules
        except:
            return []

    def formatBaseGroups(self, url):
        try:
            baseGroups = pd.read_csv(url, header=None)
            arrBaseGroups = []
            sentenceBaseGroups = []
            numberBaseGroups = []
            for i in range(0, baseGroups.shape[0]):
                arrBaseGroups.append(
                    [baseGroups.values[i, 0], baseGroups.values[i, 1]])
                sentenceBaseGroups.append(baseGroups.values[i, 0])
                numberBaseGroups.append(
                    int(baseGroups.values[i, 1].split('-')[1]))

            return [arrBaseGroups, sentenceBaseGroups, numberBaseGroups]
        except:
            return [[], [], []]

    def formatResultGroups(self, url):
        try:
            resultGroups = pd.read_csv(url, header=None)
            arrResultGroups = []
            sentenceResultGroups = []
            numberResultGroups = []
            for i in range(0, resultGroups.shape[0]):
                arrResultGroups.append(
                    [resultGroups.values[i, 0], resultGroups.values[i, 1]])
                sentenceResultGroups.append(resultGroups.values[i, 0])
                numberResultGroups.append(
                    int(resultGroups.values[i, 1].split('-')[1]))

            return [arrResultGroups, sentenceResultGroups, numberResultGroups]
        except:
            return [[], [], []]
