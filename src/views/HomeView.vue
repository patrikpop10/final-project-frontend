<template>
  <div class="home">
    <drop-down :options="options" @continueAction="setSelected"/>
    <CharacterGraph :characaters="characters"/>
  </div>
</template>

<script setup>
// @ is an alias to /src
import {ref, reactive, computed, onMounted, watch} from "vue";
import DropDown from '@/components/DropDown.vue';
import CharacterGraph from '@/components/CharacterGraph.vue';
import {getAllBooks, getSpecificBook} from "@/api/api";
const options =ref(['Lendas e Narrativas (Tomo I)',  
"A cidade do vicio", "A Casa dos Fantasmas - Volume II", 
"Alexandre Herculano","A Morte Vence", 
"Os tripeiros romance-chronica do seculo XIV", 
"Noites de insomnia, offerecidas a quem não póde dormir. Nº 08 (de 12)",
"Viagens na Minha Terra (Volume II)",
"Comedia do Campo volume III (Scenas do Minho)",
"Pelos suburbios e visinhanças de Lisboa",
"Os Maias: episodios da vida romantica"
]);
const book = ref({});
const characters = ref([]);
watch(book, (incoming, prev) => {
    characters.value = incoming.characters;
});

const setSelected = async (val) =>{
  try{
    let res = await getSpecificBook(val)
    book.value = res.data;
  }
  catch(error)
  {
    console.log()
  }
  
}
</script>
