import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import http from '../service/http';

export const useAuthStore = defineStore('auth',()=>{
    const token = ref(localStorage.getItem('token'));
    const user = ref(JSON.parse(localStorage.getItem('user')));

    function setToken(tokenValue){
        localStorage.setItem('token',tokenValue);
        token.value = tokenValue;
    }

    function setUser(userValue){
        localStorage.setItem('user',JSON.stringify(userValue));
        user.value = userValue;
    }

    function clear(){
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        user.value ='';
        token.value='';
    }

    const isAuthenticated = computed(() => {
        return token.value && user.value;
    })

    async function checkToken(){
        try {
            const tokenAuth = 'Bearer ' + token.value;
            const { data } = await http.get("/validateToken", {
              headers: {
                Authorization: tokenAuth,
              },
            });
            return data.validToken;
          } catch (error) {
            console.log(error.response.data);
          }
    }

    return {token,user, setToken,setUser,clear,checkToken,isAuthenticated};
});