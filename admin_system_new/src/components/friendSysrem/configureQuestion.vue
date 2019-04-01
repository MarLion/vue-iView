<template>
  <div class="question-container content-pad">
    <div class="community-fun">
      <div class="community-ope">
        <Button type="default" icon="md-add" @click="addQuestion">添加问题</Button>
        <Button type="default" icon="ios-cloud-upload" @click="addQuestionBatch" class="ml15">批量导入</Button>
        <Button type="default" icon="ios-cloud-download" @click="downQuestionModal" class="ml15">下载模板</Button>
      </div>
    </div>
    <div class="community-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading"></Table>
      <Page :total="total" v-if="total>10" show-elevator show-total @on-change="pageChange" class="mt30"/>
    </div>
    <!--添加题目-->
    <Modal
      v-model="isAddQues"
      :loading="quesLoading"
      :mask-closable="false"
      title="添加题目"
      @on-ok="quesSub"
      @on-visible-change="isQuesVisible"
    >
      <Form :model="quesFormData" ref="quesForm" :rules="ruleValidate" :label-width="80">
        <FormItem label="题目：" prop="question">
          <Input type="text" v-model="quesFormData.question"></Input>
        </FormItem>
        <FormItem label="选项一：" prop="answerOne">
          <Input type="text" v-model="quesFormData.answerOne"></Input>
        </FormItem>
        <FormItem label="选项二：" prop="answerTwo">
          <Input type="text" v-model="quesFormData.answerTwo"></Input>
        </FormItem>
        <FormItem label="选项三：" prop="answerThree">
          <Input type="text" v-model="quesFormData.answerThree"></Input>
        </FormItem>
        <FormItem label="选项四：" prop="answerFour">
          <Input type="text" v-model="quesFormData.answerFour"></Input>
        </FormItem>
      </Form>
    </Modal>
    <!--批量导入-->
    <Modal
      v-model="batchQues"
      :mask-closable="false"
      title="批量导入题目"
      @on-visible-change="isBatchQuesVisible"
    >
      <div class="add-image">
        <p class="p">导入Excel：</p>
        <Upload :action="uploadUrl"
                ref="upload"
                :show-upload-list="true"
                :on-success="handleSuccess"
                :format="['xls','xlsx']"
                :on-format-error="handleFormatError"
                :before-upload="handleBeforeUpload"
                type="drag"
                style="display: inline-block;width:100px;">
          <div style="width: 100px;height:100px;line-height: 100px;">
            <Icon type="ios-add" size="40"></Icon>
          </div>
        </Upload>
      </div>
      <div slot="footer">
        <Button type="info"  @click="sure">确定</Button>
      </div>
    </Modal>
    <Modal
      title="提示"
      v-model="questionTip"
      :mask-closable = "false"
    >
      <p ref="questionTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "@/axios/axios";
  import * as base from '../../axios/base';
  import expandRow from '../public/rowExpand/ques';
  export default {
    components: { expandRow },
    name: "configureQuestion",
    data () {
      return {
        uploadUrl:base.baseUrl.serviceOne + 'questionBank/importExcel',
        total:'',
        loading:false,
        questionTip:false,
        batchQues:false,
        isAddQues:false,
        quesLoading:true,
        listParams:{
          pageNum:1,
          pageSize:10
        },
        listData:[],
        columns:[
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h(expandRow,{
                props: {
                  row: params.row.questionAnswerList
                }
              })
            }
          },
          {
            title:'问题',
            key:'question',
            align:'left'
          },
        ],
        quesFormData:{
          question:'',
          answerOne:'',
          answerTwo:'',
          answerThree:'',
          answerFour:''
        },
        ruleValidate:{
          question:[
            {required:true,message:'请填写题目'}
          ]
        }
      }
    },
    mounted () {
      this.getQuestionList();
    },
    methods:{
      getQuestionList:function () {
        this.loading = true;
        axios.QuestionList(this.listParams)
          .then(res => {
            //console.log(res);
            if (res.code === 200) {
              this.loading = false;
              this.listData = res.result.list;
              this.total = res.result.total;
            } else {
              this.questionTip = true;
              this.$refs.questionTip.innerHTML = res.message;
            }
          })
          .catch(error => {
            console.log(error);
            this.questionTip = true;
            this.$refs.questionTip.innerHTML = '查询出错！'
          })
      },
      addQuestion:function () {
        this.isAddQues = true;
      },
      addQuestionBatch:function () {
        this.batchQues = true;
      },
      downQuestionModal:function () {
        window.location.href = base.baseUrl.serviceOne + 'questionBank/downlaodExcel';
      },
      pageChange:function (page) {
        this.listParams.pageNum = page;
        this.getQuestionList();
      },
      del:function () {
        this.questionTip = false;
      },
      isBatchQuesVisible:function (value) {
        if  (!value) {
          this.$refs.upload.clearFiles();
        }
      },
      sure:function () {
        this.batchQues = false;
        this.$refs.upload.clearFiles();
      },
      handleSuccess:function (res,file,fileList) {
        //console.log(res);
        if (res.code === 200) {
          this.$Message.success(res.message);
          this.listParams.pageNum = 1;
          this.getQuestionList();
        } else {
          this.$Message.error(res.message);
        }
      },
      handleFormatError:function () {
        this.$Message.error('请选择Excel文件上传！');
      },
      handleBeforeUpload:function (file) {
        const len = file.name.length <= 50;
        if (!len) {
          this.$Message.error('文件名过长！');
        }
        return len;
      },
      quesSub:function () {
        this.$refs.quesForm.validate(valid => {
          if (valid) {
            axios.QuestionAdd(this.quesFormData)
              .then(res => {
                console.log(res);
                if (res.code === 200) {
                  this.resetQues();
                  this.$Message.error(res.message);
                  this.changModal();
                  this.getQuestionList();
                } else {
                  this.changModal();
                  this.$Message.error(res.message);
                }
              })
              .catch(error => {
                console.log(error);
                this.changModal();
                this.$Message.error('新增失败！');
              })
          } else {
            this.changModal();
          }
        })
      },
      isQuesVisible:function (value) {
        //console.log(value);
        if (!value) {
          this.resetQues();
        }
      },
      changModal:function () {
        this.quesLoading = false;
        this.$nextTick(() => {
          this.quesLoading = true;
        });
      },
      resetQues:function () {
        this.$refs.quesForm.resetFields();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .community-fun{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .community-search{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      line-height: 33px;
      padding-right: 30px;
    }
  }
  .community-list{
    padding-right: 20px;
  }
  .add-image{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .p{
    width: 80px;
    height: 90px;
    line-height: 90px;
    text-align: left;
    padding: 10px 0;
  }
</style>
