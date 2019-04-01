<template>
  <div class="ticket-container content-pad">
    <div>
      <div class="ticket-fun">
        <div class="ticket-ope">
          <Button type="default" icon="md-add" @click="addTicket">发布活动券</Button>
          <Button type="default" icon="ios-download" @click="exportData">导出EXCEL</Button>
        </div>
        <div class="ticket-search">
          <span class="ml15">创建日期从：</span>
          <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="chooseTicketStart" :options="begOption" class="checkWid"></DatePicker></span>
          <span class="ml15">创建日期止：</span>
          <span><DatePicker format="yyyy-MM-dd" @on-change="chooseTicketEnd" type="date" :options="endOption" class="checkWid"></DatePicker></span>
          <span class="ml15">活动券名称：</span>
          <span><Input v-model="ticketCheckData.name" class="checkWid"/></span>
          <span class="ml15">状态类型：</span>
          <span>
            <Select v-model="ticketCheckData.status" class="checkWid">
              <Option v-for="(item,index) in ticketStaList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
          </span>
          <span class="ml10"><Button icon="ios-search" @click="ticketClick">查询</Button></span>
        </div>
      </div>
      <div class="ticket-list mt30">
        <Table border :columns="columns" :data="listData" :loading="loading"></Table>
        <Page :total="total" :current="ticketCheckData.page" v-if="total>10" show-elevator show-total class="mt30" @on-change="ticPage"/>
      </div>
    </div>
    <!--新增-->
    <Drawer
      title="创建活动券"
      v-model="value2"
      width="720"
      :mask-closable="false"
      :styles="styles"
      @on-close = 'clearTicketForm'
    >
      <div class="add-title">
          <span>
            <span class="add-tips"><Icon type="md-information-circle" />友情提示：湖北电视台工作人员使用，配置专用账户！</span>
          </span>
      </div>
      <div class="add-form mt30">
      <Form :model="ticketData" ref="ticketData" :rules="ruleValidate" :label-width="100" style="width: 500px;margin-top: 20px;">
        <FormItem label="活动类型：">
          <Select v-model="ticketData.actType" @on-change="getAct" style="width:100%;" >
            <Option v-for="(item,index) in actType" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="关联活动：">
          <Select v-model="ticketData.actId" style="width:100%;" >
            <Option v-for="(item,index) in actList" :value="item.actId" :key="index">{{ item.actName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="活动券名：" prop="name">
          <Input type="text" v-model="ticketData.name" :maxlength="20"></Input>
        </FormItem>
        <FormItem label="活动券类型：" prop="type">
          <Select v-model="ticketData.type" style="width:100%;" >
            <Option v-for="(item,index) in ticType" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="发放数量：" prop="num">
          <InputNumber  v-model="ticketData.num" :max="100000" :min="0" style="width: 100%;"></InputNumber>
        </FormItem>
        <FormItem label="优惠价格：" prop="price">
          <InputNumber  v-model="ticketData.price" :max="100000" :min="0" style="width: 85%;"></InputNumber><span class="ml10">玄乐币</span>
        </FormItem>
        <FormItem label="有效期至：">
          <DatePicker type="date" format="yyyy-MM-dd" v-model="ticketData.startTime" :options="addEndOption" @on-change="startTimeChoose" style="width: 100%"></DatePicker>
        </FormItem>
        <FormItem style="width: 200px!important;">
          <Button type="primary" @click="ticketSub" :loading="ticketAdding">发布活动券</Button>
        </FormItem>
      </Form>
    </div>
    </Drawer>
    <!--详情-->
    <Drawer
      title="活动券详情"
      v-model="delValue"
      width="720"
      :mask-closable="false"
      :styles="styles"
      @on-close = 'clearTicketDetail'
    >
      <div class="add-title">
          <span>
            <span class="add-tips"><Icon type="md-information-circle" />友情提示：湖北电视台工作人员使用，配置专用账户！</span>
          </span>
      </div>
      <div class="add-detail">
        <p class="p">活动券名称：</p>
        <p class="detailSpan">{{ticDetailData.name}}</p>
      </div>
      <template v-if="ticDetailData.mold === 0">
        <div class="add-detail">
          <p class="p">活动时间：</p>
          <p class="detailSpan">{{ticDetailData.startTime}}</p>
        </div>
      </template>
      <template v-else>
        <div class="add-detail">
          <p class="p">有效期至：</p>
          <p class="detailSpan">{{ticDetailData.startTime}}</p>
        </div>
      </template>
      <div class="add-detail">
        <p class="p">活动地址：</p>
        <p class="detailSpan">{{ticDetailData.address}}</p>
      </div>
      <div class="add-detail">
        <p class="p">发放数量：</p>
        <p class="detailSpan">{{ticDetailData.num}}</p>
      </div>
      <div class="add-detail">
        <p class="p">优惠价格：</p>
        <p class="detailSpan">{{ticDetailData.price}}</p>
      </div>
      <div class="add-detail">
        <p class="p">已领取：</p>
        <p class="detailSpan">{{ticDetailData.enterNum}}</p>
      </div>
    </Drawer>
    <!--修改-->
    <Drawer
      title="活动券修改"
      v-model="reviseValue"
      width="720"
      :mask-closable="false"
      :styles="styles"
      @on-close = 'clearTicketRevise'
    >
      <div class="add-title">
          <span>
            <span class="add-tips"><Icon type="md-information-circle" />友情提示：湖北电视台工作人员使用，配置专用账户！</span>
          </span>
      </div>
      <Form :model="ticketReviseData" ref="ticketRevise" :rules="ruleValidate" :label-width="100" style="width: 500px;margin-top: 20px;">
        <FormItem label="活动券名：" prop="name">
          <Input type="text" v-model="ticketReviseData.name" :maxlength="20"></Input>
        </FormItem>
        <FormItem label="发放数量：" prop="num">
          <InputNumber v-model="ticketReviseData.num" :max="100000" :min="0" style="width: 100%;"></InputNumber>
        </FormItem>
        <FormItem label="优惠价格：" prop="price">
          <InputNumber  v-model="ticketReviseData.price" :max="100000" :min="0" style="width: 85%;"></InputNumber><span class="ml10">玄乐币</span>
        </FormItem>
        <template v-if="ticketReviseData.mold === 1">
          <FormItem label="有效期至：">
            <DatePicker type="date" format="yyyy-MM-dd" v-model="ticketReviseData.startTime" :options="addEndOption" @on-change="startTimeChooseRe" style="width: 100%;"></DatePicker>
          </FormItem>
        </template>
        <FormItem style="width: 200px!important;">
          <Button type="primary" @click="ticketReviseSub" :loading="ticketRevise">确定修改</Button>
        </FormItem>
      </Form>
    </Drawer>
    <Modal
      title="提示"
      v-model="ticTip"
      :mask-closable = "false"
    >
      <p ref="ticTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
    <Modal
      title="提示"
      v-model="ticSuccess"
      :mask-closable = "false"
    >
      <p ref="addTicTip"></p>
      <div slot="close"></div>
      <div slot="footer">
        <Button type="warning"  @click="goTicList">返回列表</Button>
        <Button type="info"  @click="addTicMore">继续添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "@/axios/axios";
  import * as base from '../../axios/base';
  export default {
    name: "actTicketSystem",
    data () {
      return {
        value2:false,
        delValue:false,
        reviseValue:false,
        ticketAdding:false,
        ticketRevise:false,
        ticTip:false,
        ticSuccess:false,
        loading:false,
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        ticketStaList:[
          {
            value:'3',
            label:'全部'
          },
          {
            value:'0',
            label:'正常'
          },
          {
            value:'1',
            label:'已结束'
          },
          {
            value:'2',
            label:'已取消'
          }
        ],
        //活动类型
        actType:[
          {
            value:3,
            label:'不限'
          },
          {
            value:1,
            label:'相亲专栏'
          },
          {
            value:2,
            label:'节目专栏'
          }
        ],
        //活动列表
        actList:[],
        //活动券类型
        ticType:[
          {
            value:0,
            label:'活动入场券'
          },
          {
            value:1,
            label:'新人专享券'
          }
        ],
        begOption:{
          disabledDate : date =>  {
            const d = new Date(this.ticketCheckData.createTimeEnd);
            return date && date.valueOf() > d;
          }
        },
        endOption:{
          disabledDate : date =>  {
            const d = new Date(this.ticketCheckData.createTimeStart);
            return date && date.valueOf() < d - 24*60*60*1000;
          }
        },
        //查询参数
        ticketCheckData:{
          name:'',
          status:'',
          createTimeStart:'',
          createTimeEnd:'',
          page:1,
          rows:10
        },
        listData:[],
        total:'',
        //新增
        ticketData:{
          //登录用户的id 先不管 传测试id
          creatorId:'123456',
          actType:'',
          actId:'',
          name:'',
          type:'',
          num:null,
          price:0,
          startTime:''
        },
        //详情
        ticDetailData:{
          mold:0,
          name:'',
          startTime:'',
          address:'',
          num:'',
          price:'',
          enterNum:''
        },
        //修改
        ticId:'',
        ticketReviseData:{
          mold:0,
          id:'',
          name:'',
          num:null,
          price:null,
          startTime:''
        },
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'活动编号',
            key:'couponNo',
            align:'center'
          },
          {
            title:'活动券名称',
            key:'name',
            align:'center'
          },
          {
            title:'相关活动',
            key:'actName',
            align:'center'
          },
          {
            title:'状态',
            key:'statusName',
            align:'center'
          },
          {
            title:'发放数量',
            key:'num',
            align:'center'
          },
          {
            title:'已领取',
            key:'enterNum',
            align:'center'
          },
          {
            title:'优惠价格',
            key:'price',
            align:'center'
          },
          {
            title:'活动地址',
            key:'address',
            align:'center'
          },
          {
            title:'活动时间',
            key:'startTime',
            align:'center'
          },
          {
            title:'操作选项',
            key:'action',
            align:'center',
            width:300,
            render:(h,params) => {
              if (params.row.status === 0) {
                return h('div',[
                  h('Button',{
                    props:{
                      type:'success',
                      size:'small'
                    },
                    style:{
                      marginRight:'5px'
                    },
                    on:{
                      click: () => {
                        this.getTicketDetail(params.row.id);
                      }
                    }
                  },'详情'),
                  h('Button',{
                    props:{
                      type:'info',
                      size:'small'
                    },
                    style:{
                      marginRight:'5px'
                    },
                    on:{
                      click: () => {
                        this.ticketReviseMes(params.row.id)
                      }
                    }
                  },'修改'),
                  h('Button',{
                    props:{
                      type:'error',
                      size:'small'
                    },
                    style:{
                      marginRight:'5px'
                    },
                    on:{
                      click: () => {
                        axios.TicketCancel({id:params.row.id})
                          .then(res => {
                            this.ticTip = true;
                            this.$refs.ticTip.innerHTML = res.message;
                            if (res.code === 200) {
                              this.getTicketList();
                            }
                          })
                          .catch(error => {
                            console.log(error);
                            this.ticTip = true;
                            this.$refs.ticTip.innerHTML = '取消出错！'
                          })
                      }
                    }
                  },'取消'),
                  h('Button',{
                    props:{
                      type:'warning',
                      size:'small'
                    },
                    style:{
                      marginRight:'5px'
                    },
                    on:{
                      click: () => {
                        this.$router.push({path:'/actTicketSignList',query:{couponId:params.row.id}});
                      }
                    }
                  },'领取清单'),
                  /*
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {

                      }
                    }
                  }, '推送'),
                  */
                ])
              } else if (params.row.status === 1) {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small',
                      disabled:true
                    },
                    style: {
                      marginRight: '5px'
                    }
                  }, '该活动已结束')
                ])
              } else {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small',
                      disabled:true
                    },
                    style: {
                      marginRight: '5px'
                    }
                  }, '该活动券已取消')
                ])
              }
            }
          },
        ],
        ruleValidate:{
          actType:[
            {required:true,message:'请选择活动类型'}
          ],
          actId:[
            {required:true,message:'请选择活动'}
          ],
          name:[
            {required:true,message:'请填写活动券名称'}
          ],
          type:[
            {required:true,message:'请选择活动券类型'}
          ],
          num:[
            {required:true,message:'请填写发放数量'}
          ],
          // price:[
          //   {required:true,message:'请填写优惠价格'}
          // ],
          startTime:[
            {required:true,message:'请填写有效日期'}
          ]
        },
        addEndOption:{
          disabledDate : date =>  {
            return date && date.valueOf() < Date.now() - 24*60*60*1000;
          }
        },
      }
    },
    mounted () {
      this.getTicketList();
    },
    methods:{
      ticketClick:function () {
        this.ticketCheckData.page = 1;
        this.getTicketList();
      },
      getTicketList:function () {
        this.loading = true;
        axios.TicketList(this.ticketCheckData)
          .then(res => {
            //console.log(res);
            if (res.code === 200) {
              this.listData = res.result.list;
              this.total = res.result.total;
              this.loading =false;
            } else {
              this.ticTip = true;
              this.$refs.ticTip.innerHTML = res.message;
            }
          })
          .catch(error => {
            console.log(error);
            this.ticTip = true;
            this.$refs.ticTip.innerHTML = '查询出错！'
          })
      },
      getAct:function () { //根据活动类型获取活动列表
        if (this.value2) {
          this.ticketData.actId = '';
          axios.TicketGetActList({actType:this.ticketData.actType})
            .then(res => {
              //console.log(res);
              if (res.code === 200) {
                this.actList = res.result;
              } else {
                this.ticTip = true;
                this.$refs.ticTip.innerHTML = res.message;
              }
            })
            .catch(error => {
              console.log(error);
              this.ticTip = true;
              this.$refs.ticTip.innerHTML = '获取活动列表出错！'
            })
        }
      },
      addTicket:function () { //新增开关
        this.value2 = true;
      },
      exportData:function () { //导出表格
        window.location.href =base.baseUrl.serviceOne + 'coupon/exportCouponList?name='+this.ticketCheckData.name+'&status='+this.ticketCheckData.status+'&createTimeStart='+this.ticketCheckData.createTimeStart+'&createTimeEnd='+this.ticketCheckData.createTimeEnd;
      },
      chooseTicketStart:function (date) { //选择查询开始时间
        this.ticketCheckData.createTimeStart = date;
      },
      chooseTicketEnd:function (date) { //查询结束时间
        this.ticketCheckData.createTimeEnd = date;
      },
      ticPage:function (page) { //切换页码
        this.ticketCheckData.page = page;
        this.getTicketList();
      },
      //新增
      startTimeChoose:function (date) {
        this.ticketData.startTime = date;
      },
      ticketSub:function () { //新增提交
        this.$refs.ticketData.validate(valid => {
          if (valid) {
            this.ticketAdding = true;
            axios.TicketAdd(this.ticketData)
              .then(res => {
                //console.log(res);
                this.ticketAdding = false;
                if (res.code === 200) {
                  this.ticSuccess = true;
                  this.$refs.addTicTip.innerHTML = res.message;
                } else {
                  this.ticTip = true;
                  this.$refs.ticTip.innerHTML = res.message;
                }
              })
              .catch(error => {
                console.log(error);
                this.ticTip = true;
                this.$refs.ticTip.innerHTML = '发布出错！';
                this.ticketAdding = false;
              })
          }
        })
      },
      //详情
      getTicketDetail:function(id){
        axios.TicketDetail({id:id})
          .then(res => {
            console.log(res);
            if (res.code === 200) {
              this.ticDetailData.mold = res.result.mold;
              this.ticDetailData.name = res.result.name;
              this.ticDetailData.address = res.result.address;
              this.ticDetailData.startTime = res.result.startTime;
              this.ticDetailData.num = res.result.num;
              this.ticDetailData.price = res.result.price;
              this.ticDetailData.enterNum = res.result.enterNum;
              this.delValue = true;
            } else {
              this.ticTip = true;
              this.$refs.ticTip.innerHTML = res.message;
            }
          })
          .catch(error => {
            console.log(error);
            this.ticTip = true;
            this.$refs.ticTip.innerHTML = '查询出错！';
          })
      },
      //修改
      startTimeChooseRe:function (date) {
        this.ticketReviseData.startTime = date;
      },
      ticketReviseMes:function (id) {
        this.ticId = id;
        axios.TicketDetail({id:id})
          .then(res => {
            console.log(res);
            if (res.code === 200) {
              this.ticketReviseData.mold = res.result.mold;
              this.ticketReviseData.name = res.result.name;
              this.ticketReviseData.num = res.result.num;
              this.ticketReviseData.price = res.result.price;
              this.ticketReviseData.startTime = res.result.startTime;
              this.reviseValue = true;
            } else {
              this.ticTip = true;
              this.$refs.ticTip.innerHTML = res.message;
            }
          })
          .catch(error => {
            console.log(error);
            this.ticTip = true;
            this.$refs.ticTip.innerHTML = '查询出错！';
          })
      },
      ticketReviseSub:function () { //提交修改
        this.ticketRevise = true;
        this.ticketReviseData.id = this.ticId;
        this.ticketReviseData.startTime = this.$trans.timeTranslate(this.ticketReviseData.startTime);
        axios.TicketRevise(this.ticketReviseData)
          .then(res => {
            //console.log(res);
            this.ticketRevise = false;
            this.ticTip = true;
            this.$refs.ticTip.innerHTML = res.message;
            if (res.code === 200) {
              this.ticId = '';
              this.clearTicketRevise();
              this.reviseValue = false;
              this.getTicketList();
            }
          })
          .catch(error => {
            console.log(error);
            this.ticketRevise = false;
            this.ticTip = true;
            this.$refs.ticTip.innerHTML = '修改出错！';
          })
      },
      //清空表单
      clearTicketForm:function () {  //清空新增
        this.ticketData.actType = '';
        this.ticketData.actId = '';
        this.actList = [];
        this.ticketData.startTime = '';
        this.$refs.ticketData.resetFields();
      },
      clearTicketDetail:function () { //清空详情
        this.ticDetailData.name = '';
        this.ticDetailData.startTime = '';
        this.ticDetailData.address = '';
        this.ticDetailData.num = '';
        this.ticDetailData.enterNum = '';
      },
      clearTicketRevise:function () { //清空修改
        this.$refs.ticketRevise.resetFields();
      },
      del:function () { //关闭弹框
        this.ticTip = false;
      },
      goTicList:function () {
        this.clearTicketForm();
        this.ticSuccess = false;
        this.value2 = false;
        this.ticketCheckData.name = '';
        this.ticketCheckData.status = '';
        this.ticketCheckData.createTimeStart = '';
        this.ticketCheckData.createTimeEnd = '';
        this.ticketCheckData.page = 1;
        this.ticketCheckData.rows= 10;
        this.getTicketList();
      },
      addTicMore:function () {
        // this.clearTicketForm();
        //this.ticketData.actType = '';
        this.ticketData.actId = '';
        this.ticketData.startTime = '';
        this.ticketData.price = 0;
        // this.actList = [];
        this.reSetForm();
        this.ticSuccess = false;
        this.ticketCheckData.name = '';
        this.ticketCheckData.status = '';
        this.ticketCheckData.createTimeStart = '';
        this.ticketCheckData.createTimeEnd = '';
        this.ticketCheckData.page = 1;
        this.ticketCheckData.rows= 10;
        this.getTicketList();
      },
      //自定义重置方法
      reSetForm:function () {
        this.$refs.ticketData.fields.forEach(function (e) {
          if (e.prop === 'name') {
            e.resetField();
          }
          if (e.prop === 'type') {
            e.resetField();
          }
          if (e.prop === 'num') {
            e.resetField();
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .ticket-fun{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .ticket-search{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      line-height: 33px;
      padding-right: 30px;
    }
  }
  .ticket-list{
    padding-right: 20px;
  }
  .add-title{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 20px;
    padding: 10px;
    border-bottom: 1px solid #99BBE8;
    .add-tips{
      font-size: 14px;
    }
    .add-close{
      cursor: pointer;
    }
  }
  .add-detail{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-top: 40px;
    .p{
      width: 100px;
      text-align: right;
      padding: 10px 12px 10px 0;
    }
  }
  .detailSpan{
    padding: 10px 0;
  }
  .detailWidth{
    width: 500px;
  }
  .demo-upload-list{
    display: inline-block;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
