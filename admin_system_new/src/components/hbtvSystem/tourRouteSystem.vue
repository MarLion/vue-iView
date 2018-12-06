<template>
  <div class="route-container">
    <div>
      <div class="route-fun">
        <div class="route-ope">
          <Button type="default" icon="md-add" @click="addCommunity">新增路线</Button>
          <Button type="default" icon="ios-download" @click="exportData">导出EXCEL</Button>
        </div>
        <div class="route-search">
          <span class="ml15">创建日期从：</span>
          <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="chooseStartTime" style="width: 200px;"></DatePicker></span>
          <span class="ml15">创建日期止：</span>
          <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="chooseEndTime"  style="width: 200px;"></DatePicker></span>
          <span class="ml15">路线名称：</span>
          <span><Input v-model="routeNic" style="width: 200px;"/></span>
          <span class="ml15">状态类型：</span>
          <span>
            <Select v-model="routeType" style="width:200px" @on-change="selectType">
              <Option v-for="(item,index) in routeList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
          </span>
          <span class="ml10"><Button icon="ios-search" @click="getRouteList">查询</Button></span>
        </div>
      </div>
      <div class="route-list mt30">
        <Table border :columns="columns" :data="listData" :loading="loading"></Table>
        <Page :total="total" v-if="total>10" show-elevator show-total class="mt30" @on-change="pageChange"/>
      </div>
    </div>
    <!--新增路线-->
    <Drawer
      title="发布旅游路线"
      v-model="value3"
      width="720"
      :mask-closable="false"
      :styles="styles"
      @on-close = 'clearForm'
    >
        <div class="add-title">
          <span>
            <span class="add-tips"><Icon type="md-information-circle" />友情提示：湖北电视台工作人员使用，配置专用账户！</span>
          </span>
        </div>
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
            <Upload :action='uploadUrl'
                    ref="upload"
                    :show-upload-list="false"
                    :on-success="handleSuccess"
                    :format="['jpg','jpeg','png']"
                    :on-format-error="handleFormatError"
                    multiple
                    type="drag"
                    style="display: inline-block;width:100px;">
              <div style="width: 100px;height:100px;line-height: 100px;">
                <Icon type="ios-camera" size="40"></Icon>
              </div>
            </Upload>
            <modal title="查看照片" v-model="visible">
              <img :src= 'imgUrl' style="width: 100%">
            </modal>
          </div>
          <Form :model="formData" ref="formData" :rules="ruleValidate" :label-width="100" style="width: 500px;margin-top: 20px;">
            <FormItem label="线路名称" prop="name">
              <Input type="text" v-model="formData.name"></Input>
            </FormItem>
            <FormItem label="行程时间">
              <Row>
                <Col span="10">
                  <FormItem prop="tourStart">
                    <DatePicker type="date" format="yyyy-MM-dd" @on-change="formDataBegTime" v-model="formData.tourStart" style="width: 175px;"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="3" style="text-align: center;">
                  至
                </Col>
                <Col span="10">
                  <FormItem prop="tourEnd">
                    <DatePicker type="date" format="yyyy-MM-dd" @on-change="formDataEndTime" v-model="formData.tourEnd" style="width: 175px;"></DatePicker>
                  </FormItem>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="产品价格" prop="price">
              <Input type="text" v-model="formData.price" style="width: 95%;"></Input>
              <span>元</span>
            </FormItem>
            <FormItem label="费用清单" prop="tourList">
              <Input type="text" v-model="formData.tourList"></Input>
            </FormItem>
            <FormItem label="允许人数" prop="num">
              <Input type="text" v-model="formData.num"></Input>
            </FormItem>
            <FormItem label="景区介绍" prop="description">
              <Input type="textarea" v-model="formData.description"></Input>
            </FormItem>
            <FormItem label="行程安排" prop="tourArrangement">
              <Input type="textarea" v-model="formData.tourArrangement"></Input>
            </FormItem>
            <FormItem style="width: 200px!important;">
              <Button type="primary" @click="subClick" :loading="adding">确认发布</Button>
            </FormItem>
          </Form>
        </div>
    </Drawer>
    <!--查看详情-->
    <Drawer
      title="旅游路线详情"
      v-model="value4"
      width="720"
      :mask-closable="false"
      :styles="styles"
      @on-close="clearDetailData"
    >
      <div class="add-title">
        <span>
          <span class="add-tips"><Icon type="md-information-circle" />友情提示：湖北电视台工作人员使用，配置专用账户！</span>
        </span>
      </div>
      <div class="add-form mt30">
        <div class="add-image">
          <p class="p">照&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;片：</p>
          <template v-if="detailData.isPhoto">
            <div class="demo-upload-list"  v-for="item in detailData.detailUploadList">
              <img :src="item">
            </div>
          </template>
          <template v-else>
            <div class="demo-upload-list">暂无图片</div>
          </template>
        </div>
        <div class="add-detail">
          <p class="p">线路名称：</p>
          <p class="detailSpan">{{detailData.name}}</p>
        </div>
        <div class="add-detail">
          <p class="p">行程时间：</p>
          <p class="detailSpan">{{detailData.tourStart}}</p><p class="ml15 detailSpan">至</p><p class="ml15 detailSpan">{{detailData.tourEnd}}</p>
        </div>
        <div class="add-detail">
          <p class="p">产品价格：</p>
          <p class="detailSpan">{{detailData.price}}</p>
          <p class="detailSpan">元</p>
        </div>
        <div class="add-detail">
          <p class="p">费用清单：</p>
          <p class="detailSpan detailWidth">{{detailData.tourList}}</p>
        </div>
        <div class="add-detail">
          <p class="p">允许人数：</p>
          <p class="detailSpan">{{detailData.num}}</p>
          <p class="detailSpan">人</p>
        </div>
        <div class="add-detail">
          <p class="p">景区介绍：</p>
          <p class="detailSpan detailWidth">{{detailData.description}}</p>
        </div>
        <div class="add-detail">
          <p class="p">行程安排：</p>
          <p class="detailSpan detailWidth">{{detailData.tourArrangement}}</p>
        </div>
      </div>
    </Drawer>
    <!--修改路线-->
    <Drawer
      title="旅游路线修改"
      v-model="value5"
      width="720"
      :mask-closable="false"
      :styles="styles"
      @on-close = 'clearRevise'
    >
      <div class="add-title">
          <span>
            <span class="add-tips"><Icon type="md-information-circle" />友情提示：湖北电视台工作人员使用，配置专用账户！</span>
          </span>
      </div>
      <div class="add-form mt30">
        <div class="add-image">
          <p class="p">上传照片</p>
          <div class="demo-upload-list" v-for="item in reviseUploadList">
            <template v-if="item.status === 'finished'">
              <img :src="item.url">
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleReviseView(item.url)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleReviseRemove(item)"></Icon>
              </div>
            </template>
            <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
          </div>
          <Upload :action='uploadUrl'
                  ref="reviseUpload"
                  :show-upload-list="false"
                  :default-file-list="reviseDefaultList"
                  :on-success="handleReviseSucess"
                  :format="['jpg','jpeg','png']"
                  :on-format-error="handleReviseFormatError"
                  multiple
                  type="drag"
                  style="display: inline-block;width:100px;">
            <div style="width: 100px;height:100px;line-height: 100px;">
              <Icon type="ios-camera" size="40"></Icon>
            </div>
          </Upload>
          <modal title="查看照片" v-model="reviseVisible">
            <img :src= 'reviseImgUrl' style="width: 100%">
          </modal>
        </div>
        <Form :model="reviseData" ref="reviseData" :rules="ruleValidate" :label-width="100" style="width: 500px;margin-top: 20px;">
          <FormItem label="线路名称" prop="name">
            <Input type="text" v-model="reviseData.name"></Input>
          </FormItem>
          <FormItem label="行程时间">
            <Row>
              <Col span="10">
                <FormItem prop="tourStart">
                  <DatePicker type="date" format="yyyy-MM-dd" v-model="reviseData.tourStart" @on-change="reviseDataStart" style="width: 175px;"></DatePicker>
                </FormItem>
              </Col>
              <Col span="3" style="text-align: center;">
                至
              </Col>
              <Col span="10">
                <FormItem prop="tourEnd">
                  <DatePicker type="date" format="yyyy-MM-dd" v-model="reviseData.tourEnd" @on-change="reviseDataEnd" style="width: 175px;"></DatePicker>
                </FormItem>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="产品价格" prop="price">
            <Input type="text" v-model="reviseData.price" style="width: 95%;"></Input>
            <span>元</span>
          </FormItem>
          <FormItem label="费用清单" prop="tourList">
            <Input type="text" v-model="reviseData.tourList"></Input>
          </FormItem>
          <FormItem label="允许人数" prop="num">
            <Input type="text" v-model="reviseData.num"></Input>
          </FormItem>
          <FormItem label="景区介绍" prop="description">
            <Input type="textarea" v-model="reviseData.description"></Input>
          </FormItem>
          <FormItem label="行程安排" prop="tourArrangement">
            <Input type="textarea" v-model="reviseData.tourArrangement"></Input>
          </FormItem>
          <FormItem style="width: 200px!important;">
            <Button type="primary" @click="reviseSub" :loading="reviseAdding">确认修改</Button>
          </FormItem>
        </Form>
      </div>
    </Drawer>
    <Modal
      title="提示"
      v-model="loginFail"
    >
      <p ref="failTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
    <Modal
      title="提示"
      v-model="addSuccess"
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
    name: "tourRouteSystem",
    data () {
      return {
        uploadUrl:base.baseUrl + 'column_tour/saveFile',
        value3:false,
        value4:false,
        value5:false,
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        routeList:[
          {
            value:'0',
            label:'正常'
          },
          {
            value:'2',
            label:'已结束'
          },
          {
            value:'1',
            label:'已取消'
          }
        ],
        total:'',
        loading:false,
        //请求列表参数
        page:1,
        pageSize:10,
        startTime:'',
        endTime:'',
        routeNic:'',
        routeType:'',
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'产品编号',
            key:'tourNo',
            align:'center'
          },
          {
            title:'线路名称',
            key:'name',
            align:'center'
          },
          {
            title:'状态',
            key:'statusText',
            align:'center'
          },
          {
            title:'允许人数',
            key:'num',
            align:'center'
          },
          {
            title:'报名人数',
            key:'applyNum',
            align:'center'
          },
          {
            title:'线路价格（元）',
            key:'price',
            align:'center'
          },
          {
            title:'创建日期',
            key:'createTime',
            align:'center'
          },
          {
            title:'操作选项',
            key:'action',
            align:'center',
            width:260,
            render:(h,params) => {
              if (params.row.status === 0) {
                return h('div', [
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
                        axios.TourRouteDetail({id:params.row.id})
                          .then(res => {
                            //console.log(res);
                            if (res.code === 200) {
                              if (res.result.filePath != null && res.result.filePath !== "" ) {
                                this.detailData.isPhoto = true;
                                this.detailData.detailUploadList = res.result.filePath.split(',');
                              } else {
                                this.detailData.detailUploadList = [];
                                this.detailData.isPhoto = false;
                              }
                              this.detailData.name = res.result.name;
                              this.detailData.tourStart = res.result.tourStart;
                              this.detailData.tourEnd = res.result.tourEnd;
                              this.detailData.price = res.result.price;
                              this.detailData.tourList = res.result.tourList;
                              this.detailData.num = res.result.num;
                              this.detailData.description = res.result.description;
                              this.detailData.tourArrangement = res.result.tourArrangement;
                              this.value4 = true;
                            } else {
                              this.loginFail = true;
                              this.$refs.failTip.innerHTML = res.message;
                            }
                          })
                          .catch(error => {
                            console.log(error);
                            this.loginFail = true;
                            this.$refs.failTip.innerHTML = '查询出错！'
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
                        axios.TourRouteDetail({id:params.row.id})
                          .then(res => {
                            //console.log(res);
                            if (res.code === 200) {
                              if (res.result.filePath != null && res.result.filePath !== "" ) {
                                this.revisePath =  res.result.filePath+',';
                                let arr = res.result.filePath.split(',');
                                arr.forEach((item,index) => {
                                  this.reviseDefaultList.push({url:item,name:index});
                                });
                              } else {
                                this.revisePath = '';
                                this.reviseDefaultList = [];
                              }
                              //console.log(this.$refs.reviseUpload.fileList);
                              this.$refs.reviseUpload.fileList = this.reviseDefaultList;
                              this.reviseUploadList = this.$refs.reviseUpload.fileList;
                              //console.log(this.$refs.reviseUpload.fileList);
                              this.reviseData.name = res.result.name;
                              this.reviseData.tourStart = res.result.tourStart;
                              this.reviseData.tourEnd = res.result.tourEnd;
                              this.reviseData.price = res.result.price;
                              this.reviseData.tourList = res.result.tourList;
                              this.reviseData.num = res.result.num;
                              this.reviseData.description = res.result.description;
                              this.reviseData.tourArrangement = res.result.tourArrangement;
                              this.reviseId = params.row.id;
                              this.value5 = true;
                            } else {
                              this.loginFail = true;
                              this.$refs.failTip.innerHTML = res.message;
                            }
                          })
                          .catch(error => {
                            console.log(error);
                            this.loginFail = true;
                            this.$refs.failTip.innerHTML = '查询出错！'
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
                        axios.TourRouteCancel({
                          status:1,
                          id:params.row.id,
                          tourNo:params.row.tourNo
                        })
                          .then(res => {
                            //console.log(res);
                            if (res.code === 200) {
                              this.getRouteList();
                              this.loginFail = true;
                              this.$refs.failTip.innerHTML = '线路取消成功！';
                            } else {
                              this.loginFail = true;
                              this.$refs.failTip.innerHTML = res.message;
                            }
                          })
                          .catch(error => {
                            console.log(error);
                            this.loginFail = true;
                            this.$refs.failTip.innerHTML = '线路取消失败！'
                          })
                      }
                    }
                  }, '取消'),
                  h('Button', {
                    props: {
                      type: 'warning',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.$router.push({path:'/tourSignList',query:{tourId:params.row.id}})
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
                  }, '该路线已取消')
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
                  }, '该路线已结束')
                ])
              }
            }
          }
        ],
        listData:[],
        uploadList:[],
        imgUrl:'',
        visible:false,
        formData:{
          creatorId:'123456',
          name:'',
          tourStart:'',
          tourEnd:'',
          price:'',
          tourList:'',
          num:'',
          description:'',
          tourArrangement:'',
          filePath:''
        },
        ruleValidate:{
          name:[
            {required:true,message:'请填写线路名称'}
          ],
          tourStart:[
            {required:true,message:'请填写起始时间'}
          ],
          tourEnd:[
            {required:true,message:'请填写结束时间'}
          ],
          price:[
            {required:true,message:'请填写产品价格'}
          ],
          tourList:[
            {required:true,message:'请填写费用清单'}
          ],
          num:[
            {required:true,message:'请填写允许人数'}
          ],
          description:[
            {required:true,message:'请填写景区介绍'}
          ],
          tourArrangement:[
            {required:true,message:'请填写行程安排'}
          ]
        },
        pathStr:'',
        loginFail:false,
        addSuccess:false,
        adding:false,
        //详情data
        detailData:{
          detailUploadList:[],
          isPhoto:true,
          name:'',
          tourStart:'',
          tourEnd:'',
          price:'',
          tourList:'',
          num:'',
          description:'',
          tourArrangement:'',
        },
        //修改
        revisePath:'',
        reviseVisible:false,
        reviseDefaultList:[],
        reviseUploadList:[],
        reviseImgUrl:'',
        reviseId:'',
        reviseData:{
          id:'',
          name:'',
          tourStart:'',
          tourEnd:'',
          price:'',
          tourList:'',
          num:'',
          description:'',
          tourArrangement:'',
          filePath:''
        },
        reviseAdding:false,
      }
    },
    mounted () {
     this.getRouteList();
     this.uploadList = this.$refs.upload.fileList;
    },
    methods:{
      //获取路线列表
      getRouteList:function () {
        this.loading = true;
        axios.TourRouteList({
          createTimeStart:this.startTime,
          createTimeEnd:this.endTime,
          name:this.routeNic,
          status:this.routeType,
          pageNum:this.page,
          pageSize:this.pageSize
        })
          .then(res => {
            //console.log(res);
            if (res.code === 200) {
              this.loading = false;
              this.listData = res.result.list;
              this.total = res.result.total;
            } else {
              this.loginFail = true;
              this.$refs.failTip.innerHTML = res.message;
            }
          })
          .catch(error => {
            console.log(error);
            this.loginFail = true;
            this.$refs.failTip.innerHTML = '获取路线出错！'
          });
      },
      selectType:function (t) {
        //console.log(this.routeType);
      },
      addCommunity:function () {
        this.value3 = true;
      },
      exportData:function () {
        window.location.href = base.baseUrl +  'column_tour/exportTourList?createTimeStart='+this.startTime+'&createTimeEnd='+this.endTime+'&name='+this.routeNic+'&status='+this.routeType;
      },
      pageChange:function (page) {
        this.page = page;
        this.getRouteList();
      },
      chooseStartTime:function (date) {
        this.startTime = date;
      },
      chooseEndTime:function (date) {
        this.endTime = date;
      },
      //上传照片方法
      handleSuccess:function (res,file,filelist) {
        // console.log(JSON.stringify(file));
        file.url = res.result[0].filePath;
        this.pathStr += res.result[0].filePath + ',';
      },
      handleFormatError:function () {
        this.loginFail = true;
        this.$refs.failTip.innerHTML = '请选择格式为“jpg，jpeg，png”格式的图片！'
      },
      handleView:function (url) {
        this.visible = true;
        this.imgUrl = url;
      },
      handleRemove:function (file) {
        axios.TourDeletePhoto({fileUrl:file.url})
          .then(res => {
            //成功之后从列表删除
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
          })
          .catch(error => {
            console.log(error);
            this.loginFail = true;
            this.$refs.failTip.innerHTML = '删除出错！'
          })
      },
      formDataBegTime:function (date) {
        this.formData.tourStart = date;
      },
      formDataEndTime:function (date) {
        this.formData.tourEnd = date;
      },
      subClick:function () {
        let _that = this;
        this.formData.filePath = this.pathStr.substr(0,this.pathStr.length-1);
        //console.log(_that.formData);
        this.$refs.formData.validate((valid) => {
          if (valid) {
            _that.adding = true;
            axios.TourAddRoute(_that.formData)
              .then(res => {
                //console.log(res);
                _that.adding= false;
                if (res.code === 200) {
                  //新增成功之后把pathStr清空
                  this.pathStr = '';
                  this.addSuccess = true;
                  this.$refs.addTip.innerHTML = res.message;
                  this.getRouteList();
                } else {
                  this.loginFail = true;
                  this.$refs.failTip.innerHTML = res.message;
                }
              })
              .catch(error => {
                console.log(error);
                _that.adding= false;
                this.loginFail = true;
                this.$refs.failTip.innerHTML = '上传出错！'
              })
          }
        });
      },
      del:function () {
        this.loginFail = false;
      },
      goList:function () {
        this.clearForm();
        this.value3 = false;
        this.addSuccess =false;
      },
      addMore:function () {
       this.clearForm();
       this.addSuccess =false;
      },
      //清空表单
      clearForm:function () {
        //重置图片
        this.$refs.upload.clearFiles();
        this.uploadList = this.$refs.upload.fileList;
        //重置表单
        this.$refs.formData.resetFields();
      },
      //清空detail数据
      clearDetailData:function () {
        this.detailData.detailUploadList = [];
        this.detailData.isPhoto = true;
        this.detailData.name = '';
        this.detailData.tourStart = '';
        this.detailData.tourEnd = '';
        this.detailData.price = '';
        this.detailData.num = '';
        this.detailData.tourList = '';
        this.detailData.description = '';
        this.detailData.tourArrangement= '';
      },
      //修改路线
      handleReviseSucess:function (res,file,filelist) {
        file.url = res.result[0].filePath;
        this.reviseUploadList = filelist;
        this.revisePath += res.result[0].filePath + ',';
        //console.log(this.$refs.reviseUpload.fileList);
      },
      handleReviseFormatError:function () {
        this.loginFail = true;
        this.$refs.failTip.innerHTML = '请选择格式为“jpg，jpeg，png”格式的图片！'
      },
      handleReviseView:function (url) {
        this.reviseVisible = true;
        this.reviseImgUrl = url;
      },
      handleReviseRemove:function (file) {
        axios.TourDeletePhoto({fileUrl:file.url})
          .then(res => {
            //成功之后从列表删除
            const fileList = this.$refs.reviseUpload.fileList;
            this.$refs.reviseUpload.fileList.splice(fileList.indexOf(file), 1);
            this.reviseUploadList = this.$refs.reviseUpload.fileList;
          })
          .catch(error => {
            console.log(error);
            this.loginFail = true;
            this.$refs.failTip.innerHTML = '删除出错！'
          })
      },
      reviseDataStart:function (date) {
        this.reviseData.tourStart = date;
      },
      reviseDataEnd:function (date) {
        this.reviseData.tourEnd = date;
      },
      reviseSub:function () {
        this.reviseData.id = this.reviseId;
        this.reviseData.filePath = this.revisePath.substr(0,this.revisePath.length-1);
        this.reviseData.tourStart = this.$trans.timeTranslate(this.reviseData.tourStart);
        this.reviseData.tourEnd = this.$trans.timeTranslate(this.reviseData.tourEnd);
        //console.log(this.reviseData);
        this.$refs.reviseData.validate((valid) => {
          if (valid) {
            this.reviseAdding = true;
            axios.TourAddRoute(this.reviseData)
              .then(res => {
                //console.log(res);
                this.reviseAdding= false;
                if (res.code === 200) {
                  //新增成功之后把pathStr清空
                  this.revisePath = '';
                  this.value5 = false;
                  this.clearRevise();
                  this.loginFail = true;
                  this.$refs.failTip.innerHTML = '修改成功';
                  this.getRouteList();
                } else {
                  this.loginFail = true;
                  this.$refs.failTip.innerHTML = res.message;
                }
              })
              .catch(error => {
                console.log(error);
                this.reviseAdding= false;
                this.loginFail = true;
                this.$refs.failTip.innerHTML = '上传出错！'
              })
          }else {
            console.log(valid)
          }
        });
      },
      clearRevise:function () {
        //重置图片
        this.$refs.reviseUpload.clearFiles();
        this.reviseUploadList = this.$refs.reviseUpload.fileList;
        //重置表单
        this.$refs.reviseData.resetFields();
        this.revisePath = '';
        this.reviseDefaultList = [];
        this.reviseImgUrl = '';
        this.reviseId = '';
      },
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
