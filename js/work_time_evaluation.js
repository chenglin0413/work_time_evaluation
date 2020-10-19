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
      _self.modules_normal=[];// table_data
      _self.modules_dynamic_table=[];
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

      // ==============================
      // private method implement
      // ==============================
      function _init() {
        _self.backuypdata = [
          

        ]
        _self.property=
            {
             issuNO:"emp-XXX",
              groupType:"資材組/工程組/保養組",
              demand:"莊斐傑_便_A06801282_增訂-越南工程廠商自備工具物品清單作業",
              personInChar:"XXX",
              evalTime:348,
              estiTime:201
            }
        
        _self.modules_normal=[
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
            },
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
            },
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
      }

      function createItem(new_item){
        let new_input_item = new_item;
        let evalTime = new_item.txtEvalTime;
        let estiTime = new_item.txtEstiTime;
        if(new_input_item.txtItem!=null){// no txtItem , create not work
          if(evalTime==null)new_input_item.txtEvalTime=0;
          if(estiTime==null)new_input_item.txtEstiTime=0;          
          _self.modules_dynamic_table.push(new_input_item);
          _self.newItem = {};
        }else{
          alert("Please fill in item first!");
        }
      }
      function modifyItem(){
        alert("完成修改 ~!");
      }
      function removeItem(index){
        _self.modules_dynamic_table.splice(index,1);
      }
      function clearInput(){
        _self.newItem={};
      }
      function enableEdit(item){
        item.edit=true;
        //property copy
        reverseChange(item,'modify');
      }
      function disableEdit(item,action){
        
        if(action=='save') {
          modifyItem();
          timeCalcProc();// re calculate Time amout and percentage
        }else{
          reverseChange(item,'reverse');
          timeCalcProc();// re calculate Time amout and percentage
        }
        item.edit=false;
      }

      function calcPercent(){
        let sumEvalTime = _self.property.evalTime;//get evalTime
        let sumEstiTime = _self.property.estiTime;//get estiTime
        calPercentForeach(_self.modules_normal,sumEvalTime,sumEstiTime);
        calPercentForeach(_self.modules_dynamic_table,sumEvalTime,sumEstiTime);
      }
      function calPercentForeach(module,sumEval,sumEsti){
        module.forEach(function(item){
          let  evalTime = item.txtEvalTime;
          let  estiTime = item.txtEstiTime;
          item.txtEvalPercent = Number.isNaN((evalTime/sumEval))? 0+'%' : Math.round((evalTime/sumEval)*100) +'%';
          item.txtEstiPercent = Number.isNaN((estiTime/sumEsti))? 0+'%' : Math.round((estiTime/sumEsti)*100) +'%';
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
        let modules = [_self.modules_normal,_self.modules_dynamic_table];
        //call sumEvalTime,sumEstiTime
        sumTime(modules,'evalTime','txtEvalTime');
        sumTime(modules,'estiTime','txtEstiTime');
        // calculate percentage 
        calcPercent();
      }
      function reverseChange(item,action){
        if(action=='modify'){
          item.copyTxtEvalTime = item.txtEvalTime;
          item.copyTxtEstiTime = item.txtEstiTime;
          item.copyTxtComments = item.txtComments;
        }else if (action=='reverse'){
          item.txtEvalTime = item.copyTxtEvalTime;
          item.txtEstiTime = item.copyTxtEstiTime;
          item.txtComments = item.copyTxtComments;
        }
      }
    }])
  ;
