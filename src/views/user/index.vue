<template>
  <div class="pad20">
    <div>
      <el-form :inline="true" :model="map" size="mini">
        <el-form-item label="会员昵称">
          <el-input placeholder="请输入会员昵称" v-model="map.nick"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input placeholder="请输入手机号" v-model="map.mobile"></el-input>
        </el-form-item>
        <el-form-item label="付费方式">
          <el-select v-model="map.vipPackageId" clearable placeholder="请选择付费方式">
            <el-option
              v-for="item in payOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开通时间">
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
        <el-form-item label="是否VIP">
          <el-select v-model="map.status" clearable placeholder="请选择会员状态">
            <el-option
              v-for="item in statusOptions"
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
      <el-table :data="lists" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="60"></el-table-column>
        <el-table-column label="会员信息" width="250">
          <template slot-scope="scope">
            <div class="flex-wrap">
              <img class="img" :src="scope.row.photo" alt />
              <div>{{scope.row.nick}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column label="手机号授权时间">字段不存在</el-table-column>
        <el-table-column label="开通VIP时间">
          <template
            slot-scope="scope"
            v-if="scope.row.renewTime"
          >{{scope.row.renewTime| dateFormat}}</template>
        </el-table-column>
        <el-table-column label="VIP到期时间">
          <template
            slot-scope="scope"
            v-if="scope.row.expireTime"
          >{{scope.row.expireTime| dateFormat}}</template>
        </el-table-column>
        <el-table-column label="付费方式">
          <template slot-scope="scope">
            <span v-if="scope.row.vipPackageId == 1">月包</span>
            <span v-else-if="scope.row.vipPackageId == 2">季包</span>
            <span v-else-if="scope.row.vipPackageId == 3">半年包</span>
            <span v-else-if="scope.row.vipPackageId == 4">年包</span>
          </template>
        </el-table-column>
        <el-table-column label="登录次数">字段不存在</el-table-column>
        <el-table-column label="最后登录时间">字段不存在</el-table-column>
        <el-table-column prop="msg" label="操作">
          <template slot-scope="scope">
            <el-button type="success" size="mini">修改</el-button>
            <el-button type="primary" size="mini">设置分成</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="alignEnd">
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 30, 100]"
      :page-size.sync="page.pageSize"
      :current-page="page.pageNo"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.totalSize">
    </el-pagination>
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
  name: "UserList",
  data() {
    return {
      map: {
        expireTime: "",
        id: "",
        mobile: "",
        nick: "",
        photo: "",
        renewTime: "",
        vipPackageId: "",
        renewTimeStart: "",
        renewTimeEnd: "",
      },
      payOptions: [
        {
          value: 1,
          label: "月包",
        },
        {
          value: 2,
          label: "季包",
        },
        {
          value: 3,
          label: "半年包",
        },
        {
          value: 4,
          label: "年包",
        },
      ],
      statusOptions: [
        {
          value: 0,
          label: "不是VIP",
        },
        {
          value: 1,
          label: "有效期内",
        },
        {
          value: 2,
          label: "已过期",
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
      loading: false,
      lists: [],
      setime: [],
      page: {
        pageNo: 1, //当前页数
        pageSize: 10, //每页显示多少条
        totalSize: 0, //总共多少条
      },
    };
  },
  mounted() {
    this.getVipQuery();
  },
  methods: {
    //调整每页显示条数
    handleSizeChange(val) {
      const self = this
      self.pageSize = val
      self.getVipQuery()
    },
    //改变当前页数
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      const self = this
      self.pageNo = val
      self.getVipQuery()
    },
    //获取会员列表查询数据
    getVipQuery() {
      const self = this;
      const url = App.vipQuery;
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
            console.log(res);
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
        this.map.renewTimeStart = new Date(this.setime[0]).getTime();
        this.map.renewTimeEnd = new Date(this.setime[1]).getTime();
      } else {
        this.map.renewTimeStart = "";
        this.map.renewTimeEnd = "";
      }
      this.getVipQuery();
    },
    //重置点击事件
    handleReset() {
      const self = this;
      self.page.pageNo = 1;
      self.map = {
        expireTime: "",
        id: "",
        mobile: "",
        nick: "",
        photo: "",
        renewTime: "",
        vipPackageId: "",
      };
      self.setime = [];
      self.getVipQuery();
    },
  },
};
</script>
<style lang='scss' scoped>
.flex-wrap {
  align-items: center;
}
.img {
  width: 60px;
  height: 60px;
  margin-right: 20px;
}
</style>