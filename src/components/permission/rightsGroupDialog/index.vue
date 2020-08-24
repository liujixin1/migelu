<template>
  <div class="container">
    <el-dialog
      :title="dialog.dialogType==='edit'?'修改权限分组':'创建权限分组'"
      :visible.sync="dialog.centerDialogVisible"
      width="30%"
      center
      @close="hideDialog"
      @open="getData"
      :lock-scroll="true"
    >
      <el-form
        ref="form"
        :rules="rules"
        :model="formData"
        label-width="150px"
        label-position="left"
      >
        <el-form-item label="权限分组名称：" prop="name">
          <el-input v-model="formData.name" placeholder="请输入权限分组名称" />
        </el-form-item>

        <el-form-item label="权限分组编码：" prop="code">
          <el-input v-model="formData.code" placeholder="请输入权限分组编码" />
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
  addRightGroup,
  getRightGroupInfo,
  editRightGroup
} from "@/api/permission/rightsGroup";
export default {
  props: {
    dialog: Object
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: "权限分组名称", trigger: "blur" }],
        code: [{ required: true, message: "权限分组编码", trigger: "blur" }]
      },
      formData: {
        name: "",
        code: ""
      }
    };
  },

  methods: {
    hideDialog() {
      this.dialog.centerDialogVisible = false;
      this.$refs["form"].resetFields();
    },
    //获取数据
    getData() {
      if (this.dialog.dialogType === "edit") {
        let data = {
          id: this.dialog.admin_id
        };
        getRightGroupInfo(data).then(res => {
          if (res.code == 0) {
            this.formData = {
              name: res.data.name,
              code: res.data.code
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
            code: this.formData.code
          };
          if (this.dialog.dialogType === "edit") {
            data.id = this.dialog.admin_id;
            editRightGroup(data)
              .then(res => {
                if (res.code == 0) {
                  this.$message({
                    message: res.msg || res.message,
                    type: "success"
                  });
                  this.hideDialog();
                  this.$emit("upData");
                } else {
                  this.$message({
                    message: res.msg || res.message,
                    type: "error"
                  });
                }
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            addRightGroup(data)
              .then(res => {
                if (res.code == 0) {
                  this.$message({
                    message: res.msg || res.message,
                    type: "success"
                  });
                  this.hideDialog();
                  this.$emit("upData");
                } else {
                  this.$message({
                    message: res.msg || res.message,
                    type: "error"
                  });
                }
              })
              .catch(err => {
                console.log(err);
              });
          }
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