<template>
  <div class="container content-pad">
    <div class="community-fun">
      <div class="community-ope">
        <Button type="default" icon="md-add" @click="addNews">添加新闻</Button>
      </div>
      <div class="community-search">
        <span class="ml15">新闻标题：</span>
        <span><Input class="middle-checkWid" v-model="listParams.newTitle"/></span>
        <span class="ml15">一级分类：</span>
        <span>
          <Select class="middle-checkWid" v-model="listParams.newOneType" @on-change="getNewsSeconds">
            <Option v-for="item in firstClass" :value="item.value" :key="item.value">{{item.label}}</Option>
          </Select>
        </span>
        <span class="ml15">二级分类：</span>
        <span>
          <Select class="middle-checkWid" v-model="listParams.newTwoType">
            <Option v-for="item in secondList" :value="item.id" :key="item.id">{{item.typeName}}</Option>
          </Select>
        </span>
        <span class="ml15">推送状态：</span>
        <span>
          <Select class="middle-checkWid" v-model="listParams.pushResult">
            <Option v-for="(item,index) in pushStatus" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select>
        </span>
        <span class="ml10"><Button icon="ios-search" @click="checkNews">查询</Button></span>
      </div>
    </div>
    <div class="community-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading"></Table>
      <Page :total="total" :current="listParams.pageNum" v-if="total>10" show-elevator show-total @on-change="newsPageChange" class="mt30"/>
    </div>
    <Drawer
      title='发布新闻'
      v-model="newsValue"
      width="1200"
      :mask-closable="false"
      :styles="styles"
      @on-close="clearNewsData"
    >
      <Form :model="newsFormData" ref="newsForm" :rules="ruleValidate" style="width: 100%;margin-top: 20px;">
        <FormItem label="一级分类：" :label-width="100" prop="newOneType">
          <Select v-model="newsFormData.newOneType" @on-change="addGetSecond" style="width: 400px;">
            <Option v-for="(item,index) in firstClass" :key="index" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="二级分类：" :label-width="100" prop="newTwoType">
          <Select v-model="newsFormData.newTwoType" style="width: 400px;">
            <Option v-for="(item,index) in addSecond" :key="index" :value="item.id">{{item.typeName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="新闻标题：" prop="newTitle" :label-width="100">
          <Input type="text" :maxlength="80" v-model="newsFormData.newTitle" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="新闻关键词：" prop="newKeyWord" :label-width="100">
          <Input type="text" :maxlength="80" v-model="newsFormData.newKeyWord" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="新闻简介：" prop="newBrief" :label-width="100">
          <Input type="text" v-model="newsFormData.newBrief" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="新闻内容：" :label-width="100">
          <editor-view ref="newsContent" :upload-url="uploadUrl" v-on:transmit-con="getNewsContent"></editor-view>
        </FormItem>
        <FormItem>
          <upload-view ref="newsCover" :upload-url="uploadUrl" title="大众列表图片" :length="9" :width="100" con-width="100%" v-on:success-callback="successNewsCoverPath" v-on:remove-callback="removeNewsCoverPath"></upload-view>
        </FormItem>
        <FormItem>
          <upload-view ref="videoCover" :upload-url="uploadUrl" title="视频背景图" :length="9" :width="100" con-width="100%" v-on:success-callback="successVideoCoverPath" v-on:remove-callback="removeVideoCoverPath"></upload-view>
        </FormItem>
        <FormItem>
          <upload-view ref="contentCover" :upload-url="uploadUrl" title="正文背景图" :length="1" :width="100" con-width="100%" v-on:success-callback="successContentCoverPath" v-on:remove-callback="removeContentCoverPath"></upload-view>
        </FormItem>
        <FormItem label="视频类型：" :label-width="100">
          <Select v-model="newsFormData.videoType" style="width: 400px;">
            <Option v-for="(item,index) in videoTypeList" :key="index" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem v-if="newsFormData.videoType === '0'">
          <!--封装的视频上传组件 可以将以前的视频上传替换成组件-->
          <video-view  ref="newsVideo" :upload-url="uploadUrl" title="上传视频" :length="1" :width="100" con-width="100%" v-on:success-callback="successNewsVideo" v-on:remove-callback="removeNewsVideo"></video-view>
        </FormItem>
        <FormItem label="视频链接：" :label-width="100" v-else>
          <Input type="text"  v-model="newsFormData.videoPath" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="视频时长：" prop="newVideoDuration" :label-width="100">
          <InputNumber v-model="newsFormData.newVideoDuration" style="width: 400px;"></InputNumber>
        </FormItem>
        <FormItem :label-width="100">
          <Row>
            <Col span="4">
              <FormItem>
                <Checkbox v-model="newsFormData.isParticiple" true-value="0" false-value="1">是否自动分词</Checkbox>
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem><Checkbox v-model="newsFormData.isAllowComment" true-value="0" false-value="1">是否允许评论</Checkbox></FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem style="width: 200px!important;" :label-width="100">
          <Button type="primary" @click="newsSub" :loading="newsLoading">确认发布</Button>
        </FormItem>
      </Form>
    </Drawer>
    <!--详情-->
    <Drawer
      title='新闻详情'
      v-model="detailValue"
      width="1200"
      :mask-closable="false"
      :styles="styles"
      @on-close="clearNewsDetailData"
    >
      <h1 style="text-align: center;">{{newsDetailData.newTitle}}</h1>
      <div class="mt30 article" ref="deContent"></div>
      <video :src="newsDetailData.videoPath" v-if="isNewsVideo" controls="controls" style="width: 50%;margin: 30px auto 0;display: block;"></video>
    </Drawer>
    <!--修改-->
    <Drawer
      title='新闻修改'
      v-model="reviseValue"
      width="1200"
      :mask-closable="false"
      :styles="styles"
      @on-close="clearNewsReviseData"
    >
      <Form :model="newsReviseData" ref="newsRevise" :rules="ruleValidate" style="width: 100%;margin-top: 20px;">
        <FormItem label="一级分类：" :label-width="100" prop="newOneType">
          <Select v-model="newsReviseData.newOneType" @on-change="addReviseSecond" style="width: 400px;">
            <Option v-for="(item,index) in firstClass" :key="index" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="二级分类：" :label-width="100" prop="newTwoType">
          <Select v-model="newsReviseData.newTwoType" style="width: 400px;">
            <Option v-for="(item,index) in addSecond" :key="index" :value="item.id">{{item.typeName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="新闻标题：" prop="newTitle" :label-width="100">
          <Input type="text" :maxlength="80" v-model="newsReviseData.newTitle" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="新闻关键词：" prop="newKeyWord" :label-width="100">
          <Input type="text" :maxlength="80" v-model="newsReviseData.newKeyWord" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="新闻简介：" prop="newBrief" :label-width="100">
          <Input type="text" :maxlength="80" v-model="newsReviseData.newBrief" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="新闻内容：" :label-width="100">
          <revise-editor-view ref="newsEdRe" :upload-url="uploadUrl" :original-content="newsReviseData.newContent" :watch-value="isNewsWatch" v-on:transmit-con="getReviseContent"></revise-editor-view>
        </FormItem>
        <FormItem>
          <revise-upload-view ref="newsCoverRe" :upload-url="uploadUrl" title="大众列表图片" :length="9" :width="100" con-width="100%" :default-list="defaultNewsCover" :list-value="isNewsCoverRe" v-on:success-callback="newsCoverReSuccess" v-on:remove-callback="newsCoverReRemove"></revise-upload-view>
        </FormItem>
        <FormItem>
          <revise-upload-view ref="videoCoverRe" :upload-url="uploadUrl" title="视频背景图" :length="9" :width="100" con-width="100%" :default-list="defaultVideoCover" :list-value="isVideoCoverRe" v-on:success-callback="videoCoverReSuccess" v-on:remove-callback="videoCoverReRemove"></revise-upload-view>
        </FormItem>
        <FormItem>
          <revise-upload-view ref="contentCoverRe" :upload-url="uploadUrl" title="正文背景图" :length="1" :width="100" con-width="100%" :default-list="defaultContentCover" :list-value="isContentCoverRe" v-on:success-callback="contentCoverReSuccess" v-on:remove-callback="contentCoverReRemove"></revise-upload-view>
        </FormItem>
        <FormItem label="视频类型：" :label-width="100">
          <Select v-model="newsReviseData.videoType" style="width: 400px;" @on-change="reVideoType">
            <Option v-for="(item,index) in videoTypeList" :key="index" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem v-show="newsReviseData.videoType === '0'">
          <!--封装的视频上传组件 可以将以前的视频上传替换成组件-->
          <revise-video-view  ref="newsVideoRe" :upload-url="uploadUrl" title="上传视频" :length="1" :width="100" con-width="100%" :default-list="defaultVideo" :watch-value="isVideoShow" v-on:success-callback="videoReSuccess" v-on:remove-callback="videoReRemove"></revise-video-view>
        </FormItem>
        <FormItem  label="视频链接：" :label-width="100" v-show="newsReviseData.videoType === '1'">
          <Input type="text"  v-model="newsReviseData.videoPath" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="视频时长：" prop="newVideoDuration" :label-width="100">
          <InputNumber type="text"  v-model="newsReviseData.newVideoDuration" style="width: 400px;"></InputNumber>
        </FormItem>
        <FormItem :label-width="100">
          <Row>
            <Col span="4">
              <FormItem>
                <Checkbox v-model="newsReviseData.isParticiple" true-value="0" false-value="1">是否自动分词</Checkbox>
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem><Checkbox v-model="newsReviseData.isAllowComment" true-value="0" false-value="1">是否允许评论</Checkbox></FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem style="width: 200px!important;" :label-width="100">
          <Button type="primary" @click="newsRevise" :loading="newsReviseLoading">确认修改</Button>
        </FormItem>
      </Form>
    </Drawer>
    <!--弹框-->
    <Modal
      title="提示"
      v-model="newsTip"
      :mask-closable = "false"
    >
      <p ref="newsTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "../../axios/axios";
  import * as base from '../../axios/base';
  const oneValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请选择一级分类'))
    } else {
      callback();
    }
  };
  const titleValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写新闻标题'))
    } else {
      callback();
    }
  };
  const brirfValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写新闻简介'))
    } else {
      callback();
    }
  };
  const keyValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写新闻关键词'))
    } else {
      callback();
    }
  };
  export default {
    name: "configureNews",
    data () {
      return {
        uploadUrl:base.baseUrl.serviceOne + 'documents/saveOSSFiles', //所有的图片视频上传到阿里云
        videoUploadUrl:base.baseUrl.serviceTwo + 'documents/saveFiles',
        total:'',
        loading:false,
        newsValue:false,
        newsTip:false,
        newsLoading:false,
        detailValue:false,
        reviseValue:false,
        newsReviseLoading:false,
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        videoTypeList:[
          {
            value:'0',
            label:'本地视频'
          },
          {
            value:'1',
            label:'在线视频'
          }
        ],
        firstClass:[
          {
            value:0,
            label:'推荐新闻'
          },
          {
            value:1,
            label:'公司新闻'
          }
        ],
        secondList:[],
        pushStatus:[
          {
            value:0,
            label:'未推送'
          },
          {
            value:1,
            label:'推送中'
          },
          {
            value:2,
            label:'推送成功'
          },
          {
            value:3,
            label:'推送失败'
          }
        ],
        listParams:{
          newTitle:'', //新闻标题
          newOneType:'', //一级类型
          newTwoType:'', //二级类型
          pushResult:'', //推送结果
          pageNum:1,
          pageSize:10,
          owenrId:'',
        },
        listData:[],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'新闻标题',
            key:'newTitle',
            align:'center'
          },
          {
            title:'新闻简介',
            key:'newBrief',
            align:'center'
          },
          {
            title:'关键字',
            key:'newKeyWord',
            align:'center'
          },
          {
            title:'一级分类',
            align:'center',
            render:(h,params) => {
              if (params.row.newOneType === '0') {
                return h('div',{
                  style:{
                    height:'100%'
                  }
                },'推荐新闻')
              } else {
                return h('div',{
                  style:{
                    height:'100%'
                  }
                },'公司新闻')
              }
            }
          },
          {
            title:'二级分类',
            key:'newTwoTypeName',
            align:'center'
          },
          {
            title:'推送状态',
            key:'pushResultMessage',
            align:'center'
          },
          {
            title:'操作选项',
            align:'center',
            width:230,
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
                    axios.NewsDetail({id:params.row.id,owenrId:this.userId})
                      .then(res => {
                        //console.log(res);
                        if (res.code === '0') {
                          this.detailValue = true;
                          let message = res.data[0];
                          this.isNewsVideo = message.videoPath && message.videoPath !== '';
                          if (this.isNewsVideo) {
                            this.newsDetailData.videoPath = message.videoPath;
                          }
                          this.newsDetailData.newTitle = message.newTitle;
                          this.newsDetailData.newContent = message.newContent;
                          this.$refs.deContent.innerHTML = this.newsDetailData.newContent;
                        } else {
                          this.newsTip = true;
                          this.$refs.newsTip.innerHTML = '详情查询出错！';
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.newsTip = true;
                        this.$refs.newsTip.innerHTML = '详情查询出错！';
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
                    axios.NewsDetail({id:params.row.id,owenrId:this.userId})
                      .then(res => {
                        //console.log(JSON.stringify(res.data[0]));
                        if (res.code === '0') {
                          this.reviseValue = true;
                          this.isNewsWatch = true;
                          this.isNewsCoverRe = true;
                          this.isVideoCoverRe = true;
                          this.isContentCoverRe = true;
                          this.isVideoShow = true;
                          let message = res.data[0];
                          this.newsReviseData.id = message.id;
                          this.newsReviseData.newOneType = parseInt(message.newOneType);
                          this.addReviseSecond();
                          this.newsReviseData.newTwoType = parseInt(message.newTwoType);
                          this.newsReviseData.newTitle = message.newTitle;
                          this.newsReviseData.newBrief = message.newBrief;
                          this.newsReviseData.newKeyWord = message.newKeyWord;
                          this.newsReviseData.newContent = message.newContent;
                          this.newsReviseData.isAllowComment = message.isAllowComment;
                          this.newsReviseData.isParticiple = message.isParticiple;
                          this.newsReviseData.newVideoDuration = message.newVideoDuration;
                          this.newsReviseData.videoType = message.videoType;
                          if (message.publicPicPath !== '') {
                            this.newsReviseData.publicPicPath = message.publicPicPath;
                            message.publicPicPath.split(',').forEach(item => {
                              this.defaultNewsCover.push({url:item,status:'finished'})
                            });
                          } else {
                            this.defaultNewsCover = [];
                          }
                          if (message.videoPicPath !== '') {
                            this.newsReviseData.videoPicPath = message.videoPicPath;
                            message.videoPicPath.split(',').forEach(item => {
                              this.defaultVideoCover.push({url:item,status:'finished'})
                            });
                          } else {
                            this.defaultVideoCover = [];
                          }
                          if (message.newPicPath !== '') {
                            this.newsReviseData.newPicPath = message.newPicPath;
                            message.newPicPath.split(',').forEach(item => {
                              this.defaultContentCover.push({url:item,status:'finished'})
                            });
                          } else {
                            this.defaultContentCover = [];
                          }
                          if (message.videoType === '0') {
                            if (message.videoPath !== '') {
                              this.newsReviseData.videoPath = message.videoPath;
                              message.videoPath.split(',').forEach(item => {
                                this.defaultVideo.push({url:item,status:'finished'})
                              });
                            } else {
                              this.defaultVideo = [];
                            }
                          } else {
                            this.newsReviseData.videoPath = message.videoPath;
                          }
7
                        } else {
                          this.newsTip = true;
                          this.$refs.newsTip.innerHTML = '详情查询出错！';
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.newsTip = true;
                        this.$refs.newsTip.innerHTML = '详情查询出错！';
                      })
                  }
                }
              },'修改');
              const del = h('Button',{
                props:{
                  type: 'error',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    axios.NewsDelete({id:params.row.id,owenrId:this.userId})
                      .then(res => {
                        //console.log(res);
                        this.newsTip = true;
                        this.$refs.newsTip.innerHTML = res.data;
                        if (res.code === '0') {
                          this.getNewsList();
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.newsTip = true;
                        this.$refs.newsTip.innerHTML = '操作失败！';
                      })
                  }
                }
              },'删除');
              const push = h('Button',{
                props:{
                  type: 'warning',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {

                  }
                }
              },'推送');
              return h('div',[
                detail,
                revise,
                push,
                del
              ])
            }
          }
        ],
        addSecond:[],
        newsFormData:{
          newTitle:'', //新闻标题
          newOneType:'', //新闻一级类型
          newTwoType:'', //新闻二级类型
          newBrief:'', //新闻简介
          newContent:'', //新闻内容
          newKeyWord:'', //新闻关键字
          isParticiple:'0', //是否自动分词
          isAllowComment:'0', //是否允许评论
          newVideoDuration:null, //视频时长
          publicPicPath:'', //大众列表图片
          videoPicPath:'', //视频背景图
          newPicPath:'', //正文背景图
          videoPath:'', //视频地址
          videoType:'0',
          owenrId:'',
        },
        //详情
        isNewsVideo:false,
        newsDetailData:{
          newTitle:'',
          newContent:'',
          videoPath:'',
          owenrId:'',
        },
        //修改
        isNewsWatch:false,
        isNewsCoverRe:false,
        isVideoCoverRe:false,
        isContentCoverRe:false,
        isVideoShow:false,
        defaultNewsCover:[],
        defaultVideoCover:[],
        defaultContentCover:[],
        defaultVideo:[],
        newsReviseData:{
          id:'',
          newTitle:'', //新闻标题
          newOneType:'', //新闻一级类型
          newTwoType:'', //新闻二级类型
          newBrief:'', //新闻简介
          newContent:'', //新闻内容
          newKeyWord:'', //新闻关键字
          isParticiple:'0', //是否自动分词
          isAllowComment:'0', //是否允许评论
          newVideoDuration:null, //视频时长
          publicPicPath:'', //大众列表图片
          videoPicPath:'', //视频背景图
          newPicPath:'', //正文背景图
          videoPath:'', //视频地址
          videoType:'0',
          owenrId:'',
        },
        ruleValidate:{
          newOneType:[
            {validator:oneValidate}
          ],
          newTitle:[
            {validator:titleValidate}
          ],
          newKeyWord:[
            {validator:keyValidate}
          ],
          newBrief:[
            {validator:brirfValidate}
          ]
        }
      }
    },
    computed:{
      userId:function () {
        return this.$store.state.user_id;
      }
    },
    mounted () {
      if (sessionStorage.getItem('userId') != null) {
        this.$store.state.user_id = sessionStorage.getItem('userId');
      }
      //console.log(this.userId);
      this.listParams.owenrId = this.userId;
      this.newsFormData.owenrId = this.userId;
      this.newsDetailData.owenrId = this.userId;
      this.newsReviseData.owenrId = this.userId;
      this.getNewsList();
    },
    methods:{
      //获取新闻列表
      getNewsList:function () {
        this.loading = true;
        axios.NewsList(this.listParams)
          .then(res => {
            //console.log(res.data.list);
            if (res.code === '0') {
              this.loading = false;
              this.listData = res.data.list;
              this.total = res.data.total;
            } else {
              this.newsTip = true;
              this.$refs.newsTip.innerHTML = '查询出错！';
            }
          })
          .catch(error => {
            console.log(error);
            this.newsTip = true;
            this.$refs.newsTip.innerHTML = '查询出错！';
          })
      },
      //查询二级分类
      getNewsSeconds:function () {
        axios.NewsSecondClass({queryKey:this.listParams.newOneType})
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.secondList = res.data;
            } else {
              this.$Message.error('获取二级分类失败！')
            }
          })
          .catch(error => {
            console.log(error);
            this.$Message.error('获取二级分类失败！')
          })
      },
      addNews:function () {
        this.newsValue = true;
      },
      checkNews:function () {
        this.listParams.pageNum = 1;
        this.getNewsList();
      },
      newsPageChange:function (page) {
        this.listParams.pageNum = page;
        this.getNewsList();
      },
      del:function () {
        this.newsTip = false;
      },
      clearNewsData:function () {
        this.$refs.newsForm.resetFields();
        this.newsFormData.isParticiple = '0';
        this.newsFormData.isAllowComment = '0';
        this.$refs.newsContent.clearData();
        this.$refs.newsCover.clearUpload();
        this.$refs.videoCover.clearUpload();
        this.$refs.contentCover.clearUpload();
        if (this.newsFormData.videoType === '0') {
          this.$refs.newsVideo.clearUpload();
        }
        this.addSecond = [];
        this.newsFormData.videoType = '0';
      },
      clearNewsDetailData:function () {
        this.newsDetailData.newTitle = '';
        this.newsDetailData.newContent = '';
        this.isNewsVideo = false;
        this.newsDetailData.videoPath = '';
      },
      clearNewsReviseData:function () {
        if (this.newsReviseData.videoType === '0') {
          this.$refs.newsVideoRe.clearUpload();
        }
        this.addSecond = [];
        this.isNewsWatch = false;
        this.isNewsCoverRe = false;
        this.isVideoCoverRe = false;
        this.isContentCoverRe = false;
        this.isVideoShow = false;
        this.defaultNewsCover = [];
        this.defaultVideoCover= [];
        this.defaultContentCover = [];
        this.defaultVideo = [];
        this.newsReviseData.videoType = '0';
        this.$refs.newsEdRe.clearData();
        this.$refs.newsCoverRe.clearUpload();
        this.$refs.videoCoverRe.clearUpload();
        this.$refs.contentCoverRe.clearUpload();
        this.$refs.newsRevise.resetFields();
        this.newsReviseData.isParticiple = '0';
        this.newsReviseData.isAllowComment = '0';
      },
      addGetSecond:function () {
        if (this.newsValue) {
          axios.NewsSecondClass({queryKey:this.newsFormData.newOneType})
            .then(res => {
              //console.log(res);
              if (res.code === '0') {
                this.addSecond = res.data;
              } else {
                this.$Message.error('获取二级分类失败！')
              }
            })
            .catch(error => {
              console.log(error);
              this.$Message.error('获取二级分类失败！')
            })
        }
      },
      getNewsContent:function (con) {
        this.newsFormData.newContent = con;
      },
      successNewsCoverPath:function (file,title,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.newsFormData.publicPicPath = arr.join();
      },
      removeNewsCoverPath:function (file,fileList) { //file是删除的当前项 list是剩余的图片
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.newsFormData.publicPicPath = arr.join();;
        //console.log(this.newsFormData.publicPicPath)
      },
      successVideoCoverPath:function (file,title,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.newsFormData.videoPicPath = arr.join();
      },
      removeVideoCoverPath:function (file,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.newsFormData.videoPicPath = arr.join();
      },
      successContentCoverPath:function (file,title,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.newsFormData.newPicPath = arr.join();
      },
      removeContentCoverPath:function (file,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.newsFormData.newPicPath = arr.join();
      },
      successNewsVideo:function (file,title,fileList) {
        this.newsFormData.videoPath = file.url;
      },
      removeNewsVideo:function () {
        this.newsFormData.videoPath = '';
      },
      newsSub:function () {
        this.$refs.newsForm.validate(valid => {
          if (valid) {
            this.newsLoading = true;
            axios.NewsSave(this.newsFormData)
              .then(res => {
                //console.log(res);
                this.newsLoading = false;
                this.newsTip = true;
                this.$refs.newsTip.innerHTML = res.data;
                if (res.code === '0') {
                  this.newsValue = false;
                  this.clearNewsData();
                  this.listParams.pageNum = 1;
                  this.getNewsList();
                }
              })
              .catch(error => {
                console.log(error);
                this.newsLoading = false;
                this.newsTip = true;
                this.$refs.newsTip.innerHTML = '保存失败！';
              })
          }
        })
      },
      newsRevise:function () {
        this.$refs.newsRevise.validate(valid => {
          if (valid) {
            this.newsReviseLoading = true;
            axios.NewsSave(this.newsReviseData)
              .then(res => {
                //console.log(res);
                this.newsReviseLoading = false;
                this.newsTip = true;
                this.$refs.newsTip.innerHTML = res.data;
                if (res.code === '0') {
                  this.reviseValue = false;
                  this.clearNewsReviseData();
                  this.getNewsList();
                }
              })
              .catch(error => {
                console.log(error);
                this.newsReviseLoading = false;
                this.newsTip = true;
                this.$refs.newsTip.innerHTML = '保存失败！';
              })
          }
        })
      },
      newsCoverReSuccess:function (file,title,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.newsReviseData.publicPicPath = arr.join();
      },
      newsCoverReRemove:function (file,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.newsReviseData.publicPicPath = arr.join();
      },
      videoCoverReSuccess:function (file,title,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.newsReviseData.videoPicPath = arr.join();
      },
      videoCoverReRemove:function (file,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.newsReviseData.videoPicPath = arr.join();
      },
      contentCoverReSuccess:function (file,title,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.newsReviseData.newPicPath = arr.join();
      },
      contentCoverReRemove:function (file,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.newsReviseData.newPicPath = arr.join();
      },
      getReviseContent:function (con) {
        this.newsReviseData.newContent = con;
      },
      videoReSuccess:function (file,title,fileList) {
        this.newsReviseData.videoPath = file.url;
      },
      videoReRemove:function () {
        this.newsReviseData.videoPath = '';
      },
      addReviseSecond:function () {
        if (this.reviseValue) {
          this.newsReviseData.newTwoType = '';
          axios.NewsSecondClass({queryKey:this.newsReviseData.newOneType})
            .then(res => {
              //console.log(res);
              if (res.code === '0') {
                this.addSecond = res.data;
              } else {
                this.$Message.error('获取二级分类失败！')
              }
            })
            .catch(error => {
              console.log(error);
              this.$Message.error('获取二级分类失败！')
            })
        }
      },
      reVideoType:function (type) {
        this.newsReviseData.videoPath = '';
        this.$refs.newsVideoRe.clearUpload();
        if (type === '0') {
          this.defaultVideo = [];
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
  .article {
    //text-align: left;
    text-indent: 2em;
  }
</style>
