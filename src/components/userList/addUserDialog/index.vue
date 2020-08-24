<template>
  <div class="container">
    <el-dialog
      title="创建用户"
      :visible.sync="dialog.centerDialogVisible"
      width="500px"
      center
      @open="getData"
      :lock-scroll="true"
    >
      <el-form
        ref="form"
        :rules="rules"
        :model="formData"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="类型：" prop="type">
          <el-select v-model="formData.type" placeholder="请选择类型">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名字：" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名字" />
        </el-form-item>
        <el-form-item label="中文名字：" prop="ch_name">
          <el-input v-model="formData.ch_name" placeholder="请输入英文名字" />
        </el-form-item>
        <el-form-item label="英文名字：" prop="en_name">
          <el-input v-model="formData.en_name" placeholder="请输入英文名字" />
        </el-form-item>
        <el-form-item label="性别：">
          <el-switch v-model="formData.sex" active-text="女" inactive-text="男"></el-switch>
        </el-form-item>
        <el-form-item label="年龄：" prop="age">
          <el-input v-model="formData.age" placeholder="请输入年龄" />
        </el-form-item>
        <el-form-item label="出生日期：" prop="birthday">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="formData.birthday"
            type="date"
            placeholder="请选择出生日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码：" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号码" />
        </el-form-item>

        <el-form-item label="省份：" prop="province">
          <el-input v-model="formData.province" placeholder="请输入城市" />
        </el-form-item>
        <el-form-item label="城市：" prop="city">
          <el-input v-model="formData.city" placeholder="请输入城市" />
        </el-form-item>
        <el-form-item label="区：" prop="district">
          <el-input v-model="formData.district" placeholder="请输入区" />
        </el-form-item>
        <el-form-item label="校区：" prop="school_id">
          <el-select
            :multiple="false"
            filterable
            remote
            center
            reserve-keyword
            v-model="formData.school_id"
            placeholder="请选择校区"
            :remote-method="insideRemoteMethod"
            :loading="inside.loading"
          >
            <el-option
              v-for="item in inside.option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传照片：">
          <div class="photo">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :http-request="handleAvatarSuccess"
            >
              <el-image
                v-if="formData.imageUrl"
                fit="scale-down"
                :src="formData.imageUrl"
                class="avatar"
              ></el-image>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
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
import { getToken } from "@/utils/auth";
import { addUser } from "@/api/userList";
import { getSelectSchool } from "@/api/campus/campusList";
export default {
  props: {
    dialog: Object,
  },
  data() {
    return {
      formData: {
        imageUrl: "",
        type: "",
        username: "",
        phone: "",
        en_name: "",
        ch_name: "",
        sex: false,
        age: "",
        birthday: "",
        province: "",
        city: "",
        district: "",
        school_id: "",
      },
      rules: {
        username: [
          { required: true, message: "填写用户名字", trigger: "blur" },
        ],
        en_name: [{ required: true, message: "填写中文名", trigger: "blur" }],
        ch_name: [{ required: true, message: "填写英文名", trigger: "blur" }],
        age: [{ required: true, message: "填写年龄", trigger: "blur" }],
        birthday: [
          { required: true, message: "选择出生日期", trigger: "change" },
        ],
        phone: [{ required: true, message: "填写手机号码", trigger: "blur" }],
        type: [{ required: true, message: "选择类型", trigger: "change" }],
        province: [{ required: true, message: "填写省份", trigger: "blur" }],
        city: [{ required: true, message: "填写城市", trigger: "blur" }],
        district: [{ required: true, message: "填写区", trigger: "blur" }],
        school_id:[{ required: true, message: "选择校区", trigger: "change" }]
      },
      typeList: [
        {
          value: 1,
          label: "其他",
        },
        {
          value: 2,
          label: "麦禾",
        },
        {
          value: 3,
          label: "米格鲁3",
        },
      ],
      inside: {
        innerVisible: false,
        option: [],
        value: "",
        list: [],
        loading: false,
      },
      baseUrl: "",
    };
  },
  created() {
    let url = this.$axios.defaults.baseURL;
    let endlength = url.indexOf("/index");
    this.baseUrl = url.substring(0, endlength);
  },
  methods: {
    hideDialog() {
      this.dialog.centerDialogVisible = false;
       this.formData= {
        imageUrl: "",
        type: "",
        username: "",
        phone: "",
        en_name: "",
        ch_name: "",
        sex: false,
        age: "",
        birthday: "",
        province: "",
        city: "",
        district: "",
        school_id: "",
      }
    },
    getData() {
      getSelectSchool().then((res) => {
        this.inside.option = res.data.map((item) => {
          return { value: `${item.id}`, label: `${item.name}` };
        });
      });
    },
    //图片上传
    handleAvatarSuccess(param) {
      console.log(param.file);
      let data = new window.FormData();
      data.append("uploadType", "form");
      data.append("uploadfiles", param.file);
      data.append("type", "popupadv");
      data.append("opt", "single");
      data.append("token", getToken());
      console.log(data);
      this.$axios.post("api/Common/uploadImg", data).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: res.data.message || res.data.msg,
            type: "success",
          });
          this.formData.imageUrl = res.data.data.url;
        }
      });
    },
    // 搜索校区
    insideRemoteMethod(query) {
      if (query !== "") {
        this.getSupplierList(query);
      } else {
        this.inside.options = [];
      }
    },
    //获取供应商数据
    getSupplierList(query) {
      let data = {
        name: query,
      };
      this.inside.loading = true;
      getSelectSchool(data).then((res) => {
        this.inside.list = res.data.map((item) => {
          return { value: `${item.id}`, label: `${item.name}` };
        });
        this.inside.loading = false;
        this.inside.option = this.inside.list.filter((item) => {
          return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
        });
      });
    },
    //提交
    confirm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.formData.imageUrl) {
            
            let data = {
              header: this.formData.imageUrl,
              type: this.formData.type,
              username: this.formData.username,
              phone: this.formData.phone,
              en_name: this.formData.en_name,
              ch_name: this.formData.ch_name,
              sex: this.formData.sex ? 2 : 1,
              age: this.formData.age,
              birthday: this.formData.birthday,
              province: this.formData.province,
              city: this.formData.city,
              district: this.formData.district,
              school_id: this.formData.school_id,
            };
            console.log(data);
            // return
            addUser(data).then((res) => {
              if (res.code == 0) {
                this.$message({
                  message: res.message,
                  type: "success",
                });
                this.hideDialog();
                this.$emit("upData");
              } else {
                this.$message({
                  message: res.message,
                  type: "error",
                });
              }
            });
          }else{
             this.$message({
                  message: '请上传用户图片',
                  type: "error",
                });
          }
        }
      });
    },
    //取消
    cancel() {
      this.hideDialog();
    },
  },
};
</script>
<style scoped>
.remove {
  margin: 0 auto;
  display: block;
}
.photo {
  border: 1px dashed #d9d9d9;
  width: 178px;
  height: 178px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>