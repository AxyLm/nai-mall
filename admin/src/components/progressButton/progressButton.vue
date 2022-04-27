<template>
    <div ref="main" :progress="progress" :offset="offset" class="_anime_btn_" v-bind:class="{ready:states.isReady,active:states.isActive}" v-bind:style="{'--theme-color': color }">
        <svg class="_anime_btn_svg_" width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" style="padding: 0 1px 1px 0;overflow: visible;">
            <rect ref="rect" class="_anime_btn_rect_" fill="transparent" stroke-dashoffset="" stroke-width="1" stroke-linecap="butt" stroke-linejoin="round" x="0.5" y="0.5" rx="4" ry="4" width="100%" height="100%" />
        </svg>
        <button type="button" class="_anime_btn_btn_" v-on:click="click" v-on:keyup.enter="click" v-bind:disabled="disabled">
            <slot></slot>
        </button>
    </div>
</template>

<script>
export default {
    props: {
        color: {
            type: String,
            default: "#0c71fd"
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data: function () {
        return {
            states: {
                isReady: false,
                isActive: false
            },
            style: {
                linePercent: 0,
                offsetPercent: 0,
                lineTimer: 0,
                offsetTimer: 0,

                animationSpeed: 600
            },
            progress: null,
            offset: null,
            $_isOffsetAnimationEnable: false,
            $_offsetAnimationTimer: 0
        };
    },
    mounted: function () {
        this.$nextTick(function () {
            this.style.linePercent = this.progress || 0;
            this.style.offsetPercent = this.offset || 0;
            this._isOffsetAnimationEnable = this.offset === null;
            this.updateLinePercent();
            this.updateOffsetPercent();
            if (false && this._isOffsetAnimationEnable) {
                console.log("AnimationEnabled");
                this.style.offsetPercent = Math.random() * 100;
                const offsetAnimation = () => {
                    this.style.offsetPercent -= 0.1;
                    if (this.style.offsetPercent <= 0) {
                        this.style.offsetPercent += 100;
                    }
                    this.updateOffsetPercent();
                    this.$_offsetAnimationTimer = requestAnimationFrame(
                        offsetAnimation
                    );
                };
                this.$_offsetAnimationTimer = requestAnimationFrame(
                    offsetAnimation
                );
            }
        });
    },
    beforeDestroy: function () {
        if (this.$_isOffsetAnimationEnable) {
            cancelAnimationFrame(this.$_offsetAnimationTimer);
        }
    },
    methods: {
        click() {
            if (this.isReady || this.isActive) {
                this.$emit("click");
            }
        },
        updateLinePercent() {
            const dom = this.$refs.rect;
            const main = this.$refs.main;
            const fullLength = dom.getTotalLength() + 1;
            const lineLength = (this.style.linePercent / 100) * fullLength;
            dom.style.strokeDasharray = [
                lineLength,
                fullLength - lineLength,
                lineLength,
                fullLength - lineLength
            ].join(",");
            if (this.style.linePercent >= 100) {
                if (![...main.classList].includes("active")) {
                    main.classList.add("ready");
                    this.isReady = true;
                    this.style.lineTimer = setTimeout(() => {
                        main.classList.add("active");
                        main.classList.remove("ready");
                    }, this.style.animationSpeed * 0.6);
                }
            } else {
                this.isReady = false;
                main.classList.remove("active");
                main.classList.remove("ready");
            }
        },
        updateOffsetPercent() {
            const dom = this.$refs.rect;
            const fullLength = dom.getTotalLength() + 1;
            const offsetLength = (this.style.offsetPercent / 100) * fullLength;
            dom.style.strokeDashoffset = offsetLength;
        }
    },
    watch: {
        progress: function () {
            let fromLinePercent = this.style.linePercent;
            if (fromLinePercent !== this.progress) {
                if (fromLinePercent >= 100 && this.progress >= 100) {
                    return;
                }
                cancelAnimationFrame(this.style.lineTimer);
                clearTimeout(this.style.lineTimer);
                let startTime;
                const animeFunction = timestamp => {
                    this.style.lineTimer = requestAnimationFrame(animeFunction);
                    if (!startTime) {
                        startTime = timestamp;
                    }
                    let progressStyle =
                        (timestamp - startTime) / this.style.animationSpeed;

                    // 如果完成率达到或超过1
                    if (progressStyle >= 1) {
                        cancelAnimationFrame(this.style.lineTimer);
                        this.style.linePercent = this.progress;
                    } else {
                        // 缓动处理，缓出(ease-out)
                        progressStyle =
                            -progressStyle * progressStyle + 2 * progressStyle;
                        this.style.linePercent =
                            (this.progress - fromLinePercent) * progressStyle +
                            fromLinePercent;
                    }
                    this.updateLinePercent();
                };
                this.style.lineTimer = requestAnimationFrame(animeFunction);
            }
        },
        offset: function () {
            let fromOffsetPercent = this.style.offsetPercent;
            if (fromOffsetPercent !== this.offset) {
                cancelAnimationFrame(this.style.offsetTimer);
                clearTimeout(this.style.offsetTimer);
                let startTime;
                const animeFunction = timestamp => {
                    this.style.offsetTimer = requestAnimationFrame(
                        animeFunction
                    );
                    if (!startTime) {
                        startTime = timestamp;
                    }
                    let progressStyle =
                        (timestamp - startTime) / this.style.animationSpeed;
                    // 直接线性
                    this.style.offsetPercent =
                        (this.offset - fromOffsetPercent) * progressStyle +
                        fromOffsetPercent;
                    this.updateOffsetPercent();
                };
                this.style.offsetTimer = requestAnimationFrame(animeFunction);
            }
        }
    }
};
</script>

<style scoped lang="scss">
$border-radius-value: 4px;

* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

._anime_btn_ {
    white-space: nowrap;
    position: relative;
    display: inline-block;
    overflow: hidden;
    vertical-align: bottom;
    margin-right: 10px;
    text-align: center;
    &::before {
        left: 50%;
        border-radius: 0 $border-radius-value $border-radius-value 0;
    }
    &::after {
        right: 50%;
        border-radius: $border-radius-value 0 0 $border-radius-value;
    }
    &::before,
    &::after {
        content: "";
        width: 0;
        height: $border-radius-value;
        opacity: 0;
        position: absolute;
        top: calc((100% - #{$border-radius-value}) / 2);
        transition: all 0.3s ease-out;
        background-color: var(--theme-color);
    }
    &.active {
        &::before,
        &::after {
            width: 50%;
            height: 100%;
            opacity: 1;
            top: 0;
        }
        ._anime_btn_btn_ {
            color: #ffffff;
            border: 1px var(--theme-color) solid;
            cursor: pointer;
        }
    }
    &.ready {
        ._anime_btn_btn_ {
            color: var(--theme-color);
        }
    }
    &:disabled,
    &[disabled] {
        filter: grayscale(0%);
        &::before,
        &::after {
            background-color: #909090;
        }
    }
    & ._anime_btn_svg_ {
        stroke: var(--theme-color);
        & ._anime_btn_rect_ {
            stroke-dasharray: 0, 1000;
        }
    }
    & ._anime_btn_svg_ {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }

    & ._anime_btn_btn_ {
        font-weight: 500;
        position: relative;
        text-align: center;
        top: 0;
        left: 0;
        padding: 9px 15px;
        color: rgba(0, 0, 0, 0.2);
        border-radius: $border-radius-value;
        cursor: not-allowed;
        outline: none;
        line-height: calc(100% - 1px);
        font-size: 12px;
        transition: all 0.3s ease-out;
        border: 1px rgba(0, 0, 0, 0.2) solid;
        background-color: transparent;
        z-index: 1;
        &:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
        &:focus {
            background-color: rgba(0, 0, 0, 0.05);
        }
        &:disabled,
        &[disabled] {
            cursor: not-allowed;
            &:hover,
            &:focus {
                background-color: transparent;
            }
        }
    }
}
</style>