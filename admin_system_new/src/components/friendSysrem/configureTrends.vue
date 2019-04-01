<template>
  <div class="trends-container content-pad">
    <div class="community-fun">
      <div class="community-ope">
        <Button type="default" icon="md-add" @click="addTrends">发布动态</Button>
      </div>
      <div class="community-search">
        <span class="ml15">创建日期从：</span>
        <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="dataCheckStart" v-model="listParams.createdTimeStart" :options="begOption" class="checkWid"></DatePicker></span>
        <span class="ml15">创建日期止：</span>
        <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="dataCheckEnd" v-model="listParams.createdTimeEnd" :options="endOption" class="checkWid"></DatePicker></span>
        <span class="ml15">用户名称：</span>
        <span><Input v-model="listParams.name" class="checkWid"/></span>
        <span class="ml15">动态类型：</span>
        <span>
            <Select v-model="listParams.trendType" class="checkWid">
              <Option v-for="item in typeList" :value="item.id" :key="item.id">{{item.name}}</Option>
            </Select>
          </span>
        <span class="ml15">状态类型：</span>
        <span>
            <Select v-model="listParams.status" class="checkWid">
              <Option v-for="item in statusList" :value="item.id" :key="item.id">{{item.name}}</Option>
            </Select>
        </span>
        <span class="ml10"><Button icon="ios-search" @click="checkTrends">查询</Button></span>
      </div>
    </div>
    <div class="community-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading" height="600"></Table>
      <Page :total="total" :current="listParams.page" v-if="total>10" show-elevator show-total @on-change="trendPageChange" class="mt30"/>
    </div>
    <Modal title="查看大图" v-model="tabBig" width="1000">
      <Carousel :height="500" v-model="carNum" v-if="tabBig">
        <CarouselItem v-for="(item ,index) in this.bigArr" :key="index">
          <img :src="item" class="bigImg">
        </CarouselItem>
      </Carousel>
      <div slot="footer"></div>
    </Modal>
    <modal title="查看视频" v-model="bigVideo" @on-visible-change="videoClose">
      <video :src="videoUrl" controls="controls" style="width: 100%"></video>
      <div slot="footer"></div>
    </modal>
    <!--发布动态-->
    <Drawer
      title="发布动态"
      v-model="trendValue"
      width="750"
      :mask-closable="false"
      :styles="styles"
      @on-close="clearArtData"
    >
      <Form :model="trendFormData" ref="trendForm" :rules="ruleValidate" :label-width="100" style="width: 100%;margin-top: 20px;">
        <!--上传图片-->
        <FormItem label="上传图片：">
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
                    ref="trendUpload"
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
              <img :src="addBigUrl" style="width: 100%">
              <div slot="footer"></div>
            </modal>
          </div>
        </FormItem>
        <!--上传视频-->
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
            <Upload :action="uploadUrl"
                    ref="videoUpload"
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
              <video :src="addVideoUrl" controls="controls" style="width: 100%"></video>
              <div slot="footer"></div>
            </modal>
          </div>
        </FormItem>
        <FormItem label="动态类型：" prop="trendType">
          <Select v-model="trendFormData.trendType" style="width:400px" @on-change="typeChange">
            <Option v-for="(item,index) in addTypeList" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="玄乐账号：" prop="loginName" v-if="isId">
          <Input type="text" v-model="trendFormData.loginName" style="width: 400px;"></Input>
        </FormItem>
        <!--<FormItem label="地理信息：" prop="city">-->
          <!--<Select v-model="trendFormData.city" style="width:400px">-->
            <!--<Option v-for="(item,index) in positionList" :value="item.id" :key="index">{{ item.city }}</Option>-->
          <!--</Select>-->
        <!--</FormItem>-->
        <FormItem label="动态内容：" prop="description">
          <Input type="textarea" :maxlength="1000" v-model="trendFormData.description" style="width: 400px;"></Input>
        </FormItem>
        <FormItem>
          <Row>
            <Col span="3">
              <FormItem>
                <Checkbox v-model="trendFormData.status" true-value="1" false-value="0">开放</Checkbox>
              </FormItem>
            </Col>
            <Col span="3">
              <FormItem v-if="isStick">
                <Checkbox v-model="trendFormData.showTop" true-value="1" false-value="0">置顶</Checkbox>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem style="width: 200px!important;">
          <Button type="primary" @click="trendSub" :loading="trendLoading">确认发布</Button>
        </FormItem>
      </Form>
    </Drawer>
    <!--编辑-->
    <Modal
      v-model="isEdit"
      :loading="editLoading"
      :mask-closable="false"
      title="编辑动态内容"
      @on-ok="editSub"
      @on-visible-change="isEditVisible"
    >
      <Form :model="editFormData" ref="editForm" :label-width="80" class="mt20">
        <FormItem label="编辑内容：" prop="content">
          <Input type="textarea" v-model="editFormData.content"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      title="提示"
      v-model="trendTip"
      :mask-closable = "false"
    >
      <p ref="trendTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
    <Modal
      title="提示"
      v-model="trendSuccess"
      :mask-closable = "false"
    >
      <p ref="trendSuccess"></p>
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

  export default {
    name: "configureTrends",
    data () {
      return {
        uploadUrl:base.baseUrl.serviceOne + 'lifeTrend/saveFiles',
        trendTip:false,
        trendSuccess:false,
        bigVideo:false,
        isEdit:false,
        editLoading:true,
        videoUrl:'',
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        //条件查询数据
        listParams:{
          createdTimeStart:'',
          createdTimeEnd:'',
          name:'',
          trendType:'',
          status:'',
          pageNum:1,
          pageSize:10
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
            return date && date.valueOf() < d;
          }
        },
        typeList:[
          {
            id:3,
            name:'不限'
          },
          {
            id:1,
            name:'用户动态'
          },
          {
            id:2,
            name:'红娘动态'
          },
          {
            id:0,
            name:'系统动态'
          }
        ],
        statusList:[
          {
            id:2,
            name:'不限'
          },
          {
            id:1,
            name:'公开'
          },
          {
            id:0,
            name:'隐藏'
          },
        ],
        //数据列表数据
        total:'',
        loading:false,
        tabBig:false,
        tabUrl:'',
        listData:[],
        bigArr:[],
        carNum:0,
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          // {
          //   title:'用户编号',
          //   key:'userId',
          //   align:'center'
          // },
          {
            title:'用户姓名',
            key:'name',
            align:'center'
          },
          {
            title:'动态类型',
            key:'trendTypeText',
            align:'center'
          },
          {
            title:'状态类型',
            key:'statusText',
            align:'center'
          },
          {
            title:'内容',
            key:'description',
            align:'center'
          },
          {
            title:'动态图片',
            width:210,
            align:'center',
            render:(h,params) => {
              const pathArr = params.row.filePath.split(',');
              const imgArr = [];
              pathArr.forEach((item,index) => {
                imgArr.push(
                  h('img',{
                    attrs:{
                      src:item
                    },
                    style:{
                      width:'50px',
                      height:'50px',
                      borderRadius:'5px',
                      cursor:'pointer',
                      marginLeft:'5px'
                    },
                    on:{
                      click:() => {
                        this.bigArr = pathArr;
                        this.carNum = index;
                        this.tabBig = true;
                      }
                    }
                  })
                  )
              });
              if (params.row.type === 1) {
                return h('div',imgArr);
              }
            }
          },
          {
            title:'动态视频',
            key:'typeText',
            align:'center'
          },
          {
            title:'创建日期',
            key:'createTime',
            align:'center'
          },
          {
            title:'操作选项',
            align:'left',
            width:330,
            render:(h,params) => {
              const checkVideo = h('Button',{
                props:{
                  type: 'info',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    if (params.row.type === 2) {
                      this.bigVideo = true;
                      this.videoUrl = params.row.filePath;
                    } else {
                      this.trendTip = true;
                      this.$refs.trendTip.innerHTML= '此动态无视频！'
                    }
                  }
                }
              },'查看视频');
              const hidden = h('Button',{
                props:{
                  type: 'error',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    axios.TrendShowOrHiiden({id:params.row.id,status:0})
                      .then(res => {
                        //console.log(res);
                        this.trendTip = true;
                        this.$refs.trendTip.innerHTML = res.message;
                        if (res.code === 200) {
                          this.getTrendList();
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.trendTip = true;
                        this.$refs.trendTip.innerHTML = '操作失败！';
                      })
                  }
                }
              },'隐藏');
              const hasHidden = h('Button',{
                props: {
                  type: 'error',
                  size: 'small',
                  disabled:true
                },
                style: {
                  marginRight: '5px'
                }
              },'已隐藏');
              const stick = h('Button',{
                props:{
                  type: 'success',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    axios.TrendStick({id:params.row.id,showTop:1})
                      .then(res => {
                        //console.log(res);
                        this.trendTip = true;
                        this.$refs.trendTip.innerHTML = res.message;
                        if (res.code === 200) {
                          this.getTrendList();
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.trendTip = true;
                        this.$refs.trendTip.innerHTML = '操作失败！';
                      })
                  }
                }
              },'设为置顶');
              const cancelStick = h('Button',{
                props:{
                  type: 'error',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    axios.TrendStick({id:params.row.id,showTop:0})
                      .then(res => {
                        //console.log(res);
                        this.trendTip = true;
                        this.$refs.trendTip.innerHTML = res.message;
                        if (res.code === 200) {
                          this.getTrendList();
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.trendTip = true;
                        this.$refs.trendTip.innerHTML = '操作失败！';
                      })
                  }
                }
              },'取消置顶');
              //删除和修改只针对系统动态
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
                    this.isEdit = true;
                    this.editFormData.id = params.row.id;
                    this.editFormData.content = params.row.description;
                  }
                }
              },'编辑');
              const deletes = h('Button',{
                props:{
                  type: 'error',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    axios.TrendDelete({id:params.row.id})
                      .then(res => {
                        //console.log(res);
                        if (res.code === '0') {
                          this.trendTip = true;
                          this.$refs.trendTip.innerHTML = '删除成功！';
                          this.getTrendList();
                        } else {
                          this.trendTip = true;
                          this.$refs.trendTip.innerHTML = '删除失败！';
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.trendTip = true;
                        this.$refs.trendTip.innerHTML = '操作失败！';
                      })
                  }
                }
              },'删除');
              if (params.row.trendType === 1) {  //0 系统动态 1 用户动态 2 红娘动态
                if (params.row.status === 1) {
                  return h('div',[
                    hidden,
                    checkVideo
                  ])
                } else if (params.row.status === 0) {
                  return h('div',[
                    hasHidden,
                    checkVideo
                  ])
                }
              } else if (params.row.trendType === 2) {
                if (params.row.status === 1 && params.row.showTop === 0) {
                  return h('div',[
                    hidden,
                    stick,
                    checkVideo
                  ])
                } else if (params.row.status === 1 && params.row.showTop === 1) {
                  return h('div',[
                    hidden,
                    cancelStick,
                    checkVideo
                  ])
                } else if (params.row.status === 0 && params.row.showTop === 0) {
                  return h('div',[
                    hasHidden,
                    stick,
                    checkVideo
                  ])
                } else if (params.row.status === 0 && params.row.showTop === 1) {
                  return h('div',[
                    hasHidden,
                    cancelStick,
                    checkVideo
                  ])
                }
              } else {
                if (params.row.status === 1 && params.row.showTop === 0) {
                  return h('div',[
                    hidden,
                    stick,
                    checkVideo,
                    revise,
                    deletes
                  ])
                } else if (params.row.status === 1 && params.row.showTop === 1) {
                  return h('div',[
                    hidden,
                    cancelStick,
                    checkVideo,
                    revise,
                    deletes
                  ])
                } else if (params.row.status === 0 && params.row.showTop === 0) {
                  return h('div',[
                    hasHidden,
                    stick,
                    checkVideo,
                    revise,
                    deletes
                  ])
                } else if (params.row.status === 0 && params.row.showTop === 1) {
                  return h('div',[
                    hasHidden,
                    cancelStick,
                    checkVideo,
                    revise,
                    deletes
                  ])
                }
              }
            }
          },
        ],
        //新增数据
        trendValue:false,
        trendLoading:false,
        isId:false,
        isStick:false,
        visible:false,
        videoVisible:false,
        addVideoUrl:'',
        addBigUrl:'',
        uploadList:[],
        videoUploadList:[],
        trendFormData:{
          trendType:'',//动态类型
          loginName:'',//用户id 红娘或者用户动态时必填
          city:'',//地理信息
          status:'1',//是否隐藏
          showTop:'0',//是否置顶
          description:'',//内容
          videoBackImageUrl:'',//视频封面图
          videoUrl:'',//视屏地址
          docUrls:'',//图片地址 拼接字符串
        },
        addTypeList:[
          {
            value:1,
            label:'用户动态'
          },
          {
            value:2,
            label:'红娘动态'
          },
          {
            value:0,
            label:'系统动态'
          }
        ],
        //编辑内容
        editFormData:{
          id:'',
          content:'',
        },
        positionList:[],
        ruleValidate:{

        }
      }
    },
    mounted () {
      this.uploadList = this.$refs.trendUpload.fileList;
      this.videoUploadList = this.$refs.videoUpload.fileList;
      this.getTrendList();
    },
    methods: {
      getTrendList:function () {
        this.loading = true;
        axios.TrendList(this.listParams)
          .then(res => {
            //console.log(JSON.stringify(res.result.list[0]));
            if (res.code === 200) {
              this.loading = false;
              this.listData = res.result.list;
              this.total = res.result.total;
            } else {
              this.trendTip = true;
              this.$refs.trendTip.innerHTML = res.message;
            }
          })
          .catch(error => {
            console.log(error);
            this.trendTip = true;
            this.$refs.trendTip.innerHTML = '查询出错！';
          })
      },
      addTrends:function () {
        this.trendValue = true;
        //this.getPosition();
      },
      checkTrends:function () {
        this.listParams.pageNum = 1;
        this.getTrendList();
      },
      trendPageChange:function (page) {
        this.listParams.pageNum = page;
        this.getTrendList();
      },
      dataCheckStart:function (date) {
        this.listParams.createTimeStart = date;
      },
      //获取地理位置
      getPosition:function () {
        axios.TrendPosition()
          .then(res => {
            if (res.code === 200) {
              this.positionList = res.result;
            } else {
              this.$Message.warning(res.message);
            }
          })
          .catch(error => {
            console.log(error);
            this.$Message.warning('地理信息查询出错！');
          })
      },
      dataCheckEnd:function (date) {
        this.listParams.createTimeEnd = date;
      },
      typeChange:function (value) {
        //console.log(value);
        if (value === 2) {
          this.isId = true;
          this.isStick = false;
        } else if (value === 1) {
          this.isId = true;
          this.isStick = false;
        } else {
          this.isId = false;
          this.isStick = true;
        }
      },
      //清空表单数据
      clearArtData:function () {
        this.$refs.trendForm.resetFields();
        this.trendFormData.status = '0';
        this.trendFormData.showTop = '0';
        this.trendFormData.docUrls = '';
        this.trendFormData.videoUrl = '';
        this.trendFormData.videoBackImageUrl = '';
        this.$refs.trendUpload.clearFiles();
        this.uploadList = this.$refs.trendUpload.fileList;
        this.$refs.videoUpload.clearFiles();
        this.videoUploadList = this.$refs.videoUpload.fileList;
      },
      //上传图片
      handleView:function (url) {
        this.visible = true;
        this.addBigUrl = url;
      },
      handleRemove:function (file) {
        const fileList = this.$refs.trendUpload.fileList;
        this.$refs.trendUpload.fileList.splice(fileList.indexOf(file), 1);
        this.uploadList = this.$refs.trendUpload.fileList;
      },
      handleSuccess:function (res,file,fileList) {
        //console.log(res);
        if (res.code === 200) {
          file.url = res.result.filePath;
        } else {
          this.trendTip = true;
          this.$refs.trendTip.innerHTML = '上传图片失败！';
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
          this.$Message.warning('只能上传9张图片！');
          return check;
        }
      },
      //上传视频
      handleVideoView:function (url) {
        this.videoVisible = true;
        this.addVideoUrl = url;
      },
      handleVideoRemove:function (file) {
        const fileList = this.$refs.videoUpload.fileList;
        this.$refs.videoUpload.fileList.splice(fileList.indexOf(file), 1);
        this.videoUploadList = this.$refs.videoUpload.fileList;
      },
      handleVideoBeforeUpload:function (file) {
        const check = this.videoUploadList.length < 1;
        const len = file.name.length <= 50;
        if (!len) {
          this.$Message.warning('视频名过长！');
          return len;
        }
        if (!check) {
          this.$Message.warning('只能上传一个视频！');
          return check;
        }
      },
      handleVideoSuccess:function (res,file,fileList) {
        //console.log(res);
        if (res.code === 200) {
          file.url = res.result.filePath;
        } else {
          this.trendTip = true;
          this.$refs.trendTip.innerHTML = '上传视频失败！';
        }
      },
      //提交按钮
      trendSub:function () {
        this.$refs.trendForm.validate(valid => {
          if (valid) {
            this.trendLoading = true;
            let arr = [];
            if (this.videoUploadList.length === 0) { //没传视频
              this.uploadList.forEach(item => {
                arr.push(item.url);
              });
              this.trendFormData.docUrls = arr.join(',');
            } else {
             this.videoUploadList.forEach((item,index) => {
               this.trendFormData.videoUrl = item.url;
               this.trendFormData.videoBackImageUrl = this.uploadList[index].url;
             })
            }
            //console.log(JSON.stringify(this.trendFormData));
            axios.TrendAdd(this.trendFormData)
              .then(res => {
                //console.log(res);
                this.trendLoading = false;
                if (res.code === 200) {
                  this.trendSuccess = true;
                  this.$refs.trendSuccess.innerHTML = res.message;
                  this.listParams.pageNum = 1;
                  this.getTrendList();
                } else { //上传出错之后要将文件参数清除
                  this.trendTip = true;
                  this.$refs.trendTip.innerHTML = res.message;
                  this.trendFormData.docUrls = '';
                  this.trendFormData.videoUrl = '';
                  this.trendFormData.videoBackImageUrl = '';
                }
              })
              .catch(error => {
                console.log(error);
                this.trendLoading = false;
                this.trendTip = true;
                this.trendFormData.docUrls = '';
                this.trendFormData.videoUrl = '';
                this.trendFormData.videoBackImageUrl = '';
                this.$refs.trendTip.innerHTML = '发布出错！';
              })
          }
        })
      },
      //关闭
      del:function () {
        this.trendTip = false;
      },
      addMore:function () {
        this.clearArtData();
        this.trendSuccess = false;
      },
      goList:function () {
        this.clearArtData();
        this.trendSuccess = false;
        this.trendValue = false;
      },
      videoClose:function (value) {
        if (!value) {
          this.videoUrl = '';
        }
      },
      videoAddClose:function (value) {
        if (!value) {
          this.addVideoUrl = '';
        }
      },
      editSub:function () {
        axios.TrendContentEdit(this.editFormData)
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.isEdit = false;
              this.trendTip = true;
              this.$refs.trendTip.innerHTML = res.data;
              this.getTrendList();
            } else {
              this.$Message.error('修改失败！');
              this.changModal();
            }
          })
          .catch(error => {
            console.log(error);
            this.$Message.error('修改失败！');
            this.changModal();
          })
      },
      isEditVisible:function (value) {
        if (!value) {
          this.editFormData.id = '';
          this.editFormData.content = '';
        }
      },
      changModal:function () {
        this.editLoading = false;
        this.$nextTick(() => {
          this.editLoading = true;
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .trends-container{
    padding-bottom: 50px;
  }
  .bigImg{
    height: 500px;
    display: block;
    margin: 0 auto;
  }
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
</style>
