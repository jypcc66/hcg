<template>
  <div class="login-container">
    <div>
      <img class="login-img" src="../../images/login-img.png" />
    </div>
    <div class="login">
      <div class="login-logo">
        <img src="../../images/login_logo.png" />
      </div>
      <div class="login-box">
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="90px"
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
          <el-form-item>
            <div>用户名：admin</div>
            <div>密码：123456</div>
          </el-form-item>
        </el-form>
      </div>
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
          api
            .GET(url, args)
            .then((res) => {
              if (res.data) {
                cookies.set("token", res.data);
                location.href = "/couponlist";
              } else {
                alert(res.msg);
                self.ruleForm = {
                  username: "",
                  password: "",
                };
              }
            })
            .catch((err) => {
              self.$message.error(err.msg || "系统报错！");
            });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.login-container {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #93defe;
}
.login-img {
  position: fixed;
  width: 500px;
  height: 450px;
  left: 200px;
  top: 120px;
}
.login-container .login {
  position: relative;
  float: right;
  width: 460px;
  height: 400px;
  margin-top: 160px;
  margin-right: 10%;
  background: #fff;
  border-radius: 5px;
}
.login-container .login-box {
  padding: 106px 35px 0 20px;
}
.login-container .el-button--primary {
  width: 100%;
}
.el-form .el-input {
  width: 315px !important;
}
.login-container .login-logo {
  position: absolute;
  top:-55px;
  left:50%;
  width: 110px;
  height: 110px;
  margin-left:-55px;
  border: 5px solid #93defe;
  border-radius: 50%;
  background: #fff;
}
.login-container .login-logo img {
  width: 60px;
  height: 60px;
  display: block;
  margin: 25px auto auto;
}
</style>