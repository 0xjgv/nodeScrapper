const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

request("https://news.ycombinator.com/", (error, response, body) => {
  if (error) {
    console.log("Error: " + error);
  }
  console.log("Status code: " + response.statusCode);

  const $ = cheerio.load(body);
  const children = $('table.itemlist tbody').children().not('.spacer, .morespace');
  const targets = [
    'a.storylink',
    'td.subtext .score',
    'td.subtext a.hnuser'
  ];
  
  const results = [];
  for (let i = 0; i < children.length - 1; i += 2) {
    let [title, score, user] = targets.map((target, index) => {
      if (index) {
        return $(children[i + 1]).find(target).text().trim();
      } else {
        return $(children[i]).find(target).text().trim();
      }
    });
    let obj = { 
      title: title || 'NO-TITLE', 
      score: score || 'NO-SCORE', 
      user: user || 'NO-USER', 
    };
    results.push(obj);
  }
  fs.appendFileSync(
    'hackernews.json',
    JSON.stringify(results, null, '\t'),
  );
});