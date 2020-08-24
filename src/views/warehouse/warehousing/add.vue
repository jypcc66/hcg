<template>
  <div class="pad20">
    <div>
      <el-form label-width="150px" :model="map" ref="addForm" :rules="addsRules">
        <el-form-item label="入库单号：" prop="customNumber">
          <el-input placeholder="请输入入库单号" v-model="map.customNumber"></el-input>
        </el-form-item>
        <el-form-item label="选择仓库：" prop="storeId">
          <el-select v-model="map.storeId" clearable placeholder="请选择仓库">
            <el-option
              v-for="item in warehouseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库类型：" prop="type">
          <el-select v-model="map.type" clearable placeholder="请选择入库类型">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="货物来源：" prop="source">
          <el-input placeholder="请输入货物来源" v-model="map.source"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="selectProduct">入库商品</el-button>
        </el-form-item>
        <el-form :model="map" ref="subForm" class="tableBox">
          <el-table
            :data="map.inItems"
            v-loading="loadingsku"
            stripe
            border
            style="width: 100%; margin-bottom:20px"
          >
            <el-table-column prop="title" label="商品名称" width="200"></el-table-column>
            <el-table-column prop="productCode" label="商品编码"></el-table-column>
            <el-table-column prop="skuName" label="规格"></el-table-column>
            <el-table-column prop="skuCode" label="规格编码"></el-table-column>
            <el-table-column prop="num" label="数量">
              <template slot-scope="scope">
                <el-form-item :prop="'inItems.' + scope.$index + '.num'" :rules="productRules.num">
                  <el-input v-model="scope.row.num"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="sourceLocationId" label="库位"></el-table-column>
            <el-table-column prop="msg" label="操作"></el-table-column>
          </el-table>
        </el-form>
        <el-form-item>
          <el-button>取消</el-button>
          <el-button type="primary" @click="getStockIn('addForm', 'subForm')">确定保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="layout" v-if="skuList">
      <el-dialog title="入库商品" :visible.sync="dialogTableVisible">
        <el-form :inline="true" size="mini" :model="skuParameters">
          <el-form-item label="商品名称">
            <el-input v-model="skuParameters.title" placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品编码" prop="productCode">
            <el-input placeholder="请输入商品编码" v-model="skuParameters.productCode"></el-input>
          </el-form-item>
          <el-form-item label="规格编码" prop="skuCode">
            <el-input placeholder="请输入规格编码" v-model="skuParameters.skuCode"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="handleCheck">查询</el-button>
            <el-button icon="el-icon-refresh" class="filter-item" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="pb10">
          <el-table :data="skuList" v-loading="loading" border stripe>
            <el-table-column prop="productId" label="ID" width="60"></el-table-column>
            <el-table-column prop="title" label="商品名称" width="200"></el-table-column>
            <el-table-column prop="productCode" label="商品编码"></el-table-column>
            <el-table-column prop="skuName" label="规格"></el-table-column>
            <el-table-column prop="skuCode" label="规格编码"></el-table-column>
            <el-table-column prop="msg" label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="selectSku(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          layout="total,prev, pager, next"
          :total="page.totalSize"
          :page-size="page.pageSize"
          @current-change="handlePage"
        ></el-pagination>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import api from "../../../api/axios";
import App from "../../../api/index";
export default {
  name: "Add",
  data() {
    return {
      map: {
        customNumber: "",
        inItems: [],
        source: "",
        storeId: "",
        type: "",
      },
      warehouseList: [],
      typeOptions: [
        {
          value: 1,
          label: "到货入库",
        },
        {
          value: 2,
          label: "退换入库",
        },
        {
          value: 3,
          label: "调拨入库",
        },
      ],
      dialogTableVisible: false,
      loading: false,
      loadingsku: false,
      skuList: [],
      skuParameters: {
        productCode: "",
        productId: "",
        skuCode: "",
        skuId: "",
        skuName: "",
        title: "",
      },
      addsRules: {
        customNumber: [
          { required: true, message: "请输入入库单号", trigger: "blur" },
        ],
        storeId: [{ required: true, message: "请选择仓库", trigger: "change" }],
        type: [
          { required: true, message: "请选择入库类型", trigger: "change" },
        ],
        source: [
          { required: true, message: "请输入货物来源", trigger: "blur" },
        ],
      },
      productRules: {
        num: [{ required: true, message: "请输入数量", trigger: "blur" }],
      },
      page: {
        pageNo: 1, //当前页数
        pageSize: 5, //每页显示多少条
        totalSize: 0, //总共多少条
      },
    };
  },
  mounted() {
    this.getWarehouseList();
  },
  methods: {
    //入库商品按钮点击选择
    selectProduct() {
      const self = this;
      if (!self.map.storeId) {
        self.$message.error("请选择仓库");
        return false;
      }
      self.dialogTableVisible = true;
      self.getSkuQuery();
    },
    //分页点击事件
    handlePage(val) {
      const self = this;
      self.page.pageNo = val;
      self.getSkuQuery();
    },
    //入库商品选择点击事件
    selectSku(item) {
      const self = this;
      let status = true;
      const list = self.map.inItems;
      for (let i = 0; i < list.length; i++) {
        if (list[i].skuId === item.skuId) {
          status = false;
          break;
        }
      }
      if (status) {
        list.push(item);
      } else {
        self.$message.error("所选的数据已存在");
      }
    },
    //新增入库
    getStockIn(addForm, subForm) {
      const self = this;
      const url = App.stockIn;
      const args = self.map;
      self.$refs[addForm].validate((val) => {
        if (val) {
          if (!self.map.inItems.length) {
            self.$message.error("请选择入库商品");
            return false;
          }
          self.$refs[subForm].validate((vals) => {
            if (vals) {
              api
                .POST(url, args)
                .then((res) => {
                  if (res.code === 0) {
                    self.$message.success("入库成功");
                    self.$router.push({ path: "/warehouse/warehousing" });
                  }
                })
                .catch((err) => {
                  self.$message.error(res.msg || "系统报错！");
                });
            }
          });
        }
      });
    },
    //获取仓库列表
    getWarehouseList() {
      const self = this;
      const url = App.warehouseList;
      api
        .GET(url)
        .then((res) => {
          if (res.code === 0) {
            self.warehouseList = res.data.pageData;
            console.log(res);
          }
        })
        .catch((err) => {
          self.$message.error(err.msg || "系统报错！");
        });
    },
    //获取商品规格分页查询数据
    getSkuQuery() {
      const self = this;
      const url = App.skuQuery;
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
              (item.num = 1), (item.sourceLocationId = "");
            });
            self.skuList = res.data.pageData;
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
        });
    },
    //查询点击事件
    handleCheck() {
      this.getSkuQuery();
    },
    //重置点击事件
    handleReset() {
      const self = this;
      self.skuParameters = {
        productCode: "",
        productId: "",
        skuCode: "",
        skuId: "",
        skuName: "",
        title: "",
      };
      self.getSkuQuery();
    },
  },
};
</script>
<style lang='scss' scoped>
.layout .el-form .el-input {
  width: 160px !important;
}
.tableBox .el-input {
  width: 100px !important;
}
</style>