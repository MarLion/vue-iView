<template>
  <div>
    <Table border :columns="columns" :showHeader=false :data="listData" :loading="loading"></Table>
  </div>
</template>

<script>
  import axios from "@/axios/axios";
  import expandRow from '../rowExpand/apart';
  export default {
    name: "apart",
    data () {
      return {
        loading:false,
        add:true,
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
                  paddingLeft:'50px'
                },
                on:{
                  getAddValue : (value) => {
                    this.$emit('getAddValue',value);
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
            width:650,
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
                    this.$emit('getAddValue',this.add);
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
        listData:[]
      }
    },
    props : {
      row:{}
    },
    created  () {
      //console.log(this.row);
      let obj = this.row;
      if (obj.hasChild === 1) {
        this.loading = true;
        axios.SysApartment({parentId:obj.id})
          .then(res => {
            //console.log(res);
            if (res.code === 200) {
              this.loading = false;
              this.listData = res.result;
            }
          })
          .catch(error => {
            console.log(error);
          })
      } else {
        return false
      }
    }
  }
</script>

<style lang="scss">
  td.ivu-table-expanded-cell{
    padding:0!important;
  }
</style>
