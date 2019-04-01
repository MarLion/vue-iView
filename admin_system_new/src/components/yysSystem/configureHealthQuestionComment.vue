<template>
  <div class="content-pad">
    <div class="route-fun">
      <div class="route-ope">
        <Button type="default" icon="md-add" @click="addComment">添加评论</Button>
      </div>
      <div class="route-search">
        <Breadcrumb>
          <BreadcrumbItem to="/configureHealthQuestion">健康问答</BreadcrumbItem>
          <BreadcrumbItem>评论清单</BreadcrumbItem>
        </Breadcrumb>
      </div>
    </div>
    <div class="route-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading"></Table>
      <Page :total="total" v-if="total>10" show-elevator show-total class="mt30" @on-change="pageChange"/>
    </div>
    <!--添加评论-->
    <Modal
      v-model="addMent"
      :loading="commentLoading"
      :mask-closable="false"
      title="添加关键词"
      @on-ok="commentSub"
      @on-visible-change="isCommentVisible"
    >
      <Form :model="commentData" ref="commentData" :rules="ruleValidate" :label-width="80">
        <FormItem label="用户账号：" prop="loginName">
          <Input type="text" v-model="commentData.loginName"></Input>
        </FormItem>
        <FormItem label="评论内容：" prop="comment">
          <Input type="textarea" v-model="commentData.comment"></Input>
        </FormItem>
      </Form>
    </Modal>
    <!--提示-->
    <Modal
      title="提示"
      v-model="commentTip"
      :mask-closable = "false"
    >
      <p ref="commentTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "@/axios/axios";
  const loginValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写玄乐账号'))
    } else {
      callback();
    }
  };
  const commentValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写评论内容'))
    } else {
      callback();
    }
  };
  export default {
    name: "configureHealthQuestionComment",
    data () {
      return {
        total:'',
        loading:false,
        commentTip:false,
        addMent:false,
        commentLoading:true,
        listParams:{
          healthId:'',
          page:1,
          size:10
        },
        listData:[],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'评论内容',
            key:'comment',
            align:'center'
          },
          {
            title:'回复时间',
            key:'createTime',
            width:300,
            align:'center'
          },
        ],
        commentData:{
          healthId:'',
          loginName:'',
          comment:'',
        },
        ruleValidate:{
          loginName:[
            {validator:loginValidate}
          ],
          comment:[
            {validator:commentValidate}
          ]
        }
      }
    },
    mounted () {
      this.listParams.healthId =  this.$route.query.healthId;
      this.commentData.healthId =  this.$route.query.healthId;
      this.getCommentList();
    },
    methods:{
      getCommentList:function () {
        this.loading = true;
        axios.HealthQuesAnswerList(this.listParams)
          .then(res => {
            //console.log(JSON.stringify(res.result.list[0]));
            if (res.code === 200) {
              this.loading = false;
              this.listData = res.result.list;
              this.total = res.result.total;
            } else {
              this.commentTip = true;
              this.$refs.commentTip.innerHTML = '查询出错！'
            }
          })
          .catch(error => {
            console.log(error);
            this.commentTip = true;
            this.$refs.commentTip.innerHTML = '查询出错！'
          })
      },
      addComment:function () {
        this.addMent = true;
      },
      pageChange:function (page) {
        this.listParams.page = page;
        this.getCommentList();
      },
      del:function () {
        this.commentTip = false;
      },
      commentSub:function () {
        this.$refs.commentData.validate(valid => {
          if (valid) {
            axios.HealthQuesAnswerSave(this.commentData)
              .then(res => {
                //console.log(res);
                this.commentTip = true;
                this.$refs.commentTip.innerHTML = res.message;
                if (res.code === 200) {
                  this.addMent = false;
                  this.listParams.page = 1;
                  this.getCommentList();
                } else {
                  this.changeCommentLoading();
                }
              })
              .catch(error => {
                console.log(error);
                this.changeCommentLoading();
                this.commentTip = true;
                this.$refs.commentTip.innerHTML = '评论失败！'
              })
          } else {
            this.changeCommentLoading();
          }
        })
      },
      isCommentVisible:function (value) {
        if (!value) {
          this.clearCommentData();
        }
      },
      changeCommentLoading:function () {
        this.commentLoading = false;
        this.$nextTick(() => {
          this.commentLoading = true;
        });
      },
      clearCommentData:function () {
        this.$refs.commentData.resetFields();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .route-fun{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .route-search{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      line-height: 33px;
      padding-right: 30px;
    }
  }
  .route-list{
    padding-right: 20px;
  }
</style>
