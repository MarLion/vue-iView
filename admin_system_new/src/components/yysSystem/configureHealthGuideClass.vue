<template>
  <div class="guideClass-container content-pad">
    <div class="configure-fun">
      <Button type="default" icon="md-add" @click="addGuide">添加类型</Button>
    </div>
    <div class="community-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading"></Table>
      <Page :total="total" v-if="total>10" show-elevator show-total @on-change="guidePageChange" class="mt30"/>
    </div>
    <!--新增-->
    <Modal
      v-model="showModel"
      :loading="modelLoading"
      :mask-closable="false"
      title="添加类型"
      @on-ok="guideSub"
      @on-visible-change="isGuideVisible"
    >
      <Form :model="guideFormData" ref="guideForm" :rules="ruleValidate" :label-width="80" class="mt20">
        <FormItem label="类型名称：" prop="name">
          <Input type="text" v-model="guideFormData.name"></Input>
        </FormItem>
      </Form>
    </Modal>
    <!--弹框-->
    <Modal
      title="提示"
      v-model="guideTip"
      :mask-closable = "false"
    >
      <p ref="guideTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
    <Modal
      title="提示"
      v-model="guideSuccess"
      :mask-closable = "false"
    >
      <p ref="guideSuccess"></p>
      <div slot="close"></div>
      <div slot="footer">
        <Button type="warning"  @click="goGuideList">返回列表</Button>
        <Button type="info"  @click="addGuideMore">继续添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "../../axios/axios";
  const nameValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写类型名称'))
    } else {
      callback();
    }
  };
  export default {
    name: "configureHealthGuideClass",
    data () {
      return {
        loading:false,
        total:'',
        showModel:false,
        modelLoading:true,
        guideTip:false,
        guideSuccess:false,
        listParams:{
          page:1,
          rows:10
        },
        listData:[],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'类型编号',
            key:'typeno',
            align:'center'
          },
          {
            title:'类型名称',
            key:'name',
            align:'center'
          },
          {
            title:'类型状态',
            key:'statusName',
            align:'center'
          },
          {
            title:'操作选项',
            key:'action',
            align:'center',
            width:150,
            render: (h,params) => {
              const show = h('Button',{
                props:{
                  type: 'success',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click: () => {
                    axios.HealthGuideClassShowOrHide({id:params.row.id})
                      .then(res => {
                        //console.log(res);
                        this.guideTip = true;
                        this.$refs.guideTip.innerHTML = res.message;
                        if (res.code === 200) {
                          this.getGuideList();
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.guideTip = true;
                        this.$refs.guideTip.innerHTML = '操作失败！';
                      })
                  }
                }
              },'展示');
              const hide = h('Button',{
                props:{
                  type: 'error',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click: () => {
                    axios.HealthGuideClassShowOrHide({id:params.row.id})
                      .then(res => {
                        //console.log(res);
                        this.guideTip = true;
                        this.$refs.guideTip.innerHTML = res.message;
                        if (res.code === 200) {
                          this.getGuideList();
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.guideTip = true;
                        this.$refs.guideTip.innerHTML = '操作失败！';
                      })
                  }
                }
              },'隐藏');
              if (params.row.status === 0) {
                return h('div',[
                  hide
                ])
              } else {
                return h('div',[
                  show
                ])
              }
            }
          }
        ],
        guideFormData:{
          name:'',
        },
        ruleValidate:{
          name:[
            {validator:nameValidate}
          ]
        }
      }
    },
    mounted () {
      this.getGuideList();
    },
    methods:{
      getGuideList:function () {
        this.loading = true;
        axios.HealthGuideClassList(this.listParams)
          .then(res => {
            //console.log(res);
            if (res.code === 200) {
              this.loading = false;
              this.listData = res.result.list;
              this.total = res.result.total;
            } else {
              this.guideTip = true;
              this.$refs.guideTip.innerHTML = '查询出错！';
            }
          })
          .catch(error => {
            console.log(error);
            this.guideTip = true;
            this.$refs.guideTip.innerHTML = '查询出错！';
          })
      },
      addGuide:function () {
        this.showModel = true;
      },
      guidePageChange:function (page) {
        this.listParams.page = page;
        this.getGuideList();
      },
      isGuideVisible:function (value) {
        if (!value) {
          //清空表单
          this.clearGuide();
        }
      },
      guideSub:function () {
        this.$refs.guideForm.validate(valid => {
          if (valid) {
            axios.HealthGuideClassAdd(this.guideFormData)
              .then(res => {
                //console.log(res);
                this.showModel = false;
                this.guideSuccess = true;
                this.$refs.guideSuccess.innerHTML = res.message;
                if (res.code === 0) {
                  this.getGuideList();
                }
              })
              .catch(error => {
                console.log(error);
                this.guideTip = true;
                this.$refs.guideTip.innerHTML = '保存失败！';
              })
          } else {
            this.changeGuideModalLoading();
          }
        })
      },
      del:function () {
        this.guideTip = false;
      },
      goGuideList:function () {
        this.clearGuide();
        this.guideSuccess = false;
      },
      addGuideMore:function () {
        this.clearGuide();
        this.guideSuccess = false;
        this.showModel =true;
      },
      changeGuideModalLoading:function () {
        this.modelLoading = false;
        this.$nextTick(() => {
          this.modelLoading = true;
        });
      },
      clearGuide:function () {
        this.$refs.guideForm.resetFields();
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
