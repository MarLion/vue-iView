<template>
  <div class="community-container content-pad">
    <div>
      <div class="community-fun">
        <div class="community-ope">
          <Button type="default" icon="md-add" @click="addCommunity">新增话题</Button>
          <Button type="default" icon="ios-download" @click="exportData">导出EXCEL</Button>
        </div>
        <div class="community-search">
          <span class="ml15">创建日期从：</span>
          <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="comBeginTime" :options="begOption" class="checkWid"></DatePicker></span>
          <span class="ml15">创建日期止：</span>
          <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="comEndTime" :options="endOption" class="checkWid"></DatePicker></span>
          <span class="ml15">话题名称：</span>
          <span><Input v-model="listParams.name" class="checkWid"/></span>
          <span class="ml15">话题类型：</span>
          <span>
            <Select v-model="listParams.status" class="checkWid">
              <Option v-for="(item,index) in comList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
          </span>
          <span class="ml10"><Button icon="ios-search" @click="getCommunityList">查询</Button></span>
        </div>
      </div>
      <div class="community-list mt30">
        <Table border :columns="columns" :data="listData" :loading="loading"></Table>
        <Page :total="total" :current="listParams.page" v-if="total>10" show-elevator show-total @on-change="pageChangeCheck" class="mt30"/>
      </div>
    </div>
    <!--新增话题-->
    <Drawer
      title="新增话题"
      v-model="value3"
      width="720"
      :mask-closable="false"
      :styles="styles"
    >
      <div>
        <div class="add-title">
          <span>
            <span class="add-tips"><Icon type="md-information-circle" />友情提示：平台运营前期，运营人员使用！</span>
          </span>
        </div>
      </div>
      <div>
        <div class="add-form mt30">
          <div class="add-image">
            <p class="p">上传照片</p>
            <div class="demo-upload-list" v-for="item in uploadList">
              <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
              </template>
              <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
              </template>
            </div>
            <Upload action=""
                    ref="comUpload"
                    :show-upload-list="false"
                    :on-success="handleSuccess"
                    :format="['jpg','jpeg','png','bmp']"
                    :on-format-error="handleFormatError"
                    multiple
                    type="drag"
                    style="display: inline-block;width:100px;">
              <div style="width: 100px;height:100px;line-height: 100px;">
                <Icon type="ios-camera" size="40"></Icon>
              </div>
            </Upload>
            <modal title="查看照片" v-model="visible">
              <img :src="comBigUrl" style="width: 100%">
            </modal>
          </div>
          <Form :model="formData" ref="subCommunity" :rules="validateRules" :label-width="100" style="width: 500px;margin-top: 20px;">
            <FormItem label="话题名称：" prop="name">
              <Input type="text" v-model="formData.name"></Input>
            </FormItem>
            <FormItem label="话题口号：" prop="slogan">
              <Input type="text" v-model="formData.slogan"></Input>
            </FormItem>
            <FormItem label="话题标签：" prop="label">
              <Select v-model="formData.label" multiple>
                <Option v-for="item in labelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="话题坐标：" prop="location">
              <Select v-model="formData.location">
                <Option v-for="item in posList" :value="item.id" :key="item.id">{{ item.city }}</Option>
              </Select>
            </FormItem>
            <FormItem label="允许人数：" prop="member">
              <Input type="text" v-model="formData.member"></Input>
            </FormItem>
            <FormItem label="话题介绍：" prop="ins">
              <Input type="textarea" v-model="formData.ins"></Input>
            </FormItem>
            <FormItem style="width: 200px!important;">
              <Checkbox v-model="formData.isOpen" true-value="2" false-value="0">开放报名</Checkbox>
            </FormItem>
            <FormItem style="width: 200px!important;">
              <Button type="primary" @click="subCommunity">发布话题</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Drawer>
    <!--话题详情-->
    <Drawer
      title="话题详情"
      v-model="comDetailVaule"
      width="720"
      :mask-closable="false"
      :styles="styles"
    >
      <div class="add-title">
        <span>
          <span class="add-tips"><Icon type="md-information-circle" />友情提示：平台运营前期，运营人员使用！</span>
        </span>
      </div>
      <div class="add-form mt30">
        <div class="add-image">
          <p class="p">照&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;片：</p>
          <template v-if="comDetailData.isPhoto">
            <div class="demo-upload-list"  v-for="item in comDetailData.detailUploadList">
              <img :src="item">
            </div>
          </template>
          <template v-else>
            <div class="demo-upload-list">暂无图片</div>
          </template>
        </div>
        <div class="add-detail">
          <p class="p">话题名称：</p>
          <p class="detailSpan">{{comDetailData.name}}</p>
        </div>
        <div class="add-detail">
          <p class="p">圈&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;主：</p>
          <p class="detailSpan">{{comDetailData.userName}}</p>
        </div>
        <div class="add-detail">
          <p class="p">创建日期：</p>
          <p class="detailSpan">{{comDetailData.createTime}}</p>
        </div>
        <div class="add-detail">
          <p class="p">当前人数：</p>
          <p class="detailSpan">{{comDetailData.nowPerson}}</p>
          <p class="detailSpan">人</p>
        </div>
        <div class="add-detail">
          <p class="p">允许人数：</p>
          <p class="detailSpan">{{comDetailData.amount}}</p>
          <p class="detailSpan">人</p>
        </div>
        <div class="add-detail">
          <p class="p">话题口号：</p>
          <p class="detailSpan detailWidth">{{comDetailData.slogan}}</p>
        </div>
        <div class="add-detail">
          <p class="p">话题介绍：</p>
          <p class="detailSpan detailWidth">{{comDetailData.description}}</p>
        </div>
        <div class="add-detail">
          <p class="p">开放报名：</p>
          <p class="detailSpan detailWidth">{{comDetailData.isOpenName}}</p>
        </div>
      </div>
    </Drawer>
    <Modal
      title="提示"
      v-model="communityTip"
      :mask-closable = "false"
    >
      <p ref="communityTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
    <Modal
      title="提示"
      v-model="addSuccess"
      :mask-closable = "false"
    >
      <p ref="addTip"></p>
      <div slot="footer">
        <Button type="warning"  @click="goList">返回列表</Button>
        <Button type="info"  @click="addMore">继续添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "../../axios/axios";
  import * as base from '../../axios/base';
  export default {
    name: "communitySystem",
    data () {
      const validateName = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写话题名称'));
        } else {
          callback();
        }
      };
      const validateSlogan = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写话题口号'));
        } else {
          callback();
        }
      };
      const validateLabel = (rule,value,callback) => {
        if (value.length === 0 ) {
          callback(new Error('请选择话题标签'));
        } else {
          callback();
        }
      };
      const validateLocation = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请选择话题坐标'));
        } else {
          callback();
        }
      };
      const validateMember = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写允许人数'));
        } else {
          callback();
        }
      };
      const validateIns = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写话题介绍'));
        } else {
          callback();
        }
      };
      return {
        value3:false,
        comDetailVaule:false,
        communityTip:false,
        addSuccess:false,
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        begOption:{
          disabledDate : date =>  {
            const d = new Date(this.listParams.createTimeEnd);
            return date && date.valueOf() > d;
          }
        },
        endOption:{
          disabledDate : date =>  {
            const d = new Date(this.listParams.createTimeStart);
            return date && date.valueOf() < d - 24*60*60*1000;
          }
        },
        isShowAdd:false,
        loading:false,
        total:'',
        listParams:{
          name:'',
          createTimeStart:'',
          createTimeEnd:'',
          status:'',
          page:1,
          size:10
        },
        comList:[
          {
            value:'3',
            label:'全部'
          },
          {
            value:'0',
            label:'已激活'
          },
          {
            value:'1',
            label:'监管'
          },
          {
            value:'2',
            label:'解散'
          }
        ],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'话题编号',
            key:'communityNo',
            align:'center'
          },
          {
            title:'话题名称',
            key:'name',
            align:'center'
          },
          {
            title:'圈主',
            key:'userName',
            align:'center'
          },
          {
            title:'状态',
            key:'statusName',
            align:'center'
          },
          {
            title:'创建日期',
            key:'createTime',
            align:'center'
          },
          {
            title:'当前人数',
            key:'nowPerson',
            align:'center',
            width:100
          },
          {
            title:'口号',
            key:'slogan',
            align:'center'
          },
          {
            title:'介绍',
            key:'description',
            align:'center'
          },
          {
            title:'操作选项',
            key:'action',
            align:'center',
            width:260,
            render:(h,params) => {
              if (params.row.status === 2) {
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
                  }, '该话题已解散')
                ])
              } else {
                return h('div',[
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
                        axios.CommunityDetail({id:params.row.id})
                          .then(res => {
                            //console.log(res);
                            if (res.code === 200) {
                              if (res.result.picList !== null && res.result.picList !== '') {
                                this.comDetailData.isPhoto = true;
                                this.comDetailData.detailUploadList = res.result.picList.split(',');
                              } else {
                                this.comDetailData.isPhoto = false;
                              }
                              this.comDetailData.name = res.result.name;
                              this.comDetailData.userName = res.result.userName;
                              this.comDetailData.createTime = res.result.createTime;
                              this.comDetailData.amount = res.result.number;
                              this.comDetailData.nowPerson = res.result.nowPerson;
                              this.comDetailData.slogan = res.result.slogan;
                              this.comDetailData.description = res.result.description;
                              this.comDetailData.isOpenName = res.result.isOpenName;
                              this.comDetailVaule = true;
                            } else {
                              this.communityTip = true;
                              this.$refs.communityTip.innerHTML = res.message;
                            }
                          })
                          .catch(error => {
                            console.log(error);
                            this.communityTip = true;
                            this.$refs.communityTip.innerHTML = '查询出错！';
                          })
                      }
                    }
                  }, '详情'),
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        //console.log(params.row.id);
                        axios.CommunityDissolve({id:params.row.id})
                          .then(res => {
                            //console.log(res);
                            this.communityTip = true;
                            this.$refs.communityTip.innerHTML =res.message;
                            if (res.code === 200) {
                              this.getCommunityList();
                            }
                          })
                          .catch(error => {
                            console.log(error);
                            this.communityTip = true;
                            this.$refs.communityTip.innerHTML = '解散失败！';
                          })
                      }
                    }
                  }, '解散'),
                  h('Button', {
                    props: {
                      type: 'warning',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.$router.push({path:'/communityUserList',query:{communityId:params.row.id}});
                      }
                    }
                  }, '用户清单')
                ])
              }
            }
          }
        ],
        listData:[],
        labelList:[],
        posList:[],
        //新增话题data
        uploadList:[],
        comBigUrl:'',
        visible:false,
        formData:{
          userId:'1',
          name:'',
          slogan:'',
          personNum:'',
          type:'',
          isOpen:'2',
          description:'',
          filesPath:[],
          cLabel:[],
          addressLabelId:''
        },
        //话题详情
        comDetailData:{
          isPhoto:false,
          detailUploadList:[],
          name:'',
          userName:'',
          createTime:'',
          amount:'',
          nowPerson:'',
          slogan:'',
          description:'',
          isOpenName:''
        },
        validateRules:{
          name:[
            {validator:validateName}
          ],
          slogan:[
            {validator:validateSlogan}
          ],
          label:[
            {validator:validateLabel}
          ],
          location:[
            {validator:validateLocation}
          ],
          member:[
            {validator:validateMember}
          ],
          ins:[
            {validator:validateIns}
          ]
        }
      }
    },
    mounted () {
      this.getCommunityList();
      this.uploadList = this.$refs.comUpload.fileList;
    },
    methods: {
      comBeginTime:function (date) {
        this.listParams.createTimeStart = date;
      },
      comEndTime:function (date) {
        this.listParams.createTimeEnd = date;
      },
      getCommunityList:function () {
        this.loading = true;
        axios.GetCommunityList(this.listParams)
          .then(res => {
            //console.log(res.result.list);
            if (res.code === 200) {
              this.loading = false;
              this.listData = res.result.list;
              this.total = res.result.total;
            } else {
              this.communityTip = true;
              this.$refs.communityTip.innerHTML = res.message;
            }
          })
          .catch(error => {
            console.log(error);
            this.communityTip = true;
            this.$refs.communityTip.innerHTML = '查询出错！';
          })
      },
      exportData:function () {
        window.location.href = base.baseUrl.serviceTwo + 'community/exportCommunityList?name='+this.listParams.name+'&status='+this.listParams.status+'&createTimeStart='+this.listParams.createTimeStart+'&createTimeEnd='+this.listParams.createTimeEnd;
      },
      addCommunity:function () {
        this.value3 = true;
        this.getLabel();
        this.getPos();
      },
      pageChangeCheck:function (page) {
        this.listParams.page = page;
        this.getCommunityList();
      },
      getLabel:function () {
        axios.CommunityGetLabel()
          .then(res => {
            //console.log(res);
            if (res.code === 200) {
              this.labelList = res.result;
            } else {
              this.$Notice.warning({
                title: '获取标签失败！'
              });
            }
          })
          .catch(error => {
            console.log(error);
            this.$Notice.warning({
              title: '获取标签失败！'
            });
          })
      },
      getPos:function () {
        axios.CommunityGetPosition()
          .then(res => {
            console.log(res);
            if (res.code === 200) {
              this.posList = res.result;
            } else {
              this.$Notice.warning({
                title: '获取地标失败！'
              });
            }
          })
          .catch(error => {
            console.log(error);
            this.$Notice.warning({
              title: '获取地标失败！'
            });
          })
      },
      subCommunity:function () {
        this.$refs.subCommunity.validate(valid => {
          if (valid) {

          }
        })
      },
      //上传照片方法
      handleSuccess:function () {

      },
      handleFormatError:function () {

      },
      handleView:function (url) {
        this.comBigUrl = url;
        this.visible = true;
      },
      handleRemove:function () {

      },
      del:function () {
        this.communityTip = false;
      },
      goList:function () {

      },
      addMore:function () {

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
  .add-image{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    .p{
      width: 100px;
      height: 80px;
      line-height: 80px;
      text-align: right;
      padding: 10px 12px 10px 0;
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
