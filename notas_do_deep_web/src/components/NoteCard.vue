<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const note = defineProps(['note']);
</script>

<template>
    <div class="cardContainer border rounded" @click="router.push({ name: 'noteDetail', params: { id: note.note.id } })">
        <div class="col">
            <h3 class="mt-1 text-truncate">{{ note.note.title }}</h3>
            <textarea rows="4" v-model="note.note.description" disabled class="textArea">
            </textarea>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.cardContainer {
    background-color: var(--color-background-light);
    width: 250px;
    height: 150px;
    margin: 5px;
    border-color: var(--color-secondary);

    &:hover {
        background-color: #686868;
        border-color: #9e9d9d;
    }
}

h3 {
    color: var(--color-primary);
    font-weight: bold;
    max-width: 250px;
    padding-left: 5px;
}

.textArea {
    border: none;
    color: var(--color-secondary);
    font-size: 15px;
    font-weight: 600;
    background: none;
    overflow: hidden;
    resize: none;
    padding-left: 5px;
    max-width: 250px;
}
</style>
