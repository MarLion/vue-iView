<template>
  <div class="knowledge-container content-pad">
    <div class="community-fun">
      <div class="community-ope">
        <Button type="default" icon="md-add" @click="addKnow">添加健康知识</Button>
      </div>
      <div class="community-search">
        <span class="ml15">文章名称：</span>
        <span><Input class="middle-checkWid" v-model="listParams.title"/></span>
        <span class="ml15">所属分类：</span>
        <span>
          <Select class="middle-checkWid" v-model="listParams.mold" @on-change="getHealthCategoryByClass">
            <Option v-for="item in classList" :value="item.value" :key="item.value">{{item.label}}</Option>
          </Select>
        </span>
        <span class="ml15">所属类别：</span>
        <span>
          <Select class="middle-checkWid" v-model="listParams.category">
            <Option v-for="item in modelList" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
        </span>
        <span class="ml15">文章类型：</span>
        <span>
          <Select class="middle-checkWid" v-model="listParams.type">
            <Option v-for="(item,index) in typeList" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select>
        </span>
        <span class="ml15">文章状态：</span>
        <span>
          <Select class="middle-checkWid" v-model="listParams.showHidden">
            <Option v-for="(item,index) in statusList" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select>
        </span>
        <span class="ml10"><Button icon="ios-search" @click="knowArticle">查询</Button></span>
      </div>
    </div>
    <div class="community-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading"></Table>
      <Page :total="total" :current="listParams.pageNum" v-if="total>10" show-elevator show-total @on-change="knowPageChange" class="mt30"/>
    </div>
    <Modal title="查看大图" v-model="tabBig">
      <img :src="tabUrl" style="width: 100%">
      <div slot="footer"></div>
    </Modal>
    <!--添加知识-->
    <Drawer
      title="发布健康知识"
      v-model="knowValue"
      width="1200"
      :mask-closable="false"
      :styles="styles"
      @on-close="clearKnowData"
    >
      <Form :model="knowFormData" ref="knowForm" :rules="ruleValidate" style="width: 100%;margin-top: 20px;">
        <FormItem label="所属分类：" :label-width="120" prop="mold">
          <Select v-model="knowFormData.mold" @on-change="getAddCategory" style="width: 400px;">
            <Option v-for="(item,index) in addMoldList" :key="index" :value="item.value">
              {{item.label}}
            </Option>
          </Select>
        </FormItem>
        <template v-if="knowFormData.mold === 0">
          <FormItem label="所属类别：" :label-width="120" prop="category">
            <Select v-model="knowFormData.category" @on-change="categoryChange" :label-in-value="true" style="width: 400px;">
              <Option v-for="(item,index) in existModal" :key="index" :value="item.id">
                {{item.name}}
              </Option>
            </Select>
          </FormItem>
        </template>
        <template v-else>
          <FormItem label="所属类别：" :label-width="120" prop="productTypeId">
            <Select v-model="knowFormData.productTypeId" @on-change="judgeValidate" style="width: 400px;">
              <Option v-for="(item,index) in existModal" :key="index" :value="item.id">
                {{item.name}}
              </Option>
            </Select>
          </FormItem>
        </template>
        <!--<template v-show="audit && knowFormData.mold === 0">-->
          <FormItem label="专家姓名：" prop="name" :label-width="120" v-show="( audit && knowFormData.mold === 0 ) || study">
            <Input type="text" :maxlength="80" v-model="knowFormData.name" style="width: 400px;"></Input>
          </FormItem>
          <FormItem v-show="audit && knowFormData.mold === 0">
            <upload-view ref="proPic" :upload-url="uploadUrl" title="专家头像" :length="1" :width="120" con-width="100%" v-on:success-callback="successPicPath" v-on:remove-callback="removePicPath"></upload-view>
          </FormItem>
          <FormItem label="专家职称：" prop="profession" :label-width="120" v-show="( audit && knowFormData.mold === 0 ) || study">
            <Input type="text" :maxlength="80" v-model="knowFormData.profession" style="width: 400px;"></Input>
          </FormItem>
          <FormItem label="内容摘要：" prop="description" :label-width="120" v-show="audit && knowFormData.mold === 0">
            <Input type="textarea" v-model="knowFormData.description" style="width: 400px"></Input>
          </FormItem>
        <!--</template>-->
        <!--<template v-show="!audit || knowFormData.mold === 1">-->
          <FormItem label="文章标题：" prop="title" :label-width="120" v-show="!audit || knowFormData.mold === 1">
            <Input type="text" :maxlength="80" v-model="knowFormData.title" style="width: 400px;"></Input>
          </FormItem>
          <FormItem label="副标题：" prop="subhead" :label-width="120" v-show="!audit || knowFormData.mold === 1">
            <Input type="text" :maxlength="80" v-model="knowFormData.subhead" style="width: 400px;"></Input>
          </FormItem>
          <FormItem label="文章类型：" prop="type" :label-width="120" v-show="!audit || knowFormData.mold === 1">
            <Select style="width:400px" v-model="knowFormData.type">
              <Option v-for="(item,index) in knowTypeList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem v-show="!audit || knowFormData.mold === 1">
            <upload-view ref="knowCover" :upload-url="uploadUrl" title="文章封面" :length="1" :width="120" con-width="100%" v-on:success-callback="successKnowPath" v-on:remove-callback="removeKnowPath"></upload-view>
          </FormItem>
          <FormItem label="文章内容：" :label-width="120" v-show="!audit || knowFormData.mold === 1">
            <!--这里使用的是封装的富文本组件 有时间可以将以前的富文本编辑器替换成组件-->
            <editor-view ref="knowContent" :upload-url="uploadUrl" v-on:transmit-con="getKnowContent"></editor-view>
          </FormItem>
          <FormItem v-show="!audit || knowFormData.mold === 1">
            <!--封装的视频上传组件 可以将以前的视频上传替换成组件-->
            <video-view ref="knowVideo" :upload-url="uploadUrl" title="文章视频" :length="1" :width="120" con-width="100%" v-on:success-callback="successKnowVideo" v-on:remove-callback="removeKnowVideo"></video-view>
          </FormItem>
        <!--</template>-->
        <FormItem style="width: 200px!important;" :label-width="120">
          <Button type="primary" @click="knowSub" :loading="knowLoading">确认添加</Button>
        </FormItem>
      </Form>
    </Drawer>
    <!--详情-->
    <Drawer
      title="知识详情"
      v-model="knowDetailValue"
      width="1200"
      :mask-closable="false"
      :styles="styles"
      @on-close="clearKnowDetailData"
    >
      <div v-show="knowDetailData.description !== ''">
        <div class="add-detail">
          <p class="p">专家姓名：</p>
          <p class="detailSpan">{{knowDetailData.name}}</p>
        </div>
        <div class="divs mt30">
          <p class="p">专家头像：</p>
          <div class="add-image">
            <div class="demo-upload-list">
              <img :src="knowDetailData.pic">
            </div>
          </div>
        </div>
        <div class="add-detail">
          <p class="p">专家职称：</p>
          <p class="detailSpan">{{knowDetailData.profession}}</p>
        </div>
        <div class="add-detail">
          <p class="p">内容摘要：</p>
          <p class="detailSpan">{{knowDetailData.description}}</p>
        </div>
      </div>
      <div v-show="knowDetailData.description === ''">
        <h1 style="text-align: center;">{{knowDetailData.title}}</h1>
        <h3 style="text-align: center;" class="mt20">{{knowDetailData.subhead}}</h3>
        <div class="mt30 article" ref="deContent"></div>
        <video :src="knowDetailData.videoPath" v-if="isVideo" controls="controls" style="width: 50%;margin: 30px auto 0;display: block;"></video>
      </div>
    </Drawer>
    <!---修改-->
    <Drawer
      title="知识修改"
      v-model="knowReviseValue"
      width="1200"
      :mask-closable="false"
      :styles="styles"
      @on-close="clearKnowReviseData"
    >
      <Form :model="knowReviseFormData" ref="knowReForm" :rules="reRuleValidate" style="width: 100%;margin-top: 20px;">
        <FormItem label="所属分类：" :label-width="120" prop="mold">
          <Select v-model="knowReviseFormData.mold" disabled style="width: 400px;">
            <Option v-for="(item,index) in addMoldList" :key="index" :value="item.value">
              {{item.label}}
            </Option>
          </Select>
        </FormItem>
        <template v-if="knowReviseFormData.mold === 0">
          <FormItem label="所属类别：" :label-width="120" prop="category">
            <Select v-model="knowReviseFormData.category" disabled  style="width: 400px;">
              <Option v-for="(item,index) in reExistModal" :key="index" :value="item.id">
                {{item.name}}
              </Option>
            </Select>
          </FormItem>
        </template>
        <template v-else>
          <FormItem label="所属类别：" :label-width="120" prop="productTypeId">
            <Select v-model="knowReviseFormData.productTypeId" style="width: 400px;">
              <Option v-for="(item,index) in reExistModal" :key="index" :value="item.id">
                {{item.name}}
              </Option>
            </Select>
          </FormItem>
        </template>
        <FormItem label="专家姓名：" prop="name" :label-width="120" v-show="knowReviseFormData.name !== ''">
          <Input type="text" :maxlength="80" v-model="knowReviseFormData.name" style="width: 400px;"></Input>
        </FormItem>
        <FormItem v-show="knowReviseFormData.description !== ''">
          <revise-upload-view ref="rePic" :upload-url="uploadUrl" title="专家头像" :length="1" :width="120" con-width="100%" :default-list="defaultHead" :list-value="isHead" v-on:success-callback="picReSuccess" v-on:remove-callback="picReRemove"></revise-upload-view>
        </FormItem>
        <FormItem label="专家职称：" prop="profession" :label-width="120" v-show="knowReviseFormData.name !== ''">
          <Input type="text" :maxlength="80" v-model="knowReviseFormData.profession" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="内容摘要：" prop="description" :label-width="120"v-show="knowReviseFormData.description !== ''">
          <Input type="textarea" v-model="knowReviseFormData.description" style="width: 400px"></Input>
        </FormItem>
        <FormItem label="文章标题：" prop="title" :label-width="120" v-show="knowReviseFormData.description === ''">
          <Input type="text" :maxlength="80" v-model="knowReviseFormData.title" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="副标题：" prop="subhead" :label-width="120" v-show="knowReviseFormData.description === ''">
          <Input type="text" :maxlength="80" v-model="knowReviseFormData.subhead" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="文章类型：" prop="type" :label-width="120"  v-show="knowReviseFormData.description === ''">
          <Select style="width:400px" v-model="knowReviseFormData.type">
            <Option v-for="(item,index) in knowTypeList" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem  v-show="knowReviseFormData.description === ''">
          <revise-upload-view ref="knowCoverRe" :upload-url="uploadUrl" title="文章封面" :length="1" :width="120" con-width="100%" :default-list="defaultCover" :list-value="isShow" v-on:success-callback="coverReSuccess" v-on:remove-callback="coverReRemove"></revise-upload-view>
        </FormItem>
        <FormItem label="文章内容：" :label-width="120"  v-show="knowReviseFormData.description === ''">
          <revise-editor-view ref="knowEdRe" :upload-url="uploadUrl" :original-content="knowReviseFormData.content" :watch-value="isWatch" v-on:transmit-con="getReviseContent"></revise-editor-view>
        </FormItem>
        <FormItem  v-show="knowReviseFormData.description === ''">
          <revise-video-view ref="knowVideoRe" :upload-url="uploadUrl" title="文章视频" :length="1" :width="120" con-width="100%" :default-list="defaultVideo" :watch-value="isVideoShow" v-on:success-callback="videoReSuccess" v-on:remove-callback="videoReRemove"></revise-video-view>
        </FormItem>
        <FormItem style="width: 200px!important;" :label-width="120">
          <Button type="primary" @click="knowReSub" :loading="knowReLoading">确认修改</Button>
        </FormItem>
      </Form>
    </Drawer>
    <!--弹框-->
    <Modal
      title="提示"
      v-model="knowTip"
      :mask-closable = "false"
    >
      <p ref="knowTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
    <Modal
      title="提示"
      v-model="knowSuccess"
      :mask-closable = "false"
    >
      <p ref="knowSuccess"></p>
      <div slot="close"></div>
      <div slot="footer">
        <Button type="warning"  @click="goKnowList">返回列表</Button>
        <Button type="info"  @click="addKnowMore">继续添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "../../axios/axios";
  import * as base from '../../axios/base';
  import Trigger from "iview/src/components/split/trigger";
  const nameValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写专家姓名'))
    } else {
      callback();
    }
  };
  const fessionValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写专家职称'))
    } else {
      callback();
    }
  };
  const deValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写摘要'))
    } else {
      callback();
    }
  };
  const moValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请选择知识分类'))
    } else {
      callback();
    }
  };
  const caValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请选择知识类别'))
    } else {
      callback();
    }
  };
  const proValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请选择知识类别'))
    } else {
      callback();
    }
  };
  const titleValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写标题'))
    } else {
      callback();
    }
  };
  const subValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写副标题'))
    } else {
      callback();
    }
  };
  const typeValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请选择分类'))
    } else {
      callback();
    }
  };
  export default {
    name: "configureHealthKnowledge",
    components: {Trigger},
    data () {
      return {
        uploadUrl:base.baseUrl.serviceTwo + 'documents/saveFiles',
        total:'',
        loading:false,
        knowValue:false,
        knowLoading:false,
        knowReLoading:false,
        knowTip:false,
        knowSuccess:false,
        tabBig:false,
        audit:false,
        study:false,
        tabUrl:'',
        classList:[
          {
            value:0,
            label:'健康文化'
          },
          {
            value:1,
            label:'健康小常识'
          },
          {
            value:2,
            label:'不限'
          }
        ],
        modelList:[],
        typeList:[
          {
            label:'文章',
            value:0
          },
          {
            label:'视频',
            value:1
          },
          {
            label:'文章+视频',
            value:2
          },
          {
            label:'不限',
            value:3
          }
        ],
        statusList:[
          {
            label:'展示中',
            value:1
          },
          {
            label:'隐藏中',
            value:0
          },
          {
            label:'不限',
            value:2
          }
        ],
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        listParams:{
          title:'',
          mold:'',
          category:'',
          type:'',
          showHidden:'',
          pageNum:1,
          pageSize:10,
          owenrId:''
        },
        listData:[],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'标题',
            key:'title',
            align:'center'
          },
          {
            title:'所属分类',
            key:'moldText',
            align:'center'
          },
          {
            title:'所属类别',
            key:'categoryText',
            align:'center'
          },
          {
            title:'封面',
            align:'center',
            render:(h,params) => {
              return h('img',{
                attrs:{
                  src:params.row.backPic
                },
                style:{
                  height:'50px',
                  borderRadius:'5px',
                  cursor:'pointer'
                },
                on:{
                  click:() => {
                    this.tabBig = true;
                    this.tabUrl = params.row.backPic;
                  }
                }
              })
            }
          },
          {
            title:'是否展示',
            key:'showHiddenText',
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
            width:200,
            render:(h,params) => {
              const detail = h('Button',{
                props:{
                  type: 'success',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    axios.HealthKnowDetail({id:params.row.id})
                      .then(res => {
                        console.log(res);
                        if (res.code === '0') {
                          this.knowDetailValue = true;
                          if (res.data.description === '') {
                            if (res.data.videoPath != null && res.data.videoPath !== '') {
                              this.isVideo = true;
                              this.knowDetailData.videoPath = res.data.videoPath;
                            } else {
                              this.isVideo = false;
                              this.knowDetailData.videoPath = '';
                            }
                            this.knowDetailData.title = res.data.title;
                            this.knowDetailData.subhead = res.data.subhead;
                            this.$refs.deContent.innerHTML = res.data.content;
                          } else {
                            this.knowDetailData.name = res.data.name;
                            this.knowDetailData.pic = res.data.pic;
                            this.knowDetailData.profession = res.data.profession;
                            this.knowDetailData.description = res.data.description;
                          }
                        } else {
                          this.knowTip = true;
                          this.$refs.knowTip.innerHTML = '文章详情查询出错！';
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.knowTip = true;
                        this.$refs.knowTip.innerHTML = '文章详情查询出错！';
                      })
                  }
                }
              },'详情');
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
                    axios.HealthKnowDetail({id:params.row.id})
                      .then(res => {
                        //console.log(JSON.stringify(res.data));
                        if (res.code === '0') {
                          this.knowReviseValue = true;
                          this.knowReviseFormData.id = res.data.id;
                          this.knowReviseFormData.mold = res.data.mold;
                          if (res.data.mold === 0) {
                            this.knowReviseFormData.category = res.data.category;
                          } else {
                            this.knowReviseFormData.productTypeId = res.data.productTypeId;
                          }
                          this.getReviewModal();
                          if (res.data.description === '') {
                            if (res.data.name === '') {
                              this.reRuleValidate = {
                                mold:[
                                  {validator:moValidate}
                                ],
                                category:[
                                  {validator:caValidate}
                                ],
                                productTypeId:[
                                  {validator:proValidate}
                                ],
                                title:[
                                  {validator:titleValidate}
                                ],
                                subhead:[
                                  {validator:subValidate}
                                ],
                                type:[
                                  {validator:typeValidate}
                                ]
                              };
                            } else {
                              this.reRuleValidate = {
                                name:[
                                  {validator:nameValidate}
                                ],
                                profession:[
                                  {validator:fessionValidate}
                                ],
                                mold:[
                                  {validator:moValidate}
                                ],
                                category:[
                                  {validator:caValidate}
                                ],
                                productTypeId:[
                                  {validator:proValidate}
                                ],
                                title:[
                                  {validator:titleValidate}
                                ],
                                subhead:[
                                  {validator:subValidate}
                                ],
                                type:[
                                  {validator:typeValidate}
                                ]
                              };
                            }
                            this.isShow = true;
                            this.isWatch = true;
                            this.isVideoShow = true;
                            this.knowReviseFormData.title = res.data.title;
                            this.knowReviseFormData.subhead = res.data.subhead;
                            this.knowReviseFormData.type = res.data.type;
                            this.knowReviseFormData.content = res.data.content;
                            this.knowReviseFormData.backPic = res.data.backPic;
                            this.knowReviseFormData.videoPath = res.data.videoPath;
                            //封面是必传的 backPic不为空 可以不做判断
                            this.defaultCover.push({url:res.data.backPic,name:res.data.title,status:'finished'});
                            //视频不是必传的 videoPath可能为空 需要做判断
                            if (res.data.videoPath != null && res.data.videoPath !== '') {
                              this.defaultVideo.push({url:res.data.videoPath,name:res.data.title,status:'finished'});
                            } else {
                              this.defaultVideo = [];
                            }
                          } else {
                            this.reRuleValidate = {
                              name:[
                                {validator:nameValidate}
                              ],
                              profession:[
                                {validator:fessionValidate}
                              ],
                              description:[
                                {validator:deValidate}
                              ],
                              mold:[
                                {validator:moValidate}
                              ]
                            };
                            this.isHead = true;
                            this.knowReviseFormData.name = res.data.name;
                            this.knowReviseFormData.pic = res.data.pic;
                            this.knowReviseFormData.profession = res.data.profession;
                            this.knowReviseFormData.description = res.data.description;
                            if (res.data.pic != null && res.data.pic !== '') {
                              this.defaultHead.push({url:res.data.pic,name:res.data.name,status:'finished'})
                            } else {
                              this.defaultHead = [];
                            }
                          }

                        } else {
                          this.knowTip = true;
                          this.$refs.knowTip.innerHTML = '文章详情查询出错！';
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.knowTip = true;
                        this.$refs.knowTip.innerHTML = '文章详情查询出错！';
                      })
                  }
                }
              },'修改');
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
                    axios.HealthKnowShowOrHide({id:params.row.id,showHidden:1})
                      .then(res => {
                        //console.log(res);
                        if (res.code === '0') {
                          this.knowTip = true;
                          this.$refs.knowTip.innerHTML = '操作成功！';
                          this.getKnowList();
                        } else {
                          this.knowTip = true;
                          this.$refs.knowTip.innerHTML = '操作失败！'
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.knowTip = true;
                        this.$refs.knowTip.innerHTML = '操作失败！'
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
                    axios.HealthKnowShowOrHide({id:params.row.id,showHidden:0})
                      .then(res => {
                        //console.log(res);
                        if (res.code === '0') {
                          this.knowTip = true;
                          this.$refs.knowTip.innerHTML = '操作成功！';
                          this.getKnowList();
                        } else {
                          this.knowTip = true;
                          this.$refs.knowTip.innerHTML = '操作失败！'
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.knowTip = true;
                        this.$refs.knowTip.innerHTML = '操作失败！'
                      })
                  }
                }
              },'隐藏');
              if (params.row.showHidden === 0) {
                return h('div',[
                  detail,
                  revise,
                  show
                ])
              } else {
                return h('div',[
                  detail,
                  revise,
                  hidden
                ])
              }
            }
          }
        ],
        //新增数据
        addMoldList:[
          {
            value:0,
            label:'健康文化'
          },
          {
            value:1,
            label:'健康小常识'
          },
        ],
        existModal:[],
        knowTypeList:[
          {
            value:0,
            label:'文章'
          },
          {
            value:1,
            label:'视频'
          },
          {
            value:2,
            label:'文章+视频'
          }
        ],
        knowFormData:{
          //大讲堂
          name:'',
          pic:'',
          profession:'',
          description:'',
          //其他
          title:'',
          subhead:'',
          mold:0,
          category:'',  //mold为0时赋值
          productTypeId:'',  //mold为1是赋值
          content:'',
          type:'',
          backPic:'',
          videoPath:'',
          owenrId:''
        },
        //详情数据
        knowDetailValue:false,
        isVideo:false,
        knowDetailData:{
          //大讲堂
          name:'',
          pic:'',
          profession:'',
          description:'',
          //其他
          title:'',
          subhead:'',
          videoPath:'',
        },
        //修改数据
        reExistModal:[],
        knowReviseValue:false,
        isShow:false,
        isWatch:false,
        isVideoShow:false,
        isHead:false,
        defaultCover:[],
        defaultVideo:[],
        defaultHead:[],
        knowReviseFormData:{
          //大讲堂
          name:'',
          pic:'',
          profession:'',
          description:'',
          //其他
          id:'',
          title:'',
          subhead:'',
          mold:'',
          category:'0',  //mold为0时赋值
          productTypeId:'0',  //mold为1是赋值
          content:'',
          type:'',
          backPic:'',
          videoPath:'',
          owenrId:''
        },
        ruleValidate:{
          // name:[
          //   {validator:nameValidate}
          // ],
          // profession:[
          //   {validator:fessionValidate}
          // ],
          // description:[
          //   {validator:deValidate}
          // ],
          // mold:[
          //   {validator:moValidate}
          // ],
          // category:[
          //   {validator:caValidate}
          // ],
          // productTypeId:[
          //   {validator:proValidate}
          // ],
          // title:[
          //   {validator:titleValidate}
          // ],
          // subhead:[
          //   {validator:subValidate}
          // ],
          // type:[
          //   {validator:typeValidate}
          // ]
        },
        reRuleValidate:{},
      }
    },
    mounted () {
      if (sessionStorage.getItem('userId') != null) {
        this.$store.state.user_id = sessionStorage.getItem('userId');
      }
      this.listParams.owenrId = this.userId;
      this.knowFormData.owenrId = this.userId;
      this.knowReviseFormData.owenrId = this.userId;
      this.getKnowList();
    },
    computed:{
      userId:function () {
        return this.$store.state.user_id;
      }
    },
    methods:{
      //查询列表时根据分类获取知识类别
      getHealthCategoryByClass:function () {
        axios.HealthCategoryByCalss({mold:this.listParams.mold})
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.modelList = res.data;
            } else {
              this.knowTip = true;
              this.$refs.knowTip.innerHTML = '类别查询出错！';
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      //新增文章时查询类别
      getAddCategory: function () {
        this.knowFormData.category = '';
        this.knowFormData.productTypeId = '';
        this.judgeValidate();
        axios.HealthCategoryByCalss({mold:this.knowFormData.mold})
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.existModal = res.data;
              this.existModal.forEach((item,index) => {
                if (item.name === '不限') {
                  this.existModal.splice(index,1);
                }
              });
            } else {
              this.knowTip = true;
              this.$refs.knowTip.innerHTML = '类别查询出错！';
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      judgeValidate:function () {
        if (this.audit) {
          this.ruleValidate = {
            name:[
              {validator:nameValidate}
            ],
            profession:[
              {validator:fessionValidate}
            ],
            description:[
              {validator:deValidate}
            ],
            mold:[
              {validator:moValidate}
            ]
          }
        }
        if (this.study) {
          this.ruleValidate = {
            name:[
              {validator:nameValidate}
            ],
            profession:[
              {validator:fessionValidate}
            ],
            mold:[
              {validator:moValidate}
            ],
            category:[
              {validator:caValidate}
            ],
            productTypeId:[
              {validator:proValidate}
            ],
            title:[
              {validator:titleValidate}
            ],
            subhead:[
              {validator:subValidate}
            ],
            type:[
              {validator:typeValidate}
            ]
          }
        }
        if (!this.audit && !this.study) {
          this.ruleValidate = {
            mold:[
              {validator:moValidate}
            ],
            category:[
              {validator:caValidate}
            ],
            productTypeId:[
              {validator:proValidate}
            ],
            title:[
              {validator:titleValidate}
            ],
            subhead:[
              {validator:subValidate}
            ],
            type:[
              {validator:typeValidate}
            ]
          }
        }
      },
      reModalChange:function () {
        this.knowReviseFormData.category = '';
        this.knowReviseFormData.productTypeId = '';
        this.getReviewModal();
      },
      getReviewModal:function () {
        axios.HealthCategoryByCalss({mold:this.knowReviseFormData.mold})
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.reExistModal = res.data;
              this.reExistModal.forEach((item,index) => {
                if (item.name === '不限') {
                  this.reExistModal.splice(index,1);
                }
              });
            } else {
              this.knowTip = true;
              this.$refs.knowTip.innerHTML = '类别查询出错！';
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      //获取文章列表
      getKnowList:function () {
        this.loading = true;
        axios.HealthKnowList(this.listParams)
          .then(res => {
            //console.log(JSON.stringify(res.data.list[0]));
            this.loading = false;
            this.listData = res.data.list;
            this.total = res.data.total;
          })
          .catch(error => {
            console.log(error);
            this.knowTip = true;
            this.$refs.knowTip.innerHTML = '查询出错！';
          })
      },
      addKnow:function () {
        this.knowValue = true;
        this.getAddCategory();
      },
      knowArticle:function () {
        this.listParams.pageNum = 1;
        this.getKnowList();
      },
      knowPageChange:function (page) {
        this.listParams.pageNum = page;
        this.getKnowList();
      },
      successKnowPath:function (file) {
        this.knowFormData.backPic = file.url;
      },
      removeKnowPath:function () {
        this.knowFormData.backPic = '';
      },
      getKnowContent:function (con) {
        //console.log(con);
        this.knowFormData.content = con;
      },
      successKnowVideo:function (file) {
        this.knowFormData.videoPath = file.url;
      },
      removeKnowVideo:function () {
        this.knowFormData.videoPath = '';
      },
      knowSub:function () {
        this.$refs.knowForm.validate(valid => {
          if (valid) {
            this.knowLoading = true;
            //console.log(this.knowFormData);
            axios.HealthKnowAdd(this.knowFormData)
              .then(res => {
                //console.log(res);
                this.knowLoading = false;
                if (res.code === '0') {
                  this.knowSuccess = true;
                  this.$refs.knowSuccess.innerHTML = res.data;
                  this.getKnowList();
                } else {
                  this.knowTip = true;
                  this.$refs.knowTip.innerHTML =  res.data;
                }
              })
              .catch(error => {
                console.log(error);
                this.knowLoading = false;
                this.knowTip = true;
                this.$refs.knowTip.innerHTML = '保存失败！';
              })
          }
        })
      },
      clearKnowData:function () {
        this.$refs.knowForm.resetFields();
        this.knowFormData.pic = '';
        this.$refs.proPic.clearUpload();
        this.knowFormData.backPic = '';
        this.knowFormData.videoPath = '';
        this.$refs.knowCover.clearUpload();
        this.$refs.knowContent.clearData();
        this.$refs.knowVideo.clearUpload();
        this.knowFormData.mold = 0;
        //this.existModal = [];
        this.audit = false;
      },
      del:function () {
        this.knowTip = false;
      },
      goKnowList:function () {
        this.clearKnowData();
        this.knowSuccess = false;
        this.knowValue = false;
      },
      addKnowMore:function () {
        this.clearKnowData();
        this.knowSuccess = false;
      },
      //详情
      clearKnowDetailData:function () {
        this.knowDetailData.name = '';
        this.knowDetailData.pic = '';
        this.knowDetailData.profession = '';
        this.knowDetailData.description = '';
        this.knowDetailData.title = '';
        this.knowDetailData.subhead = '';
        this.knowDetailData.videoPath = '';
        this.isVideo = false;
      },
      //修改
      coverReSuccess:function (file,title,fileList) {
        this.knowReviseFormData.backPic= file.url;
      },
      coverReRemove:function (file) {
        this.knowReviseFormData.backPic= '';
      },
      getReviseContent:function (con) {
        //console.log(con);
        this.knowReviseFormData.content = con;
      },
      videoReSuccess:function (file,title,fileList) {
        this.knowReviseFormData.videoPath= file.url;
      },
      videoReRemove:function (file) {
        this.knowReviseFormData.videoPath= '';
      },
      knowReSub:function () {
        this.$refs.knowReForm.validate(valid => {
          if (valid) {
            this.knowReLoading = true;
            //console.log(this.knowReviseFormData);
            axios.HealthKnowAdd(this.knowReviseFormData)
              .then(res => {
                //console.log(res);
                this.knowReLoading = false;
                this.knowReviseValue = false;
                this.clearKnowReviseData();
                this.knowTip = true;
                this.$refs.knowTip.innerHTML = res.data;
                if (res.code === '0') {
                  this.getKnowList();
                }
              })
              .catch(error => {
                console.log(error);
                this.knowReLoading = false;
                this.knowTip = true;
                this.$refs.knowTip.innerHTML = '保存失败！';
              })
          }
        })
      },
      clearKnowReviseData:function () {
        this.reExistModal = [];
        this.isShow = false;
        this.isWatch = false;
        this.isVideoShow = false;
        this.isHead = false;
        this.$refs.knowCoverRe.clearUpload();
        this.$refs.knowEdRe.clearData();
        this.$refs.knowVideoRe.clearUpload();
        this.$refs.rePic.clearUpload();
        this.$refs.knowReForm.resetFields();
        this.knowReviseFormData.id = '';
        this.defaultCover = [];
        this.defaultVideo = [];
        this.defaultHead = [];
        this.knowReviseFormData.backPic= '';
        this.knowReviseFormData.content= '';
        this.knowReviseFormData.videoPath= '';
        this.knowReviseFormData.pic= '';
      },
      categoryChange:function (item) {
        this.audit = item && item.label.replace(/\s*/g,"") === '健康大讲堂';
        this.study = item && item.label.replace(/\s*/g,"") === '健康文献';
        this.judgeValidate();
      },
      successPicPath:function (file,title,fileList) {
        this.knowFormData.pic = file.url;
      },
      removePicPath:function () {
        this.knowFormData.pic = '';
      },
      picReSuccess:function (file,title,fileList) {
        this.knowReviseFormData.pic = file.url;
      },
      picReRemove:function () {
        this.knowReviseFormData.pic = '';
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
  .article {
    //text-align: left;
    text-indent: 2em;
    img {
      text-align: center
    }
  }
  .detailSpan{
    padding: 10px 0;
  }
  .detailWidth{
    width: 1000px;
    padding: 10px 12px 10px 0;
  }
  .divs{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    .p{
      width: 120px;
      height: 90px;
      line-height: 90px;
      text-align: right;
      padding: 10px 12px 10px 0;
    }
    .add-image{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: wrap;
      width: 1050px;
    }
  }
  .add-detail{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-top: 40px;
    .p{
      width: 120px;
      text-align: right;
      padding: 10px 12px 10px 0;
    }
  }
  .demo-upload-list{
    display: inline-block;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
</style>
