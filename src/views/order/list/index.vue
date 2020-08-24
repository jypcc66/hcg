<template>
  <div class="pad20">
    <div>
      <el-form :inline="true" :model="map" size="mini">
        <el-form-item label="商品名称">
          <el-input placeholder="请输入商品名称" v-model="map.productName"></el-input>
        </el-form-item>
        <el-form-item label="订单编号">
          <el-input placeholder="请输入订单编号" v-model="map.tno"></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="map.status" clearable placeholder="请选择订单状态">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="成交时间">
          <el-date-picker
            v-model="setime"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="会员昵称">
          <el-input placeholder="请输入会员昵称" v-model="map.vipNick"></el-input>
        </el-form-item>
        <el-form-item label="收货人">
          <el-input placeholder="请输入收货人" v-model="map.receiveName"></el-input>
        </el-form-item>
        <el-form-item label="收货手机号">
          <el-input placeholder="请输入收货手机号" v-model="map.receiveMobile"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="handleCheck">查询</el-button>
          <el-button icon="el-icon-refresh" class="filter-item" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="pb10">
      <el-table :data="lists" v-loading="loading" border stripe style="width: 100%">
        <el-table-column prop="date" label="日期" width="180px"></el-table-column>
        <el-table-column prop="tno" label="订单号"></el-table-column>
        <el-table-column label="商品信息" width="350">
          <template slot-scope="scope">
            <div
              class="flex-wrap"
              v-for="(item, index) in scope.row.orderVOS"
              :key="index"
              @click="togoodetail(item.productId)"
            >
              <div class="flex-flow imgview">
                <img :src="item.skuPic" />
              </div>
              <div class="flex-flow">
                <div class="textline1">{{item.title}}</div>
                <div class="color3">{{item.skuName}}</div>
                <div class="color3">
                  单价：{{item.productAmt}}元
                  <div class="num">x{{item.num}}</div>
                </div>
                <div class="color4" v-if="item.refundStatus != 0">
                  <div>{{item.refundStatus | refundStatusTxt}}</div>
                  <div>X{{item.refundNum}}</div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="actualAmt" label="收款金额(元)" width="80"></el-table-column>
        <el-table-column prop label="收货人信息" width="350">
          <template slot-scope="scope">
            {{scope.row.address1}}
            <br />
            {{scope.row.address2}}
          </template>
        </el-table-column>
        <el-table-column prop label="订单状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">待付款</span>
            <span v-else-if="scope.row.status === 1">待发货</span>
            <span v-else-if="scope.row.status === 2">待收货</span>
            <span v-else-if="scope.row.status === 3">待评价</span>
            <span v-else-if="scope.row.status === 4">已完成</span>
            <span v-else-if="scope.row.status === 5">已取消</span>
          </template>
        </el-table-column>
        <el-table-column prop="buyerMsg" label="备注"></el-table-column>
        <el-table-column prop="msg" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini">查看详情</el-button>
            <el-button type="primary" size="mini" v-if="scope.row.status == 1">发货</el-button>
            <el-button type="warning" size="mini" v-if="scope.row.status == 5">售后</el-button>
            <div v-if="scope.row.isCross == 1">
              <el-button type="text" size="mini" v-if="scope.row.approveStatus == 'wait'">待申报</el-button>
              <el-button
                type="text"
                size="mini"
                v-else-if="scope.row.approveStatus == 'ongoing'"
              >申报中</el-button>
              <el-button
                type="text"
                size="mini"
                v-else-if="scope.row.approveStatus == 'success'"
              >申报成功</el-button>
              <el-button
                type="text"
                style="color:#f00"
                size="mini"
                v-else-if="scope.row.approveStatus == 'fail'"
              >申报失败</el-button>
              <el-button
                type="text"
                style="color:#f00"
                size="mini"
                v-else-if="scope.row.approveStatus == 'cancel'"
              >申报取消</el-button>
              <br />
              <el-button
                type="danger"
                size="mini"
                @click="refund(scope.row)"
                v-if="!scope.row.refundStatus && ((scope.row.approveStatus == 'wait' || scope.row.approveStatus == 'fail') || (scope.row.approveStatus ==null && scope.row.status == 1) ||(scope.row.approveStatus ==null && scope.row.status == 2))"
              >退款</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="alignEnd">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="page.pageSize"
        :current-page="page.pageNo"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalSize"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import api from "../../../api/axios";
