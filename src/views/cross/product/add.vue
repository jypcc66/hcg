<template>
  <div class="pad20">
    <el-form label-width="150px" :model="map" ref="addForm" :rules="addRules">
      <div class="title">商品信息</div>
      <div>
        <el-form-item label="商品类型" prop="spt1">
          <template>
            <el-radio v-model="map.spt1" :label="1">保税</el-radio>
            <el-radio v-model="map.spt1" :label="0">直邮</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="电商商品编号" prop="cargo.codeId">
          <el-input placeholder="请输入电商商品编号" v-model="map.cargo.codeId" maxlength="44"></el-input>
        </el-form-item>
        <div class="flex-wrap">
          <div class="flex-flow">
            <el-form-item label="商品归类码" prop="cargo.codeTs">
              <el-input placeholder="请输入商品归类码" v-model="map.cargo.codeTs"></el-input>
            </el-form-item>
          </div>
          <div class="flex-flow">
            <el-form-item label="HS-CODE" prop="cargo.hsCode">
              <el-input placeholder="请输入HS-CODE" v-model="map.cargo.hsCode"></el-input>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="商品物资ID" prop="cargo.materialID">
          <el-input placeholder="请输入商品物资ID" v-model="map.cargo.materialID"></el-input>
        </el-form-item>
        <el-form-item label="商品内部货号" prop="cargo.copgNo">
          <el-input placeholder="请输入商品内部货号" v-model="map.cargo.copgNo"></el-input>
        </el-form-item>
        <el-form-item label="商品中文名" prop="cargo.nameCh">
          <el-input placeholder="请输入商品中文名" v-model="map.cargo.nameCh"></el-input>
        </el-form-item>
        <el-form-item label="商品外文名" prop="cargo.nameEn">
          <el-input placeholder="请输入商品外文名" v-model="map.cargo.nameEn"></el-input>
        </el-form-item>
        <el-form-item label="商品描述" prop="cargo.goodsNote">
          <el-input type="textarea" rows="5" placeholder="请输入商品描述" v-model="map.cargo.goodsNote"></el-input>
        </el-form-item>
        <el-form-item label="商品产地" prop="cargo.cargoPlace">
          <el-select v-model="map.cargo.cargoPlace" clearable placeholder="请选择商品产地">
            <el-option
              v-for="item in cargoPlaceOptions"
              :key="item.code1"
              :label="item.code1+'-'+item.name1"
              :value="item.code1"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用标准国别" prop="cargo.standardPlace">
          <el-select v-model="map.cargo.standardPlace" clearable placeholder="请选择适用标准国别">
            <el-option
              v-for="item in cargoPlaceOptions"
              :key="item.code1"
              :label="item.code1+'-'+item.name1"
              :value="item.code1"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品成份" prop="cargo.cargoIngredient">
          <el-input
            type="textarea"
            rows="5"
            placeholder="请输入商品成份"
            v-model="map.cargo.cargoIngredient"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品型号" prop="cargo.cargoModel">
          <el-input placeholder="请输入商品型号" v-model="map.cargo.cargoModel"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" prop="cargo.cargoSpec">
          <el-input placeholder="请输入商品规格" v-model="map.cargo.cargoSpec"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="cargo.supplier">
          <el-input placeholder="请输入供应商" v-model="map.cargo.supplier"></el-input>
        </el-form-item>
        <el-form-item label="首次进口区域" prop="cargo.busRegion">
          <el-select v-model="map.cargo.busRegion" clearable placeholder="请选择首次进口区域">
            <el-option
              v-for="item in JGlist"
              :key="item.code1"
              :label="item.code1+'-'+item.name1"
              :value="item.code1"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="title">非必填信息</div>
      <div>
        <el-form-item label="商品其它名">
          <el-input placeholder="请输入商品其它名" v-model="map.cargo.nameOther"></el-input>
        </el-form-item>
        <div class="flex-wrap">
          <div class="flex-flow">
            <el-form-item label="备案单价">
              <el-input placeholder="请输入备案单价" v-model="map.cargo.price"></el-input>
            </el-form-item>
          </div>
          <div class="flex-flow">
            <el-form-item label="商品数量">
              <el-input placeholder="请输入商品数量" v-model="map.cargo.cargoNum"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="flex-wrap">
          <div class="flex-flow">
            <el-form-item label="商品单位">
              <el-input placeholder="请输入商品单位" v-model="map.cargo.cargoUnit"></el-input>
            </el-form-item>
          </div>
          <div class="flex-flow">
            <el-form-item label="商品备案编号">
              <el-input placeholder="请输入商品备案编号" v-model="map.cargo.cargoCrossId"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="flex-wrap">
          <div class="flex-flow">
            <el-form-item label="第一计量单位">
              <el-input placeholder="请输入第一计量单位" v-model="map.cargo.unit1"></el-input>
            </el-form-item>
          </div>
          <div class="flex-flow">
            <el-form-item label="第二计量单位">
              <el-input placeholder="请输入第二计量单位" v-model="map.cargo.unit2"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="flex-wrap">
          <div class="flex-flow">
            <el-form-item label="品牌编号">
              <el-input placeholder="请输入品牌编号" v-model="map.cargo.brandId"></el-input>
            </el-form-item>
          </div>
          <div class="flex-flow">
            <el-form-item label="商品出厂日期">
              <el-date-picker v-model="map.cargo.cargoFactoryDate" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="限制类商品标志">
          <el-input placeholder="请输入限制类商品标志" v-model="map.cargo.otherType"></el-input>
        </el-form-item>
        <el-form-item label="重点审价标记">
          <el-input placeholder="请输入重点审价标记" v-model="map.cargo.chkPrice"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input placeholder="请输入备注" v-model="map.cargo.noteS"></el-input>
        </el-form-item>
        <el-form-item label="生产厂家">
          <el-input placeholder="请输入生产厂家" v-model="map.cargo.producerName"></el-input>
        </el-form-item>
        <el-form-item label="商品功能">
          <el-input placeholder="请输入商品功能" v-model="map.cargo.cargoFunction"></el-input>
        </el-form-item>
        <el-form-item label="商品用途">
          <el-input placeholder="请输入商品用途" v-model="map.cargo.cargoPurpose"></el-input>
        </el-form-item>
        <div class="flex-wrap">
          <div class="flex-flow">
            <el-form-item label="转基因产品标识">
              <template>
                <el-radio v-model="map.cargo.transgenicFlag" :label="0">不是</el-radio>
                <el-radio v-model="map.cargo.transgenicFlag" :label="1">是</el-radio>
              </template>
            </el-form-item>
          </div>
          <div class="flex-flow">
            <el-form-item label="是否禁止进境物标识">
              <template>
                <el-radio v-model="map.cargo.forbidImportFlag" :label="0">不是</el-radio>
                <el-radio v-model="map.cargo.forbidImportFlag" :label="1">是</el-radio>
              </template>
            </el-form-item>
          </div>
        </div>
        <div class="flex-wrap">
          <div class="flex-flow">
            <el-form-item label="商品单位">
              <template>
                <el-radio v-model="map.cargo.flag1712" :label="0">不是</el-radio>
                <el-radio v-model="map.cargo.flag1712" :label="1">是</el-radio>
              </template>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="其他">
          <el-input placeholder="请输入其他" v-model="map.cargo.remark"></el-input>
        </el-form-item>
        <el-form-item label="3C编码">
          <el-input placeholder="请输入3C编码" v-model="map.spt2"></el-input>
        </el-form-item>
        <div class="flex-wrap">
          <div class="flex-flow">
            <el-form-item label="品牌中文名">
              <el-input placeholder="请输入品牌中文名" v-model="map.spt3"></el-input>
            </el-form-item>
          </div>
          <div class="flex-flow">
            <el-form-item label="品牌外文名">
              <el-input placeholder="请输入品牌外文名" v-model="map.spt4"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="flex-wrap">
          <div class="flex-flow">
            <el-form-item label="品牌评估报告">
              <template>
                <el-radio v-model="map.spt5" :label="1">没有</el-radio>
                <el-radio v-model="map.spt5" :label="0">有</el-radio>
              </template>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="第三方评估机构">
          <el-input placeholder="请输入第三方评估机构" v-model="map.spt6"></el-input>
        </el-form-item>
      </div>
      <div class="title">附件</div>
      <el-form-item label class="btns">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="submitClick('addForm')">提交备案</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import api from "../../../api/axios";
