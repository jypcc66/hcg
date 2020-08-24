<template>
  <div class="pad20">
    <div>
      <el-form :inline="true" size="mini" :model="map">
        <el-form-item label="订单号">
          <el-input placeholder="请输入订单号" v-model="map.merchantOrderId"></el-input>
        </el-form-item>
        <el-form-item label="收货人">
          <el-input placeholder="请输入收货人" v-model="map.recPerson"></el-input>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="map.status" clearable placeholder="全部">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="handleCheck" size="mini">查询</el-button>
        <el-button icon="el-icon-refresh" class="filter-item" @click="handleReset" size="mini">重置</el-button>
      </el-form>
    </div>
    <div class="pb10">
      <el-table border :data="lists" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="merchantOrderId" label="订单号"></el-table-column>
        <el-table-column prop="allCargoTotalPrice" label="商品价格"></el-table-column>
        <el-table-column prop="allCargoTotalTax" label="代扣税款"></el-table-column>
        <el-table-column prop label="运杂费">无字段</el-table-column>
        <el-table-column prop="otherPrice" label="非现金抵扣金额"></el-table-column>
        <el-table-column label="收货人信息">
          <template slot-scope="scope">
            {{scope.row.recPerson}} {{scope.row.recPhone}}
            <br />
            {{scope.row.recCountry}} {{scope.row.recProvince}} {{scope.row.recCity}} {{scope.row.recAddress}}
            <br />
            {{scope.row.recZip}}
          </template>
        </el-table-column>
        <el-table-column label="物流信息">
          <template slot-scope="scope">
            {{scope.row.expressName}}
            <br />
            {{scope.row.assBillNo}}
          </template>
        </el-table-column>
        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 'ongoing'">申报中</span>
            <span v-else-if="scope.row.status == 'success'">成功</span>
            <span v-else-if="scope.row.status == 'fail'">失败</span>
            <span v-else-if="scope.row.status == 'cancel'">取消</span>
          </template>
        </el-table-column>
        <el-table-column prop="msg" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" v-if="scope.row.status == 'fail'" @click="edit(scope.row.id)">编辑</el-button>
            <el-button type="primary" size="mini" @click="detail(scope.row.id)">查看详情</el-button>
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
export default {
  name: "CrossOrderList",
  data() {
    return {
      map: {},
      statusOptions: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "ongoing",
          label: "申报中",
        },
        {
          value: "success",
          label: "成功",
        },
        {
          value: "fail",
          label: "失败",
        },
        {
          value: "cancel",
          label: "取消",
        },
      ],
      lists: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        totalSize: 0,
      },
      loading: false,
    };
  },
  mounted() {
    //调用海关订单列表查询
    this.getOrderQuery();
  },
  methods: {
    //获取海关订单列表查询
    getOrderQuery() {
      const self = this;
      const url = App.orderQuery;
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
      this.page.pageNo = 1;
      this.getOrderQuery();
    },
    //重置点击事件
    handleReset() {
      this.page.pageNo = 1;
      (this.map = {
        merchantOrderId: "",
        recPerson: "",
        status: "",
      }),
        (this.lists = []);
      this.getOrderQuery();
    },
    //调整每页显示的数量
    handleSizeChange(val) {
      const self = this;
      self.page.pageSize = val;
      self.getOrderQuery();
    },
    //改变当前页数
    handleCurrentChange(val) {
      const self = this;
      self.page.pageNo = val;
      self.getOrderQuery();
    },
    //查看详情点击事件
    detail(id) {
      this.$router.push({ path: "/cross/order/detail", query: { id: id }});
    },
    //编辑点击事件
    edit(id){
      this.$router.push({ path: "/cross/order/edit", query: {id: id}})
    }
  },
};
</script>