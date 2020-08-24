<template>
  <div class="pad20">
    <div class="tab-layout">
      <el-row>
        <el-col :span="4">
          <div class="table-title">优惠券名称</div>
        </el-col>
        <el-col :span="4">
          <div class="table-title">类型</div>
        </el-col>
        <el-col :span="4">
          <div class="table-title">使用范围</div>
        </el-col>
        <el-col :span="4">
          <div class="table-title">获取途径</div>
        </el-col>
        <el-col :span="4">
          <div class="table-title">满</div>
        </el-col>
        <el-col :span="4">
          <div class="table-title">减</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="table-con">{{coupon.name}}</div>
        </el-col>
        <el-col :span="4">
          <div class="table-con">{{coupon.type | typeTxt}}</div>
        </el-col>
        <el-col :span="4">
          <div class="table-con">{{coupon.useType | useStatues}}</div>
        </el-col>
        <el-col :span="4">
          <div class="table-con">{{coupon.getType | getTxt}}</div>
        </el-col>
        <el-col :span="4">
          <div class="table-con">{{coupon.limitAmt}}元</div>
        </el-col>
        <el-col :span="4">
          <div class="table-con">{{coupon.amount}}元</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="table-title">状态</div>
        </el-col>
        <el-col :span="4">
          <div class="table-title">使用期限</div>
        </el-col>
        <el-col :span="4">
          <div class="table-title">发布数量</div>
        </el-col>
        <el-col :span="4">
          <div class="table-title">已领取</div>
        </el-col>
        <el-col :span="4">
          <div class="table-title">已使用</div>
        </el-col>
        <el-col :span="4">
          <div class="table-title">创建时间</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="table-con">{{coupon.status | statusTxt}}</div>
        </el-col>
        <el-col :span="4">
          <div class="table-con">{{coupon.startTime | dateFormat}} - {{coupon.endTime | dateFormat}}</div>
        </el-col>
        <el-col :span="4">
          <div class="table-con">{{coupon.maxNum}}</div>
        </el-col>
        <el-col :span="4">
          <div class="table-con">{{coupon.getCount}}</div>
        </el-col>
        <el-col :span="4">
          <div class="table-con">{{coupon.usedCount}}</div>
        </el-col>
        <el-col :span="4">
          <div class="table-con">{{coupon.createTime | dateFormat}}</div>
        </el-col>
      </el-row>
    </div>
    <div class="coupon-dsc">
      <span>优惠券说明：</span>
      <el-input type="textarea" rows="5" v-model="coupon.dsc"></el-input>
    </div>
    <div class="form-box">
      <el-form :inline="true" size="mini" :model="map" >
        <el-form-item label="订单编号">
          <el-input v-model.trim="map.tno" placeholder="请输入优惠券名称"></el-input>
        </el-form-item>
        <el-form-item label="使用状态">
          <el-select
            v-model="map.status"
            class="auto-width"
            clearable
            filterable
            placeholder="使用状态"
            style="width: 300px"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary">查询</el-button>
          <el-button icon="el-icon-refresh" class="filter-item">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        v-loading="loading"
        size="medium"
        :data="lists"
        stripe
        border=""
        style="width: 100%"
      >
        <el-table-column prop="" label="会员昵称"></el-table-column>
        <el-table-column prop="" label="获得优惠券时间"></el-table-column>
        <el-table-column prop="" label="使用状态"></el-table-column>
        <el-table-column prop="" label="使用时间"></el-table-column>
        <el-table-column prop="" label="订单编号"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import api from "../../api/axios";
import dateFormat from "dateformat";
export default {
  filters: {
    dateFormat(e) {
      return dateFormat(e, "yyyy-mm-dd HH:MM");
    },
    typeTxt(e) {
      if (e == 1) {
        return "满减券";
      }
      if (e == 2) {
        return "代金券";
      }
    },
    useStatues(e) {
      if (e == 0) {
        return "全场通用";
      }
      if (e == 1) {
        return "指定分类";
      }
      if (e == 2) {
        return "指定商品";
      }
      if (e == 3) {
        return "指定品牌";
      }
    },
    getTxt(e) {
      if (e == 0) {
        return "普通";
      }
      if (e == 1) {
        return "新人";
      }
      if (e == 2) {
        return "老带新";
      }
      if (e == 3) {
        return "分享";
      }
      if (e == 4) {
        return "续费";
      }
      if (e == 5) {
        return "直播";
      }
      if (e == 6) {
        return "分销分享";
      }
      if (e == 7) {
        return "指定用户";
      }
      if (e == 8) {
        return "生日";
      }
    },
    statusTxt(e) {
      if (e == 0) {
        return "未启用";
      }
      if (e == 1) {
        return "已启动";
      }
      if (e == 2) {
        return "已停止";
      }
      if (e == 3) {
        return "发放中";
      }
      if (e == 4) {
        return "已领完";
      }
    },
  },
  name: "CouponDetail",
  data() {
    return {
      coupon: {},
      map: {
        tno: "",
        status: "",
      },
      options: [
        {
          value: "",
          label: "全部",
        },
        {
          value: 0,
          label: "未使用",
        },
        {
          value: 1,
          label: "预核销",
        },
        {
          value: 2,
          label: "已使用",
        },
        {
          value: 3,
          label: "已过期",
        },
      ],
      lists: [],
      loading: false,
      tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
    };
  },
  mounted() {
    const self = this;
    self.id = this.$route.query.id;
    if (self.id) {
      self.detailList();
    }
    this.getCouponOrderQuery();
  },
  methods: {
    //获取详情列表数据
    detailList() {
      const self = this;
      const url = "/coupon/couponDetail/" + self.id;      
      api.GET(url).then((res) => {
        if (res.code === 0) {
          res.data.dsc = res.data.dsc ? decodeURIComponent(res.data.dsc) : ''
          this.coupon = res.data;
        }
      }).catch(err => {
        self.$message.error(err.msg || '系统报错！')
      });
    },
    //获取优惠券订单列表查询数据
    getCouponOrderQuery() {
      const self = this;
      const url = `/coupon/couponOrderQuery?id=${self.id}`;  
      self.loading = true;
      const args ={
        pageNo:1,
        pageSize:20
      }  
      api.GET(url, args).then((res) => {
        if (res.code == 2) {
          self.lists = res.data;
          console.log
        }
        self.loading = false
      }).catch(err => {
        self.loading = false
        self.$message.error(err.msg || '系统报错！')
      });
    },
  },
};
</script>
<style lang="scss">
.el-col {
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;

  text-align: center;
  font-size: 14px;
  color: #303133;
}
.tab-layout {
  border-top: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}
.table-title {
  min-height: 36px;
  line-height: 36px;
  background: #f2f6fc;
}
.table-con {
  min-height: 60px;
  line-height: 60px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.coupon-dsc {
  display: flex;
  padding: 20px 0;
}
.el-textarea {
  width: 300px;
  margin-left: 10px;
}
.form-box {
  padding-top: 20px;
  border-top: 1px solid #ddd;
}
</style>