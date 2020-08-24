<template>
  <div class="pad20">
    <el-form v-if="detail" :model="detail" label-width="150px">
      <div>
        <el-form-item label="审核状态：">
          <template>
            <span v-if="detail.apprRtn == 1">审核通过</span>
            <span v-else-if="detail.apprRtn == 2">审核不通过</span>
            <span v-else-if="detail.apprRtn == 3">审核中</span>
          </template>
        </el-form-item>
        <div class="flex-wrap">
          <div class="flex-flow">
            <el-form-item label="审核意见：">{{detail.apprAdvice}}</el-form-item>
          </div>
          <div class="flex-flow">
            <el-form-item label="审核人：">{{detail.aprrMan}}</el-form-item>
          </div>
          <div class="flex-flow">
            <el-form-item label="审核时间：">{{detail.apprTime | dateFormat}}</el-form-item>
          </div>
        </div>
        <div class="flex-wrap">
          <div class="flex-flow">
            <el-form-item label="流水号：">{{detail.serialNumber}}</el-form-item>
          </div>
          <div class="flex-flow">
            <el-form-item label="提交时间：">{{detail.commitTime | dateFormat}}</el-form-item>
          </div>
          <div class="flex-flow">
            <el-form-item label="企业代码：">{{detail.coCode}}</el-form-item>
          </div>
        </div>
        <div class="flex-wrap">
          <div class="flex-flow">
            <el-form-item label="组织机构代码：">{{detail.orgCode}}</el-form-item>
          </div>
          <div class="flex-flow">
            <el-form-item label="审核报文类型：">{{detail.apprType}}</el-form-item>
          </div>
          <div class="flex-flow">
            <el-form-item label="企业备案编号：">{{detail.tradeCode}}</el-form-item>
          </div>
        </div>
      </div>
      <div class="title">商品信息</div>
      <div class="w1000">
        <el-form-item label="商品类型：">
          <template>
            <span v-if="detail.spt1 == 1">保税</span>
            <span v-else-if="detail.spt1 == 0">直邮</span>
          </template>
        </el-form-item>
        <el-form-item label="* 电商商品编号：">{{detail.cargo.codeId}}</el-form-item>
        <div class="flex-wrap">
          <div class="flex-flow">
            <el-form-item label="* 商品归类码：">{{detail.cargo.codeTs}}</el-form-item>
          </div>
          <div class="flex-flow">
            <el-form-item label="* HS-CODE：">{{detail.cargo.hsCode}}</el-form-item>
          </div>
        </div>
        <el-form-item label="* 商品物资ID：">{{detail.cargo.materialID}}</el-form-item>
        <el-form-item label="* 商品内部货号：">{{detail.cargo.copgNo}}</el-form-item>
        <el-form-item label="* 商品中文名：">{{detail.cargo.nameCh}}</el-form-item>
        <el-form-item label="* 商品外文名：">{{detail.cargo.nameEn}}</el-form-item>
        <el-form-item label="* 商品描述：">{{detail.cargo.goodsNote}}</el-form-item>
        <el-form-item label="* 商品产地："></el-form-item>
        <el-form-item label="* 适用标准国别："></el-form-item>
        <el-form-item label="* 商品成份："></el-form-item>
        <el-form-item label="* 商品型号：">{{detail.cargo.cargoModel}}</el-form-item>
        <el-form-item label="* 商品规格：">{{detail.cargo.cargoSpec}}</el-form-item>
        <el-form-item label="* 供应商：" prop>{{detail.cargo.supplier}}</el-form-item>
        <el-form-item label="* 首次进口区域：" prop="cargo.busRegion"></el-form-item>
      </div>
      <div class="title">非必填信息</div>
      <div class="w1000">
        <div>
          <el-form-item label="商品其它名">
            {{detail.cargo.nameOther}}
          </el-form-item>
          <div class="flex-wrap">
            <div class="flex-flow">
              <el-form-item label="备案单价">
                {{detail.cargo.price}}
              </el-form-item>
            </div>
            <div class="flex-flow">
              <el-form-item label="商品数量">
                {{detail.cargo.cargoNum}}
              </el-form-item>
            </div>
          </div>
          <div class="flex-wrap">
            <div class="flex-flow">
              <el-form-item label="商品单位">
                {{detail.cargo.cargoUnit}}
              </el-form-item>
            </div>
            <div class="flex-flow">
              <el-form-item label="商品备案编号">
                {{detail.cargo.cargoCrossId}}
              </el-form-item>
            </div>
          </div>
          <div class="flex-wrap">
            <div class="flex-flow">
              <el-form-item label="第一计量单位">
                {{detail.cargo.unit1}}
              </el-form-item>
            </div>
            <div class="flex-flow">
              <el-form-item label="第二计量单位">
                {{detail.cargo.unit2}}
              </el-form-item>
            </div>
          </div>
          <div class="flex-wrap">
            <div class="flex-flow">
              <el-form-item label="品牌编号">
                {{detail.cargo.brandId}}
              </el-form-item>
            </div>
            <div class="flex-flow">
              <el-form-item label="商品出厂日期">
                {{detail.cargo.cargoFactoryDate}}
              </el-form-item>
            </div>
          </div>
          <el-form-item label="限制类商品标志">
            {{detail.cargo.otherType}}
          </el-form-item>
          <el-form-item label="重点审价标记">
            {{detail.cargo.chkPrice}}
          </el-form-item>
          <el-form-item label="备注">
            {{detail.cargo.noteS}}
          </el-form-item>
          <el-form-item label="生产厂家">
            {{detail.cargo.producerName}}
          </el-form-item>
          <el-form-item label="商品功能">
            {{detail.cargo.cargoFunction}}
          </el-form-item>
          <el-form-item label="商品用途">
            {{detail.cargo.cargoPurpose}}
          </el-form-item>
          <div class="flex-wrap">
          <div class="flex-flow">
            <el-form-item label="转基因产品标识">
              <template>
                <span v-if="detail.cargo.transgenicFlag ==0">不是</span>
                <span v-else-if="detail.cargo.transgenicFlag ==1">是</span>
              </template>
            </el-form-item>
          </div>
          <div class="flex-flow">
            <el-form-item label="是否禁止进境物标识">
              <template>
                <span v-if="detail.cargo.forbidImportFlag == 0">不是</span>
                <span v-else-if="detail.cargo.forbidImportFlag == 1">是</span>
              </template>
            </el-form-item>
          </div>
        </div>
        <div class="flex-wrap">
          <div class="flex-flow">
            <el-form-item label="商品单位">
              <template>
                <span v-if="detail.cargo.flag1712 == 0">不是</span>
                <span v-else-if="detail.cargo.flag1712 == 1">是</span>
              </template>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="其他">
          {{detail.cargo.remark}}
        </el-form-item>
        <el-form-item label="3C编码">
          {{detail.spt2}}
        </el-form-item>
        <div class="flex-wrap">
          <div class="flex-flow">
            <el-form-item label="品牌中文名">
              {{detail.spt3}}
            </el-form-item>
          </div>
          <div class="flex-flow">
            <el-form-item label="品牌外文名">
              {{detail.spt4}}
            </el-form-item>
          </div>
        </div>
        <div class="flex-wrap">
          <div class="flex-flow">
            <el-form-item label="品牌评估报告">
              <template>
                <span v-if="detail.spt5 == 1">没有</span>
                <span v-else-if="detail.spt5 == 0">有</span>
              </template>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="第三方评估机构">
          {{detail.spt6}}
        </el-form-item>
        </div>
      </div>
    </el-form>
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
  name: "ProductDetail",
  data() {
    return {
      detail: "",
    };
  },
  mounted() {
    const self = this;
    self.id = self.$route.query.id;
    //调用海关商品详情
    if (self.id) {
      self.getCrossProductDetail();
    }
  },
  methods: {
    //获取海关商品详情数据
    getCrossProductDetail() {
      const self = this;
      const url = App.crossProductDetail + `?id=${self.id}`;
      api.GET(url).then((res) => {
        if (res.code === 0) {
          self.detail = res.data;
          console.log(self.detail);
        }
      }).catch(err => {
        self.$message.error(err.msg || '系统报错！')
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.title {
  height: 30px;
  line-height: 30px;
  margin-bottom: 20px;
  border-bottom: 1px solid #999;
}
.w1000 {
  width: 1000px;
}
</style>