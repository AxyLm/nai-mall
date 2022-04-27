<template>
    <el-dialog title="签名" :visible.sync="signatureShow" width="70%" top="3%" :close-on-click-modal="false" :close-on-press-escape="false" @close="close" append-to-body>
        <div class="signatureBox" ref="signatureBox" v-if="isEdit">
            <div class="canvasBox" ref="canvasHW">
                <canvas @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" ref="canvasF" @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp"></canvas>
                <div class="dialog-fixed-btn">
                    <el-button type="primary" @click="surewrite">确定</el-button>
                    <el-button @click="overwrite">关闭</el-button>
                </div>
            </div>
        </div>
        <div v-if="!isEdit">
            <img :src="imgSrc" alt="" class="w-100">
            <div class="dialog-fixed-btn">
                <el-button @click="signatureShow = false">关闭</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: "Signature",
    data() {
        return {
            signatureShow: false,
            points: [],
            canvasTxt: null,
            startX: 0,
            startY: 0,
            moveY: 0,
            moveX: 0,
            endY: 0,
            endX: 0,
            w: null,
            h: null,
            isDown: false,
            color: "#000",
            linewidth: 3,
            isDraw: false, //签名标记
            imgSrc: "",
        };
    },
    props: ['isEdit'],
    methods: {
        init(src) {
            this.signatureShow = true;
            if (!this.isEdit && src) {
                this.$nextTick(() => {
                    this.imgSrc = src;
                });
            } else {
                this.$nextTick(() => {
                    let canvas = this.$refs.canvasF;
                    canvas.height = this.$refs.canvasHW.clientHeight - 10;
                    canvas.width = this.$refs.canvasHW.clientWidth - 10;
                    this.canvasTxt = canvas.getContext("2d");
                    this.canvasTxt.strokeStyle = this.color;
                    this.canvasTxt.lineWidth = this.linewidth;
                });
            }
        },
        //电脑设备事件
        mouseDown(ev) {
            ev = ev || event;
            ev.preventDefault();
            let obj = {
                x: ev.offsetX,
                y: ev.offsetY,
            };
            this.startX = obj.x;
            this.startY = obj.y;
            this.canvasTxt.beginPath();
            this.points.push(obj);
            this.isDown = true;
        },
        //移动设备事件
        touchStart(ev) {
            ev = ev || event;
            ev.preventDefault();
            if (ev.touches.length == 1) {
                this.isDraw = true; //签名标记
                console.log(document.body.offsetHeight * 0.07);
                console.log(this.$refs.canvasHW.offsetHeight * 0.3);
                let obj = {
                    x: ev.targetTouches[0].clientX - 180,
                    y: ev.targetTouches[0].clientY - (document.body.offsetHeight * 0.1 + this.$refs.canvasHW.offsetHeight * 0.1),
                }; //y的计算值中：document.body.offsetHeight*0.5代表的是除了整个画板signatureBox剩余的高，this.$refs.canvasHW.offsetHeight*0.1是画板中标题的高
                this.startX = obj.x;
                this.startY = obj.y;
                this.canvasTxt.beginPath();
                this.points.push(obj);
            }
        },
        //电脑设备事件
        mouseMove(ev) {
            ev = ev || event;
            ev.preventDefault();
            if (this.isDown) {
                let obj = {
                    x: ev.offsetX,
                    y: ev.offsetY,
                };
                this.moveY = obj.y;
                this.moveX = obj.x;
                this.canvasTxt.moveTo(this.startX, this.startY);
                this.canvasTxt.lineTo(obj.x, obj.y);
                this.canvasTxt.stroke();
                this.startY = obj.y;
                this.startX = obj.x;
                this.points.push(obj);
            }
        },
        //移动设备事件
        touchMove(ev) {
            ev = ev || event;
            ev.preventDefault();
            if (ev.touches.length == 1) {
                let obj = {
                    x: ev.targetTouches[0].clientX - 180,
                    y: ev.targetTouches[0].clientY - (document.body.offsetHeight * 0.1 + this.$refs.canvasHW.offsetHeight * 0.1),
                };
                this.moveY = obj.y;
                this.moveX = obj.x;
                this.canvasTxt.moveTo(this.startX, this.startY);
                this.canvasTxt.lineTo(obj.x, obj.y);
                this.canvasTxt.stroke();
                this.startY = obj.y;
                this.startX = obj.x;
                this.points.push(obj);
            }
        },
        //电脑设备事件
        mouseUp(ev) {
            ev = ev || event;
            ev.preventDefault();
            if (1) {
                let obj = {
                    x: ev.offsetX,
                    y: ev.offsetY,
                };
                this.canvasTxt.closePath();
                this.points.push(obj);
                this.points.push({ x: -1, y: -1 });
                this.isDown = false;
            }
        },
        //移动设备事件
        touchEnd(ev) {
            ev = ev || event;
            ev.preventDefault();
            if (ev.touches.length == 1) {
                let obj = {
                    x: ev.targetTouches[0].clientX - 180,
                    y: ev.targetTouches[0].clientY - (document.body.offsetHeight * 0.1 + this.$refs.canvasHW.offsetHeight * 0.1),
                };
                // this.canvasTxt.beginPath();
                // this.canvasTxt.moveTo(this.startX, this.startY);
                // this.canvasTxt.lineTo(obj.x, obj.y);
                // this.canvasTxt.stroke();
                this.canvasTxt.closePath();
                this.points.push(obj);
                this.points.push({ x: -1, y: -1 });
            }
        },
        //重写
        overwrite() {
            if (this.isEdit) {
                this.canvasTxt.clearRect(
                    0,
                    0,
                    this.$refs.canvasF.width,
                    this.$refs.canvasF.height
                );
                this.points = [];
                this.isDraw = false; //签名标记
            }
            this.signatureShow = false;
        },
        //关闭
        close() {
            if (this.isEdit) {
                this.canvasTxt.clearRect(
                    0,
                    0,
                    this.$refs.canvasF.width,
                    this.$refs.canvasF.height
                );
                this.points = [];
                this.$emit("close", false);
            }
        },
        //确认签名
        surewrite() {
            var imgBase64 = this.$refs.canvasF.toDataURL();
            var arr = imgBase64.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            var obj = new Blob([u8arr], { type: mime });
            var formData = new FormData();

            formData.append("file", obj, "image.png");
            // formData.append('isImage', false); 
            // formData.append('folder', 'Upload/Surewrite'); 

            // 本地上传
            this.$app.Upload({ data: formData, isImage: false, folder: "Upload/", size: "100.100", }).then(res => {
                this.$message({ message: '签名成功！', type: 'success' });
                this.$emit("signSureMath", res.url);
                this.signatureShow = false;
            }).catch(err => {
                this.$message.error(err.message);
            });

            // 七牛上传
            // this.$app.UploadQiniuForSignature(formData).then(res => {
            //     this.$message({ message: '签名成功！', type: 'success' });
            //     this.$emit("signSureMath", res.url);
            //     this.signatureShow = false;
            // }).catch(err => {
            //     this.$message.error(err.message);
            // });
        },
    },
};
</script>

<style type="less" scoped>
.signatureBox {
    width: 100%;
    box-sizing: border-box;
}
.canvasBox {
    /* padding: 0px 5px; */
    height: 50vh;
}
canvas {
    border: 1px solid gray;
}
@media only screen and (min-width: 730px) {
    .signatureBox {
        width: 100%;
        box-sizing: border-box;
    }
}
</style>