<template>
  <div class="pad20">
    <div>
      <el-form :inline="true" :model="map" size="mini">
        <el-form-item label="仓库">
          <el-select v-model="map.storeName" clearable placeholder="全部">
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="map.productName" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="handleCheck">查询</el-button>
          <el-button icon="el-icon-refresh" class="filter-item" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="pb10">
      <el-table :data="lists" v-loading="loading" border stripe style="width: 100%">
        <el-table-column prop="storeName" label="仓库名称"></el-table-column>
        <el-table-column prop="title" label="商品名称"></el-table-column>
        <el-table-column prop="skuName" label="规格"></el-table-column>
        <el-table-column prop="canUseNum" label="可用库存"></el-table-column>
        <el-table-column prop="num" label="实际库存"></el-table-column>
        <el-table-column prop="msg" label="操作">
          <el-button type="primary" size="mini">编辑</el-button>
        </el-table-column>
      </el-table>
    </div>
    <div class="alignEnd">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 100]"
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
export default {
  name: "WarehousingLocation",
  data() {
    return {
      map: {
        storeName: "",
        productName: "",
      },
      page:{
        pageNo: 1,
        pageSize: 10,
        totalSize: 0
      },
      storeList: [],
      loading: false,
      lists: [],
    };
  },
  mounted() {
    this.getWarehouseList();
    this.getStockQuery();
  },
  methods: {
    //调整每页显示条数
    handleSizeChange(val) {
      const self = this
      self.page.pageSize = val
      self.getStockQuery();
    },
    //改变当前页数
    handleCurrentChange(val) {
      const self = this
      self.page.pageNo = val
      self.getStockQuery();
    },
    //获取仓库列表
    getWarehouseList() {
      const self = this;
      const url = App.warehouseList;
      api
        .GET(url)
        .then((res) => {
          if (res.code === 0) {
            self.storeList = res.data.pageData;
          }
        })
        .catch((err) => {
          this.$message.error(err.msg || "系统报错！");
        });
    },
    //库存管理-查询数据
    getStockQuery() {
      const self = this;
      const url = App.stockQuery;
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
              totalSize: res.data.totalSize
            }
          }
          self.loading = false;
        })
        .catch((err) => {
          self.loading = false;
          this.$message.error(err.msg || "系统报错！");
        });
    },
    //查询点击事件
    handleCheck() {
      this.page.pageNo = 1;
      this.getStockQuery();
    },
    //重置点击事件
    handleReset() {
      this.page.pageNo = 1;
      this.map = {
        storeName: "",
        title: "",
      };
      this.getStockQuery();
    },
  },
};
</script>