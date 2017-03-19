from bs4 import BeautifulSoup
import urllib
import csv
from flask import Flask
from flask import request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/parse" , methods=['GET', 'POST'])

def parse():
    # # url = "https://www.theatlantic.com/international/archive/2017/03/trump-playboy-merkel/520014/"
    # html = urllib.urlopen(url).read()
    # soup = BeautifulSoup(html, "html.parser")
    #
    # publisher = url.split("/")[2].split("www.")[1]
    # # kill all script and style elements
    # for script in soup(["script", "style"]):
    #     script.extract()    # rip it out
    #
    # # get text
    # text = soup.get_text()
    #
    # # break into lines and remove leading and trailing space on each
    # lines = (line.strip() for line in text.splitlines())
    # # break multi-headlines into a line each
    # chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    # # drop blank lines
    # text = '\n'.join(chunk for chunk in chunks if chunk)

    # print(text.encode('utf-8'))
    urlArray = request.form['urlArray']
    return "hey"

app.run()
