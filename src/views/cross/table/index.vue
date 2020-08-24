<template>
  <div class="pad20">
    <div>
      <el-form :inline="true" size="mini">
        <el-form-item label="商品名称">
          <el-input placeholder="请输入商品名称" v-model="map.nameCh"></el-input>
        </el-form-item>
        <el-form-item label="规格编码">
          <el-input placeholder="请输入规格编码" v-model="map.codeId"></el-input>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="map.apprRtn" clearable placeholder="请选择审核状态">
            <el-option
              v-for="item in apprRtnOptions"
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
    <div class="pb10">
      <table class="table" cellspacing="0" :loading="loading">
        <tr>
          <th>流水号</th>
          <th>商品名称</th>
          <th>规格</th>
          <th>规格编码</th>
          <th>提交时间</th>
          <th>审核状态</th>
          <th>操作</th>
        </tr>
        <tr v-for="(item,index) in lists" :key="index">
          <td>{{item.serialNumber}}</td>
          <td>{{item.nameCh}}</td>
          <td>{{item.cargoSpec}}</td>
          <td>{{item.codeId}}</td>
          <td>{{item.commitTime | dateFormat}}</td>
          <td>
            <span v-if="item.apprRtn === 1 ">审核通过</span>
            <span v-else-if="item.apprRtn === 2 ">审核不通过</span>
            <span v-else-if="item.apprRtn === 3 ">审核中</span>
          </td>
          <td>
            <button>查看详情</button>
          </td>
        </tr>
      </table>
    </div>
    <div class="alignEnd">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page.pageNo"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalSize"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import api from "../../../api/axios";
import App from "../../../api/index";
import dateFormat from "dateformat"; //调用时间插件
export default {
  filters: {
    //在export default里定义过滤器
    dateFormat(e) {
      return dateFormat(e, "yyyy-mm-dd hh:mm:ss");
    },
  },
  name: "GoodsTable",
  data() {
    return {
      map: {
        nameCh: "",
        codeId: "",
        apprRtn: "",
      },
      apprRtnOptions: [
        {
          value: "",
          label: "全部",
        },
        {
          value: 1,
          label: "审核通过",
        },
        {
          value: 2,
          label: "审核不通过",
        },
        {
          value: 3,
          label: "审核中",
        },
      ],
      page: {
        pageNo: 1,
        pageSize: 10,
        totalSize: 0,
      },
      loading: false,
      lists: [],
    };
  },
  mounted() {
    this.getCustomsProduct(); //调用海关商品列表查询
  },
  methods: {
    //调整每页条数
    handleSizeChange(val) {
      const self = this;
      self.page.pageSize = val;
      this.getCustomsProduct();
    },
    //改变当前页数
    handleCurrentChange(val) {
      const self = this;
      self.page.pageNo = val;
      this.getCustomsProduct();
    },
    //获取海关商品列表查询
    getCustomsProduct() {
      const self = this;
      const url = App.customsProduct;
      const args = {
        ...self.map,
        pageNo: self.page.pageNo,
        pageSize: self.page.pageSize,
      };
      self.loading = true;
      api
        .GET(url, args)
        .then((res) => {
          if (res.code == 0) {
            self.lists = res.data.pageData;
            self.page = {
              ...self.page,
              pageNo: res.data.pageNo,
              totalSize: res.data.totalSize,
            };
            self.loading = false;
          }
        })
        .catch((err) => {
          self.$message.error(err.msg || "系统报错！");
          self.loading = false;
        });
    },
    //查询点击事件
    handleCheck(){
      this.page.pageNo = 1;
      this.getCustomsProduct();
    },
    //重置点击事件
    handleReset(){
      this.page.pageNo = 1;
      this.map = {
        nameCh: "",
        codeId: "",
        apprRtn: "",
      }
      this.getCustomsProduct();
    }
  },
};
</script>
<style scoped>
.table {
  width: 100%;
  border-left: 1px solid #eee;
  border-bottom: 1px solid #eee;
}
.table td,
.table th {
  padding: 10px;
  text-align: center;
  border-top: 1px solid #eee;
  border-right: 1px solid #eee;
}
</style>