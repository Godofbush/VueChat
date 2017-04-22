import Vue from 'vue'
import Router from 'vue-router'
import WelcomeBoard from '@/pages/welcome_board'
import Welcome from '@/pages/welcome'
import Login from '@/pages/login'
import Register from '@/pages/register'
import Chat from '@/pages/chat'

Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
    	{
	    	path: '/',
	    	redirect: '/welcome',
	    	component: WelcomeBoard,
	    	children: [
	    		{
	    			path: 'welcome',
	    			component: Welcome
	    		},
	    		{
	    			path: 'login',
	    			component: Login
	    		},
	    		{
	    			path: 'register',
	    			component: Register
	    		}
	    	]
    	},
    	{
    		path: '/chat',
    		component: Chat
    	}
	]
})
