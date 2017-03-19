from bs4 import BeautifulSoup
import urllib
import csv
from flask import Flask
from flask import request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/spectrum" , methods=['GET', 'POST'])

def spectrum():
    urlList = request.form['urlArray']
    print urlList
    numberOfArticles = len(urlList)
    conservativeScore = 1
    liberalScore = 1
    for url in urlList:
        actualURL = url.split("/")[2].split("www.")[1]
        with open(csv_file, 'data_liberal') as csvfile:
            for line in csv.file.readLines():
                if actualURL is line:
                    liberalScore += 1
        with open(csv_file, 'data_conservative') as csvfile:
            for line in csv.file.readLines():
                if actualURL is line:
                    conservativeScore += 1

    conservativeScore = float(conservativeScore)/float(numberOfArticles)
    liberalScore = float(liberalScore)/float(numberOfArticles)

    if liberalScore > conservativeScore:
        val = -liberalScore*100
    elif conservativeScore > liberalScore:
        val = conservativeScore*100
    else:
        val = 0
    print "FINALLLL VALUEEEEE", str(val)
    return str(val)

    # return "88"

@app.route("/credibility", methods=['GET', 'POST'])

def credibility():
    urlArray = request.form['urlArray']
    # print "FINAL" , urlArray , "FINALLLLLL"
    return "94"

app.run()
