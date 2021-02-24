<template>
  <div style="padding-left: 20px; padding-right: 20px; margin-top: -48px; overflow-y: auto">
    <div class="title">输入数据</div>
    <div class="row">
<!--      <el-radio v-model="radio" label=1 disabled>从工作区导入</el-radio>-->
<!--      <el-input style="width: 140px" size="small" v-model="inputId" placeholder="请输入工作区编号" disabled></el-input>-->
    </div>
    <div class="row">
      <el-radio v-model="radio" label=2>从文本域输入</el-radio>
      <el-input class="code" type="textarea" placeholder="请输入内容" :autosize="{ minRows: 2, maxRows: 8}"
                v-model="inputText" @change="changeInput">
      </el-input>
    </div>
<!--    <div class="row" style="justify-content: flex-end">-->
<!--      <el-button size="small">取消</el-button>-->
<!--      <el-button size="small" type="primary">保存</el-button>-->
<!--    </div>-->

  </div>
</template>

<script>
import {onMounted, onBeforeUnmount, ref} from "vue";

export default {
  name: "RunSetting",
  props: {
    data: String
  },
  // data() {
  //   return {
  //     inputData: ""
  //   }
  // },
  setup(props, ctx) {
    const radio = ref("1")
    const inputId = ref("")
    const inputText = ref("")
    function changeInput() {
      ctx.emit("update:data", inputText.value)
    }
    onMounted(() => {
      inputText.value = props.data
    })
    onBeforeUnmount(() => {
      changeInput()
    })

    return {
      radio, inputId, inputText, changeInput
    }
  }
}
</script>

<style scoped>
.row {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
}

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


.code {
  white-space: pre;
  font-family: Consolas, "Courier New", monospace;
  font-weight: normal;
  font-size: 14px;
  font-feature-settings: "liga" 0, "calt" 0;
  line-height: 19px;
  letter-spacing: 0;
}

</style>