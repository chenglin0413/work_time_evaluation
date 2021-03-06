var app = angular
  .module('app', [])
  .controller('wteController', ['$scope', '$location',
    function ($scope, $location) {

      //public variable
      var _self = this;

      // ==============================
      // public method
      // ==============================


      // ==============================
      // public property
      // ==============================
      _self.property=[];//head_property
      _self.modules_detail=[];//detail column
      _self.modules_develop=[];//develop column
      _self.modules_test=[];//test column
      _self.modules_dynamic_table=[];//dynamitc_tab column
      _self.modules={};
      _self.modules_arr=[];
      _self.item_name=[];
      _self.newItem ={};// new_item
      
      // 初始化資料
      _init();
      

      // ==============================
      // public method implement
      // ==============================
      _self.createItem = createItem; //新增項目
      _self.clearInput = clearInput; //清除輸入
      _self.modifyItem = modifyItem; //修改項目
      _self.removeItem = removeItem; //刪除項目
      _self.enableEdit = enableEdit; //let layout can input
      _self.disableEdit = disableEdit; //let layout show value
      _self.sumTime = sumTime;
      _self.calcPercent = calcPercent;
      _self.timeCalcProc = timeCalcProc;
      _self.editModuleForLoop = editModuleForLoop;
      // ==============================
      // private method implement
      // ==============================
      function _init() {
        _self.property=
        {
            issuNO:"emp-XXX",
            groupType:"資材組/工程組/保養組",
            demand:"莊斐傑_便_A06801282_增訂-越南工程廠商自備工具物品清單作業",
            personInChar:"XXX",
            evalTime:348,
            estiTime:201
        }
         _self.modules_detail=[
          {   
            txtItem:"需求性評估/確認",
            txtEvalTime:0,
            txtEvalPercent:"",
            txtEstiTime:0,
            txtEstiPercent:"",
            txtComments:""                            
          },
          {
            txtItem:"系統影響性評估",
            txtEvalTime:0,
            txtEvalPercent:"",
            txtEstiTime:0,
            txtEstiPercent:"",
            txtComments:""
          }
        ]
        _self.modules_develop=[
          { 
            txtItem:"開發(網頁)",
            txtEvalTime:0,
            txtEvalPercent:"",
            txtEstiTime:0,
            txtEstiPercent:"",
            txtComments:""
          },
          {
            txtItem:"開發(批次)",
            txtEvalTime:0,
            txtEvalPercent:"",
            txtEstiTime:0,
            txtEstiPercent:"",
            txtComments:""
          },
          {
            txtItem:"開發(資料交換)",
            txtEvalTime:0,
            txtEvalPercent:"",
            txtEstiTime:0,
            txtEstiPercent:"",
            txtComments:""
          }
        ]
        _self.modules_test=[
          { 
            txtItem:"測試(網頁)",
            txtEvalTime:0,
            txtEvalPercent:"",
            txtEstiTime:0,
            txtEstiPercent:"",
            txtComments:""
          },
          {
            txtItem:"測試(批次)",
            txtEvalTime:0,
            txtEvalPercent:"",
            txtEstiTime:0,
            txtEstiPercent:"",
            txtComments:""
          },
          {
            txtItem:"測試(資料交換)",
            txtEvalTime:0,
            txtEvalPercent:"",
            txtEstiTime:0,
            txtEstiPercent:"",
            txtComments:""
          },
          { 
            txtItem:"整合測試",
            txtEvalTime:0,
            txtEvalPercent:"",
            txtEstiTime:0,
            txtEstiPercent:"",
            txtComments:""
          },
          {
            txtItem:"上線前確認",
            txtEvalTime:0,
            txtEvalPercent:"",
            txtEstiTime:0,
            txtEstiPercent:"",
            txtComments:""
          },
          {
            txtItem:"上線佈署/程式併版",
            txtEvalTime:0,
            txtEvalPercent:"",
            txtEstiTime:0,
            txtEstiPercent:"",
            txtComments:""
          } 
        ]
        _self.modules_dynamic_table=[
          {
             txtItem:"每月客服/維運 工時",
             txtEvalTime:0,
             txtEvalPercent:"",
             txtEstiTime:0,
             txtEstiPercent:"",
             txtComments:"預估上線後產生的每月維運工時，若為新模組請務必預估。"
          }    
        ]
        _self.modules=
        { 
            detail:_self.modules_detail,
            develop:_self.modules_develop,
            test:_self.modules_test,
            dynamic_table:_self.modules_dynamic_table
        }
        _self.item_name=[
          "工時明細","系統開發","系統測試","其他"
        ]
        _self.modules_arr=[
          _self.modules.detail,_self.modules.develop,_self.modules.test,_self.modules.dynamic_table
        ]
      }

      function createItem(new_item,moduel){
        let new_input_item = new_item;//clone a input item
        let evalTime = new_item.txtEvalTime;//get evalTime 
        let estiTime = new_item.txtEstiTime;//get estiTime 
        if(evalTime==null)new_input_item.txtEvalTime=0;
        if(estiTime==null)new_input_item.txtEstiTime=0;     
        new_input_item.removable=true;//add a removable property     
        moduel.push(new_input_item);
        _self.newItem = {};
      }
      function modifyItem(){
        alert("完成修改 ~!");
      }
      function removeItem(module,index){
        module.splice(index,1);
        timeCalcProc();// re calculate Time amout and percentage
      }
      function clearInput(){
        _self.newItem={};
      }
      function enableEdit(){
        editModuleForLoop(true);
        
        //property copy
        reverseChange('modify');
        _self.button=true;// hide modify btn
      }
      function disableEdit(action){
        if(action=='save') {
          modifyItem();
          timeCalcProc();// re calculate Time amout and percentage
        }else{
          reverseChange('reverse');
          timeCalcProc();// re calculate Time amout and percentage
        }
        editModuleForLoop(false);
        _self.button=false;// show modify btn
      }

      function calcPercent(){
        let sumEvalTime = _self.property.evalTime;//get evalTime
        let sumEstiTime = _self.property.estiTime;//get estiTime
        calPercentForeach(_self.modules_arr,sumEvalTime,sumEstiTime);
      }
      function calPercentForeach(modules,sumEval,sumEsti){
        modules.forEach(function(module){
          module.forEach(function(item){
            let  evalTime = item.txtEvalTime;
            let  estiTime = item.txtEstiTime;
            item.txtEvalPercent = Number.isNaN((evalTime/sumEval))? 0+'%' : Math.round((evalTime/sumEval)*100) +'%';
            item.txtEstiPercent = Number.isNaN((estiTime/sumEsti))? 0+'%' : Math.round((estiTime/sumEsti)*100) +'%';
          })
        });
      }
      function sumTime(modules,propertyName,columnName){
        let sum = 0;
        modules.forEach(function(item){
            item.forEach(function(item_inside){
                sum+=item_inside[columnName];
            });
        });
        _self.property[propertyName] = sum;
      }
      function timeCalcProc(){
        let modules =_self.modules_arr;
        //call sumEvalTime,sumEstiTime
        sumTime(modules,'evalTime','txtEvalTime');
        sumTime(modules,'estiTime','txtEstiTime');
        // calculate percentage 
        calcPercent();
      }
      function reverseChange(action){
        let modules = _self.modules_arr;
        modules.forEach(function(module){
            module.forEach(function(item){
              if(action=='modify'){
                item.copyTxtEvalTime = item.txtEvalTime;
                item.copyTxtEstiTime = item.txtEstiTime;
                item.copyTxtComments = item.txtComments;
              }else if(action=='reverse'){
                item.txtEvalTime = item.copyTxtEvalTime;
                item.txtEstiTime = item.copyTxtEstiTime;
                item.txtComments = item.copyTxtComments;
              }
            })
        });
      }
      function editModuleForLoop(boolean){
        let modules = _self.modules_arr;
        modules.forEach(function(module){
            module.forEach(function(item){
                item.edit=boolean;
            })
        });

      }
    }])
  ;
