<template>
  <div class="position-container content-pad">
    <div class="configure-fun">
      <Button type="default" icon="md-add" @click="addPosition">添加地标</Button>
    </div>
    <div class="community-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading"></Table>
      <Page :total="total" :current="listParams.page" v-if="total>10" show-elevator show-total @on-change="positionPageChange" class="mt30"/>
    </div>
    <Modal
      v-model="showModel"
      :loading="modelLoading"
      :mask-closable="false"
      title="添加地标"
      @on-ok="subPosition"
      @on-visible-change="isPosVisible"
    >
      <Form :model="positionFormData" ref="positionForm" :rules="ruleValidate" :label-width="50">
        <FormItem label="名称：" prop="city">
          <Input type="text" v-model="positionFormData.city"></Input>
        </FormItem>
        <FormItem label="经度：" prop="lng">
          <Input type="text" v-model="positionFormData.lng"></Input>
        </FormItem>
        <FormItem label="纬度：" prop="lat">
          <Input type="text" v-model="positionFormData.lat"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      title="提示"
      v-model="posTip"
      :mask-closable = "false"
    >
      <p ref="posTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
    <Modal
      title="提示"
      v-model="posSuccess"
      :mask-closable = "false"
    >
      <p ref="posSuccess"></p>
      <div slot="close"></div>
      <div slot="footer">
        <Button type="warning"  @click="goList">返回列表</Button>
        <Button type="info"  @click="addMore">继续添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "@/axios/axios";

  const nameValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写地标名称'))
    } else {
      callback();
    }
  };
  const longValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写地标经度'))
    } else {
      callback();
    }
  };
  const latValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写地标纬度'))
    } else {
      callback();
    }
  };
  export default {
    name: "configurePosition",
    data () {
      return {
        total:'',
        loading:false,
        showModel:false,
        modelLoading:true,
        posTip:false,
        posSuccess:false,
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
            title:'地标名称',
            key:'city',
            align:'center'
          },
          {
            title:'经纬度',
            key:'lal',
            align:'center'
          },
          {
            title:'创建时间',
            key:'createTime',
            align:'center'
          }
        ],
        positionFormData:{
          city:'',
          lng:'',
          lat:''
        },
      ruleValidate:{
        city:[{validator:nameValidate}],
        lng:[{validator:longValidate}],
        lat:[{validator:latValidate}]
      }
      }
    },
    mounted () {
      this.getPositionList();
    },
    methods:{
      getPositionList:function () {
        axios.PositionList(this.listParams)
          .then(res => {
            //console.log(JSON.stringify(res.result.list[0]));
            if (res.code === 200) {
              this.listData = res.result.list;
              this.total = res.result.total;
            } else {
              this.posTip = true;
              this.$refs.posTip.innerHTML = res.message;
            }
          })
          .catch(error => {
            console.log(error);
            this.posTip = true;
            this.$refs.posTip.innerHTML = '查询出错！';
          })
      },
      addPosition:function () {
        this.showModel = true;
      },
      positionPageChange:function (page) {
        //console.log(page);
        this.listParams.page = page;
        this.getPositionList();
      },
      subPosition:function () {
        this.$refs.positionForm.validate(valid => {
          if (valid) {
            axios.PositionAdd(this.positionFormData)
              .then(res => {
                //console.log(res);
                if (res.code === 200) {
                  this.listParams.page = 1;
                  this.getPositionList();
                  this.changeLoading();
                  this.showModel = false;
                  this.posSuccess = true;
                  this.$refs.posTip.innerHTML = res.message;
                } else {
                  this.posTip = true;
                  this.$refs.posTip.innerHTML = res.message;
                  this.changeLoading();
                }
              })
              .catch(error => {
                console.log(error);
                this.posTip = true;
                this.$refs.posTip.innerHTML = '添加出错！';
              })
          } else {
            this.changeLoading();
          }
        })
      },
      isPosVisible:function (value) {
        if (!value) {
         this.resetForm();
        }
      },
      resetForm:function () {
        this.$refs.positionForm.resetFields();
      },
      changeLoading:function () {
        this.modelLoading = false;
        this.$nextTick(() => {
          this.modelLoading = true;
        });
      },
      del:function () {
        this.posTip = false;
      },
      goList:function () {
        this.resetForm();
        this.posSuccess = false;
      },
      addMore:function () {
        this.resetForm();
        this.posSuccess = false;
        this.showModel = true;
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
