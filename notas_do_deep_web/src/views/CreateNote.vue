<script setup>
import { reactive, onMounted} from 'vue';
import { PhArrowLeft } from '@phosphor-icons/vue';
import http from '../service/http';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const note = reactive({
    id: 0,
    description: "",
    user_id: 0,
    title: "",
    type: 'text'
});


async function goBack() {
    try {
        const requestBody = {
            type: note.type,
            title: note.title,
            user_id: auth.user.id,
            description: note.description
        }
        const { data } = await http.post('/note/', requestBody, { headers: { Authorization: `Bearer ${auth.token}` } })
        router.push({ name: 'home' });
    } catch (error) {
        console.log(error.response);
    }
}


</script>

<template>
    <div class="container">
        <header class="header">
            <PhArrowLeft @click="goBack" :size="65" class="icon" />
        </header>
        <div class="formContainer">
            <input v-model="note.title" class="input" type="text" placeholder="Digite um título" />
            <textarea rows="20" v-model="note.description" class="textArea" placeholder="Nota"></textarea>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-left: 15px;
}



.header {
    display: flex;
    flex-direction: row;
    justify-content: start;
    padding-top: 30px;
    margin-bottom: 5px;

    .icon {
        padding-right: 10px;
        cursor: pointer;
        color: var(--color-primary);
    }
}

.formContainer {
    display: flex;
    flex-direction: column;
    width: 80vw;
    height: 80vh;
    margin-top: 10px;
    padding-left: 15px;
}

.input {
    margin: 5px 0;
    background-color: transparent;
    border: none;
    height: 45px;
    width: "100%";
    font-size: 35px;
    font-weight: bold;
    color: var(--color-primary);
    outline: none;

    &::placeholder {
        color: var(--color-primary);
    }
}

.textArea {
    background-color: transparent;
    border: none;
    color: var(--color-secondary);
    font-size: 20px;
    font-weight: 600;
    outline: none;
    overflow-x: hidden;
    overflow-y: scroll;
    resize: none;

    &::placeholder {
        color: var(--color-secondary);
    }

}
</style>
