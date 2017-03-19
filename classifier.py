import os, sys, math

#already existing method to read in a file
def token_set(filename):
	#open the file handle
	with open(filename, 'r') as f:
		#ignore the Subject beginning
		text = f.read()[9:]
		#put it all on one line
		text = text.replace('\r', '')
		text = text.replace('\n', ' ')
		#split by spaces
		tokens = text.split(' ')
		#return the set of unique tokens
		return set(tokens)



def getCounts(path):
    wordCounts = dict()
    trainFiles = os.listdir(path)
    totalFiles = len(trainFiles)
    for file in trainFiles:
    	fileWords = token_set(path + file)
    	for word in fileWords:
    		if word in wordCounts:
    			wordCounts[word] += 1
    		else:
    			wordCounts[word] = 1
    probDict = dict{}
    for word in wordCounts:
    	probDict[word] = float(wordCounts[word] + 1) / float(totalFiles + 2)
    return probDict

onePath = "data/train/1"
oneProbs = getCounts(onePath)
oneFiles = len(os.listdir(onePath))
twoPath = "data/train/2"
twoProbs = getCounts(twoPath)
twoFiles = len(os.listdir(twoPath))
threePath = "data/train/3"
threeProbs = getCounts(threePath)
threeFiles = len(os.listdir(threePath))
fourPath = "data/train/4"
fourProbs = getCounts(fourPath)
fourFiles = len(os.listdir(fourPath))

#calculate the probability of a file in each category
totalFiles = oneFiles + twoFiles + threeFiles + fourFiles
prob1 = float(oneFiles) / float(totalFiles)
prob2 = float(twoFiles) / float(totalFiles)
prob3 = float(threeFiles) / float(totalFiles)
prob4 = float(fourFiles) / float(totalFiles)

#Iterate over the unlabeled emails and classify them based on the maps created earlier
path = "data/test/"
unlabeledFiles = os.listdir(path)
for file in unlabeledFiles:
	fileWords = token_set("data/test/" + file)
	oneTotal = math.log10(prob1)
	twoTotal = math.log10(prob2)
    threeTotal = math.log10(prob3)
    fourTotal = math.log10(prob4)
	for word in fileWords:
        #account for one probabilities
		if word in oneProbs:
			oneTotal  += math.log(oneProbs[word])
		else:
			oneTotal += math.log(float(1) / float(oneFiles + 2))
        #account for two probabilities
        if word in twoProbs:
			twoTotal  += math.log(twoProbs[word])
		else:
			twoTotal += math.log(float(1) / float(twoFiles + 2))
        #account for three probabilities
        if word in threeProbs:
			threeTotal  += math.log(threeProbs[word])
		else:
			threeTotal += math.log(float(1) / float(threeFiles + 2))
        #account for four probabilities
        if word in fourProbs:
			fourTotal  += math.log(fourProbs[word])
		else:
			fourTotal += math.log(float(1) / float(fourFiles + 2))

	liberalScore = oneTotal * 2 + threeTotal
    conservativeScore = twoTotal *2 + fourTotal
    if liberalScore > conservativeScore:
        print file + float(conservativeScore)/float(liberalScore)
    else:
        print file + float(liberalScore)/float(conservativeScore)

    
