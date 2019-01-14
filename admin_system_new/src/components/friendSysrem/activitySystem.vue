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
          <span><DatePicker type="date" class="checkWid"></DatePicker></span>
          <span class="ml15">创建日期止：</span>
          <span><DatePicker type="date" class="checkWid"></DatePicker></span>
          <span class="ml15">活动名称：</span>
          <span><Input class="checkWid"/></span>
          <span class="ml15">状态类型：</span>
          <span>
        <Select v-model="actType" class="checkWid">
          <Option v-for="(item,index) in actList" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
      </span>
          <span class="ml10"><Button icon="ios-search" @click="getActivityList">查询</Button></span>
        </div>
      </div>
      <div class="activity-list mt30">
        <Table border :columns="columns" :data="listData" :loading="loading"></Table>
        <Page :total="total" v-if="total>10" show-elevator show-total @on-change="activityPageChange" class="mt30"/>
      </div>
    </div>
    <!--新增-->
    <Drawer
      title="发布活动"
      v-model="value3"
      width="720"
      :mask-closable="false"
      :styles="styles"
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
            <Upload action=""
                    ref="upload"
                    :show-upload-list="false"
                    :default-file-list="defaultList"
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
              <img :src="actBigUrl " style="width: 100%">
            </modal>
          </div>
          <Form :model="formData" ref="activityAdd" :rules="ruleValidate" :label-width="100" style="width: 500px;margin-top: 20px;">
            <FormItem label="活动名称" prop="name">
              <Input type="text" v-model="formData.name"/>
            </FormItem>
            <FormItem label="活动口号" prop="slogan">
              <Input type="text" v-model="formData.slogan"/>
            </FormItem>
            <FormItem label="开始时间" prop="beginTime">
              <DatePicker  type="datetime" format="yyyy-MM-dd HH:mm" v-model="formData.beginTime" @on-change="activityBeginTime" style="width: 100%;"></DatePicker >
            </FormItem>
            <FormItem label="结束时间" prop="endTime">
              <DatePicker  type="datetime" format="yyyy-MM-dd HH:mm" v-model="formData.endTime" @on-change="activityEndTime" style="width: 100%;"></DatePicker >
            </FormItem>
            <FormItem label="活动地址" prop="location">
              <Input type="text" v-model="formData.location"/>
            </FormItem>
            <FormItem label="允许人数" prop="member">
              <Input type="text" v-model="formData.member"/>
            </FormItem>
            <FormItem label="活动内容" prop="ins">
              <Input type="textarea" v-model="formData.ins"/>
            </FormItem>
            <FormItem style="width: 200px!important;">
              <Checkbox v-model="formData.isOpen">开放报名</Checkbox>
            </FormItem>
            <FormItem style="width: 200px!important;">
              <Button type="primary">发布活动</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Drawer>
    <!--详情-->
    <Drawer
      title="活动详情"
      v-model="activityDetailValue"
      width="720"
      :mask-closable="false"
      :styles="styles"
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
        <p class="detailSpan">{{activityDetailData.beginTime}}</p>
      </div>
      <div class="add-detail">
        <p class="p">结束时间：</p>
        <p class="detailSpan">{{activityDetailData.endTime}}</p>
      </div>
      <div class="add-detail">
        <p class="p">活动地址：</p>
        <p class="detailSpan">{{activityDetailData.location}}</p>
      </div>
      <div class="add-detail">
        <p class="p">允许人数：</p>
        <p class="detailSpan">{{activityDetailData.member}}</p>
      </div>
      <div class="add-detail">
        <p class="p">活动内容：</p>
        <p class="detailSpan detailWidth">{{activityDetailData.ins}}</p>
      </div>
    </Drawer>
    <!--修改-->
    <Drawer
      title="活动修改"
      v-model="activityRevisValue"
      width="720"
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
          <p class="p">上传照片</p>
          <div class="demo-upload-list" v-for="item in uploadList">
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
          <Upload action=""
                  ref="upload"
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
          </modal>
        </div>
        <Form :model="activityReviseFormData" ref="activityRevise" :rules="ruleValidate" :label-width="100" style="width: 500px;margin-top: 20px;">
          <FormItem label="活动名称" prop="name">
            <Input type="text" v-model="activityReviseFormData.name"/>
          </FormItem>
          <FormItem label="活动口号" prop="slogan">
            <Input type="text" v-model="activityReviseFormData.slogan"/>
          </FormItem>
          <FormItem label="开始时间" prop="beginTime">
            <DatePicker type="datetime" v-model="activityReviseFormData.beginTime" @on-change="activityReviseBeg" style="width: 100%;"></DatePicker>
          </FormItem>
          <FormItem label="结束时间" prop="endTime">
            <DatePicker type="datetime" v-model="activityReviseFormData.endTime" @on-change="activityReviseEnd" style="width: 100%;"></DatePicker>
          </FormItem>
          <FormItem label="活动地址" prop="location">
            <Input type="text" v-model="activityReviseFormData.location"/>
          </FormItem>
          <FormItem label="允许人数" prop="member">
            <Input type="text" v-model="activityReviseFormData.member"/>
          </FormItem>
          <FormItem label="活动内容" prop="ins">
            <Input type="textarea" v-model="activityReviseFormData.ins"/>
          </FormItem>
          <FormItem style="width: 200px!important;">
            <Checkbox v-model="activityReviseFormData.isOpen">开放报名</Checkbox>
          </FormItem>
          <FormItem style="width: 200px!important;">
            <Button type="primary">确定修改</Button>
          </FormItem>
        </Form>
      </div>
    </Drawer>
    <Modal
      title="提示"
      v-model="activityTip"
      :mask-closable = "false"
    >
      <p ref="communityTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
    <Modal
      title="提示"
      v-model="actAddSuccess"
      :mask-closable = "false"
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
        value3:false,
        activityDetailValue:false,
        activityRevisValue:false,
        activityTip:false,
        actAddSuccess:false,
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        showAdd:false,
        loading:false,
        total:100,
        actType:'',
        actList:[
          {
            value:'0',
            label:'正常'
          },
          {
            value:'1',
            label:'已结束'
          },
          {
            value:'2',
            label:'已取消'
          }
        ],
        columns:[
          {
            title:'活动编号',
            key:'name',
            align:'center',
          },
          {
            title:'活动名称',
            key:'actName',
            align:'center',
          },
          {
            title:'创建人',
            key:'builder',
            align:'center',
          },
          {
            title:'状态',
            key:'state',
            align:'center',
          },
          {
            title:'创建日期',
            key:'date',
            align:'center',
          },
          {
            title:'报名人数',
            key:'member',
            align:'center',
            width:100
          },
          {
            title:'操作选项',
            key:'action',
            align:'center',
            width:260,
            render:(h,params) => {
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
                      this.$router.push({path:'/activityUserList'})
                    }
                  }
                }, '报名清单')
              ])
            }
          }
        ],
        listData:[
          {
            id:'0001',
            name:'一起来奔跑',
            actName:'周末约会',
            builder:'张三',
            state:'正常',
            date:'2018-11-22',
            member:'30',
            slogan:'生命在于运动',
            ins:'武汉跑步圈，跑出自信'
          }
        ],
        //发布活动data
        defaultList:[
          {
            'name': 'a42bdcc1178e62b4694c830f028db5c0',
            'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
          },
          {
            'name': 'bc7521e033abdd1e92222d733590f104',
            'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
          }
        ],
        //新增数据
        uploadList:[],
        actBigUrl:'',
        visible:false,
        formData:{
          name:'',
          slogan:'',
          beginTime:'',
          endTime:'',
          location:'',
          member:'',
          ins:'',
          isOpen:true
        },
        //详情数据
        activityDetailData:{
          isPhoto:false,
          detailPhotoList:[],
          name:'',
          slogan:'',
          beginTime:'',
          endTime:'',
          location:'',
          member:'',
          ins:'',
        },
        //修改数据
        activityReviseVisible:false,
        activityReviseUploadList:[],
        activityReviseDefaultList:[],
        activityRevisePath:'',
        activityReviseImgUrl:'',
        activityReviseId:'',
        activityReviseFormData:{
          creatorId:'123456',
          name:'',
          slogan:'',
          beginTime:'',
          endTime:'',
          location:'',
          member:'',
          ins:'',
          isOpen:true
        },
        //表单验证
        ruleValidate:{
          name:[
            {validator:validateName}
            ],
          slogan:[
            {validator:validateSlogan}
          ],
          beginTime:[
            {validator:validateBeginTime}
          ],
          endTime:[
            {validator:validateEndTime}
          ],
          location:[
            {validator:validateLocation}
          ],
          member:[
            {validator:validateMember}
          ],
          ins:[
            {validator:validateIns}
          ]
        }
      }
    },
    mounted () {
      this.getActivityList();
      this.uploadList = this.$refs.upload.fileList;
    },
    methods: {
      getActivityList:function () {

      },
      exportData:function () {

      },
      activityAdd :function () {
        this.value3 = true;
      },
      activityPageChange:function () {

      },
      activityBeginTime:function (date) {
        this.formData.beginTime =  date;
      },
      activityEndTime:function (date) {
        this.formData.endTime = date;
      },
      //上传头像方法  新增方法
      handleSuccess:function () {

      },
      handleFormatError:function () {

      },
      handleView:function (url) {
        this.actBigUrl = url;
        this.activityReviseVisible = true;
      },
      handleRemove:function () {

      },
      //修改方法
      activityHandleSuccess:function () {

      },
      activityHandleView:function (url) {
        this.activityReviseImgUrl = url;
        this.visible = true;
      },
      activityHandleRemove:function () {

      },
      activityReviseBeg:function (date) {
        this.activityReviseFormData.beginTime = date;
      },
      activityReviseEnd:function (date) {
        this.activityReviseFormData.endTime = date;
      }
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
