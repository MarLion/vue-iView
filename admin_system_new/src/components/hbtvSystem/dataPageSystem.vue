<template>
  <div class="data-container">
    <div>
      <div class="data-fun">
        <div class="data-ope">
          <Button type="default" icon="md-add" @click="addCommunity">新增活动</Button>
          <Button type="default" icon="ios-download" @click="exportData">导出EXCEL</Button>
        </div>
        <div class="data-search">
          <span class="ml15">创建日期从：</span>
          <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="dataCheckStart" style="width: 200px;"></DatePicker></span>
          <span class="ml15">创建日期止：</span>
          <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="dataCheckEnd" style="width: 200px;"></DatePicker></span>
          <span class="ml15">活动名称：</span>
          <span><Input v-model="dataCheckedPra.name" style="width: 200px;"/></span>
          <span class="ml15">状态类型：</span>
          <span>
            <Select v-model="dataCheckedPra.status" style="width:200px">
              <Option v-for="(item,index) in dataList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
          </span>
          <span class="ml10"><Button icon="ios-search" @click="getDataList">查询</Button></span>
        </div>
      </div>
      <div class="data-list mt30">
        <Table border :columns="columns" :data="listData" :loading="loading"></Table>
        <Page :total="total" v-if="total>10" show-elevator show-total @on-change="dataPageChange" class="mt30"/>
      </div>
    </div>
    <!--新增-->
    <Drawer
      title="发布相亲活动"
      v-model="value3"
      width="720"
      :mask-closable="false"
      :styles="styles"
      @on-close="clearDataDa"
    >
      <div>
        <div class="add-title">
          <span>
            <span class="add-tips"><Icon type="md-information-circle" />友情提示：湖北电视台工作人员使用，配置专用账户！</span>
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
                    ref="dataUpload"
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
              <img :src='dataImgUrl' style="width: 100%">
            </modal>
          </div>
          <Form :model="dataFormData" ref="dataForm" :rules="ruleValidate" :label-width="100" style="width: 500px;margin-top: 20px;">
            <FormItem label="活动名称" prop="name">
              <Input type="text" v-model="dataFormData.name"></Input>
            </FormItem>
            <FormItem label="活动费用">
              <Input type="text" v-model="dataFormData.price" @on-change="feeChanged" @on-blur="feeBlur" style="width: 80%;"></Input><Checkbox v-model="isOpen" @on-change="freeChange" class="ml15">免费</Checkbox>
            </FormItem>
            <FormItem label="开始时间" prop="activityStart">
              <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" v-model="dataFormData.activityStart" @on-change="dataBeginTime" style="width: 100%;"></DatePicker>
            </FormItem>
            <FormItem label="结束时间" prop="activityEnd">
              <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" v-model="dataFormData.activityEnd" @on-change="dataEndTime" style="width: 100%;"></DatePicker>
            </FormItem>
            <FormItem label="活动地址" prop="address">
              <Input type="text" v-model="dataFormData.address"></Input>
            </FormItem>
            <FormItem label="允许人数" prop="num">
              <Input type="text" v-model="dataFormData.num"></Input>
            </FormItem>
            <FormItem label="参与方式" prop="participate">
              <Input type="text" v-model="dataFormData.participate"></Input>
            </FormItem>
            <FormItem label="活动介绍" prop="description">
              <Input type="textarea" v-model="dataFormData.description"></Input>
            </FormItem>
            <FormItem label="活动安排" prop="arrangement">
              <Input type="textarea" v-model="dataFormData.arrangement"></Input>
            </FormItem>
            <FormItem style="width: 200px!important;">
              <Button type="primary" @click="dataSubClick" :loading="dataSubLoading">发布活动</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Drawer>
    <!--详情-->
    <Drawer
      title="相亲活动详情"
      v-model="dataDetailValue"
      width="720"
      :mask-closable="false"
      :styles="styles"
      @on-close="clearDataDetail"
    >
      <div class="add-title">
          <span>
            <span class="add-tips"><Icon type="md-information-circle" />友情提示：湖北电视台工作人员使用，配置专用账户！</span>
          </span>
      </div>
      <div class="add-form mt30">
        <div class="add-image">
          <p class="p">照&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;片：</p>
          <template v-if="dataDetailData.isPhoto">
            <div class="demo-upload-list"  v-for="item in dataDetailData.dataDetailUploadList">
              <img :src="item">
            </div>
          </template>
          <template v-else>
            <div class="demo-upload-list">暂无图片</div>
          </template>
        </div>
        <div class="add-detail">
          <p class="p">活动名称：</p>
          <p class="detailSpan">{{dataDetailData.name}}</p>
        </div>
        <div class="add-detail">
          <p class="p">活动费用：</p>
          <p class="detailSpan">{{dataDetailData.fee}}</p>
        </div>
        <div class="add-detail">
          <p class="p">开始时间：</p>
          <p class="detailSpan">{{dataDetailData.beginTime}}</p>
        </div>
        <div class="add-detail">
          <p class="p">结束时间：</p>
          <p class="detailSpan">{{dataDetailData.endTime}}</p>
        </div>
        <div class="add-detail">
          <p class="p">活动地址：</p>
          <p class="detailSpan detailWidth">{{dataDetailData.address}}</p>
        </div>
        <div class="add-detail">
          <p class="p">允许人数：</p>
          <p class="detailSpan">{{dataDetailData.member}}</p>
        </div>
        <div class="add-detail">
          <p class="p">参与方式：</p>
          <p class="detailSpan">{{dataDetailData.participate}}</p>
        </div>
        <div class="add-detail">
          <p class="p">活动介绍：</p>
          <p class="detailSpan detailWidth">{{dataDetailData.ins}}</p>
        </div>
        <div class="add-detail">
          <p class="p">活动安排：</p>
          <p class="detailSpan detailWidth">{{dataDetailData.arrange}}</p>
        </div>
      </div>
    </Drawer>
    <!--修改-->
    <Drawer
      title="相亲活动修改"
      v-model="dataReviseValue"
      width="720"
      :mask-closable="false"
      :styles="styles"
      @on-close="clearDataRevise"
    >
      <div class="add-title">
          <span>
            <span class="add-tips"><Icon type="md-information-circle" />友情提示：湖北电视台工作人员使用，配置专用账户！</span>
          </span>
      </div>
      <div class="add-form mt30">
        <div class="add-image">
          <p class="p">上传照片</p>
          <div class="demo-upload-list" v-for="item in dataUploadReviseList">
            <template v-if="item.status === 'finished'">
              <img :src="item.url">
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="dataReviseView(item.url)"></Icon>
                <Icon type="ios-trash-outline" @click.native="dataReviseRemove(item)"></Icon>
              </div>
            </template>
            <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
          </div>
          <Upload :action="uploadUrl"
                  ref="dataReviseUpload"
                  :show-upload-list="false"
                  :default-file-list="dataReviseDefault"
                  :on-success="handleReviseSuccess"
                  :format="['jpg','jpeg','png']"
                  :on-format-error="handleFormatError"
                  multiple
                  type="drag"
                  style="display: inline-block;width:100px;">
            <div style="width: 100px;height:100px;line-height: 100px;">
              <Icon type="ios-camera" size="40"></Icon>
            </div>
          </Upload>
          <modal title="查看照片" v-model="dataReviseVisible">
            <img :src='dataReviseImgUrl' style="width: 100%">
          </modal>
        </div>
        <Form :model="dataReviseData" ref="dataReviseForm" :rules="ruleValidate" :label-width="100" style="width: 500px;margin-top: 20px;">
          <FormItem label="活动名称" prop="name">
            <Input type="text" v-model="dataReviseData.name"></Input>
          </FormItem>
          <FormItem label="活动费用">
            <Input type="text" v-model="dataReviseData.price" @on-change="reFeeChange" @on-blur="reFeeBluer" style="width: 80%;"></Input><Checkbox v-model="isReviseOpen" @on-change="reFreeChange" class="ml15">免费</Checkbox>
          </FormItem>
          <FormItem label="开始时间" prop="activityStart">
            <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" v-model="dataReviseData.activityStart" @on-change="dataReBeg" style="width: 100%;"></DatePicker>
          </FormItem>
          <FormItem label="结束时间" prop="activityEnd">
            <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" v-model="dataReviseData.activityEnd" @on-change="dataReEnd" style="width: 100%;"></DatePicker>
          </FormItem>
          <FormItem label="活动地址" prop="address">
            <Input type="text" v-model="dataReviseData.address"></Input>
          </FormItem>
          <FormItem label="允许人数" prop="num">
            <Input type="text" v-model="dataReviseData.num"></Input>
          </FormItem>
          <FormItem label="参与方式" prop="participate">
            <Input type="text" v-model="dataReviseData.participate"></Input>
          </FormItem>
          <FormItem label="活动介绍" prop="description">
            <Input type="textarea" v-model="dataReviseData.description"></Input>
          </FormItem>
          <FormItem label="活动安排" prop="arrangement">
            <Input type="textarea" v-model="dataReviseData.arrangement"></Input>
          </FormItem>
          <FormItem style="width: 200px!important;">
            <Button type="primary" @click="dataReviseClick" :loading="dataReviseLoading">确认修改</Button>
          </FormItem>
        </Form>
      </div>
    </Drawer>
    <Modal
      title="提示"
      v-model="dataTip"
    >
      <p ref="failTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
    <Modal
      title="提示"
      v-model="dataSuccess"
    >
      <p ref="addTip"></p>
      <div slot="footer">
        <Button type="warning"  @click="goDataList">返回列表</Button>
        <Button type="info"  @click="addDataMore">继续添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "@/axios/axios";
  import * as base from '../../axios/base';
  export default {
    name: "dataPageSystem",
    data () {
      return {
        uploadUrl:base.baseUrl + 'column_activity/saveFile',
        value3:false,
        dataReviseValue:false,
        dataDetailValue:false,
        dataTip:false,
        dataSuccess:false,
        dataSubLoading:false,
        dataReviseLoading:false,
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        //列表查询参数
        dataCheckedPra:{
          createTimeStart:'',
          createTimeEnd:'',
          name:'',
          status:'',
          pageNum:1,
          pageSize:10
        },
        dataList:[
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
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'活动编号',
            key:'activityNo',
            align:'center'
          },
          {
            title:'活动名称',
            key:'name',
            align:'center'
          },
          {
            title:'状态',
            key:'statusText',
            align:'center'
          },
          {
            title:'费用',
            key:'price',
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
            title:'参与方式',
              key:'participate',
            align:'center'
          },
          {
            title:'活动地址',
            key:'address',
            align:'center'
          },
          {
            title:'活动时间',
            key:'activityStart',
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
                        this.getDataActivityDetaik(params.row.id);
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
                        this.getReviseMessage(params.row.id);
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
                        axios.BlindDateCancle({status:1,id:params.row.id,activityNo:params.row.activityNo})
                          .then(res => {
                            //console.log(res);
                            if (res.code === 200) {
                              this.getDataList();
                              this.dataTip = true;
                              this.$refs.failTip.innerHTML = '活动取消成功！'
                            } else {
                              this.dataTip = true;
                              this.$refs.failTip.innerHTML = res.message;
                            }
                          })
                          .catch(error => {
                            console.log(error);
                            this.dataTip = true;
                            this.$refs.failTip.innerHTML = '取消失败！';
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
                        this.$router.push({path:'/dataSignList',query:{activityId:params.row.id}})
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
        //新增data
        defaultList:[],
        uploadList:[],
        dataImgUrl:'',
        visible:false,
        isFree:false,
        isOpen:true,
        addPath:'',
        dataFormData:{
          creatorId:'123456',
          name:'',
          activityStart:'',
          activityEnd:'',
          address:'',
          price:'0',
          num:'',
          participate:'',
          description:'',
          arrangement:'',
          filePath:''
        },
        //详情data
        dataDetailData:{
          dataDetailUploadList:[],
          isPhoto:true,
          name:'',
          fee:'',
          beginTime:'',
          endTime:'',
          address:'',
          member:'',
          participate:'',
          ins:'',
          arrange:''
        },
        //修改data
        dataReviseVisible:false,
        dataReviseDefault:[],
        dataUploadReviseList:[],
        dataReviseImgUrl:'',
        dataRevisePath:'',
        isReviseOpen:true,
        dataReviseId:'',
        dataReviseData:{
          creatorId:'123456',
          name:'',
          activityStart:'',
          activityEnd:'',
          address:'',
          price:'0',
          num:'',
          participate:'',
          description:'',
          arrangement:'',
          filePath:'',
          id:''
        },
        //表单验证
        ruleValidate:{
          name:[
            {required:true,message:'请填写线路名称'}
          ],
          activityStart:[
            {required:true,message:'请填写开始时间'}
          ],
          activityEnd:[
            {required:true,message:'请填写结束时间'}
          ],
          address:[
            {required:true,message:'请填写活动地址'}
          ],
          num:[
            {required:true,message:'请填写允许人数'}
          ],
          participate: [
            {required:true,message:'请填写参与方式'}
            ],
          description:[
            {required:true,message:'请填写活动介绍'}
          ],
          arrangement:[
            {required:true,message:'请填写活动安排'}
          ],
        }
      }
    },
    mounted () {
      this.getDataList();
      this.uploadList = this.$refs.dataUpload.fileList;
    },
    methods:{
      getDataList:function () {
        this.loading = true;
        axios.BlindDateList(this.dataCheckedPra)
          .then(res => {
            //console.log(res);
            if (res.code === 200) {
              this.loading = false;
              this.listData = res.result.list;
              this.total = res.result.total;
            } else {
              this.dataTip = true;
              this.$refs.failTip.innerHTML = res.message;
            }
          })
          .catch(error => {
            console.log(error);
            this.dataTip = true;
            this.$refs.failTip.innerHTML = '查询列表出错！'
          })
      },
      dataPageChange:function (page) {
        this.dataCheckedPra.pageNum = page;
        this.getDataList();
      },
      dataCheckStart:function (date) {
        this.dataCheckedPra.createTimeStart = date;
      },
      dataCheckEnd:function (date) {
        this.dataCheckedPra.createTimeEnd = date;
      },
      addCommunity:function () {
        this.value3 = true;
      },
      exportData:function () {
        window.location.href = base.baseUrl + 'column_activity/exportActivityList?createTimeStart='+this.dataCheckedPra.createTimeStart+'&createTimeEnd='+this.dataCheckedPra.createTimeEnd+'&name='+this.dataCheckedPra.name+'&status='+this.dataCheckedPra.status;
      },
      //新增
      handleSuccess:function (res,file,fileList) {
        //console.log(JSON.stringify(file));
        file.url = res.result[0].filePath;
        this.addPath += res.result[0].filePath + ',';
      },
      handleFormatError:function () {
        this.dataTip = true;
        this.$refs.failTip.innerHTML = '请选择格式为“jpg，jpeg，png”格式的图片！'
      },
      handleView:function (url) {
        this.dataImgUrl = url;
        this.visible = true;
      },
      handleRemove:function (file) {
        axios.BlindDataDeletePhoto({fileUrl:file.url})
          .then(res => {
            const fileList = this.$refs.dataUpload.fileList;
            this.$refs.dataUpload.fileList.splice(fileList.indexOf(file), 1);
          })
          .catch(error => {
            console.log(error);
            this.dataTip = true;
            this.$refs.failTip.innerHTML = '删除出错！'
          })
      },
      dataBeginTime:function (date) {
        this.dataFormData.activityStart = date;
      },
      dataEndTime:function (date) {
        this.dataFormData.activityEnd = date;
      },
      dataSubClick:function () {
        this.dataSubLoading = true;
        this.dataFormData.filePath = this.addPath.substr(0,this.addPath.length-1);
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            axios.BlindDateAdd(this.dataFormData)
              .then(res => {
                //console.log(res);
                this.dataSubLoading = false;
                if (res.code === 200) {
                  this.addPath = '';
                  this.dataSuccess = true;
                  this.$refs.addTip.innerHTML = res.message;
                  this.getDataList();
                } else {
                  this.dataTip = true;
                  this.$refs.failTip.innerHTML = res.message;
                }
              })
              .catch(error => {
                console.log(error);
                this.dataSubLoading = false;
                this.dataTip = true;
                this.$refs.failTip.innerHTML = '上传出错！'
              })
          }
        });
      },
      feeChanged:function () {
        this.isOpen = this.dataFormData.price == '0';
      },
      freeChange:function (res) {
        if (res) {
          this.dataFormData.price = 0;
        } else {
          this.dataFormData.price = ''
        }
      },
      feeBlur:function () {
        if (this.dataFormData.price == '') {
          this.dataFormData.price = '0';
          this.isOpen = true;
        }
      },
      //详情查询
      getDataActivityDetaik:function (id) {
        axios.BlindDateDetail({id:id})
          .then(res => {
            //console.log(res);
            if (res.code === 200) {
              if (res.result.filePath != null && res.result.filePath !== ""){
                this.dataDetailData.isPhoto = true;
                this.dataDetailData.dataDetailUploadList = res.result.filePath.split(',');
              } else {
                this.dataDetailData.dataDetailUploadList = [];
                this.dataDetailData.isPhoto = false;
              }
              this.dataDetailData.name = res.result.name;
              this.dataDetailData.fee = res.result.price;
              this.dataDetailData.beginTime = res.result.activityStart;
              this.dataDetailData.endTime = res.result.activityEnd;
              this.dataDetailData.address = res.result.address;
              this.dataDetailData.member = res.result.num;
              this.dataDetailData.participate = res.result.participate;
              this.dataDetailData.ins = res.result.description;
              this.dataDetailData.arrange = res.result.arrangement;
              this.dataDetailValue = true;
            } else {
              this.dataTip = true;
              this.$refs.failTip.innerHTML = res.message;
            }
          })
          .catch(error => {
            console.log(error);
            this.dataTip = true;
            this.$refs.failTip.innerHTML = '查询出错！'
          })
      },
      //修改
      getReviseMessage:function (id) {
        axios.BlindDateDetail({id:id})
          .then(res => {
            if (res.code === 200) {
              if (res.result.filePath != null && res.result.filePath !== "") {
                this.dataRevisePath = res.result.filePath + ',';
                let arr = res.result.filePath.split(',');
                arr.forEach((item,index) => {
                  this.dataReviseDefault.push({url:item,name:index});
                });
              } else {
                this.dataRevisePath = '';
                this.dataReviseDefault = [];
              }
              this.$refs.dataReviseUpload.fileList = this.dataReviseDefault;
              this.dataUploadReviseList = this.$refs.dataReviseUpload.fileList;
              this.dataReviseData.name = res.result.name;
              this.dataReviseData.price = res.result.price;
              this.dataReviseData.activityStart = res.result.activityStart;
              this.dataReviseData.activityEnd = res.result.activityEnd;
              this.dataReviseData.address = res.result.address;
              this.dataReviseData.num = res.result.num;
              this.dataReviseData.participate = res.result.participate;
              this.dataReviseData.description = res.result.description;
              this.dataReviseData.arrangement = res.result.arrangement;
              this.dataReviseId = id;
              this.isReviseOpen = res.result.price == '0';
              this.dataReviseValue = true;
            } else {
              this.dataTip = true;
              this.$refs.failTip.innerHTML = res.message;
            }
          })
          .catch(error => {
            console.log(error);
            this.dataTip = true;
            this.$refs.failTip.innerHTML = '查询出错！'
          })
      },
      dataReviseView:function (url) {
        this.dataReviseImgUrl = url;
        this.dataReviseVisible = true;
      },
      dataReviseRemove:function (file) {
        axios.BlindDataDeletePhoto({fileUrl:file.url})
          .then(res => {
            const fileList = this.$refs.dataReviseUpload.fileList;
            this.$refs.dataReviseUpload.fileList.splice(fileList.indexOf(file), 1);
            this.dataUploadReviseList = this.$refs.dataReviseUpload.fileList;
          })
          .catch(error => {
            console.log(error);
            this.dataTip = true;
            this.$refs.failTip.innerHTML = '删除出错！'
          })
      },
      handleReviseSuccess:function (res,file,fileList) {
        file.url = res.result[0].filePath;
        this.dataUploadReviseList = fileList;
        this.dataRevisePath += res.result[0].filePath + ',';
      },
      dataReviseClick:function () {
        this.dataReviseData.id = this.dataReviseId;
        this.dataReviseData.filePath = this.dataRevisePath.substr(0,this.dataRevisePath.length-1);
        this.dataReviseData.activityStart = this.$trans.timeTranslateColock(this.dataReviseData.activityStart);
        this.dataReviseData.activityEnd = this.$trans.timeTranslateColock(this.dataReviseData.activityEnd);
        this.$refs.dataReviseForm.validate(valid => {
          if (valid) {
            this.dataReviseLoading = true;
            axios.BlindDateRevise(this.dataReviseData)
              .then(res => {
                this.dataReviseLoading = false;
                if (res.code === 200) {
                  //新增成功之后把pathStr清空
                  this.dataRevisePath = '';
                  this.dataReviseValue = false;
                  this.clearDataRevise();
                  this.dataTip = true;
                  this.$refs.failTip.innerHTML = '修改成功';
                  this.getDataList();
                } else {
                  this.dataTip = true;
                  this.$refs.failTip.innerHTML = res.message;
                }
              })
              .catch(error => {
                console.log(error);
                this.dataReviseLoading = false;
                this.dataTip = true;
                this.$refs.failTip.innerHTML = '修改出错！'
              })
          }
        })
      },
      dataReBeg:function (date) {
        this.dataReviseData.activityStart = date;
      },
      dataReEnd:function (date) {
        this.dataReviseData.activityEnd = date;
      },
      reFreeChange:function (res) {
        if (res) {
          this.dataReviseData.price = '0';
        } else {
          this.dataReviseData.price = '';
        }
      },
      reFeeChange:function () {
        this.isReviseOpen = this.dataReviseData.price == '0';
      },
      reFeeBluer:function () {
        if (this.dataReviseData.price == '') {
          this.dataReviseData.price = '0';
          this.isReviseOpen = true;
        }
      },
      //模态弹框
      del:function () {
        this.dataTip = false;
      },
      goDataList:function () {
        this.clearDataDa();
        this.value3 = false;
        this.dataSuccess = false;
      },
      addDataMore:function () {
        this.clearDataDa();
        this.dataSuccess = false;
      },
      //重置表单
      clearDataDa:function () {
        this.$refs.dataUpload.clearFiles();
        this.uploadList = this.$refs.dataUpload.fileList;
        this.$refs.dataForm.resetFields();
        this.dataFormData.price = '0';
        this.isOpen = true;
      },
      clearDataDetail:function () {
        this.dataDetailData.dataDetailUploadList = [];
        this.dataDetailData.isPhoto = true;
        this.dataDetailData.name = '';
        this.dataDetailData.fee = '';
        this.dataDetailData.beginTime = '';
        this.dataDetailData.endTime = '';
        this.dataDetailData.address = '';
        this.dataDetailData.member = '';
        this.dataDetailData.ins = '';
        this.dataDetailData.arrange = '';
      },
      clearDataRevise:function () {
        //清空图片
        this.$refs.dataReviseUpload.clearFiles();
        this.dataUploadReviseList = this.$refs.dataReviseUpload.fileList;
        //清空表单
        this.$refs.dataReviseForm.resetFields();
        this.dataReviseData.price = '0';
        this.isReviseOpen = true;
        this.dataReviseDefault = [];
        this.dataReviseImgUrl = '';
        this.dataReviseId = '';
        this.dataRevisePath = '';
      }
    }
  }
</script>

<style lang="scss" scoped>
  .data-fun{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .data-search{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      line-height: 33px;
      padding-right: 30px;
    }
  }
  .data-list{
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
