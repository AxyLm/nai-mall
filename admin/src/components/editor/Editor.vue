<template>
    <div id="editor">
        <div id="toolbar" slot="toolbar">
            <span class="ql-formats">
                <button class="ql-bold" title="加粗"></button>
                <button class="ql-italic" title="倾斜"></button>
                <button class="ql-underline" title="下划线"></button>
                <button class="ql-strike" title="删除线"></button>
            </span>
            <span class="ql-formats">
                <select class="ql-color" value="color" title="字体颜色"></select>
                <select class="ql-background" value="background" title="背景颜色"></select>
                <select class="ql-font" title="字体类型">
                    <option value="SimSun">宋体</option>
                    <option value="Microsoft-YaHei">微软雅黑</option>
                    <option value="SimHei">黑体</option>
                    <option value="KaiTi">楷体</option>
                    <option value="FangSong">仿宋</option>
                    <option value="Arial">Arial</option>
                    <option value="Times-New-Roman">Times</option>
                    <option value="sans-serif">sans-serif</option>
                </select>
                <select class="ql-size" title="字体大小">
                    <option value="huge">初号</option>
                    <option value="large">大号</option>
                    <option selected>正常</option>
                    <option value="small">小号</option>
                </select>
                <button class="ql-script" value="sub" title="下标"></button>
                <button class="ql-script" value="super" title="上标"></button>
                <button class="ql-direction" value="rtl" title="文本方向"></button>
            </span>
            <span class="ql-formats">
                <button class="ql-blockquote" title="引用"></button>
                <button class="ql-code-block" title="代码块"></button>
            </span>
            <span class="ql-formats">
                <select class="ql-header" title="段落格式">
                    <option selected>正文</option>
                    <option value="1">标题1</option>
                    <option value="2">标题2</option>
                    <option value="3">标题3</option>
                    <option value="4">标题4</option>
                    <option value="5">标题5</option>
                    <option value="6">标题6</option>
                </select>
                <select class="ql-align" value="align" title="对齐方式"></select>
                <button class="ql-list" value="ordered" title="有序列表"></button>
                <button class="ql-list" value="bullet" title="无序列表"></button>
                <button class="ql-indent" value="-1" title="减少缩进量"></button>
                <button class="ql-indent" value="+1" title="增加缩进量"></button>
            </span>
            <span class="ql-formats">
                <button class="ql-clean" value="clean" title="清除样式"></button>
                <button class="ql-link" value="link" title="链接"></button>
                <button class="my-image" title="图片" @click="insertClick($event)">
                    <svg viewBox="0 0 18 18" style="pointer-events:none">
                        <rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect>
                        <circle class="ql-fill" cx="6" cy="7" r="1"></circle>
                        <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline>
                    </svg>
                </button>
                <button class="my-video" title="视频" @click="insertClick($event)">
                    <svg viewBox="0 0 18 18" style="pointer-events:none">
                        <rect class="ql-stroke" height="12" width="12" x="3" y="3"></rect>
                        <rect class="ql-fill" height="12" width="1" x="5" y="3"></rect>
                        <rect class="ql-fill" height="12" width="1" x="12" y="3"></rect>
                        <rect class="ql-fill" height="2" width="8" x="5" y="8"></rect>
                        <rect class="ql-fill" height="1" width="3" x="3" y="5"></rect>
                        <rect class="ql-fill" height="1" width="3" x="3" y="7"></rect>
                        <rect class="ql-fill" height="1" width="3" x="3" y="10"></rect>
                        <rect class="ql-fill" height="1" width="3" x="3" y="12"></rect>
                        <rect class="ql-fill" height="1" width="3" x="12" y="5"></rect>
                        <rect class="ql-fill" height="1" width="3" x="12" y="7"></rect>
                        <rect class="ql-fill" height="1" width="3" x="12" y="10"></rect>
                        <rect class="ql-fill" height="1" width="3" x="12" y="12"></rect>
                    </svg>
                </button>
            </span>
            <input style="display: none;" type="file" id="insert-image" @change="fileInsert($event)" />
            <input style="display: none;" type="file" id="insert-video" @change="fileInsert($event)" />
        </div>
        <quill-editor v-model="content" ref="qEitor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)" @change="onEditorChange($event)">
        </quill-editor>
    </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import "./font.css";
import {
    quillEditor
} from "vue-quill-editor";
// import {
//     create_media
// } from 'network/media.js';
// 自定义字体
import * as Quill from "quill";
let fonts = ["SimSun", "SimHei", "Microsoft-YaHei", "KaiTi", "FangSong", "Arial", "Times-New-Roman", "sans-serif"];
let Font = Quill.import("formats/font");
Font.whitelist = fonts;
Quill.register(Font, true);
// 导出组件
export default {
    name: "Editor",
    model: {
        event: 'change',
        prop: 'contentParent'
    },
    data() {
        return {
            content: "",
            editorOption: {
                modules: {
                    toolbar: "#toolbar"
                },
                theme: "snow",
                placeholder: "请输入正文"
            }
        }
    },
    watch:{
        contentParent(newVal, oldVal){
            this.content = newVal;
        }
    },
    created() {
        this.content = this.contentParent || "";
    },
    methods: {
        onEditorBlur(quill) { },
        onEditorFocus(quill) { },
        onEditorReady(quill) { },
        onEditorChange({
            quill,
            html,
            text
        }) {
            this.$emit("change", this.content);
        },
        insertClick(e) {
            e.preventDefault();
            if (e.target.className.indexOf("image") != -1) {
                document.getElementById("insert-image").click();
            } else if (e.target.className.indexOf("video") != -1) {
                document.getElementById("insert-video").click();
            }
        },
        fileInsert(e) {
            let file = e.target.files[0];
            if (typeof file === "undefined") {
                return;
            }
            let ext = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
            let type = "";
            if (e.target.id == "insert-image") {
                type = "image";
                if (ext !== "png" && ext !== "jpg" && ext !== "jpeg") {
                    this.$message.error("不支持该类型图片");
                    return;
                }
            }
            if (e.target.id == "insert-video") {
                type = "video";
                if (ext !== "mp4" && ext !== "avi" && ext !== "mov") {
                    this.$message.error("不支持该类型视频");
                    return;
                }
                let maxSize = 100 * 1024 * 1024;
                if (file.size > maxSize) {
                    this.$message.error("上传视频大小不能超过100MB");
                    return;
                }
            }
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = (e) => {
                let formData = new FormData();
                formData.append("file", file);
                // 调用上传接口
                this.$http.api.upload.single([file], this.path).then(res => {
                    // 插入媒体文件
                    let url = res.url;
                    this.editor.insertEmbed(this.editor.selection.savedRange.index, type, url);
                    // 设置光标位置
                    this.editor.setSelection(this.editor.selection.savedRange.index + 1);
                }).catch(err => {
                    this.$message.error("图片上传失败");
                });
            }
        }
    },
    computed: {
        editor() {
            return this.$refs.qEitor.quill;
        }
    },
    components: {
        quillEditor
    },
    props:{
        contentParent: {
            type: String,
            default: ""
        },
        path: {
            type: String,
            default: ""
        }
    }
}
</script>

<style scoped>
#editor{
    line-height: 1;
}
.ql-editor {
    height: 400px;
}
</style>