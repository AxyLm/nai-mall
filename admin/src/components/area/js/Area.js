import { areaList } from "./AreaList.js";
export default {
    name: "AreaSelector",
    model: {
        prop: "code",
        event: "change",
    },
    props: {
        code: [String,Array],
        isMultiple: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        type:{
            type:String,
            default: ""
        },
        size:{
            type:String,
            default: "small"
        }
    },
    watch:{
        code(){
            this._initDefault();
        }
    },
    data() {
        return {
            areaTree: [],
            areaValue: [], 
        };
    },
    mounted() {
        this._initProvince();
        this._initDefault();
    },
    methods: {
        /* 获取省份数据列表 */
        _initProvince() {
            let provinceList = [];
            for(let provinceCode in areaList.province_list){
                let province = {
                    value: provinceCode,
                    label: areaList.province_list[provinceCode]
                }
                if(this.type!="province") {
                    province.children = [];
                    this._getCity(province);
                };
                provinceList.push(province);
            }
            this.areaTree = provinceList;
        },
        _getCity(province){
            // 根据省份编码，6位地区码的前两位，查找该省份对应的城市
            let provinceCode = province.value.slice(0,2);
            for(let cityCode in areaList.city_list){
                if(cityCode.startsWith(provinceCode)){
                    let city = {
                        value: cityCode,
                        label: areaList.city_list[cityCode]
                    };
                    if(this.type!="city") {
                        city.children = [];
                        this._getCounty(city);
                    };
                    province.children.push(city);
                }
            }
        },
        _getCounty(city){
            // 获取市下面的县区
            // 根据市级编码，6位地区码的前4位，查找该市对应的县区
            let cityCode = city.value.slice(0,4);
            for(let countyCode in areaList.county_list){
                if(countyCode.startsWith(cityCode)){
                    city.children.push({
                        value: countyCode,
                        label: areaList.county_list[countyCode],
                    });
                }
            }
        },
        /* 获取默认数据 */
        _initDefault(){
            if (!this.code) return;
            if(this._multiple && !Array.isArray(this.code)) return;
            if(!this._multiple && Array.isArray(this.code)) return;
            let getProvinceCode = cityCode => {
                // 获取省份编码
                let provinceCodePrivate = cityCode.slice(0,2);
                let provinceCodeArr = Object.keys(areaList.province_list);
                let provinceCode = provinceCodeArr.find(it=>it.startsWith(provinceCodePrivate));
                // 返回数据
                return [provinceCode, cityCode];
            };
            let getProvinceAndCityCode = countyCode =>{
                // 获取省份编码
                let provinceCodePrivate = countyCode.slice(0,2);
                let provinceCodeArr = Object.keys(areaList.province_list);
                let provinceCode = provinceCodeArr.find(it=>it.startsWith(provinceCodePrivate));
                // 获取城市编码）
                let cityCodePrivate = countyCode.slice(0,4);
                let cityCodeArr = Object.keys(areaList.city_list);
                let cityCode = cityCodeArr.find(it=>it.startsWith(cityCodePrivate));
                // 返回数据
                return [provinceCode, cityCode, countyCode]
            };
            if(this.type=="province"){
                this.areaValue = this._multiple ? this.code :[this.code];
            } else if(this.type=="city"){
                if(this._multiple){
                    let res = [];
                    this.code.forEach(cityCode=> res.push(getProvinceCode(cityCode)));
                    this.areaValue = res;
                }else{
                    this.areaValue = getProvinceCode(this.code);
                }
            } else{
                if(this._multiple){
                    let res = [];
                    this.code.forEach(countyCode=> res.push(getProvinceAndCityCode(countyCode)));
                    this.areaValue = res;
                }else{
                    this.areaValue = getProvinceAndCityCode(this.code);
                }
            }
        },
        /* 此事件叶子节点触发 */
        areaChange(value) {
            if (value.length) {
                if(this._multiple){
                    value = value.reduce((tmp,it)=>{
                        it.length && tmp.push(it[it.length-1]);
                        return tmp;
                    },[]);
                    this.$emit("change", value);
                }else{
                    this.$emit("change", value[value.length-1]);
                }
            } else {
                this.$emit("change", null);
            }
        },
        /* 取完整地址名称 */
        getLabel(){
            if(this._multiple){
                let fullNames = this.areaValue.map(it=>{
                    let fullName = "";
                    for(let key in areaList){
                        for(let code in areaList[key]){
                            if(it.includes(code)){
                                fullName+=areaList[key][code];
                            }
                        }
                    }
                    return fullName;
                });
                return fullNames;
            }else{
                let fullName = "";
                for(let key in areaList){
                    for(let code in areaList[key]){
                        if(this.areaValue.includes(code)){
                            fullName+=areaList[key][code];
                        }
                    }
                }
                return fullName;
            }
        }
    },
    computed:{
        _multiple(){
            return this.$refs.cascader.props.multiple;
        }
    }
};