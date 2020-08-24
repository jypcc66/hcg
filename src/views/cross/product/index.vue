<template>
  <div class="pad20">
    <div>
      <el-form :inline="true" :data="map" size="mini">
        <el-form-item label="商品名称：">
          <el-input placeholder="请输入商品名称" v-model="map.nameCh"></el-input>
        </el-form-item>
        <el-form-item label="规格编码：">
          <el-input placeholder="请输入规格编码" v-model="map.codeId"></el-input>
        </el-form-item>
        <el-form-item label="审核状态：">
          <el-select v-model="map.apprRtn" clearable placeholder="全部">
            <el-option
              v-for="item in apprRtnOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="handleCheck">查询</el-button>
          <el-button icon="el-icon-refresh" class="filter-item" @click="handleReset">重置</el-button>
          <el-button type="primary" size="mini" @click="adds(map.id)">新增备案</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="pb10">
      <el-table :data="lists" v-loading="loading" border stripe style="width: 100%">
        <el-table-column prop="serialNumber" label="流水号"></el-table-column>
        <el-table-column prop="nameCh" label="商品名称"></el-table-column>
        <el-table-column prop="cargoSpec" label="规格"></el-table-column>
        <el-table-column prop="codeId" label="规格编码"></el-table-column>
        <el-table-column label="提交时间">
          <template slot-scope="scope">
            <div>{{scope.row.commitTime | dateFormat}}</div>
          </template>
        </el-table-column>
        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <span v-if="scope.row.apprRtn == '1'">审核通过</span>
            <span v-else-if="scope.row.apprRtn == '2'">审核不通过</span>
            <span v-else-if="scope.row.apprRtn == '3'">审核中</span>
          </template>
        </el-table-column>
        <el-table-column prop="msg" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="detail(scope.row.id)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="alignEnd">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.pageSize"
        :current-page.sync="page.pageNo"
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
    //在export default里定义过滤器
    dateFormat(e) {
      return dateFormat(e, "yyyy-mm-dd hh:mm:ss");
    },
  },
  name: "ProductList",
  data() {
    return {
      map: {
        apprRtn: "",
        codeId: "",
        nameCh: "",
      },
      apprRtnOptions: [
        {
          id: "",
          name: "全部",
        },
        {
          id: "1",
          name: "审核通过",
        },
        {
          id: "2",
          name: "审核不通过",
        },
        {
          id: "3",
          name: "审核中",
        },
      ],
      lists: [],
      loading: false,
      page: {
        pageNo: 1,
        pageSize: 10,
        totalSize: 0,
      },
    };
  },
  mounted() {
    this.getCustomsProduct(); //调用海关商品列表查询数据
  },
  methods: {
    //获取海关商品列表查询数据
    getCustomsProduct() {
      const self = this;
      const url = App.customsProduct;
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
            self.lists = res.data.pageData;
            self.page = {
              ...self.page,
              pageNo: res.data.pageNo,
              totalSize: res.data.totalSize,
            };
          }
          self.loading = false;
        })
        .catch((err) => {
          self.$message.error(err.msg || "系统报错！");
          self.loading = false;
        });
    },
    //查询点击事件
    handleCheck() {
      this.page.pageNo = 1
      this.getCustomsProduct();
    },
    //重置点击事件
    handleReset() {
      const self = this;
      self.map = {
        apprRtn: "",
        cargoSpec: "",
        codeId: "",
      };
      this.page.pageNo = 1
      self.getCustomsProduct();
    },
    //新增备案点击事件
    adds(id) {
      this.$router.push({ path: "/cross/product/add", query: { id: id }});
    },
    //调整每页面显示的数量
    handleSizeChange(val) {
      const self = this
      self.page.pageSize = val
      self.getCustomsProduct();
    },
    //改变当前页数
    handleCurrentChange(val) {
      const self = this
      self.page.pageNo = val
      self.getCustomsProduct();
    },
    //查看详情
    detail(id){
      this.$router.push({ path: "/cross/detail", query: {id: id}})
    }
  },
};
</script>