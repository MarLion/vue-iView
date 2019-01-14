<template>
  <div class="label-container content-pad">
    <div class="configure-fun">
      <Button type="default" icon="md-add" @click="addLabel">添加标签</Button>
    </div>
    <div class="community-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading"></Table>
      <Page :total="total" :current="listParams.page" v-if="total>10" show-elevator show-total @on-change="labelPageChange" class="mt30"/>
    </div>
    <Modal
      v-model="showModel"
      :loading="modelLoading"
      :mask-closable="false"
      title="添加标签"
      @on-ok="subLabel"
      @on-visible-change="isVisible"
    >
      <Form :model="labelFormData" ref="labelForm" :rules="ruleValidate" :label-width="50">
        <FormItem label="名称：" prop="name">
          <Input type="text" v-model="labelFormData.name"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      title="提示"
      v-model="labelTip"
      :mask-closable = "false"
    >
      <p ref="labelTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
    <Modal
      title="提示"
      v-model="labelSuccess"
      :mask-closable = "false"
    >
      <p ref="labelSuccess"></p>
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
  const nameValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写标签名称'))
    } else {
      callback();
    }
  };
  export default {
    name: "configureLabel",
    data () {
      return {
        total:'',
        loading:false,
        showModel:false,
        modelLoading:true,
        labelTip:false,
        labelSuccess:false,
        listParams:{
          page:1,
          size:10
        },
        listData:[],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'标签名称',
            key:'name',
            align:'center'
          },
          {
            title:'标签类型',
            key:'clabelType',
            align:'center'
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
            width:150,
            render:(h,params) => {
              return h('div',[
                h('Button',{
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on:{
                    click : () => {
                      axios.LabelDelete({id:params.row.id})
                        .then(res => {
                          //console.log(res);
                          this.labelTip = true;
                          this.$refs.labelTip.innerHTML = res.message;
                          if (res.code === 200) {
                           this.getLabList();
                          }
                        })
                        .catch(error => {
                          console.log(error);
                          this.labelTip = true;
                          this.$refs.labelTip.innerHTML = '删除出错！'
                        })
                    }
                  }
                },'删除')
              ])
            }
          }
        ],
        labelFormData:{
          name:''
        },
        ruleValidate:{
          name:[{validator:nameValidate}]
        }
      }
    },
    mounted () {
      this.getLabList();
    },
    methods : {
      getLabList:function () {
        axios.LabelList(this.listParams)
          .then(res => {
            //console.log(JSON.stringify(res.result.list[0]));
            if (res.code === 200) {
              this.listData = res.result.list;
              this.total = res.result.total;
            } else {
              this.labelTip = true;
              this.$refs.labelTip.innerHTML = res.message;
            }
          })
          .catch(error => {
            console.log(error);
            this.labelTip = true;
            this.$refs.labelTip.innerHTML = '查询出错！'
          })
      },
      addLabel:function () {
        this.showModel = true;
      },
      labelPageChange:function (page) {
        //console.log(page);
        this.listParams.page = page;
        this.getLabList();
      },
      subLabel:function () {
        this.$refs.labelForm.validate(valid => {
          if (valid) {
            axios.LabelAdd(this.labelFormData)
              .then(res => {
                //console.log(res);
                if (res.code === 200) {
                  this.listParams.page = 1;
                  this.getLabList();
                  this.changeModalLoading();
                  this.showModel = false;
                  this.labelSuccess = true;
                  this.$refs.labelSuccess.innerHTML = res.message;
                } else {
                  this.labelTip = true;
                  this.$refs.labelTip.innerHTML = res.message;
                  this.changeModalLoading();
                }
              })
              .catch(error => {
                console.log(error);
                this.labelTip = true;
                this.$refs.labelTip.innerHTML = '添加出错！'
              })
          } else {
            this.changeModalLoading();
          }
        })
      },
      isVisible:function (value) {
        if (!value) {
          this.resetData();
        }
      },
      changeModalLoading:function () {
        this.modelLoading = false;
        this.$nextTick(() => {
          this.modelLoading = true;
        });
      },
      del:function () {
        this.labelTip = false;
      },
      goList:function () {
        this.resetData();
        this.labelSuccess = false;
      },
      addMore:function () {
        this.resetData();
        this.labelSuccess = false;
        this.showModel = true;
      },
      resetData:function () {
        this.$refs.labelForm.resetFields();
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
