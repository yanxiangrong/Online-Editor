<template>
  <div id="myapp">
    <div class="option">
      <el-row>
        <el-col :md="15" :sm="13" :xs="24">
          <div class="row">
            <div class="hidden-md-and-down" style="width: 10px"/>
            <el-button type="primary" size="small"
                       onclick="window.open('https://editor.yandage.top', '_blank')">
              <div class="row">
                <el-icon class="el-icon-plus"/>
                <div class="hidden-sm-and-down" style="margin-left: 5px">新建</div>
              </div>
            </el-button>
            <div class="hidden-md-and-down" style="width: 5px"/>
            <div class="row" style="margin-left: 5px">
              <label>语言</label>
              <el-select size="small" @change="changeLang(selectedLang)"
                         v-model="selectedLang">
                <el-option v-for="item in codeLanguages" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </div>
            <div class="hidden-md-and-down" style="width: 5px"/>
            <div class="row" style="margin-left: 5px">
              <label>主题</label>
              <el-select size="small" v-model="selectedTheme" @change="changeTheme(selectedTheme)">
                <el-option v-for="item in themes" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </div>
            <div class="hidden-md-and-down" style="width: 5px"/>
            <div style="margin-left: 5px">
              <el-button size="small" plain @click="runSettingDrawer = true">运行设置</el-button>
            </div>
            <div class="hidden-md-and-down" style="width: 5px"/>
            <div style="margin-left: 5px" class="hidden-xs-only">
              <el-tooltip :show-after=1000 effect="dark" content="操作提示和关于" placement="bottom">
                <el-button size="small" circle icon="el-icon-s-opportunity" @click="drawer = true"></el-button>
              </el-tooltip>
            </div>
          </div>
          <div class="hidden-sm-and-up" style="height: 3px"/>
        </el-col>

        <el-col :md="9" :sm="11" :xs="24">
          <div class="row">
            <div style="justify-content: start" class="hidden-sm-and-up">
              <el-tooltip :show-after=1000 effect="dark" content="操作提示和关于" placement="bottom">
                <el-button size="small" circle icon="el-icon-s-opportunity" @click="drawer = true"></el-button>
              </el-tooltip>
            </div>
            <div style="margin-left: auto">
              <label> {{ workspace === 0 ? "正在准备工作区..." : "工作区: " + workspace }}</label>
            </div>
            <div class="hidden-md-and-down" style="width: 15px"/>
            <div style="margin-left: 5px;">
              <el-button-group style="white-space: nowrap">
                <el-popover placement="bottom-end"
                            :width="clientWidth > 650 ? 560 : 340" trigger="manual"
                            v-model:visible="runDialogVisible">
                  <div>
                    <div :style="clientHeight > 600 ? 'max-height: 400px' : 'max-height: 200px'"
                         style="width: 100%; overflow: auto">
                      <code>{{ runResult }}</code>
                    </div>
                    <div class="row">
                      <el-button size="mini" @click="runDialogVisible = false">关闭</el-button>
                      <label style="margin-left: 40px">运行时间: {{ runDuration }} ms</label>
                    </div>
                  </div>
                  <template #reference>
                    <el-button size="small" type="success" icon="el-icon-caret-right" :loading="running"
                               @click="runCode" :disabled="disableUpload">运行
                    </el-button>
                  </template>
                </el-popover>
                <el-button @click="upload" size="small" icon="el-icon-upload" :loading="uploading" type="primary"
                           :disabled="disableUpload">上传
                </el-button>
                <el-popover :show-after="1000" placement="bottom-end" :width="340" trigger="hover">
                  <span style="margin-right: 20px">你可以通过下面的链接打开此页面</span><br/>
                  <el-link type="primary" target="_blank" :href="pageUrl">
                    {{ pageUrl }}
                  </el-link>
                  <br/>
                  <span style="margin-right: 20px">点击按钮以复制</span><br/>
                  <template #reference>
                    <el-button size="small" type="primary" icon="el-icon-share"
                               @click="shareDialogVisible = true; upload()" v-clipboard:copy="pageUrl"
                               v-clipboard:success="onCopy" :disabled="disableUpload">分享
                    </el-button>
                  </template>
                </el-popover>
              </el-button-group>
            </div>
            <div class="hidden-md-and-down" style="width: 10px"/>
          </div>
        </el-col>
      </el-row>

    </div>
    <div class="codeMirror" style="height: 100%" id="container">
      <textarea id="myTextArea"/>
    </div>
    <el-dialog v-model="dialogVisible" destroy-on-close>
      <span>目前仅支持 C、C++、Python、Java、Go 语言的运行</span><br/>
      <el-image style="max-width: 400px; height: auto" fit="scale-down" src="../assets/coding-freak.gif"/>
      <template #footer>
      <span>
        <el-button type="primary" @click="dialogVisible = false">好 的</el-button>
      </span>
      </template>
    </el-dialog>

    <el-drawer :size="clientWidth >= 992 ? '30%' : clientWidth >= 768 ? '50%' : '70%'" v-model="drawer" direction="ltr"
               destroy-on-close>
      <Help/>
    </el-drawer>
    <el-drawer v-model="runSettingDrawer" direction="ttb" size="50%" destroy-on-close>
      <RunSetting v-model:data="runInput"/>
    </el-drawer>
  </div>
