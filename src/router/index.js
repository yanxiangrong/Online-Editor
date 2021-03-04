import {createRouter, createWebHistory} from 'vue-router'
import HelloWorld from "@/components/HelloWorld";
import Another from "@/components/Another";

const routerHistory = createWebHistory()
const router = createRouter({
    history: routerHistory,
    routes: [
        {
            path: '/',
            component: HelloWorld,
            props: (route) => ({ workspaceId: route.query.workspace == null ? 0 : parseInt(route.query.workspace) })
        },
        {
            path: '/v2',
            component: Another,
            props: (route) => ({ workspaceId: route.query.workspace == null ? 0 : parseInt(route.query.workspace) })
        }
    ]
})

export default router