<template>
  <div class="message-container">
    <div class="message-fun">
      <div class="message-operate">
        <Button type="default" icon="md-add" @click="addUser">新增用户</Button>
        <Button type="default" icon="ios-download">导出EXCEL</Button>
        <Button type="default" icon="md-add" @click="addLable">新增标签</Button>
        <Button type="default" icon="md-trash" @click="keepSuspend">批量封号</Button>
        <Button type="default" icon="md-close-circle" @click="keepOut">批量禁入</Button>
      </div>
      <div class="message-query">
        <span>用户姓名：</span><span><Input clearable style="width:120px"/></span>
        <span class="ml15">用户ID：</span><span><Input clearable style="width:120px"/></span>
        <span class="ml15">玄乐账号：</span><span><Input clearable style="width:120px"/></span>
        <span class="ml15">签约日期从：</span><span><DatePicker type="date" style="width:120px"></DatePicker></span>
        <span class="ml15">签约日期止：</span><span><DatePicker type="date" style="width: 120px"></DatePicker></span>
        <span class="ml10"><Button icon="ios-search">查询</Button></span>
      </div>
    </div>
    <div class="message-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading" @on-selection-change="selectChange"></Table>
      <Page :total="total" v-if="total>10" show-elevator show-total class="mt30"/>
    </div>
    <Modal
      v-model="isAddLabel"
      title="新增标签"
      :loading="true"
      @on-ok="clickOk"
    >
      <label>标签内容<Input type="textarea" v-model="newLable" class="mt10"/></label>
    </Modal>
    <Modal
      v-model="isSuspend"
      title="批量封号"
      :loading="true"
      @on-ok="clickOk"
    >
      确认对批量选中的用户进行封号处理吗？
    </Modal>
    <Modal
      v-model="isOut"
      title="批量禁入"
      :loading="true"
      @on-ok="clickOk"
    >
      确认对批量选中的用户进行禁入处理吗？
    </Modal>
    <Modal
      v-model="warning"
      title="警告"
    >
      请至少选择一个账号
      <div slot="footer">
        <Button type="default" @click="del">确定</Button>
      </div>
    </Modal>
    <Drawer
      v-model="isAddUser"
      title="用户资料详情"
      width="980"
      :mask-closable="false"
      :styles="styles"
    >
      <div class="drawer-up">
        <Upload action=""
                :on-success="handlerUpSuccess"
        >
          <Button type="info" icon="ios-cloud-upload" >批量上传</Button>
        </Upload>
        <Button type="default" icon="ios-cloud-download" style="height: 33px;margin-left: 15px;">下载模板</Button>
        <p class="drawer-tip">批量上传前，请先下载模板，严格按照模板要求填写！为了便于查看上传记录，建议区分文件上传名。</p>
      </div>
      <div class="add-image mt20">
        <p class="p">上传照片</p>
        <div class="demo-upload-list" v-for="item in uploadList">
          <template v-if="item.status === 'finished'">
            <img :src="item.url">
            <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
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
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                multiple
                type="drag"
                style="display: inline-block;width:100px;">
          <div style="width: 100px;height:100px;line-height: 100px;">
            <Icon type="ios-camera" size="40"></Icon>
          </div>
        </Upload>
        <modal title="查看照片" v-model="visible">
          <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" style="width: 100%">
        </modal>
      </div>
      <Form :model="formData" :label-width="100" style="width: 500px;margin-top: 20px;">
        <FormItem label="圈子名称">
          <Input type="text" v-model="formData.name"></Input>
        </FormItem>
        <FormItem label="贵圈口号">
          <Input type="text" v-model="formData.slogan"></Input>
        </FormItem>
        <FormItem label="贵圈标签">
          <Input type="text" v-model="formData.label"></Input>
        </FormItem>
        <FormItem label="贵圈坐标">
          <Input type="text" v-model="formData.location"></Input>
        </FormItem>
        <FormItem label="允许人数">
          <Input type="text" v-model="formData.member"></Input>
        </FormItem>
        <FormItem label="贵圈介绍">
          <Input type="textarea" v-model="formData.ins"></Input>
        </FormItem>
        <FormItem style="width: 200px!important;">
          <Checkbox v-model="formData.isOpen">开放报名</Checkbox>
        </FormItem>
        <FormItem style="width: 200px!important;">
          <Button type="primary">发布圈子</Button>
        </FormItem>
      </Form>
    </Drawer>
  </div>
