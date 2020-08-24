<template>
  <div class="pad20">
    <div class="pb10">
      <el-button @click="upper" :class="{'active':tabselect==1}" class="tab">上架中</el-button>
      <el-button :class="{'active':tabselect==2}" @click="down" class="tab">下架中</el-button>
    </div>
    <div class="goods pb10">
      <el-form :inline="true" :model="map" size="mini">
        <el-form-item label="商品名称">
          <el-input placeholder="请输入商品名称" v-model="map.title"></el-input>
        </el-form-item>
        <el-form-item label="商品id">
          <el-input placeholder="请输入商品id" v-model="map.productId"></el-input>
        </el-form-item>
        <el-form-item label="型号">
          <el-input placeholder="请输入型号" v-model="map.modelCode"></el-input>
        </el-form-item>
        <el-form-item label="会员价">
          <el-input placeholder="请输入会员起始价" v-model="map.downVipPrice"></el-input>--
          <el-input placeholder="请输入会员结束价" v-model="map.upVipPrice"></el-input>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select v-model="map.categoryId" clearable filterable placeholder="二级分类">
            <el-option v-for="item in categorys" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select v-model="map.brandId" clearable filterable placeholder="选择品牌">
            <el-option v-for="item in brands" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上架时间">
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
        <el-form-item label="操作">
          <el-form-item>
            <el-select
              v-model="map.saleval"
              @change="sortchange"
              clearable
              filterable
              placeholder="销量排序"
            >
              <el-option
                v-for="item in salesort"
                :key="item.val"
                :label="item.label"
                :value="item.val"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="map.stockval"
              @change="sortchange"
              clearable
              filterable
              placeholder="库存排序"
            >
              <el-option
                v-for="item in stocksort"
                :key="item.val"
                :label="item.label"
                :value="item.val"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="map.dateval"
              @change="sortchange"
              clearable
              filterable
              placeholder="上架时间排序"
            >
              <el-option
                v-for="item in datesort"
                :key="item.val"
                :label="item.label"
                :value="item.val"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="handleCheck">查询</el-button>
          <el-button icon="el-icon-refresh" class="filter-item" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-table
          border
          stripe
          ref="multipleTable"
          v-loading="loading"
          :data="productList"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop label="商品名称" width="360">
            <template slot-scope="scope">
              <div class="flex-wrap">
                <img class="img flex-flow" :src="scope.row.pic" alt />
                <div class="flex-flow">
                  <div>{{scope.row.title}}</div>
                  <div
                    class="skuview"
                    :key="index"
                    v-for="(item, index) in scope.row.skuVOS"
                  >{{item.name}}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="brandName" label="品牌"></el-table-column>
          <el-table-column prop="categoryName" label="二级分类"></el-table-column>
          <el-table-column label="会员价(元)" width="120">
            <template slot-scope="scope">
              <div
                class="prctab"
                v-if="scope.row.minPrice != scope.row.maxPrice"
                @click="showprice(scope.row)"
              >
                {{scope.row.minPrice}}-
                {{scope.row.maxPrice}}
                <i
                  class="el-icon-edit"
                  style="color:#409EFF;font-size:20px;"
                ></i>
              </div>
              <div class="prctab" v-else @click="showprice(scope.row)">
                {{scope.row.minPrice}}
                <i class="el-icon-edit" style="color:#409EFF;font-size:20px;"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop label="vip价（元）">
            <template slot-scope="scope">
              <div class="prctab" v-if="scope.row.minVipPrice != scope.row.maxVipPrice">
                {{scope.row.minVipPrice}}-
                {{scope.row.maxVipPrice}}
                <i
                  class="el-icon-edit"
                  style="color:#409EFF;font-size:20px;"
                ></i>
              </div>
              <div class="prctab">{{scope.row.minVipPrice}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="totalSale" label="销量"></el-table-column>
          <el-table-column prop="stock" label="库存"></el-table-column>
          <el-table-column prop label="上架时间">
            <template slot-scope="scope">{{scope.row.onSaleTime | dateFormat}}</template>
          </el-table-column>
          <el-table-column prop="msg" label="操作" width="350">
            <template slot-scope="scope">
              <el-button
                :type="scope.row.onSale ? 'info' : 'success'"
                size="mini"
                @click="handleChangeStatus(scope.row)"
              >{{scope.row.onSale ? '下' : '上'}}架</el-button>
              <el-button type="text">编辑</el-button>
              <el-button type="text" @click="dataClick(scope.row.id)">数据</el-button>
              <el-button type="text" @click="commentClick(scope.row)">写评价</el-button>
              <el-button type="text" @click="addSale(scope.row)">增加销量</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <el-dialog title :visible.sync="dataLayout" width="800">
          <el-table :data="tableData.skuVOS" border stripe style="width: 100%">
            <el-table-column prop="name" label="sku"></el-table-column>
            <el-table-column prop="totalSale" label="销量"></el-table-column>
            <el-table-column prop="stock" label="剩余库存"></el-table-column>
            <el-table-column label="收藏">{{tableData.storeProductCount}}</el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer footerBtn">
            <el-button type="primary" @click="dataConfirm">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <div>
        <el-dialog title="写评价" :visible.sync="commentLayout" width="30%">
          <el-form
            label-width="140px"
            size="mini"
            :model="comment"
            :rules="commentRules"
            ref="commentForm"
          >
            <el-form-item label="选择会员：" prop="vipId">
              <el-select
                v-model="comment.vipId"
                filterable
                remote
                reserve-keyword
                placeholder="请输入会员ID或昵称"
                :remote-method="selectVirtualVip"
                :loading="virtualVipLoading"
              >
                <el-option
                  v-for="item in virtualVipOptions"
                  :key="item.id"
                  :label="item.nick"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="评价星级：">
              <el-select v-model="comment.star" clearable placeholder="请选择评价星级">
                <el-option
                  v-for="item in starOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="评价内容：" prop="text">
              <el-input type="textarea" placeholder="请输入评价内容" rows="5" v-model="comment.text"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer footerBtn">
            <el-button @click="commentCancel">取 消</el-button>
            <el-button type="primary" @click="commentConfirm('commentForm')">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <div>
        <el-dialog title="增加销量" :visible.sync="addSaleLayout" width="30%">
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="grid-content">商品id</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">实际销量</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">增加虚拟销量</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">前端显示销量</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="grid-content">{{addSalelist.id}}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">{{addSalelist.totalSale}}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <el-input size="mini" v-model="addSalelist.virtualTotalSale" />
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">{{total}}</div>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer footerBtn">
            <el-button @click="addsCancel">取 消</el-button>
            <el-button type="primary" @click="addsConfirm">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <div class="alignEnd">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10,20, 40, 100, 200]"
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
  name: "List",
  data() {
    return {
      map: {
        brandId: "", //品牌id
        categoryId: "", //类目ID
        downVipPrice: "", //会员价-起始
        upVipPrice: "", //会员价-结束
        modelCode: "", //型号
        onSaleTimeStart: "", //上架起始时间-时间戳
        onSaleTimeEnd: "", //上架结束时间-时间戳
        productId: "", //商品ID
        sortOrder: "DESC", //升降排序
        sortType: "TOTALSALE", //排序字段类型
        subTitle: "", //商品副标题模糊搜索
        tagId: "", //标签ID
        tagIds: "", //商品标签ID
        title: "", //商品标题模糊搜索
        virtualTotalSale: "", //虚拟销量
        stockval: "",
        saleval: "",
        dateval: "",
        onSale: 1,
      },
      page: {
        pageNo: 1, //当前页数
        pageSize: 10, //每页显示多少条
        totalSize: 0, //总共多少条
      },
      currentPage1: 1,
      currentPage2: 1,
      currentPage3: 1,
      activeName: "first",
      categorys: [],
      brands: [],
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
      salesort: [
        {
          label: "销量由高到低",
          val: "TOTALSALE-DESC",
        },
        {
          label: "销量由低到高",
          val: "TOTALSALE-ASC",
        },
      ],
      stocksort: [
        {
          label: "库存由高到低",
          val: "STOCK-DESC",
        },
        {
          label: "库存由低到高",
          val: "STOCK-ASC",
        },
      ],
      datesort: [
        {
          label: "上架时间由近到远",
          val: "ONSALETIME-DESC",
        },
        {
          label: "上架时间由远到近",
          val: "ONSALETIME-ASC",
        },
      ],
      setime: [],
      productList: [],
      loading: false,
      multipleSelection: [],
      addSaleLayout: false, //增加销量弹层
      commentLayout: false, //评论弹层
      dataLayout: false, //数据弹层
      dataLoading: false,
      tableData: [], //表格数据
      comment: {
        pics: "",
        productId: "",
        skuId: "",
        star: 5,
        status: "",
        text: "",
        vipId: "",
      },
      virtualVip: {
        //虚拟会员分页查询入参
        nick: "",
        pageNo: 1,
        pageSize: 50,
      },
      virtualVipOptions: [],
      virtualVipLoading: false,
      list: [],
      starOptions: [
        {
          value: 1,
          label: "1星",
        },
        {
          value: 2,
          label: "2星",
        },
        {
          value: 3,
          label: "3星",
        },
        {
          value: 4,
          label: "4星",
        },
        {
          value: 5,
          label: "5星",
        },
      ],
      commentRules: {
        vipId: [
          { required: true, message: "请输入会员ID或昵称", trigger: "change" },
        ],
        text: [{ required: true, message: "请输入评价内容", trigger: "blur" }],
      },
      sale: {
        ids: "",
        onSale: 0,
      },
      tabselect: 1,
      addSalelist: {},
    };
  },
  computed: {
    total() {
      return (
        parseInt(this.addSalelist.virtualTotalSale) + this.addSalelist.totalSale
      );
    },
  },
  mounted() {
    this.getCategoryQuery();
    this.getBrandQuery();
    this.getProductQuery();
  },
  methods: {
    //数据点击事件
    dataClick(id){
      const self = this
      self.dataLayout = true
      const url = App.productDetail
      const args = {
        id: id
      }
      api.GET(url,args).then(res => {
        if(res.code === 0){
          self.tableData = res.data
          console.log(res)
        }
        self.dataLoading = false
      }).catch(err => {
        self.$message.error(err.msg || '系统报错！')
        self.dataLoading = false
      })
    },
    //数据确认点击事件
    dataConfirm() {
      this.dataLayout = false;
    },
    //选择会员下拉列表
    selectVirtualVip(query) {
      this.getVirtualVip(query);
    },
    //获取虚拟会员分页查询数据
    getVirtualVip(query) {
      const self = this;
      const url = App.virtualVip;
      const args = {
        nick: query,
        pageNo: 1,
        pageSize: 50,
      };
      api
        .GET(url, args)
        .then((res) => {
          if (res.code === 0) {
            self.virtualVipOptions = res.data.pageData;
          }
        })
        .catch((err) => {
          self.$message.error(err.msg || "系统报错！");
        });
    },
    //写评价点击事件
    commentClick(item) {
      const self = this;
      self.commentLayout = true;
      self.comment.productId = item.id;
    },
    //写评价确认点击事件
    commentConfirm(commentForm) {
      const self = this;
      const url = App.evaluateCreate;
      const args = self.comment;
      self.$refs[commentForm].validate((val) => {
        if (val) {
          api
            .POST(url, args)
            .then((res) => {
              if (res.code === 0) {
                self.$message.success("评价成功");
                self.commentLayout = false;
              }
            })
            .catch((err) => {
              self.$message.error(err.msg || "系统报错！");
            });
        }
      });
    },
    //写评价取消点击事件
    commentCancel() {
      this.commentLayout = false;
    },
    //增加销量点击事件
    addSale(item) {
      const self = this;
      self.addSaleLayout = true;
      item.virtualTotalSale = item.virtualTotalSale ? item.virtualTotalSale : 0;
      self.addSalelist = item;
    },
    //增加销量确认点击事件
    addsConfirm() {
      this.getVirtualTotalSale();
    },
    //增加销量取消点击事件
    addsCancel() {
      this.addSaleLayout = false;
    },
    //商品增加虚拟销量
    getVirtualTotalSale() {
      const self = this;
      const url = App.virtualTotalSale;
      const args = {
        id: self.addSalelist.id,
        virtualTotalSale: self.addSalelist.virtualTotalSale,
      };
      api
        .POST(url, args)
        .then((res) => {
          self.$message.success("增加虚拟销量成功");
          self.addSaleLayout = false;
          self.getProductQuery();
        })
        .catch((err) => {
          self.$message.error(err.msg || "系统报错！");
        });
    },
    //修改每页显示条数
    handleSizeChange(val) {
      const self = this;
      self.page.pageSize = val;
      self.getProductQuery();
    },
    //改变当前页数
    handleCurrentChange(val) {
      const self = this;
      self.page.pageNo = val;
      self.getProductQuery();
    },
    //上架中点击事件
    upper() {
      const self = this;
      self.map={
         brandId: "", //品牌id
        categoryId: "", //类目ID
        downVipPrice: "", //会员价-起始
        upVipPrice: "", //会员价-结束
        modelCode: "", //型号
        onSaleTimeStart: "", //上架起始时间-时间戳
        onSaleTimeEnd: "", //上架结束时间-时间戳
        productId: "", //商品ID
        sortOrder: "DESC", //升降排序
        sortType: "TOTALSALE", //排序字段类型
        subTitle: "", //商品副标题模糊搜索
        tagId: "", //标签ID
        tagIds: "", //商品标签ID
        title: "", //商品标题模糊搜索
        virtualTotalSale: "", //虚拟销量
        stockval: "",
        saleval: "",
        dateval: "",
        onSale:1,
      }
      self.page.pageNo = 1;
      self.tabselect = 1;
      self.getProductQuery();
    },
    //下架中点击事件
    down() {
      const self = this;
      self.map = {
         brandId: "", //品牌id
        categoryId: "", //类目ID
        downVipPrice: "", //会员价-起始
        upVipPrice: "", //会员价-结束
        modelCode: "", //型号
        onSaleTimeStart: "", //上架起始时间-时间戳
        onSaleTimeEnd: "", //上架结束时间-时间戳
        productId: "", //商品ID
        sortOrder: "DESC", //升降排序
        sortType: "TOTALSALE", //排序字段类型
        subTitle: "", //商品副标题模糊搜索
        tagId: "", //标签ID
        tagIds: "", //商品标签ID
        title: "", //商品标题模糊搜索
        virtualTotalSale: "", //虚拟销量
        stockval: "",
        saleval: "",
        dateval: "",
        onSale: 0,
      }
      self.page.pageNo = 1;
      self.tabselect = 2;
      self.getProductQuery();
    },
    //上下架点击事件
    handleChangeStatus(row) {
      this.$addsconfirm(`确定要${row.onSale ? "下" : "上"}架此商品吗?`, {
        addsconfirmButtonText: "确定",
        addsCancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.getProductOnSale(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //商品上下架
    getProductOnSale(item) {
      const self = this;
      const url = App.productOnSale;
      const args = {
        ids: item.id,
        onSale: item.onSale ? 0 : 1,
      };
      api
        .POST(url, args)
        .then((res) => {
          self.getProductQuery();
        })
        .catch((err) => {
          self.$message.error(err.msg || "系统报错！");
        });
    },
    //获取商品分页查询数据
    getProductQuery() {
      const self = this;
      const url = App.productQuery;
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
            self.productList = res.data.pageData;
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
    //获取类目查询数据
    getCategoryQuery() {
      const self = this;
      const url = App.categoryQuery;
      const args = {
        pageNo: 1,
        pageSize: 10,
      };
      api
        .GET(url, args)
        .then((res) => {
          if (res.code === 0) {
            self.categorys = res.data;
          }
        })
        .catch((err) => {
          self.$message.error(err.res || "系统报错！");
        });
    },
    //获取品牌查询数据
    getBrandQuery() {
      const self = this;
      const url = App.brandQuery;
      const args = {
        pageNo: 1,
        pageSize: 10,
      };
      api
        .GET(url, args)
        .then((res) => {
          if (res.code === 0) {
            self.brands = res.data;
          }
        })
        .catch((err) => {
          self.$message.error(err.msg || "系统报错！");
        });
    },
    //操作下拉列表事件
    sortchange(e) {
      console.log("e=" + e);
      const self = this;
      if (e) {
        const type = e.split("-")[0];
        console.log("type=" + type);
        if (type == "TOTALSALE") {
          //如果type等于销量排序
          self.map.stockval = ""; //库存排序为空
          self.map.dateval = ""; //时间排序为空
        } else if (type == "STOCK") {
          self.map.saleval = "";
          self.map.dateval = "";
        } else {
          self.map.saleval = "";
          self.map.stockval = "";
        }
        self.map.sortType = type;
        self.map.sortOrder = e.split("-")[1];
      } else {
        self.map.sortType = "";
        self.map.sortOrder = "";
      }
    },
    //查询点击事件
    handleCheck() {
      if (this.setime && this.setime.length == 2) {
        //判断这个时间数组是否存在并且时间数组的长度等于2
        this.map.onSaleTimeStart = new Date(this.setime[0]).getTime(); //把时间数组的第一个值赋给入参的开始时间
        this.map.onSaleTimeEnd = new Date(this.setime[1]).getTime(); //把时间数组的第二个值赋给入参的结束时间
      } else {
        this.map.onSaleTimeStart = "";
        this.map.onSaleTimeEnd = "";
      }
      this.page.pageNo = 1;
      this.getProductQuery();
    },
    //重置点击事件
    handleReset() {
      this.map = {
        brandId: "", //品牌id
        categoryId: "", //类目ID
        downVipPrice: "", //会员价-起始
        upVipPrice: "", //会员价-结束
        modelCode: "", //型号
        onSaleTimeStart: "", //上架起始时间-时间戳
        onSaleTimeEnd: "", //上架结束时间-时间戳
        productId: "", //商品ID
        sortOrder: "DESC", //升降排序
        sortType: "TOTALSALE", //排序字段类型
        subTitle: "", //商品副标题模糊搜索
        tagId: "", //标签ID
        tagIds: "", //商品标签ID
        title: "", //商品标题模糊搜索
        virtualTotalSale: "", //虚拟销量
        stockval: "",
        saleval: "",
        dateval: "",
        onSale: this.map.onSale,
      };
      this.setime = [];
      this.page.pageNo = 1;
      this.getProductQuery();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>
<style lang='scss' scoped>
.goods .el-form .el-input {
  width: 160px !important;
}
.flex-wrap {
  text-align: left;
  align-items: center;
}
.img {
  flex: 0 0 60px;
  height: 60px;
  margin-right: 20px;
}
.skuview {
  border: 1px solid #ccc;
  padding: 0 10px;
  margin: 7px 10px 0 0;
  display: inline-block;
}
.el-button--success {
  color: #fff;
  background-color: #67c23a;
  border-color: #67c23a;
}
.el-button--info {
  color: #fff;
  background-color: #909399;
  border-color: #909399;
}
.active {
  color: #3a8ee6;
  border-color: #3a8ee6;
  background-color: #ecf5ff;
  outline: 0;
}
.tab:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

.grid-content {
  min-height: 36px;
  line-height: 28px;
}
.footerBtn {
  display: block;
  text-align: center !important;
}
</style>