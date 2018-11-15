// ==UserScript==
// @name         TweetDeck Rip-offTweet
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  パクツイするよ～
// @author       Chunjb37
// @match        https://tweetdeck.twitter.com/
// @grant        none
// ==/UserScript==

var set_interval_id = setInterval(findTargetElement, 1000);

function findTargetElement() {
  var target = document.getElementsByClassName("js-chirp-container")[0];
	if(target) {
        clearInterval(set_interval_id);
        main();
    }
}

function clicked(Event) {
    var article = Event.target.parentNode.parentNode.parentNode.parentNode.parentNode;
    var tweet = article.getElementsByClassName("tweet-text")[0]
    var tweet_text = tweet.innerHTML
    console.log(tweet_text);
    var textarea = document.getElementsByClassName('js-compose-text compose-text')[0];
    Array.prototype.forEach.call(tweet.getElementsByTagName("img"), function(img) {
        tweet_text = tweet_text.replace(img.outerHTML, img.alt);
    });
    Array.prototype.forEach.call(tweet.getElementsByTagName("a"), function(a) {
        console.log(a.rel);
        if (a.rel === "hashtag") {
            tweet_text = tweet_text.replace(a.outerHTML, "#" + a.getElementsByTagName("span")[1].innerHTML);
        } else if (a.rel === "user") {
            tweet_text = tweet_text.replace(a.outerHTML, "@" + a.getElementsByTagName("span")[1].innerHTML);
        } else if (a.rel === "url noopener noreferrer") {
            tweet_text = tweet_text.replace(a.outerHTML, a.getAttribute("data-full-url"));
        };
    });
    textarea.value = tweet_text;
    textarea.focus();
    document.getElementById("account-safeguard-checkbox").checked = true;
    document.getElementsByClassName("is-disabled")[0].classList.remove('is-disabled');
}

function main(){
    const target = document.getElementsByClassName("js-chirp-container")[0];
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((Node) => {
                var parentNode = Node.getElementsByClassName("tweet-actions")[0];
                var li = document.createElement('li');
                li.innerHTML = '<a class="js-reply-action tweet-action position-rel"> <i class="icon icon-retweet pull-left"></i></a>';
                parentNode.appendChild(li);
                li.addEventListener (
                    "click", clicked, false
                );
            });
        });
    });
    const config = {childList: true};
    observer.observe(target, config);
}