<template>
  <div class="pad20">
    <el-form label-width="140px" :model="map" ref="addsForm" :rules="addsRules">
      <el-form-item label="仓库名称：" prop="name">
        <el-input placeholder="请输入仓库名称" v-model="map.name" maxlength="44"></el-input>
      </el-form-item>
      <el-form-item label="仓库类型：">
        <el-radio-group v-model="map.type">
          <el-radio :label="1">保税仓</el-radio>
          <el-radio :label="2">非保税仓-普通</el-radio>
          <el-radio :label="3">非保税仓-直播</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="姓名：" prop="concat">
        <el-input placeholder="请输入姓名" v-model="map.concat"></el-input>
      </el-form-item>
      <el-form-item label="电话：" prop="telephone">
        <el-input placeholder="请输入电话" v-model="map.telephone"></el-input>
      </el-form-item>
      <el-form-item label="国家：">
        <el-input placeholder="请输入国家" v-model="map.countryName"></el-input>
      </el-form-item>
      <el-form-item label="地址：">
        <el-cascader
          size="large"
          :options="options"
          v-model="selectedOptions"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="详情地址：" prop="address">
        <el-input placeholder="请输入详情地址" v-model="map.address"></el-input>
      </el-form-item>
      <el-form-item label="邮编：" prop="zip">
        <el-input placeholder="请输入邮编" v-model="map.zip"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button>取消</el-button>
        <el-button type="primary" @click="submit('addsForm')">确定保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { regionData, CodeToText, TextToCode } from "element-china-area-data";
import App from "../../api/index";
import api from "../../api/axios";
export default {
  name: "Index",
  data() {
    const zip = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入邮编"));
      } else if (value && !/^[1-9][0-9]{5}$/.test(value)) {
        callback(new Error("请输入正确邮编"));
      } else {
        callback();
      }
    };
    const telephone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入电话号码"));
      } else if (value && !/^0\d{2,3}-?\d{7,8}$/.test(value)) {
        callback(new Error("请输入正确电话号码"));
      } else {
        callback();
      }
    };
    return {
      map: {
        address: "",
        companyName: "", // 公司
        concat: "",
        telephone: "",
        countryName: "中国", // 国家
        name: "",
        province: "", // 省份
        city: "", // 市
        district: "", // 区
        state: 1,
        type: 1,
        zip: "",
      },
      options: regionData,
      selectedOptions: [],
      addsRules: {
        name: [{ required: true, message: "请输入仓库名称", trigger: "blur" }],
        concat: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        telephone: [{ validator: telephone, required: true, trigger: "blur" }],
        address: [
          { required: true, message: "请输入详情地址", trigger: "blur" },
        ],
        zip: [{ validator: zip, required: true, trigger: "blur" }],
      },
      id: "",
    };
  },
  mounted() {
    const self = this;
    self.id = self.$route.query.id;
    if (self.id) {
      // ID存在先获取当前对应id的详情数据。这个必须有一个获取详情接口来支持
      self.getDatail();
    }
  },
  methods: {
    getDatail() {
      const self = this;
      const url = `${App.storeDetail}${self.id}`;
      api
        .GET(url)
        .then((ress) => {
          if (ress.code === 0) {
            self.map = ress.data;
            const address = [];
            const res = ress.data;
            if (res.province) {
              address.push(TextToCode[res.province].code);
              address.push(TextToCode[res.province][res.city].code);
              address.push(
                TextToCode[res.province][res.city][res.district].code
              );
              self.selectedOptions = address;
            }
          }
        })
        .catch((err) => {
          self.$message.error(err.msg || "系统报错！");
        });
    },

    //选择地址
    handleChange(value) {
      this.map.province = CodeToText[value[0]]; // 省份
      this.map.city = CodeToText[value[1]]; // 市
      this.map.district = CodeToText[value[2]]; // 区
    },
    //保存按钮点击事件
    submit(addsForm) {
      const self = this;
      self.$refs[addsForm].validate((valid) => {
        if (valid) {
          const args = this.map;
          if (!args.province) {
            this.$message.error("请选择省市区");
            return false;
          }
          debugger;
          self.$message.success("新增仓库成功");
        }
      });
    },
  },
};
</script>