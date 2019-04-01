<template>
  <div class="activity-container content-pad">
    <div>
      <div class="activity-fun">
        <div class="activity-ope">
          <Button type="default" icon="md-add" @click="activityAdd">新增活动</Button>
          <Button type="default" icon="ios-download" @click="exportData">导出EXCEL</Button>
        </div>
        <div class="activity-search">
          <span class="ml15">创建日期从：</span>
          <span><DatePicker type="date" format="yyyy-MM-dd" class="checkWid" @on-change="startTimeChange" :options="begOption" v-model="listParams.createTimeStart"></DatePicker></span>
          <span class="ml15">创建日期止：</span>
          <span><DatePicker type="date" format="yyyy-MM-dd" class="checkWid" @on-change="endTimeChange" :options="endOption" v-model="listParams.createTimeEnd"></DatePicker></span>
          <span class="ml15">活动名称：</span>
          <span><Input class="checkWid" v-model="listParams.name"/></span>
          <span class="ml15">活动状态：</span>
          <span>
            <Select class="checkWid" v-model="listParams.status">
              <Option v-for="(item,index) in actList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
          </span>
          <span class="ml10"><Button icon="ios-search" @click="checkList">查询</Button></span>
        </div>
      </div>
      <div class="activity-list mt30">
        <Table border :columns="columns" :data="listData" :loading="loading"></Table>
        <Page :total="total" :current="listParams.page" v-if="total>10" show-elevator show-total @on-change="activityPageChange" class="mt30"/>
      </div>
    </div>
    <!--新增-->
    <Drawer
      title="发布活动"
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
            <Upload :action="uploadUrl"
                    ref="activityUpload"
                    :show-upload-list="false"
                    :on-success="handleSuccess"
                    :format="['jpg','jpeg','png']"
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
              <img :src="actBigUrl " style="width: 100%">
              <div slot="footer"></div>
            </modal>
          </div>
          <Form :model="formData" ref="activityAdd" :rules="ruleValidate" :label-width="100" style="width:100%;margin-top: 20px;">
            <FormItem label="活动名称" prop="name" style="width: 500px;">
              <Input type="text" v-model="formData.name"/>
            </FormItem>
            <FormItem label="活动口号" prop="slogan" style="width: 500px;">
              <Input type="text" v-model="formData.slogan"/>
            </FormItem>
            <FormItem label="开始时间" prop="startTime" style="width: 500px;">
              <DatePicker  type="datetime" format="yyyy-MM-dd HH:mm" v-model="formData.startTime" @on-change="activityBeginTime" style="width: 100%;"></DatePicker >
            </FormItem>
            <FormItem label="结束时间" prop="endTime" style="width: 500px;">
              <DatePicker  type="datetime" format="yyyy-MM-dd HH:mm" v-model="formData.endTime" @on-change="activityEndTime" style="width: 100%;"></DatePicker >
            </FormItem>
            <FormItem label="活动地址" prop="address" style="width: 500px;">
              <Input type="text" v-model="formData.address"/>
            </FormItem>
            <FormItem label="允许人数" prop="personNum" style="width: 500px;">
              <InputNumber v-model="formData.personNum" :max="1000000" :min="0" style="width: 100%;"></InputNumber>
            </FormItem>
            <FormItem label="活动内容">
              <div class="editor-container">
                <quill-editor
                  ref="myEditor"
                  v-model="formData.content"
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
            </FormItem>
            <FormItem style="width: 200px!important;">
              <Checkbox v-model="formData.isOpen" true-value="1" false-value="0">开放报名</Checkbox>
            </FormItem>
            <FormItem style="width: 200px!important;">
              <Button type="primary" @click="subActivity" :loading="addLoading">发布活动</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Drawer>
    <!--详情-->
    <Drawer
      title="活动详情"
      v-model="activityDetailValue"
      width="1200"
      :mask-closable="false"
      :styles="styles"
      @on-close="clearDetail"
    >
      <div class="add-title">
          <span>
            <span class="add-tips"><Icon type="md-information-circle" />友情提示：平台运营前期，运营人员使用！</span>
          </span>
      </div>
      <div class="add-image mt30">
        <p class="p">照&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;片：</p>
        <template v-if="activityDetailData.isPhoto">
          <div class="demo-upload-list"  v-for="item in activityDetailData.detailPhotoList">
            <img :src="item">
          </div>
        </template>
        <template v-else>
          <div class="demo-upload-list">暂无图片</div>
        </template>
      </div>
      <div class="add-detail">
        <p class="p">活动名称：</p>
        <p class="detailSpan">{{activityDetailData.name}}</p>
      </div>
      <div class="add-detail">
        <p class="p">活动口号：</p>
        <p class="detailSpan">{{activityDetailData.slogan}}</p>
      </div>
      <div class="add-detail">
        <p class="p">开始时间：</p>
        <p class="detailSpan">{{activityDetailData.startTime}}</p>
      </div>
      <div class="add-detail">
        <p class="p">结束时间：</p>
        <p class="detailSpan">{{activityDetailData.endTime}}</p>
      </div>
      <div class="add-detail">
        <p class="p">活动地址：</p>
        <p class="detailSpan">{{activityDetailData.address}}</p>
      </div>
      <div class="add-detail">
        <p class="p">允许人数：</p>
        <p class="detailSpan">{{activityDetailData.personNum}}</p>
      </div>
      <div class="add-detail">
        <p class="p">活动内容：</p>
        <p class="detailSpan detailWidth" ref="con"></p>
      </div>
    </Drawer>
    <!--修改-->
    <Drawer
      title="活动修改"
      v-model="activityRevisValue"
      width="1200"
      :mask-closable="false"
      :styles="styles"
      @on-close="clearReData"
    >
      <div class="add-title">
          <span>
            <span class="add-tips"><Icon type="md-information-circle" />友情提示：平台运营前期，运营人员使用！</span>
          </span>
      </div>
      <div class="add-form mt30">
        <div class="add-image">
          <p class="p">上传照片</p>
          <div class="demo-upload-list" v-for="item in activityReviseUploadList">
            <template v-if="item.status === 'finished'">
              <img :src="item.url">
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="activityHandleView(item.url)"></Icon>
                <Icon type="ios-trash-outline" @click.native="activityHandleRemove(item)"></Icon>
              </div>
            </template>
            <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
          </div>
          <Upload :action="uploadUrl"
                  ref="activityReviseUpload"
                  :show-upload-list="false"
                  :default-file-list="activityReviseDefaultList"
                  :on-success="activityHandleSuccess"
                  :format="['jpg','jpeg','png']"
                  :on-format-error="handleFormatError"
                  multiple
                  type="drag"
                  style="display: inline-block;width:100px;">
            <div style="width: 100px;height:100px;line-height: 100px;">
              <Icon type="ios-camera" size="40"></Icon>
            </div>
          </Upload>
          <modal title="查看照片" v-model="activityReviseVisible">
            <img :src="activityReviseImgUrl " style="width: 100%">
            <div slot="footer"></div>
          </modal>
        </div>
        <Form :model="activityReviseFormData" ref="activityRevise" :rules="ruleValidate" :label-width="100" style="width: 100%;margin-top: 20px;">
          <FormItem label="活动名称" prop="name" style="width: 500px;">
            <Input type="text" v-model="activityReviseFormData.name"/>
          </FormItem>
          <FormItem label="活动口号" prop="slogan" style="width: 500px;">
            <Input type="text" v-model="activityReviseFormData.slogan"/>
          </FormItem>
          <FormItem label="开始时间" prop="startTime" style="width: 500px;">
            <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" v-model="activityReviseFormData.startTime" @on-change="activityReviseBeg" style="width: 100%;"></DatePicker>
          </FormItem>
          <FormItem label="结束时间" prop="endTime" style="width: 500px;">
            <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" v-model="activityReviseFormData.endTime" @on-change="activityReviseEnd" style="width: 100%;"></DatePicker>
          </FormItem>
          <FormItem label="活动地址" prop="address" style="width: 500px;">
            <Input type="text" v-model="activityReviseFormData.address"/>
          </FormItem>
          <FormItem label="允许人数" prop="personNum" style="width: 500px;">
            <InputNumber v-model="activityReviseFormData.personNum" :max="1000000" :min="0" style="width: 100%;"></InputNumber>
          </FormItem>
          <FormItem label="活动内容">
            <div class="editor-container">
              <quill-editor
                ref="myReEditor"
                v-model="activityReviseFormData.content"
                :options="myReOptions"
              ></quill-editor>
              <Upload
                :action="ediUploadUrl"
                ref="editorReUpload"
                class="editorReUp"
                :on-success="reHandleEdiSuccess"
                :format="['jpg','jpeg','png','bmp']"
                :on-format-error="handleEdiFormatError"
                :before-upload="handleEdiBefore"
                style="display: none"
              >
                <Button>点击上传</Button>
              </Upload>
            </div>
          </FormItem>
          <FormItem style="width: 200px!important;">
            <Checkbox v-model="activityReviseFormData.isOpen" true-value="1" false-value="0">开放报名</Checkbox>
          </FormItem>
          <FormItem style="width: 200px!important;">
            <Button type="primary" @click="reviseClick" :loading="reLoading">确定修改</Button>
          </FormItem>
        </Form>
      </div>
    </Drawer>
    <Modal
      title="提示"
      v-model="activityTip"
      :mask-closable = "false"
    >
      <p ref="activityTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
    <Modal
      title="提示"
      v-model="actAddSuccess"
      :mask-closable = "false"
    >
      <p ref="actAddSuccess"></p>
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
  export default {
    name: "activitySystem",
    data () {
      const validateName = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写活动名称'));
        } else {
          callback();
        }
      };
      const validateSlogan = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写活动口号'));
        } else {
          callback();
        }
      };
      const validateBeginTime = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写活动开始时间'));
        } else {
          callback();
        }
      };
      const validateEndTime = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写活动结束时间'));
        } else {
          callback();
        }
      };
      const validateLocation = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写活动地址'));
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
          callback(new Error('请填写活动内容'));
        } else {
          callback();
        }
      };
      return {
        uploadUrl:base.baseUrl.serviceTwo + 'documents/saveFiles',
        ediUploadUrl:base.baseUrl.serviceOne + 'gift/saveGiftFile',//编辑器插入图片上传接口 和礼物配置一个接口
        value3:false,
        activityDetailValue:false,
        activityRevisValue:false,
        activityTip:false,
        actAddSuccess:false,
        addLoading:false,
        reLoading:false,
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        showAdd:false,
        loading:false,
        total:'',
        listParams:{
          name:'',
          status:'',
          createTimeStart:'',
          createTimeEnd:'',
          page:1,
          size:10
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
        actList:[
          {
            value:'3',
            label:'不限'
          },
          {
            value:'0',
            label:'正常'
          },
          {
            value:'1',
            label:'已取消'
          },
          {
            value:'2',
            label:'已结束'
          }
        ],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'活动编号',
            key:'actNo',
            align:'center',
          },
          {
            title:'活动名称',
            key:'name',
            align:'center',
          },
          {
            title:'发起人',
            key:'userName',
            align:'center',
          },
          {
            title:'状态',
            key:'statusName',
            align:'center',
          },
          {
            title:'创建日期',
            key:'createTime',
            align:'center',
          },
          {
            title:'报名人数',
            key:'joinNum',
            align:'center',
          },
          {
            title:'活动地点',
            key:'address',
            align:'center',
          },
          {
            title:'操作选项',
            key:'action',
            align:'center',
            width:260,
            render:(h,params) => {
              if (params.row.status === 0) {
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
                        this.activityDetailValue = true;
                        if (params.row.picList !== '' && params.row.picList != null) {
                          this.activityDetailData.isPhoto = true;
                          this.activityDetailData.detailPhotoList = params.row.picList.split(',');
                        } else {
                          this.activityDetailData.isPhoto = false;
                          this.activityDetailData.detailPhotoList = [];
                        }
                        this.activityDetailData.name = params.row.name;
                        this.activityDetailData.slogan = params.row.slogan;
                        this.activityDetailData.personNum = params.row.personNum;
                        this.activityDetailData.startTime = params.row.startTime;
                        this.activityDetailData.endTime = params.row.endTime;
                        this.activityDetailData.address = params.row.address;
                        axios.AcrivityDetail({id:params.row.id})
                          .then(res => {
                            //console.log(res);
                            if (res.code === 200) {
                              this.$refs.con.innerHTML = res.result.content;
                            } else {
                              console.log(res.message);
                              this.$refs.con.innerHTML = '';
                            }
                          })
                          .catch(error => {
                            console.log(error);
                            this.$refs.con.innerHTML = '';
                          })
                      }
                    }
                  }, '详情'),
                  h('Button', {
                    props: {
                      type: 'info',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.activityRevisValue = true;
                        let arr = [];
                        if (params.row.picList !== '' && params.row.picList != null) {
                          arr = params.row.picList.split(',');
                          arr.forEach(item => {
                            this.activityReviseDefaultList.push({url:item,status:'finished'})
                          });
                        } else {
                          this.activityReviseDefaultList = []; //activityReviseUpload
                        }
                        this.$refs.activityReviseUpload.fileList = this.activityReviseDefaultList;
                        this.activityReviseUploadList = this.$refs.activityReviseUpload.fileList;
                        this.activityReviseFormData.id = params.row.id;
                        this.activityReviseFormData.name = params.row.name;
                        this.activityReviseFormData.slogan = params.row.slogan;
                        this.activityReviseFormData.personNum = params.row.personNum;
                        this.activityReviseFormData.startTime = params.row.startTime;
                        this.activityReviseFormData.endTime = params.row.endTime;
                        this.activityReviseFormData.address = params.row.address;
                          // saveFileUrl:[],
                          // delFileUrl:[],
                        this.activityReviseFormData.isOpen = params.row.isOpen.toString();
                        axios.AcrivityDetail({id:params.row.id})
                          .then(res => {
                            //console.log(res);
                            if (res.code === 200) {
                              this.activityReviseFormData.content = res.result.content;
                            } else {
                              console.log(res.message);
                              this.activityReviseFormData.content = '';
                            }
                          })
                          .catch(error => {
                            console.log(error);
                            this.activityReviseFormData.content = '';
                          })
                      }
                    }
                  }, '修改'),
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
                        axios.ActivityCancel({id:params.row.id})
                          .then(res => {
                            //console.log(res);
                            this.activityTip = true;
                            this.$refs.activityTip.innerHTML = res.message;
                            if (res.code === 200) {
                              this.getActivityList();
                            }
                          })
                          .catch(error => {
                            console.log(error);
                            this.activityTip = true;
                            this.$refs.activityTip.innerHTML = '操作失败！';
                          })
                      }
                    }
                  }, '取消'),
                  h('Button', {
                    props: {
                      type: 'warning',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.$router.push({path:'/activityUserList',query:{actId:params.row.id}})
                      }
                    }
                  }, '报名清单')
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
                  }, '该活动已取消')
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
                  }, '该活动已结束')
                ])
              }
            }
          }
        ],
        listData:[],
        //发布活动data
        defaultList:[],
        //新增数据
        uploadList:[],
        actBigUrl:'',
        visible:false,
        formData:{
          userId:'1',
          name:'',
          slogan:'',
          personNum:null,
          startTime:'',
          endTime:'',
          content:'',
          address:'',
          saveFileUrl:[],
          isOpen:'1'
        },
        //详情数据
        activityDetailData:{
          isPhoto:false,
          detailPhotoList:[],
          name:'',
          slogan:'',
          personNum:'',
          startTime:'',
          endTime:'',
          content:'',
          address:'',
        },
        //修改数据
        activityReviseVisible:false,
        activityReviseUploadList:[],
        activityReviseDefaultList:[],
        activityRevisePath:'',
        activityReviseImgUrl:'',
        activityReviseId:'',
        activityReviseFormData:{
          userId:'1',
          id:'',
          name:'',
          slogan:'',
          personNum:null,
          startTime:'',
          endTime:'',
          content:'',
          address:'',
          saveFileUrl:[],
          delFileUrl:[],
          isOpen:'1'
        },
        //表单验证
        ruleValidate:{
          name:[
            {validator:validateName}
            ],
          slogan:[
            {validator:validateSlogan}
          ],
          startTime:[
            {validator:validateBeginTime}
          ],
          endTime:[
            {validator:validateEndTime}
          ],
          address:[
            {validator:validateLocation}
          ],
          personNum:[
            {validator:validateMember}
          ],
          ins:[
            {validator:validateIns}
          ]
        },
        //活动内容编辑器
        myOptions:{
          placeholder:'请编写活动内容',
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
        //活动内容修改编辑器option
        myReOptions:{
          placeholder:'请编写活动内容',
          theme:'snow',
          modules:{
            toolbar:{
              container:toolbarOptions,
              handlers:{
                image:function (value) {
                  if (value) {
                    document.querySelector('.editorReUp input').click();
                  } else {
                    this.quill.format('image',false);
                  }
                }
              }
            }
          }
        },
      }
    },
    mounted () {
      this.uploadList = this.$refs.activityUpload.fileList;
      this.getActivityList();
    },
    methods: {
      getActivityList:function () {
        this.loading = true;
        axios.ActivityList(this.listParams)
          .then(res => {
            //console.log(JSON.stringify(res.result.list[0]));
            if (res.code === 200) {
              this.loading = false;
              this.listData = res.result.list;
              this.total = res.result.total;
            } else {
              this.activityTip = true;
              this.$refs.activityTip.innerHTML = res.message;
            }
          })
          .catch(error => {
            console.log(error);
            this.activityTip = true;
            this.$refs.activityTip.innerHTML = '查询出错！';
          })
      },
      exportData:function () {
        window.location.href = base.baseUrl.serviceTwo +  'activity/exportActList?name='+this.listParams.name+'&status='+this.listParams.status+'&createTimeStart='+this.listParams.createTimeStart+'&createTimeEnd='+this.listParams.createTimeEnd;
      },
      activityAdd :function () {
        this.value3 = true;
      },
      activityPageChange:function (page) {
        this.listParams.page = page;
        this.getActivityList();
      },
      checkList:function () {
        this.listParams.page = 1;
        this.getActivityList();
      },
      //查询时间change
      startTimeChange:function (date) {
        this.listParams.createTimeStart = date;
      },
      endTimeChange:function (date) {
        this.listParams.createTimeEnd = date;
      },
      //新增时间change
      activityBeginTime:function (date) {
        this.formData.startTime =  date;
      },
      activityEndTime:function (date) {
        this.formData.endTime = date;
      },
      //上传照片
      handleSuccess:function (res,file,fileList) {
        //console.log(fileList);
        if (res.code === 200) {
          file.url = res.result;
          //this.uploadList = fileList;
        } else {
          this.activityTip = true;
          this.$refs.activityTip.innerHTML = '图片上传失败！';
        }
      },
      handleFormatError:function () {
        this.$Message.warning('请选择格式为“jpg，jpeg，png，bmp”格式的图片！');
      },
      handleBeforeUpload:function (file) {
        const check = this.uploadList.length < 9;
        const len = file.name.length <= 50;
        if (!len) {
          this.$Message.warning('图片名过长！');
          return len;
        }
        if (!check) {
          this.$Message.warning('只能上传3张图片！');
          return check;
        }
      },
      handleView:function (url) {
        this.actBigUrl = url;
        this.visible = true;
      },
      handleRemove:function (file) {
        axios.CommunityDeleteImg({fileUrl:file.url})
          .then(res => {
            //console.log(res);
            if (res.code === 200) {
              const fileList = this.$refs.activityUpload.fileList;
              this.$refs.activityUpload.fileList.splice(fileList.indexOf(file), 1);
            } else {
              this.activityTip = true;
              this.$refs.activityTip.innerHTML = res.message;
            }
          })
          .catch(error => {
            console.log(error);
            this.activityTip = true;
            this.$refs.activityTip.innerHTML = '图片删除失败！';
          })
      },
      subActivity:function () {
        this.$refs.activityAdd.validate(valid => {
          if (valid) {
            this.addLoading = true;
            this.uploadList.forEach(item => {
              this.formData.saveFileUrl.push(item.url);
            });
            //console.log(this.formData);
            axios.ActivityAddOrRevise(this.formData)
              .then(res => {
                //console.log(res);
                this.addLoading = false;
                this.formData.saveFileUrl = [];
                if (res.code === 200) {
                  this.actAddSuccess = true;
                  this.$refs.actAddSuccess.innerHTML = res.message;
                  this.listParams.page = 1;
                  this.getActivityList();
                } else {
                  this.activityTip = true;
                  this.$refs.activityTip.innerHTML = res.message;
                }
              })
              .catch(error => {
                console.log(error);
                this.addLoading = false;
                this.formData.saveFileUrl = [];
                this.activityTip = true;
                this.$refs.activityTip.innerHTML = '操作失败！';
              })
          }
        })
      },
      //修改相关方法
      activityHandleSuccess:function (res,file,fileList) {
        if (res.code === 200) {
          file.url = res.result;
          this.activityReviseUploadList = fileList;
        } else {
          this.activityTip = true;
          this.$refs.activityTip.innerHTML = '图片上传失败！';
        }
      },
      activityHandleView:function (url) {
        this.activityReviseVisible = true;
        this.activityReviseImgUrl = url;
      },
      activityHandleRemove:function (file) {
        this.activityReviseFormData.delFileUrl.push(file.url);
        const fileList = this.$refs.activityReviseUpload.fileList;
        this.$refs.activityReviseUpload.fileList.splice(fileList.indexOf(file), 1);
        this.activityReviseUploadList = this.$refs.activityReviseUpload.fileList;
      },
      activityReviseBeg:function (date) {
        this.activityReviseFormData.startTime = date;
      },
      activityReviseEnd:function (date) {
        this.activityReviseFormData.endTime = date;
      },
      reviseClick:function () {
        this.$refs.activityRevise.validate(valid => {
          if (valid) {
            //console.log(this.activityReviseFormData.startTime);
            this.reLoading = true;
            this.$refs.activityReviseUpload.fileList.forEach(item => {
              this.activityReviseFormData.saveFileUrl.push(item.url);
            });
            this.activityReviseFormData.startTime = this.$trans.timeTranslateColock(this.activityReviseFormData.startTime);
            this.activityReviseFormData.endTime = this.$trans.timeTranslateColock(this.activityReviseFormData.endTime);
            axios.ActivityAddOrRevise(this.activityReviseFormData)
              .then(res => {
                //console.log(res);
                this.reLoading = false;
                this.activityReviseFormData.saveFileUrl = [];
                this.activityReviseFormData.delFileUrl = [];
                if (res.code === 200) {
                  this.activityRevisValue = false;
                  this.activityReviseDefaultList = [];
                  this.activityTip = true;
                  this.$refs.activityTip.innerHTML = res.message;
                  this.getActivityList();
                } else {
                  this.activityTip = true;
                  this.$refs.activityTip.innerHTML = res.message;
                }
              })
              .catch(error => {
                console.log(error);
                this.reLoading = false;
                this.activityReviseFormData.saveFileUrl = [];
                this.activityReviseFormData.delFileUrl = [];
                this.activityTip = true;
                this.$refs.activityTip.innerHTML = '操作失败！';
              })
          }
        })
      },
      del:function () {
        this.activityTip = false;
      },
      goList:function () {
        this.clearData();
        this.value3 = false;
        this.actAddSuccess = false;
      },
      addMore:function () {
        this.clearData();
        this.actAddSuccess = false;
      },
      clearData:function () {
        this.$refs.activityUpload.clearFiles();
        this.uploadList = this.$refs.activityUpload.fileList;
        this.$refs.activityAdd.resetFields();
        this.formData.content = '';
        this.formData.isOpen = '1';
        this.formData.saveFileUrl = [];
      },
      clearDetail:function () {
        this.activityDetailData.isPhoto = false;
        this.activityDetailData.detailPhotoList = [];
        this.activityDetailData.name = '';
        this.activityDetailData.slogan = '';
        this.activityDetailData.personNum = '';
        this.activityDetailData.startTime = '';
        this.activityDetailData.endTime = '';
        this.activityDetailData.content = '';
        this.activityDetailData.address = '';
      },
      clearReData:function () {
        this.activityReviseDefaultList = [];
        this.$refs.activityReviseUpload.clearFiles();
        this.activityReviseUploadList = this.$refs.activityReviseUpload.fileList;
        this.$refs.activityRevise.resetFields();
        this.activityReviseFormData.id = '';
        this.activityReviseFormData.personNum = null;
        this.activityReviseFormData.content = '';
        this.activityReviseFormData.saveFileUrl = [];
        this.activityReviseFormData.delFileUrl = [];
        this.activityReviseFormData.isOpen = '1';
      },
      //富文本编辑器
      //活动内容编辑器上传图片
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
      //活动内容修改插入图片
      reHandleEdiSuccess:function (res,file,fileList) {
        //编辑器实例
        let quill = this.$refs.myReEditor.quill;
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
    }
  }
</script>

<style lang="scss" scoped>
  .activity-fun{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .activity-search{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      line-height: 33px;
      padding-right: 30px;
    }
  }
  .activity-list{
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
