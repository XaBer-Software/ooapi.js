// XaBer Software Object Oriented API ® 2012 by XaBer Software. All rights reserved.

function argsAsArray(args)
{var ret=new Array();if((args!==undefined)&&(args!=null))
{var l=args.length;for(var i=0;i<l;i++)
ret.push(args[i]);}
return(ret);}
function isString(a){return typeof a=='string';}
function isFunction(a){return typeof a=='function';}
function isArray(a){return(a instanceof Array);}
function xbs_round(num,dec){var result=Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);return result;}
function xbs_ispair(nombre)
{return((nombre%2)==0);}
function xbs_rand_int(min,max)
{return(Math.floor(Math.random()*(max-min+1))+min);}
function xbs_min()
{var args=argsAsArray(xbs_min.arguments);var max_i=args.length;if(max_i==0)
return(0);var vmin=args[0];if(max_i==1)
return(vmin);for(var i=0;i<max_i;i++)
if(args[i]<vmin)
vmin=args[i];return(vmin);}
function xbs_max()
{var args=argsAsArray(xbs_max.arguments);var max_i=args.length;if(max_i==0)
return(0);var vmax=args[0];if(max_i==1)
return(vmax);for(var i=0;i<max_i;i++)
if(args[i]>vmax)
vmax=args[i];return(vmax);}
function fixed_from_char_code(codePt)
{if(codePt>0xFFFF)
{codePt-=0x10000;return String.fromCharCode(0xD800+(codePt>>10),0xDC00+(codePt&0x3FF));}
return String.fromCharCode(codePt);}
var _xbs_jso=this;var _xbs_packages=new Array();var _xbs_templates=new Array();var _xbs_classes=new Array();var _xbs_classScope=new Array();var _xbs_callstack=new Array();var _xbs_instances=new Array();var _xbs_instancesIdCnt=0;var _xbs_public=1;var _xbs_protected=2;var _xbs_private=4;var _xbs_package=8;function _xbs_inherit_from_class(inheritance_package,inheritance_class,currClass,currPackage,inheritClass){if((currPackage!=null)&&(currPackage._name==inheritClass._package._name))
{currClass._super[inheritance_package+'.'+inheritance_class]=inheritClass;}
else
{if(inheritClass._level==_xbs_public)
currClass._super[inheritance_package+'.'+inheritance_class]=inheritClass;else
internalAlert('[class "'+currClass._name+'"] - Can not inherit private class "'+inheritance_package+'.'+inheritance_class+'".');}}
function _xbs_inherit_from(inheritance,currClass,currPackage){var inheritance_package='';var inheritance_class='';var className=currClass._name;if(inheritance.length>0)
{var i=inheritance.indexOf('.');if(i==-1)
{inheritance_class=inheritance;}
else
{if(i==0)
{inheritance_class=inheritance.substr(1);}
else
{inheritance_package=inheritance.substr(0,i);inheritance_class=inheritance.substr(i+1);}}
if(inheritance_package.length>0)
{if(_xbs_packages[inheritance_package]!==undefined)
{if(_xbs_packages[inheritance_package]._classes[inheritance_class]!==undefined)
_xbs_inherit_from_class(inheritance_package,inheritance_class,currClass,currPackage,_xbs_packages[inheritance_package]._classes[inheritance_class]);else
internalAlert('[class "'+className+'"] - Can not inherit class "'+inheritance+'": unknown class.');}
else
{internalAlert('[class "'+className+'"] - Can not inherit class "'+inheritance+'": unknown package.');}}
else
{if((_xbs_jso[inheritance_class]!==undefined)&&(_xbs_jso[inheritance_class]._name!==undefined))
{if((_xbs_jso[inheritance_class]._package!=null)&&(_xbs_jso[inheritance_class]._package._name.length>0))
currClass._super[_xbs_jso[inheritance_class]._package._name+'.'+inheritance_class]=_xbs_jso[inheritance_class];else
currClass._super[inheritance_class]=_xbs_jso[inheritance_class];}
else
{if(currPackage!=null)
{if(currPackage._classes[inheritance_class]!==undefined)
_xbs_inherit_from_class(currPackage._name,inheritance_class,currClass,currPackage,currPackage._classes[inheritance_class])
else
internalAlert('[class "'+className+'"] - Can not inherit class "'+inheritance+'": unknown class.');}
else
{internalAlert('[class "'+className+'"] - Can not inherit class "'+inheritance+'": unknown class.');}}}}}
function _xbs_level_to_string(level)
{if(level==_xbs_public)
return('_xbs_public');if(level==_xbs_protected)
return('_xbs_protected');if(level==_xbs_private)
return('_xbs_private');if(level==_xbs_package)
return('_xbs_package');}
function _xbs_template_validate(pClass,templateName,currPackage)
{var pTemplate=null;var template_package='';var template_name='';var i=templateName.indexOf('.');if(i==-1)
{template_name=templateName;}
else
{if(i==0)
{template_name=templateName.substr(1);}
else
{template_package=templateName.substr(0,i);template_name=templateName.substr(i+1);}}
if(templateName.length>0)
{if(_xbs_packages[template_package]===undefined)
{internalAlert('[class "'+className+'"] - Can not templatize from "'+templateName+'": unknown package.');return(false);}
if(_xbs_packages[template_package]._templates[template_name]===undefined)
{internalAlert('[class "'+className+'"] - Can not templatize from "'+templateName+'": unknown template.');return(false);}
pTemplate=_xbs_packages[template_package]._templates[template_name];}
else
{if((_xbs_jso[template_name]!==undefined)&&(_xbs_jso[template_name]._name!==undefined))
{pTemplate=_xbs_jso[template_name];}
else
{if(currPackage==null)
{internalAlert('[class "'+className+'"] - Can not templatize from "'+templateName+'": unknown template.');return(false);}
if(currPackage._templates[template_name]===undefined)
{internalAlert('[class "'+className+'"] - Can not templatize from "'+templateName+'": unknown template.');return(false);}
pTemplate=currPackage._templates[template_name];}}
var validateResult=true;if(pTemplate!=null)
{for(var i in pTemplate._const)
{if(pClass._const[i]===undefined)
{internalAlert('[class "'+className+'"] - the const "'+i+'" is not defined, as required in template "'+templateName+'".');validateResult=false;}}
for(var i in pTemplate._data)
{if(pClass._data[i]===undefined)
{internalAlert('[class "'+className+'"] - the data "'+i+'" is not defined, as required in template "'+templateName+'".');validateResult=false;}
else
{if(pClass._data[i].level!=pTemplate._data[i].level)
{internalAlert('[class "'+className+'"] - the data "'+i+'" has a bad level, as defined in template "'+templateName+'": '+_xbs_level_to_string(pClass._data[i].level)+' defined when '+_xbs_level_to_string(pTemplate._data[i].level)+' expected.');validateResult=false;}
else
{if(pClass._data[i].static!=pTemplate._data[i].static)
{if(pTemplate._data[i].static==true)
internalAlert('[class "'+className+'"] - the data "'+i+'" is defined has static in the template "'+templateName+'", and wrong declared as non static.');else
internalAlert('[class "'+className+'"] - the data "'+i+'" is defined has non static in the template "'+templateName+'", and wrong declared as static.');validateResult=false;}}}}
for(var i in pTemplate._prop)
{if(pClass._prop[i]===undefined)
{internalAlert('[class "'+className+'"] - the property "'+i+'" is not defined, as required in template "'+templateName+'".');validateResult=false;}
else
{if(pClass._prop[i].static!=pTemplate._prop[i].static)
{if(pTemplate._prop[i].static==true)
internalAlert('[class "'+className+'"] - the property "'+i+'" is defined has static in the template "'+templateName+'", and wrong declared as non static.');else
internalAlert('[class "'+className+'"] - the property "'+i+'" is defined has non static in the template "'+templateName+'", and wrong declared as static.');validateResult=false;}
else
{if(pClass._prop[i].level!=pTemplate._prop[i].level)
{internalAlert('[class "'+className+'"] - the property "'+i+'" has a bad level, as defined in template "'+templateName+'": '+_xbs_level_to_string(pClass._prop[i].level)+' defined when '+_xbs_level_to_string(pTemplate._prop[i].level)+' expected.');validateResult=false;}
else
{if(pClass._prop[i].getter.level!=pTemplate._prop[i].getter)
{internalAlert('[class "'+className+'"] - the getter of the property "'+i+'" has a bad level, as defined in template "'+templateName+'": '+_xbs_level_to_string(pClass._prop[i].getter.level)+' defined when '+_xbs_level_to_string(pTemplate._prop[i].getter)+' expected.');validateResult=false;}
else
{if((pTemplate._prop[i].setter==0)&&(pClass._prop[i].setter.func!=null))
{internalAlert('[class "'+className+'"] - the setter of the property "'+i+'" is declared and expected to be not declared as defined in template "'+templateName+'".');validateResult=false;}
else
{if((pTemplate._prop[i].setter>0)&&(pClass._prop[i].setter.func==null))
{internalAlert('[class "'+className+'"] - the setter of the property "'+i+'" is not declared and expected to be declared as defined in template "'+templateName+'".');validateResult=false;}
else
{if(pClass._prop[i].setter.level!=pTemplate._prop[i].setter)
{internalAlert('[class "'+className+'"] - the setter of the property "'+i+'" has a bad level, as defined in template "'+templateName+'": '+_xbs_level_to_string(pClass._prop[i].setter.level)+' defined when '+_xbs_level_to_string(pTemplate._prop[i].setter)+' expected.');validateResult=false;}}}}}}}}
for(var i in pTemplate._event)
{if(pClass._event[i]===undefined)
{internalAlert('[class "'+className+'"] - the event "'+i+'" is not defined, as required in template "'+templateName+'".');validateResult=false;}
else
{if(pClass._event[i].level!=pTemplate._event[i].level)
{internalAlert('[class "'+className+'"] - the event "'+i+'" has a bad level, as defined in template "'+templateName+'": '+_xbs_level_to_string(pClass._event[i].level)+' defined when '+_xbs_level_to_string(pTemplate._event[i].level)+' expected.');validateResult=false;}
else
{if(pClass._event[i].static!=pTemplate._event[i].static)
{if(pTemplate._event[i].static==true)
internalAlert('[class "'+className+'"] - the event "'+i+'" is defined has static in the template "'+templateName+'", and wrong declared as non static.');else
internalAlert('[class "'+className+'"] - the event "'+i+'" is defined has non static in the template "'+templateName+'", and wrong declared as static.');validateResult=false;}}}}
for(var i in pTemplate._func)
{if(pClass._func[i]===undefined)
{internalAlert('[class "'+className+'"] - the function "'+i+'" is not defined, as required in template "'+templateName+'".');validateResult=false;}
else
{if(pClass._func[i].level!=pTemplate._func[i].level)
{internalAlert('[class "'+className+'"] - the function "'+i+'" has a bad level, as defined in template "'+templateName+'": '+_xbs_level_to_string(pClass._func[i].level)+' defined when '+_xbs_level_to_string(pTemplate._func[i].level)+' expected.');validateResult=false;}
else
{if(pClass._func[i].static!=pTemplate._func[i].static)
{if(pTemplate._func[i].static==true)
internalAlert('[class "'+className+'"] - the function "'+i+'" is defined has static in the template "'+templateName+'", and wrong declared as non static.');else
internalAlert('[class "'+className+'"] - the function "'+i+'" is defined has non static in the template "'+templateName+'", and wrong declared as static.');validateResult=false;}}}}}
return(validateResult);}
function newPackage(packName,packProperties,packCode){if(packProperties===undefined)
packProperties={using:[]};if(packProperties.using===undefined)
packProperties.using=new Array();if(_xbs_classScope.len>0)
{internalAlert('Can not create package into another package or class or function.');return;}
if(_xbs_jso[packName]!==undefined)
{internalAlert('Can not redefine package named "'+packName+'".');return;}
for(var i in packProperties.using)
{if(_xbs_jso[packProperties.using[i]]===undefined)
{internalAlert('The package "'+packName+'" need the package "'+packProperties.using[i]+'", that is not previously loaded.');return;}}
_xbs_jso[packName]=new Object;var pPackage=_xbs_jso[packName];_xbs_packages[packName]=pPackage;pPackage._name=packName;pPackage._dependencies=new Array();for(var i in packProperties.using)
pPackage._dependencies[packProperties.using[i]]=_xbs_jso[packProperties.using[i]];pPackage._templates=new Array();pPackage._classes=new Array();pPackage.newTemplate=function(){if(_xbs_classScope[0]=='_pk_'+this._name+'_pk_')
{var args=argsAsArray(this.newTemplate.arguments);args.unshift(this);return(_xbs_newTemplate.apply(_xbs_jso,args));}
else
{internalAlert('Can not create a template for a package outside itself.');}
return(null);};pPackage.getTemplate=function(templateName){var scope=0;if((_xbs_classScope[0]=='_pk_'+this._name+'_pk_')||(_xbs_classScope[0]==this._name)||(_xbs_classScope[0].indexOf(this._name+'.')==0))
{scope=7;}
else
{if(_xbs_classScope[0].indexOf('_tmp_'+this._name)==0)
{var intemplate=_xbs_classScope[0].substr(6+this._name.length,_xbs_classScope[0].length-11-this._name.length);if(this._templates[intemplate]!==undefined)
scope=7;else
scope=1;}
else
{scope=1;}}
if((this._templates[templateName]!==undefined)&&((scope&this._templates[templateName]._level)==this._templates[templateName]._level))
return(this._templates[templateName]);internalAlert('Unknown class "'+templateName+'" in the package "'+this._name+'".');return(null);};pPackage.newClass=function(){if(_xbs_classScope[0]=='_pk_'+this._name+'_pk_')
{var args=argsAsArray(this.newClass.arguments);args.unshift(this);return(_xbs_newClass.apply(_xbs_jso,args));}
else
{internalAlert('Can not create a class for a package outside itself.');}
return(null);};pPackage.getClass=function(className){var scope=0;if((_xbs_classScope[0]=='_pk_'+this._name+'_pk_')||(_xbs_classScope[0]==this._name)||(_xbs_classScope[0].indexOf(this._name+'.')==0))
{scope=7;}
else
{if(_xbs_classScope[0].indexOf('_cls_'+this._name)==0)
{var inclass=_xbs_classScope[0].substr(6+this._name.length,_xbs_classScope[0].length-11-this._name.length);if(this._classes[inclass]!==undefined)
scope=7;else
scope=1;}
else
{scope=1;}}
if((this._classes[className]!==undefined)&&((scope&this._classes[className]._level)==this._classes[className]._level))
return(this._classes[className]);internalAlert('Unknown class "'+className+'" in the package "'+this._name+'".');return(null);};if(packCode!==undefined)
{if(isFunction(packCode)==true)
{_xbs_classScope.unshift('_pk_'+packName+'_pk_');packCode.apply(pPackage);_xbs_classScope.shift();}}}
function newTemplate(templateName,templateProperties,templateCode){return(_xbs_newTemplate(null,templateName,templateProperties,templateCode));}
function _xbs_newTemplate(pPackage,templateName,templateProperties,templateCode){if((pPackage!=null)&&(_xbs_classScope[0]!='_pk_'+pPackage._name+'_pk_'))
{internalAlert('[class "'+pPackage._name+'"] - A template can not be defined outside his package definition.');return}
if(templateProperties===undefined)
{if(pPackage==null)
templateProperties={level:_xbs_public};else
templateProperties={level:_xbs_private};}
if(templateProperties.level===undefined)
{if(pPackage==null)
templateProperties.level=_xbs_public;else
templateProperties.level=_xbs_private;}
if((templateProperties.level!=_xbs_public)&&(templateProperties.level!=_xbs_private))
{internalAlert('The access level of a Template can only be public or private.');return;}
if(pPackage==null)
{if(_xbs_jso[templateName]!==undefined)
{internalAlert('Can not redefine template "'+templateName+'".');return;}
_xbs_jso[templateName]=new Object;var pTemplate=_xbs_jso[templateName];_xbs_templates.push(pTemplate);}
else
{if(pPackage._templates[templateName]!==undefined)
{internalAlert('Can not redefine template "'+pPackage._name+'.'+templateName+'".');return;}
pPackage._templates[templateName]=new Object;var pTemplate=pPackage._templates[templateName];if(templateProperties.level==_xbs_public)
{_xbs_templates.push(pTemplate);pPackage[templateName]=pTemplate;}}
pTemplate._name=templateName;if(pPackage==null)
{pTemplate._package=new Array();pTemplate._package._name='';}
else
{pTemplate._package=pPackage;}
pTemplate._level=templateProperties.level;pTemplate._func=new Array();pTemplate._data=new Array();pTemplate._prop=new Array();pTemplate._event=new Array();pTemplate._const=new Array();pTemplate.const=function(constName,dataProperties){newTmpConst(this,constName,dataProperties);};pTemplate.data=function(dataName,dataProperties){newTmpData(this,dataName,dataProperties);};pTemplate.property=function(propName,propProperties,getterLevel,setterLevel){newTmpProperty(this,propName,propProperties,getterLevel,setterLevel);};pTemplate.function=function(funcName,funcProperties){newTmpFunction(this,funcName,funcProperties);};pTemplate.event=function(eventName,eventProperties){newTmpEvent(this,eventName,eventProperties);};if(templateCode!==undefined)
{if(isFunction(templateCode)==true)
{_xbs_classScope.unshift('_tmp_'+pTemplate._package._name+'_'+templateName+'_tmp_');templateCode.apply(pTemplate);_xbs_classScope.shift();}}}
function newClass(className,classProperties,inheritance,classCode){return(_xbs_newClass(null,className,classProperties,inheritance,classCode));}
function _xbs_newClass(pPackage,className,classProperties,inheritance,classCode){if((pPackage!=null)&&(_xbs_classScope[0]!='_pk_'+pPackage._name+'_pk_'))
{internalAlert('[class "'+pPackage._name+'"] - A class can not be defined outside his package definition.');return}
if(classProperties===undefined)
{if(pPackage==null)
classProperties={level:_xbs_public,static:false,abstract:false};else
classProperties={level:_xbs_private,static:false,abstract:false};}
if(classProperties.level===undefined)
{if(pPackage==null)
classProperties.level=_xbs_public;else
classProperties.level=_xbs_private;}
if((classProperties.level!=_xbs_public)&&(classProperties.level!=_xbs_private))
{internalAlert('The access level of a Class can only be public or private.');return;}
if(classProperties.static===undefined)
classProperties.static=false;if(classProperties.abstract===undefined)
classProperties.abstract=false;if(pPackage==null)
{if(_xbs_jso[className]!==undefined)
{internalAlert('Can not redefine class "'+className+'".');return;}
_xbs_jso[className]=new Object;var pClass=_xbs_jso[className];_xbs_classes.push(pClass);}
else
{if(pPackage._classes[className]!==undefined)
{internalAlert('Can not redefine class "'+pPackage._name+'.'+className+'".');return;}
pPackage._classes[className]=new Object;var pClass=pPackage._classes[className];if(classProperties.level==_xbs_public)
{_xbs_classes.push(pClass);pPackage[className]=pClass;}}
pClass._super=new Array();pClass._name=className;pClass._instances=0;if((inheritance!==undefined)&&(inheritance!=null))
{if(isString(inheritance)==true)
{_xbs_inherit_from(inheritance,pClass,pPackage);}
else
{for(var i in inheritance)
_xbs_inherit_from(inheritance[i],pClass,pPackage);}}
if(pPackage==null)
{pClass._package=new Array();pClass._package._name='';}
else
{pClass._package=pPackage;}
pClass._level=classProperties.level;pClass._static=classProperties.static;pClass._abstract=classProperties.abstract;pClass._func=new Array();pClass._data=new Array();pClass._prop=new Array();pClass._event=new Array();pClass.isClass=function(className){return(_xbs_isClass(this,className));};pClass.const=function(constName,dataProperties,constValue){newConst(this,constName,dataProperties,constValue);};pClass.data=function(dataName,dataProperties,initValue){newData(this,dataName,dataProperties,initValue);};pClass.property=function(propName,propProperties,getterLevel,getter,setterLevel,setter){newProperty(this,propName,propProperties,getterLevel,getter,setterLevel,setter);};pClass.get=function(dtpropName){return(_xbs_getSData(this,dtpropName));};pClass.set=function(dtpropName,dataValue){_xbs_setSData(this,dtpropName,dataValue);};pClass.function=function(funcName,funcProperties,funcDef){newFunction(this,funcName,funcProperties,funcDef);};pClass.constructor=function(funcProperties,funcDef){if(funcProperties===undefined)
funcProperties={level:_xbs_public,static:false,abstract:false,override:true};if(funcProperties.level===undefined)
funcProperties.level=_xbs_public;funcProperties.static=false;funcProperties.abstract=false;funcProperties.override=true;newFunction(this,'_constructor',funcProperties,funcDef);this._func['_constructor'].super=new Array();for(var i in this._super)
{if(funcProperties[this._super[i]._name]!==undefined)
{this._func['_constructor'].super[i]=funcProperties[this._super[i]._name];}}};pClass.destructor=function(funcProperties,funcDef){if(funcProperties===undefined)
funcProperties={level:_xbs_public,static:false,abstract:false,override:true};if(funcProperties.level===undefined)
funcProperties.level=_xbs_public;funcProperties.static=false;funcProperties.abstract=false;funcProperties.override=true;newFunction(this,'_destructor',funcProperties,funcDef);};pClass.call=function(){var args=argsAsArray(this.call.arguments);args.unshift(this);return(_xbs_StaticCall.apply(_xbs_jso,args));};pClass.xblNew=function(){var args=argsAsArray(this.xblNew.arguments);args.unshift(this);return(xblNew.apply(_xbs_jso,args));};pClass.event=function(eventName,eventProperties){newEvent(this,eventName,eventProperties);};pClass.eventListenerAdd=function(eventName,pCallObj,pCallFunc){eventListenerAdd(this,eventName,pCallObj,pCallFunc);};pClass.eventListenerRem=function(eventName,pCallObj,pCallFunc){eventListenerRem(this,eventName,pCallObj,pCallFunc);};pClass.raiseEvent=function(eventName,eventDatas){raiseEvent(this,eventName,eventDatas);};var j=0;for(var i in pClass._super)
j++;if(j==0)
{pClass._event['_xbs_oninstanciated']=new Array();pClass._event['_xbs_oninstanciated']['active']=true;pClass._event['_xbs_oninstanciated']['callers']=new Array();pClass._event['_xbs_oninstanciated']['level']=_xbs_public;pClass._event['_xbs_oninstanciated']['override']=false;pClass._event['_xbs_oninstanciated']['scope']=pClass;pClass._event['_xbs_oninstanciated']['static']=false;}
if(classCode!==undefined)
{if(isFunction(classCode)==true)
{_xbs_classScope.unshift('_cls_'+pClass._package._name+'_'+className+'_cls_');classCode.apply(pClass);_xbs_classScope.shift();}}
if(classProperties.template!==undefined)
{var tmpResult=true;if(isString(classProperties.template)==true)
{tmpResult=_xbs_template_validate(pClass,classProperties.template,pPackage);}
else
{for(var i in classProperties.template)
{if(tmpResult==true)
tmpResult=_xbs_template_validate(pClass,classProperties.template[i],pPackage);}}
if(tmpResult==false)
{if(pPackage==null)
{delete _xbs_classes[pClass];if(_xbs_jso[className]!==undefined)
delete _xbs_jso[className];}
else
{delete pPackage._classes[className];if(pPackage[className]!==undefined)
delete pPackage[className];}}}}
function _xbs_directParent(class1,package2,class2){var package1='';var i=0;if(class1!==undefined)
{i=class1.indexOf('.');if(i>0)
{package1=class1.substr(0,i);class1=class1.substr(i+1);if(_xbs_packages[package1]._classes[class1]===undefined)
return(false);if(_xbs_packages[package1]._classes[class1]._super[package2+'.'+class2]===undefined)
return(false);}
else
{class1=class1.substr(i+1);if(_xbs_classes[class1]===undefined)
return(false);if(_xbs_classes[class1]._super[package2+'.'+class2]===undefined)
return(false);}
return(true);}
return(false);}
function newTmpConst(pTemplate,constName,constProperties){if(_xbs_classScope[0]!='_tmp_'+pTemplate._package._name+'_'+pTemplate._name+'_tmp_')
{internalAlert('[template "'+pTemplate._name+'"] - A constant can not be defined outside template definition.');return}
if(constProperties===undefined)
constProperties={level:_xbs_public,static:true};if(constProperties.level===undefined)
constProperties.level=_xbs_public;if(constProperties.static===undefined)
constProperties.static=false;if(constProperties.abstract===undefined)
constProperties.abstract=false;if(constProperties.level!=_xbs_public)
{internalAlert('[template "'+pTemplate._name+'"] - Can not define constant "'+constName+'" as protected or private.');}
else
{if(constProperties.abstract==true)
{internalAlert('[template "'+pTemplate._name+'"] - Can not define constant "'+constName+'" as abstract.');}
else
{if(constProperties.static==false)
{internalAlert('[template "'+pTemplate._name+'"] - Can not define constant "'+constName+'" as non static.');}
else
{if(pTemplate._const[constName]===undefined)
pTemplate._const[constName]=1;else
internalAlert('[template "'+pTemplate._name+'"] - Can not redefine "'+constName+'".');}}}}
function newConst(pClass,constName,constProperties,constValue){if(_xbs_classScope[0]!='_cls_'+pClass._package._name+'_'+pClass._name+'_cls_')
{internalAlert('[class "'+pClass._name+'"] - A constant can not be defined outside class definition.');return}
if(constProperties===undefined)
constProperties={level:_xbs_public,static:true,abstract:false};if(constProperties.level===undefined)
constProperties.level=_xbs_public;if(constProperties.static===undefined)
constProperties.static=true;if(constProperties.abstract===undefined)
constProperties.abstract=false;if(pClass._abstract==true)
{internalAlert('[class "'+pClass._name+'"] - Can not define constant "'+constName+'" on an abstract class.');}
else
{if(constProperties.abstract==true)
{internalAlert('[class "'+pClass._name+'"] - Can not define constant "'+constName+'" as abstract.');}
else
{if(constProperties.static==false)
{internalAlert('[class "'+pClass._name+'"] - Can not define constant "'+constName+'" as non static.');}
else
{if(pClass[constName]===undefined)
pClass[constName]=constValue;else
internalAlert('[class "'+pClass._name+'"] - Can not redefine "'+constName+'".');}}}}
_xbs_dtPropFunType=0;_xbs_dtPropFunOverrideSrc=null;function _xbs_dtpropfunExists(pClass,dtpropfunName,isData,override,scope){if(isData===undefined)isData=true;if(override===undefined)override=false;if(scope===undefined)scope=7;if(pClass._func[dtpropfunName]!==undefined)
{_xbs_dtPropFunType=3;_xbs_dtPropFunOverrideSrc=pClass._func[dtpropfunName];if((scope==7)||(scope==15)||((scope!=7)&&(scope!=15)&&(override==false)&&(isData==false)))
if((scope&pClass._func[dtpropfunName].level)==pClass._func[dtpropfunName].level)
return(true);}
if(pClass._prop[dtpropfunName]!==undefined)
{_xbs_dtPropFunType=2;_xbs_dtPropFunOverrideSrc=pClass._prop[dtpropfunName];if((scope==7)||(scope==15)||((scope!=7)&&(scope!=15)&&(override==false)&&(isData==false)))
if((scope&pClass._prop[dtpropfunName].level)==pClass._prop[dtpropfunName].level)
return(true);}
if(pClass._data[dtpropfunName]!==undefined)
{_xbs_dtPropFunType=1;_xbs_dtPropFunOverrideSrc=pClass._data[dtpropfunName];if((scope&pClass._data[dtpropfunName].level)==pClass._data[dtpropfunName].level)
return(true);}
var scope2=0;if((scope&8)==8)
{if(scope==15)
scope2=11;else
scope2=9;}
else
{if(scope==7)
scope2=3;else
scope2=1;}
for(var i in pClass._super)
{if(_xbs_dtpropfunExists(pClass._super[i],dtpropfunName,isData,override,scope2)==true)
return(true);}
return(false);}
function newTmpData(pTemplate,dataName,dataProperties){if(_xbs_classScope[0]!='_tmp_'+pTemplate._package._name+'_'+pTemplate._name+'_tmp_')
{internalAlert('[template "'+pTemplate._name+'"] - A data can not be defined outside template definition.');return}
if(dataProperties===undefined)
dataProperties={level:_xbs_public,static:false};if(dataProperties.level===undefined)
dataProperties.level=_xbs_public;if(dataProperties.static===undefined)
dataProperties.static=false;if(dataProperties.level==_xbs_private)
{internalAlert('[template "'+pTemplate._name+'"] - Can not define data "'+dataName+'" as private.');}
else
{if(pTemplate._data[dataName]!==undefined)
{internalAlert('[template "'+pTemplate._name+'"] - Can not redefine "'+dataName+'".');}
else
{pTemplate._data[dataName]=new Array();pTemplate._data[dataName].level=dataProperties.level;pTemplate._data[dataName].static=dataProperties.static;}}}
function newData(pClass,dataName,dataProperties,initValue){if(_xbs_classScope[0]!='_cls_'+pClass._package._name+'_'+pClass._name+'_cls_')
{internalAlert('[class "'+pClass._name+'"] - A data can not be defined outside class definition.');return}
if(dataProperties===undefined)
dataProperties={level:_xbs_public,static:false};if(dataProperties.level===undefined)
dataProperties.level=_xbs_public;if(dataProperties.static===undefined)
dataProperties.static=false;if(pClass._abstract==true)
{internalAlert('[class "'+pClass._name+'"] - Can not define data "'+dataName+'" on an abstract class.');}
else
{_xbs_dtPropFunType=0;_xbs_dtPropFunOverrideSrc=null;if(_xbs_dtpropfunExists(pClass,dataName,true)==false)
{pClass._data[dataName]=new Array();pClass._data[dataName].level=dataProperties.level;pClass._data[dataName].static=dataProperties.static;if(dataProperties.static==true)
{pClass._data[dataName].value=initValue;}
else
{if(initValue!==undefined)
internalAlert('[class "'+pClass._name+'"] - Warning! Can not initialize non static data "'+dataName+'" in definition. Initialize it in constructor.');pClass._data[dataName].value=null;}}
else
{internalAlert('[class "'+pClass._name+'"] - Can not redefine "'+dataName+'".');}}}
function newTmpProperty(pTemplate,propName,propProperties,getterLevel,setterLevel){if(_xbs_classScope[0]!='_tmp_'+pTemplate._package._name+'_'+pTemplate._name+'_tmp_')
{internalAlert('[template "'+pTemplate._name+'"] - Can not define property "'+propName+'": a property can not be defined outside template definition.');return}
if(propProperties===undefined)
propProperties={level:_xbs_public,static:false};if(propProperties.level===undefined)
propProperties.level=_xbs_public;if(propProperties.static===undefined)
propProperties.static=false;if(getterLevel===undefined)
getterLevel=propProperties.level;if(setterLevel===undefined)
setterLevel=propProperties.level;if(propProperties.level==0)
{internalAlert('[template "'+pTemplate._name+'"] - Property "'+propName+'" can not be private.');}
else
{if((getterLevel<propProperties.level)||(setterLevel<propProperties.level))
{internalAlert('[template "'+pTemplate._name+'"] - level error in property "'+propName+'": the accessibility of a getter or a setter can not be wider than the property level.');}
else
{if(pTemplate._prop[propName]===undefined)
{pTemplate._prop[propName]=new Array();pTemplate._prop[propName].level=propProperties.level;pTemplate._prop[propName].static=propProperties.static;pTemplate._prop[propName].getter=getterLevel;pTemplate._prop[propName].setter=setterLevel;}
else
{internalAlert('[template "'+pTemplate._name+'"] - Can not redefine "'+propName+'".');}}}}
function newProperty(pClass,propName,propProperties,getterLevel,getter,setterLevel,setter){if(_xbs_classScope[0]!='_cls_'+pClass._package._name+'_'+pClass._name+'_cls_')
{internalAlert('[class "'+pClass._name+'"] - Can not define property "'+propName+'": a property can not be defined outside class definition.');return}
if(propProperties===undefined)
propProperties={level:_xbs_public,static:false,abstract:false,override:false};if(propProperties.level===undefined)
propProperties.level=_xbs_public;if(propProperties.static===undefined)
propProperties.static=false;if(propProperties.override===undefined)
propProperties.override=false;if(propProperties.abstract===undefined)
propProperties.abstract=false;if(getterLevel===undefined)
getterLevel=propProperties.level;if(setterLevel===undefined)
setterLevel=propProperties.level;if((pClass._abstract==true)&&(propProperties.abstract==false))
{internalAlert('[class "'+pClass._name+'"] - Can not define non abstract property "'+propName+'" on an abstract class.');}
else
{if((pClass._static==true)&&(propProperties.static==false))
{internalAlert('[class "'+pClass._name+'"] - Can not define non static property "'+propName+'" on a static class.');}
else
{if((propProperties.level==_xbs_private)&&(propProperties.abstract==true))
{internalAlert('[class "'+pClass._name+'"] - Property "'+propName+'" can not be abstract and private.');}
else
{if((getterLevel<propProperties.level)||(setterLevel<propProperties.level))
{internalAlert('[class "'+pClass._name+'"] - level error in property "'+propName+'": the accessibility of a getter or a setter can not be wider than the property level.');}
else
{_xbs_dtPropFunType=0;_xbs_dtPropFunOverrideSrc=null;var result=_xbs_dtpropfunExists(pClass,propName,false,propProperties.override);if(result==false)
{if(propProperties.override==true)
{if(_xbs_dtPropFunType==0)
{internalAlert('[class "'+pClass._name+'"] - Can not override "'+propName+'": it is unknown.');return;}
if(_xbs_dtPropFunType!=2)
{internalAlert('[class "'+pClass._name+'"] - Can not override "'+propName+'": it is not a property.');return;}
if(_xbs_dtPropFunOverrideSrc.static!=propProperties.static)
{if(_xbs_dtPropFunOverrideSrc.static==true)
internalAlert('[class "'+pClass._name+'"] - Can not override "'+propName+'": can not change static to non static.');else
internalAlert('[class "'+pClass._name+'"] - Can not override "'+propName+'": can not change non static to static.');return;}
if(propProperties.abstract==true)
{internalAlert('[class "'+pClass._name+'"] - Can not override "'+propName+'": override property can not be abstract.');return;}
if(_xbs_dtPropFunOverrideSrc.level>propProperties.level)
{internalAlert('[class "'+pClass._name+'"] - Can not override "'+propName+'": accessibility can not be wider than overrided.');return;}}
pClass._prop[propName]=new Array();pClass._prop[propName].level=propProperties.level;pClass._prop[propName].static=propProperties.static;pClass._prop[propName].abstract=propProperties.abstract;pClass._prop[propName].override=propProperties.override;pClass._prop[propName].getter=new Array();pClass._prop[propName].getter.level=getterLevel;if(getter===undefined)
pClass._prop[propName].getter.func=null;else
pClass._prop[propName].getter.func=getter;pClass._prop[propName].setter=new Array();pClass._prop[propName].setter.level=setterLevel;if(setter===undefined)
pClass._prop[propName].setter.func=null;else
pClass._prop[propName].setter.func=setter;pClass._prop[propName].scope=pClass;}
else
{internalAlert('[class "'+pClass._name+'"] - Can not redefine "'+propName+'".');}}}}}}
function newTmpFunction(pTemplate,funcName,funcProperties){if(_xbs_classScope[0]!='_tmp_'+pTemplate._package._name+'_'+pTemplate._name+'_tmp_')
{internalAlert('[template "'+pTemplate._name+'"] - Can not create function "'+funcName+'": a function can not be defined outside template definition.');return}
if(funcProperties===undefined)
funcProperties={level:_xbs_public,static:false};if(funcProperties.level===undefined)
funcProperties.level=_xbs_public;if(funcProperties.static===undefined)
funcProperties.static=false;if(funcProperties.level==_xbs_private)
{internalAlert('[template "'+pTemplate._name+'"] - Function "'+funcName+'" can not be private.');}
else
{if(pTemplate._func[funcName]===undefined)
{pTemplate._func[funcName]=new Array();pTemplate._func[funcName].level=funcProperties.level;pTemplate._func[funcName].static=funcProperties.static;}
else
{internalAlert('[template "'+pTemplate._name+'"] - Can not redefine "'+funcName+'".');}}}
function newFunction(pClass,funcName,funcProperties,funcDef){if(_xbs_classScope[0]!='_cls_'+pClass._package._name+'_'+pClass._name+'_cls_')
{internalAlert('[class "'+pClass._name+'"] - Can not create function "'+funcName+'": a function can not be defined outside class definition.');return}
if(funcProperties===undefined)
funcProperties={level:_xbs_public,static:false,abstract:false,override:false};if(funcProperties.level===undefined)
funcProperties.level=_xbs_public;if(funcProperties.static===undefined)
funcProperties.static=false;if(funcProperties.abstract===undefined)
funcProperties.abstract=false;if(funcProperties.override===undefined)
funcProperties.override=false;if((pClass._abstract==true)&&(funcProperties.abstract==false))
{internalAlert('[class "'+pClass._name+'"] - Can not define non abstract function "'+funcName+'" on an abstract class.');}
else
{if((pClass._static==true)&&(funcProperties.static==false))
{internalAlert('[class "'+pClass._name+'"] - Can not define non static function "'+funcName+'" on a static class.');}
else
{if((funcProperties.level==_xbs_private)&&(funcProperties.abstract==true))
{internalAlert('[class "'+pClass._name+'"] - Function "'+funcName+'" can not be abstract and private.');}
else
{_xbs_dtPropFunType=0;_xbs_dtPropFunOverrideSrc=null;var result=_xbs_dtpropfunExists(pClass,funcName,false,funcProperties.override);if(result==false)
{if((funcProperties.override==true)&&(funcName!='_constructor')&&(funcName!='_destructor'))
{if(_xbs_dtPropFunType==0)
{internalAlert('[class "'+pClass._name+'"] - Can not override "'+funcName+'": it is unknown.');return;}
if(_xbs_dtPropFunType!=3)
{internalAlert('[class "'+pClass._name+'"] - Can not override "'+funcName+'": it is not a function.');return;}
if(_xbs_dtPropFunOverrideSrc.static!=funcProperties.static)
{if(_xbs_dtPropFunOverrideSrc.static==true)
internalAlert('[class "'+pClass._name+'"] - Can not override "'+funcName+'": can not change static to non static.');else
internalAlert('[class "'+pClass._name+'"] - Can not override "'+funcName+'": can not change non static to static.');return;}
if(funcProperties.abstract==true)
{internalAlert('[class "'+pClass._name+'"] - Can not override "'+funcName+'": override function can not be abstract.');return;}
if(_xbs_dtPropFunOverrideSrc.level>funcProperties.level)
{internalAlert('[class "'+pClass._name+'"] - Can not override "'+funcName+'": accessibility can not be wider than overrided.');return;}}
pClass._func[funcName]=new Array();pClass._func[funcName].level=funcProperties.level;pClass._func[funcName].static=funcProperties.static;pClass._func[funcName].abstract=funcProperties.abstract;pClass._func[funcName].override=funcProperties.override;pClass._func[funcName].func=funcDef;pClass._func[funcName].scope=pClass;}
else
{internalAlert('[class "'+pClass._name+'"] - Can not redefine "'+funcName+'".');}}}}}
function _xbs_eventExists(pClass,eventName,override,scope){if(override===undefined)override=false;if(scope===undefined)scope=7;if(pClass._event[eventName]!==undefined)
{if((scope==7)||(scope==15)||((scope!=7)&&(scope!=15)&&(override==false)))
if((scope&pClass._event[eventName].level)==pClass._event[eventName].level)
return(true);}
var scope2=0;if((scope&8)==8)
{if(scope==15)
scope2=11;else
scope2=9;}
else
{if(scope==7)
scope2=3;else
scope2=1;}
for(var i in pClass._super)
{if(_xbs_eventExists(pClass._super[i],eventName,override,scope2)==true)
return(true);}
return(false);}
function newTmpEvent(pTemplate,eventName,eventProperties){if(_xbs_classScope[0]!='_tmp_'+pTemplate._package._name+'_'+pTemplate._name+'_tmp_')
{internalAlert('[template "'+pTemplate._name+'"] - Can not create event "'+eventName+'": an event can not be defined outside template definition.');return}
if(eventProperties===undefined)
eventProperties={level:_xbs_public,static:false};if(eventProperties.level===undefined)
eventProperties.level=_xbs_public;if(eventProperties.static===undefined)
eventProperties.static=false;if(pTemplate._event[eventName]===undefined)
{pTemplate._event[eventName]=new Array();pTemplate._event[eventName].level=eventProperties.level;pTemplate._event[eventName].static=eventProperties.static;}
else
{internalAlert('[template "'+pTemplate._name+'"] - Can not redefine event "'+eventName+'".');}}
function newEvent(pClass,eventName,eventProperties){if(_xbs_classScope[0]!='_cls_'+pClass._package._name+'_'+pClass._name+'_cls_')
{internalAlert('[class "'+pClass._name+'"] - Can not create event "'+eventName+'": an event can not be defined outside class definition.');return}
if(eventProperties===undefined)
eventProperties={level:_xbs_public,static:false,abstract:false,override:false};if(eventProperties.level===undefined)
eventProperties.level=_xbs_public;if(eventProperties.static===undefined)
eventProperties.static=false;if(eventProperties.override===undefined)
eventProperties.override=false;eventProperties.abstract=false;if(pClass._abstract==true)
{internalAlert('[class "'+pClass._name+'"] - Can not define event "'+funcName+'" on an abstract class.');}
else
{var result=_xbs_eventExists(pClass,eventName,eventProperties.override);if(result==false)
{pClass._event[eventName]=new Array();pClass._event[eventName].level=eventProperties.level;pClass._event[eventName].static=eventProperties.static;pClass._event[eventName].override=eventProperties.override;pClass._event[eventName].scope=pClass;pClass._event[eventName].active=true;pClass._event[eventName].callers=new Array();}
else
{internalAlert('[class "'+pClass._name+'"] - Can not redefine event "'+eventName+'".');}}}
_xbs_dtPropType=0;_xbs_propExist=false;function _xbs_getSDtPropArray(pClass,dtPropName,isGetter,scope){if(scope===undefined)scope=7;if(pClass._prop[dtPropName]!==undefined)
{_xbs_propExist=true;_xbs_dtPropType=2;if(isGetter==true)
{if(((scope&pClass._prop[dtPropName].getter.level)==pClass._prop[dtPropName].getter.level)&&(pClass._prop[dtPropName].getter.func!=null))
return(pClass._prop[dtPropName]);}
else
{if(((scope&pClass._prop[dtPropName].setter.level)==pClass._prop[dtPropName].setter.level)&&(pClass._prop[dtPropName].setter.func!=null))
return(pClass._prop[dtPropName]);}}
if(pClass._data[dtPropName]!==undefined)
{_xbs_dtPropType=1;if((scope&pClass._data[dtPropName].level)==pClass._data[dtPropName].level)
return(pClass._data[dtPropName]);}
var scope2=0;if((scope&8)==8)
{if(scope==15)
scope2=11;else
scope2=9;}
else
{if(scope==7)
scope2=3;else
scope2=1;}
for(var i in pClass._super)
{var result=_xbs_getSDtPropArray(pClass._super[i],dtPropName,isGetter,scope2);if(result!=null)
return(result);}
return(null);}
function _xbs_getSData(pClass,dtPropName){_xbs_dtPropType=0;_xbs_propExist=false;if(pClass._package._name+'.'+pClass._name==_xbs_classScope[0])
var my_dtProp=_xbs_getSDtPropArray(pClass,dtPropName,true,15);else
{if(_xbs_classScope[0]!==undefined)
{if(_xbs_classScope[0].indexOf(pClass._package._name+'.')==0)
{if(_xbs_directParent(_xbs_classScope[0],pClass._package._name,pClass._name)==true)
var my_dtProp=_xbs_getSDtPropArray(pClass,dtPropName,true,11);else
var my_dtProp=_xbs_getSDtPropArray(pClass,dtPropName,true,9);}
else
{if(_xbs_directParent(_xbs_classScope[0],pClass._package._name,pClass._name)==true)
var my_dtProp=_xbs_getSDtPropArray(pClass,dtPropName,true,3);else
var my_dtProp=_xbs_getSDtPropArray(pClass,dtPropName,true,1);}}
else
{var my_dtProp=_xbs_getSDtPropArray(pClass,dtPropName,true,1);}}
if(my_dtProp!=null)
{if(my_dtProp.static==true)
{if(_xbs_dtPropType==1)
return(my_dtProp.value);if(_xbs_dtPropType==2)
{var args=new Array();_xbs_callstack.push(my_dtProp.scope._name+'::'+dtPropName);_xbs_classScope.unshift(my_dtProp.scope._package._name+'.'+my_dtProp.scope._name);var result=my_dtProp.getter.func.apply(my_dtProp.scope,args)
_xbs_classScope.shift();_xbs_callstack.pop();return(result);}}
else
{if(_xbs_dtPropType==1)
internalAlert('[class "'+pClass._name+'"] - Can not get data "'+dtPropName+'": this is not a static data.');if(_xbs_dtPropType==2)
internalAlert('[class "'+pClass._name+'"] - Can not get property "'+dtPropName+'": this is not a static property.');}}
else
{internalAlert('[class "'+pClass._name+'"] - Unknown static data or property named "'+dtPropName+'".');}
return(null);}
function _xbs_setSData(pClass,dtPropName,dtPropValue){_xbs_dtPropType=0;_xbs_propExist=false;if(pClass._package._name+'.'+pClass._name==_xbs_classScope[0])
var my_dtProp=_xbs_getSDtPropArray(pClass,dtPropName,false,15);else
{if(_xbs_classScope[0]!==undefined)
{if(_xbs_classScope[0].indexOf(pClass._package._name+'.')==0)
{if(_xbs_directParent(_xbs_classScope[0],pClass._package._name,pClass._name)==true)
var my_dtProp=_xbs_getSDtPropArray(pClass,dtPropName,false,11);else
var my_dtProp=_xbs_getSDtPropArray(pClass,dtPropName,false,9);}
else
{if(_xbs_directParent(_xbs_classScope[0],pClass._package._name,pClass._name)==true)
var my_dtProp=_xbs_getSDtPropArray(pClass,dtPropName,false,3);else
var my_dtProp=_xbs_getSDtPropArray(pClass,dtPropName,false,1);}}
else
{var my_dtProp=_xbs_getSDtPropArray(pClass,dtPropName,false,1);}}
if(my_dtProp!=null)
{if(my_dtProp.static==true)
{if(_xbs_dtPropType==1)
my_dtProp.value=dtPropValue;if(_xbs_dtPropType==2)
{var args=new Array();args.push(dtPropValue);_xbs_callstack.push(my_dtProp.scope._name+'::'+dtPropName);_xbs_classScope.unshift(my_dtProp.scope._package._name+'.'+my_dtProp.scope._name);my_dtProp.setter.func.apply(my_dtProp.scope,args);_xbs_classScope.shift();_xbs_callstack.pop();}}
else
{if(_xbs_dtPropType==1)
internalAlert('[class "'+pClass._name+'"] - Can not set data "'+dtPropName+'": this is not a static data.');if(_xbs_dtPropType==2)
internalAlert('[class "'+pClass._name+'"] - Can not set property "'+dtPropName+'": this is not a static property.');}}
else
{if(_xbs_propExist==true)
internalAlert('[class "'+pClass._name+'"] - Static property named "'+dtPropName+'" is read only, can not set.');else
internalAlert('[class "'+pClass._name+'"] - Unknown static data or property named "'+dtPropName+'".');}}
_xbs_funcRoute=new Array();_xbs_funcClassname='';function _xbs_getFunction(pClass,funcName,scope){if(scope===undefined)scope=7;if(pClass._func[funcName]!==undefined)
{_xbs_funcClassname=pClass._name;if((scope&pClass._func[funcName].level)==pClass._func[funcName].level)
return(pClass._func[funcName]);}
for(var i in pClass._super)
{var scope2=0;if((scope&8)==8)
{if(scope==15)
scope2=11;else
scope2=9;}
else
{if(scope==7)
scope2=3;else
scope2=1;}
_xbs_funcRoute.push(i);var result=_xbs_getFunction(pClass._super[i],funcName,scope2);if(result!=null)
return(result);_xbs_funcRoute.pop();}
return(null);}
function _xbs_StaticCall(){var args=argsAsArray(_xbs_StaticCall.arguments);var pClass=args.shift();var funcName=args.shift();if(pClass._package._name+'.'+pClass._name==_xbs_classScope[0])
var my_func=_xbs_getFunction(pClass,funcName,15);else
{if(_xbs_classScope[0]!==undefined)
{if(_xbs_classScope[0].indexOf(pClass._package._name+'.')==0)
{if(_xbs_directParent(_xbs_classScope[0],pClass._package._name,pClass._name)==true)
var my_func=_xbs_getFunction(pClass,funcName,11);else
var my_func=_xbs_getFunction(pClass,funcName,9);}
else
{if(_xbs_directParent(_xbs_classScope[0],pClass._package._name,pClass._name)==true)
var my_func=_xbs_getFunction(pClass,funcName,3);else
var my_func=_xbs_getFunction(pClass,funcName,1);}}
else
{var my_func=_xbs_getFunction(pClass,funcName,1);}}
if(my_func!=null)
{if(my_func.abstract==true)
{internalAlert('[class "'+pClass._name+'"] - Can not call function "'+funcName+'": this is an abstract function.');}
else
{if(my_func.static==true)
{_xbs_callstack.push(my_func.scope._name+'::'+funcName);_xbs_classScope.unshift(my_func.scope._package._name+'.'+my_func.scope._name);var result=my_func.func.apply(my_func.scope,args);_xbs_classScope.shift();_xbs_callstack.pop();return(result);}
else
{internalAlert('[class "'+pClass._name+'"] - Can not call function "'+funcName+'": this is not a static function.');}}}
else
{internalAlert('[class "'+pClass._name+'"] - Unknown function named "'+funcName+'".');}}
function _xbs_isPackClass(pClass,packageName,className){if(packageName.length>0)
{if((pClass._name==className)&&(pClass._package._name==packageName))
return(true);}
else
{if(pClass._name==className)
return(true);}
for(var i in pClass._super)
if(_xbs_isPackClass(pClass._super[i],packageName,className)==true)
return(true);return(false);}
function _xbs_isClass(pClass,name){var className=''
var packageName=''
var i=name.indexOf('.');if(i==-1)
{className=name;}
else
{if(i==0)
{className=name.substr(1);}
else
{packageName=name.substr(0,i);className=name.substr(i+1);}}
return(_xbs_isPackClass(pClass,packageName,className));}
function _xbs_Delete(pInst){var pClass=pInst._class;if(pClass._func['_destructor']!==undefined)
{_xbs_callstack.push(pInst._class._name+'::destructor');_xbs_classScope.unshift(pClass._package._name+'.'+pClass._name);pClass._func['_destructor'].func.apply(pInst,new Array());_xbs_classScope.shift();_xbs_callstack.pop();}
for(var i in pInst._super)
_xbs_Delete(pInst._super[i]);pInst._class=null;pInst._data=null;pInst._event=null;pInst._id=0;pInst._super=null;pInst.call=null;pInst.delete=null;pInst.eventListenerAdd=null;pInst.eventListenerRem=null;pInts.freezeEvent=null;pInts.get=null;pInts.isClass=null;pInts.raiseEvent=null;pInts.set=null;pInts.warmEvent=null;pClass._instances-=1;delete _xbs_instances[pInst._id];}
function _xbs_New(pClass,args,inst_id){if(inst_id===undefined)inst_id=-1;if(args===undefined)args=new Array();if(pClass.abstract==true)
{internalAlert('[class "'+pClass._name+'"] - Can not instanciate an abstract class.');return(null);}
else if(pClass._func['_constructor']===undefined)
{if(inst_id==-1)
internalAlert('[class "'+pClass._name+'"] - Can not instanciate a class without constructor.');else
internalAlert('[class "'+pClass._name+'"] - Can not inherit a class without constructor.');return(null);}
else
{var valid_constructor=1;if(pClass._package._name+'.'+pClass._name==_xbs_classScope[0])
{valid_constructor=0;}
else
{if(pClass._func['_constructor'].level==_xbs_public)
{valid_constructor=0;}
else if(pClass._func['_constructor'].level==_xbs_protected)
{if(inst_id==-1)
valid_constructor=1;else
valid_constructor=0;}
else
{if(inst_id!=-1)
valid_constructor=2;}
if((valid_constructor==1)&&(_xbs_classScope[0].indexOf(pClass._package._name+'.')==0))
{if(pClass._func['_constructor'].level==_xbs_package)
valid_constructor=0;}}
if(valid_constructor!=0)
{if(valid_constructor==1)
internalAlert('[class "'+pClass._name+'"] - Can not instanciate the class: constructor is not public.');if(valid_constructor==2)
internalAlert('[class "'+pClass._name+'"] - Can not inherit class: constructor is private.');return(null);}
else
{var old_inst_id=inst_id;if(inst_id==-1)
{_xbs_instancesIdCnt++;_xbs_instances[_xbs_instancesIdCnt]=new Object;var pInst=_xbs_instances[_xbs_instancesIdCnt];pInst._id=_xbs_instancesIdCnt;inst_id=pInst._id;}
else
{var pInst=new Object;pInst._id=inst_id;}
pInst._class=pClass;pInst._super=new Array();pInst._data=new Array();pInst._event=new Array();pInst.delete=function(){_xbs_Delete(this);};pInst.get=function(dataName){return(_xbs_getData(this,dataName));};pInst.set=function(dataName,dataValue){_xbs_setData(this,dataName,dataValue);};pInst.call=function(){var args=argsAsArray(this.call.arguments);args.unshift(this);return(_xbs_Call.apply(_xbs_jso,args));};pInst.eventListenerAdd=function(eventName,pCallObj,pCallFunc){eventListenerAdd(this,eventName,pCallObj,pCallFunc);};pInst.eventListenerRem=function(eventName,pCallObj,pCallFunc){eventListenerRem(this,eventName,pCallObj,pCallFunc);};pInst.raiseEvent=function(eventName,eventDatas){raiseEvent(this,eventName,eventDatas);};pInst.freezeEvent=function(eventName){freezeEvent(this,eventName);};pInst.warmEvent=function(eventName){warmEvent(this,eventName);};pInst.isClass=function(className){return(_xbs_isClass(this._class,className));};for(var i in pClass._super)
{var tmpArgs=new Array();if(pClass._func['_constructor']!==undefined)
{if(pClass._func['_constructor'].super[i]!==undefined)
{for(var j=0;j<pClass._func['_constructor'].super[i].length;j++)
{if(isArray(pClass._func['_constructor'].super[i][j])==true)
tmpArgs.push(pClass._func['_constructor'].super[i][j][0]);else
tmpArgs.push(args[pClass._func['_constructor'].super[i][j]]);}}}
pInst._super[i]=_xbs_New(pClass._super[i],tmpArgs,inst_id);}
for(var i in pClass._data)
{if(pClass._data[i].static==false)
pInst._data[i]=pClass._data[i].value;}
for(var i in pClass._event)
{if(pClass._event[i].static==false)
{pInst._event[i]=new Array();pInst._event[i].active=true;pInst._event[i].caller=new Array();}}
if(pClass._func['_constructor']!==undefined)
{_xbs_callstack.push(pInst._class._name+'::constructor');_xbs_classScope.unshift(pClass._package._name+'.'+pClass._name);pClass._func['_constructor'].func.apply(pInst,args);_xbs_classScope.shift();_xbs_callstack.pop();}
pClass._instances+=1;return(pInst);}}}
function xblNew(){var args=argsAsArray(xblNew.arguments);var pClass=args.shift();if(isString(pClass)==true)
{var new_package='';var new_class='';var i=pClass.indexOf('.');if(i==-1)
{new_class=pClass;}
else
{if(i==0)
{new_class=pClass.substr(1);}
else
{new_package=pClass.substr(0,i);new_class=pClass.substr(i+1);}}
if((_xbs_jso[new_class]===undefined)||(_xbs_jso[new_class]._name===undefined))
{var found=false
var j=0;for(i=0;(found==false)&&(i<_xbs_classes.length);i++)
{if(_xbs_classes[i]._name==new_class)
{if((new_package.length>0)&&(_xbs_classes[i]._package._name==new_package))
{var pClass=_xbs_classes[i];found=true;}}}
if(found==false)
{if(_xbs_classScope[0])
{var currPackScope='';if(_xbs_classScope[0].indexOf('_pk_')==0)
{currPackScope=_xbs_classScope[0].substr(4,_xbs_classScope[0].length-8);}
else
{var i=_xbs_classScope[0].indexOf('.');if(i>0)
currPackScope=_xbs_classScope[0].substr(0,i);}
if(new_package.length>0)
{if(currPackScope==new_package)
{if(_xbs_jso[new_package]._classes[new_class]!==undefined)
{var pClass=_xbs_jso[new_package]._classes[new_class];found=true;}}}
else
{if((currPackScope.length>0)&&(_xbs_jso[currPackScope]._classes[new_class]!==undefined))
{var pClass=_xbs_jso[currPackScope]._classes[new_class];found=true;}}}}
if(found==false)
{if(new_package.length>0)
internalAlert('Unknown class "'+new_class+'" in "'+new_package+'": can not instanciate.');else
internalAlert('Unknown class "'+new_class+'": can not instanciate.');return(null);}}
else
{var pClass=_xbs_jso[new_class];}}
var pInst=_xbs_New(pClass,args);pInst.raiseEvent('_xbs_oninstanciated',new Array());return(pInst);}
_xbs_dtPropRoute=new Array();_xbs_dtPropClassname='';function _xbs_getDtPropArray(pClass,dtPropName,isGetter,scope){if(scope===undefined)scope=7;if(pClass._prop[dtPropName]!==undefined)
{_xbs_propExist=true;_xbs_dtPropType=2;_xbs_dtPropClassname=pClass._name;if(isGetter==true)
{if(((scope&pClass._prop[dtPropName].getter.level)==pClass._prop[dtPropName].getter.level)&&(pClass._prop[dtPropName].getter.func!=null))
return(pClass._prop[dtPropName]);}
else
{if(((scope&pClass._prop[dtPropName].setter.level)==pClass._prop[dtPropName].setter.level)&&(pClass._prop[dtPropName].setter.func!=null))
return(pClass._prop[dtPropName]);}}
if(pClass._data[dtPropName]!==undefined)
{_xbs_dtPropType=1;_xbs_dtPropClassname=pClass._name;if((scope&pClass._data[dtPropName].level)==pClass._data[dtPropName].level)
return(pClass._data[dtPropName]);}
if(pClass[dtPropName]!==undefined)
{_xbs_dtPropType=3;_xbs_dtPropClassname=pClass._name;return(pClass[dtPropName]);}
var scope2=0;if((scope&8)==8)
{if(scope==15)
scope2=11;else
scope2=9;}
else
{if(scope==7)
scope2=3;else
scope2=1;}
for(var i in pClass._super)
{_xbs_dtPropRoute.push(i);var result=_xbs_getDtPropArray(pClass._super[i],dtPropName,isGetter,scope2);if(result!=null)
return(result);_xbs_dtPropRoute.pop();}
return(null);}
function _xbs_getDtPropStore(pInst)
{if(_xbs_dtPropRoute.length==0)
return(pInst);var pClass2=_xbs_dtPropRoute.shift();var pInst2=pInst._super[pClass2];return(_xbs_getDtPropStore(pInst2));}
function _xbs_getData(pInst,dtPropName){_xbs_dtPropType=0;_xbs_propExist=false;_xbs_dtPropRoute=new Array();_xbs_dtPropClassname=null;var pClass=pInst._class;if(pClass._package._name+'.'+pClass._name==_xbs_classScope[0])
var my_dtProp=_xbs_getDtPropArray(pClass,dtPropName,true,15);else
{if(_xbs_classScope[0].indexOf(pClass._package._name+'.')==0)
{if(_xbs_directParent(_xbs_classScope[0],pClass._package._name,pClass._name)==true)
var my_dtProp=_xbs_getDtPropArray(pClass,dtPropName,true,11);else
var my_dtProp=_xbs_getDtPropArray(pClass,dtPropName,true,9);}
else
{if(_xbs_directParent(_xbs_classScope[0],pClass._package._name,pClass._name)==true)
var my_dtProp=_xbs_getDtPropArray(pClass,dtPropName,true,3);else
var my_dtProp=_xbs_getDtPropArray(pClass,dtPropName,true,1);}}
if(my_dtProp!=null)
{if(_xbs_dtPropType==3)
{return(my_dtProp);}
else
{if(my_dtProp.static==false)
{if(_xbs_dtPropType==1)
{var pDataInst=_xbs_getDtPropStore(pInst);return(pDataInst._data[dtPropName]);}
if(_xbs_dtPropType==2)
{var pPropInst=_xbs_getDtPropStore(pInst);var args=new Array();_xbs_callstack.push(pPropInst._class._name+'::'+dtPropName);_xbs_classScope.unshift(my_dtProp.scope._package._name+'.'+my_dtProp.scope._name);result=my_dtProp.getter.func.apply(pPropInst,args);_xbs_classScope.shift();_xbs_callstack.pop();return(result);}}
else
{if(_xbs_dtPropType==1)
internalAlert('[class "'+pClass._name+'"] - Can not get data "'+dtPropName+'": this is a static data.');if(_xbs_dtPropType==2)
internalAlert('[class "'+pClass._name+'"] - Can not get property "'+dtPropName+'": this is a static property.');}}}
else
{internalAlert('[class "'+pClass._name+'"] - Unknown data or property named "'+dtPropName+'".');}
return(null);}
function _xbs_setData(pInst,dtPropName,dtPropValue){_xbs_dtPropType=0;_xbs_propExist=false;_xbs_dtPropRoute=new Array();_xbs_dtPropClassname=null;var pClass=pInst._class;if(pClass._package._name+'.'+pClass._name==_xbs_classScope[0])
var my_dtProp=_xbs_getDtPropArray(pClass,dtPropName,false,15);else
{if(_xbs_classScope[0].indexOf(pClass._package._name+'.')==0)
{if(_xbs_directParent(_xbs_classScope[0],pClass._package._name,pClass._name)==true)
var my_dtProp=_xbs_getDtPropArray(pClass,dtPropName,false,11);else
var my_dtProp=_xbs_getDtPropArray(pClass,dtPropName,false,9);}
else
{if(_xbs_directParent(_xbs_classScope[0],pClass._package._name,pClass._name)==true)
var my_dtProp=_xbs_getDtPropArray(pClass,dtPropName,false,3);else
var my_dtProp=_xbs_getDtPropArray(pClass,dtPropName,false,1);}}
if(my_dtProp!=null)
{if(my_dtProp.static==false)
{if(_xbs_dtPropType==1)
{var pDataInst=_xbs_getDtPropStore(pInst);pDataInst._data[dtPropName]=dtPropValue;}
if(_xbs_dtPropType==2)
{var pPropInst=_xbs_getDtPropStore(pInst);var args=new Array();args.push(dtPropValue);_xbs_callstack.push(pPropInst._class._name+'::'+dtPropName);_xbs_classScope.unshift(my_dtProp.scope._package._name+'.'+my_dtProp.scope._name);my_dtProp.setter.func.apply(pPropInst,args);_xbs_classScope.shift();_xbs_callstack.pop();}}
else
{if(_xbs_dtPropType==1)
internalAlert('[class "'+pClass._name+'"] - Can not set data "'+dtPropName+'": this is a static data.');if(_xbs_dtPropType==2)
internalAlert('[class "'+pClass._name+'"] - Can not set property "'+dtPropName+'": this is a static property.');}}
else
{if(_xbs_propExist==true)
internalAlert('[class "'+pClass._name+'"] - Property named "'+dtPropName+'" is read only, can not set.');else
internalAlert('[class "'+pClass._name+'"] - Unknown data or property named "'+dtPropName+'".');}}
function _xbs_getFuncStore(pInst)
{if(_xbs_funcRoute.length==0)
return(pInst);var pClass2=_xbs_funcRoute.shift();var pInst2=pInst._super[pClass2];return(_xbs_getFuncStore(pInst2));}
function _xbs_Call(){var args=argsAsArray(_xbs_Call.arguments);var pInst=args.shift();var pClass=pInst._class;var funcName=args.shift();_xbs_funcRoute=new Array();_xbs_funcClassname=null;if(pClass._package._name+'.'+pClass._name==_xbs_classScope[0])
var my_func=_xbs_getFunction(pClass,funcName,15);else
{if(_xbs_classScope[0].indexOf(pClass._package._name+'.')==0)
{if(_xbs_directParent(_xbs_classScope[0],pClass._package._name,pClass._name)==true)
var my_func=_xbs_getFunction(pClass,funcName,11);else
var my_func=_xbs_getFunction(pClass,funcName,9);}
else
{if(_xbs_directParent(_xbs_classScope[0],pClass._package._name,pClass._name)==true)
var my_func=_xbs_getFunction(pClass,funcName,3);else
var my_func=_xbs_getFunction(pClass,funcName,1);}}
if(my_func!=null)
{if(my_func.abstract==true)
{internalAlert('[class "'+pClass._name+'"] - Can not call function "'+funcName+'": this is an abstract function.');}
else
{if(my_func.static==false)
{var pFuncInst=_xbs_getFuncStore(pInst);_xbs_callstack.push(pFuncInst._class._name+'::'+funcName);_xbs_classScope.unshift(my_func.scope._package._name+'.'+my_func.scope._name);var result=my_func.func.apply(pFuncInst,args);_xbs_classScope.shift();_xbs_callstack.pop();return(result);}
else
{internalAlert('[class "'+pClass._name+'"] - Can not call function "'+funcName+'": this is a static function.');}}}
else
{internalAlert('[class "'+pClass._name+'"] - Unknown function named "'+funcName+'".');}}
_xbs_eventRoute=new Array();function _xbs_getEvent(pClass,eventName,scope){if(scope===undefined)scope=7;if(pClass._event[eventName]!==undefined)
{if((scope&pClass._event[eventName].level)==pClass._event[eventName].level)
return(pClass._event[eventName]);}
var scope2=0;if((scope&8)==8)
{if(scope==15)
scope2=11;else
scope2=9;}
else
{if(scope==7)
scope2=3;else
scope2=1;}
for(var i in pClass._super)
{_xbs_eventRoute.push(i);var result=_xbs_getEvent(pClass._super[i],eventName,scope2);if(result!=null)
return(result);_xbs_eventRoute.pop();}
return(null);}
function _xbs_getEventStore(pInst)
{if(_xbs_eventRoute.length==0)
return(pInst);var pClass2=_xbs_eventRoute.shift();var pInst2=pInst._super[pClass2];return(_xbs_getEventStore(pInst2));}
function eventListenerAdd(pEvtObj,eventName,pCallObj,pCallFunc){_xbs_eventRoute=new Array();if(pEvtObj._class!==undefined)
{var my_event=_xbs_getEvent(pEvtObj._class,eventName);if(my_event!=null)
{if(my_event.static==false)
{var pEventInst=_xbs_getEventStore(pEvtObj);if(pCallObj._class!==undefined)
{var callKey=pCallObj._id+'.'+pCallObj._class._name+'.'+pCallFunc;if(pEventInst._event[eventName].caller[callKey]===undefined)
{pEventInst._event[eventName].caller[callKey]=new Array();var tmpCall=pEventInst._event[eventName].caller[callKey];tmpCall['obj']=pCallObj;tmpCall['func']=pCallFunc;if(pCallObj._class._package._name+'.'+pCallObj._class._name==_xbs_classScope[0])
tmpCall['scope']=pCallObj._class._package._name+'.'+pCallObj._class._name;else
tmpCall['scope']='';}
else
{internalAlert('[class "'+pEvtObj._class._name+'"] - Can not redefine callback on event "'+eventName+'".');}}
else
{var callKey=pCallObj._name+'.'+pCallFunc;if(pEventInst._event[eventName].caller[callKey]===undefined)
{pEventInst._event[eventName].caller[callKey]=new Array();var tmpCall=pEventInst._event[eventName].caller[callKey];tmpCall['obj']=pCallObj;tmpCall['func']=pCallFunc;if(pCallObj._package._name+'.'+pCallObj._name==_xbs_classScope[0])
tmpCall['scope']=pCallObj._package._name+'.'+pCallObj._name;else
tmpCall['scope']='';}
else
{internalAlert('[class "'+pEvtObj._class._name+'"] - Can not redefine callback on event "'+eventName+'".');}}}
else
{internalAlert('[class "'+pEvtObj._class._name+'"] - Can not trap event "'+eventName+'": this is a static event.');}}
else
{internalAlert('[class "'+pEvtObj._class._name+'"] - Unknown event "'+eventName+'".');}}
else
{var my_event=_xbs_getEvent(pEvtObj,eventName);if(my_event!=null)
{if(my_event.static==true)
{if(pCallObj._class!==undefined)
{var callKey=pCallObj._id+'.'+pCallObj._class._name+'.'+pCallFunc;if(my_event.callers[callKey]===undefined)
{my_event.callers[callKey]=new Array();var tmpCall=my_event.callers[callKey];tmpCall['obj']=pCallObj;tmpCall['func']=pCallFunc;if(pCallObj._class._package._name+'.'+pCallObj._class._name==_xbs_classScope[0])
tmpCall['scope']=pCallObj._class._package._name+'.'+pCallObj._class._name;else
tmpCall['scope']='';}
else
{internalAlert('[class "'+pEvtObj._name+'"] - Can not redefine callback on event "'+eventName+'".');}}
else
{var callKey=pCallObj._name+'.'+pCallFunc;if(my_event.callers[callKey]===undefined)
{my_event.callers[callKey]=new Array();var tmpCall=my_event.callers[callKey];tmpCall['obj']=pCallObj;tmpCall['func']=pCallFunc;if(pCallObj._package._name+'.'+pCallObj._name==_xbs_classScope[0])
tmpCall['scope']=pCallObj._package._name+'.'+pCallObj._name;else
tmpCall['scope']='';}
else
{internalAlert('[class "'+pEvtObj._name+'"] - Can not redefine callback on event "'+eventName+'".');}}}
else
{internalAlert('[class "'+pEvtObj._name+'"] - Can not trap event "'+eventName+'": this is not a static event.');}}
else
{internalAlert('[class "'+pEvtObj._name+'"] - Unknown event "'+eventName+'".');}}}
function eventListenerRem(pEvtObj,eventName,pCallObj,pCallFunc){_xbs_eventRoute=new Array();if(pEvtObj._class!==undefined)
{var my_event=_xbs_getEvent(pEvtObj._class,eventName);if(my_event!=null)
{if(my_event.static==false)
{var pEventInst=_xbs_getEventStore(pEvtObj);var callKey=pCallObj._id+'.'+pCallObj._class._name+'.'+pCallFunc;if(pEventInst._event[eventName].caller[callKey]!==undefined)
{delete pEventInst._event[eventName].caller[callKey];}
else
{internalAlert('[class "'+pEvtObj._class._name+'"] - Can not remove callback on event "'+eventName+'": callback do not exists.');}}
else
{internalAlert('[class "'+pEvtObj._class._name+'"] - Can not trap event "'+eventName+'": this is a static event.');}}
else
{internalAlert('[class "'+pEvtObj._class._name+'"] - Unknown event "'+eventName+'".');}}
else
{var my_event=_xbs_getEvent(pEvtObj,eventName);if(my_event!=null)
{if(my_event.static==true)
{var callKey=pCallObj._id+'.'+pCallObj._class._name+'.'+pCallFunc;if(my_event.callers[callKey]!==undefined)
{delete my_event.callers[callKey];}
else
{internalAlert('[class "'+pEvtObj._name+'"] - Can not remove callback on event "'+eventName+'": callback do not exists.');}}
else
{internalAlert('[class "'+pEvtObj._name+'"] - Can not trap event "'+eventName+'": this is not a static event.');}}
else
{internalAlert('[class "'+pEvtObj._name+'"] - Unknown event "'+eventName+'".');}}}
function raiseEvent(pEvtObj,eventName,eventObj){if(eventObj===undefined)
eventObj=new Array();eventObj._name=eventName;eventObj._raiser=_xbs_instances[pEvtObj._id];_xbs_eventRoute=new Array();if(pEvtObj._class!==undefined)
{var my_event=_xbs_getEvent(pEvtObj._class,eventName);if(my_event!=null)
{if(my_event.static==false)
{var pEventInst=_xbs_getEventStore(pEvtObj);if(pEventInst._event[eventName].active==true)
{for(var i in pEventInst._event[eventName].caller)
{var pCallObj=pEventInst._event[eventName].caller[i]['obj'];var pCallFunc=pEventInst._event[eventName].caller[i]['func'];var pCallScope=pEventInst._event[eventName].caller[i]['scope'];if((pCallScope.length==0)&&(pEvtObj._class!==undefined))
pCallScope=pEvtObj._class._package._name+'.'+pEvtObj._class._name;if(pCallObj._class!==undefined)
{_xbs_classScope.unshift(pCallScope);_xbs_Call(pCallObj,pCallFunc,eventObj);_xbs_classScope.shift();}
else
{_xbs_classScope.unshift(pEvtObj._class._package._name+'.'+pEvtObj._class._name);_xbs_StaticCall(pCallObj,pCallFunc,eventObj);_xbs_classScope.shift();}}}}
else
{internalAlert('[class "'+pEvtObj._class._name+'"] - Can not trap event "'+eventName+'": this is a static event.');}}
else
{internalAlert('[class "'+pEvtObj._class._name+'"] - Unknown event "'+eventName+'".');}}
else
{var my_event=_xbs_getEvent(pEvtObj,eventName);if(my_event!=null)
{if(my_event.static==true)
{if(my_event.active==true)
{for(var i in my_event.callers)
{var pCallObj=my_event.callers[i]['obj'];var pCallFunc=my_event.callers[i]['func'];var pCallScope=my_event.callers[i]['scope'];if(pCallObj._class!==undefined)
{_xbs_classScope.unshift(pCallScope);_xbs_Call(pCallObj,pCallFunc,eventObj);_xbs_classScope.shift();}
else
{_xbs_StaticCall(pCallObj,pCallFunc,eventObj);}}}}
else
{internalAlert('[class "'+pEvtObj._name+'"] - Can not trap event "'+eventName+'": this is not a static event.');}}
else
{internalAlert('[class "'+pEvtObj._name+'"] - Unknown event "'+eventName+'".');}}}
function freezeEvent(pEvtObj,eventName){_xbs_eventRoute=new Array();if(pEvtObj._class!==undefined)
{var my_event=_xbs_getEvent(pEvtObj._class,eventName);if(my_event!=null)
{if(my_event.static==false)
{var pEventInst=_xbs_getEventStore(pEvtObj);if(pEventInst._event[eventName].active==true)
pEventInst._event[eventName].active=false;else
internalAlert('[class "'+pEvtObj._class._name+'"] - Can not freeze event "'+eventName+'": this event is already freezed.');}
else
{internalAlert('[class "'+pEvtObj._class._name+'"] - Can not freeze event "'+eventName+'": this is a static event.');}}
else
{internalAlert('[class "'+pEvtObj._class._name+'"] - Unknown event "'+eventName+'".');}}
else
{var my_event=_xbs_getEvent(pEvtObj,eventName);if(my_event!=null)
{if(my_event.static==true)
{my_event.active=false;}
else
{internalAlert('[class "'+pEvtObj._name+'"] - Can not freeze event "'+eventName+'": this is not a static event.');}}
else
{internalAlert('[class "'+pEvtObj._name+'"] - Unknown event "'+eventName+'".');}}}
function warmEvent(pEvtObj,eventName){_xbs_eventRoute=new Array();if(pEvtObj._class!==undefined)
{var my_event=_xbs_getEvent(pEvtObj._class,eventName);if(my_event!=null)
{if(my_event.static==false)
{var pEventInst=_xbs_getEventStore(pEvtObj);if(pEventInst._event[eventName].active==false)
pEventInst._event[eventName].active=true;else
internalAlert('[class "'+pEvtObj._class._name+'"] - Can not warm event "'+eventName+'": this event is active.');}
else
{internalAlert('[class "'+pEvtObj._class._name+'"] - Can not warm event "'+eventName+'": this is a static event.');}}
else
{internalAlert('[class "'+pEvtObj._class._name+'"] - Unknown event "'+eventName+'".');}}
else
{var my_event=_xbs_getEvent(pEvtObj,eventName);if(my_event!=null)
{if(my_event.static==true)
{my_event.active=true;}
else
{internalAlert('[class "'+pEvtObj._name+'"] - Can not warm event "'+eventName+'": this is not a static event.');}}
else
{internalAlert('[class "'+pEvtObj._name+'"] - Unknown event "'+eventName+'".');}}}
newClass('Exception',{},'',function(){this.const('cstGravityNone',{level:_xbs_public},'');this.const('cstGravityInformation',{level:_xbs_public},'i');this.const('cstGravityWarning',{level:_xbs_public},'w');this.const('cstGravityError',{level:_xbs_public},'e');this.const('cstGravitySevere',{level:_xbs_public},'s');this.const('xbs_unknown_error',{level:_xbs_public},1);this.const('xbs_cannot_redefine_error',{level:_xbs_public},2);this.data('_errors',{level:_xbs_private,static:true},new Array());this.function('NewError',{level:_xbs_public,static:true},function(err_num,err_grav,err_desc){var errors=this.get('_errors');var err_key='e_'+err_num;if(errors[err_key]===undefined)
{errors[err_key]=new Array();errors[err_key].num=err_num;errors[err_key].grav=err_grav;if(isString(err_desc)==true)
{errors[err_key].desc=new Array();errors[err_key].desc.push(err_desc);}
else
{errors[err_key].desc=err_desc;}
this.set('_errors',errors);}
else
{this.call('ThrowError',2,{number:err_num});}});this.function('ThrowError',{level:_xbs_public,static:true},function(err_num,datas){_xbs_callstack.pop();var errors=this.get('_errors');var err_key='e_'+err_num;if(errors[err_key]!==undefined)
{var my_desc=errors[err_key].desc[0];var j=1;for(var i in datas)
my_desc+=datas[i]+errors[err_key].desc[j++];var pInst=this.xblNew(err_num,errors[err_key].grav,my_desc,datas);_xbs_callstack.push('Unstacked');throw pInst;}
else
{this.call('ThrowError',1,{number:err_num});}
_xbs_callstack.push('Unstacked');});this.function('Stack2String',{level:_xbs_public,static:true},function(){_xbs_callstack.pop();var my_callstack=_xbs_callstack;var my_callstackstring='';if(my_callstack.length>0)
{my_callstackstring=my_callstack[my_callstack.length-1];for(var i=(my_callstack.length-2);i>=0;i--)
my_callstackstring=my_callstackstring+'\n'+my_callstack[i];}
_xbs_callstack.push('Unstacked');return(my_callstackstring);});this.data('_num',{level:_xbs_private});this.data('_grav',{level:_xbs_private});this.data('_desc',{level:_xbs_private});this.data('_datas',{level:_xbs_private});this.data('_callstack',{level:_xbs_private});this.data('_callstackstring',{level:_xbs_private});this.property('number',{level:_xbs_public},_xbs_public,function(){return(this.get('_num'));});this.property('gravity',{level:_xbs_public},_xbs_public,function(){return(this.get('_grav'));});this.property('description',{level:_xbs_public},_xbs_public,function(){return(this.get('_desc'));});this.property('datas',{level:_xbs_public},_xbs_public,function(){return(this.get('_datas'));});this.property('callstack',{level:_xbs_public},_xbs_public,function(){return(this.get('_callstack'));});this.property('callstackstring',{level:_xbs_public},_xbs_public,function(){return(this.get('_callstackstring'));});this.constructor({level:_xbs_public},function(err_num,err_grav,err_desc,err_datas){_xbs_callstack.pop();this.set('_num',err_num);this.set('_grav',err_grav);this.set('_desc',err_desc);this.set('_datas',err_datas);this.set('_callstack',_xbs_callstack);this.set('_callstackstring',Exception.call('Stack2String'));_xbs_callstack.push('Unstacked');});this.destructor({level:_xbs_public},function(){_xbs_callstack.pop();this.set('_num',0);this.set('_grav',Exception.cstGravityNone);this.set('_desc','');this.set('_datas',null);this.set('_callstack',null);this.set('_callstackstring','');_xbs_callstack.push('Unstacked');});this.function('toString',{level:_xbs_public},function(){var str='';var my_grav=this.get('_grav');if(my_grav==Exception.cstGravityInformation)
str+='Information ';if(my_grav==Exception.cstGravityWarning)
str+='Warning ';if(my_grav==Exception.cstGravityError)
str+='Error ';if(my_grav==Exception.cstGravitySevere)
str+='Severe Error ';str+='#'+this.get('_num')+': '+this.get('_desc');str+='\n'+this.get('_callstackstring');return(str);});this.function('Throw',{level:_xbs_public,abstract:true},function(){});});Exception.call('NewError',Exception.xbs_unknown_error,Exception.cstGravitySevere,['Unknown error numbered #','.']);Exception.call('NewError',Exception.xbs_cannot_redefine_error,Exception.cstGravityError,['Can not redefine error #','.']);function internalAlert(message){message='InternalException : '+message;message+='\n'+Exception.call('Stack2String');alert(message);}
function alertEx(ex){var ex_str=""
if(ex._class===undefined)
{ex_str=ex.toString();ex_str+='\n'+Exception.call('Stack2String');}
else
{ex_str=ex.call('toString');}
alert(ex_str);}
var _xbs_timers=new Array();function _xbs_on_timer(timerId)
{if(_xbs_timers[timerId]!==undefined)
{_xbs_classScope.unshift(_xbs_timers[timerId]['callbackScope']);if(_xbs_timers[timerId]['callbackStatic']==true)
_xbs_StaticCall(_xbs_timers[timerId]['callbackObj'],_xbs_timers[timerId]['callbackFunc']);else
_xbs_Call(_xbs_timers[timerId]['callbackObj'],_xbs_timers[timerId]['callbackFunc']);_xbs_classScope.shift();}}
function xbs_set_timer(timerId,duration,callbackObj,callbackFunc)
{if(_xbs_timers[timerId]===undefined)
{_xbs_timers[timerId]=new Array();_xbs_timers[timerId]['duration']=duration;_xbs_timers[timerId]['callbackObj']=callbackObj;_xbs_timers[timerId]['callbackFunc']=callbackFunc;if(callbackObj._class===undefined)
{if(callbackObj._package==null)
_xbs_timers[timerId]['callbackScope']=callbackObj._name;else
_xbs_timers[timerId]['callbackScope']=callbackObj._package._name+'.'+callbackObj._name;_xbs_timers[timerId]['callbackStatic']=true;}
else
{if(callbackObj._class._package==null)
_xbs_timers[timerId]['callbackScope']=callbackObj._class._name;else
_xbs_timers[timerId]['callbackScope']=callbackObj._class._package._name+'.'+callbackObj._class._name;_xbs_timers[timerId]['callbackStatic']=false;}
eval("_xbs_result = setInterval(function(){ _xbs_on_timer('"+timerId+"'); }, "+duration+");");_xbs_timers[timerId]['JSId']=_xbs_result;_xbs_result=0;return(true);}
return(false);}
function xbs_stop_timer(timerId)
{if(_xbs_timers[timerId]!==undefined)
{clearInterval(_xbs_timers[timerId]['JSId']);delete _xbs_timers[timerId];return(true);}
return(false);}