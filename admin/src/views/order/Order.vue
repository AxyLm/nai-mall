<template>
    <div class="order">
        <data-table ref="table"
            searchTips="请输入编号，订单编号，会员名称"
            :data="tableData" :add-btn="false" :del-btn="false"
            @sortChange="sortChange" @filterChange="filterChange" @searchChange="searchChange"
            :check-column="false"
            :query-info="queryInfo" @pageChange="pageChange" @sizeChange="sizeChange"
        >
            <el-table-column prop="id" label="编号" width="70" sortable></el-table-column>
            <el-table-column prop="code" label="订单编号" width="130" show-overflow-tooltip></el-table-column>
            <el-table-column prop="user_name" label="会员名称" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="good" label="订单商品" width="70" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-link @click="clickShowGoods(scope.row)" type="primary"><span class="fz-12">查看</span></el-link>
                </template>
            </el-table-column>
            <el-table-column prop="freight_money" label="运费金额" width="70" show-overflow-tooltip></el-table-column>
            <el-table-column prop="total_money" label="订单金额" width="70" show-overflow-tooltip></el-table-column>
            <el-table-column prop="pay_type" label="支付方式" column-key="pay_type" :filters="filters.payType" filter-placement="bottom-end" :filter-multiple="false" width="120" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span :class="scope.row.pay_type | enumsColor($enums.Pay_Type)">
                        {{ scope.row.pay_type | enums($enums.Pay_Type) }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="pay_no" label="交易流水号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="is_self_take" label="邮寄方式" column-key="is_self_take" :filters="filters.deliveryType" filter-placement="bottom-end" :filter-multiple="false" width="120" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>
                        {{ scope.row.is_self_take ? "自提" : "邮寄" }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" show-overflow-tooltip width="120">
                <template slot="header" slot-scope="scope">
                    <el-popover placement="bottom-end" width="400" trigger="click" ref="createDateRangePop">
                        <el-date-picker v-model="createDateRange" class="w-100" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="daterange" range-separator="至" unlink-panels start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                        <p class="mart-10 textr">
                            <el-link class="marr-10" :disabled="createDateRange.length!=2" @click="timeFilterChange('create',scope.row)">筛选</el-link>
                            <el-link @click="timeFilterReset('create',scope.row)">重置</el-link>
                        </p>
                        <span slot="reference">创建时间<i class="el-icon-arrow-down el-icon--right fw-b pointer"></i></span>
                    </el-popover>
				</template>
                <template slot-scope="scope">
                    {{scope.row.add_time | ymd}}
                </template>
            </el-table-column>
            <el-table-column label="物流进度" align="center">
                <template slot-scope="scope">
                     <el-button @click="clickShowProgress(scope.row)" :disabled="scope.row.status==0 || scope.row.status==1 || scope.row.status==5" icon="el-icon-location" type="success" circle plain size="mini"></el-button>
                </template>
            </el-table-column>
            <el-table-column label="查看评价" align="center">
                <template slot-scope="scope">
                     <el-button @click="clickShowComment(scope.row)" :disabled="scope.row.status!=4" icon="el-icon-star-on" type="warning" size="mini" circle plain></el-button>
                </template>
            </el-table-column>
             <el-table-column label="状态" column-key="status" :filters="filters.status" filter-placement="bottom-end" :filter-multiple="false" width="70" fixed="right" align="center">
                <template slot-scope="scope">
                    <span :class="scope.row.status | enumsColor($enums.Order_Status)">
                        {{ scope.row.status | enums($enums.Order_Status) }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="240" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button-group >
                        <el-button @click="clickCloseOrder(scope.row)" :disabled="scope.row.status!=0" icon="el-icon-edit" size="mini">关闭</el-button>
                        <el-button @click="clickShowPrice(scope.row)" :disabled="scope.row.status!=0" icon="el-icon-edit" size="mini">改价</el-button>
                        <el-button @click="clickShowDelivery(scope.row)" :disabled="scope.row.status!=1" icon="el-icon-position" size="mini">发货</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </data-table>
        <!-- 展示物流进度的对话框 -->
        <div v-if="showDeliveryProcess">
            <el-dialog title="物流进度" :visible.sync="showDeliveryProcess" width="50%">
                <el-timeline :reverse="false">
                    <el-timeline-item
                        v-for="(activity, index) in timeList"
                        :key="index"
                        :timestamp="activity.ftime"
                    >
                        {{ activity.context }}
                    </el-timeline-item>
                </el-timeline>
            </el-dialog>
        </div>
        <!-- 展示订单商品的对话框 -->
        <div v-if="showGoods">
            <el-dialog title="订单商品" :visible.sync="showGoods" width="80%" class="no-btn">
                <el-table :data="goodsList" border show-summary :summary-method="orderGoodsSummaries">
                    <el-table-column prop="id" label="编号" width="45"></el-table-column>
                    <el-table-column prop="sma_imgs" label="图片" width="60">
                        <template slot-scope="scope">
                            <el-image v-if="scope.row.sma_imgs" :src="scope.row.sma_imgs[0]"></el-image>
                        </template>
                    </el-table-column>
                    <el-table-column prop="good_name" label="商品名称" width="300" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="good_price" label="单价(元)"></el-table-column>
                    <el-table-column prop="good_count" label="数量(个)"></el-table-column>
                    <el-table-column prop="good_tt" label="小计(元)">
                        <template slot-scope="scope">
                            {{scope.row.good_price*scope.row.good_count}}
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
        </div>
        <!-- 修改订单价格的对话框 -->
        <div v-if="showUpdPrice">
            <el-dialog title="修改价格" :visible.sync="showUpdPrice" width="50%">
                <el-form ref="priceForm" :model="priceFormData" :rules="priceFormRules" label-width="78px">
                    <el-form-item prop="total_money" label="订单价格">
                        <el-input v-model="priceFormData.total_money"></el-input>
                    </el-form-item>
                </el-form>
                <div class="dialog-fixed-btn textr">
                    <el-button type="primary" @click="clickSetPrice">提交</el-button>
                    <el-button @click="clickHidePrice">关闭</el-button>
                </div>
            </el-dialog>
        </div>
        <!-- 发货对话框 -->
        <div v-if="showDelivery">
            <el-dialog title="订单发货" :visible.sync="showDelivery" width="50%">
                <el-form ref="deliveryForm" :model="deliveryFormData" :rules="deliveryFormRules" label-width="78px">
                    <el-form-item prop="company" label="快递公司">
                        <el-select v-model="deliveryFormData.company" class="w-100">
                            <el-option v-for="(item,index) in $enums.Delivery_Compay.ToArray()" :key="index" :value="item.text" :label="item.text"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="number" label="快递单号">
                        <el-input v-model="deliveryFormData.number"></el-input>
                    </el-form-item>
                </el-form>
                <div class="dialog-fixed-btn textr">
                    <el-button type="primary" @click="clickSendDelivery">提交</el-button>
                    <el-button @click="clickHideDelivery">关闭</el-button>
                </div>
            </el-dialog>
        </div>
        <!-- 查看评价的对话框 -->
        <div v-if="showComment">
            <el-dialog title="订单评价" :visible.sync="showComment" width="50%">
                <div class="dialog-fixed-btn textr">
                    <el-button type="primary">提交</el-button>
                    <el-button @click="clickHideComment">关闭</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script src="./js/Order.js"></script>