</template>

<script>
import {defineComponent, ref, onMounted, onUnmounted} from 'vue'
import 'element-plus/lib/theme-chalk/display.css';
import axios from 'axios';
import {ElMessage} from 'element-plus'
import Help from "@/components/Help";
import RunSetting from "@/components/RunSetting";
import router from '../router'

import CodeMirror from 'codemirror/lib/codemirror.js';
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/lesser-dark.css'
import 'codemirror/theme/colorforth.css'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/mode/clike/clike.js';
import 'codemirror/mode/go/go.js';
import 'codemirror/mode/python/python.js';

export default defineComponent({
  name: 'Another',
  components: {RunSetting, Help},
  props: {
    workspaceId: {
      type: Number,
      default: 0,
    }
  },
  data() {
    return {
      codeLanguages: [
        {label: "c", value: "c"}, {label: "cpp", value: "cpp"}, {label: "go", value: "go"}, {
          label: "java",
          value: "java"
        },
        {label: "kotlin", value: "kotlin"}, {label: "plaintext", value: "plaintext"}, {
          label: "python",
          value: "python"
        },
      ],
      themes: [
        {
          label: "亮",
          value: "vs"
        },
        {
          label: "暗",
          value: "vs-dark"
        },
        {
          label: "高对比度",
          value: "hc-black"
        }
      ]
    }
  },
  setup(props) {
    const selectedTheme = ref('vs')
    const selectedLang = ref('plaintext')
    const workspace = ref(0);
    const dialogVisible = ref(false);
    const runDialogVisible = ref(false);
    const shareDialogVisible = ref(false);
    const uploading = ref(false);
    const running = ref(false);
    const runResult = ref("");
    const runDuration = ref(0);
    const runInput = ref("");
    const disableUpload = ref(true)
    const drawer = ref(false);
    const clientWidth = ref(0)
    const clientHeight = ref(0)
    const runSettingDrawer = ref(false);
    const templateUrl = "https://editor.yandage.top/#/?workspace="
    const backEndUrl = "https://editor.yandage.top"
    // const backEndUrl = "http://127.0.0.1:9527"
    const pageUrl = ref("");
    let intervalId;

    let codeEditor = null

    function initEditor() {
      codeEditor = CodeMirror.fromTextArea(document.getElementById("myTextArea"), {
        lineNumbers: true,// 显示行号
        smartIndent: true, //智能缩进
        indentUnit: 4, // 智能缩进单位为4个空格长度
        indentWithTabs: true,  // 使用制表符进行智能缩进
        // lineWrapping: true,//
        // 在行槽中添加行号显示器、折叠器、语法检测器`
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
        foldGutter: true, // 启用行槽中的代码折叠
        autofocus: true,  //自动聚焦
        matchBrackets: true,// 匹配结束符号，比如"]、}"
        autoCloseBrackets: true, // 自动闭合符号
        styleActiveLine: true, // 显示选中行的样式
        lineWiseCopyCut: true, // 整行复制
        // mode: '',
        theme: 'default',  //colorforth //lesser-dark
      });
      codeEditor.setSize('auto', "100%");
    }

    function changeTheme(theme) {
      const themes = ['vs', 'vs-dark', 'hc-black']
      const mirrorThemes = ["default", "lesser-dark", "colorforth"]
      const colors = ['#ffffff', '#1E1E1E', '#000000']
      let i = 0;
      while (themes[i] !== theme && i < themes.length) {
        i++
      }
      if (i === themes.length) {
        console.error("主题不存在")
        return
      }
      codeEditor.setOption("theme", mirrorThemes[i])
      document.body.style.backgroundColor = colors[i]
      document.body.style.color = (i === 0 ? '#444444' : '#ffffff')
    }

    function changeLang(language) {
      const languages = ['c', 'cpp', 'go', 'java', 'kotlin', 'plaintext', 'python']
      const mirrorLanguages = ["text/x-csrc", "text/x-c++src", "text/x-java", "text/x-go", "text/x-kotlin", "", "python"]
      let i = 0
      while (languages[i] !== language && i < languages.length) {
        i++
      }
      if (i === languages.length) {
        console.error("语言不存在")
        return
      }
      if (language === "") {
        console.error("语言值为空")
        return
      }
      // console.log(mirrorLanguages[i])
      if (mirrorLanguages[i] === "python") {
        codeEditor.setOption("mode", {name: "python", version: 3, singleLineStringErrors: false})
      } else {
        codeEditor.setOption("mode", mirrorLanguages[i])
      }
    }

    async function upload() {
      console.log('upload')
      uploading.value = true
      await axios.post(backEndUrl + "/v1/upload", {
        "workspace": workspace.value,
        "content": codeEditor.getValue(),
        "theme": selectedTheme.value,
        "language": selectedLang.value
      })
          .then(function (response) {
            console.log(response.status)
            uploading.value = false
            if (response.data["result"] >= 0) {
              ElMessage.success({
                showClose: true,
                message: "上传成功",
                type: "success"
              });
            } else {
              console.log(response.data)
              ElMessage.error({
                showClose: true,
                duration: 0,
                message: "来自后端的错误: " + response.data["content"],
                type: "error"
              });
            }
          })
          .catch(function (error) {
            uploading.value = false
            ElMessage.error({
              showClose: true,
              duration: 0,
              message: "上传失败, " + error,
              type: "error"
            });
          })
    }

    async function getWorkspace() {
      await axios.post(backEndUrl + "/v1/create")
          .then(function (response) {
            if (response.data["result"] >= 0) {
              workspace.value = response.data["workspace"]
              pageUrl.value = templateUrl + workspace.value
              disableUpload.value = false
            } else {
              console.log(response.data)
              ElMessage.error({
                showClose: true,
                duration: 0,
                message: "来自后端的错误: " + response.data["content"],
                type: "error"
              });
            }
            console.log("Get new workspace " + workspace.value)
          })
          .catch(function (error) {
            uploading.value = false
            ElMessage.error({
              showClose: true,
              duration: 0,
              message: "创建工作区失败, " + error,
              type: "error"
            });
          })
    }

    function getEditorData() {
      axios.post(backEndUrl + "/v1/workspace",
          {
            "workspace": workspace.value,
          })
          .then(function (response) {
            if (response.data["result"] >= 0) {
              selectedTheme.value = response.data["data"]["theme"]
              selectedLang.value = response.data["data"]["language"]
              console.log(response.data["data"])
              changeTheme(selectedTheme.value)
              changeLang(selectedLang.value)
              codeEditor.setOption("value", response.data["data"]["content"])
              disableUpload.value = false
            } else {
              console.log(response.data)
              ElMessage.error({
                showClose: true,
                duration: 0,
                message: "来自后端的错误: " + response.data["content"],
                type: "error"
              });
            }
          })
          .catch(function (error) {
            ElMessage.error({
              showClose: true,
              duration: 0,
              message: "获取数据失败, " + error,
              type: "error"
            });
          })
    }

    async function runCode() {
      const canRun = "c" + "cpp" + "go" + "python" + "java"
      if (canRun.indexOf(selectedLang.value) === -1) {
        dialogVisible.value = true
        return
      }
      await upload()
      running.value = true
      console.log(runInput.value)
      axios.post(backEndUrl + "/v1/run",
          {
            "workspace": workspace.value,
            "input_string": runInput.value
          })
          .then(function (response) {
            running.value = false
            if (response.data["result"] >= 0) {
              console.log(response.data["output"])
              runResult.value = response.data["output"]
              runDuration.value = response.data["duration"]
              runDialogVisible.value = true
            } else {
              console.log(response.data)
              ElMessage.error({
                showClose: true,
                duration: 0,
                message: "来自后端的错误: " + response.data["content"],
                type: "error"
              });
            }
          })
          .catch(function (error) {
            running.value = false
            ElMessage.error({
              showClose: true,
              duration: 0,
              message: "错误, " + error,
              type: "error"
            });
          })
    }

    function onCopy() {
      ElMessage({
        showClose: true,
        message: "已复制分享链接"
      });
    }

    onMounted(() => {
      intervalId = setInterval(function () {
        let myapp = document.getElementById('myapp')
        clientHeight.value = document.documentElement.clientHeight
        clientWidth.value = document.documentElement.clientWidth
        if (document.documentElement.clientWidth < 768) {
          myapp.style.height = clientHeight.value - 107 + 'px'
        } else {
          myapp.style.height = clientHeight.value - 72 + 'px'
        }
      }, 500)
      initEditor()
      console.log("Open workspace " + props.workspaceId)
      if (props.workspaceId === 0) {
        (async function () {
          await getWorkspace()
          await router.push({path: "/v2", query: {workspace: workspace.value}})
        }())
      } else {
        workspace.value = props.workspaceId
        pageUrl.value = templateUrl + workspace.value
        getEditorData()
      }
    })

    onUnmounted(() => {
      clearInterval(intervalId)
    })

    return {
      upload, codeEditor, selectedTheme, selectedLang, changeLang, changeTheme,
      workspace, dialogVisible, shareDialogVisible, pageUrl, onCopy, uploading,
      drawer, runSettingDrawer, runCode, running, runDialogVisible, runResult,
      runInput, runDuration, disableUpload, clientHeight, clientWidth
    }
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
label {
  display: block;
  line-height: 30px;
  margin-right: 4px;
  font-size: 14px;
  font-weight: 400;
  vertical-align: middle;
  white-space: nowrap;
}

.option {
  margin-bottom: 4px;
}

.row {
  display: flex;
  flex-direction: row;
}

#container {
  border: 1px solid gray;
}

body {
  color: #444444;;
}

code {
  white-space: pre;
  font-family: Consolas, "Courier New", monospace;
  font-weight: normal;
  font-size: 14px;
  font-feature-settings: "liga" 0, "calt" 0;
  line-height: 19px;
  letter-spacing: 0;
}

.codeMirror {
  font-family: Consolas, "Courier New", monospace;
  font-weight: normal;
  font-size: 14px;
  font-feature-settings: "liga" 0, "calt" 0;
  line-height: 19px;
  letter-spacing: 0;
}
</style>
