<template>
  <div class="pad20">
    <el-form label-width="200px">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="订单申报" name="first">
          <div>
            <div>
              <div class="title">订单申报</div>
              <div>
                <el-form-item label="审核状态：">
                  <template>
                    <span v-if="detail.status == 'ongoing'">申报中</span>
                    <span v-else-if="detail.status == 'success'">成功</span>
                    <span v-else-if="detail.status == 'fail'">失败</span>
                    <span v-else-if="detail.status == 'cancel'">取消</span>
                  </template>
                </el-form-item>
                <div class="flex-wrap">
                  <div class="flex-flow">
                    <el-form-item label="审核意见：">{{detail.statusMsg}}</el-form-item>
                  </div>
                  <div class="flex-flow">
                    <el-form-item label="流水号：">{{detail.serialNumber}}</el-form-item>
                  </div>
                  <div class="flex-flow">
                    <el-form-item
                      label="提交时间："
                      v-if="detail.commitTime"
                    >{{detail.commitTime | dateFormat}}</el-form-item>
                  </div>
                </div>
                <div class="flex-wrap">
                  <div class="flex-flow">
                    <el-form-item label="订单号：">{{detail.merchantOrderId}}</el-form-item>
                  </div>
                  <div class="flex-flow">
                    <el-form-item label="申报备案号：">{{detail.declaraNo}}</el-form-item>
                  </div>
                  <div class="flex-flow"></div>
                </div>
              </div>
            </div>
            <div>
              <div class="title">订单信息</div>
              <el-form-item label="* 商户订单号：">{{detail.merchantOrderId}}</el-form-item>
              <el-form-item label="* 物流分运单号：">{{detail.assBillNo}}</el-form-item>
              <el-form-item label="* 订单提交时间：">{{detail.orderCommitTime | dateFormat}}</el-form-item>
              <div class="flex-wrap">
                <div class="flex-flow">
                  <el-form-item label="* 商品价格：">{{detail.allCargoTotalPrice}}</el-form-item>
                </div>
                <div class="flex-flow">
                  <el-form-item label="* 代扣税款：">{{detail.allCargoTotalTax}}</el-form-item>
                </div>
                <div class="flex-flow">
                  <el-form-item label="* 运杂费：">{{detail.expressPrice}}</el-form-item>
                </div>
              </div>
              <el-form-item label="* 非现金抵扣金额：">{{detail.otherPrice}}</el-form-item>
              <el-form-item label="* 收货人姓名：">{{detail.recPerson}}</el-form-item>
              <el-form-item label="* 收货人电话：">{{detail.recPhone}}</el-form-item>
              <el-form-item label="* 收货地国家：">{{detail.recCountry}}</el-form-item>
              <el-form-item label="* 收货地省/州名：">{{detail.recProvince}}</el-form-item>
              <el-form-item label="* 收货地城市：">{{detail.recCity}}</el-form-item>
              <el-form-item label="* 收货地地址：">{{detail.recAddress}}</el-form-item>
              <el-form-item label="收货地邮编：">{{detail.recZip}}</el-form-item>
              <el-form-item label="* 商品信息简述：">{{detail.cargoDescript}}</el-form-item>
            </div>
            <div>
              <div class="title">订购人信息</div>
              <el-form-item label="* 订购人注册号：">{{detail.buyerRegNo}}</el-form-item>
              <el-form-item label="* 订购人手机号：">{{detail.spt04}}</el-form-item>
              <el-form-item label="订购人姓名：">{{detail.spt01}}</el-form-item>
              <el-form-item label="订购人身份证：">{{detail.spt02}}</el-form-item>
              <el-form-item label="是否通过身份认证：">
                <template>
                  <span v-if="detail.spt03 === 'Y'">是</span>
                  <span v-else-if="detail.spt03 === 'N'">否</span>
                  <span v-else>未知</span>
                </template>
              </el-form-item>
            </div>
            <div>
              <div class="title">业务信息</div>
              <el-form-item label="* 业务类型：">{{detail.serverType === 'S01' ? '一般进口' : '保税区进口'}}</el-form-item>
              <el-form-item label="* 海关关区代码：">{{detail.custCode}}</el-form-item>
              <el-form-item label="* 报送类型：">
                <template>
                  <span v-if="detail.appType === 1">新增</span>
                  <span v-else-if="detail.appType === 2">变更</span>
                  <span v-else-if="detail.appType === 3">删除</span>
                </template>
              </el-form-item>
              <el-form-item label="* 物流进境申报企业：">{{detail.customDeclCo}}</el-form-item>
            </div>
            <div class="pb10">
              <div class="title">商品信息</div>
              <el-table
                :data="detail.cargoes"
                v-loading="loading"
                border
                stripe
                style="width: 100%"
              >
                <el-table-column prop="gnum" label="商品序号"></el-table-column>
                <el-table-column prop="cargoName" label="单项购买商品名称"></el-table-column>
                <el-table-column prop="cargoCode" label="单项购买商品编号"></el-table-column>
                <el-table-column prop="cargoNum" label="单项购买商品数量"></el-table-column>
                <el-table-column prop="cargoUnitPrice" label="单项购买商品单价"></el-table-column>
                <el-table-column prop="cargoTotalPrice" label="单项购买商品总价"></el-table-column>
                <el-table-column prop="cargoTotalTax" label="单项购买商品缴税总价"></el-table-column>
                <el-table-column prop="unit" label="*单位"></el-table-column>
                <el-table-column prop="country" label="*原产国"></el-table-column>
                <el-table-column prop="spt01" label="*商品规格型号"></el-table-column>
                <el-table-column prop="barCode" label="条形码"></el-table-column>
                <el-table-column prop="note" label="备注"></el-table-column>
              </el-table>
            </div>
            <div>
              <div class="title">支付信息</div>
              <div class="flex-wrap">
                <div class="flex-flow">
                  <el-form-item label="* 支付方式：">{{detail.payMethod}}</el-form-item>
                </div>
                <div class="flex-flow">
                  <el-form-item label="* 付款币种：">{{detail.payCUR}}</el-form-item>
                </div>
              </div>
              <el-form-item label="* 支付总金额：">{{detail.payAmount}}</el-form-item>
              <el-form-item label="* 支付交易号：">{{detail.payID}}</el-form-item>
              <el-form-item label="* 支付交易时间：">{{detail.payTime}}</el-form-item>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="物流单申报" name="second">
          <div v-if="logistics">
            <div>
              <div class="title">物流单申报</div>
              <el-form-item label="审核状态：">
                <template>
                  <span v-if="logistics.status == 'ongoing'">申报中</span>
                  <span v-else-if="logistics.status == 'success'">成功</span>
                  <span v-else-if="logistics.status == 'fail'">失败</span>
                  <span v-else-if="logistics.status == 'cancel'">取消</span>
                </template>
              </el-form-item>
              <div class="flex-wrap">
                <div class="flex-flow">
                  <el-form-item label="客户运单编号：">{{logistics.client_ship}}</el-form-item>
                </div>
                <div class="flex-flow">
                  <el-form-item
                    label="提交时间："
                    v-if="logistics.createTime"
                  >{{logistics.createTime | dateFormat}}</el-form-item>
                </div>
              </div>
            </div>
            <div>
              <div class="title">物流单申报信息</div>
              <div>
                <div class="flex-wrap">
                  <div class="flex-flow">
                    <el-form-item label="订单号：">{{logistics.order_list}}</el-form-item>
                  </div>
                  <div class="flex-flow">
                    <el-form-item label="运单所属物流编号：">{{logistics.logistics_id}}</el-form-item>
                  </div>
                </div>
                <div class="flex-wrap">
                  <div class="flex-flow">
                    <el-form-item label="货品总件数：">{{logistics.total_count}}</el-form-item>
                  </div>
                  <div class="flex-flow">
                    <el-form-item label="申报物品总名称：">{{logistics.goods_name}}</el-form-item>
                  </div>
                </div>
                <div class="flex-wrap">
                  <div class="flex-flow">
                    <el-form-item label="运单总重量：">{{logistics.total_weight}}</el-form-item>
                  </div>
                  <div class="flex-flow">
                    <el-form-item label="运单总费用：">{{logistics.total_fees}}</el-form-item>
                  </div>
                </div>
                <div class="flex-wrap">
                  <div class="flex-flow">
                    <el-form-item label="电商平台国检名称：">{{logistics.ebp_ciq_name}}</el-form-item>
                  </div>
                  <div class="flex-flow">
                    <el-form-item label="电商平台国检编码：">{{logistics.ebp_ciq_code}}</el-form-item>
                  </div>
                </div>
                <div class="flex-wrap">
                  <div class="flex-flow">
                    <el-form-item label="物品编号：">{{logistics.logistics_id}}</el-form-item>
                  </div>
                  <div class="flex-flow">
                    <el-form-item label="账号：">{{logistics.source_flag}}</el-form-item>
                  </div>
                </div>
                <div class="flex-wrap">
                  <div class="flex-flow">
                    <el-form-item label="发件人：">
                      <template>
                        {{logistics.sender.sender_name}} {{logistics.sender.sender_tel}}
                        <br />
                        {{logistics.sender.sender_compay}}
                        <br />
                        {{logistics.sender.sender_city}} {{logistics.sender.sender_address}}
                        <br />
                        {{logistics.sender.sender_eamil}}
                      </template>
                    </el-form-item>
                  </div>
                  <div class="flex-flow">
                    <el-form-item label="收件人：">
                      <template>
                        {{logistics.receiver.receiver_name}} {{logistics.receiver.receiver_tel}}
                        <br />
                        {{logistics.receiver.receiver_compay}}
                        <br />
                        {{logistics.receiver.receiver_province}} {{logistics.receiver.receiver_city}} {{logistics.receiver.receiver_address}}
                        <br />
                        {{logistics.receiver.receiver_eamil}}
                      </template>
                    </el-form-item>
                  </div>
                </div>
                <div class="flex-wrap">
                  <div class="flex-flow"></div>
                  <div class="flex-flow">
                    <el-form-item label="证件类型编号：">{{logistics.receiver.re_card_no}}</el-form-item>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else>{{logisticsMsg}}</div>
        </el-tab-pane>
        <el-tab-pane label="支付单申报" name="third">
          <div v-if="pay">
            <div>
              <div class="title">支付单申报</div>
              <el-form-item label="审核状态：">
                <template>
                  <span v-if="pay.state == 'ongoing'">申报中</span>
                  <span v-else-if="pay.state == 'success'">成功</span>
                  <span v-else-if="pay.state == 'fail'">失败</span>
                </template>
              </el-form-item>
              <div class="flex-wrap">
                <div class="flex-flow">
                  <el-form-item label="微信支付订单号：">{{pay.transaction_id}}</el-form-item>
                </div>
                <div class="flex-flow">
                  <el-form-item label="商户订单号：">{{pay.out_trade_no}}</el-form-item>
                </div>
                <div class="flex-flow">
                  <el-form-item label="提交时间：" v-if="pay.createTime">{{pay.createTime | dateFormat}}</el-form-item>
                </div>
              </div>
              <div class="flex-wrap">
                <div class="flex-flow">
                  <el-form-item
                    label="最后更新时间："
                    v-if="pay.updateTime"
                  >{{pay.updateTime | dateFormat}}</el-form-item>
                </div>
                <div class="flex-flow">
                  <el-form-item label="订购人和支付人身份信息校验结果：">
                    <template>
                      <span v-if="pay.cert_check_result === 'UNCHECKED'">商户未上传订购人身份信息</span>
                      <span v-else-if="pay.cert_check_result === 'SAME'">商户上传的订购人身份信息与支付人身份信息一致</span>
                      <span
                        v-else-if="pay.cert_check_result === 'DIFFERENT'"
                      >商户上传的订购人身份信息与支付人身份信息不一致</span>
                    </template>
                  </el-form-item>
                </div>
                <div class="flex-flow">
                  <el-form-item label="验核机构：">
                    <template>
                      <span v-if="pay.verify_department === 'UNIONPAY'">银联</span>
                      <span v-else-if="pay.verify_department === 'NETSUNION'">网联</span>
                      <span v-else-if="pay.verify_department === 'OTHERS'">其它</span>
                    </template>
                  </el-form-item>
                </div>
              </div>
              <div class="flex-wrap">
                <div class="flex-flow">
                  <el-form-item label="验核机构交易流水号：">{{pay.verify_department_trade_id}}</el-form-item>
                </div>
              </div>
            </div>
          </div>
          <div v-else>{{payMsg}}</div>
        </el-tab-pane>
      </el-tabs>
      <el-form-item>
        <el-button type="primary" @click="returnClick">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import api from "../../../api/axios";
