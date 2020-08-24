<template>
  <div class="container">
    <el-dialog
      title="修改个人信息"
      :visible.sync="dialog.centerDialogVisible"
      width="30%"
      center
      :lock-scroll="true"
    >
      <el-form
        ref="user"
        :rules="rules"
        :model="user"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="用户名称：" prop="nickname">
          <el-input v-model="user.nickname" placeholder="请输入用户名称" />
        </el-form-item>

        <el-form-item label="手机号" prop="userphone">
          <el-input v-model="user.phone" placeholder="请输入用户手机号" />
        </el-form-item>

        <el-form-item label="Email" prop="useremail">
          <el-input v-model="user.email" placeholder="请输入用户邮箱" />
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
import { personalEditAdminInfo } from "@/api/user";
export default {
  props: {
    dialog: Object,
    user: Object
  },
  data() {
    return {
      rules: {
        nickname: [{ required: true, message: "填写用户名称", trigger: "blur" }],
        phone: [
          { required: true, message: "填写用户手机号", trigger: "blur" }
        ],
        email: [
          { required: true, message: "填写用户邮箱", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    hideDialog() {
      this.dialog.centerDialogVisible = false;
    },
    //提交
    confirm() {
      this.$refs["user"].validate(valid => {
        if (valid) {
          let data = {
            nickname: this.user.nickname,
            phone: this.user.phone,
            email: this.user.email
          };
          personalEditAdminInfo(data).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.hideDialog();
              this.$emit("upData");
            } else {
              this.$message({
                message: res.msg,
                type: "error"
              });
            }
          }).catch(err =>{
          console.log(err)
        })
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