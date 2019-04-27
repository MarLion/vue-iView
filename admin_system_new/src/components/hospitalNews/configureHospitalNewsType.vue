<template>
  <div class="container content-pad">
    <div class="community-fun">
      <div class="community-ope">
        <Button type="default" icon="md-add" @click="addType">新增类型</Button>
      </div>
      <div class="community-search">
        <span class="ml15">类型名称：</span>
        <span><Input class="checkWid" v-model="listParams.typeName"/></span>
        <!--<span class="ml15">医院名称：</span>-->
        <!--<span><Input class="checkWid" v-model="listParams.hospitalName"/></span>-->
        <span class="ml10"><Button icon="ios-search" @click="checkType">查询</Button></span>
      </div>
    </div>
    <div class="community-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading"></Table>
      <Page :total="total" :current="listParams.pageNum" v-if="total>10" show-elevator show-total @on-change="typePageChange" class="mt30"/>
    </div>
    <!--新增资讯类型-->
    <Modal
      v-model="addHospType"
      :loading="typeModelLoading"
      :mask-closable="false"
      title="添加类型"
      @on-ok="typeClassSub"
      @on-visible-change="isTypeClassVisible"
    >
      <Form :model="hospClassFormData" ref="hospClassForm" :rules="ruleValidate" :label-width="80" class="mt20">
        <!--<FormItem label="选择医院：" prop="hospitalId">-->
          <!--<Select v-model="hospClassFormData.hospitalId">-->
            <!--<Option v-for="item in hospitalList" :key="item.id" :value="item.id">-->
              <!--{{item.hospitalName}}-->
            <!--</Option>-->
          <!--</Select>-->
        <!--</FormItem>-->
        <FormItem label="类型名称：" prop="typeName">
          <Input type="text" v-model="hospClassFormData.typeName"></Input>
        </FormItem>
      </Form>
    </Modal>
    <!--修改资讯类型-->
    <Modal
      v-model="reviseHospType"
      :loading="reModelLoading"
      :mask-closable="false"
      title="修改类型"
      @on-ok="typeReClassSub"
      @on-visible-change="isTypeReClassVisible"
    >
      <Form :model="hospClassReData" ref="hospClassReData" :rules="ruleValidate" :label-width="80" class="mt20">
        <FormItem label="类型名称：" prop="typeName">
          <Input type="text" v-model="hospClassReData.typeName"></Input>
        </FormItem>
      </Form>
    </Modal>
    <!--弹框-->
    <Modal
      title="提示"
      v-model="typeTip"
      :mask-closable = "false"
    >
      <p ref="typeTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "../../axios/axios";
  import * as base from '../../axios/base';
  const hospValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请选择医院'))
    } else {
      callback();
    }
  };
  const nameValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写类型名称'))
    } else {
      callback();
    }
  };
  export default {
    name: "configureHospitalNewsType",
    data () {
      return {
        loading:false,
        typeTip:false,
        total:'',
        addHospType:false,
        reviseHospType:false,
        typeModelLoading:true,
        reModelLoading:true,
        hospitalList:[],
        listParams:{
          pageNum:1,
          limit:10,
          typeName:'',
          //hospitalName:''
        },
        listData:[],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'类型名称',
            key:'typeName',
            align:'center'
          },
          {
            title:'创建时间',
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
            title:'更新时间',
            align:'center',
            render:(h,params) => {
              return h('div',{
                style:{
                  height:'100%'
                }
              },this.$trans.getTime(params.row.updateTime))
            }
          },
          {
            title:'操作选项',
            align:'center',
            width:160,
            render:(h,params) => {
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
                    this.reviseHospType = true;
                    this.hospClassReData.id = params.row.id;
                    //this.hospClassReData.hospitalId = params.row.hospitalId;
                    this.hospClassReData.typeName = params.row.typeName;
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
                    axios.HospitalNewsClassDelete({id:params.row.id})
                      .then(res => {
                        //console.log(res);
                        if (res.code === '0') {
                          this.typeTip = true;
                          this.$refs.typeTip.innerHTML = '删除成功！';
                          this.getNewsClass();
                        } else {
                          this.typeTip = true;
                          this.$refs.typeTip.innerHTML = '删除失败！';
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.typeTip = true;
                        this.$refs.typeTip.innerHTML = '删除失败！';
                      })
                  }
                }
              },'删除');
              return h('div',[
                revise,
                del
              ])
            }
          }
        ],
        hospClassFormData:{
          typeName:'',
          //hospitalId:''
        },
        hospClassReData:{
          id:'',
          typeName:'',
          //hospitalId:''
        },
        ruleValidate:{
          hospitalId:[
            {validator:hospValidate}
          ],
          typeName:[
            {validator:nameValidate}
          ]
        },

      }
    },
    mounted () {
      this.getNewsClass();
    },
    methods:{
      /*获取医院数据*/
      getHospital:function () {
        axios.HospitalList({limit:1000,pageNum:1})
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.hospitalList = res.data;
            } else {
              this.typeTip = true;
              this.$refs.typeTip.innerHTML = res.data;
            }
          })
          .catch(error => {
            console.log(error);
            this.typeTip = true;
            this.$refs.typeTip.innerHTML = '查询医院出错！'
          })
      },
      /*资讯类型列表*/
      getNewsClass:function () {
        this.loading = true;
        axios.HospitalNewsClassList(this.listParams)
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.loading = false;
              this.listData = res.data;
              this.total = res.count;
            } else {
              this.typeTip = true;
              this.$refs.typeTip.innerHTML = res.data;
            }

          })
          .catch(error => {
            console.log(error);
            this.typeTip = true;
            this.$refs.typeTip.innerHTML = '查询出错！'
          })
      },
      checkType:function () {
        this.listParams.pageNum = 1;
        this.getNewsClass();
      },
      typePageChange:function (page) {
        this.listParams.pageNum = page;
        this.getNewsClass();
      },
      addType:function () {
        this.addHospType = true;
        this.getHospital();
      },
      del:function () {
        this.typeTip = false;
      },
      typeClassSub:function () {
        //console.log(this.hospClassFormData.hospitalId);
        this.$refs.hospClassForm.validate(valid => {
          if (valid) {
            axios.HospitalNewsClassSave(this.hospClassFormData)
              .then(res => {
                //console.log(res);
                if (res.code === '0') {
                  this.addHospType = false;
                  //this.clearTypeData();
                  this.typeTip = true;
                  this.$refs.typeTip.innerHTML = '保存成功！';
                  this.listParams.pageNum = 1;
                  this.getNewsClass();
                } else {
                  this.$Message.error('保存失败！');
                  this.changeTypeClassModalLoading();
                }
              })
              .catch(error => {
                console.log(error);
                this.$Message.error('保存失败！');
                this.changeTypeClassModalLoading();
              })
          } else {
            this.changeTypeClassModalLoading();
          }
        })
      },
      isTypeClassVisible:function (value) {
        if (!value) {
          this.clearTypeData();
        }
      },
      changeTypeClassModalLoading:function () {
        this.typeModelLoading = false;
        this.$nextTick(() => {
          this.typeModelLoading = true;
        });
      },
      clearTypeData:function () {
        //this.hospClassFormData.hospitalId = '';
        this.$refs.hospClassForm.resetFields();
      },
      typeReClassSub:function () {
        this.$refs.hospClassReData.validate(valid => {
          if (valid) {
            axios.HospitalNewsClassSave(this.hospClassReData)
              .then(res => {
                //console.log(res);
                if (res.code === '0') {
                  this.reviseHospType = false;
                  //this.clearTypeData();
                  this.typeTip = true;
                  this.$refs.typeTip.innerHTML = '修改成功！';
                  this.getNewsClass();
                } else {
                  this.$Message.error('修改失败！');
                  this.changeTypeReClassModalLoading();
                }
              })
              .catch(error => {
                console.log(error);
                this.$Message.error('修改失败！');
                this.changeTypeReClassModalLoading();
              })
          } else {
            this.changeTypeReClassModalLoading();
          }
        })
      },
      isTypeReClassVisible:function (value) {
        if (!value) {
          this.clearTypeReData();
        }
      },
      changeTypeReClassModalLoading:function () {
        this.reModelLoading = false;
        this.$nextTick(() => {
          this.reModelLoading = true;
        });
      },
      clearTypeReData:function () {
        this.hospClassReData.id = '';
        //this.hospClassReData.hospitalId = '';
        this.$refs.hospClassReData.resetFields();
      }
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
