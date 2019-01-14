<template>
  <div class="route-container content-pad">
    <div>
      <div class="route-fun">
        <div class="route-ope">
          <Button type="default" icon="md-add" @click="addCommunity">新增路线</Button>
          <Button type="default" icon="ios-download" @click="exportData">导出EXCEL</Button>
        </div>
        <div class="route-search">
          <span class="ml15">创建日期从：</span>
          <span><DatePicker type="date" format="yyyy-MM-dd" v-model="startTime" @on-change="chooseStartTime" :options="begOption" class="checkWid"></DatePicker></span>
          <span class="ml15">创建日期止：</span>
          <span><DatePicker type="date" format="yyyy-MM-dd" v-model="endTime" @on-change="chooseEndTime" :options="endOption" class="checkWid"></DatePicker></span>
          <span class="ml15">路线名称：</span>
          <span><Input v-model="routeNic" class="checkWid"/></span>
          <span class="ml15">状态类型：</span>
          <span>
            <Select v-model="routeType" style="width:200px">
              <Option v-for="(item,index) in detailList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
          </span>
          <span class="ml10"><Button icon="ios-search" @click="checkClick">查询</Button></span>
        </div>
      </div>
      <div class="route-list mt30">
        <Table border :columns="columns" :data="listData" :loading="loading"></Table>
        <Page :total="total" :current="page" v-if="total>10" show-elevator show-total class="mt30" @on-change="pageChange"/>
      </div>
    </div>
    <!--新增路线-->
    <Drawer
      title="发布旅游路线"
      v-model="value3"
      width="1200"
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
          <div class="divs">
            <p class="p">上传照片：</p>
            <div class="add-image">
              <div class="demo-upload-list mt10" v-for="item in uploadList">
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
                      :format="['jpg','jpeg','png','bmp']"
                      :on-format-error="handleFormatError"
                      :before-upload="handleBeforeUpload"
                      multiple
                      type="drag"
                      style="display: inline-block;width:100px;margin-top: 10px;">
                <div style="width: 100px;height:100px;line-height: 100px;">
                  <Icon type="ios-camera" size="40"></Icon>
                </div>
              </Upload>
              <Modal title="查看照片" v-model="visible">
                <img :src= 'imgUrl' style="width: 100%">
                <div slot="footer"></div>
              </Modal>
            </div>
          </div>
          <Form :model="formData" ref="formData" :rules="ruleValidate" :label-width="100" style="width: 100%;margin-top: 20px;">
            <FormItem label="线路名称：" prop="name" style="width: 500px;">
              <Input type="text" v-model="formData.name" ></Input>
            </FormItem>
            <FormItem label="行程时间：" prop="date" style="width: 500px;">
              <Row>
                <Col span="10">
                  <FormItem prop="tourStart">
                    <DatePicker type="date" format="yyyy-MM-dd" @on-change="formDataBegTime" v-model="formData.tourStart" :options="addEndOption" style="width: 175px;"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="3" style="text-align: center;">
                  至
                </Col>
                <Col span="10">
                  <FormItem prop="tourEnd">
                    <DatePicker type="date" format="yyyy-MM-dd" @on-change="formDataEndTime" v-model="formData.tourEnd" :options="addOption" style="width: 175px;"></DatePicker>
                  </FormItem>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="产品价格：" prop="price" style="width: 500px;">
              <InputNumber v-model="formData.price" :max="10000000" :min="0" style="width: 90%;"></InputNumber>
              <span>玄乐币</span>
            </FormItem>
            <FormItem label="费用清单：" prop="tourList" style="width: 500px;">
              <Input type="text" v-model="formData.tourList"></Input>
            </FormItem>
            <FormItem label="允许人数：" prop="num" style="width: 500px;">
              <InputNumber  v-model="formData.num" :max="100000" :min="0" style="width: 100%;"></InputNumber>
            </FormItem>
            <FormItem label="详情类型：" style="width: 500px;">
              <Select v-model="formData.infoType" style="width:100%">
                <Option v-for="(item,index) in detailList" :value="item.value" :key="index">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <template v-if="formData.infoType === 1">
              <FormItem label="玄乐地址：" prop="xlInfoUrl" style="width: 500px;">
                <Input type="text" v-model="formData.xlInfoUrl"></Input>
              </FormItem>
              <FormItem label="电视台地址：" prop="tvInfoUrl" style="width: 500px;">
                <Input type="text" v-model="formData.tvInfoUrl"></Input>
              </FormItem>
            </template>
            <template v-else>
              <FormItem label="景区介绍：">
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
              </FormItem>
              <FormItem label="行程安排：">
                <div class="editor-container">
                  <quill-editor
                    ref="arrangeEditor"
                    v-model="formData.tourArrangement"
                    :options="myArrOptions"
                  ></quill-editor>
                  <Upload
                    :action="ediUploadUrl"
                    ref="arrEditorUpload"
                    class="arrEditorUp"
                    :on-success="arrHandleEdiSuccess"
                    :format="['jpg','jpeg','png','bmp']"
                    :on-format-error="handleEdiFormatError"
                    :before-upload="handleEdiBefore"
                    style="display: none"
                  >
                    <Button>点击上传</Button>
                  </Upload>
                </div>
              </FormItem>
            </template>
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
      width="1200"
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
        <div class="divs">
          <p class="p">照&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;片：</p>
          <div class="add-image">
            <template v-if="detailData.isPhoto">
              <div class="demo-upload-list"  v-for="item in detailData.detailUploadList">
                <img :src="item">
              </div>
            </template>
            <template v-else>
              <div class="demo-upload-list">暂无图片</div>
            </template>
          </div>
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
          <p class="detailSpan">玄乐币</p>
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
        <template v-if="isCustom">
          <div class="add-detail">
            <p class="p">玄乐地址：</p>
            <p class="detailWidth" ref="xl"></p>
          </div>
          <div class="add-detail">
            <p class="p">电视台地址：</p>
            <p class="detailWidth" ref="tv"></p>
          </div>
        </template>
        <template v-if="isMod">
          <div class="add-detail">
            <p class="p">景区介绍：</p>
            <p class="detailWidth" ref="des"></p>
          </div>
          <div class="add-detail">
            <p class="p">行程安排：</p>
            <p class="detailWidth" ref="arrange"></p>
          </div>
        </template>
      </div>
    </Drawer>
    <!--修改路线-->
    <Drawer
      title="旅游路线修改"
      v-model="value5"
      width="1200"
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
        <div class="divs">
          <p class="p">上传照片：</p>
          <div class="add-image">
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
                    :format="['jpg','jpeg','png','bmp']"
                    :on-format-error="handleReviseFormatError"
                    :before-upload="handleBeforeUploadRevise"
                    multiple
                    type="drag"
                    style="display: inline-block;width:100px;">
              <div style="width: 100px;height:100px;line-height: 100px;">
                <Icon type="ios-camera" size="40"></Icon>
              </div>
            </Upload>
            <Modal title="查看照片" v-model="reviseVisible">
              <img :src= 'reviseImgUrl' style="width: 100%">
              <div slot="footer"></div>
            </Modal>
          </div>
        </div>
        <Form :model="reviseData" ref="reviseData" :rules="ruleValidate" :label-width="100" style="width: 100%;margin-top: 20px;">
          <FormItem label="线路名称：" prop="name" style="width: 500px;">
            <Input type="text" v-model="reviseData.name"></Input>
          </FormItem>
          <FormItem label="行程时间：" style="width: 500px;">
            <Row>
              <Col span="10">
                <FormItem prop="tourStart">
                  <DatePicker type="date" format="yyyy-MM-dd" v-model="reviseData.tourStart" @on-change="reviseDataStart" :options="reviseEndOption" style="width: 175px;"></DatePicker>
                </FormItem>
              </Col>
              <Col span="3" style="text-align: center;">
                至
              </Col>
              <Col span="10">
                <FormItem prop="tourEnd">
                  <DatePicker type="date" format="yyyy-MM-dd" v-model="reviseData.tourEnd" @on-change="reviseDataEnd" :options="reviseOption" style="width: 175px;"></DatePicker>
                </FormItem>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="产品价格：" prop="price" style="width: 500px;">
            <InputNumber v-model="reviseData.price" :max="10000000" :min="0" style="width: 90%;"></InputNumber>
            <span>玄乐币</span>
          </FormItem>
          <FormItem label="费用清单：" prop="tourList" style="width: 500px;">
            <Input type="text" v-model="reviseData.tourList"></Input>
          </FormItem>
          <FormItem label="允许人数：" prop="num" style="width: 500px;">
            <InputNumber v-model="reviseData.num" :max="100000" :min="0" style="width: 100%;"></InputNumber>
          </FormItem>
          <FormItem label="详情类型：" style="width: 500px;">
            <Select v-model="reviseData.infoType" style="width:100%" @on-change="infoTypeChange">
              <Option v-for="(item,index) in detailList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <template v-if="isReCustom">
            <FormItem label="玄乐地址：" prop="xlInfoUrl" style="width: 500px;">
              <Input type="text" v-model="reviseData.xlInfoUrl"></Input>
            </FormItem>
            <FormItem label="电视台地址：" prop="tvInfoUrl" style="width: 500px;">
              <Input type="text" v-model="reviseData.tvInfoUrl"></Input>
            </FormItem>
          </template>
          <template v-if="isReMod">
            <FormItem label="景区介绍：">
              <div class="editor-container">
                <quill-editor
                  ref="myReEditor"
                  v-model="reviseData.description"
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
            <FormItem label="行程安排：">
              <div class="editor-container">
                <quill-editor
                  ref="arrangeReEditor"
                  v-model="reviseData.tourArrangement"
                  :options="myArrReOptions"
                ></quill-editor>
                <Upload
                  :action="ediUploadUrl"
                  ref="arrEditorReUpload"
                  class="arrEditorReUp"
                  :on-success="reArrHandleEdiSuccess"
                  :format="['jpg','jpeg','png','bmp']"
                  :on-format-error="handleEdiFormatError"
                  :before-upload="handleEdiBefore"
                  style="display: none"
                >
                  <Button>点击上传</Button>
                </Upload>
              </div>
            </FormItem>
          </template>
          <FormItem style="width: 200px!important;">
            <Button type="primary" @click="reviseSub" :loading="reviseAdding">确认修改</Button>
          </FormItem>
        </Form>
      </div>
    </Drawer>
    <Modal
      title="提示"
      v-model="loginFail"
      :mask-closable = "false"
    >
      <p ref="failTip"></p>
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
    name: "tourRouteSystem",
    data () {
      //自定义验证
      const validateName = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写线路名称'))
        } else {
          callback();
        }
      };
      const validateTourStart = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写起始时间'))
        } else {
          callback();
        }
      };
      const validateEourEnd = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写结束时间'))
        } else {
          callback();
        }
      };
      const validatePrice = (rule,value,callback) => {
        if (value === null) {
          callback(new Error('请填写产品价格'))
        } else {
          callback();
        }
      };
      const validateTourList = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写费用清单'))
        } else {
          callback();
        }
      };
      const validateNum = (rule,value,callback) => {
        if (value === null) {
          callback(new Error('请填写允许人数'))
        } else {
          callback();
        }
      };
      const validateDescript = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写景区介绍'))
        } else {
          callback();
        }
      };
      const validateArragne = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写行程安排'))
        } else {
          callback();
        }
      };
      const validateXl = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写详情地址'))
        } else {
          callback();
        }
      };
      const validateTv = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写详情地址'))
        } else {
          callback();
        }
      };
      return {
        uploadUrl:base.baseUrl.serviceOne + 'column_tour/saveFile',
        ediUploadUrl:base.baseUrl.serviceOne + 'gift/saveGiftFile',//编辑器插入图片上传接口 和礼物配置一个接口
        value3:false,
        value4:false,
        value5:false,
        begOption:{
          disabledDate : date =>  {
            const d = new Date(this.endTime);
            return date && date.valueOf() > d;
          }
        },
        endOption:{
          disabledDate : date =>  {
            const d = new Date(this.startTime);
            return date && date.valueOf() < d - 24*60*60*1000;
          }
        },
        addOption:{
          disabledDate : date =>  {
            const d = new Date(this.formData.tourStart);
            return date && date.valueOf() < d - 24*60*60*1000;
          }
        },
        addEndOption:{
          disabledDate : date =>  {
            return date && date.valueOf() < Date.now() - 24*60*60*1000;
          }
        },
        reviseOption:{
          disabledDate : date =>  {
            const d = new Date(this.reviseData.tourStart);
            return date && date.valueOf() < d - 24*60*60*1000;
          }
        },
        reviseEndOption:{
          disabledDate : date =>  {
            return date && date.valueOf() < Date.now() - 24*60*60*1000;
          }
        },
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        routeList:[
          {
            value:'3',
            label:'全部'
          },
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
        detailList:[
          {
            value:0,
            label:'模板'
          },
          {
            value:1,
            label:'自定义'
          }
        ],
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
            title:'线路价格（玄乐币）',
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
                              this.value4 = true;
                              if (res.result.filePaths != null && res.result.filePaths !== "" ) {
                                this.detailData.isPhoto = true;
                                this.detailData.detailUploadList = res.result.filePaths.split(',');
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
                              this.detailData.infoType = res.result.infoType;
                              this.detailData.description = res.result.description;
                              this.detailData.tourArrangement = res.result.tourArrangement;
                              if (res.result.infoType === 0) {
                                this.isCustom = false;
                                this.$refs.des.innerHTML = this.detailData.description;
                                this.$refs.arrange.innerHTML = res.result.tourArrangement;
                              } else {
                                this.isMod = false;
                                this.$refs.xl.innerHTML = res.result.xlInfoUrl;
                                this.$refs.tv.innerHTML = res.result.tvInfoUrl;
                              }
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
                              if (res.result.filePaths != null && res.result.filePaths !== "" ) {
                                let arr = res.result.filePaths.split(',');
                                arr.forEach((item,index) => {
                                  this.reviseDefaultList.push({url:item,name:index});
                                });
                              } else {
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
                              this.reviseData.infoType = res.result.infoType;
                              if (res.result.infoType === 0) {
                                this.isReCustom = false;
                                this.reviseData.description = res.result.description;
                                this.reviseData.tourArrangement = res.result.tourArrangement;
                              } else {
                                this.isReMod = false;
                                this.reviseData.xlInfoUrl = res.result.xlInfoUrl;
                                this.reviseData.tvInfoUrl = res.result.tvInfoUrl;
                              }
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
          price:null,
          tourList:'',
          num:null,
          infoType:0,
          xlInfoUrl:'',
          tvInfoUrl:'',
          description:'',
          tourArrangement:'',
          filePath:[]
        },
        ruleValidate:{
          name:[
            {validator:validateName}
          ],
          tourStart:[
            {validator:validateTourStart}
          ],
          tourEnd:[
            {validator:validateEourEnd}
          ],
          price:[
            {validator:validatePrice}
          ],
          tourList:[
            {validator:validateTourList}
          ],
          num:[
            {validator:validateNum}
          ],
          description:[
            {validator:validateDescript}
          ],
          tourArrangement:[
            {validator:validateArragne}
          ],
          xlInfoUrl:[
            {validator:validateXl}
          ],
          tvInfoUrl:[
            {validator:validateTv}
          ]
        },
        loginFail:false,
        addSuccess:false,
        adding:false,
        //详情data
        isMod:true,
        isCustom:true,
        detailData:{
          detailUploadList:[],
          isPhoto:true,
          name:'',
          tourStart:'',
          tourEnd:'',
          price:'',
          tourList:'',
          num:'',
          infoType:1,
          xlInfoUrl:'',
          tvInfoUrl:'',
          description:'',
          tourArrangement:'',
        },
        //修改
        isReMod:true,
        isReCustom:true,
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
          price:null,
          tourList:'',
          num:null,
          infoType:1,
          xlInfoUrl:'',
          tvInfoUrl:'',
          description:'',
          tourArrangement:'',
          filePath:[],
          delFilePath:[]
        },
        reviseAdding:false,
        //景区介绍 行程安排编辑器
        myOptions:{
          placeholder:'请编写景区介绍',
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
        myArrOptions:{
          placeholder:'请编写行程安排',
          theme:'snow',
          modules:{
            toolbar:{
              container:toolbarOptions,
              handlers:{
                image:function (value) {
                  if (value) {
                    document.querySelector('.arrEditorUp input').click();
                  } else {
                    this.quill.format('image',false);
                  }
                }
              }
            }
          }
        },
        //景区介绍 行程安排修改编辑器option
        myReOptions:{
          placeholder:'请编写景区介绍',
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
        myArrReOptions:{
          placeholder:'请编写行程安排',
          theme:'snow',
          modules:{
            toolbar:{
              container:toolbarOptions,
              handlers:{
                image:function (value) {
                  if (value) {
                    document.querySelector('.arrEditorReUp input').click();
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
     this.getRouteList();
     this.uploadList = this.$refs.upload.fileList;
    },
    methods:{
      checkClick:function () {
        this.page = 1;
        this.getRouteList();
      },
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
      addCommunity:function () {
        this.value3 = true;
      },
      exportData:function () {
        window.location.href = base.baseUrl.serviceOne +  'column_tour/exportTourList?createTimeStart='+this.startTime+'&createTimeEnd='+this.endTime+'&name='+this.routeNic+'&status='+this.routeType;
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
      handleBeforeUploadRevise:function (file) {
        const check = this.reviseUploadList.length < 9;
        const len = file.name.length <= 50;
        if (!len) {
          this.$Notice.warning({
            title: '图片名过长！'
          });
          return len;
        }
        if (!check) {
          this.$Notice.warning({
            title: '最多上传9张图片！'
          });
          return check;
        }
      },
      //上传照片方法
      handleBeforeUpload:function (file) {
        //console.log(file);
        const check = this.uploadList.length < 9;
        const len = file.name.length <= 50;
        if (!len) {
          this.$Notice.warning({
            title: '图片名过长！'
          });
          return len;
        }
        if (!check) {
          this.$Notice.warning({
            title: '最多上传9张图片！'
          });
          return check;
        }
      },
      handleSuccess:function (res,file,filelist) {
        //console.log(file);
        if (res.code === 200) {
          file.url = res.result[0].filePath;
        } else {
          this.loginFail = true;
          this.$refs.failTip.innerHTML = res.message;
        }
      },
      handleFormatError:function () {
        this.loginFail = true;
        this.$refs.failTip.innerHTML = '请选择格式为“jpg，jpeg，png，bmp”格式的图片！'
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
        this.$refs.formData.validate((valid) => {
          if (valid) {
            this.uploadList.forEach(item => {
              this.formData.filePath.push(item.url);
            });
            //console.log(this.formData.filePath);
            //console.log(JSON.stringify(this.formData));
            _that.adding = true;
            axios.TourAddRoute(this.formData)
              .then(res => {
                //console.log(res);
                _that.adding= false;
                if (res.code === 200) {
                  //新增成功之后把filePath清空
                  this.formData.filePath = [];
                  this.addSuccess = true;
                  this.$refs.addTip.innerHTML = res.message;
                } else {
                  this.formData.filePath = [];
                  this.loginFail = true;
                  this.$refs.failTip.innerHTML = res.message;
                }
              })
              .catch(error => {
                console.log(error);
                this.formData.filePath = [];
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
        this.page = 1;
        this.pageSize = 10;
        this.startTime = '';
        this.endTime = '';
        this.routeNic = '';
        this.routeType = '';
        this.getRouteList();
      },
      addMore:function () {
       this.clearForm();
       this.addSuccess =false;
       this.page = 1;
       this.pageSize = 10;
       this.startTime = '';
       this.endTime = '';
       this.routeNic = '';
       this.routeType = '';
       this.getRouteList();
      },
      //清空表单
      clearForm:function () {
        //重置图片
        this.$refs.upload.clearFiles();
        this.uploadList = this.$refs.upload.fileList;
        this.formData.filePath = [];
        //重置表单
        this.$refs.formData.resetFields();
        this.formData.description = '';
        this.formData.tourArrangement = '';
        this.formData.xlInfoUrl = '';
        this.formData.tvInfoUrl = '';
        this.formData.infoType = 0
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
        this.detailData.xlInfoUrl = '';
        this.detailData.tvInfoUrl = '';
        this.detailData.infoType = 0;
        this.isMod = true;
        this.isCustom = true;
      },
      //修改路线
      handleReviseSucess:function (res,file,filelist) {
        if (res.code === 200) {
          file.url = res.result[0].filePath;
          this.reviseUploadList = filelist;
        } else {
          this.loginFail = true;
          this.$refs.failTip.innerHTML = res.message;
        }
        //console.log(this.$refs.reviseUpload.fileList);
      },
      handleReviseFormatError:function () {
        this.loginFail = true;
        this.$refs.failTip.innerHTML = '请选择格式为“jpg，jpeg，png，bmp”格式的图片！'
      },
      handleReviseView:function (url) {
        this.reviseVisible = true;
        this.reviseImgUrl = url;
      },
      handleReviseRemove:function (file) {
        const fileList = this.$refs.reviseUpload.fileList;
        this.$refs.reviseUpload.fileList.splice(fileList.indexOf(file), 1);
        this.reviseUploadList = this.$refs.reviseUpload.fileList;
        //将删除的图片路径push进数组保存
        this.reviseData.delFilePath.push(file.url);
      },
      reviseDataStart:function (date) {
        this.reviseData.tourStart = date;
      },
      reviseDataEnd:function (date) {
        this.reviseData.tourEnd = date;
      },
      reviseSub:function () {
        this.reviseData.id = this.reviseId;
        this.reviseData.tourStart = this.$trans.timeTranslate(this.reviseData.tourStart);
        this.reviseData.tourEnd = this.$trans.timeTranslate(this.reviseData.tourEnd);
        this.$refs.reviseData.validate((valid) => {
          if (valid) {
            //如果放在验证之外 验证不过 点一次提交会push一次 如果验证过了 在提交之前push进数组
            this.reviseUploadList.forEach( item => {
              this.reviseData.filePath.push(item.url);
            });
            //console.log(this.reviseData.filePath);
            //console.log(JSON.stringify(this.reviseData));
            this.reviseAdding = true;
            axios.TourAddRoute(this.reviseData)
              .then(res => {
                //console.log(res);
                this.reviseAdding= false;
                if (res.code === 200) {
                  //新增成功之后把pathStr清空
                  this.reviseData.filePath = [];
                  this.reviseData.delFilePath = [];
                  this.value5 = false;
                  this.clearRevise();
                  this.loginFail = true;
                  this.$refs.failTip.innerHTML = '修改成功';
                  this.getRouteList();
                } else {
                  this.reviseData.filePath = [];
                  //this.reviseData.delFilePath = [];
                  this.loginFail = true;
                  this.$refs.failTip.innerHTML = res.message;
                }
              })
              .catch(error => {
                console.log(error);
                this.reviseData.filePath = [];
               // this.reviseData.delFilePath = [];
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
        this.isReMod = true;
        this.isReCustom = true;
        //重置图片
        this.$refs.reviseUpload.clearFiles();
        this.reviseUploadList = this.$refs.reviseUpload.fileList;
        //重置表单
        this.$refs.reviseData.resetFields();
        this.reviseData.filePath = [];
        this.reviseData.delFilePath = [];
        this.reviseDefaultList = [];
        this.reviseImgUrl = '';
        this.reviseId = '';
        this.reviseData.description = '';
        this.reviseData.tourArrangement = '';
        this.reviseData.xlInfoUrl = '';
        this.reviseData.tvInfoUrl = '';
        this.reviseData.infoType = 0
      },
      //景区介绍编辑器上传图片
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
      //行程安排编辑器上传图片
      arrHandleEdiSuccess:function (res,file,fileList) {
        //编辑器实例
        let quill = this.$refs.arrangeEditor.quill;
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
      //景区介绍修改插入图片
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
      //行程安排修改插入图片
      reArrHandleEdiSuccess:function (res,file,fileList) {
        //编辑器实例
        let quill = this.$refs.arrangeReEditor.quill;
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
      infoTypeChange:function (value) {
        if (value === 0) {
          this.isReMod = true;
          this.isReCustom = false;
          this.reviseData.xlInfoUrl = '';
          this.reviseData.tvInfoUrl = '';
        } else {
          this.isReMod = false;
          this.isReCustom = true;
          this.reviseData.description = '';
          this.reviseData.tvInfoUrl = '';
        }
      }
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
  .divs{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    .p{
      width: 100px;
      height: 90px;
      line-height: 90px;
      text-align: right;
      padding: 10px 12px 10px 0;
    }
    .add-image{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: wrap;
      width: 1050px;
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
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
  .detailSpan{
    padding: 10px 0;
  }
  .detailWidth{
    width: 1000px;
    padding: 10px 12px 10px 0;
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
