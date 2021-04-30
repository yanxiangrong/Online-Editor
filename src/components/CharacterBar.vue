<template>
  <div class="buttonPanel">
    <button class="myButton">&lt;</button>
    <button class="myButton">></button>
    <button class="myButton">/</button>
    <button class="myButton">=</button>
    <button class="myButton">"</button>
    <button class="myButton">:</button>
    <button class="myButton">@</button>
    <button class="myButton">+</button>
    <button class="myButton">(</button>
    <button class="myButton">)</button>
    <button class="myButton">;</button>
    <button class="myButton">,</button>
    <button class="myButton">.</button>
    <button class="myButton">?</button>
    <button class="myButton">|</button>
    <button class="myButton">\</button>
    <button class="myButton">&amp;</button>
    <button class="myButton">!</button>
    <button class="myButton">[</button>
    <button class="myButton">]</button>
    <button class="myButton">{</button>
    <button class="myButton">}</button>
    <button class="myButton">_</button>
    <button class="myButton">-</button>
  </div>
</template>

<script>
export default {
  name: "CharacterBar"
}
</script>

<style scoped>
.buttonPanel {
  overflow:auto;
  display: flex;
  flex-direction: row;
  margin-top: 2px;
  margin-left: -8px;
  margin-right: -8px;
}

.myButton {
  border-width: 0;
  border-radius: 0;
  white-space: nowrap;
  text-align: center;
  width: 32px;
  min-width: 32px;
  padding-bottom: 4px;
  padding-top: 4px;
  font-size: 24px;
}

.myButton:hover {
  background-color: #e1e1e1;
}

.myButton:active {
  background-color: #c7c7c7;
}
</style>
