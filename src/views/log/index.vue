<template>
  <div class="container">
    <div class="top">
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="search.operator_name"
        clearable
        placeholder="请输入操作账号"
      ></el-input>
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="search.ip"
        clearable
        placeholder="请输入IP"
      ></el-input>
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="search.desc"
        clearable
        placeholder="请输入描述"
      ></el-input>
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
      style="width: 100%"
      empty-text="暂无数据"
      @selection-change="handleSelectionChange"
      @sort-change="arraySpanMethod"
    >
      <el-table-column prop="username" label="操作人" align="center"></el-table-column>
      <el-table-column prop="opt_time" sortable label="操作时间" align="center"></el-table-column>
      <el-table-column prop="operator_ip" label="IP" align="center"></el-table-column>
      <el-table-column prop="opt_desc" label="操作描述" align="center"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination @page="handleSizeChange" @pagesize="handleCurrentChange" :pageData="pageData"></pagination>
  </div>
</template>
<script>
import Pagination from "@/components/pagination";
import { getOperatorLog } from "@/api/log/logList";
export default {
  components: {
    pagination: Pagination
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
        layout: "total, sizes, prev, pager, next, jumper"
      },
      //dialog信息
      dialog: {
        centerDialogVisible: false,
        dialogType: "",
        id: ""
      },
      //设置dialog信息
      guaranteeDialogs: {
        centerDialogVisible: false,
        id: ""
      },
      formData: {},
      search: {
        operator_name: "",
        ip: "",
        desc: ""
      },
      multipleSelection: []
    };
  },

  created() {
    this.getData();
  },
  methods: {
    //获取页面数据
    getData() {
      let data = {
        limit: this.pageData.pageSize,
        page: this.pageData.page,
        operator_name: this.search.operator_name,
        ip: this.search.ip,
        desc: this.search.desc
      };

      getOperatorLog(data)
        .then(res => {
          if (res.code == 0) {
            this.tableData = res.data.data;
            this.pageData.page = res.data.current_page;
            this.pageData.pagesize = res.data.per_page;
            this.pageData.total = res.data.total;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //排序
    arraySpanMethod(prop) {
      this.search.order_field = prop.prop;
      switch (prop.order) {
        case "ascending":
          this.search.sort = "asc";
          break;
        case "descending":
          this.search.sort = "desc";
          break;
        case null:
          this.search.sort = "";
          this.search.order_field = "";
          break;
      }
      this.getData();
    },
    //多选
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
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
    //选取
    handleSelectionChange(val) {
      val.forEach(res => {
        this.multipleSelection.push(res.id);
      });
    }
  }
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
</style>