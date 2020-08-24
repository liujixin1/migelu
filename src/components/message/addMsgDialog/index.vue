<template>
  <div class="container">
    <el-dialog
      title="创建弹窗消息"
      :visible.sync="addDialog.centerDialogVisible"
      width="700px"
      center
      @close="hideDialog()"
      :lock-scroll="true"
    >
      <el-form ref="form" :rules="rules" :model="form" label-width="100px" label-position="left">
        <el-form-item label="消息标题：" prop="name">
          <el-input v-model="form.name" placeholder="请输入消息标题" />
        </el-form-item>
        <el-form-item label="跳转链接" prop="redirect_url">
          <el-input v-model="form.redirect_url" placeholder="请输入跳转链接" />
        </el-form-item>
        <el-form-item label="样式选择：" prop="style_type">
          <el-radio-group v-model="form.style_type">
            <el-radio label="2">大图全屏</el-radio>
            <el-radio label="1">小图居中</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input-number v-model="form.sort" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="有效期：" prop="date">
          <el-date-picker
            v-model="form.date"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="上传照片：">
          <div class="photo">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :http-request="handleAvatarSuccess"
            >
              <el-image v-if="form.imageUrl" fit="scale-down" :src="form.imageUrl" class="avatar"></el-image>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
           
          </div>
           <div class="uploadMsg">
              <div>全屏图片应小于200KB，尺寸为290*350，格式为PNG格式。</div>
              <div>居中小图应小于200KB，尺寸为230*320，格式为PNG格式。</div>
            </div>
        </el-form-item>
        <el-form-item label="推送目标：" prop="select_user_id_str">
          <el-radio-group
            v-model="form.select_user_id_str"
            @change="selectUser(form.select_user_id_str)"
          >
            <el-radio label="0">全部学员</el-radio>
            <el-radio label="-3">米格鲁学员</el-radio>
            <el-radio label="-2">麦禾学员</el-radio>
            <el-radio label="-1">其他学员</el-radio>
            <el-radio label="-4">部分学员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="selectedData.length > 0 && showBtn" label="学员列表：">
          <el-tag v-for="tag in selectedData" :key="tag.ch_name">{{tag.ch_name}}</el-tag>
        </el-form-item>
        <el-button v-if="showBtn" @click="selectStudent" type="primary">选择学员</el-button>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </span>
      <el-dialog
        width="700px"
        title="学员列表"
        center
        :visible.sync="dialog.centerDialogVisible"
        append-to-body
      >
        <div class="top">
          <el-input
            clearable
            style="width:200px"
            v-model="search.searchCode"
            placeholder="请输入用户名/手机/英文名..."
          ></el-input>
          <el-select v-model="search.status" multiple placeholder="请选择类型">
            <el-option
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            class="handleSearch"
            @click="handleSearch()"
          >查询</el-button>
        </div>
        <el-table
          :data="tableData"
          border
          ref="singleTable"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          row-key="id"
          empty-text="暂无数据"
        >
          <el-table-column type="selection" :reserve-selection="true" align="center"></el-table-column>
          <el-table-column prop="phone" label="学员手机号" align="center"></el-table-column>
          <el-table-column prop="ch_name" label="中文名" align="center"></el-table-column>
          <el-table-column prop="en_name" label="英文名" align="center"></el-table-column>
          <el-table-column prop="nyk_student_number" label="飞博学员编码" align="center"></el-table-column>
          <el-table-column prop="type_name" label="类型" align="center"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination @page="handleSizeChange" @pagesize="handleCurrentChange" :pageData="pageData"></pagination>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialog.centerDialogVisible=false">确 定</el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import { searchUserItem, store } from "@/api/message/push";
import { getToken } from "@/utils/auth";
import Pagination from "@/components/pagination";

