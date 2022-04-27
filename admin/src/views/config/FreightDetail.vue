<template>
    <el-form class="freightDetail"  ref="freightForm" :model="freightData" :rules="rules" label-width="80px">
        <el-tabs v-model="activeIndex" :before-leave="beforeChangeTab" type="border-card">
            <!-- 基本信息 -->
            <el-tab-pane label="基本信息" name="0">
                <el-form-item label="模板名称" prop="name">
                    <el-input v-model="freightData.name"></el-input>
                </el-form-item>
                <el-form-item label="宝贝地址" prop="good_addr_code">
                    <Area ref="goodArea" v-model="freightData.good_addr_code" class="w-100"></Area>
                </el-form-item>
                <el-form-item label="发货时间" prop="delivery_time">
                    <el-input v-model="freightData.delivery_time" v-only-number="{min:0,precision:0}">
                        <template slot="append">小时内</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="是否包邮" prop="is_free">
                    <el-radio-group v-model="freightData.is_free" @change="isFreeChange">
                        <el-radio :label="0" class="marr-10">自定义运费</el-radio>
                        <el-radio :label="1">卖家承担运费</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="计价方式" prop="price_method" v-if="!freightData.is_free">
                    <el-radio-group v-model="freightData.price_method">
                        <el-radio :label="0" class="marr-10">按重量</el-radio>
                        <el-radio :label="1" class="marr-10">按件数</el-radio>
                        <el-radio :label="2">按体积</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="包邮条件" prop="specify_free_condition" v-if="!freightData.is_free">
                    <el-checkbox v-model="freightData.specify_free_condition"></el-checkbox>
                </el-form-item>
            </el-tab-pane>
            <!-- 运送方式 -->
            <el-tab-pane label="运送方式" name="1" v-if="!freightData.is_free">
                <el-alert title="除指定地区外，其余地区的运费采用“默认运费" type="warning" :closable="false" show-icon></el-alert>
                <el-card v-for="(item,key,index) in freightDeliveryData" :key="item.title" shadow="never" class="mart-10">
                    <!-- 是否设置 -->
                    <div class="header" slot="header">
                        <el-checkbox v-model="item.checked" @change="freightDeliveryChange(item)">{{item.title}}</el-checkbox>
                        <el-button @click="addDeliveryOther(item)" :disabled="!item.checked" icon="el-icon-plus" type="text">为指定地区设置运费</el-button>
                    </div>
                    <!-- 默认运费 -->
                    <div class="default marb-10">
                        <span>默认运费：</span>
                        <el-input v-model="item.default.firstNo" :disabled="!item.checked" size="mini"></el-input>
                        <span v-if="freightData.price_method==0">kg内，</span>
                        <span v-if="freightData.price_method==1">件内，</span>
                        <span v-if="freightData.price_method==2">m³内，</span>
                        <el-input v-model="item.default.firstMoney" :disabled="!item.checked" size="mini"></el-input>
                        <span>元，</span>
                        <span class="marr-5">每增加</span>
                        <el-input v-model="item.default.secondNo" :disabled="!item.checked" size="mini"></el-input>
                        <span v-if="freightData.price_method==0">kg，</span>
                        <span v-if="freightData.price_method==1">件，</span>
                        <span v-if="freightData.price_method==2">m³，</span>
                        <span class="marr-5">增加运费</span>
                        <el-input v-model="item.default.secondMoney" :disabled="!item.checked" size="mini"></el-input>
                        <span>元</span>
                    </div>
                    <!-- 指定地区运费 -->
                    <el-table border :data="item.other" ref="t1">
                        <el-table-column label="运送到">
                            <template slot-scope="scope">
                                <Area :ref="'area'+index+''+scope.$index" v-model="scope.row.area_code" type="city" is-multiple size="mini" :disabled="!item.checked" class="w-100"></Area>
                            </template>
                        </el-table-column>
                        <el-table-column width="100">
                            <template #header>
                                <span v-if="freightData.price_method==0">首重（kg）</span>
                                <span v-if="freightData.price_method==1">首件（个）</span>
                                <span v-if="freightData.price_method==2">首体积（m³）</span>
                            </template>
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.firstNo" :disabled="!item.checked" size="mini"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="首费（元）" width="100">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.firstMoney" :disabled="!item.checked" size="mini"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column width="100">
                             <template #header>
                                <span v-if="freightData.price_method==0">续重（kg）</span>
                                <span v-if="freightData.price_method==1">续件（个）</span>
                                <span v-if="freightData.price_method==2">续体积（m³）</span>
                            </template>
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.secondNo" :disabled="!item.checked" size="mini"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="续费（元）" width="100">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.secondMoney" :disabled="!item.checked" size="mini"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="47">
                            <template slot-scope="scope">
                                <el-button @click="delDeliveryOther(item,scope.$index)" :disabled="!item.checked" type="text">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-tab-pane>
            <!-- 指定包邮条件 -->
            <el-tab-pane label="指定包邮条件" name="2" v-if="!freightData.is_free&&freightData.specify_free_condition">
                <el-button @click="addConditionData()" icon="el-icon-plus" type="text">为指定地区设置包邮条件</el-button>
                <!-- 包邮条件 -->
                <el-table border :data="freightConditionData" ref="t2">
                    <el-table-column label="选择地区" width="365">
                        <template slot-scope="scope">
                            <Area :ref="'area3'+scope.$index" v-model="scope.row.area_code" type="city" is-multiple size="mini" class="w-100"></Area>
                        </template>
                    </el-table-column>
                    <el-table-column label="选择运送方式" width="112">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.delivery_way" clearable size="mini">
                                <el-option label="快递" :value="0"></el-option>
                                <el-option label="EMS" :value="1"></el-option>
                                <el-option label="平邮" :value="2"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="设置包邮条件" width="130">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.condition" @change="conditionChange(scope.row)" clearable size="mini">
                                <el-option value="weight" label="重量"></el-option>
                                <el-option value="piece" label="件数"></el-option>
                                <el-option value="volume" label="体积"></el-option>
                                <el-option value="money" label="金额"></el-option>
                                <el-option value="weight-money" label="重量+金额"></el-option>
                                <el-option value="piece-money" label="件数+金额"></el-option>
                                <el-option value="volume-money" label="体积+金额"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <template v-if="scope.row.condition=='weight' || scope.row.condition=='weight-money'">
                                <span class="marr-5">小于</span>
                                <el-input v-model="scope.row.conditionNo" v-only-number="{min:0,precision:2}" size="mini" class="w-e5"></el-input>
                                <span class="marl-5">kg</span>
                                <span v-if="scope.row.condition=='weight'">包邮</span>
                            </template>
                            <template v-if="scope.row.condition=='piece' || scope.row.condition=='piece-money'">
                                <span class="marr-5">满</span>
                                <el-input v-model="scope.row.conditionNo" v-only-number="{min:0,precision:0}" size="mini" class="w-e5"></el-input>
                                <span class="marl-5">件</span>
                                <span v-if="scope.row.condition=='piece'">包邮</span>
                            </template>
                            <template v-if="scope.row.condition=='volume' || scope.row.condition=='volume-money'">
                                <span class="marr-5">小于</span>
                                <el-input v-model="scope.row.conditionNo" v-only-number="{min:0,precision:2}" size="mini" class="w-e5"></el-input>
                                <span class="marl-5">m³</span>
                                <span v-if="scope.row.condition=='volume'">包邮</span>
                            </template>
                            <template v-if="scope.row.condition && scope.row.condition!='weight' && scope.row.condition!='volume' && scope.row.condition!='piece'">
                                <span v-if="scope.row.condition!='weight' && scope.row.condition!='volume' && scope.row.condition!='piece' && scope.row.condition!='money'">，</span>
                                <span class="marr-5">满</span>
                                <el-input v-model="scope.row.conditionMoney" v-only-number="{min:0,precision:2}" size="mini" class="w-e6"></el-input>
                                <span class="marl-5">元包邮</span>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="47">
                        <template slot-scope="scope">
                            <el-button @click="delConditionData(scope.$index)" type="text">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <!-- 按钮 -->
        <div class="dialog-fixed-btn textr">
            <progressButton type="primary" v-editButton="freightData" @click="submitForm">提交</progressButton>
            <el-button @click="close">关闭</el-button>
        </div>
    </el-form>
</template>
<script src="./js/FreightDetail.js"></script>
<style src="./css/FreightDetail.css" scoped></style>