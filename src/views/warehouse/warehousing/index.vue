<template>
  <div class="pad20">
    <div>
      <el-form :inline="true" :model="map" size="mini">
        <el-form-item label="仓库名称">
          <el-select v-model="map.storeName" clearable placeholder="全部">
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库单号">
          <el-input placeholder="请输入入库单号" v-model="map.customNumber"></el-input>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input placeholder="请输入商品名称" v-model="map.productName"></el-input>
        </el-form-item>
        <el-form-item label="规格编码">
          <el-input placeholder="请输入规格编码" v-model="map.skuCode"></el-input>
        </el-form-item>
        <el-form-item label="入库类型">
          <el-select v-model="map.type" clearable placeholder="全部">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库时间">
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
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="handleCheck">查询</el-button>
          <el-button icon="el-icon-refresh" class="filter-item" @click="handleReset">重置</el-button>
          <el-button type="primary" @click="adds">新增入库</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="pb10">
      <el-table :data="list" border stripe v-loading="loading" style="width: 100%">
        <el-table-column prop label="商品" width="350">
          <template slot-scope="scope">
            <div class="itemBox">
              <div class="imgBox">
                <img class="img" :src="scope.row.pic" />
              </div>
              <div class="titleBox">
                <p>{{scope.row.productName}}</p>
                <p>{{scope.row.skuName}}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="skuCode" label="规格编码"></el-table-column>
        <el-table-column prop="customNumber" label="入库单号"></el-table-column>
        <el-table-column prop="storeName" label="仓库名称"></el-table-column>
        <el-table-column prop="locationCode" label="库位"></el-table-column>
        <el-table-column prop="type" label="入库类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 1">到货</span>
            <span v-else-if="scope.row.type == 2">退换</span>
            <span v-else-if="scope.row.type == 3">调拨</span>
          </template>
        </el-table-column>
        <el-table-column prop="source" label="货物来源"></el-table-column>
        <el-table-column prop="num" label="入库数量"></el-table-column>
        <el-table-column prop label="入库时间">
          <template
            slot-scope="scope"
            v-if="scope.row.createTime"
          >{{scope.row.createTime | dateFormat}}</template>
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
import dateFormat from "dateformat";
export default {
  filters: {
    //在export default里定义过滤器
    dateFormat(e) {
      return dateFormat(e, "yyyy-mm-dd hh:mm:ss");
    },
  },
  name: "Warehousing",
  data() {
    return {
      map: {
        createTime: "",
        customNumber: "",
        locationCode: "",
        num: "",
        pic: "",
        productName: "",
        skuCode: "",
        skuName: "",
        source: "",
        storeName: "",
        type: "",
        createTimeStart: "",
        createTimeEnd: "",
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        totalSize: 0
      },
      list: [],
      setime: [],
      storeList: [
        {
          id: '',
          name: "全部"
        }
      ],
      loading: false,
      typeOptions: [
        {
          value: "",
          label: "全部",
        },
        {
          value: 1,
          label: "到货",
        },
        {
          value: 2,
          label: "退换",
        },
        {
          value: 3,
          label: "调拨",
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
    };
  },
  mounted() {
    this.warehouseList();
    this.stockInItemQuery();
  },
  methods: {
    //调整每页显示数量
    handleSizeChange(val) {
      const self = this
      self.page.pageSize = val
      self.stockInItemQuery();
    },
    //改变当前页数
    handleCurrentChange(val) {
      const self = this
      self.page.pageNo = val
      self.stockInItemQuery();
    },
    //获取入库管理查询数据
    stockInItemQuery() {
      const self = this;
      const url = App.stockInItemQuery;
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
              totalSize: res.data.totalSize
            }
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
        debugger;
        this.map.createTimeStart = new Date(this.setime[0]).getTime();
        this.map.createTimeEnd = new Date(this.setime[1]).getTime();
      } else {
        this.map.createTimeStart = "";
        this.map.createTimeEnd = "";
      }
      this.stockInItemQuery();
    },
    //重置点击事件
    handleReset() {
      this.page.pageNo = 1;
      this.map = {
        createTime: "",
        customNumber: "",
        locationCode: "",
        num: "",
        pic: "",
        productName: "",
        skuCode: "",
        skuName: "",
        source: "",
        storeName: "",
        type: "",
        createTimeStart: "",
        createTimeEnd: "",
      };
      this.setime = [];
      this.stockInItemQuery();
    },
    //获取仓库列表数据
    warehouseList() {
      const self = this;
      const url = App.warehouseList;
      const args = {
        pageNo: 1,
        pageSize: 20,
      };
      api
        .GET(url, args)
        .then((res) => {
          if (res.code === 0) {
            self.storeList = res.data.pageData;
          }
        })
        .catch((err) => {
          self.$message.error(err.msg || "系统报错！");
        });
    },
    //新增入库点击事件
    adds() {
      this.$router.push({ path: "/warehouse/warehousing/add" });
    },
  },
};
</script>
<style lang='scss' scoped>
.itemBox {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.itemBox .imgBox,
.itemBox .img {
  width: 60px;
  height: 60px;
}
.itemBox .imgBox {
  flex: 0 0 80px;
}
.itemBox .titleBox {
  flex: 1;
  display: flex;
  flex-direction: column;
  font-size: 12px;
}
.itemBox .titleBox p {
  margin: 0;
}
</style>