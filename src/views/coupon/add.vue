<template>
  <div class="pad20">
    <el-form label-width="140px" :model="map" ref="addsForm" :rules="addsRules">
      <el-form-item label="优惠券类型：" prop="type">
        <el-select v-model="map.type" clearable placeholder="请选择优惠券类型" :disabled="isEdit">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="获取途径：" prop="getType">
        <el-select v-model="map.getType" clearable placeholder="请选择获取途径" :disabled="isEdit">
          <el-option
            v-for="item in getTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优惠券名称：" prop="name">
        <el-input placeholder="请输入优惠券名称" v-model="map.name"></el-input>
      </el-form-item>
      <el-form-item label="使用时间范围：" prop="expiredTimeType">
        <el-select v-model="map.expiredTimeType" clearable placeholder="请选择使用时间范围">
          <el-option
            v-for="item in expiredTimeTypeOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="settime" v-if="map.expiredTimeType == 1">
        <el-date-picker
          v-model="map.settime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        ></el-date-picker>
      </el-form-item>
      <el-form-item v-if="map.expiredTimeType == 2">
        <div class="validity">
          <span>领取后</span>
          <el-input type="text" v-model="day"></el-input>天
          <el-input type="text" v-model="hour"></el-input>小时内有效
        </div>
      </el-form-item>
      <el-form-item label="满：" prop="limitAmt">
        <el-input placeholder="请输入满减门槛金额" v-model="map.limitAmt" :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="减：" prop="amount">
        <el-input placeholder="请输入满减金额" v-model="map.amount" :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="发放数量" prop="maxNum">
        <el-input placeholder="请输入发放数量" v-model="map.maxNum"></el-input>
      </el-form-item>
      <el-form-item label="使用说明：" prop="dsc">
        <el-input
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 8}"
          placeholder="请输入使用说明 （#符号代表在小程序换行显示）"
          v-model="map.dsc"
        ></el-input>
      </el-form-item>
      <el-form-item label="使用说明：" prop="useType">
        <el-radio-group v-model="map.useType" :disabled="isEdit && canClick == 0">
          <el-radio-button :label="0">全场通用</el-radio-button>
          <el-radio-button :label="2">指定商品</el-radio-button>
          <el-radio-button :label="1">指定分类</el-radio-button>
          <el-radio-button :label="3">指定品牌</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <div v-if="map.useType == 2">
        <el-form-item>
          <el-select
            v-model="selectProduct"
            filterable
            remote
            reserve-keyword
            placeholder="请输入商品名称/商品编码"
            :remote-method="getProductQuery"
            :loading="productLoading"
          >
            <el-option
              v-for="(item,index) in productOptions"
              :key="item.value"
              :label="item.title"
              :value="index"
            >
              <span style="float:left">{{item.title}}</span>
              <span
                style="float:right; color:#8492a6; padding-left:15px; font-size:13px;"
              >{{item.code}}</span>
            </el-option>
          </el-select>
          <el-button style="margin-left:5px;" @click="addClick(2)">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-table :data="productList" border stripe style="width: 780px;">
            <el-table-column prop="title" label="商品名称"></el-table-column>
            <el-table-column prop="code" label="商品编码" width="180"></el-table-column>
            <el-table-column prop="msg" label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="text" @click="deleteClick(scope.$index,scope.row,2)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </div>
      <div v-if="map.useType == 1">
        <el-form-item>
          <el-select
            v-model="selectCategory"
            filterable
            remote
            reserve-keyword
            placeholder="请输入二级分类"
            :remote-method="getCategoryQuery"
            :loading="categoryLoading"
          >
            <el-option
              v-for="(item,index) in categoryOptions"
              :key="item.value"
              :label="item.name"
              :value="index"
            ></el-option>
          </el-select>
          <el-button style="margin-left:5px;" @click="addClick(1)">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-table :data="categoryList" border stripe style="width: 780px;">
            <el-table-column prop="name" label="分类名称"></el-table-column>
            <el-table-column prop="msg" label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="text" @click="deleteClick(scope.$index,scope.row,1)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </div>
      <div v-if="map.useType == 3">
        <el-form-item>
          <el-select
            v-model="selectBrand"
            filterable
            remote
            reserve-keyword
            placeholder="请输入品牌"
            :remote-method="getBrandQuery"
            :loading="brandLoading"
          >
            <el-option
              v-for="(item,index) in brandOptions"
              :key="item.value"
              :label="item.name"
              :value="index"
            ></el-option>
          </el-select>
          <el-button style="margin-left:5px;" @click="addClick(3)">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-table :data="brandList" border stripe style="width: 780px;">
            <el-table-column prop="name" label="品牌名称"></el-table-column>
            <el-table-column prop="msg" label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="text" @click="deleteClick(scope.$index,scope.row,3)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button>取消</el-button>
        <el-button type="primary" @click="submitForm('addsForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import api from "../../api/axios";
