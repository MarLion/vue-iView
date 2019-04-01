<template>
  <div class="data-container content-pad">
    <div>
      <div class="data-fun">
        <div class="data-ope">
          <Button type="default" icon="md-add" @click="addCommunity">新增活动</Button>
          <Button type="default" icon="ios-download" @click="exportData">导出EXCEL</Button>
        </div>
        <div class="data-search">
          <span class="ml15">创建日期从：</span>
          <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="dataCheckStart" :options="begOption" class="checkWid"></DatePicker></span>
          <span class="ml15">创建日期止：</span>
          <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="dataCheckEnd" :options="endOption" class="checkWid"></DatePicker></span>
          <span class="ml15">活动名称：</span>
          <span><Input v-model="dataCheckedPra.name" class="checkWid"/></span>
          <span class="ml15">状态类型：</span>
          <span>
            <Select v-model="dataCheckedPra.status" class="checkWid">
              <Option v-for="(item,index) in dataList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
          </span>
          <span class="ml10"><Button icon="ios-search" @click="checkClickData">查询</Button></span>
        </div>
      </div>
      <div class="data-list mt30">
        <Table border :columns="columns" :data="listData" :loading="loading"></Table>
        <Page :total="total" :current="dataCheckedPra.pageNum" v-if="total>10" show-elevator show-total @on-change="dataPageChange" class="mt30"/>
      </div>
    </div>
    <!--新增-->
    <Drawer
      title="发布相亲活动"
      v-model="value3"
      width="1200"
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
          <div class="divs">
            <p class="p">活动封面：</p>
            <div class="add-image">
              <div class="demo-upload-list mt10" v-for="item in coverUploadList">
                <template v-if="item.status === 'finished'">
                  <img :src="item.url">
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleCoverView(item.url)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleCoverRemove(item)"></Icon>
                  </div>
                </template>
                <template v-else>
                  <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
              </div>
              <Upload :action='coverUploadUrl'
                      ref="coverUpload"
                      :show-upload-list="false"
                      :on-success="handleCoverSuccess"
                      :format="['jpg','jpeg','png','bmp']"
                      :on-format-error="handleFormatError"
                      :before-upload="handleCoverBeforeUpload"
                      multiple
                      type="drag"
                      style="display: inline-block;width:100px;margin-top: 10px;">
                <div style="width: 100px;height:100px;line-height: 100px;">
                  <Icon type="ios-camera" size="40"></Icon>
                </div>
              </Upload>
              <Modal title="查看封面" v-model="coverVisible">
                <img :src= 'coverImgUrl' style="width: 100%">
                <div slot="footer"></div>
              </Modal>
            </div>
          </div>
          <div class="divs mt30">
            <p class="p">上传照片：</p>
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
                      ref="dataUpload"
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
              <Modal title="查看照片" v-model="visible">
                <img :src='dataImgUrl' style="width: 100%">
                <div slot="footer"></div>
              </Modal>
            </div>
          </div>
          <Form :model="dataFormData" ref="dataForm" :rules="ruleValidate" :label-width="100" style="width: 100%;margin-top: 20px;">
            <FormItem label="活动名称：" prop="name" style="width: 500px;">
              <Input type="text" v-model="dataFormData.name"></Input>
            </FormItem>
            <FormItem label="活动费用：" style="width: 500px;">
              <InputNumber  v-model="dataFormData.price" :max="10000000" :min="0" @on-change="feeChanged" @on-blur="feeBlur" style="width: 40%;"></InputNumber>
              <Checkbox v-model="isOpen" @on-change="freeChange" class="ml15">免费</Checkbox>
              <Checkbox v-model="dataFormData.isShowPay" true-value="1" false-value="0" class="ml15">是否显示支付按钮</Checkbox>
            </FormItem>
            <FormItem label="开始时间：" style="width: 500px;">
              <Row>
                <Col span="10">
                  <FormItem prop="activityStart">
                    <DatePicker type="date" format="yyyy-MM-dd" v-model="dataFormData.activityStart" @on-change="dataBeginTime" placeholder="选择开始日期" style="width: 150px;"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="10">
                  <FormItem prop="activityClockStart">
                    <TimePicker type="time" format="HH:mm" v-model="dataFormData.activityStartHms" @on-change="dataBeginClock" placeholder=选择开始时间 style="width: 150px;"></TimePicker>
                  </FormItem>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="结束时间：" style="width: 500px;">
              <Row>
                <Col span="10">
                  <FormItem prop="activityEnd">
                    <DatePicker type="date" format="yyyy-MM-dd" v-model="dataFormData.activityEnd" @on-change="dataEndTime" :options="addOption" placeholder="选择结束日期" style="width: 150px;"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="10">
                  <FormItem prop="activityClockEnd">
                    <TimePicker type="time" format="HH:mm" v-model="dataFormData.activityEndHms" @on-change="dataEndClock"  placeholder="选择结束时间" style="width: 150px;"></TimePicker>
                  </FormItem>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="活动地址：" prop="address" style="width: 500px;">
              <Input type="text" :maxlength="80" v-model="dataFormData.address"></Input>
            </FormItem>
            <FormItem label="允许人数：" prop="num" style="width: 500px;">
              <InputNumber v-model="dataFormData.num" :max="100000" :min="0" style="width: 100%;"></InputNumber>
            </FormItem>
            <FormItem label="参与方式：" prop="participate" style="width: 500px;">
              <Input type="text" :maxlength="50" v-model="dataFormData.participate"></Input>
            </FormItem>
            <FormItem label="活动介绍：">
              <div class="editor-container">
                <quill-editor
                  ref="myEditor"
                  v-model="dataFormData.description"
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
            <FormItem label="活动安排：">
              <div class="editor-container">
                <quill-editor
                  ref="arrangeEditor"
                  v-model="dataFormData.arrangement"
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
      width="1200"
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
        <div class="divs">
          <p class="p">活动封面：</p>
          <div class="add-image">
            <template v-if="dataDetailData.isCover">
              <div class="demo-upload-list">
                <img :src="dataDetailData.backgroundImage">
              </div>
            </template>
            <template v-else>
              <div class="demo-upload-list">暂无封面</div>
            </template>
          </div>
        </div>
        <div class="divs mt30">
          <p class="p">照&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;片：</p>
          <div class="add-image">
            <template v-if="dataDetailData.isPhoto">
              <div class="demo-upload-list"  v-for="item in dataDetailData.dataDetailUploadList">
                <img :src="item">
              </div>
            </template>
            <template v-else>
              <div class="demo-upload-list">暂无图片</div>
            </template>
          </div>
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
          <p class="detailWidth" ref="des"></p>
        </div>
        <div class="add-detail">
          <p class="p">活动安排：</p>
          <p class="detailWidth" ref="arrange"></p>
        </div>
      </div>
    </Drawer>
    <!--修改-->
    <Drawer
      title="相亲活动修改"
      v-model="dataReviseValue"
      width="1200"
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
        <div class="divs">
          <p class="p">活动封面：</p>
          <div class="add-image">
            <div class="demo-upload-list mt10" v-for="item in coverReUploadList">
              <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleCoverReView(item.url)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="handleCoverReRemove(item)"></Icon>
                </div>
              </template>
              <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
              </template>
            </div>
            <Upload :action='coverUploadUrl'
                    ref="coverReUpload"
                    :show-upload-list="false"
                    :default-file-list="reviseCoverDefaultList"
                    :on-success="handleCoverReSuccess"
                    :format="['jpg','jpeg','png','bmp']"
                    :on-format-error="handleFormatError"
                    :before-upload="handleCoverReBeforeUpload"
                    multiple
                    type="drag"
                    style="display: inline-block;width:100px;margin-top: 10px;">
              <div style="width: 100px;height:100px;line-height: 100px;">
                <Icon type="ios-camera" size="40"></Icon>
              </div>
            </Upload>
            <Modal title="查看封面" v-model="coverReVisible">
              <img :src= 'coverReImgUrl' style="width: 100%">
              <div slot="footer"></div>
            </Modal>
          </div>
        </div>
        <div class="divs mt30">
          <p class="p">上传照片：</p>
          <div class="add-image">
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
                    :format="['jpg','jpeg','png','bmp']"
                    :on-format-error="handleFormatError"
                    :before-upload="handleBeforeUploadRevise"
                    multiple
                    type="drag"
                    style="display: inline-block;width:100px;">
              <div style="width: 100px;height:100px;line-height: 100px;">
                <Icon type="ios-camera" size="40"></Icon>
              </div>
            </Upload>
            <Modal title="查看照片" v-model="dataReviseVisible">
              <img :src='dataReviseImgUrl' style="width: 100%">
              <div slot="footer"></div>
            </Modal>
          </div>
        </div>
        <Form :model="dataReviseData" ref="dataReviseForm" :rules="ruleValidate" :label-width="100" style="width: 100%;margin-top: 20px;">
          <FormItem label="活动名称：" prop="name" style="width: 500px;">
            <Input type="text" v-model="dataReviseData.name"></Input>
          </FormItem>
          <FormItem label="活动费用：" style="width: 500px;">
            <InputNumber v-model="dataReviseData.price" :max="10000000" :min="0" @on-change="reFeeChange" @on-blur="reFeeBluer" style="width: 40%;"></InputNumber>
            <Checkbox v-model="isReviseOpen" @on-change="reFreeChange" class="ml15">免费</Checkbox>
            <Checkbox v-model="dataReviseData.isShowPay" true-value="1" false-value="0" class="ml15">是否显示支付按钮</Checkbox>
          </FormItem>
          <FormItem label="开始时间：" style="width: 500px;">
            <Row>
              <Col span="10">
                <FormItem prop="activityStart">
                  <DatePicker type="date" format="yyyy-MM-dd" v-model="dataReviseData.activityStart"  @on-change="dataReBeg" style="width: 150px;"></DatePicker>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem prop="activityClockStart">
                  <TimePicker type="time" format="HH:mm" v-model="dataReviseData.activityStartHms"  @on-change="clockReBeg" style="width: 150px;"></TimePicker>
                </FormItem>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="结束时间：" style="width: 500px;">
            <Row>
              <Col span="10">
                <FormItem prop="activityEnd">
                  <DatePicker type="date" format="yyyy-MM-dd" v-model="dataReviseData.activityEnd" @on-change="dataReEnd" :options="reviseOption" style="width: 150px;"></DatePicker>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem prop="activityClockEnd">
                  <TimePicker type="time" format="HH:mm" v-model="dataReviseData.activityEndHms" @on-change="clockReEnd" style="width: 150px;"></TimePicker>
                </FormItem>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="活动地址："  prop="address" style="width: 500px;">
            <Input type="text" :maxlength="80" v-model="dataReviseData.address"></Input>
          </FormItem>
          <FormItem label="允许人数：" prop="num" style="width: 500px;">
            <InputNumber v-model="dataReviseData.num" :max="100000" :min="0" style="width: 100%;"></InputNumber>
          </FormItem>
          <FormItem label="参与方式：" prop="participate" style="width: 500px;">
            <Input type="text" :maxlength="50" v-model="dataReviseData.participate"></Input>
          </FormItem>
          <FormItem label="活动介绍：">
            <div class="editor-container">
              <quill-editor
                ref="myReEditor"
                v-model="dataReviseData.description"
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
          <FormItem label="活动安排：">
            <div class="editor-container">
              <quill-editor
                ref="arrangeReEditor"
                v-model="dataReviseData.arrangement"
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
          <FormItem style="width: 200px!important;">
            <Button type="primary" @click="dataReviseClick" :loading="dataReviseLoading">确认修改</Button>
          </FormItem>
        </Form>
      </div>
    </Drawer>
    <!--填写推送消息-->
    <Modal
      v-model="isPropel"
      :loading="propelLoading"
      :mask-closable="false"
      title="推送消息"
      @on-ok="proSub"
      @on-visible-change="isProVisible"
    >
      <Form :model="proFormData" ref="proForm" :rules="ruleValidatePro" :label-width="100" class="mt20">
        <FormItem label="消息内容：" prop="message">
          <Input type="textarea" v-model="proFormData.message"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      title="提示"
      v-model="dataTip"
      :mask-closable = "false"
    >
      <p ref="failTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
    <Modal
      title="提示"
      v-model="dataSuccess"
      :mask-closable = "false"
    >
      <p ref="addTip"></p>
      <div slot="close"></div>
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
    name: "dataPageSystem",
    data () {
      //自定义验证
      const validateName = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写活动名称'));
        } else {
          callback();
        }
      };
      const validateActivityStart = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写开始日期'));
        } else {
          callback();
        }
      };
      const validateActivityClockStart = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写开始时间'));
        } else {
          callback();
        }
      };
      const validateActivityEnd = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写结束日期'));
        } else {
          callback();
        }
      };
      const validateActivityClockEnd = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写结束时间'));
        } else {
          callback();
        }
      };
      const validateAddress = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写活动地址'));
        } else {
          callback();
        }
      };
      const validateNum = (rule,value,callback) => {
        if (value === null) {
          callback(new Error('请填写允许人数'));
        } else {
          callback();
        }
      };
      const validateParticipate = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写参与方式'));
        } else {
          callback();
        }
      };
      const validateDescription = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写活动介绍'));
        } else {
          callback();
        }
      };
      const validateArrangement = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写活动安排'));
        } else {
          callback();
        }
      };
      return {
        coverUploadUrl:base.baseUrl.serviceOne + 'lifeTrend/saveFiles',//封面图上传接口
        uploadUrl:base.baseUrl.serviceOne + 'column_activity/saveFile',//图片上传接口
        ediUploadUrl:base.baseUrl.serviceOne + 'gift/saveGiftFile',//编辑器插入图片上传接口 和礼物配置一个接口
        isPropel:false,
        propelLoading:true,
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
        begOption:{
          disabledDate : date =>  {
            const d = new Date(this.dataCheckedPra.createTimeEnd);
            return date && date.valueOf() > d;
          }
        },
        endOption:{
          disabledDate : date =>  {
            const d = new Date(this.dataCheckedPra.createTimeStart);
            return date && date.valueOf() < d - 24*60*60*1000;
          }
        },
        addOption:{
          disabledDate : date =>  {
            const d = new Date(this.dataFormData.activityStart);
            return date && date.valueOf() < d - 24*60*60*1000;
          }
        },
        reviseOption:{
          disabledDate : date =>  {
            const d = new Date(this.dataReviseData.activityStart);
            return date && date.valueOf() < d - 24*60*60*1000
          }
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
            width:300,
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
                  }, '报名清单'),
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
                        this.proFormData.activityId = params.row.id;
                        //this.proFormData.webUrl = 'http://yys.zhongwei-info.com:8001/blindDateApp/view/tvActiveInfo/h5_matchmaker_tvActiveInfo.html?id='+params.row.id+'&actType=2&articleType=7&fromHome=2';
                        this.proFormData.webUrl = 'http://192.168.1.197:8888/blindDateApp/view/tvActiveInfo/h5_matchmaker_tvActiveInfo.html?id='+params.row.id+'&actType=2&articleType=7&fromHome=2';
                        this.isPropel = true;
                      }
                    }
                  }, '推送'),
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
        coverUploadList:[],
        coverVisible:false,
        coverImgUrl:'',
        dataImgUrl:'',
        visible:false,
        isFree:false,
        isOpen:true,
        dataFormData:{
          creatorId:'123456',
          name:'',
          activityStart:'',
          activityStartHms:'',
          activityEnd:'',
          activityEndHms:'',
          address:'',
          price:0,
          num:null,
          participate:'',
          description:'',
          arrangement:'',
          filePath:[],
          backgroundImage:'',
          isShowPay:'0'
        },
        //详情data
        dataDetailData:{
          isCover:false,
          backgroundImage:'',
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
        coverReVisible:false,
        dataReviseDefault:[],
        dataUploadReviseList:[],
        coverReUploadList:[],
        reviseCoverDefaultList:[],
        reviseImgUrl:'',
        coverReImgUrl:'',
        dataReviseImgUrl:'',
        isReviseOpen:true,
        dataReviseId:'',
        dataReviseData:{
          creatorId:'123456',
          name:'',
          activityStart:'',
          activityStartHms:'',
          activityEnd:'',
          activityEndHms:'',
          address:'',
          price:0,
          num:null,
          participate:'',
          description:'',
          arrangement:'',
          filePath:[],
          delFilePath:[],
          backgroundImage:'',
          delBackgroundImage:'',
          id:'',
          isShowPay:'0'
        },
        proFormData:{
          activityId:'',
          message:'',
          webUrl:''
        },
        ruleValidatePro:{
          message:[
            {required:true,message:'请填写信息内容'}
          ]
        },
        //表单验证
        ruleValidate:{
          name:[
            {validator:validateName}
          ],
          activityStart:[
            {validator:validateActivityStart}
          ],
          activityEnd:[
            {validator:validateActivityEnd}
          ],
          address:[
            {validator:validateAddress}
          ],
          num:[
            {validator:validateNum}
          ],
          participate: [
            {validator:validateParticipate}
            ],
          description:[
            {validator:validateDescription}
          ],
          arrangement:[
            {validator:validateArrangement}
          ],
          activityClockStart:[
            {validator:validateActivityClockStart}
          ],
          activityClockEnd:[
            {validator:validateActivityClockEnd}
          ]
        },
        //活动介绍 活动安排编辑器
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
        myArrOptions:{
          placeholder:'请编写活动安排',
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
        //活动介绍 活动安排修改编辑器option
        myReOptions:{
          placeholder:'请编写活动介绍',
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
          placeholder:'请编写活动安排',
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
      this.getDataList();
      this.uploadList = this.$refs.dataUpload.fileList;
      this.coverUploadList = this.$refs.coverUpload.fileList;
    },
    methods:{
      checkClickData:function () {
        this.dataCheckedPra.pageNum = 1;
        this.getDataList();
      },
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
        window.location.href = base.baseUrl.serviceOne + 'column_activity/exportActivityList?createTimeStart='+this.dataCheckedPra.createTimeStart+'&createTimeEnd='+this.dataCheckedPra.createTimeEnd+'&name='+this.dataCheckedPra.name+'&status='+this.dataCheckedPra.status;
      },
      handleBeforeUploadRevise:function (file) {
        const check = this.dataUploadReviseList.length < 9;
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
      //新增
      handleBeforeUpload:function (file) {
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
      handleSuccess:function (res,file,fileList) {
        if (res.code === 200) {
          file.url = res.result[0].filePath;
        } else {
          this.dataTip = true;
          this.$refs.failTip.innerHTML = res.message;
        }
      },
      handleFormatError:function () {
        this.dataTip = true;
        this.$refs.failTip.innerHTML = '请选择格式为“jpg，jpeg，png，bmp”格式的图片！'
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
      dataBeginClock:function (time) {
        this.dataFormData.activityStartHms = time;
      },
      dataEndTime:function (date) {
        this.dataFormData.activityEnd = date;
      },
      dataEndClock:function (time) {
        this.dataFormData.activitEndHms = time;
      },
      dataSubClick:function () {
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            this.uploadList.forEach(item => {
              this.dataFormData.filePath.push(item.url);
            });
            this.dataSubLoading = true;
            axios.BlindDateAdd(this.dataFormData)
              .then(res => {
                //console.log(res);
                this.dataSubLoading = false;
                if (res.code === 200) {
                  this.dataFormData.filePath = [];
                  this.dataSuccess = true;
                  this.$refs.addTip.innerHTML = res.message;
                } else {
                  this.dataTip = true;
                  this.dataFormData.filePath = [];
                  this.$refs.failTip.innerHTML = res.message;
                }
              })
              .catch(error => {
                console.log(error);
                this.dataFormData.filePath = [];
                this.dataSubLoading = false;
                this.dataTip = true;
                this.$refs.failTip.innerHTML = '上传出错！'
              })
          }
        });
      },
      feeChanged:function () {
        this.isOpen = this.dataFormData.price == null;
      },
      freeChange:function (res) {
        if (res) {
          this.dataFormData.price = 0;
        } else {
          this.dataFormData.price = null
        }
      },
      feeBlur:function () {
        if (this.dataFormData.price == null) {
          this.dataFormData.price = 0;
          this.isOpen = true;
        }
      },
      //详情查询
      getDataActivityDetaik:function (id) {
        axios.BlindDateDetail({id:id})
          .then(res => {
            //console.log(res);
            if (res.code === 200) {
              if (res.result.backgroundImage != null && res.result.backgroundImage !== "" ) {
                this.dataDetailData.isCover = true;
                this.dataDetailData.backgroundImage = res.result.backgroundImage;
              } else {
                this.dataDetailData.backgroundImage = '';
                this.dataDetailData.isCover = false;
              }
              if (res.result.filePaths != null && res.result.filePaths !== ""){
                this.dataDetailData.isPhoto = true;
                this.dataDetailData.dataDetailUploadList = res.result.filePaths.split(',');
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
              this.$refs.des.innerHTML = this.dataDetailData.ins;
              this.$refs.arrange.innerHTML = this.dataDetailData.arrange;
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
            console.log(res);
            if (res.code === 200) {
              if (res.result.backgroundImage != null && res.result.backgroundImage !== "" ) {
                this.reviseCoverDefaultList.push({url:res.result.backgroundImage});
              } else {
                this.reviseCoverDefaultList = [];
              }
              this.$refs.coverReUpload.fileList = this.reviseCoverDefaultList;
              this.coverReUploadList = this.$refs.coverReUpload.fileList;
              if (res.result.filePaths != null && res.result.filePaths !== "") {
                let arr = res.result.filePaths.split(',');
                arr.forEach((item,index) => {
                  this.dataReviseDefault.push({url:item,name:index});
                });
              } else {
                this.dataReviseDefault = [];
              }
              this.$refs.dataReviseUpload.fileList = this.dataReviseDefault;
              this.dataUploadReviseList = this.$refs.dataReviseUpload.fileList;
              this.dataReviseData.name = res.result.name;
              this.dataReviseData.price = res.result.price;
              this.dataReviseData.isShowPay = res.result.isShowPay.toString();
              this.dataReviseData.activityStart = res.result.activityStart.split(' ')[0];
              this.dataReviseData.activityStartHms = res.result.activityStart.split(' ')[1];
              this.dataReviseData.activityEnd = res.result.activityEnd.split(' ')[0];
              this.dataReviseData.activityEndHms = res.result.activityEnd.split(' ')[1];
              this.dataReviseData.address = res.result.address;
              this.dataReviseData.num = res.result.num;
              this.dataReviseData.participate = res.result.participate;
              this.dataReviseData.description = res.result.description;
              this.dataReviseData.arrangement = res.result.arrangement;
              this.dataReviseId = id;
              this.isReviseOpen = res.result.price === 0;
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
        const fileList = this.$refs.dataReviseUpload.fileList;
        this.$refs.dataReviseUpload.fileList.splice(fileList.indexOf(file), 1);
        this.dataUploadReviseList = this.$refs.dataReviseUpload.fileList;
        this.dataReviseData.delFilePath.push(file.url);
      },
      handleReviseSuccess:function (res,file,fileList) {
        if (res.code === 200) {
          file.url = res.result[0].filePath;
          this.dataUploadReviseList = fileList;
        } else {
          this.dataTip = true;
          this.$refs.failTip.innerHTML = res.message;
        }
      },
      dataReviseClick:function () {
        this.dataReviseData.id = this.dataReviseId;
        this.dataReviseData.activityStart = this.$trans.timeTranslate(this.dataReviseData.activityStart);
        this.dataReviseData.activityEnd = this.$trans.timeTranslate(this.dataReviseData.activityEnd);
        this.$refs.dataReviseForm.validate(valid => {
          if (valid) {
            this.coverReUploadList.forEach( item => {
              this.dataReviseData.backgroundImage = item.url;
            });
            this.dataUploadReviseList.forEach(item => {
              this.dataReviseData.filePath .push(item.url);
            });
            this.dataReviseLoading = true;
            axios.BlindDateRevise(this.dataReviseData)
              .then(res => {
                this.dataReviseLoading = false;
                if (res.code === 200) {
                  //新增成功之后把pathStr清空
                  this.dataReviseData.filePath = [];
                  this.dataReviseData.delFilePath = [];
                  this.dataReviseValue = false;
                  this.clearDataRevise();
                  this.dataTip = true;
                  this.$refs.failTip.innerHTML = '修改成功';
                  this.getDataList();
                } else {
                  this.dataReviseData.filePath = [];
                  //this.dataReviseData.delFilePath = [];
                  this.dataTip = true;
                  this.$refs.failTip.innerHTML = res.message;
                }
              })
              .catch(error => {
                console.log(error);
                this.dataReviseData.filePath = [];
                //this.dataReviseData.delFilePath = [];
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
      clockReBeg:function (time) {
        this.dataReviseData.activityStartHms = time;
      },
      dataReEnd:function (date) {
        this.dataReviseData.activityEnd = date;
      },
      clockReEnd:function (time) {
        this.dataReviseData.activityEndHms = time;
      },
      reFreeChange:function (res) {
        if (res) {
          this.dataReviseData.price = 0;
        } else {
          this.dataReviseData.price = null;
        }
      },
      reFeeChange:function () {
        this.isReviseOpen = this.dataReviseData.price == null;
      },
      reFeeBluer:function () {
        if (this.dataReviseData.price == null) {
          this.dataReviseData.price = 0;
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
        this.dataCheckedPra.createTimeStart = '';
        this.dataCheckedPra.createTimeEnd = '';
        this.dataCheckedPra.name = '';
        this.dataCheckedPra.status = '';
        this.dataCheckedPra.pageNum = 1;
        this.dataCheckedPra.pageSize = 10;
        this.getDataList();
      },
      addDataMore:function () {
        this.clearDataDa();
        this.dataSuccess = false;
        this.dataCheckedPra.createTimeStart = '';
        this.dataCheckedPra.createTimeEnd = '';
        this.dataCheckedPra.name = '';
        this.dataCheckedPra.status = '';
        this.dataCheckedPra.pageNum = 1;
        this.dataCheckedPra.pageSize = 10;
        this.getDataList();
      },
      //重置表单
      clearDataDa:function () {
        this.dataFormData.filePath = [];
        this.$refs.dataUpload.clearFiles();
        this.uploadList = this.$refs.dataUpload.fileList;
        this.$refs.coverUpload.clearFiles();
        this.coverUploadList = this.$refs.coverUpload.fileList;
        this.dataFormData.backgroundImage = '';
        this.$refs.dataForm.resetFields();
        this.dataFormData.price = 0;
        this.isOpen = true;
        this.dataFormData.activityStartHms = '';
        this.dataFormData.activityEndHms = '';
        this.dataFormData.description = '';
        this.dataFormData.arrangement = '';
        this.dataFormData.isShowPay = '0';
      },
      clearDataDetail:function () {
        this.dataDetailData.isCover= true;
        this.dataDetailData.backgroundImage = '';
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
        this.$refs.coverReUpload.clearFiles();
        this.coverReUploadList = this.$refs.coverReUpload.fileList;
        //清空表单
        this.$refs.dataReviseForm.resetFields();
        this.dataReviseData.price = null;
        this.isReviseOpen = true;
        this.dataReviseDefault = [];
        this.reviseCoverDefaultList = [];
        this.coverReImgUrl = '';
        this.dataReviseImgUrl = '';
        this.dataReviseId = '';
        this.dataReviseData.filePath = [];
        this.dataReviseData.delFilePath = [];
        this.dataReviseData.description = '';
        this.dataReviseData.arrangement = '';
        this.dataReviseData.isShowPay = '0';
      },
      //封面专区
      //新增
      handleCoverView:function (url) {
        this.coverVisible = true;
        this.coverImgUrl = url;
      },
      handleCoverRemove:function (file) {
        //删除之后 把封面图字段清空
        axios.BlindDataCoverDelete({backgroundImage:file.url})
          .then(res => {
            const fileList = this.$refs.coverUpload.fileList;
            this.$refs.coverUpload.fileList.splice(fileList.indexOf(file), 1);
            this.dataFormData.backgroundImage =  '';
          })
          .catch(error => {
            console.log(error);
            this.loginFail = true;
            this.$refs.failTip.innerHTML = '删除失败！'
          });
      },
      handleCoverSuccess:function (res,file,fileList) {
        //console.log(res);
        if (res.code === 200) {
          file.url = res.result.filePath;
          //只能上传一张封面 可以在这里对字段赋值
          this.dataFormData.backgroundImage =  res.result.filePath;
        } else {
          this.loginFail = true;
          this.$refs.failTip.innerHTML = res.message;
        }
      },
      handleCoverBeforeUpload:function (file) {
        const check = this.coverUploadList.length < 1;
        const len = file.name.length <= 50;
        if (!len) {
          this.$Notice.warning({
            title: '图片名过长！'
          });
          return len;
        }
        if (!check) {
          this.$Notice.warning({
            title: '只能上传1张封面！'
          });
          return check;
        }
      },
      //修改
      handleCoverReView:function (url) {
        this.coverReVisible = true;
        this.coverReImgUrl = url;
      },
      handleCoverReRemove:function (file) {
        const fileList = this.$refs.coverReUpload.fileList;
        this.$refs.coverReUpload.fileList.splice(fileList.indexOf(file), 1);
        this.coverReUploadList = this.$refs.coverReUpload.fileList;
        this.dataReviseData.backgroundImage = '';
        this.dataReviseData.delBackgroundImage = file.url;
      },
      handleCoverReSuccess:function (res,file,fileList) {
        console.log(res);
        if (res.code === 200) {
          file.url = res.result.filePath;
          this.coverReUploadList = fileList;
        } else {
          this.loginFail = true;
          this.$refs.failTip.innerHTML = res.message;
        }
      },
      handleCoverReBeforeUpload:function (file) {
        const check = this.coverReUploadList.length < 1;
        const len = file.name.length <= 50;
        if (!len) {
          this.$Notice.warning({
            title: '图片名过长！'
          });
          return len;
        }
        if (!check) {
          this.$Notice.warning({
            title: '只能上传1张封面！'
          });
          return check;
        }
      },
      //富文本编辑器
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
      //活动介绍修改插入图片
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
      //活动安排修改插入图片
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
      proSub:function () {
        this.$refs.proForm.validate(valid => {
          if (valid) {
            axios.PropelTvActivity(this.proFormData)
              .then(res => {
                //console.log(res);
                if (res.code === '0') {
                  this.isPropel = false;
                  this.dataTip = true;
                  this.$refs.failTip.innerHTML = '推送成功！';
                } else {
                  this.changModal();
                  this.dataTip = true;
                  this.$refs.failTip.innerHTML = '推送失败！';
                }
              })
              .catch(error => {
                console.log(error);
                this.changModal();
                this.dataTip = true;
                this.$refs.failTip.innerHTML = '推送失败！';
              })
          } else {
            this.changModal();
          }
        });
      },
      isProVisible:function (value) {
        if (!value) {
          this.proFormData.activityId = '';
          this.proFormData.webUrl = '';
          this.$refs.proForm.resetFields();
        }
      },
      changModal:function () {
        this.propelLoading = false;
        this.$nextTick(() => {
          this.propelLoading = true;
        });
      },
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
      width: 550px;
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
    width: 500px;
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
