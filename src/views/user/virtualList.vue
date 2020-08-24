<template>
  <div class="pad20">
    <div>
      <el-form :inline="true" :model="map" size="mini">
        <el-form-item label="会员昵称">
          <el-input v-model="map.nick" placeholder="请输入会员昵称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleCheck">查询</el-button>
          <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="pb10">
      <el-table :data="lists" v-loading="loading" border stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="60"></el-table-column>
        <el-table-column prop="nick" label="昵称"></el-table-column>
        <el-table-column prop="address" label="头像">
          <template slot-scope="scope">
            <img class="img" v-if="scope.row.photo" :src="scope.row.photo" alt />
            <el-button v-else type="text">上传头像</el-button>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">{{scope.row.createdTime | dateFormat}}</template>
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
import api from "../../api/axios";
import App from "../../api/index";
import dateFormat from "dateformat";
export default {
  filters: {
    //在export default里定义过滤器
    dateFormat(e) {
      return dateFormat(e, "yyyy-mm-dd hh:mm:ss");
    },
  },
  name: "VirtualList",
  data() {
    return {
      map: {
        id: "",
        nick: "",
        photo: "",
      },
      lists: [],
      loading: false,
      page: {
        pageNo: 1, //当前页数
        pageSize: 10, //每页显示多少条
        totalSize: 0, //总共多少条
      },
    };
  },
  mounted() {
    this.getVirtualVip();
  },
  methods: {
    //调整每页显示条数
    handleSizeChange(val) {
      const self = this;
      self.page.pageSize = val;
      self.getVirtualVip();
    },
    //改变当前页数
    handleCurrentChange(val) {
      const self = this;
      self.page.pageNo = val;
      self.getVirtualVip();
    },
    //获取虚拟会员分页查询数据
    getVirtualVip() {
      const self = this;
      const url = App.virtualVip;
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
          self.loading = false;
          self.$message.error(err.msg || "系统报错！");
        });
    },
    //查询点击事件
    handleCheck() {
      this.page.pageNo = 1;
      this.getVirtualVip();
    },
    //重置点击事件
    handleReset() {
      this.page.pageNo = 1;
      (this.map = {
        id: "",
        nick: "",
        photo: "",
      }),
        (this.lists = []);
      this.getVirtualVip();
    },
  },
};
</script>
<style lang="scss" scoped>
.img {
  width: 60px;
  height: 60px;
}
</style>