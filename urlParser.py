from bs4 import BeautifulSoup
import urllib
import csv
import sys
import os

args = sys.argv[1:]
folder = args[1]
url = args[0]
html = urllib.urlopen(url).read()
soup = BeautifulSoup(html, "html.parser")

# find the appropriate bucket to be in
#publisher = url.split("/")[2].split("www.")[1]
#fileArray = []
#with open(csv_file, 'publisher_data') as csvfile:#
    #get the columns
    #for line in csv file.readlines():
#        fileArray = line.split(',')

# kill all script and style elements
for script in soup(["script", "style"]):
    script.extract()    # rip it out

# get text
text = soup.get_text()

# break into lines and remove leading and trailing space on each
lines = (line.strip() for line in text.splitlines())
# break multi-headlines into a line each
chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
# drop blank lines
text = '\n'.join(chunk for chunk in chunks if chunk)

filename = args[2]
path = "train/" + folder
complete_name = os.path.join(path, filename)
f = open(filename, "w+")

f.write(text.encode('utf-8'))

#print(text.encode('utf-8'))