import App from "../../../api/index";
export default {
  name: "Add",
  data() {
    return {
      map: {
        attachment: {
          evaluationReport: "",
          evaluationReportUrl: "",
          foreignCertificate: "",
          foreignCertificateUrl: "",
          inspectionLicense: "",
          inspectionLicenseUrl: "",
          licenseFile1: "",
          licenseFile1Url: "",
          licenseFile2: "",
          licenseFile2Url: "",
          licenseFile3: "",
          licenseFile3Url: "",
          licenseFile4: "",
          licenseFile4Url: "",
          licenseFile5: "",
          licenseFile5Url: "",
          other: "",
          otherUrl: "",
          productCertificate: "",
          productCertificateUrl: "",
          productDescription: "",
          productDescriptionUrl: "",
          thirdCertificate: "",
          thirdCertificateUrl: "",
          thirdCheckReport: "",
          thirdCheckReportUrl: "",
        },
        cargo: {
          brandId: "",
          busRegion: "",
          cargoCrossId: "",
          cargoFactoryDate: "",
          cargoFunction: "",
          cargoIngredient: "",
          cargoModel: "",
          cargoNum: "",
          cargoPlace: "",
          cargoPurpose: "",
          cargoSpec: "",
          cargoUnit: "",
          chkPrice: "",
          codeId: "",
          codeTs: "",
          copgNo: "",
          flag1712: 0,
          forbidImportFlag: 0,
          goodsNote: "",
          hsCode: "",
          id: "",
          materialID: "",
          nameCh: "",
          nameEn: "",
          nameOther: "",
          noteS: "",
          otherType: "",
          price: "",
          producerName: "",
          remark: "",
          standardPlace: "",
          supplier: "",
          transgenicFlag: 0,
          unit1: "",
          unit2: "",
        },
        id: "",
        serialNumber: "",
        spt1: 1,
        spt2: "",
        spt3: "",
        spt4: "",
        spt5: 0,
        spt6: "",
      },
      customsCode: {
        code1: "",
        name1: "",
        type: "",
      },
      customType: "",
      lists: {},
      cargoPlaceOptions: [],
      JGlist: [],
      addRules: {
        "cargo.codeId": [
          { required: true, message: "请输入电商商品编号", trigger: "blur" },
        ],
        "cargo.codeTs": [
          { required: true, message: "请输入商品归类码", trigger: "blur" },
        ],
        "cargo.hsCode": [
          { required: true, message: "请输入HS-CODE", trigger: "blur" },
        ],
        "cargo.materialID": [
          { required: true, message: "请输入商品物资ID", trigger: "blur" },
        ],
        "cargo.copgNo": [
          {
            required: true,
            message: "请输入商品内部货号商品内部货号",
            trigger: "blur",
          },
        ],
        "cargo.nameCh": [
          { required: true, message: "请输入商品中文名", trigger: "blur" },
        ],
        "cargo.nameEn": [
          { required: true, message: "请输入商品外文名", trigger: "blur" },
        ],
        "cargo.goodsNote": [
          { required: true, message: "请输入商品描述", trigger: "blur" },
        ],
        "cargo.cargoPlace": [{ required: true, trigger: "change" }],
        "cargo.standardPlace": [{ required: true, trigger: "change" }],
        "cargo.cargoIngredient": [
          { required: true, message: "请输入商品成分", trigger: "blur" },
        ],
        "cargo.cargoModel": [
          { required: true, message: "请输入商品型号", trigger: "blur" },
        ],
        "cargo.cargoSpec": [
          { required: true, message: "请输入商品规格", trigger: "blur" },
        ],
        "cargo.supplier": [
          { required: true, message: "请输入供应商", trigger: "blur" },
        ],
        "cargo.busRegion": [{ required: true, trigger: "change" }],
      },
    };
  },
  mounted() {
    // this.getProductCreate();
    this.getCodeQuery({ type: "GB" });
    this.getCodeQuery({ type: "JG" });
  },
  methods: {
    //获取海关商品创建
    getProductCreate() {
      const self = this;
      const url = App.productCreate;
      const args = self.map;
      api
        .POST(url, args)
        .then((res) => {
          if (res.code === 0) {
            self.lists = res.data.dataPage;
          }
        })
        .catch((err) => {
          self.$message.error(err.msg || "系统报错！");
        });
    },
    //获取海关代码查询
    getCodeQuery(arg) {
      const self = this;
      const url = App.codeQuery;
      api
        .GET(url, arg)
        .then((res) => {
          if (res.code === 0) {
            if (arg.type == "GB") {
              self.cargoPlaceOptions = res.data;
            } else {
              self.JGlist = res.data;
            }
          }
        })
        .catch((err) => {
          self.$message.error(err.msg || "系统报错！");
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
.el-form .el-input,
.el-form .el-select,
.el-form .el-textarea {
  width: 620px !important;
}
.flex-wrap {
  width: 720px;
}
.el-form .flex-wrap .el-input {
  width: 235px !important;
}
</style>