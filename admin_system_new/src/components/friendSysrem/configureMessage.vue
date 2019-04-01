<template>
  <div class="message-container content-pad">
    <div class="community-fun">
      <div class="community-ope">
        <Button type="default" icon="md-add" @click="addMessage">发布消息</Button>
      </div>
      <!--<div class="community-search">-->
        <!--<span class="ml15">创建日期从：</span>-->
        <!--<span><DatePicker type="date" format="yyyy-MM-dd" @on-change="messageStartTime" class="checkWid"></DatePicker></span>-->
        <!--<span class="ml15">创建日期止：</span>-->
        <!--<span><DatePicker type="date" format="yyyy-MM-dd" @on-change="messageEndTime" :options="endOption" class="checkWid"></DatePicker></span>-->
        <!--<span class="ml15">消息类型：</span>-->
        <!--<span>-->
            <!--<Select class="checkWid">-->
              <!--<Option v-for="item in typeList" :value="item.id" :key="item.id">{{item.name}}</Option>-->
            <!--</Select>-->
          <!--</span>-->
        <!--<span class="ml10"><Button icon="ios-search" @click="checkMessage">查询</Button></span>-->
      <!--</div>-->
    </div>
    <div class="community-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading"></Table>
      <Page :total="total" :current="listParams.page" v-if="total>10" show-elevator show-total @on-change="mesPageChange" class="mt30"/>
    </div>
    <!--发布-->
    <Modal
      v-model="isMes"
      :loading="mesLoading"
      :mask-closable="false"
      title="发布消息"
      @on-ok="mesSub"
      @on-visible-change="isMesVisible"
    >
      <Form :model="mesFormData" ref="mesForm" :rules="ruleValidate" :label-width="80" class="mt20">
        <FormItem label="消息类型：" prop="type">
          <Select>
            <Option v-for="item in typeList" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="消息内容：" prop="message">
          <Input type="textarea" v-model="mesFormData.message"></Input>
        </FormItem>
      </Form>
    </Modal>
    <!--弹框-->
    <Modal
      title="提示"
      v-model="mesTip"
      :mask-closable = "false"
    >
      <p ref="mesTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "../../axios/axios";
  const mesValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写消息内容'))
    } else {
      callback();
    }
  };
  export default {
    name: "configureMessage",
    data () {
      return {
        total:'',
        loading:false,
        isMes:false,
        mesLoading:true,
        mesTip:false,
        listParams:{
          createTimeStart:'',
          page:1,
          size:10
        },
        mesFormData:{
          message:''
        },
        typeList:[
          {
            name:'不限',
            id:3
          },
          {
            name:'账户通知',
            id:0
          },
          {
            name:'VIP服务通知',
            id:1
          },
          {
            name:'账号通知',
            id:2
          }
        ],
        listData:[],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'消息编号',
            key:'',
            align:'center'
          },
          {
            title:'消息类型',
            key:'',
            align:'center'
          },
          {
            title:'内容',
            key:'',
            align:'center'
          },
          {
            title:'状态',
            key:'',
            align:'center'
          },
          {
            title:'创建日期',
            key:'',
            align:'center'
          },
        ],
        endOption:{
          disabledDate : date =>  {
            const d = new Date(this.listParams.createTimeStart);
            return date && date.valueOf() < d;
          }
        },
        ruleValidate:{
          message:[
            {validator:mesValidate}
          ]
        }
      }
    },
    mounted () {

    },
    methods:{
      addMessage:function () {
        this.isMes = true;
      },
      messageStartTime:function (date) {

      },
      messageEndTime:function (date) {

      },
      checkMessage:function () {
        this.listParams.page = 1;
      },
      mesPageChange:function (page) {
        this.listParams.page = page;
      },
      mesSub:function () {
        this.$refs. mesForm.validate(valid => {
          if (valid) {
            axios.PropelSysMessage(this.mesFormData)
              .then(res => {
                console.log(res);
                this.isMes = false;
                this.resetMessage();
                if (res.code === '0') {
                  this.mesTip = true;
                  this.$refs.mesTip.innerHTML = '消息推送成功！';
                } else {
                  this.mesTip = true;
                  this.$refs.mesTip.innerHTML = '消息推送失败！';
                }
              })
              .catch(error => {
                console.log(error);
                this.mesTip = true;
                this.$refs.mesTip.innerHTML = '消息推送失败！';
              })
          }
        })
      },
      isMesVisible:function (value) {
        if (!value) {
          this.resetMessage();
        }
      },
      changModal:function () {
        this.mesLoading = false;
        this.$nextTick(() => {
          this.mesLoading = true;
        });
      },
      resetMessage:function () {
        this.$refs.mesForm.resetFields();
      },
      del:function () {
        this.mesTip = false;
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
