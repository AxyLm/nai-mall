<template>
    <div id="thumbnail">
        <el-upload ref="upload" list-type="picture-card" action="" :file-list="localFileListSuccess" :auto-upload="false" :limit="limit" :on-change="handleChange" :on-preview="handlePreview" :on-remove="handleRemove" :on-exceed="handleExeed" :on-error="handleError">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog title="图片裁剪" :visible.sync="cropDialogShow" @close="cropDialogClose" width="600px" append-to-body>
            <div class="cropper-content">
                <div class="cropper">
                    <vueCropper ref="cropper" :img="option.img" :outputSize="option.size" :outputType="option.outputType" :info="option.info" :full="option.full" :canMove="option.canMove" :canMoveBox="option.canMoveBox" :original="option.original" :autoCrop="option.autoCrop" :auto-crop-width="option.autoCropWidth" :auto-crop-height="option.autoCropHeight" :fixed="option.fixed" :fixedNumber="option.fixedNumber" :centerBox="option.centerBox" :infoTrue="option.infoTrue" :fixedBox="option.fixedBox" :mode="option.mode" :enlarge="option.enlarge">
                    </vueCropper>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cropDialogShow = false">取 消</el-button>
                <el-button @click="handleUpload" :loading="loading" type="primary">确认</el-button>
            </div>
        </el-dialog>
        <el-dialog title="图片预览" :visible.sync="previewDialogShow" width="600px" append-to-body>
            <img width="100%" :src="previewImageUrl">
        </el-dialog>
    </div>
</template>

