var blackListedWords = require('../assets/assets.js').blackListedWords;

var parseText = function(tweet){
  
  //Removed ending text that consists of links
  var index = tweet.indexOf('http');
    
  if (index !== -1) {
    tweet = tweet.slice(0, index);
  }

  //Removes all symbols
  var fixedTweet = tweet.replace(/\W/g, " "),
      newTweet = [],
      topic = [],
      obj = {},
      i;

  fixedTweet = fixedTweet.split(' ');
  
  for (i = 0; i < fixedTweet.length; i++){
    if (fixedTweet[i] === '') continue;
    var changed = false;
    var indexes = [];
    var McCarthy = fixedTweet[i].indexOf('Mc');
    var MacCarthy = fixedTweet[i].indexOf('Mac');
    
    for (var z = 1; z < fixedTweet[i].length; z++){
      if (fixedTweet[i][z].match(/\d/g)) continue;
      if (fixedTweet[i][z] === fixedTweet[i][z].toUpperCase()){
        indexes.push(z);
        changed = true;
      }
      if (McCarthy === z) z += 2;
      if (MacCarthy === z) z += 3;
    }
    
    if (!changed) newTweet.push(fixedTweet[i].toLowerCase());
    else {
      newTweet.push(fixedTweet[i].slice(0, indexes[0]).toLowerCase());
      for (z = 0; z < indexes.length; z++){
        if (z + 1 === indexes.length){
          newTweet.push(fixedTweet[i].slice(indexes[z]).toLowerCase());
          continue;
        }
        newTweet.push(fixedTweet[i].slice(indexes[z], indexes[z + 1]).toLowerCase());
      }
    }
  }

  for (i = 0; i < newTweet.length; i++){
    if (blackListedWords[newTweet[i]]) continue;
    
    if (!(obj[newTweet[i]])){
      topic.push(newTweet[i]);
      obj[newTweet[i]] = true;
    }
    
    if (i + 1 !== newTweet.length) {
      if (blackListedWords[newTweet[i + 1]]) continue;
      if (!(obj[newTweet[i] + ' ' + newTweet[i + 1]])){
        topic.push(newTweet[i] + ' ' + newTweet[i + 1]);
        obj[newTweet[i] + ' ' + newTweet[i + 1]] = true;
      }
    }
  }
  
  return topic;
};

module.exports = {
  parseText: parseText
};