/*chrome.tabs.getSelected(null, function(tab) {

    chrome.pageAction.show(tab.id);


});*/
function showPageAction( tabId, changeInfo, tab ) {
    chrome.pageAction.show(tabId);
};
chrome.tabs.onUpdated.addListener(showPageAction);

