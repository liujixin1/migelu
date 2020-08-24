<template>
  <div class="container">
    <el-dialog
      :title="dialog.dialogType==='edit'?'修改角色':'创建角色'"
      :visible.sync="dialog.centerDialogVisible"
      width="30%"
      center
      :lock-scroll="true"
    >
      <el-form
        ref="form"
        :rules="rules"
        :model="formData"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model="formData.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" prop="describe">
          <el-input v-model="formData.describe" type="textarea" placeholder="请输入角色描述" />
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
import { addRole } from "@/api/permission/roleList";
export default {
  props: {
    dialog: Object
  },
  data() {
    return {
      formData: {
        name: "",
        describe: ""
      },
      rules: {
        name: [{ required: true, message: "填写角色名称", trigger: "blur" }],
        describe: [{ required: true, message: "填写描述", trigger: "blur" }]
      }
    };
  },
  methods: {
    hideDialog() {
      this.dialog.centerDialogVisible = false;
    },
    //提交
    confirm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let data = {
            role_name: this.formData.name,
            role_desc: this.formData.describe
          };
         
          addRole(data).then(res => {
           
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.hideDialog();
              this.$emit("upData");
            } else {
              this.$message({
                message: res.message,
                type: "error"
              });
            }
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