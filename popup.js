// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Event listner for clicks on links in a browser action popup.
// Open the link in a new tab of the current window.
function onAnchorClick(event) {
  chrome.tabs.create({
    selected: true,
    url: event.srcElement.href
  });
  return false;
}

// Given an array of URLs, build a DOM list of those URLs in the
// browser action popup.
function buildPopupDom(divName, datas) {
  // var popupDiv = document.getElementById(divName);
  //
  // var ul = document.createElement('ul');
  // popupDiv.appendChild(ul);


  $.ajax({
    type: "POST",
    url: "http://localhost:5000/spectrum",
    data: {
      urlArray: JSON.stringify(datas)
    },
    success: function( result ) {
      result = Math.abs(parseInt(result))
      $( "#finalscore" ).html( "<strong>" + result + "</strong>" );
    }
  });

  $.ajax({
    type: "POST",
    url: "http://localhost:5000/credibility",
    data: {
      urlArray: JSON.stringify(datas)
    },
    success: function( result ) {

      result = Math.abs(parseInt(result))

      $( "#credibility" ).html( "<strong>" + result + "</strong>" );
    }
  });

  // for (var i = 0, ie = datas.length; i < ie; ++i) {
  //   var a = document.createElement('a');
  //   a.href = datas[i];
  //   a.appendChild(document.createTextNode(datas[i]));
  //   a.addEventListener('click', onAnchorClick);
  //
  //   var li = document.createElement('li');
  //   li.appendChild(a);
  //
  //   ul.appendChild(li);
  // }
}

// Search history to find up to ten links that a user has typed in,
// and show those links in a popup.
function buildTypedUrlList(divName) {
  // To look for history items visited in the last week,
  // subtract a week of microseconds from the current time.
  var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7 * 4 * 12;
  var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;

  // Track the number of callbacks from chrome.history.getVisits()
  // that we expect to get.  When it reaches zero, we have all results.
  var numRequestsOutstanding = 0;

  chrome.history.search({
      'text': '',              // Return every history item....
      'startTime': oneWeekAgo,  // that was accessed less than one week ago.
      'maxResults': 1000
    },
    function(historyItems) {
      // For each history item, get details on all visits.
      for (var i = 0; i < historyItems.length; ++i) {
        var url = historyItems[i].url;
        var processVisitsWithUrl = function(url) {
          // We need the url of the visited item to process the visit.
          // Use a closure to bind the  url into the callback's args.
          return function(visitItems) {
            processVisits(url, visitItems);
          };
        };
        chrome.history.getVisits({url: url}, processVisitsWithUrl(url));
        numRequestsOutstanding++;
      }
      if (!numRequestsOutstanding) {
        onAllVisitsProcessed();
      }
    });


  // Maps URLs to a count of the number of times the user typed that URL into
  // the omnibox.
  var urlToCount = {};

  // Callback for chrome.history.getVisits().  Counts the number of
  // times a user visited a URL by typing the address.
  var processVisits = function(url, visitItems) {
    for (var i = 0, ie = visitItems.length; i < ie; ++i) {
      // Ignore items unless the user typed the URL.

      if (visitItems[i].transition != 'link') {
        continue;
      }


      if (!urlToCount[url]) {
        urlToCount[url] = 0;
      }

      urlToCount[url]++;
    }

    // If this is the final outstanding call to processVisits(),
    // then we have the final results.  Use them to build the list
    // of URLs to show in the popup.
    if (!--numRequestsOutstanding) {
      onAllVisitsProcessed();
    }
  };

  // This function is called when we have the final list of URls to display.
  var onAllVisitsProcessed = function() {
    // Get the top scorring urls.
    urlArray = [];

    // Looking for all the news related articles
    substrings = ["drudgereport", "cnn", "foxnews", "nytimes", "buzzfeed", "usatoday", "huffingtonpost", "washingtonpost",
                  "forbes", "bbc", "nbcnews", "bloomberg", "abcnews", "politico", "breitbart", "npr", "cbsnews",
                  "theguardian", "tmz", "wsj", "nypost", "yahoo", "slate", "fivethirtyeight", "thedailybeast", "realclearpolitics",
                  "reuters", "theblaze", "dailykos", "theatlantic", "msnbc", "dailycaller", "thehill", "rt", "alternet", "infowars",
                  "talkingpointsmemo", "wnd", "newyorker", "washingtonexaminer", "thinkprogress", "economist", "pbs",
                  "aljazeera", "thenation", "newsweek", "nationalreview"]
    // substrings = ["msn", "drudgereport", "espn", "cnn", "foxnews", "wwd", "nytimes", "buzzfeed", "usatoday", "huffingtonpost", "washingtonpost",
    //               "forbes", "bbc", "dailymail", "cnet", "nbc", "popsugar", "bloomberg", "liveleak", "abc", "ksl", "mydailynews",
    //               "politico", "breitbart", "sfgate", "npr", "cbs", "guardian", "rawstory", "people", "seekingalpha", "businessinsider",
    //               "tmz", "latimes", "bleacherreport", "pitchfork", "cnbc", "gizmodo", "centurylink", "wsj", "rollingstone",
    //               "complex", "nypost", "cracked", "refinery29", "yahoo", "slate", "fivethirtyeight", "thedailybeast", "realclearpolitics",
    //               "lifehacker", "nationalgeographic", "reuters", "theblaze", "telegraph.co.uk", "eonline", "mashable", "marketwatch",
    //               "dailykos", "vogue", "hollywoodreporter", "time", "salon", "newsmax", "univision", "gawker", "caranddriver",
    //               "theatlantic", "chicagotribune", "msnbc", "health", "dailycaller", "littlethings", "kotaku", "zerohedge",
    //               "usmagazine", "howtogeek", "vox", "ibtimes", "hill", "ew", "sportillustrated", "bbc", "realsimple", "rt", "vice",
    //               "thestreet", "alternet", "usnews", "nymag", "infowars", "arstechnica", "independent", "mirror", "deadspin",
    //               "washington", "talkingpointsmemo", "mlive", "philly", "pjmedia", "scout", "startribune", "jezebel", "wnd",
    //               "conservativetribune", "bizjournals", "newyorker", "jalopnik", "bustle", "patch", "bostonglobe", "thrillist",
    //               "onion", "today", "conservatives", "fortune", "avclub", "mic", "vanityfair", "qz", "ibtimes", "inquisitr",
    //               "variety", "inc", "mercury", "detroit", "seattle", "bgr", "thinkprogress", "fastcompany", "abc", "bostonherald",
    //               "entrepreneur", "economist", "space", "science", "aljazeera", "investors", "orlando", "sentinel", "republic",
    //               "pbs", "associated", "aol", "consumer", "nation", "occupy", "uncut", "nationalreview"];

    for (var url in urlToCount) {
      if (new RegExp(substrings.join("|")).test(url) && !url.includes("git") && !url.includes("developer") && !url.includes("myplan")) {
          urlArray.push(url);
      }
    }

    // Sort the URLs by the number of times the user typed them.
    urlArray.sort(function(a, b) {
      return urlToCount[b] - urlToCount[a];
    });

    buildPopupDom(divName, urlArray.slice(0, 10));
    // buildPopupDom(divName, urlArray);
  };
}

document.addEventListener('DOMContentLoaded', function () {
  buildTypedUrlList("typedUrl_div");
});
