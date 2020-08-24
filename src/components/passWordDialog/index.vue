<template>
  <div class="container">
    <el-dialog
      title="修改密码"
      :visible.sync="passWordDialogs.centerDialogVisible"
      width="30%"
      center
      :lock-scroll="true"
      @close="hideDialog"
    >
      <el-form
        ref="formData"
        :rules="rules"
        :model="formData"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="密码：" prop="passWord">
          <el-input show-password v-model="formData.passWord" placeholder="请输入密码" />
        </el-form-item>

        <el-form-item label="新密码：" prop="newPassWord1">
          <el-input show-password v-model="formData.newPassWord1" placeholder="请输入新密码" />
        </el-form-item>

        <el-form-item label="确认密码：" prop="newPassWord2">
          <el-input show-password v-model="formData.newPassWord2" placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { personalEditAdminPassword } from "@/api/user";
import store from "@/store";
export default {
  props: {
    passWordDialogs: Object
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.formData.newPassWord1) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      rules: {
        passWord: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],

        newPassWord1: [
          { required: true, message: "新密码不能为空", trigger: "blur" }
        ],
        newPassWord2: [{ validator: validatePass2, trigger: "blur" }]
      },
      formData: {
        passWord: "",
        newPassWord1: "",
        newPassWord2: ""
      }
    };
  },

  methods: {
    hideDialog() {
      this.passWordDialogs.centerDialogVisible = false;
      this.$refs["formData"].resetFields();
    },
    //提交
    confirm() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          let data = {
            old_password: this.formData.passWord,
            password: this.formData.newPassWord1,
            verify_password: this.formData.newPassWord2
          };
          personalEditAdminPassword(data)
            .then(res => {
              if (res.code == 0) {
                this.$message({
                  message: res.msg,
                  type: "success"
                });
                this.hideDialog();
                setTimeout(() => {
                  store.dispatch("user/resetToken").then(res => {
                    location.reload();
                  });
                },500);
              } else {
                this.$message({
                  message: res.msg,
                  type: "error"
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    //取消
    cancel() {
      this.hideDialog();
    }
  }
};
</script>