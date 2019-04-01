<template>
  <div class="knowClass-container content-pad">
    <div class="configure-fun">
      <Button type="default" icon="md-add" @click="addKnowClass">添加分类</Button>
    </div>
    <div class="community-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading"></Table>
      <Page :total="total" v-if="total>10" show-elevator show-total @on-change="knowClassPageChange" class="mt30"/>
    </div>
    <!--新增-->
    <Modal
      v-model="showModel"
      :loading="modelLoading"
      :mask-closable="false"
      title="添加分类"
      @on-ok="knowClassSub"
      @on-visible-change="isKnowClassVisible"
    >
      <Form :model="knowClassFormData" ref="knowClassForm" :rules="ruleValidate" :label-width="80" class="mt20">
        <FormItem label="分类名称：" prop="category">
          <Input type="text" v-model="knowClassFormData.category"></Input>
        </FormItem>
      </Form>
    </Modal>
    <!--弹框-->
    <Modal
      title="提示"
      v-model="knowClassTip"
      :mask-closable = "false"
    >
      <p ref="knowClassTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
    <Modal
      title="提示"
      v-model="knowClassSuccess"
      :mask-closable = "false"
    >
      <p ref="knowClassSuccess"></p>
      <div slot="close"></div>
      <div slot="footer">
        <Button type="warning"  @click="goKnowClassList">返回列表</Button>
        <Button type="info"  @click="addKnowClassMore">继续添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "../../axios/axios";
  const nameValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写分类名称'))
    } else {
      callback();
    }
  };
  export default {
    name: "configureHealthKnowledgeClass",
    data () {
      return {
        loading:false,
        total:'',
        showModel:false,
        modelLoading:true,
        knowClassTip:false,
        knowClassSuccess:false,
        listParams:{
          pageNum:1,
          pageSize:10
        },
        knowClassFormData:{
          category:'',
        },
        listData:[],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'分类名称',
            key:'category',
            align:'center'
          },
          {
            title:'状态',
            align:'center',
            render:(h,params) => {
              if (params.row.status === 0) {
                return h('div',{
                  style: {
                    height: '100%',
                  }
                  },'展示中')
              } else {
                return h('div',{
                  style: {
                    height: '100%',
                  }
                },'隐藏中')
              }
            }
          },
          {
            title:'创建时间',
            key:'createTime',
            align:'center'
          },
          {
            title:'操作选项',
            key:'action',
            align:'center',
            width:130,
            render:(h,params) => {
              const show =  h('Button',{
                props:{
                  type: 'success',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    axios.HealthKnowClassShowOrHide({id:params.row.id,status:0})
                      .then(res => {
                        //console.log(res);
                        this.knowClassTip = true;
                        this.$refs.knowClassTip.innerHTML = res.data;
                        this.getClassList();
                      })
                      .catch(error => {
                        console.log(error);
                        this.knowClassTip = true;
                        this.$refs.knowClassTip.innerHTML = '操作失败！'
                      })
                  }
                }
              },'展示');
              const hidden =  h('Button',{
                props:{
                  type: 'error',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    //console.log(params.row.id);
                    axios.HealthKnowClassShowOrHide({id:params.row.id,status:1})
                      .then(res => {
                        //console.log(res);
                        this.knowClassTip = true;
                        this.$refs.knowClassTip.innerHTML = res.data;
                        this.getClassList();
                      })
                      .catch(error => {
                        console.log(error);
                        this.knowClassTip = true;
                        this.$refs.knowClassTip.innerHTML = '操作失败！'
                      })
                  }
                }
              },'隐藏');
              if (params.row.status === 0) {
                return h('div',[
                  hidden
                ])
              } else {
                return h('div',[
                  show
                ])
              }
            }
          }
        ],
        ruleValidate:{
          category:[
            {validator:nameValidate}
          ]
        }
      }
    },
    mounted () {
      this.getClassList();
    },
    methods:{
      getClassList:function () {
        this.loading = true;
        axios.HealthKnowClassList(this.listParams)
          .then(res => {
            //console.log(res);
            this.loading = false;
            this.listData = res.data.list;
            this.total = res.data.total;
          })
          .catch(error => {
            console.log(error);
            this.knowClassTip = true;
            this.$refs.knowClassTip.innerHTML = '查询出错！'
          })
      },
      addKnowClass:function () {
        this.showModel = true;
      },
      knowClassPageChange:function (page) {
        this.listParams.pageNum = page;
        this.getClassList();
      },
      knowClassSub:function () {
        this.$refs.knowClassForm.validate(valid => {
          if (valid) {
            axios.HealthKnowClassAdd(this.knowClassFormData)
              .then(res => {
                //console.log(res);
                this.showModel = false;
                this.knowClassSuccess = true;
                this.$refs.knowClassSuccess.innerHTML = res.data;
                this.getClassList();
              })
              .catch(error => {
                console.log(error);
                this.knowClassTip = true;
                this.$refs.knowClassTip.innerHTML = '保存失败！'
              })
          } else {
            this.changeKnowClassModalLoading();
          }
        })
      },
      isKnowClassVisible:function (value) {
        if (!value) {
          this.clearClass();
        }
      },
      changeKnowClassModalLoading:function () {
        this.modelLoading = false;
        this.$nextTick(() => {
          this.modelLoading = true;
        });
      },
      del:function () {
        this.knowClassTip = false;
      },
      goKnowClassList:function () {
        this.clearClass();
        this.knowClassSuccess = false;
      },
      addKnowClassMore:function () {
        this.clearClass();
        this.knowClassSuccess = false;
        this.showModel = true;
      },
      clearClass:function () {
        this.$refs.knowClassForm.resetFields();
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
</style>
