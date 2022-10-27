<template>
    
<select v-model="selected" @input="(event) =>continueEmit(event.target.value)">
  <option disabled value="">Please select one</option>
  <option v-for="option in props.options" :value="option" >{{option}}</option>
</select>
</template>

<script setup>
import {defineEmits, defineProps, ref} from "vue";
const props = defineProps({
    options: Array
});
const emit = defineEmits(["continueAction"]);
const selected = ref("");
const continueEmit = (event) => emit('continueAction',event)

</script>