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
          <span class="ml15">话题状态：</span>
          <span>
            <Select v-model="listParams.status" class="checkWid">
              <Option v-for="(item,index) in comList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
          </span>
          <span class="ml10"><Button icon="ios-search" @click="checkList">查询</Button></span>
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
      width="1200"
      :mask-closable="false"
      :styles="styles"
      @on-close="clearData"
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
            <p class="p">上传照片：</p>
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
            <Upload :action="uploadUrl"
                    ref="comUpload"
                    :show-upload-list="false"
                    :on-success="handleSuccess"
                    :format="['jpg','jpeg','png','bmp']"
                    :on-format-error="handleFormatError"
                    :before-upload="handleBeforeUpload"
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
          <Form :model="formData" ref="subCommunity" :rules="validateRules" :label-width="100" style="width: 100%;margin-top: 20px;">
            <FormItem label="话题名称：" prop="name" style="width: 500px;">
              <Input type="text" v-model="formData.name"></Input>
            </FormItem>
            <FormItem label="话题口号：" prop="slogan" style="width: 500px;">
              <Input type="text" v-model="formData.slogan"></Input>
            </FormItem>
            <!--<FormItem label="话题标签：" prop="cLabel" style="width: 500px;">-->
              <!--<Select v-model="formData.cLabel" multiple>-->
                <!--<Option v-for="item in labelList" :value="item.id" :key="item.id">{{ item.name }}</Option>-->
              <!--</Select>-->
            <!--</FormItem>-->
            <FormItem label="话题介绍：" prop="description" style="width: 500px;">
              <Input type="textarea" v-model="formData.description"></Input>
              <!--
              <div class="editor-container">
                <quill-editor
                  ref="myEditor"
                  v-model="formData.description"
                  :options="myOptions"
                ></quill-editor>
                <Upload
                  :action="ediUploadUrl"
                  ref="editorUpload"
                  class="editorUp"
                  :on-success="handleEdiSuccess"
                  :format="['jpg','jpeg','png','bmp']"
                  :on-format-error="handleEdiFormatError"
                  :before-upload="handleEdiBefore"
                  style="display: none"
                >
                  <Button>点击上传</Button>
                </Upload>
              </div>
              -->
            </FormItem>
            <!--<FormItem style="width: 200px!important;">-->
              <!--<Checkbox v-model="formData.showHidden" true-value="2" false-value="0">是否隐藏</Checkbox>-->
            <!--</FormItem>-->
            <FormItem style="width: 200px!important;">
              <Checkbox v-model="formData.indexShow" true-value="1" false-value="0">是否推荐</Checkbox>
            </FormItem>
            <FormItem style="width: 200px!important;">
              <Button type="primary" @click="subCommunity" :loading="addLoading">发布话题</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Drawer>
    <!--话题详情-->
    <Drawer
      title="话题详情"
      v-model="comDetailVaule"
      width="1200"
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
          <p class="p">创建人：</p>
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
          <p class="p">话题口号：</p>
          <p class="detailSpan detailWidth">{{comDetailData.slogan}}</p>
        </div>
        <div class="add-detail">
          <p class="p">话题介绍：</p>
          <p class="detailSpan detailWidth" ref="des"></p>
        </div>
        <div class="add-detail">
          <p class="p">是否隐藏：</p>
          <p class="detailSpan detailWidth">{{comDetailData.showHiddenName}}</p>
        </div>
      </div>
    </Drawer>
    <!--编辑话题-->
    <Drawer
      title="修改话题"
      v-model="value9"
      width="1200"
      :mask-closable="false"
      :styles="styles"
      @on-close="clearReData"
    >
      <Form :model="reviseData" ref="reviseData" :rules="validateRules" style="width: 100%;margin-top: 20px;">
        <FormItem>
          <revise-upload-view ref="comCoverRe" :upload-url="uploadUrl" title="上传照片" :length="1" :width="100" con-width="100%" :default-list="defaultCover" :list-value="isShow" v-on:success-callback="coverReSuccess" v-on:remove-callback="coverReRemove"></revise-upload-view>
        </FormItem>
        <FormItem label="话题名称：" prop="name" :label-width="100" style="width: 500px;">
          <Input type="text" v-model="reviseData.name"></Input>
        </FormItem>
        <FormItem label="话题口号：" prop="slogan" :label-width="100" style="width: 500px;">
          <Input type="text" v-model="reviseData.slogan"></Input>
        </FormItem>
        <FormItem label="话题介绍：" prop="description" :label-width="100" style="width: 500px;">
          <Input type="textarea" v-model="reviseData.description"></Input>
        </FormItem>
        <FormItem style="width: 200px!important;" :label-width="100">
          <Checkbox v-model="reviseData.indexShow" true-value="1" false-value="0">是否推荐</Checkbox>
        </FormItem>
        <FormItem style="width: 200px!important;" :label-width="100">
          <Button type="primary" @click="reCommunity" :loading="reLoading">确认修改</Button>
        </FormItem>
      </Form>
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
      <p ref="addSuccess"></p>
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
  /*
  import { quillEditor } from 'vue-quill-editor';
  import * as Quill from 'quill';
  import index from "@/router";
  const fonts = ['SimSun', 'SimHei','Microsoft-YaHei','KaiTi','FangSong','Arial','Times-New-Roman','sans-serif'];
  const Font = Quill.import('formats/font');
  Font.whitelist = fonts; //将字体加入到白名单
  Quill.register(Font, true);
  const toolbarOptions= [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],

    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': fonts }],
    [{ 'align': [] }],

    ['clean'],
    ['link','image']
  ];
  */
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
        uploadUrl:base.baseUrl.serviceTwo + 'documents/saveFiles',
        ediUploadUrl:base.baseUrl.serviceOne + 'gift/saveGiftFile',//编辑器插入图片上传接口 和礼物配置一个接口
        addLoading:false,
        reLoading:false,
        value3:false,
        value9:false,
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
            title:'是否推荐',
            align:'center',
            render:(h,params) => {
                if (params.row.indexShow === 1) {
                  return h('div',{
                    style:{
                      height:'100%',
                    }
                  },'已推荐')
                } else {
                  return h('div',{
                    style:{
                      height:'100%',
                    }
                  },'未推荐')
                }
              }
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
            title:'操作选项',
            key:'action',
            align:'center',
            width:330,
            render:(h,params) => {
              const detail = h('Button', {
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
                            //this.comDetailData.amount = res.result.number;
                            this.comDetailData.nowPerson = res.result.nowPerson;
                            this.comDetailData.slogan = res.result.slogan;
                            this.comDetailData.description = res.result.description;
                            this.$refs.des.innerHTML = this.comDetailData.description;
                            this.comDetailData.showHiddenName = res.result.showHiddenName;
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
                }, '详情');
              const dissolve = h('Button', {
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
                }, '解散');
              const list =   h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.$router.push({path:'/communityUserList',query:{communityId:params.row.id}});
                  }
                }
              }, '用户清单');
              const recommend =  h('Button', {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      axios.CommunityRecommend({communityId:params.row.id,status:1})
                        .then(res => {
                          console.log(res);
                          this.communityTip = true;
                          this.$refs.communityTip.innerHTML = res.message;
                          if (res.code === 200) {
                            this.getCommunityList();
                          }
                        })
                        .catch(error => {
                          console.log(error);
                          this.communityTip = true;
                          this.$refs.communityTip.innerHTML = '操作失败！';
                        })
                    }
                  }
                }, '设为推荐');
              const disrecommend =  h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    axios.CommunityRecommend({communityId:params.row.id,status:0})
                      .then(res => {
                        console.log(res);
                        this.communityTip = true;
                        this.$refs.communityTip.innerHTML = res.message;
                        if (res.code === 200) {
                          this.getCommunityList();
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.communityTip = true;
                        this.$refs.communityTip.innerHTML = '操作失败！';
                      })
                  }
                }
              }, '取消推荐');
              const revise =  h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    axios.CommunityDetail({id:params.row.id})
                      .then(res => {
                        console.log(res);
                        if (res.code === 200) {
                          this.isShow = true;
                          this.defaultCover.push({url:res.result.picList,name:res.result.name,status:'finished'});
                          this.reviseData.backImg = res.result.picList;
                          this.reviseData.id = res.result.id;
                          this.reviseData.name = res.result.name;
                          this.reviseData.slogan = res.result.slogan;
                          this.reviseData.description = res.result.description;
                          this.value9 = true;
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
              }, '修改');
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
                if (params.row.indexShow === 1) {
                  return h('div',[
                    detail,
                    revise,
                    disrecommend,
                    dissolve,
                    list
                  ])
                } else {
                  return h('div',[
                    detail,
                    revise,
                    recommend,
                    dissolve,
                    list
                  ])
                }
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
          //amount:null,
          showHidden:'0',
          description:'',
          //cLabel:[],
          //addressLabelId:'',
          backImg:'',
          indexShow:'0' // 0是不推荐 1是推荐
        },
        //编辑话题
        isShow:false,
        defaultCover:[],
        reviseData:{
          id:'',
          userId:'1',
          name:'',
          slogan:'',
          showHidden:'0',
          description:'',
          backImg:'',
          indexShow:'0'
        },
        //话题详情
        comDetailData:{
          isPhoto:false,
          detailUploadList:[],
          name:'',
          userName:'',
          createTime:'',
          //amount:'',
          nowPerson:'',
          slogan:'',
          description:'',
          showHiddenName:''
        },
        validateRules:{
          name:[
            {validator:validateName}
          ],
          slogan:[
            {validator:validateSlogan}
          ],
          cLabel:[
            {validator:validateLabel}
          ],
          addressLabelId:[
            {validator:validateLocation}
          ],
          amount:[
            {validator:validateMember}
          ],
          description:[
            {validator:validateIns}
          ]
        },
        //话题介绍排编辑器
        /*
        myOptions:{
          placeholder:'请编写活动介绍',
          theme:'snow',
          modules:{
            toolbar:{
              container:toolbarOptions,
              handlers:{
                image:function (value) {
                  if (value) {
                    document.querySelector('.editorUp input').click();
                  } else {
                    this.quill.format('image',false);
                  }
                }
              }
            }
          }
        },
        */
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
      checkList:function () {
        this.listParams.page = 1;
        this.getCommunityList();
      },
      getCommunityList:function () {
        this.loading = true;
        axios.GetCommunityList(this.listParams)
          .then(res => {
            //console.log(JSON.stringify(res.result.list[0]));
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
            //console.log(res);
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
            this.addLoading = true;
            //验证通过就赋值 所以不管提交成不成功 都要清空 否则点击一次增加一次
            this.uploadList.forEach(item => {
              this.formData.backImg = item.url;
            });
             //console.log(JSON.stringify(this.formData));
             axios.CommunityAdd(this.formData)
               .then(res => {
                 //console.log(res);
                 this.addLoading = false;
                 this.formData.backImg = '';
                  if (res.code === 200) {
                    this.addSuccess = true;
                    this.$refs.addSuccess.innerHTML = res.message;
                    this.listParams.page = 1;
                    this.getCommunityList();
                  } else {
                    this.communityTip = true;
                    this.$refs.communityTip.innerHTML = res.message;
                  }
               })
               .catch(error => {
                 console.log(error);
                 this.addLoading = false;
                 this.formData.backImg = '';
                 this.communityTip = true;
                 this.$refs.communityTip.innerHTML = '发布失败！';
               })
          }
        })
      },
      //上传照片方法
      handleSuccess:function (res,file,fileList) {
        //console.log(res);
        if (res.code === 200) {
          file.url = res.result;
        } else {
          this.communityTip = true;
          this.$refs.communityTip.innerHTML = '图片上传失败！';
        }
      },
      handleFormatError:function () {
        this.$Message.warning('请选择格式为“jpg，jpeg，png，bmp”格式的图片！');
      },
      handleBeforeUpload:function (file) {
        const check = this.uploadList.length < 1;
        const len = file.name.length <= 50;
        if (!len) {
          this.$Message.warning('图片名过长！');
          return len;
        }
        if (!check) {
          this.$Message.warning('只能上传1张图片！');
          return check;
        }
      },
      handleView:function (url) {
        this.comBigUrl = url;
        this.visible = true;
      },
      handleRemove:function (file) {
        axios.CommunityDeleteImg({fileUrl:file.url})
          .then(res => {
            //console.log(res);
            if (res.code === 200) {
              const fileList = this.$refs.comUpload.fileList;
              this.$refs.comUpload.fileList.splice(fileList.indexOf(file), 1);
            } else {
              this.communityTip = true;
              this.$refs.communityTip.innerHTML = res.message;
            }
          })
          .catch(error => {
            console.log(error);
            this.communityTip = true;
            this.$refs.communityTip.innerHTML = '图片删除失败！';
          })
      },
      del:function () {
        this.communityTip = false;
      },
      goList:function () {
        this.clearData();
        this.addSuccess = false;
        this.value3 = false
      },
      addMore:function () {
        this.clearData();
        this.addSuccess = false;
      },
      //清除数据
      clearData:function () {
        this.$refs.comUpload.clearFiles();
        this.uploadList = this.$refs.comUpload.fileList;
        this.$refs.subCommunity.resetFields();
        this.formData.description = '';
        this.formData.backImg = '';
        this.formData.indexShow = '0';
      },
      clearReData:function () {
        this.isShow = false;
        this.defaultCover = [];
        this.$refs.reviseData.resetFields();
        this.reviseData.backImg = '';
        this.reviseData.indexShow = '0';
        this.$refs.comCoverRe.clearUpload();
      },
      coverReSuccess:function (file,title,fileList) {
        this.reviseData.backImg = file.url;
      },
      coverReRemove:function () {
        this.reviseData.backImg = '';
      },
      reCommunity:function () {
        this.$refs.reviseData.validate(valid => {
          if (valid) {
            this.reLoading = true;
            axios.CommunityAdd(this.reviseData)
              .then(res => {
                //console.log(res);
                this.reLoading = false;
                this.communityTip = true;
                this.$refs.communityTip.innerHTML = res.message;
                if (res.code === 200) {
                  this.clearReData();
                  this.value9 = false;
                  this.getCommunityList();
                }
              })
              .catch(error => {
                console.log(error);
                this.reLoading = false;
                this.communityTip = true;
                this.$refs.communityTip.innerHTML = '修改失败！';
              })
          }
        })
      },
      //格式限制
      handleEdiFormatError:function () {
        this.$Message.warning('请选择格式为“jpg，jpeg，png，bmp”格式的图片！');
      },
      handleEdiBefore:function (file) {
        const len = file.name.length <= 50;
        if (!len) {
          this.$Message.warning('图片名过长！');
        }
        return len;
      },
      //富文本编辑器
      //话题介绍编辑器上传图片
      handleEdiSuccess:function (res,file,fileList) {
        //编辑器实例
        let quill = this.$refs.myEditor.quill;
        if (res.code === '0') {
          //获取光标位置
          let length = quill.getSelection().index;
          //插入图片
          quill.insertEmbed(length,'image',res.data);
          //将光标调整到最后
          quill.setSelection(length+1);
        } else {
          this.$Message.warning('图片插入失败！');
        }
      },
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
    width: 1000px;
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