export default {
  props: {
    addDialog: Object
  },
  components: {
    pagination: Pagination
  },
  data() {
    return {
      //分页
      pageData: {
        pageSizes: [10, 20],
        pageSize: 10,
        page: 1,
        total: null,
        layout: "total, sizes, prev, pager, next, jumper"
      },
      form: {
        name: "",
        redirect_url: "",
        style_type: "",
        start_time: "",
        end_time: "",
        imageUrl: "",
        sort: "",
        select_user_id_str: "",
        date: []
      },
      rules: {
        name: [{ required: true, message: "请输入消息标题", trigger: "blur" }],
        redirect_url: [
          { required: true, message: "请输入跳转链接", trigger: "blur" }
        ],
        style_type: [
          { required: true, message: "请选择样式选择", trigger: "change" }
        ],
        select_user_id_str: [
          { required: true, message: "请选择推送目标", trigger: "change" }
        ],
        date: [{ required: true, message: "请选择时间", trigger: "change" }]
        // imageUrl: [{ required: true, message: "请上传图片", trigger: "change" }]
      },
      baseUrl: "",
      dialog: {
        centerDialogVisible: false
      },
      showBtn: false,
      tableData: [],
      lists: [],
      selectedData: [],
      handleSelection: [],
      center: {},
      search: {
        searchCode: "",
        status: []
      },
      option: [
        {
          value: 1,
          label: "其他"
        },
        {
          value: 2,
          label: "麦禾学员"
        },
        {
          value: 3,
          label: "米格鲁学员"
        }
      ]
    };
  },
  created() {
    let url = this.$axios.defaults.baseURL;
    let endlength = url.indexOf("/index");
    this.baseUrl = url.substring(0, endlength);
  },
  methods: {
    hideDialog() {
      this.addDialog.centerDialogVisible = false;
      this.setCurrent();
      this.$refs.form.resetFields();
      this.form = {
        name: "",
        redirect_url: "",
        style_type: "",
        start_time: "",
        end_time: "",
        imageUrl: "",
        sort: "",
        select_user_id_str: "",
        date: []
      };
      this.pageData.page = 1;
      this.pageData.total = null;
      this.showBtn = false;
      this.handleSelection = [];
      this.selectedData = [];
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
      this.$axios.post("api/Common/uploadImg", data).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: res.data.message || res.data.msg,
            type: "success"
          });
          this.form.imageUrl = res.data.data.url;
        }
      });
    },
    //推送目标切换
    selectUser(num) {
      if (num == "-4") {
        this.showBtn = true;
      } else {
        this.setCurrent();
        this.handleSelection = [];
        this.selectedData = [];
        this.showBtn = false;
      }
    },
    //选择学员
    selectStudent() {
      this.dialog.centerDialogVisible = true;
      let data = {
        limit: this.pageData.pageSize,
        page: this.pageData.page,
        key: this.search.searchCode,
        type_str: this.search.status.join(",")
      };
      searchUserItem(data).then(res => {
        if (res.code == 0) {
          this.tableData = res.data.data;
          this.pageData.page = res.data.current_page;
          this.pageData.pagesize = res.data.per_page;
          this.pageData.total = res.data.total;
        }
      });
    },
    //提交
    confirm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (!this.form.imageUrl) {
            this.$message({
              message: "请上传图片",
              type: "info"
            });
          } else if (
            this.form.select_user_id_str == -4 &&
            this.handleSelection.length == 0
          ) {
            this.$message({
              message: "请勾选部分学员",
              type: "info"
            });
          } else {
            this.$confirm("是否确定发送？", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              center: true
            })
              .then(() => {
                if (this.form.date.length > 0) {
                  this.form.start_time = this.form.date[0];
                  this.form.end_time = this.form.date[1];
                }
                let data = {
                  name: this.form.name,
                  redirect_url: this.form.redirect_url,
                  style_type: this.form.style_type,
                  start_time: this.form.start_time,
                  end_time: this.form.end_time,
                  img_url: this.form.imageUrl,
                  sort: this.form.sort,
                  select_user_id_str:
                    this.form.select_user_id_str == -4
                      ? this.handleSelection.join(",")
                      : this.form.select_user_id_str
                };
                console.log(data);
                // return;
                store(data).then(res => {
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
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消"
                });
              });
          }
        }
      });
    },
    //搜索
    handleSearch() {
      this.pageData.page = 1;
      this.pageData.total = null;
      this.selectStudent();
    },
    //每页多少条
    handleCurrentChange(val) {
      this.pageData.page = 1;
      this.pageData.pageSize = val;
      this.selectStudent();
    },

    //选取页数
    handleSizeChange(page) {
      this.pageData.page = page;
      this.selectStudent();
    },
    //选取
    handleSelectionChange(val) {
      this.handleSelection = [];
      this.selectedData = val;
      val.forEach(res => {
        this.handleSelection.push(res.id);
      });
    },
    setCurrent() {
      if (this.selectedData.length > 0) {
        this.$refs.singleTable.clearSelection();
      }
    },
    //取消
    cancel() {
      this.hideDialog();
    }
  },
  computed: {
    checkedWeight() {
      let totalWeight = 0;
      this.selectedData.forEach(item => {
        totalWeight += item.weight;
      });
      return totalWeight.toFixed(2);
    }
  }
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
.el-tag {
  margin-right: 5px !important;
}
.top {
  margin-bottom: 5px;
}
.uploadMsg{
  margin-top: 10px;
}
.uploadMsg div{
  line-height: 20px;
  color: red;
}
</style>