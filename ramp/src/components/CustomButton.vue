<template>
  <button v-on:click="msg+='i'">{{ msg }}</button>
</template>

<script>
export default {
  name: 'CustomButton',
  props: {
    msg: String
  }
}
</script>