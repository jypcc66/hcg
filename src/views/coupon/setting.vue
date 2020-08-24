<template>
  <div class="pad20" v-loading="allLoading">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="新VIP专享优惠券" name="1">
        <div class="addBox">
          <el-select
            v-model="selectCoupon1"
            filterable
            remote
            reserve-keyword
            placeholder="请搜索并选择优惠券"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in selectCouponOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-input class="w100" v-model="num" style="text-align: center;"></el-input>张
          <el-button>添加</el-button>
        </div>
        <div>
          <el-table :data="couponList" border stripe style="width: 975px">
            <el-table-column prop="name" label="优惠券名称"></el-table-column>
            <el-table-column prop="num" label="数量" width="150"></el-table-column>
            <el-table-column prop="msg" label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="text">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="btns">
          <el-button>取消</el-button>
          <el-button type="primary">确定</el-button>
        </div>
      </el-collapse-item>
      <el-collapse-item title="新VIP专享优惠券 + 老带新 - 新VIP获得优惠券" name="2">
        <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
        <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
        <div class="btns">
          <el-button>取消</el-button>
          <el-button type="primary">确定</el-button>
        </div>
      </el-collapse-item>
      <el-collapse-item title="老带新 - 老VIP获得优惠券" name="3">
        <div>简化流程：设计简洁直观的操作流程；</div>
        <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
        <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
        <div class="btns">
          <el-button>取消</el-button>
          <el-button type="primary">确定</el-button>
        </div>
      </el-collapse-item>
      <el-collapse-item title="VIP续费奖励" name="4">
        <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
        <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
        <div class="btns">
          <el-button>取消</el-button>
          <el-button type="primary">确定</el-button>
        </div>
      </el-collapse-item>
      <el-collapse-item title="分享券" name="5">
        <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
        <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
        <div class="btns">
          <el-button>取消</el-button>
          <el-button type="primary">确定</el-button>
        </div>
      </el-collapse-item>
      <el-collapse-item title="指定用户券" name="6">
        <div>
          <el-select v-model="selectCoupon6" clearable>
            <el-option
              v-for="item in selectCoupon6Options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="addBox">
          <el-select
            v-model="selectCoupon1"
            filterable
            remote
            reserve-keyword
            placeholder="请搜索并选择优惠券"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in selectCouponOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-input class="w100" v-model="num" style="text-align: center;"></el-input>张
          <el-button>添加</el-button>
        </div>
        <div>
          <el-table :data="couponList" border stripe style="width: 975px">
            <el-table-column prop="name" label="优惠券名称"></el-table-column>
            <el-table-column prop="num" label="数量" width="150"></el-table-column>
            <el-table-column prop="msg" label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="text">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="btns">
          <el-button>取消</el-button>
          <el-button type="primary">确定</el-button>
        </div>
      </el-collapse-item>
      <el-collapse-item title="生日券" name="7">
        <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
        <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
        <div class="btns">
          <el-button>取消</el-button>
          <el-button type="primary">确定</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
export default {
  name: "Setting",
  data() {
    return {
      allLoading: false,
      activeNames: ["1", "2", "3", "4", "5", "6", "7"],
      selectCoupon1: null,
      selectCoupon2: null,
      selectCoupon3: null,
      selectCoupon4: null,
      selectCoupon5: null,
      selectCoupon6: null,
      selectCoupon7: null,
      selectCouponOptions: [],
      loading: false,
      num: 1,
      couponList: [
        {
          name: "jyp",
          num: 20,
        },
      ],
    };
  },
  methods: {
    remoteMethod() {},
  },
};
</script>
<style lang="scss">
.el-collapse-item__header {
  background: #efefef;
  padding: 0 15px;
}
.el-collapse-item__content {
  padding: 20px 30px;
}
.addBox {
  padding-bottom: 20px;
}
.addBox .w100 {
  width: 100px;
  margin: 0 5px 0 10px;
}
.addBox .el-input__inner {
  text-align: center;
}
.addBox .el-button {
  margin-left: 10px;
}
.btns {
  margin-top: 15px;
}
.btns .el-button {
  width: 130px;
}
</style>