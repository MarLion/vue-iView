<template>
  <div class="content-pad">
    <div class="route-fun">
      <Button type="default" icon="md-add" @click="addHealthKey">新增关键词</Button>
    </div>
    <div class="route-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading"></Table>
      <Page :total="total" :current="listParams.page" v-if="total>10" show-elevator show-total class="mt30" @on-change="pageChange"/>
    </div>
    <!--新增-->
    <Modal
      v-model="addKey"
      :loading="keyLoading"
      :mask-closable="false"
      title="添加关键词"
      @on-ok="keySub"
      @on-visible-change="isKeyVisible"
    >
      <Form :model="keyFormData" ref="keyForm" :rules="ruleValidate" :label-width="80" class="mt20">
        <FormItem label="关键词：" prop="keyword">
          <Input type="text" v-model="keyFormData.keyword"></Input>
        </FormItem>
        <FormItem label="状态：" prop="recommendation">
          <Checkbox v-model="keyFormData.recommendation" true-value="0" false-value="1">是否推荐</Checkbox>
        </FormItem>
      </Form>
    </Modal>
    <!--弹框-->
    <Modal
      title="提示"
      v-model="keyTip"
      :mask-closable = "false"
    >
      <p ref="keyTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "../../axios/axios";
  import * as base from '../../axios/base';
  const nameValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写关键词'))
    } else {
      callback();
    }
  };
  const typeValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请选择对应模块'))
    } else {
      callback();
    }
  };
  export default {
    name: "configureIndexKey",
    data () {
      return {
        loading:false,
        total:'',
        keyTip:false,
        addKey:false,
        keyLoading:true,
        listParams:{
          page:1,
          size:10
        },
        keyModalList:[],
        addMoldList:[],
        listData:[],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'关键词',
            key:'keyword',
            align:'center'
          },
          {
            title:'是否推荐',
            align:'center',
            render:(h,params) => {
              if (params.row.recommendation === '0') {
                return h('div',{
                  style:{
                    height:'100%'
                  }
                },'已推荐')
              } else {
                return h('div',{
                  style:{
                    height:'100%'
                  }
                },'未推荐')
              }
            }
          },
          {
            title:'创建日期',
            align:'center',
            render:(h,params) => {
              return h('div',{
                style:{
                  height:'100%'
                }
              },this.$trans.getTime(params.row.createTime))
            }
          },
          {
            title:'操作选项',
            align:'center',
            width:200,
            render:(h,params) => {
              const top = h('Button',{
                props:{
                  type: 'info',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    this.keyOperation(params.row.id,'0');
                  }
                }
              },'设为推荐');
              const cancelTop = h('Button',{
                props:{
                  type: 'warning',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    this.keyOperation(params.row.id,'1');
                  }
                }
              },'取消推荐');
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
                    this.keyOperation(params.row.id,'2');
                  }
                }
              },'删除');
              if (params.row.recommendation === '0') {
                return h('div',[
                  cancelTop,
                  del
                ])
              } else {
                return h('div',[
                  top,
                  del
                ])
              }
            }
          }
        ],
        keyFormData:{
          keyword:'',
          keywordType:'',
          recommendation:'0'
        },
        ruleValidate:{
          keyword:[
            {validator:nameValidate}
          ],
          keywordType:[
            {validator:typeValidate}
          ]
        }
      }
    },
    mounted () {
      this.getKeyList();
    },
    methods:{
      getKeyList:function () {
        this.loading = true;
        axios.IndexSearchKeyList(this.listParams)
          .then(res => {
            //console.log(JSON.stringify(res.data.list[0]));
            if (res.code === '0') {
              this.loading = false;
              this.total = res.data.total;
              this.listData = res.data.list;
            } else {
              this.keyTip = true;
              this.$refs.keyTip.innerHTML = '查询出错！';
            }
          })
          .catch(error => {
            console.log(error);
            this.keyTip = true;
            this.$refs.keyTip.innerHTML = '查询出错！';
          })
      },
      //操作
      keyOperation:function (id,type) {
        axios.IndexSearchKeyStatus({id:id,operateType:type})
          .then(res => {
            //console.log(res);
            this.keyTip = true;
            this.$refs.keyTip.innerHTML = res.data;
            if (res.code === '0') {
              this.getKeyList();
            }
          })
          .catch(error => {
            console.log(error);
            this.keyTip = true;
            this.$refs.keyTip.innerHTML = '操作失败！';
          })
      },
      getSelKey:function () {
        this.listParams.page = 1;
        this.getKeyList();
      },
      addHealthKey:function () {
        this.addKey = true;
      },
      pageChange:function (page) {
        this.listParams.page = page;
        this.getKeyList();
      },
      del:function () {
        this.keyTip = false;
      },
      keySub:function () {
        this.$refs.keyForm.validate(valid => {
          if (valid) {
            axios.IndexSearchKeyAdd(this.keyFormData)
              .then(res => {
                //console.log(res);
                if (res.code === '0') {
                  this.addKey = false;
                  this.keyTip = true;
                  this.$refs.keyTip.innerHTML = res.data;
                  this.listParams.page = 1;
                  this.getKeyList();
                } else {
                  this.$Message.error(res.data);
                  this.changeKeyLoading();
                }
              })
              .catch(error => {
                console.log(error);
                this.changeKeyLoading();
                this.keyTip = true;
                this.$refs.keyTip.innerHTML = '保存失败！';
              })
          } else {
            this.changeKeyLoading();
          }
        })
      },
      isKeyVisible:function (value) {
        if (!value) {
          this.clearKeyData();
        }
      },
      changeKeyLoading:function () {
        this.keyLoading = false;
        this.$nextTick(() => {
          this.keyLoading = true;
        });
      },
      clearKeyData:function () {
        this.$refs.keyForm.resetFields();
        this.keyFormData.recommendation = '0';
      },
    }
  }
</script>

<style lang="scss" scoped>
  .route-fun{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
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
</style>
