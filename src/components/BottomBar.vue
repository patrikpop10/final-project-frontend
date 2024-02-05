<template>
<div class="bar">
    <div class="section">
        <div class="section-title">{{props.book?.name ?? 'Book'}}</div>
        <div class="section-content">
            <div class="book">
                <div class="description" v-if=" props.book.bookDescription != 'not found' ">{{props.book?.bookDescription }}</div>
                </div>

        </div>
    </div>

    <div class="section character-section">
        <div class="section-title">{{props.book?.author ?? 'Author'}}</div>
        <div class="section-content">
        <div class="description" v-if=" props.book.authorDescription != 'not found' ">{{props.book?.authorDescription}}</div>
        </div>


    </div>
        
    <div class="section characters-section">
        <div class="section-title">Characters</div>
        <div class="section-content">
            <div class="characters">
                <div class="character" v-for="character in otherChars">
                    <div class="character-name">{{character.name}}</div>
                    <div class="character-count">{{character.count}}</div>
                </div>
            </div>
        </div>
    </div>
</div>

</template>

<script setup>

import {defineProps, ref, watch} from "vue";

const props = defineProps({
    book: Array
});

const mainChar = ref(null);
const bookName = ref(null);
const bookAuthor = ref(null);
const series = ref(null);
const otherChars = ref(null);

watch(() => props.book, (incoming, prev) => {
    bookName.value = incoming?.name;
    bookAuthor.value = incoming?.author;
    series.value = incoming?.series;
    //order characters by count
    incoming?.characters.sort((a, b) => b.count - a.count);
    mainChar.value = incoming?.characters[0];
    //select two other characters
    otherChars.value = incoming?.characters.slice(1, 3);
});

</script>

<style scoped>
.bar {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 98%;
    height: 300px;
    padding: 10px;
    margin: 10px;
}
.section {
    background-color: #373f5188;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 33%;
    padding: 10px;
    padding-bottom: 0;
    margin: 10px;
    border-radius: 4px;

}
.character-section {
    width: 25% !important;
}
.section-title {
    font-size: 20px;
    color: #EEE5E9;
    font-weight: bold;
}
.section-content {
    padding: 10px;
    margin-top: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: #373F51;
    border-radius: 0 0 4px 4px;

}

</style>