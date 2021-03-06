var isLoggedIn = false;
var unreadItemCount = 0;
var unreadItemData = {};
var unreadMessageCount = 0;

var colorNormal = {color: [255, 0, 0, 100]};
var colorNewMessage = {color: [0, 255, 0, 100]};

var urlItems = "http://moly.hu/api/fresh_counter_by_type_for_current_user";
var urlMessages = "http://moly.hu/api/wave_notes_counter_for_current_user";

function updateBadge()
{
if (false == isLoggedIn) {
  chrome.browserAction.setBadgeBackgroundColor(colorNormal);
  chrome.browserAction.setBadgeText({text:"---"});
  return;
}

if (0 == unreadMessageCount) {
  chrome.browserAction.setBadgeBackgroundColor(colorNormal);
} else {
  chrome.browserAction.setBadgeBackgroundColor(colorNewMessage);
}

if (0 == unreadItemCount) {
  if (0 != unreadMessageCount) {
    chrome.browserAction.setBadgeText({text: "�zi"});
  } else {
    chrome.browserAction.setBadgeText({text: ""});
  }
} else {
  chrome.browserAction.setBadgeText({text: String(unreadItemCount)});
}
}

function requestItemData()
{
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4 && xhr.status == 200) {
    if (xhr.responseText.substring(0, 4) == "null") {
      isLoggedIn = false;
      return;
    }
    
    isLoggedIn = true;
    unreadItemData = JSON.parse(xhr.responseText);
    
    unreadItemCount = 0;
    for(var i in unreadItemData) {
      unreadItemCount += unreadItemData[i];
    }
    
    updateBadge();
  }
};
xhr.open("GET", urlItems, true);
xhr.send();
}

function requestMessageCount()
{
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4 && xhr.status == 200) {    
    unreadMessageCount = parseInt(xhr.responseText);
    if (unreadMessageCount == -1) {
      unreadMessageCount = 0;
      isLoggedIn = false;
    } else {
      isLoggedIn = true;
    }
  }
  updateBadge();
};
xhr.open("GET", urlMessages, true);
xhr.send();  
}

setInterval(requestItemData, 60000);
setInterval(requestMessageCount, 300000);

requestItemData();
requestMessageCount();
