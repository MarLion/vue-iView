<template>
  <div class="upload-container" :style="{width:this.conWidth}">
    <div class="divs">
      <p class="p" :style="{width: this.width + 'px'}">{{title}}：</p>
      <div class="add-image mt10">
        <div class="demo-upload-list" v-for="item in uploadList">
          <template v-if="item.status === 'finished'">
            <img :src="item.url">
            <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
            </div>
          </template>
          <template v-else>
            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
          </template>
        </div>
        <Upload :action="uploadUrl"
                ref="upload"
                :show-upload-list="false"
                :data="params"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png','bmp']"
                :on-format-error="handleFormatError"
                :before-upload="handleBeforeUpload"
                multiple
                type="drag"
                style="display: inline-block;width:100px;">
          <div style="width: 100px;height:100px;line-height: 100px;">
            <Icon type="ios-camera" size="40"></Icon>
          </div>
        </Upload>
        <modal title="查看照片" v-model="visible">
          <img :src="bigUrl" style="width: 100%">
          <div slot="footer"></div>
        </modal>
      </div>
    </div>
    <Modal
      title="提示"
      v-model="tip"
      :mask-closable = "false"
    >
      <p ref="tip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "../../axios/axios";
  export default {
    name: "upload",
    props:{
      uploadUrl:{}, //照片上传地址
      title:{},     //照片标题
      length:{},    //允许上传几张照片
      width:{},     //标题宽度 px
      conWidth:{},  //组件宽度 百分比
      params:{}   //上传附件时的额外参数
    },
    data () {
      return {
        uploadList:[],
        visible:false,
        bigUrl:'',
        tip:false
      }
    },
    mounted () {
      this.uploadList = this.$refs.upload.fileList;
    },
    methods:{
      handleView:function (url) {
        this.visible = true;
        this.bigUrl = url;
      },
      handleRemove:function (file) {
        //删除的时候从服务器上删除
        //console.log(file.url);
        axios.CommunityDeleteImg({fileUrl:file.url})
          .then(res => {
            //console.log(res);
            if (res.code === 200) {
              const fileList = this.$refs.upload.fileList;
              this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
              this.$emit('remove-callback',file,this.uploadList);  //这里将uploadList传出 是在多张图的情况下删掉一张 遍历list获取剩下的url
            } else {
              this.tip = true;
              this.$refs.tip.innerHTML = res.message;
            }
          })
          .catch(error => {
            console.log(error);
            this.tip = true;
            this.$refs.tip.innerHTML = '图片删除失败！';
          })
      },
      handleSuccess:function (res,file,fileList) {
        //console.log(res);
        if (res.code === 200) {
          file.url = res.result;
          this.$emit('success-callback',file,this.title,fileList);  //这里传出title是在红娘风格管理时需要将title拼接提交 上传一张图片可以从file拿图片URL 多张图片遍历fileList取图片URL
        } else {
          this.tip = true;
          this.$refs.tip.innerHTML = '图片上传失败！';
        }
      },
      handleFormatError:function () {
        this.$Message.warning('请选择格式为“jpg，jpeg，png，bmp”格式的图片！');
      },
      handleBeforeUpload:function (file) {
        const check = this.uploadList.length < this.length;
        const len = file.name.length <= 50;
        if (!len) {
          this.$Message.warning('图片名过长！');
          return len;
        }
        if (!check) {
          this.$Message.warning('只能上传'+this.length+'张图片！');
          return check;
        }
      },
      del:function () {
        this.tip = false;
      },
      clearUpload:function () {
        this.$refs.upload.clearFiles();
        this.uploadList = this.$refs.upload.fileList;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .divs{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
  .add-image{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .p{
    height: 90px;
    line-height: 90px;
    text-align: right;
    padding: 10px 12px 10px 0;
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
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
