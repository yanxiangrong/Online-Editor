<template>
  <div id="myDrawer" style="margin-top: -48px; padding-left: 20px; padding-right: 20px; overflow-y: auto">
    <div class="title">操作提示</div>
    <p>点击上传，你的代码就会被保存到云端；点击分享，会复制一个链接，你可以通过该链接打开你的代码，并且可以继续编辑。</p>
    <p>选择语言才能开启代码高亮。</p>
    <p>可以在运行设置里面设置输入数据。</p>
    <p>点击分享按钮和运行按钮时会自动上传。</p>
    <p>语言和主题设置会随着代码一起被保存。</p>
    <p>目前支持 C、C++、Python、Java、Go 语言的运行。</p>
    <p>目前支持 Html、JavaScript 语言的完整代码补全，其它语言只支持基础代码补全。</p>
    <p>"Error: Request failed with status code 502" 是什么意思?</p>
    <p>大概率是后端崩了🤪。</p>
    <div class="title" style="margin-top: 55px">运行提示</div>
    <p>Python 的运行环境是 Python 3.7。</p>
    <p>Java 代码的主类类名必须是 Main 才能运行。</p>
    <div class="title" style="margin-top: 55px">关于</div>
    <p>为什么这么久了才更新？</p>
    <p>在此之前，我为了代码高亮，显示行号，代码补全等功能，查找了很多资料，尝试过许多方法，但是始终没有找到一种让我满意的方案。</p>
    <p>直到我遇到了 Monaco Editor，Monaco Editor 是微软公司开发的一款 Web 编辑器，它的很大一部分的代码和 Visual Studio Code 都是共用的，
      拥有 Visual Studio Code 的许多强大的功能。
    </p>
    <p>在 Monaco Editor 的基础上，我开发了这款在线编辑器。顺带一提，该项目已在 GitHub 上开源。</p>
    <p>项目地址
      <a style="word-wrap: break-word" target="_blank" href="https://github.com/yanxiangrong/Online-Editor">
        https://github.com/yanxiangrong/Online-Editor
      </a>
    </p>
  </div>
</template>

<script>
import {onMounted, onUnmounted} from "vue";

export default {
  name: "Help",
  setup() {
    let intervalId;
    onMounted(() => {
      intervalId = setInterval(function () {
        let myDrawer = document.getElementById('myDrawer')
        myDrawer.style.height = document.documentElement.clientHeight - 40 + 'px'
      }, 500)
    })
    onUnmounted(() => {
      clearInterval(intervalId)
    })
  }
}
</script>

<style scoped>

.title {
  font-weight: 400;
  color: #1f2f3d;
  font-size: 22px;
  margin: 0 0 20px 0;
}

body {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
}

p {
  font-size: 14px;
  color: #5e6d82;
  line-height: 1.5em;
}

</style>