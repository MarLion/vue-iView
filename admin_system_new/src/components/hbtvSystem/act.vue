<template>
  <div class="data-container">
    <div>
      <div class="data-fun">
        <div class="data-ope">
          <Button type="default" icon="md-add" @click="addAct">发布节目</Button>
          <Button type="default" icon="ios-download" @click="exportData">导出EXCEL</Button>
        </div>
        <div class="data-search">
          <span class="ml15">发布日期从：</span>
          <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="actCreateBeg" style="width: 200px;"></DatePicker></span>
          <span class="ml15">发布日期止：</span>
          <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="actCreateEnd" style="width: 200px;"></DatePicker></span>
          <span class="ml15">活动名称：</span>
          <span><Input v-model="actCheckData.name" style="width: 200px;"/></span>
          <span class="ml15">状态类型：</span>
          <span>
            <Select v-model="actCheckData.status" style="width:200px">
              <Option v-for="(item,index) in dataList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
          </span>
          <span class="ml10"><Button icon="ios-search" @click="getActList">查询</Button></span>
        </div>
      </div>
      <div class="data-list mt30">
        <Table border :columns="columns" :data="listData" :loading="loading"></Table>
        <Page :total="total" v-if="total>10" show-elevator show-total class="mt30" @on-change="actPageChange"/>
      </div>
    </div>
    <!--新增-->
    <Drawer
      title="发布节目"
      v-model="actAddValue"
      width="720"
      :mask-closable="false"
      :styles="styles"
      @on-close = 'clearActAdd'
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
                <Icon type="ios-eye-outline" @click.native="actHandleView(item.url)"></Icon>
                <Icon type="ios-trash-outline" @click.native="actHandleRemove(item)"></Icon>
              </div>
            </template>
            <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
          </div>
          <Upload :action='uploadUrl'
                  ref="actUpload"
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
          <modal title="查看照片" v-model="actVisible">
            <img :src= 'imgUrl' style="width: 100%">
          </modal>
        </div>
        <Form :model="actFormData" ref="actFormData" :rules="ruleValidate" :label-width="100" style="width: 500px;margin-top: 20px;">
          <FormItem label="节目名称" prop="name">
            <Input type="text" v-model="actFormData.name"></Input>
          </FormItem>
          <FormItem label="节目口号" prop="slogan">
            <Input type="text" v-model="actFormData.slogan" style="width: 100%;"></Input>
          </FormItem>
          <FormItem label="参与方式" prop="participate">
            <Input type="text" v-model="actFormData.participate"></Input>
          </FormItem>
          <FormItem label="允许人数" prop="num">
            <Input type="text" v-model="actFormData.num"></Input>
          </FormItem>
          <FormItem label="节目介绍" prop="description">
            <Input type="textarea" v-model="actFormData.description"></Input>
          </FormItem>
          <FormItem label="节目预告" prop="arrangement">
            <Input type="textarea" v-model="actFormData.arrangement"></Input>
          </FormItem>
          <FormItem style="width: 200px!important;">
            <Button type="primary" @click="actSubClick" :loading="addingAct">发布节目</Button>
          </FormItem>
        </Form>
      </div>
    </Drawer>
    <!--详情-->
    <Drawer
      title="节目详情"
      v-model="actDetailValue"
      width="720"
      :mask-closable="false"
      :styles="styles"
      @on-close = 'clearActDetail'
    >
      <div class="add-title">
          <span>
            <span class="add-tips"><Icon type="md-information-circle" />友情提示：湖北电视台工作人员使用，配置专用账户！</span>
          </span>
      </div>
      <div class="add-image mt30">
        <p class="p">照&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;片：</p>
        <template v-if="actDetailDate.isPhoto">
          <div class="demo-upload-list"  v-for="item in actDetailDate.detailUploadList">
            <img :src="item">
          </div>
        </template>
        <template v-else>
          <div class="demo-upload-list">暂无图片</div>
        </template>
      </div>
      <div class="add-detail">
        <p class="p">节目名称：</p>
        <p class="detailSpan">{{actDetailDate.name}}</p>
      </div>
      <div class="add-detail">
        <p class="p">节目口号：</p>
        <p class="detailSpan">{{actDetailDate.slogan}}</p>
      </div>
      <div class="add-detail">
        <p class="p">参与方式：</p>
        <p class="detailSpan">{{actDetailDate.method}}</p>
      </div>
      <div class="add-detail">
        <p class="p">允许人数：</p>
        <p class="detailSpan">{{actDetailDate.num}}</p>
      </div>
      <div class="add-detail">
        <p class="p">节目介绍：</p>
        <p class="detailSpan detailWidth">{{actDetailDate.description}}</p>
      </div>
      <div class="add-detail">
        <p class="p">节目预告：</p>
        <p class="detailSpan detailWidth">{{actDetailDate.arrangement}}</p>
      </div>
    </Drawer>
    <!--修改-->
    <Drawer
      title="节目修改"
      v-model="actReviseValue"
      width="720"
      :mask-closable="false"
      :styles="styles"
      @on-close = 'clearActRevise'
    >
      <div class="add-title">
        <span>
          <span class="add-tips"><Icon type="md-information-circle" />友情提示：湖北电视台工作人员使用，配置专用账户！</span>
        </span>
      </div>
      <div class="add-form mt30">
        <div class="add-image">
          <p class="p">上传照片</p>
          <div class="demo-upload-list" v-for="item in actReviseUploadList">
            <template v-if="item.status === 'finished'">
              <img :src="item.url">
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="actReviseHandleView(item.url)"></Icon>
                <Icon type="ios-trash-outline" @click.native="actReviseHandleRemove(item)"></Icon>
              </div>
            </template>
            <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
          </div>
          <Upload :action='uploadUrl'
                  ref="actReviseUpload"
                  :show-upload-list="false"
                  :default-file-list="actReviseDefaultList"
                  :on-success="actReviseHandleSuccess"
                  :format="['jpg','jpeg','png']"
                  :on-format-error="handleFormatError"
                  multiple
                  type="drag"
                  style="display: inline-block;width:100px;">
            <div style="width: 100px;height:100px;line-height: 100px;">
              <Icon type="ios-camera" size="40"></Icon>
            </div>
          </Upload>
          <modal title="查看照片" v-model="actReviseVisible">
            <img :src= 'actReviseImgUrl' style="width: 100%">
          </modal>
        </div>
        <Form :model="actReviseFormData" ref="actReviseFormData" :rules="ruleValidate" :label-width="100" style="width: 500px;margin-top: 20px;">
          <FormItem label="节目名称" prop="name">
            <Input type="text" v-model="actReviseFormData.name"></Input>
          </FormItem>
          <FormItem label="节目口号" prop="slogan">
            <Input type="text" v-model="actReviseFormData.slogan" style="width: 100%;"></Input>
          </FormItem>
          <FormItem label="参与方式" prop="participate">
            <Input type="text" v-model="actReviseFormData.participate"></Input>
          </FormItem>
          <FormItem label="允许人数" prop="num">
            <Input type="text" v-model="actReviseFormData.num"></Input>
          </FormItem>
          <FormItem label="节目介绍" prop="description">
            <Input type="textarea" v-model="actReviseFormData.description"></Input>
          </FormItem>
          <FormItem label="节目预告" prop="arrangement">
            <Input type="textarea" v-model="actReviseFormData.arrangement"></Input>
          </FormItem>
          <FormItem style="width: 200px!important;">
            <Button type="primary" @click="actReviseSubClick" :loading="revisingAct">确定修改</Button>
          </FormItem>
        </Form>
      </div>
    </Drawer>
    <Modal
      title="提示"
      v-model="actTip"
    >
      <p ref="actTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
    <Modal
      title="提示"
      v-model="actSuccess"
    >
      <p ref="actAddTip"></p>
      <div slot="footer">
        <Button type="warning"  @click="goActList">返回列表</Button>
        <Button type="info"  @click="addActMore">继续添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "@/axios/axios";
  import * as base from '../../axios/base';
  export default {
    name: "act",
    data () {
      return {
        uploadUrl:base.baseUrl + 'column_program/saveFile',
        actAddValue:false,
        actDetailValue:false,
        actReviseValue:false,
        addingAct:false,
        revisingAct:false,
        actTip:false,
        actSuccess:false,
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        //查询参数
        actCheckData:{
          createTimeStart:'',
          createTimeEnd:'',
          name:'',
          status:'',
          pageNum:1,
          pageSize:10
        },
        //新增数据
        uploadList:[],
        actVisible:false,
        imgUrl:'',
        addPathStr:'',
        actFormData:{
          creatorId:'123456',
          name:'',
          slogan:'',
          participate:'',
          num:'',
          description:'',
          arrangement:'',
          filePath:''
        },
        //详情数据
        actDetailDate:{
          isPhoto:false,
          detailUploadList:[],
          name:'',
          slogan:'',
          method:'',
          num:'',
          description:'',
          arrangement:'',
        },
        //修改数据
        actReviseVisible:false,
        actReviseUploadList:[],
        actReviseDefaultList:[],
        actRevisePath:'',
        actReviseImgUrl:'',
        actReviseId:'',
        actReviseFormData:{
          creatorId:'123456',
          name:'',
          slogan:'',
          participate:'',
          num:'',
          description:'',
          arrangement:'',
          filePath:'',
          id:''
        },
        //类型数据
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
          },
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
            title:'节目编号',
            key:'programNo',
            align:'center'
          },
          {
            title:'节目名称',
            key:'name',
            align:'center'
          },
          {
            title:'状态',
            key:'statusText',
            align:'center'
          },
          {
            title:'参与方式',
            key:'participate',
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
            title:'发布日期',
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
                        this.getActDetailMessage(params.row.id);
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
                        this.getActReviseMessage(params.row.id);
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
                        axios.ActCancel({status:1,id:params.row.id})
                          .then(res => {
                            if (res.code === 200) {
                              this.getActList();
                              this.actTip = true;
                              this.$refs.actTip.innerHTML = '取消成功！';
                            } else {
                              this.actTip = true;
                              this.$refs.actTip.innerHTML = res.message;
                            }
                          })
                          .catch(error => {
                            console.log(error);
                            this.actTip = true;
                            this.$refs.actTip.innerHTML = '取消失败！'
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
                        this.$router.push({path:'/actSignList',query:{actId:params.row.id}})
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
                  }, '该节目已取消')
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
                  }, '该节目已结束')
                ])
              }
            }
          }
        ],
        listData:[],
        ruleValidate:{
          name:[
            {required:true,message:'请填写节目名称'}
          ],
          slogan:[
            {required:true,message:'请填写节目口号'}
          ],
          participate:[
            {required:true,message:'请填写参与方式'}
          ],
          num:[
            {required:true,message:'请填写允许人数'}
          ],
          description:[
            {required:true,message:'请填写节目介绍'}
          ],
          arrangement:[
            {required:true,message:'请填写节目预告'}
          ],
        }
      }
    },
    mounted () {
      this.uploadList = this.$refs.actUpload.fileList;
      this.getActList();
    },
    methods:{
      getActList:function () { //获取活动列表
        this.loading = true;
        axios.ActList(this.actCheckData)
          .then(res => {
            //console.log(JSON.stringify(res.result.list[0]));
            if (res.code === 200) {
              this.loading = false;
              this.listData = res.result.list;
              this.total = res.result.total;
            } else {
              this.actTip = true;
              this.$refs.actTip.innerHTML = res.message;
            }
          })
          .catch(error => {
            console.log(error);
            this.actTip = true;
            this.$refs.actTip.innerHTML = '查询出错！';
          })
      },
      addAct:function () { //新增开关
        this.actAddValue = true;
      },
      exportData:function () { //导出表格
        window.location.href = base.baseUrl + 'column_program/exportProgramList?createTimeStart='+this.actCheckData.createTimeStart+'&createTimeEnd='+this.actCheckData.createTimeEnd+'&name='+this.actCheckData.name+'&status='+this.actCheckData.status;
      },
      actCreateBeg:function (date) { //查询条件开始时间
        this.actCheckData.createTimeStart = date;
      },
      actCreateEnd:function (date) { //查询条件结束时间
        this.actCheckData.createTimeEnd = date;
      },
      handleFormatError:function () { //图片格式不对
        this.actTip = true;
        this.$refs.actTip.innerHTML = '请选择格式为“jpg，jpeg，png”格式的图片！'
      },
      //新增
      handleSuccess:function (res,file,fileList) {  //新增上传图片成功 设置file的URL 拼接path字符串
        file.url = res.result[0].filePath;
        this.addPathStr += res.result[0].filePath + ',';
        console.log(this.addPathStr);
      },
      actSubClick:function () { //确认提交
        this.actFormData.filePath = this.addPathStr.substr(0,this.addPathStr.length-1);
        this.$refs.actFormData.validate(valid => {
          if (valid) {
            this.addingAct = true;
            axios.ActAdd(this.actFormData)
              .then(res => {
                console.log(res);
                if (res.code === 200) {
                  this.addPathStr = '';
                  this.actSuccess = true;
                  this.$refs.actAddTip.innerHTML = res.message;
                  this.getActList();
                } else {
                  this.actTip = true;
                  this.$refs.actTip.innerHTML = res.message;
                }
              })
              .catch(error => {
                console.log(error);
                this.actTip = true;
                this.$refs.actTip.innerHTML = '上传出错！'
              })
          }
        })
      },
      actHandleView:function (url) { //查看大图
        this.imgUrl = url;
        this.actVisible = true;
      },
      actHandleRemove:function (file) { //删除图片
        axios.ActDeletePhoto({fileUrl:file.url})
          .then(res => {
            const fileList = this.$refs.actUpload.fileList;
            this.$refs.actUpload.fileList.splice(fileList.indexOf(file),1);
          })
          .catch(error => {
            console.log(error);
            this.actTip = true;
            this.$refs.actTip.innerHTML = '删除出错！'
          })
      },
      //详情
      getActDetailMessage:function (id) { //获取详情信息
        axios.ActDetail({id:id})
          .then(res => {
            //console.log(res);
            if (res.code === 200) {
              if (res.result.filePath != null && res.result.filePath !== "") {
                this.actDetailDate.isPhoto = true;
                this.actDetailDate.detailUploadList = res.result.filePath.split(',');
              } else {
                this.actDetailDate.isPhoto = false;
                this.actDetailDate.detailUploadList = [];
              }
              this.actDetailDate.name = res.result.name;
              this.actDetailDate.slogan = res.result.slogan;
              this.actDetailDate.method = res.result.participate;
              this.actDetailDate.num = res.result.num;
              this.actDetailDate.description = res.result.description;
              this.actDetailDate.arrangement = res.result.arrangement;
              this.actDetailValue = true;
            } else {
              this.actTip = true;
              this.$refs.actTip.innerHTML = res.message;
            }
          })
          .catch(error => {
            console.log(error);
            this.actTip = true;
            this.$refs.actTip.innerHTML = '查询出错！'
          })
      },
      //修改
      getActReviseMessage:function (id) { //获取原信息
        axios.ActDetail({id:id})
          .then(res => {
            if (res.code === 200) {
              if (res.result.filePath != null && res.result.filePath !== '') {
                this.actRevisePath = res.result.filePath + ',';
                let arr = res.result.filePath.split(',');
                arr.forEach((item,index) => {
                  this.actReviseDefaultList.push({url:item,name:index,status:'finished'});
                });
              } else {
                this.actRevisePath = '';
                this.actReviseDefaultList = [];
              }
              this.$refs.actReviseUpload.fileList = this.actReviseDefaultList;
              this.actReviseUploadList = this.$refs.actReviseUpload.fileList;
              console.log(this.actReviseDefaultList);
              this.actReviseFormData.name = res.result.name;
              this.actReviseFormData.slogan = res.result.slogan;
              this.actReviseFormData.participate = res.result.participate;
              this.actReviseFormData.num = res.result.num;
              this.actReviseFormData.description = res.result.description;
              this.actReviseFormData.arrangement = res.result.arrangement;
              this.actReviseId = id;
              this.actReviseValue = true;
            } else {
              this.actTip = true;
              this.$refs.actTip.innerHTML = res.message;
            }
          })
          .catch(error => {
            console.log(error);
            this.actTip = true;
            this.$refs.actTip.innerHTML = '查询出错！'
          });
        this.actReviseValue = true;
      },
      actReviseHandleView:function (url) { //修改看大图
        this.actReviseImgUrl = url;
        this.actReviseVisible = true;
      },
      actReviseHandleSuccess:function (res,file,fileList) { //修改 图片上传成功
        file.url = res.result[0].filePath;
        this.actReviseUploadList = fileList;
        this.actRevisePath += res.result[0].filePath + ',';
      },
      actReviseHandleRemove:function (file) { //修改删除图片
        axios.ActDeletePhoto({fileUrl:file.url})
          .then(res => {
            const fileList = this.$refs.actReviseUpload.fileList;
            this.$refs.actReviseUpload.fileList.splice(fileList.indexOf(file),1);
            this.actReviseUploadList = this.$refs.actReviseUpload.fileList;
          })
          .catch(error => {
            console.log(error);
            this.actTip = true;
            this.$refs.actTip.innerHTML = '删除出错！'
          })
      },
      actReviseSubClick:function () { //修改提交
        this.actReviseFormData.id = this.actReviseId;
        this.actReviseFormData.filePath = this.actRevisePath.substr(0,this.actRevisePath.length-1);
        this.$refs.actReviseFormData.validate(valid => {
          if (valid) {
            axios.ActRevise(this.actReviseFormData)
              .then(res => {
                if (res.code === 200) {
                  this.actReviseValue = false;
                  this.clearActRevise();
                  this.actTip = true;
                  this.$refs.actTip.innerHTML = res.message;
                  this.getActList();
                } else {
                  this.actTip = true;
                  this.$refs.actTip.innerHTML = res.message;
                }
              })
              .catch(error => {
                console.log(error);
                this.actTip = true;
                this.$refs.actTip.innerHTML = '保存出错！'
              })
          }
        })
      },
      //翻页
      actPageChange:function (page) {
        this.actCheckData.pageNum = page;
        this.getActList();
      },
      //清空表单
      clearActAdd:function () { //新增清空
        this.$refs.actUpload.clearFiles();
        this.uploadList = this.$refs.actUpload.fileList;
        this.$refs.actFormData.resetFields();
      },
      clearActDetail:function () { //详情清空
        this.actDetailDate.isPhoto = false;
        this.actDetailDate.detailUploadList = [];
        this.actDetailDate.name = '';
        this.actDetailDate.slogan = '';
        this.actDetailDate.method = '';
        this.actDetailDate.num = '';
        this.actDetailDate.description = '';
        this.actDetailDate.arrangement = ''
      },
      clearActRevise:function () { //修改清空
        this.$refs.actReviseUpload.clearFiles();
        this.actReviseUploadList = this.$refs.actReviseUpload.fileList;
        this.$refs.actReviseFormData.resetFields();
        this.actReviseDefaultList = [];
        this.actRevisePath = '';
        this.actReviseImgUrl = '';
        this.actReviseId = '';
      },
      //模态弹框
      del:function () { //关闭弹框一
        this.actTip = false;
      },
      goActList:function () { //发布成功返回列表
        this.clearActAdd();
        this.actSuccess = false;
        this.actAddValue = false
      },
      addActMore:function () { //发布成功继续发布
        this.clearActAdd();
        this.actSuccess = false;
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
