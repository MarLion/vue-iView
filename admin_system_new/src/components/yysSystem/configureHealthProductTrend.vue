<template>
  <div class="trend-container content-pad">
    <div class="route-fun">
      <div class="route-ope">
        <Button type="default" icon="md-add" @click="addHealthTrend">发布动态</Button>
      </div>
      <div class="route-search">
        <span class="ml15">动态主题：</span>
        <span><Input class="middle-checkWid" v-model="listParams.name"/></span>
        <span class="ml15">动态状态：</span>
        <span>
          <Select style="width:150px" v-model="listParams.status">
            <Option v-for="(item,index) in statusList" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select>
        </span>
        <span class="ml10"><Button icon="ios-search" @click="clickData">查询</Button></span>
      </div>
    </div>
    <div class="route-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading"></Table>
      <Page :total="total" :current="listParams.pageNum" v-if="total>10" show-elevator show-total class="mt30" @on-change="pageChange"/>
    </div>
    <!--发布-->
    <Drawer
      title="发布动态"
      v-model="trendValue"
      width="720"
      :mask-closable="false"
      :styles="styles"
      @on-close = 'clearTrendData'
    >
      <Form :model="treFormData" ref="treFormData" :rules="ruleValidate" class="mt20" :label-width="120" style="width: 100%;">
        <FormItem label="动态主题：" prop="name">
          <Input type="text" v-model="treFormData.name" :maxlength="80" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="厂家：" prop="vendorId">
          <Select v-model="treFormData.vendorId" style="width:400px" @on-change="getProductList">
            <Option v-for="(item,index) in vendorList" :value="item.vendorId" :key="index">{{ item.vendorName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="商品：">
          <Select v-model="treFormData.productId" style="width:400px">
            <Option v-for="(item,index) in productList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="动态内容：" prop="content">
          <Input type="textarea" v-model="treFormData.content" style="width: 400px;"></Input>
        </FormItem >
        <FormItem label="动态状态：">
          <RadioGroup v-model="treFormData.status">
            <Radio label="0">隐藏</Radio>
            <Radio label="1">展示</Radio>
            <Radio label="2">置顶</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem style="width: 200px!important;margin-top: 30px;">
          <Button type="primary" @click="productTreSub" :loading="proTreLoading">确认发布</Button>
        </FormItem>
      </Form>
    </Drawer>
    <!--修改-->
    <Drawer
      title="修改动态"
      v-model="trendReValue"
      width="720"
      :mask-closable="false"
      :styles="styles"
      @on-close = 'clearTrendReData'
    >
      <Form :model="treReData" ref="treReData" :rules="ruleValidate" class="mt20" :label-width="120" style="width: 100%;">
        <FormItem label="动态主题：" prop="name">
          <Input type="text" v-model="treReData.name" :maxlength="80" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="厂家：" prop="vendorId">
          <Select v-model="treReData.vendorId" style="width:400px" @on-change="reGetProList">
            <Option v-for="(item,index) in reVendorList" :value="item.vendorId" :key="index">{{ item.vendorName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="商品：">
          <Select v-model="treReData.productId" style="width:400px">
            <Option v-for="(item,index) in reProductList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="动态内容：" prop="content">
          <Input type="textarea" v-model="treReData.content" style="width: 400px;"></Input>
        </FormItem >
        <FormItem label="动态状态：">
          <RadioGroup v-model="treReData.status">
            <Radio label="0">隐藏</Radio>
            <Radio label="1">展示</Radio>
            <Radio label="2">置顶</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem style="width: 200px!important;margin-top: 30px;">
          <Button type="primary" @click="productTreReSub" :loading="proTreReLoading">确认修改</Button>
        </FormItem>
      </Form>
    </Drawer>
    <!--弹框-->
    <Modal
      title="提示"
      v-model="productTrendTip"
      :mask-closable = "false"
    >
      <p ref="productTrendTip"></p>
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
      callback(new Error('请填写动态主题'))
    } else {
      callback();
    }
  };
  const vendorValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请选择厂家'))
    } else {
      callback();
    }
  };
  const conValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写动态内容'))
    } else {
      callback();
    }
  };
  export default {
    name: "configureHealthProductTrend",
    data () {
      return {
        loading:false,
        total:'',
        productTrendTip:false,
        productTrendSuccess:false,
        trendValue:false,
        trendReValue:false,
        proTreLoading:false,
        proTreReLoading:false,
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        listParams:{
          name:'',
          status:'',
          pageNum:1,
          pageSize:10
        },
        statusList:[
          {
            value:2,
            label:'置顶'
          },
          {
            value:1,
            label:'展示'
          },
          {
            value:0,
            label:'隐藏'
          }
        ],
        vendorList:[],
        productList:[],
        listData:[],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'动态主题',
            key:'name',
            align:'center'
          },
          {
            title:'动态内容',
            key:'content',
            align:'center'
          },
          {
            title:'动态状态',
            align:'center',
            render:(h,params) => {
              if (params.row.status === 0) {
                return h('div',{
                  style:{
                    height:'100%'
                  }
                },'隐藏')
              } else if (params.row.status === 1) {
                return h('div',{
                  style:{
                    height:'100%'
                  }
                },'展示')
              } else if (params.row.status === 2) {
                return h('div',{
                  style:{
                    height:'100%'
                  }
                },'置顶')
              }
            }
          },
          {
            title:'创建时间',
            align:'center',
            render:(h,params) => {
              if (params.row.createTime && params.row.createTime !== '' && params.row.createTime != null) {
                return h('div',{
                  style:{
                    height:'100%'
                  }
                },this.$trans.getTime(params.row.createTime))
              }
            }
          },
          {
            title:'操作选项',
            align:'center',
            width:260,
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
                    this.trendReValue = true;
                    axios.HealthTrendVendors()
                      .then(res => {
                        //console.log(res);
                        if (res.code === '0') {
                          this.reVendorList = res.data;
                        }
                      })
                      .catch(error => {
                        console.log(error);
                      });
                    axios.HealthTrendProducts({vendorId:params.row.vendorId})
                      .then(res => {
                        //console.log(res);
                        if (res.code === '0') {
                          this.reProductList = res.data;
                        }
                      })
                      .catch(error => {
                        console.log(error);
                      });
                    this.treReData.id = params.row.id;
                    this.treReData.name = params.row.name;
                    this.treReData.vendorId = params.row.vendorId;
                    this.treReData.productId = params.row.productId;
                    this.treReData.content = params.row.content;
                    this.treReData.status = params.row.status.toString();
                  }
                }
              },'修改');
              const show = h('Button',{
                props:{
                  type: 'success',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    axios.HealthTrendSave({id:params.row.id,status:'1'})
                      .then(res => {
                        //console.log(res);
                        if (res.code === '0') {
                          this.getProTrendList();
                          this.productTrendTip = true;
                          this.$refs.productTrendTip.innerHTML = '操作成功！';
                        } else {
                          this.productTrendTip = true;
                          this.$refs.productTrendTip.innerHTML = '操作失败！';
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.productTrendTip = true;
                        this.$refs.productTrendTip.innerHTML = '操作失败！';
                      })
                  }
                }
              },'展示');
              const hide = h('Button',{
                props:{
                  type: 'warning',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    axios.HealthTrendSave({id:params.row.id,status:'0'})
                      .then(res => {
                        //console.log(res);
                        if (res.code === '0') {
                          this.getProTrendList();
                          this.productTrendTip = true;
                          this.$refs.productTrendTip.innerHTML = '操作成功！';
                        } else {
                          this.productTrendTip = true;
                          this.$refs.productTrendTip.innerHTML = '操作失败！';
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.productTrendTip = true;
                        this.$refs.productTrendTip.innerHTML = '操作失败！';
                      })
                  }
                }
              },'隐藏');
              const top = h('Button',{
                props:{
                  type: 'success',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    axios.HealthTrendSave({id:params.row.id,status:'2'})
                      .then(res => {
                        //console.log(res);
                        if (res.code === '0') {
                          this.getProTrendList();
                          this.productTrendTip = true;
                          this.$refs.productTrendTip.innerHTML = '操作成功！';
                        } else {
                          this.productTrendTip = true;
                          this.$refs.productTrendTip.innerHTML = '操作失败！';
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.productTrendTip = true;
                        this.$refs.productTrendTip.innerHTML = '操作失败！';
                      })
                  }
                }
              },'设为置顶');
              const cancelTop = h('Button',{
                props:{
                  type: 'error',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    axios.HealthTrendSave({id:params.row.id,status:'1'})
                      .then(res => {
                        //console.log(res);
                        if (res.code === '0') {
                          this.getProTrendList();
                          this.productTrendTip = true;
                          this.$refs.productTrendTip.innerHTML = '操作成功！';
                        } else {
                          this.productTrendTip = true;
                          this.$refs.productTrendTip.innerHTML = '操作失败！';
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.productTrendTip = true;
                        this.$refs.productTrendTip.innerHTML = '操作失败！';
                      })
                  }
                }
              },'取消置顶');
              const dele = h('Button',{
                props:{
                  type: 'error',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    let arr = [];
                    arr.push(params.row.id);
                    axios.HealthTrendDelete({ids:arr})
                      .then(res => {
                        //console.log(res);
                        this.productTrendTip = true;
                        this.$refs.productTrendTip.innerHTML = res.data;
                        if (res.code === '0') {
                          this.getProTrendList();
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.productTrendTip = true;
                        this.$refs.productTrendTip.innerHTML = '操作失败！';
                      })
                  }
                }
              },'删除');
              if (params.row.status === 0) {
                return h('div',[
                  revise,
                  show,
                  dele
                ])
              } else if (params.row.status === 1) {
                return h('div',[
                  revise,
                  hide,
                  top,
                  dele
                ])
              } else if (params.row.status === 2) {
                return h('div',[
                  revise,
                  hide,
                  cancelTop,
                  dele
                ])
              }
            }
          }
        ],
        treFormData:{
          name:'',
          vendorId:'',
          productId:'',
          content:'',
          status:'2'
        },
        treReData:{
          id:'',
          name:'',
          vendorId:'',
          productId:'',
          content:'',
          status:'2'
        },
        reVendorList:[],
        reProductList:[],
        ruleValidate:{
          name:[
            {validator:nameValidate}
          ],
          vendorId:[
            {validator:vendorValidate}
          ],
          content:[
            {validator:conValidate}
          ]
        },
      }
    },
    mounted () {
      this.getProTrendList();
    },
    methods:{
      //获取动态列表
      getProTrendList:function () {
        this.loading = true;
        axios.HealthTrendList(this.listParams)
          .then(res => {
            //console.log(res);
            //console.log(JSON.stringify(res.data[2]));
            if (res.code === '0') {
              this.loading = false;
              this.listData = res.data.list;
              this.total = res.data.total;
            } else {
              this.productTrendTip = true;
              this.$refs.productTrendTip.innerHTML = res.data;
            }
          })
          .catch(error => {
            console.log(error);
            this.productTrendTip = true;
            this.$refs.productTrendTip.innerHTML = '查询失败！'
          })
      },
      //获取厂家列表
      getVendorList:function () {
        axios.HealthTrendVendors()
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.vendorList = res.data;
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      //获取商品列表
      getProductList:function () {
        this.treFormData.productId = '';
        axios.HealthTrendProducts({vendorId:this.treFormData.vendorId})
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.productList = res.data;
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      reGetProList:function () {
        this.treReData.productId = '';
        axios.HealthTrendProducts({vendorId:this.treReData.vendorId})
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.reProductList = res.data;
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      addHealthTrend:function () {
        this.trendValue = true;
        this.getVendorList();
      },
      clickData:function () {
        this.listParams.pageNum = 1;
        this.getProTrendList();
      },
      pageChange:function (page) {
        this.listParams.pageNum = page;
        this.getProTrendList();
      },
      del:function () {
        this.productTrendTip = false;
      },
      clearTrendData:function () {
        this.$refs.treFormData.resetFields();
        this.treFormData.status = '2';
        this.productList = [];
      },
      productTreSub:function () {
        this.$refs.treFormData.validate(valid => {
          if (valid) {
            this.proTreLoading = true;
            //console.log(this.treFormData);
            axios.HealthTrendSave(this.treFormData)
              .then(res => {
                //console.log(res);
                this.proTreLoading = false;
                if (res.code === '0') {
                  this.clearTrendData();
                  this.trendValue = false;
                  this.productTrendTip = true;
                  this.$refs.productTrendTip.innerHTML = '发布成功！';
                  this.listParams.pageNum = 1;
                  this.getProTrendList();
                } else {
                  this.productTrendTip = true;
                  this.$refs.productTrendTip.innerHTML = '发布失败！';
                }
              })
              .catch(error => {
                console.log(error);
                this.proTreLoading = false;
                this.productTrendTip = true;
                this.$refs.productTrendTip.innerHTML = '发布失败！';
              })
          }
        })
      },
      clearTrendReData:function () {
        this.$refs.treReData.resetFields();
        this.treFormData.status = '2';
        this.reVendorList = [];
        this.reProductList = [];
      },
      productTreReSub:function () {
        this.$refs.treReData.validate(valid => {
          if (valid) {
            //console.log(this.treReData.vendorId);
            //console.log(this.treReData.productId);
            this.proTreReLoading = true;
            axios.HealthTrendSave(this.treReData)
              .then(res => {
                this.proTreReLoading = false;
                if (res.code === '0') {
                  this.trendReValue = false;
                  this.productTrendTip = true;
                  this.$refs.productTrendTip.innerHTML = '修改成功！';
                  this.getProTrendList();
                } else {
                  this.productTrendTip = true;
                  this.$refs.productTrendTip.innerHTML = '修改失败！';
                }
              })
              .catch(error => {
                console.log(error);
                this.proTreReLoading = false;
                this.productTrendTip = true;
                this.$refs.productTrendTip.innerHTML = '修改失败！';
              })
          }
        })
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
</style>
