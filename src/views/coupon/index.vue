<template>
  <div class="pad20">
    <div>
      <el-form :inline="true" label-width="100px" size="mini">
        <el-form-item label="优惠券名称">
          <el-input placeholder="请输入优惠券名称" v-model="map.name"></el-input>
        </el-form-item>
        <el-form-item label="使用期限">
          <el-date-picker
            v-model="setTime"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="优惠券类型">
          <el-select v-model="map.type" clearable placeholder="全部">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否过期">
          <el-select v-model="map.isExpired" clearable placeholder="全部">
            <el-option
              v-for="item in isExpiredOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否领完">
          <el-select v-model="map.isGetOut" clearable placeholder="全部">
            <el-option
              v-for="item in isGetOutOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="handleCheck">查询</el-button>
          <el-button icon="el-icon-refresh" class="filter-item" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-tabs v-model="tabsSelect" type="card" @tab-click="handleClick">
        <el-tab-pane label="发放中" name="1"></el-tab-pane>
        <el-tab-pane label="未启用" name="0"></el-tab-pane>
        <el-tab-pane label="已停用" name="2"></el-tab-pane>
        <el-tab-pane label="全部" name="all"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="pb10">
      <el-table :data="list" v-loading="loading" stripe border style="width: 100%">
        <el-table-column prop="name" label="优惠券名称">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 1">满减券</span>
            <span v-else-if="scope.row.type == 2">代金券</span>
          </template>
        </el-table-column>
        <el-table-column prop="renewTime" label="使用期限">
          <template
            slot-scope="scope"
          >{{scope.row.startTime | dateFormat}} 至 {{scope.row.endTime | dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="maxNum" label="发布数量">
          <template slot-scope="scope">{{scope.row.maxNum}}</template>
        </el-table-column>
        <el-table-column prop="getCount" label="已领取">
          <template slot-scope="scope">{{scope.row.getCount}}</template>
        </el-table-column>
        <el-table-column prop="mobile" label="状态">
          <template slot-scope="scope">
            <span :class="'statusTxt'+scope.row.status">{{scope.row.status |statusTxt}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="msg" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleDetail(scope.row.id)">查看详情</el-button>
            <el-button type="primary" size="mini" @click="edits(scope.row.id)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--@current-change 是改变页面的时候触发事件 size-change是改变每页条数的时候触发-->
    <el-pagination
      class="alignEnd"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[20, 40, 100, 200]"
      :page-size="page.pageSize"
      :current-page-sync="page.pageNo"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.totalSize"
    ></el-pagination>
  </div>
</template>
<script>
import api from "../../api/axios";
import App from "../../api/index";
import dateFormat from "dateformat";
export default {
  filters: {
    dateFormat(e) {
      return dateFormat(e, "yyyy-mm-dd");
    },
    statusTxt(e) {
      if (e == 0) {
        return "未启用";
      }
      if (e == 1) {
        return "发放中";
      }
      if (e == 2) {
        return "已停用";
      }
    },
  },
  name: "CouponList",
  data() {
    return {
      list: [],
      map: {
        name: "",
        isExpired: "",
        isGetOut: "",
        type: "",
        status: "1",
        id: "",
        startTime: "",
        endTime: "",
      },
      tabsSelect: '1',
      page: {
        pageNo: 1,
        pageSize: 20,
        totalSize: 0,
      },
      ctrl: {
        loading: false,
      },
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
      typeOptions: [
        {
          value: "",
          label: "全部",
        },
        {
          value: 1,
          label: "满减券",
        },
        {
          value: 2,
          label: "代金券",
        },
      ],
      isExpiredOptions: [
        {
          value: "",
          label: "全部",
        },
        {
          value: 1,
          label: "是",
        },
        {
          value: 0,
          label: "否",
        },
      ],
      isGetOutOptions: [
        {
          value: "",
          label: "全部",
        },
        {
          value: 1,
          label: "是",
        },
        {
          value: 0,
          label: "否",
        },
      ],
      setTime: [],
      loading: false,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    //调整每页显示条数
    handleSizeChange(val) {
      const self = this;
      self.page.pageSize = val;
      self.getList();
    },
    //改变当前页数
    handleCurrentChange(val) {
      const self = this;
      self.page.pageNo = val;
      self.getList();
    },
    //获取列表数据
    getList() {
      const self = this;
      const url = App.couponList;
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
            self.list = res.data.pageData;
            self.page = {
              ...self.page,
              pageNo: res.data.pageNo,
              totalSize: res.data.totalSize,
            };
          }
          self.loading = false;
        })
        .catch((err) => {
          self.loading = false;
        });
    },
    //查看详情点击事件
    handleDetail(id) {
      this.$router.push({ path: "/couponList/detail", query: { id: id } });
    },
    //编辑按钮点击事件
    edits(id) {
      this.$router.push({ path: "couponList/add", query: { id: id } });
    },
    //查询点击事件
    handleCheck() {
      this.page.pageNo = 1;
      if (this.setTime && this.setTime.length == 2) {
        this.map.startTime = new Date(this.setTime[0]).getTime(); //把时间数组的第一个值赋给入参的开始时间
        this.map.endTime = new Date(this.setTime[1]).getTime(); //把时间数组的第二个值赋给入参的结束时间
      } else {
        this.map.startTime = "";
        this.map.endTime = "";
      }
      this.getList();
    },
    //重置点击事件
    handleReset() {
      this.map = {
        name: "",
        isExpired: "",
        isGetOut: "",
        type: "",
        status: "",
        id: "",
        startTime: "",
        endTime: "",
      };
      this.setTime = [];
      this.page.pageNo = 1;
      this.getList();
    },
    //tabs
    handleClick(){
      this.page.pageNo =1;
      this.map.status = this.tabsSelect;
      if(this.tabsSelect === "all"){
        this.status = ""
      }
      this.getList();
    }
  },
};
</script>
<style lang='scss' scoped>
.statusTxt1 {
  color: #369c16;
}
.statusTxt2 {
  color: #d62323;
}
</style>