<template>
  <div class="products-container content-pad">
    <div class="route-fun">
      <div class="route-ope">
        <Button type="default" icon="md-add" @click="addProducts">上传商品</Button>
        <!--<Button type="default" icon="ios-download" @click="exportData">导出EXCEL</Button>-->
      </div>
      <div class="route-search">
        <span class="ml15">生产商名称：</span>
        <span><Input class="middle-checkWid" v-model="listParams.vendorName"/></span>
        <span class="ml15">商品功能：</span>
        <span>
          <Select style="width:150px" v-model="listParams.productTypeId">
            <Option v-for="(item,index) in proTypeList" :value="item.typeId" :key="index">{{ item.typeName }}</Option>
          </Select>
        </span>
        <span class="ml15">签约日期从：</span>
        <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="signStartTime" :options="begOption" class="middle-checkWid"></DatePicker></span>
        <span class="ml15">签约日期止：</span>
        <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="signEndTime" :options="endOption" class="middle-checkWid"></DatePicker></span>
        <span class="ml15">商品名称：</span>
        <span><Input class="middle-checkWid" v-model="listParams.productName"/></span>
        <span class="ml10"><Button icon="ios-search" @click="checkClick">查询</Button></span>
      </div>
    </div>
    <div class="route-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading"></Table>
      <Page :total="total" :current="listParams.page" v-if="total>10" show-elevator show-total class="mt30" @on-change="pageChange"/>
    </div>
    <!--上传商品-->
    <Drawer
      title="上传商品资料"
      v-model="proValue"
      width="1200"
      :mask-closable="false"
      :styles="styles"
      @on-close = 'clearProData'
    >
      <div class="add-title">
        <span>
          <span class="add-tips"><Icon type="md-information-circle" />友情提示：默认绑定是指所有营养师都可以推广的产品，产品不需要营养师申请代售。（平台定价-出厂价）× 分成比例 = 职务利润分成</span>
        </span>
      </div>
      <upload-view ref="coverView" :upload-url="uploadUrl" title="商品缩略图" :length="1" :width="130" conWidth="100%" v-on:success-callback="successCoverPath" v-on:remove-callback="removeCoverPath"></upload-view>
      <upload-view ref="mainView" :upload-url="uploadUrl" title="商品主图" :length="1" :width="130" conWidth="100%" v-on:success-callback="successMainPath" v-on:remove-callback="removeMainPath"></upload-view>
      <upload-view ref="proView" :upload-url="uploadUrlOther" title="商品展示照片" :params="moreParams" :length="9" :width="130" conWidth="100%" v-on:success-callback="successProPath" v-on:remove-callback="removeProPath"></upload-view>
      <upload-view ref="allowView" :upload-url="uploadUrl" title="商品生产许可证" :length="1" :width="130" conWidth="100%" v-on:success-callback="successAllowPath" v-on:remove-callback="removeAllowPath"></upload-view>
      <upload-view ref="recordView" :upload-url="uploadUrl" title="商品备案信息" :length="1" :width="130" conWidth="100%" v-on:success-callback="successRecordPath" v-on:remove-callback="removeRecordPath"></upload-view>
      <Form :model="proFormData" ref="proFormData" :rules="ruleValidate" class="mt20" :label-width="130" style="width: 100%;">
        <FormItem label="商品名称：" prop="name">
          <Input type="text" v-model="proFormData.name" :maxlength="80" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="商品简称：" prop="nickName">
          <Input type="text" v-model="proFormData.nickName" :maxlength="80" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="商品编号：" prop="productCode">
          <Input type="text" v-model="proFormData.productCode" :maxlength="80" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="生产地址：" prop="productionAddress">
          <Input type="text" v-model="proFormData.productionAddress" :maxlength="80" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="生产厂家：" prop="vendorId">
          <Select v-model="proFormData.vendorId" style="width:400px" @on-change="getBrand">
            <Option v-for="(item,index) in proFactoryList" :value="item.id" :key="index">{{ item.text }}</Option>
          </Select>
        </FormItem>
        <FormItem label="品牌：" prop="productBrand">
          <Select v-model="proFormData.productBrand" style="width:400px">
            <Option v-for="(item,index) in brandList" :value="item.id" :key="index">{{ item.text }}</Option>
          </Select>
        </FormItem>
        <FormItem label="功能类型：" prop="productTypeId">
          <Select v-model="proFormData.productTypeId" style="width:400px">
            <Option v-for="(item,index) in proTypeList" :value="item.typeId" :key="index">{{ item.typeName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="联系方式：" prop="phone">
          <Input type="text" v-model="proFormData.phone" :maxlength="80" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="业务对接人：" prop="businessPerson">
          <Input type="text" v-model="proFormData.businessPerson" :maxlength="80" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="业务对接人电话：" prop="personPhone">
          <Input type="text" v-model="proFormData.personPhone" :maxlength="80" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="商品库存：" prop="stockNum">
          <InputNumber type="text" v-model="proFormData.stockNum" :maxlength="80" style="width: 400px;"></InputNumber>
        </FormItem>
        <FormItem label="出厂价：" prop="price">
          <InputNumber type="text" v-model="proFormData.price" :maxlength="80" style="width: 400px;"></InputNumber>
        </FormItem>
        <FormItem label="平台定价：" prop="sysPrice">
          <InputNumber type="text" v-model="proFormData.sysPrice" :maxlength="80" style="width: 400px;"></InputNumber>
        </FormItem>
        <FormItem label="抵扣积分比例：" prop="integral">
          <InputNumber v-model="proFormData.integral" :min="0" :max="0.9" :step="0.1" placeholder="请输入小数" style="width: 400px;"></InputNumber >
        </FormItem>
        <FormItem v-for="(item,index) in mapList" :key="index" :label="item.name + '分成比例：'">
          <InputNumber ref="ratio" v-model="item.rate" :min="0" :max="0.9" :step="0.1" :maxlength="80" placeholder="请输入小数" style="width: 400px;"></InputNumber>
        </FormItem>
        <FormItem label="平台分成比例：" prop="sysRatio">
          <InputNumber type="text" v-model="proFormData.sysRatio" :min="0" :max="0.9" :step="0.1" :maxlength="80" placeholder="请输入小数" style="width: 400px;"></InputNumber>
        </FormItem>
        <FormItem label="是否默认绑定：" prop="bindStatus"> <!--0是绑定-->
          <Checkbox v-model="proFormData.bindStatus" true-value="0" false-value="1"  class="ml15"></Checkbox>
        </FormItem>
        <FormItem label="详情类型：">
          <Select v-model="proFormData.descType" style="width: 400px;" @on-change="infoTypeChange">
            <Option v-for="(item,index) in detailTypeList" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <template v-if="proFormData.descType === 0">
          <FormItem label="商品基本信息：">
            <Input type="textarea" v-model="proFormData.productInfo" style="width: 400px;"></Input>
            <!--<div class="editor-container">-->
              <!--<quill-editor-->
                <!--ref="myEditor"-->
                <!--v-model="proFormData.productInfo"-->
                <!--:options="myOptions"-->
              <!--&gt;</quill-editor>-->
              <!--<Upload-->
                <!--:action="uploadUrl"-->
                <!--ref="editorUpload"-->
                <!--class="editorUp"-->
                <!--:on-success="handleEdiSuccess"-->
                <!--:format="['jpg','jpeg','png','bmp']"-->
                <!--:on-format-error="handleEdiFormatError"-->
                <!--:before-upload="handleEdiBefore"-->
                <!--style="display: none"-->
              <!--&gt;-->
                <!--<Button>点击上传</Button>-->
              <!--</Upload>-->
            <!--</div>-->
          </FormItem>
          <FormItem label="商品详情介绍：">
            <Input type="textarea" v-model="proFormData.description" style="width: 400px;"></Input>
            <!--<div class="editor-container">-->
              <!--<quill-editor-->
                <!--ref="arrangeEditor"-->
                <!--v-model="proFormData.description"-->
                <!--:options="myArrOptions"-->
              <!--&gt;</quill-editor>-->
              <!--<Upload-->
                <!--:action="uploadUrl"-->
                <!--ref="arrEditorUpload"-->
                <!--class="arrEditorUp"-->
                <!--:on-success="arrHandleEdiSuccess"-->
                <!--:format="['jpg','jpeg','png','bmp']"-->
                <!--:on-format-error="handleEdiFormatError"-->
                <!--:before-upload="handleEdiBefore"-->
                <!--style="display: none"-->
              <!--&gt;-->
                <!--<Button>点击上传</Button>-->
              <!--</Upload>-->
            <!--</div>-->
          </FormItem>
        </template>
        <template v-else>
          <FormItem label="商品信息地址：">
            <Input type="text" v-model="proFormData.descUrl" style="width: 400px;"></Input>
          </FormItem>
        </template>
        <FormItem style="width: 200px!important;margin-top: 30px;">
          <Button type="primary" @click="productSub" :loading="proLoading">确认上传</Button>
        </FormItem>
      </Form>
    </Drawer>
    <!--详情-->
    <Drawer
      title="商品资料详情"
      v-model="proDetailValue"
      width="1200"
      :mask-closable="false"
      :styles="styles"
      @on-close="clearProDetailData"
    >
      <div class="divs mt30">
        <p class="p">商品缩略图：</p>
        <div class="add-image">
          <template v-if="isProductImg">
            <div class="demo-upload-list">
              <img :src="proDetailData.productImg">
            </div>
          </template>
          <template v-else>
            <div class="demo-upload-list">暂无缩略图</div>
          </template>
        </div>
      </div>
      <div class="divs mt30">
        <p class="p">商品主图：</p>
        <div class="add-image">
          <template v-if="isProductMainImg">
            <div class="demo-upload-list">
              <img :src="proDetailData.productMainImg">
            </div>
          </template>
          <template v-else>
            <div class="demo-upload-list">暂无主图</div>
          </template>
        </div>
      </div>
      <div class="divs mt30">
        <p class="p">商品展示图片：</p>
        <div class="add-image">
          <template v-if="isMultipleFiles">
            <div class="demo-upload-list" v-for="(item,index) in proDetailData.multipleFiles" :key="index">
              <img :src="item">
            </div>
          </template>
          <template v-else>
            <div class="demo-upload-list">暂无展示图片</div>
          </template>
        </div>
      </div>
      <div class="divs mt30">
        <p class="p">商品上产许可证：</p>
        <div class="add-image">
          <template v-if="isLicenceFront">
            <div class="demo-upload-list">
              <img :src="proDetailData.licenceFront">
            </div>
          </template>
          <template v-else>
            <div class="demo-upload-list">暂无上产许可证</div>
          </template>
        </div>
      </div>
      <div class="divs mt30">
        <p class="p">商品备案信息：</p>
        <div class="add-image">
          <template v-if="isRecordFront">
            <div class="demo-upload-list">
              <img :src="proDetailData.recordFront">
            </div>
          </template>
          <template v-else>
            <div class="demo-upload-list">暂无备案信息</div>
          </template>
        </div>
      </div>
      <div class="add-detail">
        <p class="p">商品名称：</p>
        <p class="detailSpan">{{proDetailData.name}}</p>
      </div>
      <div class="add-detail">
        <p class="p">商品简称：</p>
        <p class="detailSpan">{{proDetailData.nickName}}</p>
      </div>
      <div class="add-detail">
        <p class="p">商品编号：</p>
        <p class="detailSpan">{{proDetailData.productCode}}</p>
      </div>
      <div class="add-detail">
        <p class="p">生产地址：</p>
        <p class="detailSpan">{{proDetailData.productionAddress}}</p>
      </div>
      <div class="add-detail">
        <p class="p">生产厂家：</p>
        <p class="detailSpan">{{proDetailData.vendorName}}</p>
      </div>
      <div class="add-detail">
        <p class="p">品牌：</p>
        <p class="detailSpan">{{proDetailData.productBrand}}</p>
      </div>
      <div class="add-detail">
        <p class="p">功能类型：</p>
        <p class="detailSpan">{{proDetailData.productTypeName}}</p>
      </div>
      <div class="add-detail">
        <p class="p">联系方式：</p>
        <p class="detailSpan">{{proDetailData.phone}}</p>
      </div>
      <div class="add-detail">
        <p class="p">业务对接人：</p>
        <p class="detailSpan">{{proDetailData.businessPerson}}</p>
      </div>
      <div class="add-detail">
        <p class="p">业务对接人电话：</p>
        <p class="detailSpan">{{proDetailData.personPhone}}</p>
      </div>
      <div class="add-detail">
        <p class="p">商品库存：</p>
        <p class="detailSpan">{{proDetailData.stockNum}}</p>
      </div>
      <div class="add-detail">
        <p class="p">出厂价：</p>
        <p class="detailSpan">{{proDetailData.price}}</p>
      </div>
      <div class="add-detail">
        <p class="p">平台定价：</p>
        <p class="detailSpan">{{proDetailData.sysPrice}}</p>
      </div>
      <div class="add-detail">
        <p class="p">抵扣积分比例：</p>
        <p class="detailSpan">{{proDetailData.integral}}</p>
      </div>
      <div class="add-detail" v-for="(item,index) in detailMapList" :key="index">
        <p class="p">{{item.name  + '：'}}</p>
        <p class="detailSpan">{{item.rate}}</p>
      </div>
      <div class="add-detail">
        <p class="p">平台分成比例：</p>
        <p class="detailSpan">{{proDetailData.sysRatio}}</p>
      </div>
      <div class="add-detail">
        <p class="p">是否默认绑定：</p>
        <p class="detailSpan">{{proDetailData.bindStatus}}</p>
      </div>
      <div class="add-detail">
        <p class="p">详情类型：</p>
        <p class="detailSpan">{{proDetailData.descType}}</p>
      </div>
      <template v-if="isType">
        <div class="add-detail">
          <p class="p">商品信息地址：</p>
          <p class="detailSpan">{{proDetailData.descUrl}}</p>
        </div>
      </template>
      <template v-else>
        <div class="add-detail">
          <p class="p">商品基本信息：</p>
          <pre class="detailWidth" ref="bas"></pre>
        </div>
        <div class="add-detail">
          <p class="p">商品详情介绍：</p>
          <pre class="detailWidth" ref="des"></pre>
        </div>
      </template>
    </Drawer>
    <!--修改-->
    <Drawer
      title="修改商品资料"
      v-model="proReviseValue"
      width="1200"
      :mask-closable="false"
      :styles="styles"
      @on-close = 'clearProReviseData'
    >
      <revise-upload-view
        ref="coverReView"
        :upload-url="uploadUrl"
        title="商品缩略图"
        :length="1"
        :width="130"
        con-width="100%"
        :default-list="productImgDefault"
        :list-value="isImgShow"
        v-on:success-callback="imgReSuccess"
        v-on:remove-callback="imgReRemove"></revise-upload-view>
      <revise-upload-view
        ref="mainReView"
        :upload-url="uploadUrl"
        title="商品主图"
        :length="1"
        :width="130"
        con-width="100%"
        :default-list="productMainImgDefault"
        :list-value="isMainImgShow"
        v-on:success-callback="mainImgReSuccess"
        v-on:remove-callback="mainImgReRemove"></revise-upload-view>
      <revise-upload-view
        ref="proReView"
        :upload-url="uploadUrlOther"
        title="商品展示照片"
        :length="9"
        :params="moreParams"
        :width="130"
        con-width="100%"
        :default-list="multipleFilesDefault"
        :list-value="isMultipleShow"
        v-on:success-callback="multipReSuccess"
        v-on:remove-callback="multipReRemove"></revise-upload-view>
      <revise-upload-view
        ref="allowReView"
        :upload-url="uploadUrl"
        title="商品生产许可证"
        :length="1"
        :width="130"
        con-width="100%"
        :default-list="licenceFrontDefault"
        :list-value="isLicenceShow"
        v-on:success-callback="licenceReSuccess"
        v-on:remove-callback="licenceReRemove"></revise-upload-view>
      <revise-upload-view
        ref="recordReView"
        :upload-url="uploadUrl"
        title="商品备案信息"
        :length="1"
        :width="130"
        con-width="100%"
        :default-list="recordFrontDefault"
        :list-value="isRecordShow"
        v-on:success-callback="recordReSuccess"
        v-on:remove-callback="recordReRemove"></revise-upload-view>
      <Form :model="proReviseData" ref="proReviseData" :rules="ruleValidate" class="mt20" :label-width="130" style="width: 100%;">
        <FormItem label="商品名称：" prop="name">
          <Input type="text" v-model="proReviseData.name" :maxlength="80" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="商品简称：" prop="nickName">
          <Input type="text" v-model="proReviseData.nickName" :maxlength="80" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="商品编号：" prop="productCode">
          <Input type="text" v-model="proReviseData.productCode" :maxlength="80" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="生产地址：" prop="productionAddress">
          <Input type="text" v-model="proReviseData.productionAddress" :maxlength="80" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="生产厂家：" prop="vendorId">
          <Select v-model="proReviseData.vendorId"  @on-change="reGetBrand" style="width:400px">
            <Option v-for="(item,index) in proFactoryList" :value="item.id" :key="index">{{ item.text }}</Option>
          </Select>
        </FormItem>
        <FormItem label="品牌：" prop="productBrand">
          <Select v-model="proReviseData.productBrand" style="width:400px">
            <Option v-for="(item,index) in reBrandList" :value="item.id" :key="index">{{ item.text }}</Option>
          </Select>
        </FormItem>
        <FormItem label="功能类型：" prop="productTypeId">
          <Select v-model="proReviseData.productTypeId" style="width:400px">
            <Option v-for="(item,index) in proTypeList" :value="item.typeId" :key="index">{{ item.typeName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="联系方式：" prop="phone">
          <Input type="text" v-model="proReviseData.phone" :maxlength="80" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="业务对接人：" prop="businessPerson">
          <Input type="text" v-model="proReviseData.businessPerson" :maxlength="80" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="业务对接人电话：" prop="personPhone">
          <Input type="text" v-model="proReviseData.personPhone" :maxlength="80" style="width: 400px;"></Input>
        </FormItem>
        <FormItem label="商品库存：" prop="stockNum">
          <InputNumber type="text" v-model="proReviseData.stockNum" :maxlength="80" style="width: 400px;"></InputNumber>
        </FormItem>
        <FormItem label="出厂价：" prop="price">
          <InputNumber type="text" v-model="proReviseData.price" :maxlength="80" style="width: 400px;"></InputNumber>
        </FormItem>
        <FormItem label="平台定价：" prop="sysPrice">
          <InputNumber type="text" v-model="proReviseData.sysPrice" :maxlength="80" style="width: 400px;"></InputNumber>
        </FormItem>
        <FormItem label="抵扣积分比例：" prop="integral">
          <InputNumber v-model="proReviseData.integral" :min="0" :max="0.9" :step="0.1" placeholder="请输入小数" style="width: 400px;"></InputNumber >
        </FormItem>
        <FormItem v-for="(item,index) in detailMapList" :key="index" :label="item.name + '分成比例：'">
          <InputNumber ref="reRatio" :min="0" :max="0.9" :step="0.1" v-model="item.rate" :maxlength="80" placeholder="请输入小数" style="width: 400px;"></InputNumber>
        </FormItem>
        <FormItem label="平台分成比例：" prop="sysRatio">
          <InputNumber type="text" v-model="proReviseData.sysRatio" :min="0" :max="0.9" :step="0.1" :maxlength="80" placeholder="请输入小数" style="width: 400px;"></InputNumber>
        </FormItem>
        <FormItem label="是否默认绑定：" prop="bindStatus"> <!--0是绑定-->
          <Checkbox v-model="proReviseData.bindStatus" disabled true-value="0" false-value="1"  class="ml15"></Checkbox>
        </FormItem>
        <FormItem label="详情类型：">
          <Select v-model="proReviseData.descType" style="width: 400px;" @on-change="infoTypeChange">
            <Option v-for="(item,index) in detailTypeList" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <template v-if="proReviseData.descType === 0">
          <FormItem label="商品基本信息：">
            <Input type="textarea" v-model="proReviseData.productInfo" style="width: 400px;"></Input>
            <!--<div class="editor-container">-->
              <!--<quill-editor-->
                <!--ref="myReEditor"-->
                <!--v-model="proReviseData.productInfo"-->
                <!--:options="myReOptions"-->
              <!--&gt;</quill-editor>-->
              <!--<Upload-->
                <!--:action="uploadUrl"-->
                <!--ref="editorReUpload"-->
                <!--class="editorReUp"-->
                <!--:on-success="reHandleEdiSuccess"-->
                <!--:format="['jpg','jpeg','png','bmp']"-->
                <!--:on-format-error="handleEdiFormatError"-->
                <!--:before-upload="handleEdiBefore"-->
                <!--style="display: none"-->
              <!--&gt;-->
                <!--<Button>点击上传</Button>-->
              <!--</Upload>-->
            <!--</div>-->
          </FormItem>
          <FormItem label="商品详情介绍：">
            <Input type="textarea" v-model="proReviseData.description" style="width: 400px;"></Input>
            <!--<div class="editor-container">-->
              <!--<quill-editor-->
                <!--ref="arrangeReEditor"-->
                <!--v-model="proReviseData.description"-->
                <!--:options="myArrReOptions"-->
              <!--&gt;</quill-editor>-->
              <!--<Upload-->
                <!--:action="uploadUrl"-->
                <!--ref="arrEditorReUpload"-->
                <!--class="arrEditorReUp"-->
                <!--:on-success="reArrHandleEdiSuccess"-->
                <!--:format="['jpg','jpeg','png','bmp']"-->
                <!--:on-format-error="handleEdiFormatError"-->
                <!--:before-upload="handleEdiBefore"-->
                <!--style="display: none"-->
              <!--&gt;-->
                <!--<Button>点击上传</Button>-->
              <!--</Upload>-->
            <!--</div>-->
          </FormItem>
        </template>
        <template v-else>
          <FormItem label="商品信息地址：">
            <Input type="text" v-model="proReviseData.descUrl" style="width: 400px;"></Input>
          </FormItem>
        </template>
        <FormItem style="width: 200px!important;margin-top: 30px;">
          <Button type="primary" @click="productReSub" :loading="proReLoading">确认修改</Button>
        </FormItem>
      </Form>
    </Drawer>
    <!--弹框-->
    <Modal
      title="提示"
      v-model="productTip"
      :mask-closable = "false"
    >
      <p ref="productTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
    <Modal
      title="提示"
      v-model="productSuccess"
      :mask-closable = "false"
    >
      <p ref="productSuccess"></p>
      <div slot="close"></div>
      <div slot="footer">
        <Button type="warning"  @click="goProductList">返回列表</Button>
        <Button type="info"  @click="addProductMore">继续添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "../../axios/axios";
  import * as base from '../../axios/base';
  import { quillEditor } from 'vue-quill-editor';
  import * as Quill from 'quill';
  import index from "@/router";
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
  const nameValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写商品名称'))
    } else {
      callback();
    }
  };
  const nickNameValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写商品简称'))
    } else {
      callback();
    }
  };
  const productCodeValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写商品编号'))
    } else {
      callback();
    }
  };
  const productionAddressValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写生产地址'))
    } else {
      callback();
    }
  };
  const vendorIdValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请选择生产厂家'))
    } else {
      callback();
    }
  };
  const productTypeIdValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请选择功能类型'))
    } else {
      callback();
    }
  };
  const phoneValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写联系方式'))
    } else {
      callback();
    }
  };
  const businessPersonValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写业务对接人'))
    } else {
      callback();
    }
  };
  const personPhoneValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写业务对接人电话'))
    } else {
      callback();
    }
  };
  const stockNumValidate = (rule,value,callback) => {
    if (value === null) {
      callback(new Error('请填写商品库存'))
    } else {
      callback();
    }
  };
  const priceValidate = (rule,value,callback) => {
    if (value === null) {
      callback(new Error('请填写出厂价'))
    } else {
      callback();
    }
  };
  const sysPriceValidate = (rule,value,callback) => {
    if (value === null) {
      callback(new Error('请填写平台定价'))
    } else {
      callback();
    }
  };
  const integralValidate = (rule,value,callback) => {
    if (value === null) {
      callback(new Error('请填写抵扣积分比例'))
    } else {
      callback();
    }
  };
  const yysRatioValidate = (rule,value,callback) => {
    if (value === null) {
      callback(new Error('请填写营养师分成比例'))
    } else {
      callback();
    }
  };
  const stlRatioValidate = (rule,value,callback) => {
    if (value === null) {
      callback(new Error('请填写小队长分成比例'))
    } else {
      callback();
    }
  };
  const mtlRatioValidate = (rule,value,callback) => {
    if (value === null) {
      callback(new Error('请填写中队长分成比例'))
    } else {
      callback();
    }
  };
  const btlRatioValidate = (rule,value,callback) => {
    if (value === null) {
      callback(new Error('请填写大队长分成比例'))
    } else {
      callback();
    }
  };
  const dhRatioValidate = (rule,value,callback) => {
    if (value === null) {
      callback(new Error('请填写区总分成比例'))
    } else {
      callback();
    }
  };
  const dlRatioValidate = (rule,value,callback) => {
    if (value === null) {
      callback(new Error('请填写区长分成比例'))
    } else {
      callback();
    }
  };
  const sysRatioValidate = (rule,value,callback) => {
    if (value === null) {
      callback(new Error('请填写平台分成比例'))
    } else {
      callback();
    }
  };
  const brandValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请选择品牌'))
    } else {
      callback();
    }
  };
  export default {
    name: "configureHealthProducts",
    data () {
      return {
        uploadUrl:base.baseUrl.serviceTwo + 'documents/saveFiles',
        uploadUrlOther:base.baseUrl.serviceThree + 'documents/saveFile',
        moreParams:{
          ownerType:1
        },
        proValue:false,
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        productTip:false,
        productSuccess:false,
        proLoading:false,
        loading:false,
        total:'',
        listParams:{
          page:1,
          rows:10,
          vendorName:'',
          productName:'',
          productTypeId:'', //商品类型id
          contractExpireTimeStart:'',
          contractExpireTimeEnd:''
        },
        proTypeList:[],
        proFactoryList:[],
        begOption:{
          disabledDate : date =>  {
            const d = new Date(this.listParams.contractExpireTimeEnd);
            return date && date.valueOf() > d;
          }
        },
        endOption:{
          disabledDate : date =>  {
            const d = new Date(this.listParams.contractExpireTimeStart);
            return date && date.valueOf() < d - 24*60*60*1000;
          }
        },
        //列表数据
        listData:[],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'商品编号',
            key:'productCode',
            align:'center'
          },
          {
            title:'商品名称',
            key:'productName',
            align:'center'
          },
          {
            title:'商品简称',
            key:'nickName',
            align:'center'
          },
          {
            title:'生产厂家',
            key:'vendorName',
            align:'center'
          },
          {
            title:'生产地址',
            key:'productionAddress',
            align:'center'
          },
          {
            title:'是否默认绑定',
            key:'bindStatus',
            align:'center',
            render:(h,params) => {
              if (params.row.productBindStatus === 0) {
                return h('div',{
                 style: {
                   height:'100%'
                 }
                },'默认绑定')
              } else {
                return h('div',{
                  style: {
                    height:'100%'
                  }
                },'默认不绑定')
              }
            }
          },
          {
            title:'出厂价',
            key:'price',
            align:'center'
          },
          {
            title:'平台定价',
            key:'sysPrice',
            align:'center'
          },
          {
            title:'商品状态',
            align:'center',
            render:(h,params) => {
              if (params.row.status === 1) {
                return h('div',{
                  style:{
                    height:'100%'
                  }
                },'已上架')
              } else {
                return h('div',{
                  style:{
                    height:'100%'
                  }
                },'已下架')
              }
            }
          },
          {
            title:'操作选项',
            key:'action',
            align:'center',
            width:130,
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
                    axios.HealthProductDetail({id:params.row.productModelId})
                      .then(res => {
                        //console.log(res);
                        if (res.code === '0') {
                          this.proDetailValue = true;
                          if (res.data.productImg === '') {
                            this.isProductImg = false;
                          } else {
                            this.isProductImg = true;
                            this.proDetailData.productImg = res.data.productImg;
                          }
                          if (res.data.productMainImg === '') {
                            this.isProductMainImg = false;
                          } else {
                            this.isProductMainImg = true;
                            this.proDetailData.productMainImg = res.data.productMainImg;
                          }
                          if (res.data.imgs.length === 0) {
                            this.isMultipleFiles = false;
                          } else {
                            this.isMultipleFiles = true;
                            this.proDetailData.multipleFiles = res.data.imgs;
                          }
                          if (res.data.licenceFront === '') {
                            this.isLicenceFront= false;
                          } else {
                            this.isLicenceFront = true;
                            this.proDetailData.licenceFront = res.data.licenceFront;
                          }
                          if (res.data.recordFront === '') {
                            this.isRecordFront= false;
                          } else {
                            this.isRecordFront = true;
                            this.proDetailData.recordFront = res.data.recordFront;
                          }
                          this.detailMapList = res.data.rate;
                          this.proDetailData.name = res.data.name;
                          this.proDetailData.nickName = res.data.nickName;
                          this.proDetailData.productCode = res.data.productCode;
                          this.proDetailData.productionAddress = res.data.productionAddress;
                          this.proDetailData.businessPerson = res.data.businessPerson;
                          this.proDetailData.stockNum = res.data.stockNum;
                          this.proDetailData.integral = res.data.integral;
                          this.proDetailData.phone = res.data.phone;
                          this.proDetailData.personPhone = res.data.personPhone;
                          this.proDetailData.sysPrice = res.data.sysPrice;
                          this.proDetailData.price = res.data.price;
                          this.proDetailData.btlRatio = res.data.btlRatio;
                          this.proDetailData.sysRatio = res.data.sysRatio;
                          this.proDetailData.stlRatio = res.data.stlRatio;
                          this.proDetailData.mtlRatio = res.data.mtlRatio;
                          this.proDetailData.dhRatio = res.data.dhRatio;
                          this.proDetailData.dlRatio = res.data.dlRatio;
                          this.proDetailData.yysRatio = res.data.yysRatio;
                          this.proDetailData.vendorName = res.data.vendorName;
                          this.proDetailData.productBrand = res.data.brandName;
                          this.proDetailData.productTypeName = res.data.productTypeName;
                          if (res.data.bindStatus === 0) {
                            this.proDetailData.bindStatus = '默认绑定';
                          } else {
                            this.proDetailData.bindStatus = '未绑定';
                          }
                          if (res.data.descType === 0) {
                            this.proDetailData.descType = '模板';
                            this.isType = false;
                            this.$refs.des.innerHTML = res.data.description;
                            this.$refs.bas.innerHTML = res.data.productInfo;
                          } else {
                            this.proDetailData.descType = '自定义';
                            this.isType = true;
                            this.proDetailData.descUrl = res.data.descUrl;
                          }
                        } else {
                          this.productTip = true;
                          this.$refs.productTip.innerHTML = '查询详情出错！';
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.productTip = true;
                        this.$refs.productTip.innerHTML = '查询详情出错！';
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
                    axios.HealthProductDetail({id:params.row.productModelId})
                      .then(res => {
                        //console.log(res);
                        if (res.code === '0') {
                          this.proReviseValue = true;
                          this.isImgShow = true;
                          this.isMainImgShow = true;
                          this.isMultipleShow = true;
                          this.isLicenceShow = true;
                          this.isRecordShow = true;
                          this.proReviseData.id = params.row.productModelId;
                          if (res.data.productImg === '') {
                            this.productImgDefault = [];
                          } else {
                            this.productImgDefault.push({url:res.data.productImg,name:res.data.name,status:'finished'});
                            this.proReviseData.productImg = res.data.productImg;
                          }
                          if (res.data.productMainImg === '') {
                            this.productMainImgDefault = [];
                          } else {
                            this.productMainImgDefault.push({url:res.data.productMainImg,name:res.data.name,status:'finished'});
                            this.proReviseData.productMainImg = res.data.productMainImg;
                          }
                          if (res.data.imgs.length === 0) {
                            this.multipleFilesDefault = [];
                          } else {
                            res.data.imgs.forEach(item => {
                              this.multipleFilesDefault.push({url:item,name:res.data.name,status:'finished'});
                              this.proReviseData.multipleFiles.push(item);
                            });
                          }
                          if (res.data.licenceFront === '') {
                            this.licenceFrontDefault = [];
                          } else {
                            this.licenceFrontDefault.push({url:res.data.licenceFront,name:res.data.name,status:'finished'});
                            this.proReviseData.licenceFront = res.data.licenceFront;
                          }
                          if (res.data.recordFront === '') {
                            this.recordFrontDefault = [];
                          } else {
                            this.recordFrontDefault.push({url:res.data.recordFront,name:res.data.name,status:'finished'});
                            this.proReviseData.recordFront = res.data.recordFront;
                          }
                          this.detailMapList = res.data.rate;
                          this.proReviseData.name = res.data.name;
                          this.proReviseData.nickName = res.data.nickName;
                          this.proReviseData.productCode = res.data.productCode;
                          this.proReviseData.productionAddress = res.data.productionAddress;
                          this.proReviseData.businessPerson = res.data.businessPerson;
                          this.proReviseData.stockNum = res.data.stockNum;
                          this.proReviseData.integral = res.data.integral;
                          this.proReviseData.bindStatus = res.data.bindStatus.toString();
                          this.proReviseData.phone = res.data.phone;
                          this.proReviseData.personPhone = res.data.personPhone;
                          this.proReviseData.sysPrice = res.data.sysPrice;
                          this.proReviseData.price = res.data.price;
                          this.proReviseData.btlRatio = res.data.btlRatio;
                          this.proReviseData.sysRatio = res.data.sysRatio;
                          this.proReviseData.stlRatio = res.data.stlRatio;
                          this.proReviseData.mtlRatio = res.data.mtlRatio;
                          this.proReviseData.dhRatio = res.data.dhRatio;
                          this.proReviseData.dlRatio = res.data.dlRatio;
                          this.proReviseData.yysRatio = res.data.yysRatio;
                          this.proReviseData.vendorId = res.data.vendorId;
                          this.proReviseData.productBrand = res.data.productBrand;
                          this.firstReBrand();
                          this.proReviseData.productTypeId = res.data.productTypeId;
                          this.proReviseData.descType = res.data.descType;
                          if (res.data.descType === 0) {
                            this.proReviseData.description = res.data.description;
                            this.proReviseData.productInfo = res.data.productInfo;
                          } else {
                            this.proReviseData.descUrl = res.data.descUrl;
                          }

                        } else {
                          this.productTip = true;
                          this.$refs.productTip.innerHTML = '查询详情出错！';
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.productTip = true;
                        this.$refs.productTip.innerHTML = '查询详情出错！';
                      })
                  }
                }
              },'修改');
              return h('div',[
                detail,
                revise
              ])
            }
          }
        ],
        detailTypeList:[
          {
            label:'模板',
            value:0
          },
          {
            label:'自定义',
            value:1
          }
        ],
        mapList:[],
        detailMapList:[],
        brandList:[],
        //表单数据
        proFormData:{
          productImg:'',  //商品缩略图
          vendorId:'',   //厂家id
          productTypeId:'',  //商品类型id
          phone:'',   //电话
          personPhone:'',  //业务对接人电话
          sysPrice:null,  //平台定价
          price:null,  //商品原价
          sysRatio:null,  //平台分成比例
          levelName:[],
          levelRate:[],
          productMainImg:'',  //商品主图
          licenceFront:'',  //商品证件正面照
          recordFront:'', //商品备案图
          name:'',   //商品名称
          nickName:'',  //商品简称
          productCode:'',  //商品编号
          productionAddress:'', //生产地址
          businessPerson:'',  //业务对接人
          stockNum:null,  //商品库存
          integral:null,  //积分比例
          bindStatus:'0',  //是否默认绑定 0 绑定
          productInfo:'', //商品基本信息
          description:'', //商品详情介绍
          tenantId:'',  //公司id 非必传
          multipleFiles:[],  //多个商品图 即轮播的图
          descType:0, //0模板  1自定义
          descUrl:'', //自定义url链接
          productBrand:'',//品牌id
        },
        //详情数据
        proDetailValue:false,
        isProductImg:false,
        isProductMainImg:false,
        isMultipleFiles:false,
        isLicenceFront:false,
        isRecordFront:false,
        isType:false,
        proDetailData:{
          productImg:'',  //商品缩略图
          vendorId:'',   //厂家id
          vendorName:'',
          productTypeId:'',  //商品类型id
          productTypeName:'',
          productBrand:'',   //品牌id
          phone:'',   //电话
          personPhone:'',  //业务对接人电话
          sysPrice:null,  //平台定价
          price:null,  //商品原价
          sysRatio:null,  //平台分成比例
          productMainImg:'',  //商品主图
          licenceFront:'',  //商品证件正面照
          recordFront:'', //商品备案图
          name:'',   //商品名称
          nickName:'',  //商品简称
          productCode:'',  //商品编号
          productionAddress:'', //生产地址
          businessPerson:'',  //业务对接人
          stockNum:null,  //商品库存
          integral:null,  //积分比例
          bindStatus:'0',  //是否默认绑定 0 绑定
          productInfo:'', //商品基本信息
          description:'', //商品详情介绍
          tenantId:'',  //公司id 非必传
          multipleFiles:[],  //多个商品图 即轮播的图
          descType:0, //0模板  1自定义
          descUrl:'', //自定义url链接
        },
        //修改数据
        reBrandList:[],
        proReviseValue:false,
        proReLoading:false,
        productImgDefault:[],
        productMainImgDefault:[],
        multipleFilesDefault:[],
        licenceFrontDefault:[],
        recordFrontDefault:[],
        isImgShow:false,
        isMainImgShow:false,
        isMultipleShow:false,
        isLicenceShow:false,
        isRecordShow:false,
        proReviseData:{
          id:'',
          productImg:'',  //商品缩略图
          vendorId:'',   //厂家id
          productTypeId:'',  //商品类型id
          phone:'',   //电话
          personPhone:'',  //业务对接人电话
          sysPrice:null,  //平台定价
          price:null,  //商品原价
          sysRatio:null,  //平台分成比例
          levelName:[],
          levelRate:[],
          productMainImg:'',  //商品主图
          licenceFront:'',  //商品证件正面照
          recordFront:'', //商品备案图
          name:'',   //商品名称
          nickName:'',  //商品简称
          productCode:'',  //商品编号
          productionAddress:'', //生产地址
          businessPerson:'',  //业务对接人
          stockNum:null,  //商品库存
          integral:null,  //积分比例
          bindStatus:'0',  //是否默认绑定 0 绑定
          productInfo:'', //商品基本信息
          description:'', //商品详情介绍
          tenantId:'',  //公司id 非必传
          multipleFiles:[],  //多个商品图 即轮播的图
          descType:0, //0模板  1自定义
          descUrl:'', //自定义url链接
          productBrand:'',//品牌id
        },
        //表单验证
        ruleValidate:{
          name: [
            {validator:nameValidate}
          ],
          nickName: [
            {validator:nickNameValidate}
          ],
          productCode: [
            {validator:productCodeValidate}
          ],
          productionAddress: [
            {validator:productionAddressValidate}
          ],
          vendorId: [
            {validator:vendorIdValidate}
          ],
          productBrand:[
            {validator:brandValidate}
          ],
          productTypeId: [
            {validator:productTypeIdValidate}
          ],
          phone: [
            {validator:phoneValidate}
          ],
          businessPerson: [
            {validator:businessPersonValidate}
          ],
          stockNum: [
            {validator:stockNumValidate}
          ],
          price: [
            {validator:priceValidate}
          ],
          sysPrice: [
            {validator:sysPriceValidate}
          ],
          integral: [
            {validator:integralValidate}
          ],
          yysRatio: [
            {validator:yysRatioValidate}
          ],
          stlRatio: [
            {validator:stlRatioValidate}
          ],
          mtlRatio: [
            {validator:mtlRatioValidate}
          ],
          btlRatio: [
            {validator:btlRatioValidate}
          ],
          dhRatio: [
            {validator:dhRatioValidate}
          ],
          dlRatio: [
            {validator:dlRatioValidate}
          ],
          sysRatio: [
            {validator:sysRatioValidate}
          ],
          personPhone: [
            {validator:personPhoneValidate}
          ],
        },
        myOptions:{
          placeholder:'请编写景区介绍',
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
        },
        myArrOptions:{
          placeholder:'请编写行程安排',
          theme:'snow',
          modules:{
            toolbar:{
              container:toolbarOptions,
              handlers:{
                image:function (value) {
                  if (value) {
                    document.querySelector('.arrEditorUp input').click();
                  } else {
                    this.quill.format('image',false);
                  }
                }
              }
            }
          }
        },
        myReOptions:{
          placeholder:'请编写景区介绍',
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
        },
        myArrReOptions:{
          placeholder:'请编写行程安排',
          theme:'snow',
          modules:{
            toolbar:{
              container:toolbarOptions,
              handlers:{
                image:function (value) {
                  if (value) {
                    document.querySelector('.arrEditorReUp input').click();
                  } else {
                    this.quill.format('image',false);
                  }
                }
              }
            }
          }
        },
      }
    },
    mounted () {
      this.getProductType();
      this.getProductsList();
      this.getProducer();
      this.getPostMap();
    },
    methods:{
      //获取商品类型
      getProductType:function () {
        axios.HealthProductType()
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.proTypeList = res.data;
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      //获取生产厂家
      getProducer:function () {
        axios.HealthProductProduce()
          .then(res => {
            //console.log(res);
            this.proFactoryList = res;
          })
          .catch(error => {
            console.log(error);
          })
      },
      //获取商品列表
      getProductsList:function () {
        this.loading = true;
        axios.HealthProductsList(this.listParams)
          .then(res => {
            //console.log(res.rows);
            this.loading = false;
            this.total = res.total;
            this.listData = res.rows;
          })
          .catch(error => {
            console.log(error);
            this.productTip = true;
            this.$refs.productTip.innerHTML = '查询出错！';
          })
      },
      //获取职务层级 分配比例
      getPostMap:function () {
        axios.HealthProductMap()
          .then(res => {
            //console.log(res);
            if (res.code === 200) {
              this.mapList = res.result;
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      addProducts:function () {
        this.proValue = true;
      },
      exportData:function () {

      },
      signStartTime:function (date) {
        this.listParams.contractExpireTimeStart = date;
      },
      signEndTime:function (date) {
        this.listParams.contractExpireTimeEnd = date;
      },
      checkClick:function () {
        this.listParams.page = 1;
        this.getProductsList();
      },
      pageChange:function (page) {
        this.listParams.page = page;
        this.getProductsList();
      },
      //缩略图上传成功  上传成功回显以及删除操作在封装的组件内已完成 此处主要是对提交的数据传赋值
      successCoverPath:function (file,title,fileList) {
        this.proFormData.productImg = file.url;
      },
      //缩略图删除
      removeCoverPath:function (file) {
        this.proFormData.productImg = '';
      },
      //商品主图
      successMainPath:function (file,title,fileList) {
        this.proFormData.productMainImg = file.url;
      },
      //主图删除
      removeMainPath:function (file) {
        this.proFormData.productMainImg = '';
      },
      //多个商品照片成功
      successProPath:function (file,title,fileList) {  //这里多张图片 可以遍历fileList取url 也可以每一次push file的url进数组
        this.proFormData.multipleFiles.push(file.url);
      },
      //多个商品照片删除
      removeProPath:function (file) {
        this.proFormData.multipleFiles.splice(this.proFormData.multipleFiles.indexOf(file.url),1);
        //console.log(this.proFormData.multipleFiles);
      },
      //商品生产许可证成功
      successAllowPath:function (file,title,fileList) {
        this.proFormData.licenceFront = file.url;
      },
      //商品生产许可证删除
      removeAllowPath:function (file) {
        this.proFormData.licenceFront = '';
      },
      //商品备案信息成功
      successRecordPath:function (file,title,fileList) {
        this.proFormData.recordFront = file.url;
      },
      //商品备案信息删除
      removeRecordPath:function (file) {
        this.proFormData.recordFront = '';
      },
      infoTypeChange:function () {
        if (this.proFormData.descType === 0) {
          this.proFormData.descUrl = '';
        } else {
          this.proFormData.productInfo = '';
          this.proFormData.description = '';
        }
      },
      productBasicMes:function (con) {
        this.proFormData.productInfo = con;
      },
      productDetail:function (con) {
        this.proFormData.description = con;
      },
      productSub:function () {
        this.$refs.proFormData.validate(valid => {
          if (valid) {
            this.proLoading = true;
            this.mapList.forEach(item => {
              this.proFormData.levelName.push(item.name);
              this.proFormData.levelRate.push(item.rate);
            });
            axios.HealthProductsSave(this.proFormData)
              .then(res => {
                console.log(res);
                this.proLoading = false;
                this.proFormData.levelName = [];
                this.proFormData.levelRate = [];
                if (res.code === '0') {
                  this.productSuccess = true;
                  this.$refs.productSuccess.innerHTML = '保存成功！';
                  this.getProductsList();
                } else {
                  this.productTip = true;
                  this.$refs.productTip.innerHTML = res.data;
                }
              })
              .catch(error => {
                console.log(error);
                this.proFormData.levelName = [];
                this.proFormData.levelRate = [];
                this.proLoading = false;
                this.productTip = true;
                this.$refs.productTip.innerHTML = '保存失败！';
              })
          }
        })
      },
      //清除新增数据
      clearProData:function () {
        //清空图片数据
        this.proFormData.productImg = '';
        this.proFormData.productMainImg = '';
        this.proFormData.multipleFiles = [];
        this.proFormData.licenceFront = '';
        this.proFormData.recordFront = '';
        //清空组件
        this.$refs.coverView.clearUpload();
        this.$refs.mainView.clearUpload();
        this.$refs.proView.clearUpload();
        this.$refs.allowView.clearUpload();
        this.$refs.recordView.clearUpload();
        //清空表单
        this.proFormData.bindStatus = '0';
        this.proFormData.descType = 0;
        this.proFormData.descUrl = '';
        this.proFormData.productInfo = '';
        this.proFormData.description = '';
        this.proFormData.levelName = [];
        this.proFormData.levelRate = [];
        this.$refs.proFormData.resetFields();
        this.brandList = [];
      },
      del:function () {
        this.productTip = false;
      },
      goProductList:function () {
        this.clearProData();
        this.productSuccess = false;
        this.proValue = false;
      },
      addProductMore:function () {
        this.clearProData();
        this.productSuccess = false;
      },
      //清除详情数据
      clearProDetailData : function () {
        this.isProductImg = false;
        this.isProductMainImg = false;
        this.isMultipleFiles = false;
        this.isLicenceFront = false;
        this.isRecordFront = false;
        this.isType = false;
        this.proDetailData.productImg = '';  //商品缩略图
        this.proDetailData.vendorId = '';   //厂家id
        this.proDetailData.vendorName = '';
        this.proDetailData.productTypeId = '';  //商品类型id
        this.proDetailData.productTypeName = '';
            //productBrand:'',   //品牌id
        this.proDetailData.phone = '';   //电话
        this.proDetailData.personPhone = '';  //业务对接人电话
        this.proDetailData.sysPrice = null;  //平台定价
        this.proDetailData.price = null;  //商品原价
        this.proDetailData.sysRatio = null;  //平台分成比例
        this.proDetailData.productMainImg = '';  //商品主图
        this.proDetailData.licenceFront = '';  //商品证件正面照
        this.proDetailData.recordFront = ''; //商品备案图
        this.proDetailData.name = '';   //商品名称
        this.proDetailData.nickName = '';  //商品简称
        this.proDetailData.productCode = '';  //商品编号
        this.proDetailData.productionAddress = ''; //生产地址
        this.proDetailData.businessPerson = '';  //业务对接人
        this.proDetailData.stockNum = null;  //商品库存
        this.proDetailData.integral = null;  //积分比例
        this.proDetailData.bindStatus = '0';  //是否默认绑定 0 绑定
        this.proDetailData.productInfo = ''; //商品基本信息
        this.proDetailData.description = ''; //商品详情介绍
        this.proDetailData.tenantId = '';  //公司id 非必传
        this.proDetailData.multipleFiles = [];  //多个商品图 即轮播的图
        this.proDetailData.descType = 0; //0模板  1自定义
        this.proDetailData.descUrl = ''; //自定义url链接
      },
      productReSub:function () {
        this.$refs.proReviseData.validate(valid => {
          if (valid) {
            this.proReLoading = true;
            //console.log(this.detailMapList);
            this.detailMapList.forEach(item => {
              this.proReviseData.levelName.push(item.name);
              this.proReviseData.levelRate.push(item.rate);
            });
            axios.HealthProductsSave(this.proReviseData)
              .then(res => {
                //console.log(res);
                this.proReLoading = false;
                this.proReviseData.levelName = [];
                this.proReviseData.levelRate = [];
                if (res.code === '0') {
                  this.proReviseValue = false;
                  this.clearProReviseData();
                  this.productTip = true;
                  this.$refs.productTip.innerHTML = '保存成功！';
                  this.getProductsList();
                } else {
                  this.productTip = true;
                  this.$refs.productTip.innerHTML = res.data;
                }
              })
              .catch(error => {
                console.log(error);
                this.proReviseData.levelName = [];
                this.proReviseData.levelRate = [];
                this.proReLoading = false;
                this.productTip = true;
                this.$refs.productTip.innerHTML = '保存失败！';
              })
          }
        })
      },
      //清除修改数据
      clearProReviseData:function () {
        this.isImgShow = false;
        this.isMainImgShow = false;
        this.isMultipleShow = false;
        this.isLicenceShow = false;
        this.isRecordShow = false;
        this.productImgDefault = [];
        this.productMainImgDefault = [];
        this.multipleFilesDefault = [];
        this.licenceFrontDefault = [];
        this.recordFrontDefault = [];
        //清空图片数据
        this.proReviseData.productImg = '';
        this.proReviseData.productMainImg = '';
        this.proReviseData.multipleFiles = [];
        this.proReviseData.licenceFront = '';
        this.proReviseData.recordFront = '';
        //清空表单
        this.proReviseData.id = '';
        this.proReviseData.bindStatus = '0';
        this.proReviseData.descType = 0;
        this.proReviseData.descUrl = '';
        this.proReviseData.productInfo = '';
        this.proReviseData.description = '';
        this.$refs.proReviseData.resetFields();
        //清空组件
        this.$refs.coverReView.clearUpload();
        this.$refs.mainReView.clearUpload();
        this.$refs.proReView.clearUpload();
        this.$refs.allowReView.clearUpload();
        this.$refs.recordReView.clearUpload();
        this.reBrandList = [];
      },
      //修改缩略图
      imgReSuccess:function (file,title,fileList) {
        this.proReviseData.productImg = file.url;
      },
      imgReRemove:function () {
        this.proReviseData.productImg = '';
      },
      //修改主图
      mainImgReSuccess:function (file,title,fileList) {
        this.proReviseData.productMainImg = file.url;
      },
      mainImgReRemove:function () {
        this.proReviseData.productMainImg = '';
      },
      //修改展示图片
      multipReSuccess:function (file,title,fileList) {
        this.proReviseData.multipleFiles.push(file.url);
      },
      multipReRemove:function (file) {
        this.proReviseData.multipleFiles.splice(this.proReviseData.multipleFiles.indexOf(file.url),1);
      },
      //修改许可证
      licenceReSuccess:function (file,title,fileList) {
        this.proReviseData.licenceFront = file.url;
      },
      licenceReRemove:function () {
        this.proReviseData.licenceFront = '';
      },
      //修改备案信息
      recordReSuccess:function (file,title,fileList) {
        this.proReviseData.recordFront = file.url;
      },
      recordReRemove:function () {
        this.proReviseData.recordFront = '';
      },

      //富文本相关
      handleEdiSuccess:function (res,file,fileList) {
        //编辑器实例
        let quill = this.$refs.myEditor.quill;
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
      arrHandleEdiSuccess:function (res,file,fileList) {
        //编辑器实例
        let quill = this.$refs.arrangeEditor.quill;
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
      reHandleEdiSuccess:function (res,file,fileList) {
        //编辑器实例
        let quill = this.$refs.myReEditor.quill;
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
      reArrHandleEdiSuccess:function (res,file,fileList) {
        //编辑器实例
        let quill = this.$refs.arrangeReEditor.quill;
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
      //格式限制
      handleEdiFormatError:function () {
        this.$Message.warning('请选择格式为“jpg，jpeg，png，bmp”格式的图片！');
      },
      handleEdiBefore:function (file) {
        const len = file.name.length <= 50;
        if (!len) {
          this.$Message.warning('图片名过长！');
        }
        return len;
      },
      getBrand:function () {
        if (this.proValue) {
          this.proFormData.productBrand = '';
          axios.HealthProductBrand({vendorId:this.proFormData.vendorId})
            .then(res => {
              //console.log(res);
              if (res.code === 200) {
                this.brandList = res.result;
              } else {
                this.$Message.error('品牌查询失败！')
              }
            })
            .catch(error => {
              console.log(error);
              this.$Message.error('品牌查询失败！')
            })
        }
      },
      firstReBrand:function () {
       this.axiosBrand();
      },
      reGetBrand:function () {
        if (this.proReviseValue) {
          this.proReviseData.productBrand = '';
          this.axiosBrand();
        }
      },
      axiosBrand:function () {
        axios.HealthProductBrand({vendorId:this.proReviseData.vendorId})
          .then(res => {
            //console.log(res);
            if (res.code === 200) {
              this.reBrandList = res.result;
            } else {
              this.$Message.error('品牌查询失败！')
            }
          })
          .catch(error => {
            console.log(error);
            this.$Message.error('品牌查询失败！')
          })
      }
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
  .add-title{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 20px;
    padding: 10px;
    border-bottom: 1px solid #99BBE8;
    .add-tips{
      font-size: 14px;
    }
    .add-close{
      cursor: pointer;
    }
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
  .detailSpan{
    padding: 10px 0;
  }
  .detailWidth{
    width: 1000px;
    //padding: 10px 12px 10px 0;
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
