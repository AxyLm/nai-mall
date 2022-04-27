<template>
    <div class="upload-file">
        <el-upload ref="upload" list-type="picture-card" action="" :auto-upload="false" :file-list="localFileListSuccess" :limit="limit" :multiple="multiple" :disabled="disabled" :on-change="handleChange" :on-remove="handleRemove" :on-error="handleError" :on-exceed="handleExeed">
            <i class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}" class="custom-thunbail">
                <p v-if="!isImg" class="icon">
                    <i class="iconfont" :class="[extIcon[file.extName]||'']"></i>
                </p>
                <p v-if="!isImg" class="filename">
                    {{file.fileName}}
                </p>
                <p v-if="isImg" class="imgCon"><img :src="file.url"></p>
                <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-delete" @click="handleDownload(file)">
                        <i class="el-icon-download"></i>
                    </span>
                    <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                        <i class="el-icon-delete"></i>
                    </span>
                </span>
            </div>
        </el-upload>
    </div>
</template>

<script>
import mimes from './utils/mimes';
import extIcon from './utils/extIcon';
export default {
    name: 'File',
    model: {
        //event:什么时候触发v-model行为
        event: 'change',
        // 定义传递给v-model的那个变量(绑定到哪个属性值上)
        prop: 'fileListParent'
    },
    data() {
        return {
            localFileListSuccess: [],
            extNamePattern: /.+\./,
            fileNamePattern: /(.*\/)*([^.]+).*/ig,
            extIcon: extIcon
        }
    },
    created() {
        this.$nextTick(_ => {
            this.init();
        });
    },
    watch: {
        fileListParent(newVal, oldVal) {
            this.localFileListSuccess = newVal;
            // 初始化列表数据
            this.init();
            // 添加按钮的显示和隐藏
            this.handleAddBtn();
        }
    },
    methods: {
        init() {
            if (!this.fileListParent || !Array.isArray(this.fileListParent)) {
                this.localFileListSuccess = [];
            } else {
                this.localFileListSuccess = this.fileListParent.map(item => {
                    let extName, fileName;
                    extName = item.url ? item.url.replace(this.extNamePattern, "") : "";
                    if (item.name) {
                        fileName = item.name;
                    } else if (item.url) {
                        fileName = item.url.replace(this.fileNamePattern, "$2")
                    }
                    return {
                        ...item,
                        extName,
                        fileName
                    };
                });
            }
        },
        handleChange(file, fileList) {
            const isImg = Object.values(mimes).indexOf(file.raw.type) != -1;
            if (this.isImg && !isImg) {
                this.$message.error("请选择正确的图片格式");
                let index = fileList.findIndex(item => item.uid == file.uid);
                fileList.splice(index, 1);
                return false;
            }
            // 调用上传接口
            this.$http.api.upload.single([file.raw], this.type).then(res => {
                res.extName = res["url"].replace(this.extNamePattern, "");
                res.fileName = file.name.replace(this.fileNamePattern, "$2");
                this.localFileListSuccess = this.localFileListSuccess.concat(res);
                this.emitData();
            }).catch(err => {
                this.$message.error(err.msg || err.message);
            });
        },
        handleRemove(file, fileList) {
            let index = this.localFileListSuccess.findIndex(item => item.uid == file.uid);
            this.localFileListSuccess.splice(index, 1);
            this.emitData();
        },
        handleExeed(files, localFileListSuccess) {
            this.$message.warning(`当前限制选择 ${this.limit} 个文件`);
        },
        handleError(err, file, localFileListSuccess) {
            this.$message.error("文件上传失败");
        },
        handleDownload(file) {
            window.open(file.url);
        },
        handleAddBtn() {
            let status;
            if (this.localFileListSuccess.length >= this.limit) {
                status = "none";
            } else {
                status = "inline-block";
            }
            this.$el.querySelector("div.el-upload").style.display = status;
        },
        emitData() {
            // 触发上面model中定义的触发名称
            this.$emit("change", this.localFileListSuccess);
        }
    },
    props: {
        limit: {
            type: Number,
            default: 6
        },
        type: {
            required: true,
            type: String,
            default: ""
        },
        multiple: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        isImg: {
            type: Boolean,
            default: false
        },
        fileListParent: {
            type: Array,
            default() {
                return []
            }
        }
    }
}
</script>

<style scoped>
@import "./font/iconfont.css";
.upload-file >>> .el-upload {
    width: 80px;
    height: 80px;
    line-height: 89px;
}

.upload-file >>> .el-upload-list--picture-card .el-upload-list__item {
    width: 80px;
    height: 80px;
    margin-bottom: 0;
}
.upload-file >>> .custom-thunbail {
    position: relative;
    height: 100%;
}
.upload-file >>> .custom-thunbail p {
    text-align: center;
}
.upload-file >>> .custom-thunbail p.icon .iconfont {
    font-size: 34px;
    margin: 0;
}
.upload-file >>> .custom-thunbail p.filename {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0 4px;
    font-size: 12px;
    line-height: 20px;
    white-space: nowrap;
    overflow: hidden;
    background-color: #f2f2f2;
}
.upload-file >>> .custom-thunbail img {
    display: inline-block;
    max-width: 100%;
    max-height: 100%;
}
.upload-file >>> .el-list-enter-active,
.upload-file >>> .el-list-leave-active {
    transition: all 0s ease;
}
.imgCon {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 禁用状态下隐藏添加按钮 */
.upload-file >>> .is-disabled + .el-upload--picture-card{
    display: none !important;
}
</style>
