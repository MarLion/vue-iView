<template>
  <div class="out-container content-pad">
    <!--<div class="route-fun">-->
      <!--<div class="route-ope">-->
        <!--<Button type="default" icon="md-add" @click="addApartment">新增部门</Button>-->
      <!--</div>-->
    <!--</div>-->
    <div class="route-list mt30">
      <Table border :columns="columns" :data="listData" :height="700" :loading="loading" class="table-height"></Table>
    </div>
    <Modal
      title="新增部门"
      v-model="addValue"
      :loading="addModalLoading"
      :mask-closable = "false"
      @on-ok="apartmentSub"
      @on-visible-change="isApartmentVisible"
    >

    </Modal>
    <Modal
      title="提示"
      v-model="apartTip"
      :mask-closable = "false"
    >
      <p ref="apartTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
    <Modal
      title="提示"
      v-model="apartSuccess"
      :mask-closable = "false"
    >
      <p ref="apartSuccess"></p>
      <div slot="close"></div>
      <div slot="footer">
        <Button type="warning"  @click="goApartList">返回列表</Button>
        <Button type="info"  @click="addApartMore">继续添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "@/axios/axios";
  import expandRow from '../public/rowExpand/apart';
  export default {
    name: "configureApartment",
    data () {
      return {
        loading:false,
        total:'',
        apartTip:false,
        apartSuccess:false,
        addValue:false,
        addModalLoading:true,
        listParams:{
          parentId:''
        },
        listData:[],
        columns:[
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h(expandRow,{
                props: {
                  row: params.row
                },
                style:{
                  paddingLeft:'50px',
                },
                on:{
                  getAddValue:(value) => {
                    //console.log(this);
                    this.addValue = value;
                  }
                }
              })
            }
          },
          {
            title:'部门名称',
            key:'title',
            align:'center'
          },
          {
            title:'上级部门',
            width: 650,
            key:'parentName',
            align:'center'
          },
          /*
          {
            title:'操作选项',
            align:'center',
            width:200,
            render:(h,params) => {
              const add = h('Button',{
                props:{
                  type: 'success',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    console.log(params.row.id);
                    console.log(params.row.title);
                    this.addValue = true;
                  }
                }
              },'新增部门');
              const revise = h('Button',{
                props:{
                  type: 'info',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {

                  }
                }
              },'修改');
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

                  }
                }
              },'删除');
              return h('div',[
                add,
                revise,
                del
              ])
            }

          },
          */
        ],
        addData:{
          parentId:'',
          name:'',
          po:'0',
          orderid:'',
          shopno:''
        }
      }
    },
    mounted () {
      this.getApartmentMessage();
    },
    methods:{
      getApartmentMessage:function () {
        this.loading = true;
        axios.SysApartment(this.listParams)
          .then(res => {
            //console.log(res);
            if (res.code === 200) {
              this.loading = false;
              this.listData = res.result;
            } else {
              this.apartTip = true;
              this.$refs.apartTip.innerHTML = '获取部门失败！';
            }
          })
          .catch(error => {
            console.log(error);
            this.apartTip = true;
            this.$refs.apartTip.innerHTML = '获取部门失败！';
          })
      },
      // addApartment:function () {
      //
      // },
      del:function () {
        this.apartTip = false;
      },
      goApartList:function () {

      },
      addApartMore:function () {

      },
      apartmentSub:function () {

      },
      isApartmentVisible:function (value) {
          if (!value) {

          }
      },
      changeModelLoading:function () {
        this.addModalLoading = false;
        this.$nextTick(() => {
          this.addModalLoading = true;
        });
      },

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
  .table-height{
    overflow-y: scroll;
  }
  .table-height::-webkit-scrollbar{
    width: 1px;
  }
</style>
