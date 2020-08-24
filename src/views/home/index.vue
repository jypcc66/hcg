<template>
  <div id="app">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :show-timeout="200"
        :default-active="$route.path"
        mode="vertical"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <div id="nav">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#2b333f"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>会员</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-1" @click="link('/user')">会员列表</el-menu-item>
                <el-menu-item index="1-2" @click="link('/user/virtualList')">虚拟会员列表</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>商品</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-1" @click="link('/goods')">商品列表</el-menu-item>
                <el-menu-item index="1-2" @click="link('/goods/evaluationList')">商品评价</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>订单</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-1" @click="link('/order/list')">订单列表</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>仓库</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-1" @click="link('/warehouse')">仓库管理</el-menu-item>
                <el-menu-item index="1-2" @click="link('/warehouse/warehousing')">入库管理</el-menu-item>
                <el-menu-item index="1-3" @click="link('/warehouse/warehousingLocation')">库存管理</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>优惠券</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-1" @click="link('/couponlist')">优惠券列表</el-menu-item>
                <el-menu-item index="1-2" @click="link('/couponList/add')">新建优惠券</el-menu-item>
                <el-menu-item index="1-2" @click="link('/couponList/setting')">推送优惠券配置</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="6">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>跨境</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-1" @click="link('/cross/product')">商品备案</el-menu-item>
                <el-menu-item index="1-2" @click="link('/cross/order')">订单申报</el-menu-item>
                <el-menu-item index="1-3" @click="link('/cross/table')">商品列表-表格</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </div>
      </el-menu>
    </el-scrollbar>

    <div id="containerBox">
      <router-view />
    </div>
  </div>
</template>
<script>
export default {
  name: "Home",
  methods: {
    link(url) {
      this.$router.push({ path: url });
    },
  },
};
</script>
<style lang="scss">
  .scrollbar-wrapper {
      overflow-x: hidden !important;

      .el-scrollbar__view {
        height: 100%;
      }
    }

    .el-scrollbar__bar.is-vertical {
      right: 0px;
    }
</style>