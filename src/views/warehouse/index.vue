<template>
  <div class="pad20">
    <div class="alignEnd pb10">
      <el-button type="primary" @click="adds">新增仓库</el-button>
    </div>
    <div class="pb10">
      <el-table :data="lists" v-loading="loading" stripe border style="width: 100%">
        <el-table-column prop="name" label="仓库名称"></el-table-column>
        <el-table-column prop label="仓库类型">
          <template slot-scope="scope">{{scope.row.type | typeTxt}}</template>
        </el-table-column>
        <el-table-column prop label="详细地址">
          <template slot-scope="scope">
            {{scope.row.concat}} {{scope.row.telephone}}
            <br />
            {{scope.row.companyName}}
            <br />
            {{scope.row.countryName}} {{scope.row.province}} {{scope.row.city}} {{scope.row.district}} {{scope.row.address}}
            <br />
            {{scope.row.zip}}
          </template>
        </el-table-column>
        <el-table-column prop="msg" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini">库位管理</el-button>
            <el-button type="primary" size="mini" @click="edit(scope.row.id)">编辑</el-button>
            <el-button
              type="primary"
              size="mini"
              v-if="scope.row.state"
              @click="states(scope.row.id,0)"
            >停用</el-button>
            <el-button type="primary" size="mini" v-else @click="states(scope.row.id,1)">启用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="alignEnd">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 100]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalSize"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import api from "../../api/axios";
import App from "../../api/index";
export default {
  filters: {
    typeTxt(e) {
      if (e == 1) {
        return "保税仓";
      }
      if (e == 2) {
        return "非保税仓-普通";
      }
      if (e == 3) {
        return "非保税仓-直播";
      }
    },
  },
  name: "WarehouseList",
  data() {
    return {
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
    this.getStoreQuery();
  },
  methods: {
    //修改每页显示条数
    handleSizeChange(val) {
      const self = this
      self.page.pageSize = val
      self.getStoreQuery();
    },
    //改变当前页数
    handleCurrentChange(val) {
      const self = this
      self.page.pageNo = val
      self.getStoreQuery();
    },
    //获取仓库列表数据
    getStoreQuery() {
      const self = this;
      const url = App.warehouseList;
      self.loading = true;
      const args = {
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
          self.$message.error(err.msg || "系统报错！");
        });
    },
    //状态点击事件
    states(id, state) {
      const self = this;
      const args = {
        id: id,
        state: state,
      };
      const url = App.updateState;
      api
        .POST(url, args)
        .then((res) => {
          self.$message.success("操作成功");
          self.getStoreQuery();
        })
        .catch((err) => {
          self.$message.error(err.msg || "系统报错！");
        });
    },
    //新增仓库
    adds() {
      this.$router.push({ path: "/warehouse/add" });
    },
    //编辑仓库
    edit(id) {
      this.$router.push({ path: "/warehouse/add", query: { id: id } });
    },
  },
};
</script>
<style scoped>
</style>