<script>
import {
    VueCropper
} from 'vue-cropper';
import mimes from './mimes';
import {
    uploadQiniu
} from 'network/upload.js';
import { log } from 'util';
export default {
    name: 'Thumbnail',
    model: {
        //event:什么时候触发v-model行为
        event: 'uploadSuccess',
        // 定义传递给v-model的那个变量，绑定到哪个属性值上
        prop: 'fileListParent'
    },
    data() {
        let _this = this;
        let scaleTimes = _this.cropHeight / 280 < 1 ? 1 : _this.cropHeight / 280;
        return {
            localFileListSuccess: [],
            fileListAll: [],
            file: {},
            cropDialogShow: false,
            option: {
                img: '',                                          // 预览图片的地址
                canScale: true,                                   // 预览图片是否允许滚轮缩放
                original: false,                                  // 预览图片按照原始大小显示
                centerBox: false,                                 // 预览图片是否限制截图框范围
                mode: 'contain',                                  // 预览图片覆盖模式：cover contain auto
                outputSize: 1,                                    // 输出截图的质量
                outputType: 'jpeg',                               // 输出截图的格式
                enlarge: scaleTimes,                              // 输出截图相对原始截图框的倍数
                full: false,                                      // 输出截图是否采用原图比例
                info: true,                                       // 裁剪框信息是否显示
                infoTrue: true,                                   // 裁剪框信息为true展示真实输出图片宽高 false展示看到的裁剪框宽高
                autoCrop: true,                                   // 裁剪框默认是否生成
                autoCropWidth: _this.cropWidth,                   // 裁剪框默认宽度【优先级最低：会被盒子宽高、fixedNumber、centerBox改变】
                autoCropHeight: _this.cropHeight,                 // 裁剪框默认高度【优先级最低：会被盒子宽高、fixedNumber、centerBox改变】
                fixedBox: _this.canDragCropper,                   // 裁剪框大小是否允许（拖拽）改变
                fixed: this.freeRatio,                            // 裁剪框是否开启固定宽高比例
                fixedNumber: [_this.cropWidth, _this.cropHeight], // 裁剪框的宽高比例
                canMoveBox: true,                                 // 裁剪框能否拖动 
            },
            loading: false,
            previewDialogShow: false,
            previewImageUrl: '',
            imgOriginWidth: _this.cropWidth,
            imgOriginHeight: _this.cropHeight
        }
    },
    created() {
        this.$nextTick(() => {
            this.localFileListSuccess = JSON.parse(JSON.stringify(this.fileListParent));
        });
    },
    updated() {
        let status;
        if (this.localFileListSuccess.length >= this.limit) {
            status = "none";
        } else {
            status = "inline-block"
        }
        document.querySelector('#thumbnail div.el-upload').style.display = status;
    },
    methods: {
        handleChange(file, fileList) {
            const isImage = Object.values(mimes).indexOf(file.raw.type) != -1;
            const isLt1M = file.size / 1024 / 1024 < 2;
            let _this = this;
            if (this.isImage && !isImage) {
                this.$message.error('请选择正确的图片格式');
                let index = fileList.findIndex(item => item.uid == file.uid);
                fileList.splice(index, 1);
                return false;
            }
            if (this.isImage && !isLt1M) {
                this.$message.error('上传图片大小不能超过 1MB');
                let index = fileList.findIndex(item => item.uid == file.uid);
                fileList.splice(index, 1);
                return false;
            }
            if (this.isImage && !this.cropWidth) {
                let reader = new FileReader();
                reader.readAsDataURL(file.raw);
                reader.onload = function (e) {
                    let img = new Image();
                    img.src = e.target.result;
                    img.onload = function () {
                        let scaleTimes = this.height / 280 < 1 ? 1 : this.height / 280;
                        _this.imgOriginWidth = this.width;
                        _this.imgOriginHeight = this.height;
                        _this.option.enlarge = scaleTimes;
                        if (this.height > 280) {
                            _this.option.autoCropWidth = this.width / (this.height / 280);
                            _this.option.autoCropHeight = 280;
                            _this.option.fixedNumber = [this.width / (this.height / 280), 280];
                        } else {
                            _this.option.autoCropWidth = this.width;
                            _this.option.autoCropHeight = this.height;
                            _this.option.fixedNumber = [this.width, this.height];
                        }
                        _this.$refs.cropper.goAutoCrop();
                    }
                }
            }
            this.$nextTick(() => {
                this.option.img = file.url;
                this.cropDialogShow = true;
                this.file = file;
                this.fileListAll = fileList;
            });
        },
        handleUpload() {
            this.$refs.cropper.getCropBlob((data) => {
                this.loading = true;
                uploadQiniu({
                    file: data,
                    fileName: this.file.name
                }).then(res => {
                    this.cropDialogShow = false;
                    this.loading = false;
                    // 如果返回的数据中，不包含url字段，那么上传成功的预览图片就不会显示
                    // 此时可以自己手动为返回的数据添加url字段，值为前台裁剪后的blob-url
                    res.data.url = this.createObjectURL(data);
                    this.localFileListSuccess = this.localFileListSuccess.concat(res.data);
                    if (this.localFileListSuccess.length >= this.limit) {
                        document.querySelector('#thumbnail div.el-upload').style.display = 'none';
                    }
                    // 触发上面model中定义的触发名称
                    // 这里不需要修改this.count的值，只要把最终的结果传递出去就行
                    this.$emit('uploadSuccess', this.localFileListSuccess);
                }).catch(err => {
                    this.$message.error(err.message);
                    this.loading = false;
                });
            })
        },
        handlePreview(file) {
            this.previewImageUrl = file.url;
            this.previewDialogShow = true;
        },
        handleRemove(file, fileList) {
            let index = this.localFileListSuccess.findIndex(item => item.uid == file.uid);
            this.localFileListSuccess.splice(index, 1);
            this.$emit('uploadSuccess', this.localFileListSuccess);
            if (this.localFileListSuccess.length < this.limit) {
                document.querySelector('#thumbnail div.el-upload').style.display = 'inline-block';
            }
        },
        handleExeed(files, fileList) {
            this.$message.warning(`当前限制选择 ${this.limit} 个文件`);
        },
        handleError(err, file, fileList) {
            this.$message.error('文件上传失败');
        },
        cropDialogClose() {
            if (this.file.status != 'success') {
                let index = this.fileListAll.findIndex(item => item.uid == this.file.uid);
                this.fileListAll.splice(index, 1);
            }
        },
        createObjectURL(blob) {
            if (window.URL) {
                return window.URL.createObjectURL(blob);
            } else if (window.webkitURL) {
                return window.webkitURL.createObjectURL(blob);
            } else {
                return null;
            }
        }
    },
    components: {
        VueCropper
    },
    props: {
        limit: {
            type: Number,
            default: 6
        },
        cropWidth: {
            type: Number,
            default: 0
        },
        cropHeight: {
            type: Number,
            default: 0
        },
        canDragCropper: {
            type: Boolean,
            default: false
        },
        freeRatio: {
            type: Boolean,
            default: true
        },
        isImage: {
            type: Boolean,
            default: true
        },
        folder: {
            type: String,
            default: ''
        },
        fileListParent: {
            type: Array,
            default() {
                return []
            }
        }
    },
    watch: {
        fileListParent(newVal, oldVal) {
            this.localFileListSuccess = newVal;
        }
    }
}
</script>

<style>
.cropper-content .cropper {
    width: auto;
    height: 280px;
}
#thumbnail .el-upload {
    width: 80px;
    height: 80px;
    line-height: 89px;
}
#thumbnail .el-upload-list--picture-card .el-upload-list__item {
    width: 80px;
    height: 80px;
    margin-bottom: 0;
}
/* 修改el-dialog外观 */
#thumbnail .el-dialog__footer {
    padding: 10px 20px 20px;
}

#thumbnail .el-dialog__body {
    padding: 10px 20px;
}
/* 修改el-upload动画 */
#thumbnail .el-list-enter-active,
#thumbnail .el-list-leave-active {
    transition: all 0s ease;
}
</style>
