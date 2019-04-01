<template>
  <div class="start-container content-pad">
    <div class="configure-fun">
      <Button type="default" icon="md-add" @click="addStart">添加启动图</Button>
    </div>
    <div class="community-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading"></Table>
      <Page :total="total" v-if="total>10" show-elevator show-total @on-change="startPageChange" class="mt30"/>
    </div>
    <Modal title="查看大图" v-model="tabBig">
      <img :src="tabUrl" style="width: 100%">
      <div slot="footer"></div>
    </Modal>
    <!--新增-->
    <Modal
      v-model="isAddStart"
      :loading="startLoading"
      :mask-closable="false"
      title="添加启动图"
      @on-ok="startSub"
      @on-visible-change="isStartVisible"
    >
      <div class="divs">
        <p class="p">上传图片：</p>
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
          <Upload :action="uploadUrl"
                  ref="startUpload"
                  :show-upload-list="false"
                  :on-success="handleSuccess"
                  :format="['jpg','jpeg','png','bmp']"
                  :on-format-error="handleFormatError"
                  :before-upload="handleBeforeUpload"
                  type="drag"
                  style="display: inline-block;width:100px;margin-top: 10px;">
            <div style="width: 100px;height:100px;line-height: 100px;">
              <Icon type="ios-camera" size="40"></Icon>
            </div>
          </Upload>
          <modal title="查看图片" v-model="visible">
            <img :src="bigUrl" style="width: 100%">
            <div slot="footer"></div>
          </modal>
        </div>
      </div>
      <div class="add-image" style="line-height: 90px">
        <p class="p">是否展示：</p>
        <Checkbox v-model="addData.status" true-value='1' false-value='0'></Checkbox>
      </div>
    </Modal>
    <Modal
      title="提示"
      v-model="startTip"
      :mask-closable = "false"
    >
      <p ref="startTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
    <Modal
      title="提示"
      v-model="startSuccess"
      :mask-closable = "false"
    >
      <p ref="startSuccess"></p>
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
    name: "configStartPage",
    data () {
      return {
        uploadUrl:base.baseUrl.serviceOne + 'documents/saveFileWithoutCompression',
        total:'',
        loading:false,
        isAddStart:false,
        startLoading:true,
        startTip:false,
        startSuccess:false,
        tabBig:false,
        tabUrl:'',
        listParams:{
          page:1,
          size:10
        },
        visible:false,
        bigUrl:'',
        listData:[],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'图片',
            key:'image',
            align:'center',
            render:(h,params) => {
              return h('img',{
                attrs:{
                  src:params.row.picPath
                },
                style:{
                  height:'50px',
                  borderRadius:'5px',
                  cursor:'pointer'
                },
                on:{
                  click:() => {
                    this.tabBig = true;
                    this.tabUrl = params.row.picPath;
                  }
                }
              })
            }
          },
          {
            title:'是否置顶',
            key:'',
            align:'center',
            render:(h,params) => {
              if (params.row.stick === 1) {
                return h('div',{
                  style:{
                    height:'100%',
                  }
                },'已置顶')
              } else {
                return h('div',{
                  style:{
                    height:'100%',
                  }
                },'未置顶')
              }
            }
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
            width:200,
            render:(h,params) => {
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
                    axios.StartPageStick({id:params.row.id,stick:1})
                      .then(res => {
                        //console.log(res);
                        if (res.code === '0') {
                          this.startTip = true;
                          this.$refs.startTip.innerHTML = '操作成功！';
                          this.getPageList();
                        } else {
                          this.startTip = true;
                          this.$refs.startTip.innerHTML = '操作失败！'
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.startTip = true;
                        this.$refs.startTip.innerHTML = '操作失败！'
                      })
                  }
                }
              },'设为置顶');
              const hasStick = h('Button',{
                props:{
                  type: 'error',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    axios.StartPageStick({id:params.row.id,stick:0})
                      .then(res => {
                        //console.log(res);
                        if (res.code === '0') {
                          this.startTip = true;
                          this.$refs.startTip.innerHTML = '操作成功！';
                          this.getPageList();
                        } else {
                          this.startTip = true;
                          this.$refs.startTip.innerHTML = '操作失败！'
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.startTip = true;
                        this.$refs.startTip.innerHTML = '操作失败！'
                      })
                  }
                }
              },'取消置顶');
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
                    axios.StartPageHDelete({id:params.row.id})
                      .then(res => {
                        //console.log(res);
                        this.startTip = true;
                        this.$refs.startTip.innerHTML = res.data;
                        if (res.code === '0') {
                          this.getPageList();
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.startTip = true;
                        this.$refs.startTip.innerHTML = '操作失败！'
                      })
                  }
                }
              },'删除');
              if (params.row.stick === 0) {
                return h('div',[
                  stick,
                  del
                ])
              } else if (params.row.stick === 1) {
                return h('div',[
                  hasStick,
                  del
                ])
              }
            }
          }
        ],
        uploadList:[],
        addData:{
          picPathList:[],
          status:'1'
        }
      }
    },
    mounted () {
      this.uploadList = this.$refs.startUpload.fileList;
      this.getPageList();
    },
    methods:{
      getPageList:function () {
        axios.StartPageList(this.listParams)
          .then(res => {
            //console.log(res);
            if (res.code === 0) {
              this.listData = res.data;
              this.total = res.total;
            } else {
              this.startTip = true;
              this.$refs.startTip.innerHTML = '查询出错！'
            }
          })
          .catch(error => {
            console.log(error);
            this.startTip = true;
            this.$refs.startTip.innerHTML = '查询出错！'
          })
      },
      addStart:function () {
        this.isAddStart = true;
      },
      startPageChange:function (page) {
        this.listParams.page = page;
        this.getPageList();
      },
      handleSuccess:function (res,file,fileList) {
        //console.log(res);
        if (res.code === 200) {
          file.url = res.result;
        } else {
          this.$Message.error('图片上传出错！');
        }
      },
      handleFormatError:function () {
        this.$Message.error('请选择格式为“jpg，jpeg，png，bmp”格式的图片！');
      },
      handleBeforeUpload:function (file) {
        const len = file.name.length <= 50;
        if (!len) {
          this.$Message.error('图片名过长！');
        }
        return len;
      },
      handleView:function (url) {
        this.visible = true;
        this.bigUrl = url;
      },
      handleRemove:function (file) {
        const fileList = this.$refs.startUpload.fileList;
        this.$refs.startUpload.fileList.splice(fileList.indexOf(file), 1);
        this.uploadList = this.$refs.startUpload.fileList;
      },
      isStartVisible:function (value) {
        if (!value) {
         this.resetData();
        }
      },
      startSub:function () {
        this.uploadList.forEach(item => {
          this.addData.picPathList.push(item.url); //操作之后清空
        });
        axios.StartPageAdd(this.addData)
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.isAddStart = false;
              this.startSuccess = true;
              this.$refs.startSuccess.innerHTML = '提交成功！';
              this.listParams.page = 1;
              this.getPageList()
            } else {
              this.$Message.error('提交失败！');
              this.changModal();
            }
          })
          .catch(error => {
            console.log(error);
            this.$Message.error('提交失败！');
            this.changModal();
          })
      },
      changModal:function () {
        this.startLoading = false;
        this.$nextTick(() => {
          this.startLoading = true;
        });
      },
      resetData:function () {
        this.$refs.startUpload.clearFiles();
        this.uploadList = this.$refs.startUpload.fileList;
        this.addData.picPathList = [];
        this.addData.status = '1';
      },
      del:function () {
        this.startTip = false;
      },
      goList:function () {
        this.resetData();
        this.startSuccess = false;
      },
      addMore:function () {
        this.resetData();
        this.startSuccess = false;
        this.isAddStart = true;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .configure-fun{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
  .community-list{
    padding-right: 20px;
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
    }
  }
  .p{
    width: 100px;
    height: 90px;
    line-height: 90px;
    text-align: right;
    padding: 0 12px 0 0;
  }
  .add-image{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
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
  .demo-auto-complete-item{
    cursor: pointer;
    padding: 4px 6px;
    border-bottom: 1px solid #F6F6F6;
  }
  .demo-auto-complete-item:hover{
    background-color: #F7F1F1;
  }
</style>
