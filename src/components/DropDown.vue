<template>

<select v-if="hasSearch" v-model="selected" @input="(event) =>continueEmit(event.target.value)">
  <option disabled value="">Please select one</option>
  <option v-for="option in props.options" :value="option" >{{option}}</option>
</select>
<input placeholder="Please select one" list="mylist" v-else v-model="selected" @keyup.enter="(event) =>continueEmit(event.target.value)">
  <datalist id="mylist" class="list" @click="console.log(11)">
  <option v-for="option in props.options" :value="option" >{{option}}</option>  
  </datalist>
</template>

<script setup>
import {defineEmits, defineProps, ref} from "vue";
const props = defineProps({
    options: Array,
    hasSearch: Boolean
});
const emit = defineEmits(["continueAction"]);
const selected = ref("");
const continueEmit = (event) => emit('continueAction',event)
</script>

<style scoped>
select, input {
  padding: 16px 20px;
  border: none;
  border-radius: 4px;
  background-color: #373F51;
  padding: 10px;
  margin: 10px;
}
input {
  width: 30%;
}
option {
  padding: 10px;
  margin: 10px;
  background-color: inherit;
  background-color: #373F51;
}
.list{
  padding: 10px;
  margin: 10px;
  background-color: inherit;
  background-color: #EEE5E9;
  z-index: 1;
}

</style>