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
  const eventSpace = {
    bubbles: true,
    code: "Space",
    key: " ",
    keyCode: 32,
  };

  // 创建一个开始的 加速 事件对象
  var speedDown = new KeyboardEvent("keydown", eventArrowRight);
  var speedUp = new KeyboardEvent("keyup", eventArrowRight);
  // 暂停的空格对象
  var speedSpace = new KeyboardEvent("keydown", eventSpace);

  // 定时器
  var timer;

  // 是否是开启加速
  var isStart = false;

  // 是否已经开启加速
  var isStartFast = false;

  // 开始加速
  var start = () => {
    timer = setInterval(() => {
      document.dispatchEvent(speedDown);
      console.log("加速中~~");
    }, 300);
  };

  // 关闭加速
  var close = () => {
    const isFalse = Boolean(timer);
    clearInterval(timer);
    timer = null;
    if (isFalse) {
      // 防止清楚后还持续加速
      document.dispatchEvent(speedDown);
      document.dispatchEvent(speedUp);
    }
    console.log("结束！！");
  };


  // 摁下空格键
  var enterSpace = () => {
    setTimeout(() => {
      if (
        !document
          .querySelector(".bili-paused")
          ?.classList?.contains("bili-paused") ||
        !document.querySelector(".bili-paused")
      ) {
        document.dispatchEvent(speedSpace);
        document.dispatchEvent(speedSpace);
        document.dispatchEvent(speedSpace);
      }
    }, 300);
  }

  // 失去焦点停止加速
  window.addEventListener("blur", (e) => {
    if (isStart) {
      isStartFast = false;
    }

    close();

    console.log(document.querySelector(".bili-paused"));
    // 如果是在暂停状态，就不做事情

    enterSpace()

    console.log("失去焦点");
  });

  // 失去焦点停止加速
  window.addEventListener("focus", (e) => {
    if (isStartFast) return;
    isStartFast = true;
    console.log("获取焦点");

    start();
  });

  // 接受 backaground 通讯
  chrome.runtime.onMessage.addListener((message) => {
    console.log(message);
    const { extension, tab } = message;
    isStart = extension === "NO";

    const { url } = tab;
    const reg = /^https:\/\/www.bilibili.com/;

    if (reg.test(url) && extension === "NO") {
      start();
      isStartFast = true;
      console.log("B站");
    } else {
      isStartFast = true;
      close();
    }
  });
}
