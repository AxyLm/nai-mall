<template>
    <!-- 
        地区编码规则：
        1）areaList数据为对象结构，包含 province_list、city_list、county_list 三个 key；
        2）每项以地区码作为 key，省市区名字作为 value；
        2）地区码为 6 位数字，前两位代表省份，中间两位代表城市，后两位代表区县，以 0 补足 6 位；
        3）比如北京的地区码为 11，以 0 补足 6 位，为 110000。
    -->
    <!-- 
        1）使用示例1： 省
           <Area v-model="areaNum" type="province"></Area>
        2）使用示例2： 省==>市
           <Area v-model="areaNum" type="city"></Area>
        3）使用示例3： 省==>市==>县
           <Area v-model="areaNum"></Area>
        4）使用示例4： 多选
           <Area v-model="areaNum" :isMultiple="true"></Area>
    -->
    <el-cascader
        ref="cascader"
        v-model="areaValue"
        :options="areaTree"
        @change="areaChange"
        :props="{
            value: 'value',
            children: 'children',
            checkStrictly: false,
            multiple: isMultiple
        }"
        :disabled="disabled"
        filterable
        :size="size"
        clearable
        collapse-tags
    >
    </el-cascader>
</template>

<script src="./js/Area.js"></script>