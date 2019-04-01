<template>
    <div class="article-container content-pad">
      <div class="community-fun">
        <div class="community-ope">
          <Button type="default" icon="md-add" @click="addArticle">发布文章</Button>
        </div>
        <div class="community-search">
          <span class="ml15">文章名称：</span>
          <span><Input v-model="listParams.name" class="checkWid"/></span>
          <span class="ml15">所属模块：</span>
          <span>
            <Select v-model="listParams.parentId" @on-change="getCheckParamsSec" class="checkWid">
              <Option v-for="item in modelList" :value="item.id" :key="item.id">{{item.name}}</Option>
            </Select>
          </span>
          <span class="ml15">所属分类：</span>
          <span>
            <Select v-model="listParams.childId" class="checkWid">
              <Option v-for="item in classList" :value="item.id" :key="item.id">{{item.name}}</Option>
            </Select>
          </span>
          <span class="ml15">文章类型：</span>
          <span>
            <Select v-model="listParams.type" class="checkWid">
              <Option v-for="(item,index) in typeList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
          </span>
          <span class="ml15">文章状态：</span>
          <span>
            <Select v-model="listParams.status" class="checkWid">
              <Option v-for="(item,index) in artStatusList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
          </span>
          <span class="ml10"><Button icon="ios-search" @click="checkArticle">查询</Button></span>
        </div>
      </div>
      <div class="community-list mt30">
        <Table border :columns="columns" :data="listData" :loading="loading"></Table>
        <Page :total="total" :current="listParams.page" v-if="total>10" show-elevator show-total @on-change="artPageChange" class="mt30"/>
      </div>
      <Modal title="查看大图" v-model="tabBig">
        <img :src="tabUrl" style="width: 100%">
        <div slot="footer"></div>
      </Modal>
      <!--文章新增-->
      <Drawer
        title="发布文章"
        v-model="artValue"
        width="1200"
        :mask-closable="false"
        :styles="styles"
        @on-close="clearArtData"
      >
        <Form :model="artFormData" ref="artForm" :rules="ruleValidate" :label-width="100" style="width: 100%;margin-top: 20px;">
          <FormItem label="所属模块：">
            <div class="configure-container">
              <RadioGroup v-model="artFormData.levelId" vertical>
                <Radio v-for="item in existModal" :key="item.id" :label="item.id" class="ml30" :disabled="item.levelDtoList ? true : false">
                  <Icon type="ios-arrow-down"></Icon>{{item.name}}
                  <Radio v-for="it in item.levelDtoList" :key="it.id" :label="it.id" class="ml15">
                    {{it.name}}
                  </Radio>
                </Radio>
              </RadioGroup>
            </div>
          </FormItem>
          <FormItem label="文章标题：" prop="name">
            <Input type="text" :maxlength="80" v-model="artFormData.name" style="width: 400px;"></Input>
          </FormItem>
          <FormItem label="副标题：" prop="nameSub">
            <Input type="text" :maxlength="80" v-model="artFormData.nameSub" style="width: 400px;"></Input>
          </FormItem>
          <FormItem label="文章类型：" prop="type">
            <Select v-model="artFormData.type" style="width:400px">
              <Option v-for="(item,index) in artTypeList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="文章封面：">
            <div class="add-image">
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
                      ref="artUpload"
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
                <img :src="bigUrl" style="width: 100%">
                <div slot="footer"></div>
              </modal>
            </div>
          </FormItem>
          <FormItem label="文章内容：">
            <div class="editor-container">
              <quill-editor
                ref="myEditor"
                v-model="artFormData.content"
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
          <FormItem label="添加视频：">
            <div class="add-image">
              <div class="demo-upload-list" v-for="item in videoUploadList">
                <template v-if="item.status === 'finished'">
                  <video :src="item.url"></video>
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleVideoView(item.url)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleVideoRemove(item)"></Icon>
                  </div>
                </template>
                <template v-else>
                  <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
              </div>
              <Upload :action="videoUploadUrl"
                      ref="videoUpload"
                      :data="videoData"
                      :show-upload-list="false"
                      :on-success="handleVideoSuccess"
                      :before-upload="handleVideoBeforeUpload"
                      multiple
                      type="drag"
                      style="display: inline-block;width:100px;">
                <div style="width: 100px;height:100px;line-height: 100px;">
                  <Icon type="ios-camera" size="40"></Icon>
                </div>
              </Upload>
              <modal title="查看视频" v-model="videoVisible" @on-visible-change="videoAddClose">
                <video :src="videoUrl" controls="controls" style="width: 100%"></video>
                <div slot="footer"></div>
              </modal>
            </div>
          </FormItem>
          <FormItem label="是否推荐：">
            <Checkbox v-model="artFormData.recomment" true-value='1' false-value='0' class="ml15"></Checkbox>
          </FormItem>
          <FormItem style="width: 200px!important;">
            <Button type="primary" @click="artSub" :loading="artLoading">确认发布</Button>
          </FormItem>
        </Form>
      </Drawer>
      <!--文章详情-->
      <Drawer
        title="文章详情"
        v-model="artDetailValue"
        width="1200"
        :mask-closable="false"
        :styles="styles"
        @on-close="clearArtDetailData"
      >
        <h1 style="text-align: center;">{{artDetail.title}}</h1>
        <h3 style="text-align: center;" class="mt20">{{artDetail.subTitle}}</h3>
        <div class="mt30 article" ref="deContent"></div>
        <video :src="artDetail.video" v-if="isVideo" controls="controls" style="width: 50%;margin: 30px auto 0;display: block;"></video>
      </Drawer>
      <!--文章修改-->
      <Drawer
        title="修改文章"
        v-model="artReviseValue"
        width="1200"
        :mask-closable="false"
        :styles="styles"
        @on-close="clearArtReviseData"
      >
        <Form :model="artReFormData" ref="artReForm" :rules="ruleValidate" :label-width="100" style="width: 100%;margin-top: 20px;">
          <FormItem label="所属模块：">
            <div class="configure-container">
              <RadioGroup v-model="artReFormData.levelId" vertical>
                <Radio v-for="item in existModal" :key="item.id" :label="item.id" class="ml30">
                  <Icon type="ios-arrow-down"></Icon>{{item.name}}
                  <Radio v-for="it in item.levelDtoList" :key="it.id" :label="it.id" class="ml15">
                    {{it.name}}
                  </Radio>
                </Radio>
              </RadioGroup>
            </div>
          </FormItem>
          <FormItem label="文章标题：" prop="name">
            <Input type="text" :maxlength="80" v-model="artReFormData.name" style="width: 400px;"></Input>
          </FormItem>
          <FormItem label="副标题：" prop="nameSub">
            <Input type="text" :maxlength="80" v-model="artReFormData.nameSub" style="width: 400px;"></Input>
          </FormItem>
          <FormItem label="文章类型：" prop="type">
            <Select v-model="artReFormData.type" style="width:400px">
              <Option v-for="(item,index) in artTypeList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="文章封面：">
            <div class="add-image">
              <div class="demo-upload-list" v-for="item in reUploadList">
                <template v-if="item.status === 'finished'">
                  <img :src="item.url">
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleReView(item.url)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleReRemove(item)"></Icon>
                  </div>
                </template>
                <template v-else>
                  <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
              </div>
              <Upload :action="uploadUrl"
                      ref="artReUpload"
                      :show-upload-list="false"
                      :default-file-list="dataDefault"
                      :on-success="handleReSuccess"
                      :format="['jpg','jpeg','png','bmp']"
                      :on-format-error="handleFormatError"
                      :before-upload="handleReBeforeUpload"
                      multiple
                      type="drag"
                      style="display: inline-block;width:100px;">
                <div style="width: 100px;height:100px;line-height: 100px;">
                  <Icon type="ios-camera" size="40"></Icon>
                </div>
              </Upload>
              <modal title="查看照片" v-model="reVisible">
                <img :src="reBigUrl" style="width: 100%">
                <div slot="footer"></div>
              </modal>
            </div>
          </FormItem>
          <FormItem label="文章内容：">
            <div class="editor-container">
              <quill-editor
                ref="myReEditor"
                v-model="artReFormData.content"
                :options="myReOptions"
              ></quill-editor>
              <Upload
                :action="ediUploadUrl"
                ref="editorUpload"
                class="reEditorUp"
                :format="['jpg','jpeg','png','bmp']"
                :on-success="handleReEdiSuccess"
                :on-format-error="handleReEdiFormatError"
                :before-upload="handleReEdiBefore"
                style="display: none"
              >
                <Button>点击上传</Button>
              </Upload>
            </div>
          </FormItem>
          <FormItem label="添加视频：">
            <div class="add-image">
              <div class="demo-upload-list" v-for="item in reVideoUploadList">
                <template v-if="item.status === 'finished'">
                  <video :src="item.url"></video>
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleReVideoView(item.url)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleReVideoRemove(item)"></Icon>
                  </div>
                </template>
                <template v-else>
                  <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
              </div>
              <Upload :action="videoUploadUrl"
                      ref="videoReUpload"
                      :data="videoData"
                      :show-upload-list="false"
                      :on-success="handleReVideoSuccess"
                      :before-upload="handleReVideoBeforeUpload"
                      :default-file-list="dataDefaultVideo"
                      multiple
                      type="drag"
                      style="display: inline-block;width:100px;">
                <div style="width: 100px;height:100px;line-height: 100px;">
                  <Icon type="ios-camera" size="40"></Icon>
                </div>
              </Upload>
              <modal title="查看视频" v-model="reVideoVisible" @on-visible-change="videoClose">
                <video :src="reVideoUrl" controls="controls" style="width: 100%"></video>
                <div slot="footer"></div>
              </modal>
            </div>
          </FormItem>
          <FormItem label="是否推荐：">
            <Checkbox class="ml15" v-model="artReFormData.recomment" true-value="1" false-value="0"></Checkbox>
          </FormItem>
          <FormItem style="width: 200px!important;">
            <Button type="primary" @click="artReSub" :loading="artReLoading">确认修改</Button>
          </FormItem>
        </Form>
      </Drawer>
      <Modal
        title="提示"
        v-model="artTip"
        :mask-closable = "false"
      >
        <p ref="artTip"></p>
        <div slot="footer">
          <Button type="info"  @click="del">确定</Button>
        </div>
      </Modal>
      <Modal
        title="提示"
        v-model="artSuccess"
        :mask-closable = "false"
      >
        <p ref="artSuccess"></p>
        <div slot="close"></div>
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
    name: "configureArticle",
    data () {
      const nameValidate = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写文章标题'))
        } else {
          callback();
        }
      };
      const subValidate = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写文章副标'))
        } else {
          callback();
        }
      };
      const typeValidate = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请选择文章类型'))
        } else {
          callback();
        }
      };
      return {
        uploadUrl:base.baseUrl.serviceOne + 'column_activity/saveFile',//电视台相亲上传图片接口
        ediUploadUrl:base.baseUrl.serviceOne + 'gift/saveGiftFile', //单个图片上传 用礼物上传图片接口 多张图片上传 用相亲专栏图片上传接口
        videoUploadUrl:base.baseUrl.serviceOne + 'documents/saveCommonVideoFile',
        total:'',
        loading:false,
        artValue:false,
        artDetailValue:false,
        artReviseValue:false,
        artLoading:false,
        artReLoading:false,
        artTip:false,
        artSuccess:false,
        tabBig:false,
        tabUrl:'',
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        modelList:[],
        classList:[],
        typeList:[
          {
            value:3,
            label:'全部'
          },
          {
            value:0,
            label:'文章'
          },
          {
            value:1,
            label:'视频'
          },
          {
            value:2,
            label:'文章+视频'
          }
        ],
        //查询参数
        listParams:{
          name:'',
          parentId:'',
          childId:'',
          type:'',
          status:'',
          page:1,
          size:10
        },
        artStatusList:[
          {
            value:2,
            label:'全部'
          },
          {
            value:1,
            label:'展示中'
          },
          {
            value:0,
            label:'隐藏中'
          },
        ],
        //文章类型
        artTypeList:[
          {
            value:0,
            label:'文章'
          },
          {
            value:1,
            label:'视频'
          },
          {
            value:2,
            label:'文章+视频'
          }
        ],
        //新增文章数据
        existModal:[],
        artFormData:{
          levelId:'',
          name:'',
          nameSub:'',
          type:'',
          backPicList:[],
          content:'',
          videoPath:'',
          recomment:'0'
        },
        uploadList:[],
        visible:false,
        bigUrl:'',
        videoData:{ownerType:5},
        videoUploadList:[],
        videoVisible:false,
        videoUrl:'',
        //文章详情
        artDetail:{
          title:'',
          subTitle:'',
          content:'',
          video:''
        },
        isVideo:false,
        //修改文章数据
        artReFormData:{
          id:'',
          levelId:'',
          name:'',
          nameSub:'',
          type:'',
          backPicList:[],
          content:'',
          videoPath:'',
          recomment:'0'
        },
        reUploadList:[],
        dataDefault:[],
        reVisible:false,
        reBigUrl:'',
        reVideoUploadList:[],
        dataDefaultVideo:[],
        reVideoVisible:false,
        reVideoUrl:'',
        //表单验证
        ruleValidate:{
          name:[{validator:nameValidate}],
          nameSub:[{validator:subValidate}],
          type:[{validator:typeValidate}],
        },
        //表格数据
        listData:[],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'文章名称',
            key:'name',
            align:'center'
          },
          {
            title:'所属模块',
            key:'parentName',
            align:'center'
          },
          {
            title:'所属分类',
            key:'childName',
            align:'center'
          },
          {
            title:'文章封面',
            align:'center',
            render:(h,params) => {
              return h('img',{
                attrs:{
                  src:params.row.backPic
                },
                style:{
                  height:'50px',
                  borderRadius:'5px',
                  cursor:'pointer'
                },
                on:{
                  click:() => {
                    this.tabBig = true;
                    this.tabUrl = params.row.backPic
                  }
                }
              })
            }
          },
          {
            title:'是否推荐',
            key:'',
            align:'center',
            render:(h,params) => {
              if (params.row.recomment === 1) {
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
            title:'是否展示',
            key:'',
            align:'center',
            render:(h,params) => {
              if (params.row.status === 1) {
                return h('div',{
                  style:{
                    height:'100%',
                  }
                },'展示中')
              } else {
                return h('div',{
                  style:{
                    height:'100%',
                  }
                },'隐藏')
              }
            }
          },
          {
            title:'浏览次数',
            key:'userNum',
            align:'center'
          },
          {
            title:'创建时间',
            key:'',
            align:'center',
            render:(h,params) => {
                return h('div',{
                  style:{
                    height:'100%',
                  }
                },this.$trans.getTime(params.row.createTime))
            }
          },
          {
            title:'操作选项',
            key:'action',
            align:'center',
            width:260,
            render:(h,params) => {
              const detail = h('Button',{
                props:{
                  type: 'success',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    this.artDetailValue = true;
                    this.artDetail.title = params.row.name;
                    this.artDetail.subTitle = params.row.nameSub;
                    if (params.row.videoPath !== '' && params.row.videoPath != null) {
                      this.isVideo = true;
                      this.artDetail.video = params.row.videoPath;
                    } else {
                      this.isVideo = false;
                    }
                    axios.ArticlrContentDetail({id:params.row.id})
                      .then(res => {
                        //console.log(res);
                        if (res.code === '0') {
                          this.artDetail.content = res.data.content;
                          this.$refs.deContent.innerHTML =  this.artDetail.content;
                        } else {
                          this.$Message.error('文章内容查询失败！');
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.$Message.error('文章内容查询失败！');
                      })
                  }
                }
              },'详情');
              const revise = h('Button',{
                props:{
                  type: 'info',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    this.artReviseValue = true;
                    this.artReFormData.id = params.row.id;
                    this.getAllModal(params.row.id);
                    this.artReFormData.levelId = params.row.levelId;
                    this.artReFormData.name = params.row.name;
                    this.artReFormData.nameSub = params.row.nameSub;
                    this.artReFormData.type = params.row.type;
                    if (params.row.backPicList.length > 0) {  //这里要做一下判断 否则如果原先没有封面 修改添加的时候reUploadList元素会缺少percentage等键值 添加第一张时会报错
                      params.row.backPicList.forEach((item,index) => {
                        this.dataDefault.push({url:item,name:index,status:'finished'})
                      });
                      this.$refs.artReUpload.fileList = this.dataDefault;
                      this.reUploadList = this.$refs.artReUpload.fileList;
                    }
                    this.artReFormData.videoPath = params.row.videoPath;
                    if (params.row.videoPath !== '' && params.row.videoPath != null) {
                      this.dataDefaultVideo.push({url:params.row.videoPath,status:'finished'});
                    } else {
                      this.dataDefaultVideo = [];
                    }
                    this.$refs.videoReUpload.fileList = this.dataDefaultVideo;
                    this.reVideoUploadList = this.$refs.videoReUpload.fileList;
                    this.artReFormData.recomment = params.row.recomment.toString();
                    axios.ArticlrContentDetail({id:params.row.id})
                      .then(res => {
                        //console.log(res);
                        if (res.code === '0') {
                          this.artReFormData.content = res.data.content;
                        } else {
                          this.$Message.error('文章内容查询失败！');
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.$Message.error('文章内容查询失败！');
                      })
                  }
                }
              },'修改');
              const show =  h('Button',{
                props:{
                  type: 'success',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    axios.ArticleStatus({id:params.row.id,status:1})
                      .then(res => {
                        //console.log(res);
                        if (res.code === '0') {
                          this.artTip = true;
                          this.$refs.artTip.innerHTML = res.data;
                          this.getArticleList();
                        } else {
                          this.artTip = true;
                          this.$refs.artTip.innerHTML = res.message;
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.artTip = true;
                        this.$refs.artTip.innerHTML = '操作失败！';
                      })
                  }
                }
              },'展示');
              const hidden =  h('Button',{
                props:{
                  type: 'error',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    //console.log(params.row.id);
                    axios.ArticleStatus({id:params.row.id,status:0})
                      .then(res => {
                        //console.log(res);
                        if (res.code === '0') {
                          this.artTip = true;
                          this.$refs.artTip.innerHTML = res.data;
                          this.getArticleList();
                        } else {
                          this.artTip = true;
                          this.$refs.artTip.innerHTML = res.message;
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.artTip = true;
                        this.$refs.artTip.innerHTML = '操作失败！';
                      })
                  }
                }
              },'隐藏');
              const recommend = h('Button',{
                props:{
                  type: 'success',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    axios.ArticleRecommeend({id:params.row.id,recomment:1})
                      .then(res => {
                        //console.log(res);
                        if (res.code === '0') {
                          this.artTip = true;
                          this.$refs.artTip.innerHTML = res.data;
                          this.getArticleList();
                        } else {
                          this.artTip = true;
                          this.$refs.artTip.innerHTML = res.message;
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.artTip = true;
                        this.$refs.artTip.innerHTML = '操作失败！';
                      })
                  }
                }
              },'设置推荐');
              const noRecommend = h('Button',{
                props:{
                  type: 'error',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    axios.ArticleRecommeend({id:params.row.id,recomment:0})
                      .then(res => {
                        //console.log(res);
                        if (res.code === '0') {
                          this.artTip = true;
                          this.$refs.artTip.innerHTML = res.data;
                          this.getArticleList();
                        } else {
                          this.artTip = true;
                          this.$refs.artTip.innerHTML = res.message;
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.artTip = true;
                        this.$refs.artTip.innerHTML = '操作失败！';
                      })
                  }
                }
              },'取消推荐');
              if (params.row.status === 0 && params.row.recomment === 0) {
                return h('div',[
                  recommend,
                  detail,
                  revise,
                  show,
                ])
              } else if (params.row.status === 0 && params.row.recomment === 1) {
                return h('div',[
                  noRecommend,
                  detail,
                  revise,
                  show,
                ])
              } else if (params.row.status === 1 && params.row.recomment === 0) {
                return h('div',[
                  recommend,
                  detail,
                  revise,
                  hidden,
                ])
              } else if (params.row.status === 1 && params.row.recomment === 1) {
                return h('div',[
                  noRecommend,
                  detail,
                  revise,
                  hidden,
                ])
              }
            }
          }
        ],
        //编辑器相关
        myOptions:{
          placeholder:'请编写文章内容',
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
        myReOptions:{
          placeholder:'请编写文章内容',
          theme:'snow',
          modules:{
            toolbar:{
              container:toolbarOptions,
              handlers:{
                image:function (value) {
                  if (value) {
                    document.querySelector('.reEditorUp input').click();
                  } else {
                    this.quill.format('image',false);
                  }
                }
              }
            }
          }
        }
      }
    },
    mounted () {
      this.uploadList = this.$refs.artUpload.fileList;
      this.videoUploadList = this.$refs.videoUpload.fileList;
      this.getArticleList();
      this.getCheckParams();
      this.getCheckParamsSec();
    },
    methods:{
      //获取查询条件一二级层级
      getCheckParams:function () {
        axios.ArticleCheckModal({level:0})
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.modelList = res.data;
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      getCheckParamsSec:function () {
        this.listParams.childId = '';
        //console.log(this.listParams.parentId);
        axios.ArticleCheckModal({level:1,parentId:this.listParams.parentId})
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.classList = res.data;
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      //获取文章列表
      getArticleList:function () {
        this.loading = true;
        axios.ArticleList(this.listParams)
          .then(res => {
            //console.log(res);
            if (res.code === 0) {
              this.loading = false;
              this.listData = res.data;
              this.total = res.total;
            } else {
              this.artTip = true;
              this.$refs.artTip.innerHTML = '查询出错！'
            }
          })
          .catch(error => {
            console.log(error);
            this.artTip = true;
            this.$refs.artTip.innerHTML = '查询出错！'
          })
      },
      //点击添加按钮
      addArticle:function () {
        this.artValue = true;
        this.getAllModal('');
      },
      //点击查询按钮
      checkArticle:function () {
        this.listParams.page = 1;
        this.getArticleList();
      },
      //切换分页
      artPageChange:function (page) {
        //console.log(page);
        this.listParams.page = page;
        this.getArticleList();
      },
      //数据重置
      clearArtData:function () {
        this.$refs.artForm.resetFields();
        this.artFormData.levelId = '';
        this.artFormData.backPicList = [];
        this.artFormData.content = '';
        this.artFormData.videoPath = '';
        this.artFormData.recomment = '0';
        this.$refs.artUpload.clearFiles();
        this.uploadList = this.$refs.artUpload.fileList;
        this.$refs.videoUpload.clearFiles();
        this.videoUploadList = this.$refs.videoUpload.fileList;
      },
      clearArtDetailData:function () {
        this.isVideo = false;
        this.artDetail.title = '';
        this.artDetail.subTitle = '';
        this.artDetail.content = '';
        this.artDetail.video = '';
      },
      clearArtReviseData:function () {
        this.$refs.artReForm.resetFields();
        this.artReFormData.id = '';
        this.artReFormData.levelId = '';
        this.artReFormData.backPicList = [];
        this.artReFormData.content = '';
        this.artReFormData.videoPath = '';
        this.artReFormData.recomment = '0';
        this.dataDefault = [];
        this.$refs.artReUpload.clearFiles();
        this.reUploadList = this.$refs.artReUpload.fileList;
        this.dataDefaultVideo = [];
        this.$refs.videoReUpload.clearFiles();
        this.reVideoUploadList = this.$refs.videoReUpload.fileList;
      },
      //新增文章
      //获取已有层级结构
      getAllModal:function (id) {
        axios.ModalExist({type:2,id:id})
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.existModal = res.data;
            } else {
              this.$Message.error('获取模块失败！');
            }
          })
          .catch(error => {
            console.log(error);
            this.$Message.error('获取模块失败！');
          })
      },
      //上传封面
      handleSuccess:function (res,file,fileList) {
        if (res.code === 200) {
          file.url = res.result[0].filePath;
        } else {
          this.artTip = true;
          this.$refs.artTip.innerHTML = '封面上传失败！'
        }
      },
      handleFormatError:function () {
        this.$Message.warning('请选择格式为“jpg，jpeg，png，bmp”格式的图片！');
      },
      handleBeforeUpload:function (file) {
        const check = this.uploadList.length < 3;
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
        this.visible =true;
        this.bigUrl = url;
      },
      handleRemove:function (file) {
        const fileList = this.$refs.artUpload.fileList;
        this.$refs.artUpload.fileList.splice(fileList.indexOf(file), 1);
        this.uploadList = this.$refs.artUpload.fileList;
      },
      //发布编辑器
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
      //添加视频
      handleVideoView:function (url) {
        this.videoVisible = true;
        this.videoUrl = url;
      },
      handleVideoRemove:function (file) {
        const fileList = this.$refs.videoUpload.fileList;
        this.$refs.videoUpload.fileList.splice(fileList.indexOf(file), 1);
        this.videoUploadList = this.$refs.videoUpload.fileList;
        this.artFormData.videoPath = '';
      },
      handleVideoSuccess:function (res,file,fileList) {
        if (res.code === 200) {
          file.url = res.result.filePath;
          this.artFormData.videoPath = res.result.filePath;
        } else {
          this.artTip = true;
          this.$refs.artTip.innerHTML = '视频上传失败！'
        }
      },
      handleVideoBeforeUpload:function (file) {
        const check = this.videoUploadList.length < 1;
        const len = file.name.length <= 50;
        if (!len) {
          this.$Message.warning('视频名过长！');
          return len;
        }
        if (!check) {
          this.$Message.warning('只能上传1个视频！');
          return check;
        }
      },
      artSub:function () {
        this.$refs.artForm.validate(valid => {
          if (valid) {
            this.artLoading = true;
            //将图片路径push进list
            this.uploadList.forEach(item => {
              this.artFormData.backPicList.push(item.url);
            });
            axios.ArticleAddOrRevise(this.artFormData)
              .then(res => {
                //console.log(res);
                this.artLoading = false;
                if (res.code === '0') {
                  this.artSuccess = true;
                  this.$refs.artSuccess.innerHTML = '文章保存成功！';
                  this.listParams.page = 1;
                  this.getArticleList();
                } else {
                  this.artTip = true;
                  this.$refs.artTip.innerHTML = res.message;
                  this.artFormData.backPicList = [];
                }
              })
              .catch(error => {
                console.log(error);
                this.artLoading = false;
                this.artTip = true;
                this.$refs.artTip.innerHTML = '文章保存失败！';
                this.artFormData.backPicList = [];
              })
          }
        });
      },
      //修改文章
      handleReView:function (url) {
        this.reVisible = true;
        this.reBigUrl = url;
      },
      handleReRemove:function (file) {
        const fileList = this.$refs.artReUpload.fileList;
        this.$refs.artReUpload.fileList.splice(fileList.indexOf(file), 1);
        this.reUploadList = this.$refs.artReUpload.fileList;
      },
      handleReSuccess:function (res,file,fileList) {
        //console.log(res);
        if (res.code === 200) {
          file.url = res.result[0].filePath;
          this.reUploadList = fileList;
        } else {
          this.artTip = true;
          this.$refs.artTip.innerHTML = res.message;
        }
      },
      handleReBeforeUpload:function (file) {
        file.percentage = 0;
        const check = this.reUploadList.length < 3;
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
      //修改编辑器.
      handleReEdiSuccess:function (res,file,fileList) {
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
      handleReEdiFormatError:function () {
        this.$Message.warning('请选择格式为“jpg，jpeg，png，bmp”格式的图片！');
      },
      handleReEdiBefore:function (file) {
        const len = file.name.length <= 50;
        if (!len) {
          this.$Message.warning('图片名过长！');
        }
        return len;
      },
      //视频
      handleReVideoView:function (url) {
        this.reVideoVisible = true;
        this.reVideoUrl = url;
      },
      handleReVideoRemove:function (file) {
        const fileList = this.$refs.videoReUpload.fileList;
        this.$refs.videoReUpload.fileList.splice(fileList.indexOf(file), 1);
        this.reVideoUploadList = this.$refs.videoReUpload.fileList;
        this.artReFormData.videoPath = '';
        this.artReFormData.type = 0;
      },
      handleReVideoSuccess:function (res,file,fileList) {
        if (res.code === 200) {
          file.url = res.result.filePath;
          this.artReFormData.videoPath = res.result.filePath;
          this.reVideoUploadList = fileList;
          if (this.artReFormData.content === '') {
            this.artReFormData.type = 1;
          } else {
            this.artReFormData.type = 2;
          }
        } else {
          this.artTip = true;
          this.$refs.artTip.innerHTML = '视频上传失败！'
        }
      },
      handleReVideoBeforeUpload:function (file) {
        const check = this.reVideoUploadList.length < 1;
        const len = file.name.length <= 50;
        if (!len) {
          this.$Message.warning('视频名过长！');
          return len;
        }
        if (!check) {
          this.$Message.warning('只能上传1个视频！');
          return check;
        }
      },
      artReSub:function () {
        this.$refs.artReForm.validate(valid => {
          if (valid) {
            this.artReLoading = true;
            this.reUploadList.forEach(item => {
              this.artReFormData.backPicList.push(item.url);
            });
            axios.ArticleAddOrRevise(this.artReFormData)
              .then(res => {
                //console.log(res);
                this.artReLoading = false;
                if (res.code === '0') {
                  this.clearArtReviseData();
                  this.artReviseValue = false;
                  this.artTip = true;
                  this.$refs.artTip.innerHTML = res.data;
                  this.getArticleList();
                } else {
                  this.artTip = true;
                  this.$refs.artTip.innerHTML = res.message;
                }
              })
              .catch(error => {
                console.log(error);
                this.artReLoading = false;
                this.artTip = true;
                this.$refs.artTip.innerHTML = '修改失败！'
              })
          }
        })
      },
      //关闭操作
      del:function () {
        this.artTip = false;
      },
      goList:function () {
        this.clearArtData();
        this.artSuccess = false;
        this.artValue = false;
      },
      addMore:function () {
        this.clearArtData();
        this.artSuccess = false;
      },
      videoAddClose:function (value) {
        if (!value) {
          this.videoUrl = '';
        }
      },
      videoClose:function (value) {
        if (!value) {
          this.reVideoUrl = '';
        }
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
    width: 550px;
  }
  .p{
    width: 50px;
    height: 90px;
    line-height: 90px;
    text-align: left;
    padding: 10px 0;
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
  .configure-container .ivu-radio-group{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    //padding:  0 30px;
    //height: 550px;
    //border: 1px solid #cccccc;
    //overflow-y: scroll;
    dl{
      margin-left: 30px;
      dd{
        text-align: left;
        padding-left: 15px;
      }
    }
  }
  .ivu-radio-group-vertical .ivu-radio-wrapper{
    height: auto;
  }
  .article{
    //text-align: left;
    text-indent: 2em;
    img{
      text-align:center
    }
  }
</style>
