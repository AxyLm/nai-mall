import axios from "axios";
import {extend} from "../utils/funs/copy"
let instance = axios.create();
export default function call(api,options) {
    if (!api) {
        throw new Error("未提供有效的api信息");
    }
        // 默认参数,api参数及用户参数合并
    let defaults = {
        baseURL: "http://localhost:8888/api/front",
        url: '',
        method: 'get',
        data: null,
        params: null,
        timeout: '15000',
        headers: { },
        hasToken: true
    }
    extend(defaults,api,options)
    console.log(defaults)
    return instance(defaults);
}