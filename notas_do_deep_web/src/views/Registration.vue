<script setup>
import { computed, reactive, ref} from 'vue';
import { PhEnvelope,PhUser, PhLock } from '@phosphor-icons/vue';
import http from '../service/http';
import {useAuthStore} from '../stores/auth';
import { useRouter } from 'vue-router';

const user = reactive({
    name: '',
    email: '',
    password: ''
});

const auth = useAuthStore();
const router = useRouter();
const happenedError = ref(false);

const showError = computed(()=>{
    return !auth.isAuthenticated && happenedError.value;
});
const showSuccess = ref(false)
async function handleSubmit(event) {
    event.preventDefault();
    happenedError.value=false;
    showSuccess.value =false;
    try {
        const { data } = await http.post('/registration', user);
        showSuccess.value=true;
    } catch (error) {
        if (error?.response?.status === 409) {
            happenedError.value=true;
        }
        console.log(error.response);
    }

}



</script>

<template>
    <div class="container">
        <h1>Cadastro</h1>
        <h2>Crie uma conta e começe a usar!</h2>
        <div v-if="showError" class="errorBox">
            <span class="errorMsg">
                Já existe usuário cadastrado com esse e-mail informado!
            </span>
        </div>
        <div v-if="showSuccess" class="successBox">
            <span class="successMsg">
                Usuário cadastrado com sucesso!
            </span>
        </div>
        <form @submit="handleSubmit">
            <div class="formContainer">
                <div class="inputBox">
                    <span class="label">
                        Nome
                    </span>
                    <div class="inputRoot">
                        <span class="iconRoot">
                            <PhUser class="icon" :size="25" />
                        </span>
                        <input class="input" v-model="user.name" type="text" placeholder="Digite seu nome!" required />
                    </div>
                </div>
                <div class="inputBox">
                    <span class="label">
                        E-mail
                    </span>
                    <div class="inputRoot">
                        <span class="iconRoot">
                            <PhEnvelope class="icon" :size="25" />
                        </span>
                        <input class="input" v-model="user.email" type="email" placeholder="Digite seu email!" required />
                    </div>
                </div>
                <div class="inputBox">
                    <span class="label">
                        Senha
                    </span>
                    <div class="inputRoot">
                        <span class="iconRoot">
                            <PhLock class="icon" :size="25" />
                        </span>
                        <input class="input" v-model="user.password" type="password" placeholder="******" required />
                    </div>
                </div>
                <button class="btn">
                    Cadastrar
                </button>
                <p class="loginLink" @click="router.push({name:'login'})">Já possui uma conta? Clique aqui e faça login!</p>
            </div>
        </form>
    </div>
</template>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}


.errorBox {
    margin-top: 20px;
    width: 30vw;
    height: 50px;
    border-radius: 10px;
    background-color: rgb(184, 7, 7);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    .errorMsg {
        font-size: 14px;
        font-weight: bold;
        color: var(--color-primary);
    }
}
.successBox {
    margin-top: 20px;
    width: 30vw;
    height: 50px;
    border-radius: 10px;
    background-color:  rgb(1, 112, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    .successMsg {
        font-size: 14px;
        font-weight: bold;
        color: var(--color-primary);
    }
}

.formContainer {
    display: flex;
    flex-direction: column;
    width: 45vw;
    height: 40vh;
    border-radius: 8px;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
}

h1,
h2 {
    color: var(--color-primary);
}

h1 {
    font-weight: bold;
}
h2{
    font-size: 17px;
}

.loginLink{
    font-size: 13px;
    margin-top: 4px;
    color: var(--color-secondary);
    &:hover{
        text-decoration: underline;
        color: #c0c0c0;
        cursor: pointer;
    }
}


.inputBox {
    display: flex;
    flex-direction: column;
    margin-top: 5px;

    .label {
        text-align: start;
        color: var(--color-primary);
        font-weight: 700;
        padding: 5px 0px;
        font-size: 20px;
    }

    .inputRoot {
        display: flex;
        flex-direction: row;
        background-color: var(--color-background-light);
        border-radius: 10px;
        height: 34px;
        width: 25vw;

        .iconRoot {
            margin: auto 0;
            padding-inline: 5px;

            .icon {
                color: var(--color-primary);
            }
        }

        .input {
            margin: auto 0;
            background-color: transparent;
            border: none;
            height: 20px;
            width: 25vw;
            font-size: 15px;
            color: var(--color-primary);
            outline: none;

            &::placeholder {
                color: var(--color-primary);
            }
        }
    }
}

.btn {
    margin-top: 10px;
    border: none;
    border-radius: 8px;
    background-color: var(--color-secondary);
    width: 85px;
    height: 28px;
    outline: none;
    color: #000000;
    font-size: 13px;
    font-weight: bold;
    cursor: pointer ;

    &:hover {
        background-color: #929292;
        opacity: 0.8;
    }

}
</style>
