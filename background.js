// 当前浏览器安装插件时
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

// 当用户点击插件图标时
chrome.action.onClicked.addListener(async (tab) => {
  // 获取当前插件的状态
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  const nextState = prevState === "NO" ? "OFF" : "NO";
  //   更新插件文字状态
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });

  //  如果当前插件时 NO 的时候，在当前标签的页面中嵌入一个 js 文件
  if (nextState === "NO") {
    await chrome.scripting.executeScript({
      target: {
        tabId: tab.id,
      },
      files: ["content-script.js"],
    });
  }

  //   和 content-script.js 通讯
  await chrome.tabs.sendMessage(tab.id, {
    extension: nextState,
    tab: tab,
  });
});
