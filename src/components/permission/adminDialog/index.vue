<template>
  <div class="container">
    <el-dialog
      :title="dialog.dialogType==='edit'?'修改管理员':'创建管理员'"
      :visible.sync="dialog.centerDialogVisible"
      width="30%"
      center
      :lock-scroll="true"
      @open="getOpen"
      @closed="hideDialog"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formData"
        label-width="120px"
        label-position="left"
      >
        <el-form-item label="用户名：" prop="name">
          <el-input v-model="formData.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item v-if="dialog.dialogType==='edit'?false:true" label="密码：" prop="password">
          <el-input v-model="formData.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="管理员名称：" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入管理员名称" />
        </el-form-item>
        <el-form-item label="管理员角色：" prop="roleId">
          <el-select v-model="formData.roleVal" @change="getOptionId(formData.roleVal)" placeholder="请选择管理员角色">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号：" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideDialog">取 消</el-button>
        <el-button type="primary" @click="comitDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  addAdminInfo,
  editAdminInfo,
  findAdminInfo
} from "@/api/permission/adminlist";
import { roleList } from "@/api/permission/roleList";
export default {
  props: {
    dialog: Object
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 20, message: "密码长度6-20字符", trigger: "blur" }
        ],
        nickname: [
          { required: true, message: "管理员名称不能为空", trigger: "blur" }
        ],
        roleId: [
          { required: true, message: "管理员角色不能为空", trigger: "blur" }
        ],
        phone: [{ required: true, message: "手机号不能为空", trigger: "blur" }]
      },
      formData: {
        name: "",
        password: "",
        nickname: "",
        roleName: "",
        roleId: "",
        roleVal:'',
        acc_type: 0,
        supplierId: "",
        phone: "",
        acc_name:'',
        email: ""
      },
      options:[],
    };
  },
  created(){
    this.getRole()
  },
  methods: {
    //获取角色列表
    getRole() {
      let data = {
        search: "",
        page: 1,
        limit: 100
      };
      roleList(data).then(res => {
        if (res.code == 0) {
          res.data.data.forEach(res =>{
            this.options.push({
              label:res.role_name,
              value:res.role_id
            })
          })
        }
      });
    },
    getOpen() {
      if (this.dialog.dialogType == "edit") {
        let data = {
          admin_id: this.dialog.admin_id
        };
        findAdminInfo(data).then(res => {
          if (res.code == 0) {
            this.formData = {
              name: res.data.admin_info.username,
              nickname: res.data.admin_info.nickname,
              roleId: res.data.admin_info.role_id,
              roleVal: res.data.admin_info.role_name,
              phone: res.data.admin_info.phone,
              email: res.data.admin_info.email
            };
           
          }
        });
      } else {
        this.formData = {
          name: "",
          password: "",
          nickname: "",
          roleName: "",
          roleId: "",
          roleVal:'',
          phone: "",
          email: ""
        };
      }
    },
    //获取角色ID
    getOptionId(val) {
      this.formData.roleId = val;
    },
    //提交表单
    comitDialog() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          let data = {
            username: this.formData.name,
            nickname: this.formData.nickname,
            phone: this.formData.phone,
            email: this.formData.email,
            role_id:this.formData.roleId
          };
          if (this.dialog.dialogType === "edit") {
            data.admin_id = this.dialog.admin_id;
            editAdminInfo(data).then(res => {
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
            });
          } else {
            data.password = this.formData.password;
            addAdminInfo(data).then(res => {
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
            });
          }
        } else {
          return false;
        }
      });
    },
    //隐藏表单
    hideDialog() {
      this.$refs["formData"].resetFields();
      this.dialog.centerDialogVisible = false;
    },
  }
};
</script>
  <style scoped>
.tab {
  display: flex;
}
.tab .el-form-item {
  flex: 1;
}
</style>