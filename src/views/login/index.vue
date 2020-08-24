<template>
  <div>
    <div class="pad20">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名：" prop="username">
          <el-input placeholder="请输入用户名" v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import api from "../../api/axios";
import cookies from "js-cookie";
export default {
  name: "Login",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          {
            required: true,
            validator: validatePass,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      const self = this;
      const url = "/user/login";
      const args = self.ruleForm;
      self.$refs[formName].validate((valid) => {
        if (valid) {
          api.GET(url, args).then((res) => {
            if (res.data) {
              cookies.set("token", res.data);
              location.href="/couponlist"
            } else {
              alert(res.msg);
              self.ruleForm = {
                username: "",
                password: "",
              };
            }
          }).catch(err => {
            self.$message.error(err.msg || '系统报错！')
          });
        }
      });
    },
  },
};
</script>
<style scoped>
</style>