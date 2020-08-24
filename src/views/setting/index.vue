<template>
  <div class="setting">
    <el-form ref="settingForm" label-position="left" label-width="30%">
      <el-form-item label="登录次数限制：">
        <el-input-number
          v-if="formData[0]"
          v-model="formData[0].value"
          size="mini"
          placeholder="请输入登录次数："
        />
      </el-form-item>
      <el-form-item label="登录过期时间限制：">
        <el-input-number
          v-if="formData[1]"
          v-model="formData[1].value"
          size="mini"
          placeholder="请输入登录过期时间："
        />
      </el-form-item>
      <el-form-item label="默认密码：">
        <el-input
          v-if="formData[2]"
          v-model="formData[2].value"
          size="mini"
          placeholder="请输入默认密码："
          style="width:50%"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          size="mini"
          icon="el-icon-document-checked"
          type="primary"
          @click="saveSetting()"
        >保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { SaveSetting, SelectSetting } from "@/api/setting/setting";

export default {
  name: "Setting",
  data() {
    return {
      formData: []
    };
  },
  created() {
    this.selectSetting();
  },
  methods: {
    //查看设置
    selectSetting() {
      //加载login
      SelectSetting()
        .then(res => {
          if (res.code == 0) {
            this.formData = res.data.setting;
          }
        })
        .catch(err => {});
    },
    //保存设置
    saveSetting() {
      let data = {
        login_times: parseInt(this.formData[0].value),
        login_exp_time: parseInt(this.formData[1].value),
        reset_pass: parseInt(this.formData[2].value)
      };
      SaveSetting(data)
        .then(res => {
          if (res.code == 0) {
            this.$message({
              message: res.msg,
              type: "success"
            });
            this.getData();
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
          }
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.setting {
  padding: 20px;
  width: 500px;
}
</style>
