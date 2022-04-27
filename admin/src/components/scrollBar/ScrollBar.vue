<template>
    <happy-scroll ref="hps" :color="customColor" size="5" resize :hide-horizontal="false">
        <slot></slot>
    </happy-scroll>
</template>

<script>
import {
    HappyScroll
} from 'assets/lib/vue-happy-scroll';
import 'assets/lib/vue-happy-scroll/docs/happy-scroll.css';
export default {
    name: 'ScrollBar',
    data() {
        return {
            timer: null
        }
    },
    mounted() {
        window.onresize = () => {
            if (this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.$refs.hps.computeStripX();
            }, 600);
        }
    },
    components: {
        HappyScroll
    },
    props: {
        customColor: {
            type: String,
            default: 'rgba(0,0,0,0.2)'
        }
    }
}
</script>

<style>
.happy-scroll-container {
    width: 100% !important;
}
.happy-scroll-content {
    width: 100% !important;
}
</style>
