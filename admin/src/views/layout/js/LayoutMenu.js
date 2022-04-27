import MenuItem from "../LayoutMenuItem.vue";
export default {
    data(){
        return {
            defaultPath: "/",
        }
    },
    mounted() {
        setTimeout( () =>{
            this.defaultPath = this.$route.path;
        },0)
    },
    watch: {
        $route() {
            this.defaultPath = this.$route.path;
        }
    },
    components:{
        MenuItem
    }
}