</template>

<script>
  export default {
    name: "userMessage",
    data () {
      return {
        isAddUser:false,
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        isAddLabel:false,
        isSuspend:false,
        isOut:false,
        warning:false,
        newLable:'',
        total:100,
        loading:false,
        columns:[
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title:'玄乐账号',
            key:'account',
            align:'center',
          },
          {
            title:'用户ID',
            key:'id',
            align:'center',
          },
          {
            title:'姓名',
            key:'name',
            align:'center',
          },
          {
            title:'关联红娘ID',
            key:'hnId',
            align:'center',
          },
          {
            title:'红娘姓名',
            key:'hnName',
            align:'center',
          },
          {
            title:'签约状态',
            key:'state',
            align:'center',
          },
          {
            title:'签约日期',
            key:'begTime',
            align:'center',
          },
          {
            title:'签约到期',
            key:'endTime',
            align:'center',
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
                      console.log(params.index);
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
                      // this.remove(params.index)
                    }
                  }
                }, '设置标签'),
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
                }, '封号'),
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                    }
                  }
                }, '禁入')
              ])
            }
          }
        ],
        listData:[
          {
            account:'xxxxxxxx',
            id:'2310990',
            name:'朱晨美',
            hnId:'未填写',
            hnName:'未填写',
            state:'未签约',
            begTime:'',
            endTime:''
          },
          {
            account:'xxxxxxxx',
            id:'2310990',
            name:'朱晨美',
            hnId:'未填写',
            hnName:'未填写',
            state:'未签约',
            begTime:'',
            endTime:''
          }
        ],
        selected:[],
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
        uploadList:[],
        imgName:'',
        visible:false,
        formData:{
          name:'',
          slogan:'',
          label:'',
          location:'',
          member:'',
          ins:'',
          isOpen:true
        }
      }
    },
    mounted () {
      // if (sessionStorage.getItem('isComAdd') != null) {
      //   this.isShowAdd = JSON.parse(sessionStorage.getItem('isComAdd'));
      // }
      this.uploadList = this.$refs.upload.fileList;
    },
    methods:{
      addLable:function () {
        this.isAddTLable = true;
      },
      clickOk :function () {

      },
      keepSuspend :function () {
        if (this.selected.length === 0) {
          this.warning = true
        } else {
          this.isSuspend = true;
        }
      },
      keepOut :function () {
        if (this.selected.length === 0) {
          this.warning = true;
        } else {
          this.isOut = true;
        }
      },
      selectChange :function (section) {
        // console.log(section);
        this.selected = section;
      },
      del :function () {
        this.warning = false;
      },
      addUser :function () {
        this.isAddUser = true;
      },
      handlerUpSuccess:function (result) {
        console.log(result);
      },
      //上传照片方法
      handleSuccess:function () {

      },
      handleFormatError:function () {

      },
      handleMaxSize:function () {

      },
      handleBeforeUpload:function () {

      },
      handleView:function (name) {
        this.imgName = name;
        this.visible = true;
      },
      handleRemove:function () {

      },
    }
  }
</script>

<style lang="scss" scoped>
.message-fun{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .message-query{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    line-height: 33px;
    padding-right: 20px;
  }
}
  .message-list{
    padding-right: 20px;
  }
  .drawer-up{
    display: flex;
    flex-direction: row;
    justify-content:flex-start;
    padding-left: 100px;
    .drawer-tip{
      height: 33px;
      line-height: 33px;
      margin-left: 15px;
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
