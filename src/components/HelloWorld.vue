<template>
  <div id="myapp">
    <div class="option">
      <el-row>
        <el-col :span="12" :xs="24">
          <div class="row">
            <div class="row" style="margin-left: 10px">
              <label>语言</label>
              <el-select size="small" @change="changeLang(selectedLang)"
                         v-model="selectedLang">
                <el-option v-for="item in codeLanguages" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </div>
            <div class="row" style="margin-left: 20px">
              <label>主题</label>
              <el-select size="small" v-model="selectedTheme" @change="changeTheme(selectedTheme)">
                <el-option v-for="item in themes" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </div>
            <div style="margin-left: 20px">
              <el-tooltip :show-after=1000 effect="dark" content="操作提示和关于" placement="bottom">
                <el-button size="small" circle icon="el-icon-s-opportunity" @click="drawer = true"></el-button>
              </el-tooltip>
            </div>
          </div>
        </el-col>

        <el-col :span="12" :xs="24">
          <div class="row">
            <div style="margin-left: auto">
              <label> {{ workspace === 0 ? "正在创建工作区..." : "工作区: " + workspace }}</label>
            </div>
            <div style="margin-left: 20px; margin-right: 10px">
              <el-button-group style="width: 219px; white-space: nowrap">
                <el-button size="small" type="success" icon="el-icon-caret-right" @click="dialogVisible = true">运行
                </el-button>
                <el-button @click="upload" size="small" icon="el-icon-upload" :loading="uploading" type="primary">上传
                </el-button>
                <el-popover :show-after="1000" placement="bottom-end" :width="400" trigger="hover">
                  <span style="margin-right: 20px">你可以通过下面的链接打开此页面</span><br/>
                  <el-link type="primary" target="_blank" :href="pageUrl">
                    {{ pageUrl }}
                  </el-link>
                  <br/>
                  <span style="margin-right: 20px">点击按钮以复制</span><br/>
                  <template #reference>
                    <el-button size="small" type="primary" icon="el-icon-share"
                               @click="shareDialogVisible = true; upload()"
                               v-clipboard:copy="pageUrl"
                               v-clipboard:success="onCopy">分享
                    </el-button>
                  </template>
                </el-popover>
              </el-button-group>
            </div>
          </div>
        </el-col>
      </el-row>

    </div>
    <div id="container" style="height: 100%;"></div>
    <el-dialog
        v-model="dialogVisible"
        destroy-on-close
    >
      <span>这个功能程序员小哥哥还在开发中</span><br/>
      <el-image style="width: 400px; height: auto"
                fit="scale-down" src="../assets/coding-freak.gif"/>
      <template #footer>
    <span>
      <el-button type="primary" @click="dialogVisible = false">好 的</el-button>
    </span>
      </template>
    </el-dialog>

    <el-drawer
        v-model="drawer"
        direction="ltr"
        destroy-on-close>
      <Help/>
    </el-drawer>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'
import {defineComponent, ref, onMounted, onUnmounted} from 'vue'
import axios from 'axios';
import {ElMessage} from 'element-plus'
import Help from "@/components/Help";

