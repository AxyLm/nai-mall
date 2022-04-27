<template>
	<div class="preview-tmpl" style="height:100%;overflow:auto;">
		
	</div>
</template>

<script>
import httpVueLoader from "http-vue-loader";
export default {
	name: "PreviewTemplate",
	props: {
		templeteType: [String, Number],
		templeteId: [String, Number],
		dataId: [String, Number],
	},
	data() {
		return {
			tempData: {},
		};
	},
	created() {
		this.$app.CallApi(this.$app.api.TempleteSetting.GetTempleteContent, {
			hasToken: false,
			data: {
				templeteType: this.templeteType,
				templeteId: this.templeteId,
				dataId: this.dataId,
				data2: this.$route.query.zyzzCompanyID,
			},
			success: (res) => {
				let that = this;
				httpVueLoader(res.url)().then((cmp) => {
					let Ctor = this.$options._base.extend({
						template: cmp.template,
						beforeCreate(){
							this.$store = that.$store;
							cmp.beforeCreate && cmp.beforeCreate(this);
						},
						data() {
							return res.data || {};
						},
					});
					let tmplEl = new Ctor().$mount().$el;
					this.$el.appendChild(tmplEl);
				});
			},
		});
	},
	mounted() {
		if (this.templeteType == 1) {
			document.title = "招标公示";
		}
		if (this.templeteType == 2) {
			document.title = "招标结果公示";
		}
		if (this.templeteType == 3) {
			document.title = "中标结果通知";
		}
		if (this.templeteType == 4) {
			document.title = "合同预览";
		}
	},
};
</script>