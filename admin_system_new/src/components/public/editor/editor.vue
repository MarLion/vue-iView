<template>
  <div class="editor-container">
    <quill-editor
      ref="myEditor"
      v-model="data"
      :options="myOptions"
      @change="$emit('transmit-con',data)"
    ></quill-editor>
  <Upload
    :action="uploadUrl"
    ref="editorUpload"
    class="editorUp"
    :on-success="handleSuccess"
    :on-format-error="handleFormatError"
    :on-error="handleError"
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
  //quill图片可拖拽改变大小
  // import ImageResize from 'quill-image-resize-module'
  // Quill.register('modules/imageResize', ImageResize);
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
    name: "editor",
    props:['original'],
    data () {
      return {
        uploadUrl:'',
        data:this.content,
        myOptions:{
          placeholder:'请编写文章内容',
          theme:'snow',
          modules:{
            toolbar:{
              container:toolbarOptions,
              handlers:{
                image:function (value) {
                  if (value) {
                    document.querySelector('.editorUp input').click();
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
    watch:{
      content:function (newValue,oldValue) {
        console.log(newValue);
        return newValue;
      }
    },
    computed:{
      content:{
        get:function () {
          return this.original;
        },
        set:function (newVal,old) {
          return newVal;
        }
      }
    },
    methods:{
      handleSuccess:function (res,file,fileList) {
        //编辑器实例
        let quill = this.$refs.myEditor.quill;
        //获取光标位置
        let length = quill.getSelection().index;
        //插入图片
        //将光标调整到最后
      },
      handleFormatError:function () {

      },
      handleError:function () {

      },
      handleBefore:function () {

      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
