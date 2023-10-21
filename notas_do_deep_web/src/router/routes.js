import { useAuthStore } from '../stores/auth.js';


const routes = async (to, from, next) => {
    if (to.meta?.auth) {
        const auth = useAuthStore();
        if (auth.token && auth.user) {
            const isAuthenticated = await auth.checkToken();
            if (isAuthenticated) next();
            else next({ name: "login" });
        } else {
            next({ name: "login" });
        }
    } else {
        if (to.name === "login") {
            const auth = useAuthStore();
            if (auth.token && auth.user) {
                const isAuthenticated = await auth.checkToken();
                if (isAuthenticated) next({name:'home'});
            }
        }
        next();
    }
}

export default routes;