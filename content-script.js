// 只在首次加载有效
if (!window.firstLoad) {
  console.log("开始咯！！");

  window.firstLoad = true;

  const eventArrowRight = {
    bubbles: true,
    code: "ArrowRight",
    key: "ArrowRight",
    keyCode: 39,
  };

  // 创建一个开始的 加速 事件对象
  var speedDown = new KeyboardEvent("keydown", eventArrowRight);
  var speedUp = new KeyboardEvent("keyup", eventArrowRight);

  // 定时器
  var timer;

  var start = () => {
    timer = setInterval(() => {
      document.dispatchEvent(speedDown);
      console.log("加速中~~");
    }, 300);
  };

  var close = () => {
    clearInterval(timer);

    // 防止清楚后还持续加速
    document.dispatchEvent(speedDown);
    document.dispatchEvent(speedUp);
    console.log("结束！！");
  };

  // 接受 backaground 通讯
  chrome.runtime.onMessage.addListener((message) => {
    console.log(message);
    const { extension, tab } = message;
    const { url } = tab;
    const reg = /^https:\/\/www.bilibili.com/;

    if (reg.test(url) && extension === "NO") {
      start();
      console.log("B站");
    } else {
      close();
    }
  });
}
