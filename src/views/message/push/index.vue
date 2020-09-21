<template>
  <div class="container">
    <div class="top">
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="search.name"
        clearable
        placeholder="请输入名字"
      ></el-input>
      <el-date-picker v-model="search.time" type="datetime" placeholder="选择有效时间"></el-date-picker>
      <el-button
        size="small"
        type="primary"
        icon="el-icon-search"
        class="handleSearch"
        @click="handleSearch()"
      >查询</el-button>
      <el-button
        class="add"
        size="small"
        type="primary"
        icon="el-icon-circle-plus"
        @click="addMsg()"
      >新建弹窗消息</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%" empty-text="暂无数据">
      <el-table-column prop="index_number" width="50px" label="序号" align="center"></el-table-column>
      <el-table-column prop="name" label="消息标题" align="center"></el-table-column>
      <el-table-column prop="style_type_name" label="样式" align="center"></el-table-column>
      <el-table-column width="170" label="有效期" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.start_time}}至{{scope.row.end_time}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="redirect_url" label="跳转链接" align="center"></el-table-column>
      <el-table-column label="图片地址" align="center">
        <template slot-scope="scope">
          <el-image
            :preview-src-list="srcList"
            style="width:100px;height100px"
            :src="scope.row.img_url"
            fit="contain-down"
            lazy
          ></el-image>

        </template>
      </el-table-column>
      <el-table-column label="推送目标" align="center">
        <template slot-scope="scope">
          <div
            class="details"
            v-if="scope.row.select_user_id_str_name =='部分学员'"
            @click="details(scope)"
          >{{scope.row.select_user_id_str_name}}</div>
          <div v-else>{{scope.row.select_user_id_str_name}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="created_time" label="创建时间" align="center"></el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination @page="handleSizeChange" @pagesize="handleCurrentChange" :pageData="pageData"></pagination>
    <pushDetailsDialog :dialog="dialog"></pushDetailsDialog>
    <addMsgDialog :addDialog="addDialog" @upData="getData"></addMsgDialog>
  </div>
</template>
<script>
import Pagination from "@/components/pagination";
import PushDetailsDialog from "@/components/message/pushDetailsDialog";
import AddMsgDialog from "@/components/message/addMsgDialog";
import { popupadv, destroy } from "@/api/message/push";
export default {
  components: {
    pagination: Pagination,
    pushDetailsDialog: PushDetailsDialog,
    addMsgDialog: AddMsgDialog,
  },
  data() {
    return {
      //页面数据
      tableData: [],
      //分页
      pageData: {
        pageSizes: [10, 20],
        pageSize: 10,
        page: 1,
        total: null,
        layout: "total, sizes, prev, pager, next, jumper",
      },
      //dialog信息
      dialog: {
        centerDialogVisible: false,
        id: "",
      },
      addDialog: {
        centerDialogVisible: false,
      },
      
      formData: {},
      search: {
        name: "",
        time: "",
      },
      multipleSelection: [],
      srcList:[]
    };
  },

  created() {
    this.getData();
  },
  methods: {
    //获取页面数据
    getData() {
      this.srcList = []
      let data = {
        limit: this.pageData.pageSize,
        page: this.pageData.page,
        name: this.search.name,
        time: this.search.time,
      };
      popupadv(data)
        .then((res) => {
          if (res.code == 0) {
            res.data.data.forEach((result) => {
              this.srcList.push(result.img_url);
            });
            this.tableData = res.data.data;
            this.pageData.page = res.data.current_page;
            this.pageData.pagesize = res.data.per_page;
            this.pageData.total = res.data.total;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //删除
    handleDelete(scope) {
      let data = {
        id: scope.row.id,
      };
      this.$confirm("是否删除该条信息?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          destroy(data).then((res) => {
            if (res.code == 0) {
              this.getData();
              this.$message({
                type: "success",
                message: res.message,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //进入部分学员详情
    details(scope) {
      this.dialog.centerDialogVisible = true;
      this.dialog.id = scope.row.id;
    },
    //添加
    addMsg() {
      this.addDialog.centerDialogVisible = true;
    },
    // 搜索
    handleSearch() {
      this.pageData.page = 1;
      this.pageData.total = null;
      this.getData();
    },
    //每页多少条
    handleCurrentChange(val) {
      this.pageData.page = 1;
      this.pageData.pageSize = val;
      this.getData();
    },
    //选取页数
    handleSizeChange(page) {
      this.pageData.page = page;
      this.getData();
    },
  },
};
</script>
<style scoped>
.top {
  position: relative;
  height: 45px;
}

.add {
  position: absolute;
  right: 0;
  top: 4px;
}
.pagination {
  text-align: right;
  padding: 10px;
}
.details:hover {
  cursor: pointer;
}
.add {
  margin-left: auto;
  margin-bottom: 10px;
  display: block;
}
</style>