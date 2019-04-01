<template>
  <div class="style-container content-pad">
    <div class="configure-fun">
      <Button type="default" icon="md-add" @click="addStyClass">添加风格分类</Button>
    </div>
    <div class="community-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading"></Table>
      <Page :total="total" v-if="total>10" show-elevator show-total @on-change="stylePageChange" class="mt30"/>
    </div>
    <!--新增 这里对upload组件进行了封装 upload-view 重构代码时可将其他地方的上传文件改为upload-view-->
    <Drawer
      title="新增风格分类"
      v-model="styleValue"
      width="720"
      :mask-closable="false"
      :styles="styles"
      @on-close="clearStyleData"
    >
      <Form :model="classFormData" ref="classFormData" :rules="ruleValidate" class="mt20">
        <FormItem label="风格名称：" prop="description" :label-width="80">
          <Input type="text" v-model="classFormData.description"></Input>
        </FormItem>
        <FormItem>
          <div class="upload-div">
            <upload-view ref="view" v-for="item in modalList" :key="item" :uploadUrl="uploadUrl" :title="item" :length="1" :width="80" conWidth="50%" v-on:success-callback="successPath" v-on:remove-callback="removePath"></upload-view>
          </div>
        </FormItem>
        <FormItem style="width: 200px!important;margin-top: 30px;" :label-width="80">
          <Button type="primary" @click="picSub" :loading="picLoading">确认添加</Button>
        </FormItem>
      </Form>
    </Drawer>
    <Modal
      title="提示"
      v-model="styleTip"
      :mask-closable = "false"
    >
      <p ref="styleTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "../../axios/axios";
  import * as base from '../../axios/base';
  import expandRow from '../public/rowExpand/style';
  export default {
    name: "configureStyle",
    data () {
      const nameValidate = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写风格名称'))
        } else {
          callback();
        }
      };
      return {
        uploadUrl:base.baseUrl.serviceTwo + 'documents/saveFiles',
        total:'',
        loading:false,
        styleValue:false,
        picLoading:false,
        styleTip:false,
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        listParams:{
          pageNum:1,
          pageSize:10
        },
        modalList:[],
        //新增风格
        classFormData:{
          description:'',
          icons:[]
        },
        ruleValidate:{
          description:[
            {validator:nameValidate}
          ]
        },
        listData:[],
        columns:[
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h(expandRow,{
                props: {
                  row: params.row.icons
                }
              })
            }
          },
          {
            title:'风格分类',
            key:'description',
            align:'left'
          },
          {
            title:'操作选项',
            key:'action',
            align:'center',
            width:150,
            render:(h,params) => { //status 1是已激活 0是未激活
              if (params.row.status === 0) {
                return h('div',[
                  h('Button',{
                    props: {
                      type: 'success',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on:{
                      click : () => {
                      axios.StyleActivate({id:params.row.id,status:1})
                        .then(res => {
                          //console.log(res);
                          if (res.code === '0') {
                            this.styleTip = true;
                            this.$refs.styleTip.innerHTML = '激活成功！';
                            this.getStyleList();
                          } else {
                            this.styleTip = true;
                            this.$refs.styleTip.innerHTML = res.message;
                          }
                        })
                        .catch(error => {
                          console.log(error);
                          this.styleTip = true;
                          this.$refs.styleTip.innerHTML = '激活失败！';
                        })
                      }
                    }
                  },'激活'),
                ])
              } else {
                return h('div',[
                  h('Button',{
                    props: {
                      type: 'success',
                      size: 'small',
                      disabled:true
                    },
                    style: {
                      marginRight: '5px'
                    },
                  },'已激活'),
                ])
              }
            }
          }
        ]
      }
    },
    mounted () {
      this.getStyleList();
    },
    methods:{
      getStyleList:function () {
        this.loading = true;
        axios.StyleList(this.listParams)
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.loading = false;
              this.listData = res.data.list;
              this.total = res.data.total;
            } else {
              this.styleTip = true;
              this.$refs.styleTip.innerHTML = '查询出错！'
            }
          })
          .catch(error => {
            console.log(error);
            this.styleTip = true;
            this.$refs.styleTip.innerHTML = '查询出错！'
          })
      },
      getStyleModalList:function () {
        axios.StyleModalList()
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.modalList = res.data.split('，'); //这里分割的逗号是中文字符
            } else {
              this.$Message.warning('获取模块分类失败！');
            }
          })
          .catch(error => {
            console.log(error);
            this.$Message.warning('获取模块分类失败！');
          })
      },
      stylePageChange:function (page) {
        this.listParams.pageNum = page;
        this.getStyleList();
      },
      addStyClass:function () {
        this.styleValue = true;
        this.getStyleModalList();
      },
      clearStyleData:function () {
        this.$refs.classFormData.resetFields();
        this.classFormData.icons = [];
        //this.$refs.view是一个集合 需要遍历 分别去调用子组件的清除方法
        this.$refs.view.forEach(item => {
          item.clearUpload();
        })
      },
      //上传图片成功回调
      successPath:function (file,title) {
        // this.classFormData.icons.push({  //如果icons里元素为object 接受到的参数为空 将模块名和path拼接成字符串塞进数组
        //   name:title,
        //   picPath:file.url
        // });
        let str = title+'$'+file.url; //接收后后台以$符号进行分割
        let ind = this.modalList.indexOf(title);
        this.classFormData.icons.splice(ind,0,str);
        //console.log(this.classFormData.icons);
      },
      //删除图片回调
      removePath:function (file) {
        this.classFormData.icons.forEach(item => {
          let st = item.split('$')[1];
          if (st === file.url) {
            this.classFormData.icons.splice(this.classFormData.icons.indexOf(item), 1)
          }
        });
      },
      //提交
      picSub:function () {
        this.$refs.classFormData.validate(valid => {
          if (valid) {
            //console.log(JSON.stringify(this.classFormData));
            this.picLoading = true;
            axios.StyleAdd(this.classFormData)
              .then(res => {
                console.log(res);
                this.picLoading = false;
                if (res.code === '0') {
                  this.styleTip = true;
                  this.$refs.styleTip.innerHTML = res.data;
                  this. styleValue = false;
                  this.clearStyleData();
                  this.listParams.pageNum = 1;
                  this.getStyleList();
                } else {
                  this.styleTip = true;
                  this.$refs.styleTip.innerHTML = res.message;
                }
              })
              .catch(error => {
                console.log(error);
                this.picLoading = false;
                this.styleTip = true;
                this.$refs.styleTip.innerHTML = '添加失败！'
              })
          }
        });
      },
      del:function () {
        this.styleTip = false;
      },
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
  .upload-div{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
</style>