import App from "../../../api/index";
import dateFormat from "dateformat";
export default {
  filters: {
    refundStatusTxt(status) {
      if (status == 1) {
        return "售后完成";
      }
      if (status == 2) {
        return "部分售后中";
      }
      if (status == 3) {
        return "售后中";
      }
      if (status == 4) {
        return "申请售后";
      }
    },
  },
  name: "OrderList",
  data() {
    return {
      map: {
        productName: "",
        tno: "",
        status: "",
        vipNick: "",
        receiveName: "",
        receiveMobile: "",       
      },
      setime: [],
      loading: false,
      lists: [],
      statusOptions: [
        {
          value: "",
          label: "全部订单",
          status: "",
        },
        {
          value: 0,
          label: "待付款",
          status: "0",
        },
        {
          value: 1,
          label: "待发货",
          status: "1",
        },
        {
          value: 2,
          label: "待收货",
          status: "2",
        },
        {
          value: 3,
          label: "待评价",
          status: "3",
        },
        {
          value: 4,
          label: "已完成",
          status: "4",
        },
        {
          value: 5,
          label: "已取消",
          status: "5",
        },
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        totalSize: 0,
      },
    };
  },
  mounted() {
    this.getTradeQuery(); //调用
  },
  methods: {
    //获取订单查询数据
    getTradeQuery() {
      const self = this;
      const url = App.tradeQuery;
      self.loading = true;
      const args = {
        ...self.map,
        pageNo: self.page.pageNo,
        pageSize: self.page.pageSize,
      };
      api
        .GET(url, args)
        .then((res) => {
          if (res.code === 0) {
            res.data.pageData.forEach((item) => {
              item.address1 = item.receiveName + "  " + item.receiveMobile;
              item.address2 =
                item.receiveProvince +
                item.receiveCity +
                item.receiveDistrict +
                item.receiveDetail;
              item.buyerMsg = item.buyerMsg || "无";
              item.date = dateFormat(item.createTime, "yyyy-mm-dd HH:MM:ss");
              let count = 0;
              item.orderVOS.forEach((list) => {
                count += list.num;
              });
              item.count = count;
            });
            self.lists = res.data.pageData;
            self.page.pageNo = res.data.pageNo;
            self.page.totalSize = res.data.totalSize;
            self.page.pageSize = res.data.pageSize;
            console.log(res.data)
          }
          self.loading = false;
        })
        .catch((err) => {
          self.loading = false;
          self.$message.error(err.msg || "系统报错！");
        });
    },
    //查询点击事件
    handleCheck() {
      this.page.pageNo = 1;
      if (this.setime && this.setime.length == 2) {
        //判断这个时间数组是否存在并且时间数组的长度等于2
        this.map.payTimeStart = new Date(this.setime[0]).getTime(); //把时间数组的第一个值赋给入参的开始时间
        this.map.payTimeEnd = new Date(this.setime[1]).getTime(); //把时间数组的第二个值赋给入参的结束时间
      }
      this.getTradeQuery();
      console.log(this.page.pageNo);
    },
    //重置点击事件
    handleReset() {
      this.page.pageNo = 1;
      this.map = {
        productName: "",
        tno: "",
        status: "",
        vipNick: "",
        receiveName: "",
        receiveMobile: "",
      }
      this.setime = []
      this.getTradeQuery();
    },
    //跳转到详情页面
    togoodetail() {},
    handleSizeChange(val) {
      const self = this;
      self.page.pageSize = val;
      self.getTradeQuery();
    },
    handleCurrentChange(val) {
      const self = this;
      self.page.pageNo = val;
      self.getTradeQuery();
    },
  },
};
</script>
<style lang='scss' scoped>
.imgview {
  flex: 0 0 60px !important;
  margin-right: 10px;
}
.imgview img {
  width: 60px;
  height: 60px;
}
.textline1,
.color3 {
  text-align: left;
}
.color3 {
  width: 80%;
  position: relative;
  color: #999;
}
.num {
  position: absolute;
  right: 0;
  top: 0;
}
</style>