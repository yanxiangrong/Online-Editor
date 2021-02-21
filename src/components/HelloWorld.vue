<template>
  <div id="myapp">
    <div class="row">
      <div class="row" style="margin-left: 20px">
        <label>Language</label>
        <label>
          <select v-model="selectedLang" @change="changeLang(selectedLang)">
            <option>abap</option>
            <option>aes</option>
            <option>apex</option>
            <option>azcli</option>
            <option>bat</option>
            <option>c</option>
            <option>cameligo</option>
            <option>clojure</option>
            <option>coffeescript</option>
            <option>cpp</option>
            <option>csharp</option>
            <option>csp</option>
            <option>css</option>
            <option>dart</option>
            <option>dockerfile</option>
            <option>ecl</option>
            <option>fsharp</option>
            <option>go</option>
            <option>graphql</option>
            <option>handlebars</option>
            <option>hcl</option>
            <option>html</option>
            <option>ini</option>
            <option>java</option>
            <option>javascript</option>
            <option>json</option>
            <option>julia</option>
            <option>kotlin</option>
            <option>less</option>
            <option>lexon</option>
            <option>lua</option>
            <option>m3</option>
            <option>markdown</option>
            <option>mips</option>
            <option>msdax</option>
            <option>mysql</option>
            <option>objective-c</option>
            <option>pascal</option>
            <option>pascaligo</option>
            <option>perl</option>
            <option>pgsql</option>
            <option>php</option>
            <option>plaintext</option>
            <option>postiats</option>
            <option>powerquery</option>
            <option>powershell</option>
            <option>pug</option>
            <option>python</option>
            <option>r</option>
            <option>razor</option>
            <option>redis</option>
            <option>redshift</option>
            <option>restructuredtext</option>
            <option>ruby</option>
            <option>rust</option>
            <option>sb</option>
            <option>scala</option>
            <option>scheme</option>
            <option>scss</option>
            <option>shell</option>
            <option>sol</option>
            <option>sql</option>
            <option>st</option>
            <option>swift</option>
            <option>systemverilog</option>
            <option>tcl</option>
            <option>twig</option>
            <option>typescript</option>
            <option>vb</option>
            <option>verilog</option>
            <option>xml</option>
            <option>yaml</option>
          </select>
        </label>
      </div>
      <div class="row" style="margin-left: 20px">
        <label>Theme</label>
        <label>
          <select v-model="selectedTheme" @change="changeTheme(selectedTheme)">
            <option value="vs">Visual Studio</option>
            <option value="vs-dark">Visual Studio Dark</option>
            <option value="hc-black">High Contrast Dark</option>
          </select>
        </label>
      </div>
      <div style="margin-left: 20px">
        <label>{{ workspace }}</label>
      </div>
      <div style="margin-left: 20px">
        <label>{{ workspaceId }}</label>
      </div>
      <div style="margin-left: 20px">
        <button @click="upload">保存</button>
      </div>
    </div>
    <div id="container" style="height: 100%"></div>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'
import {defineComponent, ref, onMounted} from 'vue'
import axios from 'axios';

export default defineComponent({
  name: 'HelloWorld',
  props: {
    workspaceId: {
      type: Number,
      default: 0,
    }
  },
  setup(props) {
    const selectedTheme = ref('vs')
    const selectedLang = ref('plaintext')
    const workspace = ref(0);
    let monacoEditor = null

    function initEditor() {

      monacoEditor = monaco.editor.create(document.getElementById("container"), {
        automaticLayout: true,
      })
    }

    function changeTheme(selectedTheme) {
      // const themes = ['vs', 'vs-dark', 'hc-black']
      const colors = ['#ffffff', '#1E1E1E', '#000000']
      monacoEditor.updateOptions({
        theme: selectedTheme,
      })
      document.body.style.backgroundColor = colors[selectedTheme]
    }

    function changeLang(selectedLang) {
      // const languages = ['vs', 'vs-dark', 'hc-black']
      let editorValue;
      console.log(selectedLang)
      editorValue = monacoEditor.getValue()
      monacoEditor.dispose()
      monacoEditor = monaco.editor.create(document.getElementById("container"), {
        value: editorValue,
        automaticLayout: true,
        language: selectedLang
      })
    }

    function upload() {
      console.log('upload')
      console.log(monacoEditor.getValue())
      console.log(selectedLang.value)
      console.log(selectedTheme.value)
      axios.post("http://127.0.0.1:9527/v1/upload", {
        "workspace": workspace.value,
        "content": monacoEditor.getValue(),
        "theme": selectedTheme.value,
        "language": selectedLang.value
      })
      .then(function (response) {
        console.log(response.status)
      })
    }

    function getWorkspace() {
      axios.post("http://127.0.0.1:9527/v1/create")
          .then(function (response) {
            workspace.value = response.data["workspace"]
            console.log("Get new workspace " + workspace.value)
          })
    }

    function getEditorData() {
      axios.post("http://127.0.0.1:9527/v1/workspace",
          {
            "workspace": workspace.value,
          })
          .then(function (response) {
            selectedTheme.value = response.data["data"]["theme"]
            selectedLang.value = response.data["data"]["language"]
            monacoEditor.updateOptions({
              value: response.data["data"]["content"],
              theme: selectedTheme,
              language: selectedLang,
            })
          })
    }

    onMounted(() => {
      setInterval(function () {
        let myapp = document.getElementById('myapp')
        myapp.style.height = document.documentElement.clientHeight - 80 + 'px'
      }, 500)
      initEditor()
      console.log("Open workspace " + props.workspaceId)
      if (props.workspaceId === 0) {
        getWorkspace()
      } else {
        workspace.value = props.workspaceId
        getEditorData()
      }
    })

    return {
      upload, monacoEditor, selectedTheme, selectedLang, changeLang, changeTheme,
      workspace,
    }
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body, button, input, select {
  font: 400 14px/1.4em "Segoe UI", "Open Sans", Calibri, Candara, Arial, sans-serif;
  line-height: 20px;
  font-size: 14px;
  font-family: "Segoe UI", "Open Sans", Calibri, Candara, Arial, sans-serif;
}

select {
  width: 220px;
  border: 1px solid #bbb;
  line-height: 30px;
  display: inline-block;
  padding: 4px 6px;
  margin: 0 0 10px;
  font-size: 14px;
  color: black;
  vertical-align: middle;
}

button, input, label, select {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}

label {
  display: block;
  line-height: 30px;
  margin-right: 4px;
  vertical-align: middle;
}

.row {
  display: flex;
  flex-direction: row;
}

#container {
  border: 1px solid gray;
}
</style>
