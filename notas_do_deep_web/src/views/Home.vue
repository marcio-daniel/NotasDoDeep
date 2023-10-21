<script setup>
import { reactive, onMounted, ref } from 'vue';
import { PhPlus, PhSignOut } from '@phosphor-icons/vue';
import http from '../service/http';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import NoteCard from '../components/NoteCard.vue';

const auth = useAuthStore();
const router = useRouter();
const notes = reactive(ref());

function logout() {
    auth.clear();
    router.push({ name: 'login' });
}

function createNote() {
    router.push({ name: 'createNote' });
}

onMounted(async () => {
    try {
        const { data } = await http.get(`/note?user_id=${auth.user.id}`, { headers: { Authorization: `Bearer ${auth.token}` } });
        notes.value = data;
    } catch (err) {
        console.log(err.response);
    }
});



</script>

<template>
    <div class="container">
        <header class="header">
            <h1>
                Home
            </h1>
            <div class="iconArea">
                <PhPlus @click="createNote" class="icon" :size="65" />
                <PhSignOut @click="logout" class="icon" :size="65" />
            </div>
        </header>
        <section class="card-body row noteArea d-flex ">
            <NoteCard v-for="note in notes" :key="note.id" :note="note" class="noteCard" />
        </section>
    </div>
</template>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 50px;

    .iconArea {
        margin-left: 35px;

        .icon {
            padding-right: 10px;
            cursor: pointer;
            color: var(--color-primary);
        }
    }
}

.noteArea {
    overflow-x: hidden;
    overflow-y: scroll;

    .noteCard {
        cursor: pointer;
    }
}


h1 {
    color: var(--color-primary);
    font-weight: bold;
    font-size: 50px;
}
</style>
