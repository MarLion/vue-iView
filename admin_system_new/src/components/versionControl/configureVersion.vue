<template>
  <div class="content-pad">
    <div class="community-fun">
      <div class="community-ope">
        <Button type="default" icon="md-add" @click="addVersion">新增版本</Button>
      </div>
    </div>
    <div class="community-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading"></Table>
      <Page :total="total" :current="listParams.page" v-if="total>10" show-elevator show-total @on-change="versionPagePageChange" class="mt30"/>
    </div>
    <Modal
      v-model="showModel"
      :loading="modelLoading"
      :mask-closable="false"
      title="新增版本"
      @on-ok="versionSub"
      @on-visible-change="isVersionVisible"
    >
      <Form :model="versionFormData" ref="versionForm" :rules="ruleValidate" :label-width="80" class="mt20">
        <FormItem label="上传apk：">
          <Upload
            :action=uploadUrl
            ref="apkUpload"
            :data="params"
            :on-success="handleSuccess"
            :format="['apk']"
            :on-format-error="handleFormatError"
            :before-upload="handleBeforeUpload"
          >
            <Button icon="ios-cloud-upload-outline">上传apk</Button>
          </Upload>
        </FormItem>
        <FormItem label="版本号：" prop="versionName">
          <Input type="text" v-model="versionFormData.versionName"></Input>
        </FormItem>
        <FormItem label="更新类型：" prop="type">
          <Select v-model="versionFormData.type">
            <Option v-for="(item,index) in typeList" :key="index" :value="item.id">
              {{item.name}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="版本描述：" prop="desc">
          <Input type="textarea" v-model="versionFormData.desc"></Input>
        </FormItem>
      </Form>
    </Modal>
    <!--弹框-->
    <Modal
      title="提示"
      v-model="versionTip"
      :mask-closable = "false"
    >
      <p ref="versionTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "@/axios/axios";
  import * as base from '../../axios/base';
  const nameValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写版本号'))
    } else {
      callback();
    }
  };
  const typeValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请选择更新类型'))
    } else {
      callback();
    }
  };
  const descValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写版本描述'))
    } else {
      callback();
    }
  };
  export default {
    name: "configureVersion",
    data () {
      return {
        uploadUrl:base.baseUrl.serviceFive +  'appVersion/saveFile',
        params:{
          fileName:'',
        },
        listParams:{
          page:1,
          size:10
        },
        loading:false,
        total:'',
        versionTip:false,
        showModel:false,
        modelLoading:true,
        listData:[],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'版本号',
            key:'versionName',
            align:'center'
          },
          {
            title:'更新类型',
            key:'typeName',
            align:'center'
          },
          {
            title:'版本描述',
            key:'desc',
            align:'center'
          },
          {
            title:'创建时间',
            key:'createTime',
            align:'center'
          },
          {
            title:'操作选项',
            align:'center',
            width:160,
            render:(h,params) => {
              const download = h('Button',{
                props:{
                  type: 'info',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    window.location.href = params.row.apkPath;
                  }
                }
              },'下载');
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
                    axios.ApkDelete({id:params.row.id})
                      .then(res => {
                        //console.log(res);
                        this.versionTip = true;
                        this.$refs.versionTip.innerHTML = res.message;
                        if (res.code === 200) {
                          this.getApkList();
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.versionTip = true;
                        this.$refs.versionTip.innerHTML = '删除失败！'
                      })
                  }
                }
              },'删除');
              return h('div',[
                download,
                del
              ])
            }
          }
        ],
        //新增数据
        typeList:[
          {
            id:1,
            name:'强制更新'
          },
          {
            id:2,
            name:'非强制更新'
          }
        ],
        uploadList:[],
        versionFormData:{
          versionName:'',
          apkPath:'',
          type:'',
          desc:''
        },
        ruleValidate:{
          versionName:[
            {validator:nameValidate}
          ],
          type:[
            {validator:typeValidate}
          ],
          desc:[
            {validator:descValidate}
          ]
        }
      }
    },
    mounted () {
      this.getApkList();
      this.uploadList = this.$refs.apkUpload.fileList;
    },
    methods:{
      //获取apk版本列表
      getApkList:function () {
        axios.ApkList(this.listParams)
          .then(res => {
            //console.log(res);
            if (res.code === 200) {
              this.total = res.result.total;
              this.listData = res.result.list;
            } else {
              this.versionTip = true;
              this.$refs.versionTip.innerHTML = '查询出错！'
            }
          })
          .catch(error => {
            console.log(error);
            this.versionTip = true;
            this.$refs.versionTip.innerHTML = '查询出错！'
          })
      },
      addVersion:function () {
        this.showModel = true;
      },
      versionPagePageChange:function (page) {
         this.listParams.page = page;
         this.getApkList();
      },
      del:function () {
        this.versionTip = false;
      },
      versionSub:function () {
        this.$refs.versionForm.validate(valid => {
          if (valid) {
            axios.ApkSave(this.versionFormData)
              .then(res => {
                //console.log(res);
                if (res.code === 200) {
                  this.showModel = false;
                  this.resetVersion();
                  this.versionTip = true;
                  this.$refs.versionTip.innerHTML = res.message;
                  this.listParams.page = 1;
                  this.getApkList();
                } else {
                  this.$Message.warning(res.message);
                  this.changeModelLoading();
                }
              })
              .catch(error => {
                console.log(error);
                this.$Message.warning('保存失败！');
                this.changeModelLoading();
              })
          } else {
            this.changeModelLoading();
          }
        })
      },
      isVersionVisible:function (value) {
        if (!value) {
          this.resetVersion();
        }
      },
      changeModelLoading:function () {
        this.modelLoading = false;
        this.$nextTick(() => {
          this.modelLoading = true;
        });
      },
      resetVersion:function () {
        this.$refs.versionForm.resetFields();
        this.versionFormData.apkPath = '';
        this.$refs.apkUpload.clearFiles();
        this.uploadList = [];
      },
      handleSuccess:function (res,file,fileList) {
        //console.log(res);
        if (res.code === 200) {
          this.versionFormData.apkPath = res.result
        } else {
          this.$Message.warning('apk上传失败！');
        }
      },
      handleFormatError:function () {
        this.$Message.warning('请选择正确的文件！');
      },
      handleBeforeUpload:function (file) {
        //console.log(file);
        this.params.fileName = file.name;
        const check = this.uploadList.length < 1;
        const len = file.name.length <= 50;
        if (!len) {
          this.$Message.warning('apk包名过长！');
          return len;
        }
        if (!check) {
          this.$Message.warning('只能上传1个apk包！');
          return check;
        }
      },

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
</style>