export default defineComponent({
  name: 'HelloWorld',
  components: {Help},
  props: {
    workspaceId: {
      type: Number,
      default: 0,
    }
  },
  data() {
    return {
      codeLanguages: [
        {label: "abap", value: "abap"}, {label: "aes", value: "aes"}, {label: "apex", value: "apex"}, {
          label: "azcli",
          value: "azcli"
        }, {label: "bat", value: "bat"}, {label: "c", value: "c"}, {
          label: "cameligo",
          value: "cameligo"
        }, {label: "clojure", value: "clojure"}, {label: "coffeescript", value: "coffeescript"}, {
          label: "cpp",
          value: "cpp"
        }, {label: "csharp", value: "csharp"}, {label: "csp", value: "csp"}, {
          label: "css",
          value: "css"
        }, {label: "dart", value: "dart"}, {label: "dockerfile", value: "dockerfile"}, {
          label: "ecl",
          value: "ecl"
        }, {label: "fsharp", value: "fsharp"}, {label: "go", value: "go"}, {
          label: "graphql",
          value: "graphql"
        }, {label: "handlebars", value: "handlebars"}, {label: "hcl", value: "hcl"}, {
          label: "html",
          value: "html"
        }, {label: "ini", value: "ini"}, {label: "java", value: "java"}, {
          label: "javascript",
          value: "javascript"
        }, {label: "json", value: "json"}, {label: "julia", value: "julia"}, {
          label: "kotlin",
          value: "kotlin"
        }, {label: "less", value: "less"}, {label: "lexon", value: "lexon"}, {label: "lua", value: "lua"}, {
          label: "m3",
          value: "m3"
        }, {label: "markdown", value: "markdown"}, {label: "mips", value: "mips"}, {
          label: "msdax",
          value: "msdax"
        }, {label: "mysql", value: "mysql"}, {label: "objective-c", value: "objective-c"}, {
          label: "pascal",
          value: "pascal"
        }, {label: "pascaligo", value: "pascaligo"}, {label: "perl", value: "perl"}, {
          label: "pgsql",
          value: "pgsql"
        }, {label: "php", value: "php"}, {label: "plaintext", value: "plaintext"}, {
          label: "postiats",
          value: "postiats"
        }, {label: "powerquery", value: "powerquery"}, {label: "powershell", value: "powershell"}, {
          label: "pug",
          value: "pug"
        }, {label: "python", value: "python"}, {label: "r", value: "r"}, {
          label: "razor",
          value: "razor"
        }, {label: "redis", value: "redis"}, {label: "redshift", value: "redshift"}, {
          label: "restructuredtext",
          value: "restructuredtext"
        }, {label: "ruby", value: "ruby"}, {label: "rust", value: "rust"}, {label: "sb", value: "sb"}, {
          label: "scala",
          value: "scala"
        }, {label: "scheme", value: "scheme"}, {label: "scss", value: "scss"}, {
          label: "shell",
          value: "shell"
        }, {label: "sol", value: "sol"}, {label: "sql", value: "sql"}, {label: "st", value: "st"}, {
          label: "swift",
          value: "swift"
        }, {label: "systemverilog", value: "systemverilog"}, {label: "tcl", value: "tcl"}, {
          label: "twig",
          value: "twig"
        }, {label: "typescript", value: "typescript"}, {label: "vb", value: "vb"}, {
          label: "verilog",
          value: "verilog"
        }, {label: "xml", value: "xml"}, {label: "yaml", value: "yaml"},
      ],
      themes: [
        {
          label: "Visual Studio 亮",
          value: "vs"
        },
        {
          label: "Visual Studio 暗",
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
    const shareDialogVisible = ref(false);
    const uploading = ref(false);
    const drawer = ref(false);
    const templateUrl = "https://editor.yandage.top/?workspace="
    const backEndUrl = "https://editor.yandage.top"
    const pageUrl = ref("");
    let intervalId;

    let monacoEditor = null

    function initEditor() {
      monacoEditor = monaco.editor.create(document.getElementById("container"), {
        automaticLayout: true,
      })
    }

    function changeTheme(theme) {
      const themes = ['vs', 'vs-dark', 'hc-black']
      const colors = ['#ffffff', '#1E1E1E', '#000000']
      let i = 0;
      while (themes[i] !== theme && i < 10) {
        i++
      }
      if (i === 10) {
        console.error("主题不存在")
        return
      }
      monacoEditor.updateOptions({
        theme: theme,
      })
      document.body.style.backgroundColor = colors[i]
      document.body.style.color = (i === 0 ? '#444444' : '#ffffff')
    }

    function changeLang(language) {
      // const codeLanguages = ['vs', 'vs-dark', 'hc-black']
      // let editorValue;
      // console.log(selectedLang)
      // editorValue = monacoEditor.getValue()
      // monacoEditor.dispose()
      // monacoEditor = monaco.editor.create(document.getElementById("container"), {
      //   value: editorValue,
      //   automaticLayout: true,
      //   language: selectedLang
      // })
      if (language === "") {
        console.error("语言值为空")
        return
      }
      monaco.editor.setModelLanguage(monacoEditor.getModel(), language)
    }

    function upload() {
      console.log('upload')
      uploading.value = true
      axios.post(backEndUrl + "/v1/upload", {
        "workspace": workspace.value,
        "content": monacoEditor.getValue(),
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

    function getWorkspace() {
      axios.post(backEndUrl + "/v1/create")
          .then(function (response) {
            if (response.data["result"] >= 0) {
              workspace.value = response.data["workspace"]
              pageUrl.value = templateUrl + workspace.value
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
              monacoEditor.setValue(response.data["data"]["content"])
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
              message: "获取数据失败, " + error,
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
        if (document.documentElement.clientWidth < 768) {
          myapp.style.height = document.documentElement.clientHeight - 104 + 'px'
        } else {
          myapp.style.height = document.documentElement.clientHeight - 72 + 'px'
        }
      }, 500)
      initEditor()
      console.log("Open workspace " + props.workspaceId)
      if (props.workspaceId === 0) {
        getWorkspace()
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
      upload, monacoEditor, selectedTheme, selectedLang, changeLang, changeTheme,
      workspace, dialogVisible, shareDialogVisible, pageUrl, onCopy, uploading,
      drawer
    }
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*body, button, input, select {*/
/*  font: 400 14px/1.4em "Segoe UI", "Open Sans", Calibri, Candara, Arial, sans-serif;*/
/*  line-height: 20px;*/
/*  font-size: 14px;*/
/*  font-family: "Segoe UI", "Open Sans", Calibri, Candara, Arial, sans-serif;*/
/*}*/

/*select {*/
/*  width: 220px;*/
/*  border: 1px solid #bbb;*/
/*  line-height: 30px;*/
/*  display: inline-block;*/
/*  padding: 4px 6px;*/
/*  margin: 0 0 10px;*/
/*  font-size: 14px;*/
/*  color: black;*/
/*  vertical-align: middle;*/
/*}*/

/*button, input, label, select {*/
/*  font-size: 14px;*/
/*  font-weight: 400;*/
/*  line-height: 20px;*/
/*}*/

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
</style>
