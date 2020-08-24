<template>
  <div class="container">
    <el-dialog
      :title="dialog.dialogType==='edit'?'修改校区':'创建校区'"
      :visible.sync="dialog.centerDialogVisible"
      width="50%"
      center
      :lock-scroll="true"
      @open="getData"
      :before-close="hideDialog"
    >
      <el-form
        ref="form"
        :model="formData"
        label-width="150px"
        label-position="left"
        :rules="rules"
      >
        <el-form-item label="校区名称：" prop="name">
          <el-input v-model="formData.name" placeholder="请输入校区名称" />
        </el-form-item>
        <el-form-item label="校区token：" prop="token">
          <el-input v-model="formData.token" placeholder="请输入校区token" />
        </el-form-item>
        <el-form-item label="校区id：" prop="org_id">
          <el-input v-model="formData.org_id" placeholder="请输入校区org_id" />
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
import {
  addSchool,
  modificationSchool,
  particularsSchool
} from "@/api/campus/campusList";
export default {
  props: {
    dialog: Object
  },
  data() {
    return {
      formData: {
        name: "",
        token: "",
        org_id: ""
      },
      rules: {
        name: [{ required: true, message: "请输入校区名称", trigger: "blur" }],
        token: [
          { required: true, message: "请输入校区token", trigger: "blur" }
        ],
        org_id: [{ required: true, message: "请输入校区id", trigger: "blur" }]
      }
    };
  },
  methods: {
    getData() {
      if (this.dialog.dialogType === "edit") {
        let data = {
          id: this.dialog.id
        };
        particularsSchool(data).then(res => {
          if (res.code == 0) {
            console.log(res);
            this.formData = {
              name: res.data.name,
              token: res.data.token,
              org_id: res.data.org_id
            };
          }
        });
      }
    },
    //提交
    confirm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let data = {
            name: this.formData.name,
            token: this.formData.token,
            org_id: this.formData.org_id
          };
          if (this.dialog.dialogType === "edit") {
            data.id = this.dialog.id;
            modificationSchool(data).then(res => {
              if (res.code == 0) {
                this.$message({
                  message: res.msg || res.message,
                  type: "success"
                });
                this.hideDialog();
                this.$emit("upData");
              } else {
                this.$message({
                  message: res.msg|| res.message,
                  type: "error"
                });
              }
            });
          } else {
            addSchool(data).then(res => {
              if (res.code == 0) {
                this.$message({
                  message: res.msg|| res.message,
                  type: "success"
                });
                this.hideDialog();
                this.$emit("upData");
              } else {
                this.$message({
                  message: res.msg|| res.message,
                  type: "error"
                });
              }
            });
          }
        }
      });
    },
    hideDialog() {
      this.dialog.centerDialogVisible = false;
      this.$refs['form'].resetFields()
      this.formData = {
        name: "",
        token: "",
        org_id: ""
      };
    },
    //取消
    cancel() {
      this.hideDialog();
    }
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