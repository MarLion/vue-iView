<template>
  <div class="e-container">
    <quill-editor
      ref="myReEditor"
      v-model="data"
      :options="myOptions"
      @change="$emit('transmit-con',data)"
    ></quill-editor>
    <Upload
      :action="uploadUrl"
      ref="editorReUpload"
      class="editorReUp"
      :on-success="handleSuccess"
      :format="['jpg','jpeg','png','bmp']"
      :on-format-error="handleFormatError"
      :before-upload="handleBefore"
      style="display: none"
    >
      <Button>点击上传</Button>
    </Upload>
  </div>
</template>

<script>
  import { quillEditor } from 'vue-quill-editor';
  import * as Quill from 'quill';
  //quill编辑器的字体
  const fonts = ['SimSun', 'SimHei','Microsoft-YaHei','KaiTi','FangSong','Arial','Times-New-Roman','sans-serif'];
  const Font = Quill.import('formats/font');
  Font.whitelist = fonts; //将字体加入到白名单
  Quill.register(Font, true);
  const toolbarOptions= [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],

    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': fonts }],
    [{ 'align': [] }],

    ['clean'],
    ['link','image']
  ];
  export default {
    name: "reviseEditor",
    props : {
      uploadUrl:{},
      originalContent:{},
      watchValue:{} //监测是否出现
    },
    data () {
     return {
       data:'',
       myOptions:{
         placeholder:'请编写内容',
         theme:'snow',
         modules:{
           toolbar:{
             container:toolbarOptions,
             handlers:{
               image:function (value) {
                 if (value) {
                   document.querySelector('.editorReUp input').click();
                 } else {
                   this.quill.format('image',false);
                 }
               }
             }
           }
         }
       }
     }
    },
    watch:{  //通过监听watchValue值得变化来决定是否加载原有内容
      watchValue(value){
        if (value) {
          this.data = this.originalContent;
        } else {
          this.data = '';
        }
      }
    },
    methods : {
      handleSuccess:function (res,file,fileList) {
        //编辑器实例
        let quill = this.$refs.myReEditor.quill;
        //获取光标位置
        if (res.code === 200) {
          //获取光标位置
          let length = quill.getSelection().index;
          //插入图片
          quill.insertEmbed(length,'image',res.result);
          //将光标调整到最后
          quill.setSelection(length+1);
        } else {
          this.$Message.warning('图片插入失败！');
        }
      },
      handleFormatError:function () {
        this.$Message.warning('请选择格式为“jpg，jpeg，png，bmp”格式的图片！');
      },
      handleBefore:function (file) {
        const len = file.name.length <= 50;
        if (!len) {
          this.$Message.warning('图片名过长！');
        }
        return len;
      },
      clearData:function () {
        this.data = '';
      }
    }
  }
</script>

<style lang="scss" scoped>
  .e-container{
    height: 500px;
  }
  .quill-editor{
    height: 400px;
  }
</style>
