import {createRouter, createWebHistory} from 'vue-router'
import HelloWorld from "@/components/HelloWorld";

const routerHistory = createWebHistory()
const router = createRouter({
    history: routerHistory,
    routes: [
        {
            path: '/',
            component: HelloWorld,
            props: (route) => ({ workspaceId: route.query.workspace == null ? 0 : parseInt(route.query.workspace) })
        }
    ]
})

export default router