import App from "../../../api/index";
import dateFormat from "dateformat";
export default {
  filters: {
    //在export default里定义过滤器
    dateFormat(e) {
      return dateFormat(e, "yyyy-mm-dd");
    },
  },
  name: "OrderDetail",
  data() {
    return {
      detail: "",
      activeName: "first",
      orderDeclaration: [],
      loading: false,
      logistics: "", //物流申报
      logisticsMsg: "", //物流申报提示
      pay: "", //海关支付单申报
      payMsg: "", //海关支付单申报提示
    };
  },
  mounted() {
    const self = this;
    self.id = self.$route.query.id;
    if (self.id) {
      self.getCustomsOrderDetail(); //调用海关订单详情
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //获取海关订单详情数据
    getCustomsOrderDetail() {
      const self = this;
      const url = App.customsOrderDetail + `?id=${self.id}`;
      self.loading = true;
      api
        .GET(url)
        .then((res) => {
          if (res.code === 0) {
            self.detail = res.data;
            self.getOrderLogisticDetail(); //调用海关物流申报详情
            self.getOrderPayDetail(); //调用海关支付单申报详情
          }
          self.loading = false;
        })
        .catch((err) => {
          self.$message.error(err.msg || "系统报错！");
          self.loading = false;
          self.logisticsMsg = err.msg;
        });
    },
    //获取海关物流申报详情数据
    getOrderLogisticDetail() {
      const self = this;
      const url =
        App.orderLogisticDetail + `?tno=${self.detail.merchantOrderId}`;
      api
        .GET(url)
        .then((res) => {
          if (res.code === 0) {
            self.logistics = res.data;
          }else{
            self.logisticsMsg = res.msg;
          }
        })
        .catch((err) => {
          self.$message.error(err.msg || "系统报错！");
        });
    },
    //获取海关支付单申报详情数据
    getOrderPayDetail() {
      const self = this;
      const url = App.orderPayDetail + `?tno=${self.detail.merchantOrderId}`;
      api
        .GET(url)
        .then((res) => {
          if (res.code === 0) {
            self.pay = res.data;
          }else{
            self.payMsg = res.msg
          }
        })
        .catch((err) => {
          self.$message.error(err.msg || "系统报错！");
        });
    },
    //返回点击事件
    returnClick(){
      this.$router.push({ path: '/cross/order'});
      this.getCustomsOrderDetail();
    }
  },
};
</script>
<style lang="scss" scoped>
.title {
  height: 30px;
  line-height: 30px;
  margin-bottom: 20px;
  border-bottom: 1px solid #999;
}
</style>