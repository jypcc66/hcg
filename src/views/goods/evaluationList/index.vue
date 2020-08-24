<template>
  <div class="pad20">
    <div>
      <el-form size="mini" :data="map" :inline="true">
        <el-form-item label="评价内容：">
          <el-input placeholder="请输入评价内容" v-model="map.text"></el-input>
        </el-form-item>
        <el-form-item label="评价会员：">
          <el-input placeholder="请输入评价会员" v-model="map.vipNick"></el-input>
        </el-form-item>
        <el-form-item label="商品名称：">
          <el-input placeholder="请输入商品名称" v-model="map.productName"></el-input>
        </el-form-item>
        <el-form-item label="商品编码：">
          <el-input placeholder="请输入商品编码" v-model="map.productCode"></el-input>
        </el-form-item>
        <el-form-item label="评价时间：">
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
        <el-form-item label="评价类型：">
          <el-select v-model="map.evaluateType" clearable placeholder="全部">
            <el-option
              v-for="item in evaluateTypeOptions"
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
      <el-table :data="lists" v-loading="loading" border stripe style="width: 100%">
        <el-table-column label="评价会员">
          <template slot-scope="scope">
            <div class="flex-wrap">
              <img class="img" :src="scope.row.vipPhoto" alt />
              <span>{{scope.row.vipNick}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="star" label="评价星级"></el-table-column>
        <el-table-column prop="text" label="评价内容"></el-table-column>
        <el-table-column prop="productCode" label="商品编码"></el-table-column>
        <el-table-column label="评价商品">
          <template slot-scope="scope">
            <div class="flex-wrap">
              <img class="img" :src="scope.row.pic" alt />
              <span>{{scope.row.productName}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="评价时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">禁用</span>
            <span v-else-if="scope.row.status == 1">启用</span>
          </template>
        </el-table-column>
        <el-table-column prop="msg" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              v-if="scope.row.status == 0"
              @click="statu(scope.row.id,1)"
            >启用</el-button>
            <el-button size="mini" type="info" v-else @click="statu(scope.row.id,0)">禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="alignEnd">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 50, 100]"
        :current-page.sync="page.pageNo"
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
import dateFormat from "dateformat";
export default {
  filters: {
    //在export default里定义过滤器
    dateFormat(e) {
      return dateFormat(e, "yyyy-mm-dd");
    },
  },
  name: "EvaluationList",
  data() {
    return {
      map: {
        productCode: "",
        productName: "",
        star: "",
        status: "",
        text: "",
        tno: "",
        vipId: "",
        vipNick: "",
        vipPhoto: "",
        evaluateType: "",
        evaluateStartTime: "",
        evaluateEndTime: "",
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        totalSize: 0,
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
      evaluateTypeOptions: [
        {
          value: "",
          label: "全部",
        },
        {
          value: 0,
          label: "会员评价",
        },
        {
          value: 1,
          label: "虚拟评价",
        },
      ],
      setime: [],
      loading: false,
      lists: [],
    };
  },
  mounted() {
    this.getEvaluateQuery(); // 调用商品评价查询方法
  },
  methods: {
    //调整每页显示条数
    handleSizeChange(val) {
        const self = this
        self.page.pageSize = val
        self.getEvaluateQuery();
      },
      //改变当前页数
      handleCurrentChange(val) {
        const self = this
        self.page.pageNo = val
        self.getEvaluateQuery();
      },
    //停启用点击事件
    statu(id, status) {
      const self = this;
      const url = App.updateEvaluateStatus;
      const args = {
        id: id,
        status: status,
      };
      api
        .POST(url, args)
        .then((res) => {
          if (res.code === 0) {
            self.$message.success("操作成功");
            this.getEvaluateQuery();
          }
        })
        .catch((err) => {
          self.$message.error(err.msg || "系统报错！");
        });
    },
    //获取商品评价查询数据
    getEvaluateQuery() {
      const self = this;
      self.loading = true
      const url = App.evaluateQuery;
      const args = {
        ...self.map,
        pageNo: self.page.pageNo,
        pageSize: self.page.pageSize,
      };
      api.GET(url, args).then((res) => {
        if (res.code === 0) {
          self.lists = res.data.pageData;
          self.page = {
            ...self.page,
            pageNo: res.data.pageNo,
            totalSize: res.data.totalSize
          }
          console.log(self.lists);
        }
        self.loading = false
      }).catch(err => {
        self.$message.error(err.msg || '系统报错！')
        self.loading = false
      });
    },
    //查询点击事件
    handleCheck() {
      if (this.setime && this.setime.length == 2) {
        //判断这个时间数组是否存在并且时间数组的长度等于2
        this.map.evaluateStartTime = new Date(this.setime[0]).getTime(); //把时间数组的第一个值赋给入参的开始时间
        this.map.evaluateEndTime = new Date(this.setime[1]).getTime(); //把时间数组的第二个值赋给入参的结束时间
      } else {
        this.map.evaluateStartTime = "";
        this.map.evaluateEndTime = "";
      }
      this.page.pageNo = 1;
      this.getEvaluateQuery(); //调用要查询的列表数据
    },
    //重置点击事件
    handleReset() {
      const self = this;
      self.map = {
        productCode: "",
        productName: "",
        star: "",
        status: "",
        text: "",
        tno: "",
        vipId: "",
        vipNick: "",
        vipPhoto: "",
        evaluateType: "",
      };
      self.setime = [];
      self.page.pageNo = 1;
      self.getEvaluateQuery();
    },
  },
};
</script>
<style lang="scss" scoped>
.flex-wrap {
  align-items: center;
}
.img {
  width: 60px;
  height: 60px;
  display: inline-block;
  margin-right: 10px;
}
</style>