"use strict";define([],function(){return["$rootScope","$scope","$stateParams","$http","$timeout","$mdDialog",function($rootScope,$scope,$stateParams,$http,$timeout,$mdDialog){function getPipeList(){return $scope.loading=!0,$scope.ajax("pipe_init").then(function(data){if("boolean"==typeof data.is_success&&data.is_success||"string"==typeof data.is_success&&"true"==data.is_success){var pipeList=data.channel_list;pipeList.unshift(defaultPipe),$scope.pipeList=pipeList}})["finally"](function(){$scope.loading=!1})}var pipeQ=void 0;$scope.columns=[{text:"通道名称",name:"channel_name",style:{"text-align":"center",width:"auto"}},{text:"通道编码",name:"channel_code",style:{"text-align":"center",width:"380px"}},{text:"剩余数量",name:"remaining_num",style:{"text-align":"center",width:"180px"}},{text:"最后发送时间",name:"last_send_time",style:{"text-align":"center",width:"360px"}}];var defaultPipe={channel_id:"",channel_name:"短信全部通道"};$scope.pipeList=[defaultPipe],$scope.prodList=[],$scope.reset=function(){$scope.loading=!0,$scope.currentPipe=defaultPipe,pipeQ=getPipeList(),$scope.pageIndex=1,$scope.pageSize=new Number(10)},$scope.searcher=function(index,size){return $scope.refreshing=!0,pipeQ.then(function(){return $scope.ajax("balance_get",{pageindex:index||$scope.pageIndex,pagesize:size||$scope.pageSize,channel_id:$scope.currentPipe&&$scope.currentPipe.channel_id},function(data){"boolean"==typeof data.is_success&&data.is_success||"string"==typeof data.is_success&&"true"==data.is_success?($scope.prodList=data.balance_list,$scope.total=data.list_count):($rootScope.alert(data.msg),$scope.total=0)},function(){$scope.total=0})["finally"](function(){$scope.refreshing=!1})})},$scope.research=function(){$scope.pageIndex=1,$scope.pageSize=new Number(10)},$scope.selectPipe=function(pipe){$scope.currentPipe=pipe,$scope.research()},$stateParams.channel_id?($scope.loading=!0,pipeQ=getPipeList().then(function(){$scope.currentPipe=[].concat.apply([],$scope.pipeList.map(function(r){return r.channel_id.toLowerCase()==$stateParams.channel_id.toLowerCase()?[r]:[]}))[0]||defaultPipe}),$scope.pageIndex=1,$scope.pageSize=new Number(10)):$scope.reset(),window.test=$scope}]});