import App from "../../api/index";
export default {
  name: "Add",
  data() {
    var validDate = (rule, value, callback) => {
      if (!value[0] || !value[1]) {
        callback(new Error("请选择时间"));
      } else {
        callback();
      }
    };
    return {
      canClick: null,
      isEdit: false,
      map: {
        type: 1,
        getType: 0,
        name: "",
        settime: [],
        limitAmt: "",
        amount: "",
        maxNum: "",
        dsc: "",
        useType: 0,
        expiredTimeType: "", //使用时间范围
      },
      expiredTimeTypeOption: [
        {
          value: 1,
          label: "固定时间",
        },
        {
          value: 2,
          label: "领取后多长时间过期",
        },
      ],
      day: "",
      hour: "",
      selectProduct: null, //选择商品
      productOptions: [],
      productLoading: false,
      productPage: {
        pageNo: 1,
        pageSize: 50,
      },
      productList: [],
      selectCategory: null, //指定分类
      categoryOptions: [],
      categoryLoading: false,
      categoryList: [],
      selectBrand: null, //指定品牌
      brandOptions: [],
      brandLoading: false,
      brandList: [],
      typeOptions: [
        {
          value: 1,
          label: "满减",
        },
        {
          value: 2,
          label: "代金",
        },
      ],
      getTypeOptions: [
        {
          value: 0,
          label: "普通",
        },
        {
          value: 1,
          label: "新人",
        },
        {
          value: 2,
          label: "老带新",
        },
        {
          value: 3,
          label: "分享",
        },
        {
          value: 4,
          label: "续费",
        },
        {
          value: 5,
          label: "直播",
        },
        {
          value: 6,
          label: "分销分享",
        },
        {
          value: 7,
          label: "指定用户",
        },
        {
          value: 8,
          label: "生日",
        },
      ],
      addsRules: {
        type: [
          { required: true, message: "请选择优惠券类型", trigger: "change" },
        ],
        getType: [
          { required: true, message: "请选择获取途径", trigger: "change" },
        ],
        name: [
          { required: true, message: "请输入优惠券名称", trigger: "blur" },
        ],
        expiredTimeType: [
          { required: true, message: "请选择使用时间范围", trigger: "change" },
        ],
        settime: [
          {
            validator: validDate,
            required: true,
            message: "请选择使用时间范围",
            trigger: "blur",
          },
        ],
        limitAmt: [
          { required: true, message: "请输入满减门槛金额", trigger: "blur" },
        ],
        amount: [
          { required: true, message: "请输入满减金额", trigger: "blur" },
        ],
        maxNum: [
          { required: true, message: "请输入发放数量", trigger: "blur" },
        ],
        dsc: [{ required: true, message: "请输入使用说明", trigger: "blur" }],
        useType: [{ required: true }],
      },
    };
  },
  mounted() {
    const self = this;
    self.id = this.$route.query.id;
    if (self.id) {
      self.isEdit = true;
      this.getCouponRule();
    }
  },
  methods: {
    submitForm(addsForm) {
      const self = this;
      self.$refs[addsForm].validate((vaild) => {
        if (vaild) {
          const {
            amount, //优惠券金额
            dsc, //使用说明
            expiredTimeType,
            getType,
            limitAmt, //门槛金额
            maxNum, //发布数量
            name, //优惠券名称
            settime,
            type, //优惠券类型
            useType,
          } = self.map;
          const { productList, categoryList, brandList } = self;
          const productId = productList.map((item) => item.id);
          const categoryId = categoryList.map((item) => item.id);
          const brandId = brandList.map((item) => item.id);
          const params = {
            amount: Number(amount), //优惠券金额
            dsc: dsc ? encodeURIComponent(dsc) : "", //使用说明
            limitAmt: Number(limitAmt), //门槛金额
            maxNum: Number(maxNum), //发布数量
            name, //优惠券名称
            type, //优惠券类型
            getType,
            useType,
            expiredTimeType,
          };
          if (params.expiredTimeType == 1) {
            params.startTime = new Date(settime[0]).getTime();
            params.endTime = new Date(settime[1]).getTime();
          } else {
            params.startTime = null;
            params.endTime = null;
            params.getExpireTime =
              parseInt(self.day) * 24 + parseInt(self.hour);
          }
          params.useType = useType;
          if (params.useType == 2) {
            //指定商品
            if (productList.length) {
              params.idList = productId;
            } else {
              self.$message({
                message: "请选择商品",
                type: "warning",
              });
              return;
            }
          } else if (params.useType == 1) {
            //指定分类
            if (categoryList.length) {
              params.idList = categoryId;
            } else {
              self.$message({
                message: "请选择二级分类",
                type: "warning",
              });
              return;
            }
          } else if (params.useType == 3) {
            //指定品牌
            if (brandList.length) {
              params.idList = brandId;
            } else {
              self.$message({
                message: "请选择品牌",
                type: "warning",
              });
              return;
            }
          }

          if (self.isEdit) {
            const url = App.updateCouponRule;
            api
              .POST(url, params)
              .then((res) => {
                self.$message.success("编辑优惠券成功！");
                self.$router.push({ path: "/couponlist" });
              })
              .catch((err) => {
                self.$message.error(err.msg || "系统报错！");
              });
          } else {
            const url = App.createCouponRule;
            api
              .POST(url, params)
              .then((res) => {
                self.$message.success("创建优惠券成功！");
                self.$router.push({ path: "/couponlist" });
              })
              .catch((err) => {
                self.$message.error(err.msg || "系统报错！");
              });
          }

          /*if (!params.settime) {
            self.$message.error("请选择使用时间范围");
            return false;
          }
          */
        }
      });
    },
    //优惠券编辑页面
    getCouponRule() {
      const self = this;
      const url = `/coupon/couponRule/${self.id}`;
      api.GET(url).then((res) => {
        if (res.code === 0) {
          this.map = {
            amount: res.data.amount,
            dsc: decodeURIComponent(res.data.dsc),
            limitAmt: res.data.limitAmt,
            maxNum: res.data.maxNum,
            name: res.data.name,
            settime: [res.data.startTime, res.data.endTime],
            type: res.data.type,
            getType: res.data.getType,
            useType: res.data.useType,
            expiredTimeType: res.data.expiredTimeType,
          };
          if (res.data.expiredTimeType == 2) {
            this.day = parseInt(res.data.getExpireTime / 24);
            this.hour = res.data.getExpireTime % 24;
          }
          this.canClick = res.data.useType;
          if (res.data.ruleProducts) {
            this.productList = res.data.ruleProducts.map((item) => {
              item.title = item.productName;
              return item;
            });
          }
          if (res.data.ruleCategory) {
            this.categoryList = res.data.ruleCategory.map((item) => {
              item.name = item.categoryName;
              item.id = item.categoryId;
              return item;
            });
          }
          if (res.data.ruleBrands) {
            this.brandList = res.data.ruleBrands.map((item) => {
              item.name = item.brandName;
              item.id = item.brandId;
              return item;
            });
          }
        }
      });
    },
    //商品分页查询
    getProductQuery(query) {
      const self = this;
      const url = App.productQuery;
      const args = {
        title: query,
        pageNo: self.productPage.pageNo,
        pageSize: self.productPage.pageSize,
      };
      self.productLoading = true;
      api
        .GET(url, args)
        .then((res) => {
          if (res.code == 0) {
            self.productOptions = res.data.pageData;
            self.productLoading = false;
          }
        })
        .catch((err) => {
          self.$message.error(err.msg || "系统报错！");
        });
    },
    //类目查询
    getCategoryQuery(query) {
      const self = this;
      const url = App.categoryQuery;
      const args = {
        name: query,
      };
      self.categoryLoading = true;
      api
        .GET(url, args)
        .then((res) => {
          if (res.code == 0) {
            self.categoryOptions = res.data;
            self.categoryLoading = false;
          }
        })
        .catch((err) => {
          self.$message.error(err.msg || "系统报错！");
          self.categoryLoading = false;
        });
    },
    //品牌查询
    getBrandQuery(query) {
      const self = this;
      const url = App.brandQuery;
      const args = {
        keyWords: query,
      };
      self.brandLoading = true;
      api
        .GET(url, args)
        .then((res) => {
          if (res.code == 0) {
            self.brandOptions = res.data;
            self.brandLoading = false;
          }
        })
        .catch((err) => {
          self.$message.error(err.msg || "系统报错！");
          self.brandLoading = false;
        });
    },
    //添加点击事件
    addClick(type) {
      const self = this;
      if (type == 2) {
        if (self.selectProduct === null) {
          self.$message({
            message: "请选择指定商品",
            type: "warning",
          });
          return;
        }
        const productIndex = self.productOptions[self.selectProduct];
        for (let i = 0; i < self.productList.length; i++) {
          if (productIndex.id === self.productList[i].id) {
            self.$message({
              message: "请勿重复选择商品",
              type: "warning",
            });
            return;
          }
        }
        self.productList.push(productIndex);
        self.selectProduct = null;
      } else if (type == 1) {
        if (self.selectCategory === null) {
          self.$message({
            message: "请选择二级分类",
            type: "warning",
          });
          return;
        }
        const categoryIndex = self.categoryOptions[self.selectCategory];
        for (let a = 0; a < self.categoryList.length; a++) {
          if (categoryIndex.id === self.categoryList[a].id) {
            self.$message({
              message: "请勿重复选择分类",
              type: "warning",
            });
            return;
          }
        }
        self.categoryList.push(categoryIndex);
        self.selectCategory = null;
      } else if (type == 3) {
        if (self.selectBrand === null) {
          self.$message({
            message: "请选择品牌",
            type: "warning",
          });
          return;
        }

        const brandIndex = self.brandOptions[self.selectBrand];
        for (let i = 0; i < self.brandList.length; i++) {
          if (brandIndex.id === self.brandList[i].id) {
            self.$message({
              message: "请勿重复选择品牌",
              type: "warning",
            });
            return;
          }
        }
        self.brandList.push(brandIndex);
        self.selectBrand = null;
      }
    },
    //删除点击事件
    deleteClick(index, row, type) {
      const self = this;
      if (type == 2) {
        self.productList.splice(index, 1);
      } else if (type == 1) {
        self.categoryList.splice(index, 1);
      } else if (type == 3) {
        self.brandList.splice(index, 1);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.el-form .validity .el-input {
  width: 50px;
  margin: 0 5px;
}
</style>