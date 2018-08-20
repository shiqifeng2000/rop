"use strict";define(["../../services"],function(cta){return["$rootScope","$scope","$q","$location","$http","$timeout","$mdDialog","MiscTool","ROPDateUtil",function($rootScope,$scope,$q,$location,$http,$timeout,$mdDialog,MiscTool,ROPDateUtil){$scope.columns=[{text:"通道名称",name:"channel_name",style:{width:"176px","text-align":"center"}},{text:"短信内容",name:"sms_content"},{text:"接收短信手机",name:"send_mobile",style:{width:"176px","text-align":"center"}},{text:"发送结果",name:"succeed_yn",style:{width:"88px","text-align":"center"}},{text:"发送时间",name:"send_time",formatter:function(str){var result="";try{result=ROPDateUtil.freeFormatDate(new Date(str),"yyyy-MM-dd HH:mm:ss")}catch(e){}return result},style:{width:"196px","text-align":"center"}}],$scope.loading=!0;var initQ=$scope.ajax("init").then(function(data){return $scope.channels=data.channel_list,data})["finally"](function(){$scope.loading=!1});$scope.chooseChannel=function(channel){$scope.selectChannel=channel,$scope.research()},$scope.reset=function(){$scope.selectChannel=null,$scope.now=new Date,$scope.mindate=ROPDateUtil.incrementDays($scope.now,-365),$scope.maxdate=new Date,$scope.pageIndex=1,$scope.pageSize=new Number(10)},$scope.research=function(){$scope.pageIndex=1,$scope.pageSize=new Number(10)},$scope.searcher=function(index,size){$scope.refreshing=!0;var previous=$scope.tableData&&$scope.tableData._select;return initQ.then(function(){return $scope.ajax("list",{pageindex:index||$scope.pageIndex,pagesize:size||$scope.pageSize,channel_id:$scope.selectChannel?$scope.selectChannel.channel_id:"",send_time_begin:ROPDateUtil.freeFormatDate($scope.mindate,"yyyy-MM-dd"),send_time_end:ROPDateUtil.freeFormatDate($scope.maxdate,"yyyy-MM-dd")},function(data){"boolean"==typeof data.is_success&&data.is_success||"string"==typeof data.is_success&&"true"==data.is_success?($scope.tableData=data.send_list,$scope.tableData&&$scope.tableData[0]&&(previous?$scope.tableData._select=[].concat.apply([],$scope.tableData.map(function(r){return previous.id==r.id?[r]:[]}))[0]:$scope.tableData._select=$scope.tableData[0]),$scope.total=data.list_count):($rootScope.alert(data.msg),$scope.total=0)},function(){$scope.total=0})["finally"](function(){$scope.refreshing=!1})})},$scope["export"]=function(){return $scope.refreshing?$q.reject():($scope.refreshing=!0,$scope.ajax("export",{}).then(function(data){if("Chrome"==$rootScope.browserType){var a=window.document.createElement("a");a.href=data.export_url,a.download=!0,a.click()}else"Safari"==$rootScope.browserType?window.location.href=data.export_url:window.open(data.export_url,"_blank")})["finally"](function(){$scope.refreshing=!1}))},$scope.reset(),window.test=$scope}]});