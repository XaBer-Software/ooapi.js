//////////////////////////////////////////////////////////////////////////////
// XaBer Software Object Oriented API
// This API is a part of the XaBer Software Framework (XBS Framework)
// ------------------------------------------------------------------------
// © 2012 by XaBer Software. All rights reserved.
// ------------------------------------------------------------------------
// This library define the JavaScript Object Oriented engine
// ------------------------------------------------------------------------
// This Library has been tested on :
//  - Firefox :  3.x, 11.x, 16.x, 24.x
// ------------------------------------------------------------------------
// Prefixing data or functions by "_xbs_" is not authorized, this is reserved
//   to XaBer Software
// Prefixing data or functions by "_" must be used with care, this followed
//   word are reserved by the object oriented core:
//    _super
//    _name
//    _func
//    _prop
//    _data
//    _level
//    _abstract
//    _static
//	  _constructor
//	  _destructor
//////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////
// JS Tools functions
//////////////////////////////////////////////////////////////////////////////

function argsAsArray(args)
{
	var ret = new Array();
	if ((args !== undefined) && (args != null))
	{
		var l = args.length;
		for(var i = 0;i < l;i++)
			ret.push(args[i]);
	}
	return(ret);
}

function isString(a) {
  return typeof a == 'string';
}

function isFunction(a) {
  return typeof a == 'function';
}

function isArray(a) {
  return (a instanceof Array);
}

function xbs_intdiv(number, diviser) {
	var result = Math.floor(number / diviser);
	return result;
}

function xbs_round(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}

function xbs_ispair(nombre)
{
   return ((nombre % 2) == 0);
}

function xbs_rand_int(min, max)
{
   return(Math.floor(Math.random() * (max - min + 1)) + min);
}

function xbs_min()
{
	var args = argsAsArray(xbs_min.arguments);
	var max_i = args.length;
	if (max_i == 0)
		return(0);
	var vmin = args[0];
	if (max_i == 1)
		return(vmin);
	for (var i = 0;i < max_i;i++)
		if (args[i] < vmin)
			vmin = args[i];
	return(vmin);
}

function xbs_max()
{
	var args = argsAsArray(xbs_max.arguments);
	var max_i = args.length;
	if (max_i == 0)
		return(0);
	var vmax = args[0];
	if (max_i == 1)
		return(vmax);
	for (var i = 0;i < max_i;i++)
		if (args[i] > vmax)
			vmax = args[i];
	return(vmax);
}

function fixed_from_char_code(codePt)
{
    if (codePt > 0xFFFF)
	{
        codePt -= 0x10000;
        return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
    }
	return String.fromCharCode(codePt);
}


//////////////////////////////////////////////////////////////////////////////
// Object Oriented Programmation
//////////////////////////////////////////////////////////////////////////////

var	_xbs_jso = this; // JS Obj
var _xbs_packages = new Array();
var _xbs_templates = new Array();
var _xbs_classes = new Array();
var _xbs_classScope = new Array();
var _xbs_callstack = new Array();
var _xbs_instances = new Array();
var _xbs_instancesIdCnt = 0;
var _xbs_public = 1;
var _xbs_protected = 2;
var _xbs_private = 4;
var _xbs_package = 8;


function _xbs_inherit_from_class(inheritance_package, inheritance_class, currClass, currPackage, inheritClass) {
	if ((currPackage != null) && (currPackage._name == inheritClass._package._name))
	{
		currClass._super[inheritance_package+'.'+inheritance_class] = inheritClass;
	}
	else
	{
		if (inheritClass._level == _xbs_public)
			currClass._super[inheritance_package+'.'+inheritance_class] = inheritClass;
		else
			internalAlert('[class "'+currClass._name+'"] - Can not inherit private class "'+inheritance_package+'.'+inheritance_class+'".');
	}
}

function _xbs_inherit_from(inheritance, currClass, currPackage) {
	var inheritance_package = '';
	var inheritance_class = '';
	var className = currClass._name;

	if (inheritance.length > 0)
	{
		var i = inheritance.indexOf('.');
		if (i == -1)
		{
			inheritance_class = inheritance;
		}
		else
		{
			if (i == 0)
			{
				inheritance_class = inheritance.substr(1);
			}
			else
			{
				inheritance_package = inheritance.substr(0, i);
				inheritance_class = inheritance.substr(i + 1);
			}
		}
		if (inheritance_package.length > 0)
		{
			if (_xbs_packages[inheritance_package] !== undefined)
			{
				if (_xbs_packages[inheritance_package]._classes[inheritance_class] !== undefined)
					_xbs_inherit_from_class(inheritance_package, inheritance_class, currClass, currPackage, _xbs_packages[inheritance_package]._classes[inheritance_class]);
				else
					internalAlert('[class "'+className+'"] - Can not inherit class "'+inheritance+'": unknown class.');
			}
			else
			{
				internalAlert('[class "'+className+'"] - Can not inherit class "'+inheritance+'": unknown package.');
			}
		}
		else
		{
			if ((_xbs_jso[inheritance_class] !== undefined) && (_xbs_jso[inheritance_class]._name !== undefined))
			{
				if ((_xbs_jso[inheritance_class]._package != null) && (_xbs_jso[inheritance_class]._package._name.length > 0))
					currClass._super[_xbs_jso[inheritance_class]._package._name+'.'+inheritance_class] = _xbs_jso[inheritance_class];
				else
					currClass._super[inheritance_class] = _xbs_jso[inheritance_class];
			}
			else
			{
				if (currPackage != null)
				{
					if (currPackage._classes[inheritance_class] !== undefined)
						_xbs_inherit_from_class(currPackage._name, inheritance_class, currClass, currPackage, currPackage._classes[inheritance_class])
					else
						internalAlert('[class "'+className+'"] - Can not inherit class "'+inheritance+'": unknown class.');
				}
				else
				{
					internalAlert('[class "'+className+'"] - Can not inherit class "'+inheritance+'": unknown class.');
				}
			}
		}
	}
}

function _xbs_level_to_string(level)
{
	if (level == _xbs_public)
		return('_xbs_public');
	if (level == _xbs_protected)
		return('_xbs_protected');
	if (level == _xbs_private)
		return('_xbs_private');
	if (level == _xbs_package)
		return('_xbs_package');
}

function _xbs_template_validate(pClass, templateName, currPackage)
{
	//Get template
	var pTemplate = null;
	var template_package = '';
	var template_name = '';
	var i = templateName.indexOf('.');
	if (i == -1)
	{
		template_name = templateName;
	}
	else
	{
		if (i == 0)
		{
			template_name = templateName.substr(1);
		}
		else
		{
			template_package = templateName.substr(0, i);
			template_name = templateName.substr(i + 1);
		}
	}
	if (templateName.length > 0)
	{
		if (_xbs_packages[template_package] === undefined)
		{
			internalAlert('[class "'+className+'"] - Can not templatize from "'+templateName+'": unknown package.');
			return(false);
		}
		if (_xbs_packages[template_package]._templates[template_name] === undefined)
		{
			internalAlert('[class "'+className+'"] - Can not templatize from "'+templateName+'": unknown template.');
			return(false);
		}
		pTemplate = _xbs_packages[template_package]._templates[template_name];
	}
	else
	{
		if ((_xbs_jso[template_name] !== undefined) && (_xbs_jso[template_name]._name !== undefined))
		{
			pTemplate = _xbs_jso[template_name];
		}
		else
		{
			if (currPackage == null)
			{
				internalAlert('[class "'+className+'"] - Can not templatize from "'+templateName+'": unknown template.');
				return(false);
			}
			if (currPackage._templates[template_name] === undefined)
			{
				internalAlert('[class "'+className+'"] - Can not templatize from "'+templateName+'": unknown template.');
				return(false);
			}
			pTemplate = currPackage._templates[template_name];
		}
	}
	// If template is not null, validate the class
	var validateResult = true;
	if (pTemplate != null)
	{
		//Constants
		for (var i in pTemplate._const)
		{
			if (pClass._const[i] === undefined)
			{
				internalAlert('[class "'+className+'"] - the const "'+i+'" is not defined, as required in template "'+templateName+'".');
				validateResult = false;
			}
		}
		//Datas
		for (var i in pTemplate._data)
		{
			if (pClass._data[i] === undefined)
			{
				internalAlert('[class "'+className+'"] - the data "'+i+'" is not defined, as required in template "'+templateName+'".');
				validateResult = false;
			}
			else
			{
				if (pClass._data[i].level != pTemplate._data[i].level)
				{
					internalAlert('[class "'+className+'"] - the data "'+i+'" has a bad level, as defined in template "'+templateName+'": '+_xbs_level_to_string(pClass._data[i].level)+' defined when '+_xbs_level_to_string(pTemplate._data[i].level)+' expected.');
					validateResult = false;
				}
				else
				{
					if (pClass._data[i].static != pTemplate._data[i].static)
					{
						if (pTemplate._data[i].static == true)
							internalAlert('[class "'+className+'"] - the data "'+i+'" is defined has static in the template "'+templateName+'", and wrong declared as non static.');
						else
							internalAlert('[class "'+className+'"] - the data "'+i+'" is defined has non static in the template "'+templateName+'", and wrong declared as static.');
						validateResult = false;
					}
				}
			}
		}
		//Properties
		for (var i in pTemplate._prop)
		{
			if (pClass._prop[i] === undefined)
			{
				internalAlert('[class "'+className+'"] - the property "'+i+'" is not defined, as required in template "'+templateName+'".');
				validateResult = false;
			}
			else
			{
				if (pClass._prop[i].static != pTemplate._prop[i].static)
				{
					if (pTemplate._prop[i].static == true)
						internalAlert('[class "'+className+'"] - the property "'+i+'" is defined has static in the template "'+templateName+'", and wrong declared as non static.');
					else
						internalAlert('[class "'+className+'"] - the property "'+i+'" is defined has non static in the template "'+templateName+'", and wrong declared as static.');
					validateResult = false;
				}
				else
				{
					if (pClass._prop[i].level != pTemplate._prop[i].level)
					{
						internalAlert('[class "'+className+'"] - the property "'+i+'" has a bad level, as defined in template "'+templateName+'": '+_xbs_level_to_string(pClass._prop[i].level)+' defined when '+_xbs_level_to_string(pTemplate._prop[i].level)+' expected.');
						validateResult = false;
					}
					else
					{
						if (pClass._prop[i].getter.level != pTemplate._prop[i].getter)
						{
							internalAlert('[class "'+className+'"] - the getter of the property "'+i+'" has a bad level, as defined in template "'+templateName+'": '+_xbs_level_to_string(pClass._prop[i].getter.level)+' defined when '+_xbs_level_to_string(pTemplate._prop[i].getter)+' expected.');
							validateResult = false;
						}
						else
						{
							if ((pTemplate._prop[i].setter == 0) && (pClass._prop[i].setter.func != null))
							{
								internalAlert('[class "'+className+'"] - the setter of the property "'+i+'" is declared and expected to be not declared as defined in template "'+templateName+'".');
								validateResult = false;
							}
							else
							{
								if ((pTemplate._prop[i].setter > 0) && (pClass._prop[i].setter.func == null))
								{
									internalAlert('[class "'+className+'"] - the setter of the property "'+i+'" is not declared and expected to be declared as defined in template "'+templateName+'".');
									validateResult = false;
								}
								else
								{
									if (pClass._prop[i].setter.level != pTemplate._prop[i].setter)
									{
										internalAlert('[class "'+className+'"] - the setter of the property "'+i+'" has a bad level, as defined in template "'+templateName+'": '+_xbs_level_to_string(pClass._prop[i].setter.level)+' defined when '+_xbs_level_to_string(pTemplate._prop[i].setter)+' expected.');
										validateResult = false;
									}
								}
							}
						}
					}
				}
			}
		}
		//Events
		for (var i in pTemplate._event)
		{
			if (pClass._event[i] === undefined)
			{
				internalAlert('[class "'+className+'"] - the event "'+i+'" is not defined, as required in template "'+templateName+'".');
				validateResult = false;
			}
			else
			{
				if (pClass._event[i].level != pTemplate._event[i].level)
				{
					internalAlert('[class "'+className+'"] - the event "'+i+'" has a bad level, as defined in template "'+templateName+'": '+_xbs_level_to_string(pClass._event[i].level)+' defined when '+_xbs_level_to_string(pTemplate._event[i].level)+' expected.');
					validateResult = false;
				}
				else
				{
					if (pClass._event[i].static != pTemplate._event[i].static)
					{
						if (pTemplate._event[i].static == true)
							internalAlert('[class "'+className+'"] - the event "'+i+'" is defined has static in the template "'+templateName+'", and wrong declared as non static.');
						else
							internalAlert('[class "'+className+'"] - the event "'+i+'" is defined has non static in the template "'+templateName+'", and wrong declared as static.');
						validateResult = false;
					}
				}
			}
		}
		//Functions
		for (var i in pTemplate._func)
		{
			if (pClass._func[i] === undefined)
			{
				internalAlert('[class "'+className+'"] - the function "'+i+'" is not defined, as required in template "'+templateName+'".');
				validateResult = false;
			}
			else
			{
				if (pClass._func[i].level != pTemplate._func[i].level)
				{
					internalAlert('[class "'+className+'"] - the function "'+i+'" has a bad level, as defined in template "'+templateName+'": '+_xbs_level_to_string(pClass._func[i].level)+' defined when '+_xbs_level_to_string(pTemplate._func[i].level)+' expected.');
					validateResult = false;
				}
				else
				{
					if (pClass._func[i].static != pTemplate._func[i].static)
					{
						if (pTemplate._func[i].static == true)
							internalAlert('[class "'+className+'"] - the function "'+i+'" is defined has static in the template "'+templateName+'", and wrong declared as non static.');
						else
							internalAlert('[class "'+className+'"] - the function "'+i+'" is defined has non static in the template "'+templateName+'", and wrong declared as static.');
						validateResult = false;
					}
				}
			}
		}
	}
	return(validateResult);
}

// @func newPackage
//   @desc Create a new package.
//   @desc_fre Crée un nouveau package.
//   @param packName
//     @type string
//     @desc Name of the package to create.
//     @desc_fre Nom du package à créer.
//   @param packProperties
//     @type Array
//     @desc Array of properties of the package:<br>&nbsp;&nbsp;- using (array): list of package dependencies (see sample below)
//     @desc_fre Propriétés du package :<br>&nbsp;&nbsp;- using (array) : liste des package dépendants (voir exemple ci-dessous)
//   @param packCode
//     @type function
//     @desc Code of the package.
//     @desc_fre Code du package.
//   @sample
//     @title Sample 1: create a basic package (Hello World!):
//     @title_fre Exemple 1 : création d'un package "Hello World!" :
//     @section
//       @text This code create a simple package named "xbs_sample0_HelloWorld", with function in class saying "Hello world!".
//       @text_fre Ce code crée un package simple nommée "xbs_sample0_HelloWorld", possédant une fonction dans une classe qui affiche "Hello world!".
//       @codeBegin
//         @code newPackage('xbs_sample0_HelloWorld', { }, function() {
//         @code   newClass('xbs_sample0_HelloWorldCls', { level: _xbs_public }, null, function() {
//         @code     // Constructor & Destructor
//         @code     this.constructor({ level: _xbs_public }, function() {
//         @code     });
//         @code     // Public functions
//         @code     this.function('SayHello', { level: _xbs_public }, function() {
//         @code       alert('Hello World!');
//         @code     });
//         @code   });
//         @code });
//     @section
//       @text The following code create a package using XBS Window Manager Package (xbs_wm). When loading the xbs_sample0 package, if the xbs_wm package is not previously loaded, an error will be raised.
//       @text_fre Le code suivant crée un package qui utilise le package XBS Window Manager Package (xbs_wm). Si le package xbs_wm n'est pas chargé au préalable, la package xbs_sample0 ne sera pas chargé et une erreur sera lancée.
//       @codeExec
//         @code newPackage('xbs_sample0', { using: [ xbs_wm ] }, function() {
//         @code   [...]
//         @code });

function newPackage(packName, packProperties, packCode) {
	// parameters management
	if (packProperties === undefined)
		packProperties = { using: [ ] };
	if (packProperties.using === undefined)
		packProperties.using = new Array();
	// code
	if (_xbs_classScope.len > 0)
	{
		internalAlert('Can not create package into another package or class or function.');
		return;
	}
	if (_xbs_jso[packName] !== undefined)
	{
		internalAlert('Can not redefine package named "'+packName+'".');
		return;
	}
	for (var i in packProperties.using)
	{
		if (_xbs_jso[packProperties.using[i]] === undefined)
		{
			internalAlert('The package "'+packName+'" need the package "'+packProperties.using[i]+'", that is not previously loaded.');
			return;
		}
	}
	_xbs_jso[packName] = new Object;
	var pPackage = _xbs_jso[packName];
	_xbs_packages[packName] = pPackage;
	pPackage._name = packName;
	// dependencies express link
	pPackage._dependencies = new Array();
	for (var i in packProperties.using)
		pPackage._dependencies[packProperties.using[i]] = _xbs_jso[packProperties.using[i]];
	
	// OOP Datas
	
	pPackage._templates = new Array();
	pPackage._classes = new Array();
	
	// OOP Functions
	
	pPackage.newTemplate = function() {
		if (_xbs_classScope[0] == '_pk_'+this._name+'_pk_')
		{
			var args = argsAsArray(this.newTemplate.arguments);
			args.unshift(this);
			return(_xbs_newTemplate.apply(_xbs_jso, args));
		}
		else
		{
			internalAlert('Can not create a template for a package outside itself.');
		}
		return(null);
	};
	pPackage.getTemplate = function(templateName) {
		var scope = 0;
		if ((_xbs_classScope[0] == '_pk_'+this._name+'_pk_') || (_xbs_classScope[0] == this._name) || (_xbs_classScope[0].indexOf(this._name+'.') == 0))
		{
			scope = 7;
		}
		else
		{
			if (_xbs_classScope[0].indexOf('_tmp_'+this._name) == 0)
			{
				var intemplate = _xbs_classScope[0].substr(6 + this._name.length, _xbs_classScope[0].length - 11 - this._name.length);
				if (this._templates[intemplate] !== undefined)
					scope = 7;
				else
					scope = 1;
			}
			else
			{
				scope = 1;
			}
		}
		if ((this._templates[templateName] !== undefined) && ((scope & this._templates[templateName]._level) == this._templates[templateName]._level))
			return(this._templates[templateName]);
		internalAlert('Unknown class "'+templateName+'" in the package "'+this._name+'".');
		return(null);
	};
	pPackage.newClass = function() {
		if (_xbs_classScope[0] == '_pk_'+this._name+'_pk_')
		{
			var args = argsAsArray(this.newClass.arguments);
			args.unshift(this);
			return(_xbs_newClass.apply(_xbs_jso, args));
		}
		else
		{
			internalAlert('Can not create a class for a package outside itself.');
		}
		return(null);
	};
	pPackage.getClass = function(className) {
		var scope = 0;
		if ((_xbs_classScope[0] == '_pk_'+this._name+'_pk_') || (_xbs_classScope[0] == this._name) || (_xbs_classScope[0].indexOf(this._name+'.') == 0))
		{
			scope = 7;
		}
		else
		{
			if (_xbs_classScope[0].indexOf('_cls_'+this._name) == 0)
			{
				var inclass = _xbs_classScope[0].substr(6 + this._name.length, _xbs_classScope[0].length - 11 - this._name.length);
				if (this._classes[inclass] !== undefined)
					scope = 7;
				else
					scope = 1;
			}
			else
			{
				scope = 1;
			}
		}
		if ((this._classes[className] !== undefined) && ((scope & this._classes[className]._level) == this._classes[className]._level))
			return(this._classes[className]);
		internalAlert('Unknown class "'+className+'" in the package "'+this._name+'".');
		return(null);
	};
	
	// Execute package code
	
	if (packCode !== undefined)
	{
		if (isFunction(packCode) == true)
		{
			_xbs_classScope.unshift('_pk_'+packName+'_pk_');
			packCode.apply(pPackage);
			_xbs_classScope.shift();
		}
	}
}



// @func newTemplate
//   @desc Create a new template.
//   @desc_fre Crée une nouveau template.
//   @param templateName
//     @type string
//     @desc Name of the class to create.
//     @desc_fre Nom de la classe à créer.
//   @param classProperties
//     @type Array
//     @desc Array of properties of the class:<br>&nbsp;&nbsp;- level (_xbs_public, _xbs_protected, _xbs_private)<br>&nbsp;&nbsp;- static (boolean)<br>&nbsp;&nbsp;- abstract (boolean)<br>&nbsp;&nbsp;- params to pass to inheritance constructor(s) (see sample below)
//     @desc_fre Propriétés de la classe :<br>&nbsp;&nbsp;- level (_xbs_public, _xbs_protected, _xbs_private)<br>&nbsp;&nbsp;- static (booléen)<br>&nbsp;&nbsp;- abstract (booléen)<br>&nbsp;&nbsp;- paramètres à passer au constructeur du parent dont on hérite (voir exemple ci-dessous)
//   @param inheritance
//     @type String or Array
//     @desc Name or list of names of the inherited class(es).
//     @desc_fre Nom de la classe ou noms des classes parentes.
//   @param classCode
//     @type function
//     @desc Code of the class.
//     @desc_fre Code de la classe.
//   @sample
//     @title Sample 1: create a basic class (Hello World!):
//     @title_fre Exemple 1 : création d'une classe "Hello World!" :
//     @section
//       @text This code create a simple class named "xbs_sample1_HelloWorld", with a function saying "Hello world!".
//       @text_fre Ce code crée une classe simple nommée "xbs_sample1_HelloWorld", possédant une fonction qui affiche "Hello world!".
//       @codeBegin
//         @code newClass('xbs_sample1_HelloWorld', { }, null, function() {
//         @code   // Constructor & Destructor
//         @code   this.constructor({ level: _xbs_public }, function() {
//         @code   });
//         @code   // Public functions
//         @code   this.function('SayHello', { level: _xbs_public }, function() {
//         @code     alert('Hello World!');
//         @code   });
//         @code });
//     @section
//       @text The following code create an instance and call the "SayHello" function.
//       @text_fre Le code suivant crée une instance de la classe et appelle la fonction "SayHello".
//       @codeExec
//         @hcode newClass('xbs_sample1_HelloWorld', { }, null, function() {
//         @hcode   // Constructor & Destructor
//         @hcode   this.constructor({ level: _xbs_public }, function() {
//         @hcode   });
//         @hcode   // Public functions
//         @hcode   this.function('SayHello', { level: _xbs_public }, function() {
//         @hcode     alert('Hello World!');
//         @hcode   });
//         @hcode });
//         @code var sample1 = xblNew('xbs_sample1_HelloWorld');
//         @code sample1.call('SayHello');
//         @hcode xblDelete(sample1);

function newTemplate(templateName, templateProperties, templateCode) {
	return(_xbs_newTemplate(null, templateName, templateProperties, templateCode));
}

function _xbs_newTemplate(pPackage, templateName, templateProperties, templateCode) {
	// Get scope : if not in package declaration and package not null, reject
	if ((pPackage != null) && (_xbs_classScope[0] != '_pk_'+pPackage._name+'_pk_'))
	{
		internalAlert('[class "'+pPackage._name+'"] - A template can not be defined outside his package definition.');
		return
	}
	// parameters management
	if (templateProperties === undefined)
	{
		if (pPackage == null)
			templateProperties = { level: _xbs_public };
		else
			templateProperties = { level: _xbs_private };
	}
	if (templateProperties.level === undefined)
	{
		if (pPackage == null)
			templateProperties.level = _xbs_public;
		else
			templateProperties.level = _xbs_private;
	}
	if ((templateProperties.level != _xbs_public) && (templateProperties.level != _xbs_private))
	{
		internalAlert('The access level of a Template can only be public or private.');
		return;
	}	
	// code
	if (pPackage == null)
	{
		if (_xbs_jso[templateName] !== undefined)
		{
			internalAlert('Can not redefine template "'+templateName+'".');
			return;
		}
		_xbs_jso[templateName] = new Object;
		var pTemplate = _xbs_jso[templateName];
		_xbs_templates.push(pTemplate);
	}
	else
	{
		if (pPackage._templates[templateName] !== undefined)
		{
			internalAlert('Can not redefine template "'+pPackage._name+'.'+templateName+'".');
			return;
		}
		pPackage._templates[templateName] = new Object;
		var pTemplate = pPackage._templates[templateName];
		if (templateProperties.level == _xbs_public)
		{
			_xbs_templates.push(pTemplate);
			pPackage[templateName] = pTemplate;
		}
	}
	pTemplate._name = templateName;
	
	// OOP Datas
	
	if (pPackage == null)
	{
		pTemplate._package = new Array();
		pTemplate._package._name = '';
	}
	else
	{
		pTemplate._package = pPackage;
	}
	pTemplate._level = templateProperties.level;
	pTemplate._func = new Array();
	pTemplate._data = new Array();
	pTemplate._prop = new Array();
	pTemplate._event = new Array();
	pTemplate._const = new Array();
	
	// OOP Functions
	
	pTemplate.const = function(constName, dataProperties) {
		newTmpConst(this, constName, dataProperties);
	};
	pTemplate.data = function(dataName, dataProperties) {
		newTmpData(this, dataName, dataProperties);
	};
	pTemplate.property = function(propName, propProperties, getterLevel, setterLevel) {
		newTmpProperty(this, propName, propProperties, getterLevel, setterLevel);
	};
	pTemplate.function = function(funcName, funcProperties) {
		newTmpFunction(this, funcName, funcProperties);
	};
	pTemplate.event = function(eventName, eventProperties) {
		newTmpEvent(this, eventName, eventProperties);
	};
	
	// Execute template code
	
	if (templateCode !== undefined)
	{
		if (isFunction(templateCode) == true)
		{
			_xbs_classScope.unshift('_tmp_'+pTemplate._package._name+'_'+templateName+'_tmp_');
			templateCode.apply(pTemplate);
			_xbs_classScope.shift();
		}
	}
}



// @func newClass
//   @desc Create a new class.
//   @desc_fre Crée une nouvelle classe.
//   @param className
//     @type string
//     @desc Name of the class to create.
//     @desc_fre Nom de la classe à créer.
//   @param classProperties
//     @type Array
//     @desc Array of properties of the class:<br>&nbsp;&nbsp;- level (_xbs_public, _xbs_protected, _xbs_private)<br>&nbsp;&nbsp;- static (boolean)<br>&nbsp;&nbsp;- abstract (boolean)<br>&nbsp;&nbsp;- params to pass to inheritance constructor(s) (see sample below)
//     @desc_fre Propriétés de la classe :<br>&nbsp;&nbsp;- level (_xbs_public, _xbs_protected, _xbs_private)<br>&nbsp;&nbsp;- static (booléen)<br>&nbsp;&nbsp;- abstract (booléen)<br>&nbsp;&nbsp;- paramètres à passer au constructeur du parent dont on hérite (voir exemple ci-dessous)
//   @param inheritance
//     @type String or Array
//     @desc Name or list of names of the inherited class(es).
//     @desc_fre Nom de la classe ou noms des classes parentes.
//   @param classCode
//     @type function
//     @desc Code of the class.
//     @desc_fre Code de la classe.
//   @sample
//     @title Sample 1: create a basic class (Hello World!):
//     @title_fre Exemple 1 : création d'une classe "Hello World!" :
//     @section
//       @text This code create a simple class named "xbs_sample1_HelloWorld", with a function saying "Hello world!".
//       @text_fre Ce code crée une classe simple nommée "xbs_sample1_HelloWorld", possédant une fonction qui affiche "Hello world!".
//       @codeBegin
//         @code newClass('xbs_sample1_HelloWorld', { }, null, function() {
//         @code   // Constructor & Destructor
//         @code   this.constructor({ level: _xbs_public }, function() {
//         @code   });
//         @code   // Public functions
//         @code   this.function('SayHello', { level: _xbs_public }, function() {
//         @code     alert('Hello World!');
//         @code   });
//         @code });
//     @section
//       @text The following code create an instance and call the "SayHello" function.
//       @text_fre Le code suivant crée une instance de la classe et appelle la fonction "SayHello".
//       @codeExec
//         @hcode newClass('xbs_sample1_HelloWorld', { }, null, function() {
//         @hcode   // Constructor & Destructor
//         @hcode   this.constructor({ level: _xbs_public }, function() {
//         @hcode   });
//         @hcode   // Public functions
//         @hcode   this.function('SayHello', { level: _xbs_public }, function() {
//         @hcode     alert('Hello World!');
//         @hcode   });
//         @hcode });
//         @code var sample1 = xblNew('xbs_sample1_HelloWorld');
//         @code sample1.call('SayHello');
//         @hcode xblDelete(sample1);

function newClass(className, classProperties, inheritance, classCode) {
	return(_xbs_newClass(null, className, classProperties, inheritance, classCode));
}

function _xbs_newClass(pPackage, className, classProperties, inheritance, classCode) {
	// Get scope : if not in package declaration and package not null, reject
	if ((pPackage != null) && (_xbs_classScope[0] != '_pk_'+pPackage._name+'_pk_'))
	{
		internalAlert('[class "'+pPackage._name+'"] - A class can not be defined outside his package definition.');
		return
	}
	// parameters management
	if (classProperties === undefined)
	{
		if (pPackage == null)
			classProperties = { level: _xbs_public, static: false, abstract: false };
		else
			classProperties = { level: _xbs_private, static: false, abstract: false };
	}
	if (classProperties.level === undefined)
	{
		if (pPackage == null)
			classProperties.level = _xbs_public;
		else
			classProperties.level = _xbs_private;
	}
	if ((classProperties.level != _xbs_public) && (classProperties.level != _xbs_private))
	{
		internalAlert('The access level of a Class can only be public or private.');
		return;
	}	
	if (classProperties.static === undefined)
		classProperties.static = false;
	if (classProperties.abstract === undefined)
		classProperties.abstract = false;
	// code
	if (pPackage == null)
	{
		if (_xbs_jso[className] !== undefined)
		{
			internalAlert('Can not redefine class "'+className+'".');
			return;
		}
		_xbs_jso[className] = new Object;
		var pClass = _xbs_jso[className];
		_xbs_classes.push(pClass);
	}
	else
	{
		if (pPackage._classes[className] !== undefined)
		{
			internalAlert('Can not redefine class "'+pPackage._name+'.'+className+'".');
			return;
		}
		pPackage._classes[className] = new Object;
		var pClass = pPackage._classes[className];
		if (classProperties.level == _xbs_public)
		{
			_xbs_classes.push(pClass);
			pPackage[className] = pClass;
		}
	}
	pClass._super = new Array();
	pClass._name = className;
	pClass._instances = 0;
	if ((inheritance !== undefined) && (inheritance != null))
	{
		if (isString(inheritance) == true)
		{
			_xbs_inherit_from(inheritance, pClass, pPackage);
		}
		else
		{
			for (var i in inheritance)
				_xbs_inherit_from(inheritance[i], pClass, pPackage);
		}
	}
	
	// OOP Datas
	
	if (pPackage == null)
	{
		pClass._package = new Array();
		pClass._package._name = '';
	}
	else
	{
		pClass._package = pPackage;
	}
	pClass._level = classProperties.level;
	pClass._static = classProperties.static;
	pClass._abstract = classProperties.abstract;
	pClass._func = new Array();
	pClass._data = new Array();
	pClass._prop = new Array();
	pClass._event = new Array();
	
	// OOP Functions
	
	pClass.isClass = function(className) {
		return(_xbs_isClass(this, className));
	};
	pClass.const = function(constName, dataProperties, constValue) {
		newConst(this, constName, dataProperties, constValue);
	};
	pClass.data = function(dataName, dataProperties, initValue) {
		newData(this, dataName, dataProperties, initValue);
	};
	pClass.property = function(propName, propProperties, getterLevel, getter, setterLevel, setter) {
		newProperty(this, propName, propProperties, getterLevel, getter, setterLevel, setter);
	};
	pClass.get = function(dtpropName) {
		return(_xbs_getSData(this, dtpropName));
	};
	pClass.set = function(dtpropName, dataValue) {
		_xbs_setSData(this, dtpropName, dataValue);
	};
	pClass.function = function(funcName, funcProperties, funcDef) {
		newFunction(this, funcName, funcProperties, funcDef);
	};
	pClass.constructor = function(funcProperties, funcDef) {
		if (funcProperties === undefined)
			funcProperties = { level: _xbs_public, static: false, abstract: false, override: true };
		if (funcProperties.level === undefined)
			funcProperties.level = _xbs_public;
		funcProperties.static = false;
		funcProperties.abstract = false;
		funcProperties.override = true;
		newFunction(this, '_constructor', funcProperties, funcDef);
		// Analyse the properties to find if constructors parameters defines for superclass
		this._func['_constructor'].super = new Array();
		for (var i in this._super)
		{
			if (funcProperties[this._super[i]._name] !== undefined)
			{
				this._func['_constructor'].super[i] = funcProperties[this._super[i]._name];
			}
		}
	};
	pClass.destructor = function(funcProperties, funcDef) {
		if (funcProperties === undefined)
			funcProperties = { level: _xbs_public, static: false, abstract: false, override: true };
		if (funcProperties.level === undefined)
			funcProperties.level = _xbs_public;
		funcProperties.static = false;
		funcProperties.abstract = false;
		funcProperties.override = true;
		newFunction(this, '_destructor', funcProperties, funcDef);
	};
	pClass.call = function() {
		var args = argsAsArray(this.call.arguments);
		args.unshift(this);
		return(_xbs_StaticCall.apply(_xbs_jso, args));
	};
	pClass.xblNew = function() {
		var args = argsAsArray(this.xblNew.arguments);
		args.unshift(this);
		return(xblNew.apply(_xbs_jso, args));
	};
	pClass.event = function(eventName, eventProperties) {
		newEvent(this, eventName, eventProperties);
	};
	pClass.eventListenerAdd = function(eventName, pCallObj, pCallFunc) {
		eventListenerAdd(this, eventName, pCallObj, pCallFunc);
	};
	pClass.eventListenerRem = function(eventName, pCallObj, pCallFunc) {
		eventListenerRem(this, eventName, pCallObj, pCallFunc);
	};
	pClass.raiseEvent = function(eventName, eventDatas) {
		return(raiseEvent(this, eventName, eventDatas));
	};
	
	// Create ooapi event _xbs_oninstanciated : only if no inheritance
	
	var j = 0;
	for (var i in pClass._super)
		j++;
	if (j == 0)
	{
		pClass._event['_xbs_oninstanciated'] = new Array();
		pClass._event['_xbs_oninstanciated']['active'] = true;
		pClass._event['_xbs_oninstanciated']['callers'] = new Array();
		pClass._event['_xbs_oninstanciated']['level'] = _xbs_public;
		pClass._event['_xbs_oninstanciated']['override'] = false;
		pClass._event['_xbs_oninstanciated']['scope'] = pClass;
		pClass._event['_xbs_oninstanciated']['static'] = false;
	}
	
	// Execute class code
	
	if (classCode !== undefined)
	{
		if (isFunction(classCode) == true)
		{
			_xbs_classScope.unshift('_cls_'+pClass._package._name+'_'+className+'_cls_');
			classCode.apply(pClass);
			_xbs_classScope.shift();
		}
	}
	
	// Validate class with template
	
	if (classProperties.template !== undefined)
	{
		var tmpResult = true;
		if (isString(classProperties.template) == true)
		{
			tmpResult = _xbs_template_validate(pClass, classProperties.template, pPackage);
		}
		else
		{
			for (var i in classProperties.template)
			{
				if (tmpResult == true)
					tmpResult = _xbs_template_validate(pClass, classProperties.template[i], pPackage);
			}
		}
		if (tmpResult == false)
		{
			if (pPackage == null)
			{
				delete _xbs_classes[pClass];
				if (_xbs_jso[className] !== undefined)
					delete _xbs_jso[className];
			}
			else
			{
				delete pPackage._classes[className];
				if (pPackage[className] !== undefined)
					delete pPackage[className];
			}
		}
	}
}


function _xbs_directParent(class1, package2, class2) {
	var package1 = '';
	var i = 0;
	
	if (class1 !== undefined)
	{
		i = class1.indexOf('.');
		if (i > 0)
		{
			package1 = class1.substr(0, i);
			class1 = class1.substr(i + 1);
			if (_xbs_packages[package1]._classes[class1] === undefined)
				return(false);
			//if (_xbs_packages[package1]._classes[class1]._super[package2._name+'.'+class2] === undefined)
			if (_xbs_packages[package1]._classes[class1]._super[package2+'.'+class2] === undefined)
				return(false);
		}
		else
		{
			class1 = class1.substr(i + 1);
			if (_xbs_classes[class1] === undefined)
				return(false);
			//if (_xbs_classes[class1]._super[package2._name+'.'+class2] === undefined)
			if (_xbs_classes[class1]._super[package2+'.'+class2] === undefined)
				return(false);
		}
		return(true);
	}
	return(false);
}

function newTmpConst(pTemplate, constName, constProperties) {
	// Get scope : if not in class declaration, reject
	if (_xbs_classScope[0] != '_tmp_'+pTemplate._package._name+'_'+pTemplate._name+'_tmp_')
	{
		internalAlert('[template "'+pTemplate._name+'"] - A constant can not be defined outside template definition.');
		return
	}
	if (constProperties === undefined)
		constProperties = { level: _xbs_public, static: true };
	if (constProperties.level === undefined)
		constProperties.level = _xbs_public;
	if (constProperties.static === undefined)
		constProperties.static = false;
	if (constProperties.abstract === undefined)
		constProperties.abstract = false;
	if (constProperties.level != _xbs_public)
	{
		internalAlert('[template "'+pTemplate._name+'"] - Can not define constant "'+constName+'" as protected or private.');
	}
	else
	{
		if (constProperties.abstract == true)
		{
			internalAlert('[template "'+pTemplate._name+'"] - Can not define constant "'+constName+'" as abstract.');
		}
		else
		{
			if (constProperties.static == false)
			{
				internalAlert('[template "'+pTemplate._name+'"] - Can not define constant "'+constName+'" as non static.');
			}
			else
			{
				if (pTemplate._const[constName] === undefined)
					pTemplate._const[constName] = 1;
				else
					internalAlert('[template "'+pTemplate._name+'"] - Can not redefine "'+constName+'".');
			}
		}
	}
}

function newConst(pClass, constName, constProperties, constValue) {
	// Get scope : if not in class declaration, reject
	if (_xbs_classScope[0] != '_cls_'+pClass._package._name+'_'+pClass._name+'_cls_')
	{
		internalAlert('[class "'+pClass._name+'"] - A constant can not be defined outside class definition.');
		return
	}
	if (constProperties === undefined)
		constProperties = { level: _xbs_public, static: true, abstract: false };
	if (constProperties.level === undefined)
		constProperties.level = _xbs_public;
	if (constProperties.static === undefined)
		constProperties.static = true;
	if (constProperties.abstract === undefined)
		constProperties.abstract = false;
	if (pClass._abstract == true)
	{
		internalAlert('[class "'+pClass._name+'"] - Can not define constant "'+constName+'" on an abstract class.');
	}
	else
	{
		if (constProperties.abstract == true)
		{
			internalAlert('[class "'+pClass._name+'"] - Can not define constant "'+constName+'" as abstract.');
		}
		else
		{
			if (constProperties.static == false)
			{
				internalAlert('[class "'+pClass._name+'"] - Can not define constant "'+constName+'" as non static.');
			}
			else
			{
				if (pClass[constName] === undefined)
					pClass[constName] = constValue;
				else
					internalAlert('[class "'+pClass._name+'"] - Can not redefine "'+constName+'".');
			}
		}
	}
}

_xbs_dtPropFunType = 0; // 1 for data, 2 for property, 3 for function
_xbs_dtPropFunOverrideSrc = null;

function prefixReservedName(propName) {
	// Prefix element of the class Array (properties and methods)
	// properties
	if ((propName == 'length') || (propName == 'constructor') || (propName == 'prototype'))
		propName = '_xbs_pre_'+propName;
	// methods
	if ((propName == 'concat') || (propName == 'indexOf') || (propName == 'join') || (propName == 'lastIndexOf') || (propName == 'pop') || (propName == 'push') || (propName == 'reverse') || (propName == 'shift') || (propName == 'slice') || (propName == 'sort') || (propName == 'splice') || (propName == 'toString') || (propName == 'unshift') || (propName == 'valueOf'))
		propName = '_xbs_pre_'+propName;
	return(propName);
}

function _xbs_dtpropfunExists(pClass, dtpropfunName, isData, override, scope) {
	if (isData === undefined) isData = true;
	if (override === undefined) override = false;
	if (scope === undefined) scope = 7;
	// Exists in local function
	if (pClass._func[dtpropfunName] !== undefined)
	{
		_xbs_dtPropFunType = 3;
		_xbs_dtPropFunOverrideSrc = pClass._func[dtpropfunName];
		if ((scope == 7) || (scope == 15) || ((scope != 7) && (scope != 15) && (override == false) && (isData == false)))
			if ((scope & pClass._func[dtpropfunName].level) == pClass._func[dtpropfunName].level)
				return(true);
	}
	// Exists in local properties
	if (pClass._prop[dtpropfunName] !== undefined)
	{
		_xbs_dtPropFunType = 2;
		_xbs_dtPropFunOverrideSrc = pClass._prop[dtpropfunName];
		if ((scope == 7) || (scope == 15) || ((scope != 7) && (scope != 15) && (override == false) && (isData == false)))
			if ((scope & pClass._prop[dtpropfunName].level) == pClass._prop[dtpropfunName].level)
				return(true);
	}
	// Exists in local datas
	if (pClass._data[dtpropfunName] !== undefined)
	{
		_xbs_dtPropFunType = 1;
		_xbs_dtPropFunOverrideSrc = pClass._data[dtpropfunName];
		if ((scope & pClass._data[dtpropfunName].level) == pClass._data[dtpropfunName].level)
			return(true);
	}
	// Exists in inheritance
	var scope2 = 0;
	if ((scope & 8) == 8)
	{
		if (scope == 15)
			scope2 = 11;
		else
			scope2 = 9;
	}
	else
	{
		if (scope == 7)
			scope2 = 3;
		else
			scope2 = 1;
	}
	for (var i in pClass._super)
	{
		if (_xbs_dtpropfunExists(pClass._super[i], dtpropfunName, isData, override, scope2) == true)
			return(true);
	}	
	return(false);
}

function newTmpData(pTemplate, dataName, dataProperties) {
	// Get scope : if not in class declaration, reject
	if (_xbs_classScope[0] != '_tmp_'+pTemplate._package._name+'_'+pTemplate._name+'_tmp_')
	{
		internalAlert('[template "'+pTemplate._name+'"] - A data can not be defined outside template definition.');
		return
	}
	if (dataProperties === undefined)
		dataProperties = { level: _xbs_public, static: false };
	if (dataProperties.level === undefined)
		dataProperties.level = _xbs_public;
	if (dataProperties.static === undefined)
		dataProperties.static = false;
	if (dataProperties.level == _xbs_private)
	{
		internalAlert('[template "'+pTemplate._name+'"] - Can not define data "'+dataName+'" as private.');
	}
	else
	{
		var tmpName = prefixReservedName(dataName);
		if (pTemplate._data[tmpName] !== undefined)
		{
			internalAlert('[template "'+pTemplate._name+'"] - Can not redefine "'+dataName+'".');
		}
		else
		{
			pTemplate._data[tmpName] = new Array();
			pTemplate._data[tmpName].level = dataProperties.level;
			pTemplate._data[tmpName].static = dataProperties.static;
		}
	}
}

function newData(pClass, dataName, dataProperties, initValue) {
	// Get scope : if not in class declaration, reject
	if (_xbs_classScope[0] != '_cls_'+pClass._package._name+'_'+pClass._name+'_cls_')
	{
		internalAlert('[class "'+pClass._name+'"] - A data can not be defined outside class definition.');
		return
	}
	if (dataProperties === undefined)
		dataProperties = { level: _xbs_public, static: false };
	if (dataProperties.level === undefined)
		dataProperties.level = _xbs_public;
	if (dataProperties.static === undefined)
		dataProperties.static = false;
	if (pClass._abstract == true)
	{
		internalAlert('[class "'+pClass._name+'"] - Can not define data "'+dataName+'" on an abstract class.');
	}
	else
	{
		_xbs_dtPropFunType = 0;
		_xbs_dtPropFunOverrideSrc = null;
		var tmpName = prefixReservedName(dataName);
		if (_xbs_dtpropfunExists(pClass, tmpName, true) == false)
		{
			pClass._data[tmpName] = new Array();
			pClass._data[tmpName].level = dataProperties.level;
			pClass._data[tmpName].static = dataProperties.static;
			if (dataProperties.static == true)
			{
				pClass._data[tmpName].value = initValue;
			}
			else
			{
				if (initValue !== undefined)
					internalAlert('[class "'+pClass._name+'"] - Warning! Can not initialize non static data "'+dataName+'" in definition. Initialize it in constructor.');
				pClass._data[tmpName].value = null;
			}
		}
		else
		{
			internalAlert('[class "'+pClass._name+'"] - Can not redefine "'+dataName+'".');
		}
	}
}

function newTmpProperty(pTemplate, propName, propProperties, getterLevel, setterLevel) {
	// Get scope : if not in template declaration, reject
	if (_xbs_classScope[0] != '_tmp_'+pTemplate._package._name+'_'+pTemplate._name+'_tmp_')
	{
		internalAlert('[template "'+pTemplate._name+'"] - Can not define property "'+propName+'": a property can not be defined outside template definition.');
		return
	}
	if (propProperties === undefined)
		propProperties = { level: _xbs_public, static: false };
	if (propProperties.level === undefined)
		propProperties.level = _xbs_public;
	if (propProperties.static === undefined)
		propProperties.static = false;
	if (getterLevel === undefined)
		getterLevel = propProperties.level;
	if (setterLevel === undefined)
		setterLevel = propProperties.level;
	if (propProperties.level == 0)
	{
		internalAlert('[template "'+pTemplate._name+'"] - Property "'+propName+'" can not be private.');
	}
	else
	{
		if ((getterLevel < propProperties.level) || (setterLevel < propProperties.level))
		{
			internalAlert('[template "'+pTemplate._name+'"] - level error in property "'+propName+'": the accessibility of a getter or a setter can not be wider than the property level.');
		}
		else
		{
			var tmpName = prefixReservedName(propName);
			if (pTemplate._prop[tmpName] === undefined)
			{
				pTemplate._prop[tmpName] = new Array();
				pTemplate._prop[tmpName].level = propProperties.level;
				pTemplate._prop[tmpName].static = propProperties.static;
				pTemplate._prop[tmpName].getter = getterLevel;
				pTemplate._prop[tmpName].setter = setterLevel;
			}
			else
			{
				internalAlert('[template "'+pTemplate._name+'"] - Can not redefine "'+propName+'".');
			}
		}
	}
}

function newProperty(pClass, propName, propProperties, getterLevel, getter, setterLevel, setter) {
	// Get scope : if not in class declaration, reject
	if (_xbs_classScope[0] != '_cls_'+pClass._package._name+'_'+pClass._name+'_cls_')
	{
		internalAlert('[class "'+pClass._name+'"] - Can not define property "'+propName+'": a property can not be defined outside class definition.');
		return
	}
	if (propProperties === undefined)
		propProperties = { level: _xbs_public, static: false, abstract: false, override: false };
	if (propProperties.level === undefined)
		propProperties.level = _xbs_public;
	if (propProperties.static === undefined)
		propProperties.static = false;
	if (propProperties.override === undefined)
		propProperties.override = false;
	if (propProperties.abstract === undefined)
		propProperties.abstract = false;
	if (getterLevel === undefined)
		getterLevel = propProperties.level;
	if (setterLevel === undefined)
		setterLevel = propProperties.level;
	if ((pClass._abstract == true) && (propProperties.abstract == false))
	{
		internalAlert('[class "'+pClass._name+'"] - Can not define non abstract property "'+propName+'" on an abstract class.');
	}
	else
	{
		if ((pClass._static == true) && (propProperties.static == false))
		{
			internalAlert('[class "'+pClass._name+'"] - Can not define non static property "'+propName+'" on a static class.');
		}
		else
		{
			if ((propProperties.level == _xbs_private) && (propProperties.abstract == true))
			{
				internalAlert('[class "'+pClass._name+'"] - Property "'+propName+'" can not be abstract and private.');
			}
			else
			{
				if ((getterLevel < propProperties.level) || (setterLevel < propProperties.level))
				{
					internalAlert('[class "'+pClass._name+'"] - level error in property "'+propName+'": the accessibility of a getter or a setter can not be wider than the property level.');
				}
				else
				{
					_xbs_dtPropFunType = 0;
					_xbs_dtPropFunOverrideSrc = null;
					var tmpName = prefixReservedName(propName);
					var result = _xbs_dtpropfunExists(pClass, tmpName, false, propProperties.override);
					if (result == false)
					{
						if (propProperties.override == true)
						{
							if (_xbs_dtPropFunType == 0)
							{
								internalAlert('[class "'+pClass._name+'"] - Can not override "'+propName+'": it is unknown.');
								return;
							}
							if (_xbs_dtPropFunType != 2)
							{
								internalAlert('[class "'+pClass._name+'"] - Can not override "'+propName+'": it is not a property.');
								return;
							}
							if (_xbs_dtPropFunOverrideSrc.static != propProperties.static)
							{
								if (_xbs_dtPropFunOverrideSrc.static == true)
									internalAlert('[class "'+pClass._name+'"] - Can not override "'+propName+'": can not change static to non static.');
								else
									internalAlert('[class "'+pClass._name+'"] - Can not override "'+propName+'": can not change non static to static.');
								return;
							}
							if (propProperties.abstract == true)
							{
								internalAlert('[class "'+pClass._name+'"] - Can not override "'+propName+'": override property can not be abstract.');
								return;
							}
							if (_xbs_dtPropFunOverrideSrc.level > propProperties.level)
							{
								internalAlert('[class "'+pClass._name+'"] - Can not override "'+propName+'": accessibility can not be wider than overrided.');
								return;
							}
						}
						// Exclude reserved properties and method of Array object
						pClass._prop[tmpName] = new Array();
						pClass._prop[tmpName].level = propProperties.level;
						pClass._prop[tmpName].static = propProperties.static;
						pClass._prop[tmpName].abstract = propProperties.abstract;
						pClass._prop[tmpName].override = propProperties.override;
						pClass._prop[tmpName].getter = new Array();
						pClass._prop[tmpName].getter.level = getterLevel;
						if (getter === undefined)
							pClass._prop[tmpName].getter.func = null;
						else
							pClass._prop[tmpName].getter.func = getter;
						pClass._prop[tmpName].setter = new Array();
						pClass._prop[tmpName].setter.level = setterLevel;
						if (setter === undefined)
							pClass._prop[tmpName].setter.func = null;
						else
							pClass._prop[tmpName].setter.func = setter;
						pClass._prop[tmpName].scope = pClass;
					}
					else
					{
						internalAlert('[class "'+pClass._name+'"] - Can not redefine "'+propName+'".');
					}
				}
			}
		}
	}
}

function newTmpFunction(pTemplate, funcName, funcProperties) {
	// Get scope : if not in template declaration, reject
	if (_xbs_classScope[0] != '_tmp_'+pTemplate._package._name+'_'+pTemplate._name+'_tmp_')
	{
		internalAlert('[template "'+pTemplate._name+'"] - Can not create function "'+funcName+'": a function can not be defined outside template definition.');
		return
	}
	if (funcProperties === undefined)
		funcProperties = { level: _xbs_public, static: false };
	if (funcProperties.level === undefined)
		funcProperties.level = _xbs_public;
	if (funcProperties.static === undefined)
		funcProperties.static = false;
	if (funcProperties.level == _xbs_private)
	{
		internalAlert('[template "'+pTemplate._name+'"] - Function "'+funcName+'" can not be private.');
	}
	else
	{
		var tmpName = prefixReservedName(funcName);
		if (pTemplate._func[tmpName] === undefined)
		{
			pTemplate._func[tmpName] = new Array();
			pTemplate._func[tmpName].level = funcProperties.level;
			pTemplate._func[tmpName].static = funcProperties.static;
		}
		else
		{
			internalAlert('[template "'+pTemplate._name+'"] - Can not redefine "'+funcName+'".');
		}
	}
}

function newFunction(pClass, funcName, funcProperties, funcDef) {
	// Get scope : if not in class declaration, reject
	if (_xbs_classScope[0] != '_cls_'+pClass._package._name+'_'+pClass._name+'_cls_')
	{
		internalAlert('[class "'+pClass._name+'"] - Can not create function "'+funcName+'": a function can not be defined outside class definition.');
		return
	}
	if (funcProperties === undefined)
		funcProperties = { level: _xbs_public, static: false, abstract: false, override: false };
	if (funcProperties.level === undefined)
		funcProperties.level = _xbs_public;
	if (funcProperties.static === undefined)
		funcProperties.static = false;
	if (funcProperties.abstract === undefined)
		funcProperties.abstract = false;
	if (funcProperties.override === undefined)
		funcProperties.override = false;
	if ((pClass._abstract == true) && (funcProperties.abstract == false))
	{
		internalAlert('[class "'+pClass._name+'"] - Can not define non abstract function "'+funcName+'" on an abstract class.');
	}
	else
	{
		if ((pClass._static == true) && (funcProperties.static == false))
		{
			internalAlert('[class "'+pClass._name+'"] - Can not define non static function "'+funcName+'" on a static class.');
		}
		else
		{
			if ((funcProperties.level == _xbs_private) && (funcProperties.abstract == true))
			{
				internalAlert('[class "'+pClass._name+'"] - Function "'+funcName+'" can not be abstract and private.');
			}
			else
			{
				_xbs_dtPropFunType = 0;
				_xbs_dtPropFunOverrideSrc = null;
				var tmpName = prefixReservedName(funcName);
				var result = _xbs_dtpropfunExists(pClass, tmpName, false, funcProperties.override);
				if (result == false)
				{
					if ((funcProperties.override == true) && (funcName != '_constructor') && (funcName != '_destructor'))
					{
						if (_xbs_dtPropFunType == 0)
						{
							internalAlert('[class "'+pClass._name+'"] - Can not override "'+funcName+'": it is unknown.');
							return;
						}
						if (_xbs_dtPropFunType != 3)
						{
							internalAlert('[class "'+pClass._name+'"] - Can not override "'+funcName+'": it is not a function.');
							return;
						}
						if (_xbs_dtPropFunOverrideSrc.static != funcProperties.static)
						{
							if (_xbs_dtPropFunOverrideSrc.static == true)
								internalAlert('[class "'+pClass._name+'"] - Can not override "'+funcName+'": can not change static to non static.');
							else
								internalAlert('[class "'+pClass._name+'"] - Can not override "'+funcName+'": can not change non static to static.');
							return;
						}
						if (funcProperties.abstract == true)
						{
							internalAlert('[class "'+pClass._name+'"] - Can not override "'+funcName+'": override function can not be abstract.');
							return;
						}
						if (_xbs_dtPropFunOverrideSrc.level > funcProperties.level)
						{
							internalAlert('[class "'+pClass._name+'"] - Can not override "'+funcName+'": accessibility can not be wider than overrided.');
							return;
						}
					}
					pClass._func[tmpName] = new Array();
					pClass._func[tmpName].level = funcProperties.level;
					pClass._func[tmpName].static = funcProperties.static;
					pClass._func[tmpName].abstract = funcProperties.abstract;
					pClass._func[tmpName].override = funcProperties.override;
					pClass._func[tmpName].func = funcDef;
					pClass._func[tmpName].scope = pClass;
				}
				else
				{
					internalAlert('[class "'+pClass._name+'"] - Can not redefine "'+funcName+'".');
				}
			}
		}
	}
}

function _xbs_eventExists(pClass, eventName, override, scope) {
	if (override === undefined) override = false;
	if (scope === undefined) scope = 7;
	// Exists in local
	if (pClass._event[eventName] !== undefined)
	{
		if ((scope == 7) || (scope == 15) || ((scope != 7) && (scope != 15) && (override == false)))
			if ((scope & pClass._event[eventName].level) == pClass._event[eventName].level)
				return(true);
	}
	// Exists in inheritance
	var scope2 = 0;
	if ((scope & 8) == 8)
	{
		if (scope == 15)
			scope2 = 11;
		else
			scope2 = 9;
	}
	else
	{
		if (scope == 7)
			scope2 = 3;
		else
			scope2 = 1;
	}
	for (var i in pClass._super)
	{
		if (_xbs_eventExists(pClass._super[i], eventName, override, scope2) == true)
			return(true);
	}	
	return(false);
}

function newTmpEvent(pTemplate, eventName, eventProperties) {
	// Get scope : if not in template declaration, reject
	if (_xbs_classScope[0] != '_tmp_'+pTemplate._package._name+'_'+pTemplate._name+'_tmp_')
	{
		internalAlert('[template "'+pTemplate._name+'"] - Can not create event "'+eventName+'": an event can not be defined outside template definition.');
		return
	}
	if (eventProperties === undefined)
		eventProperties = { level: _xbs_public, static: false };
	if (eventProperties.level === undefined)
		eventProperties.level = _xbs_public;
	if (eventProperties.static === undefined)
		eventProperties.static = false;
	var tmpName = prefixReservedName(eventName);
	if (pTemplate._event[tmpName] === undefined)
	{
		pTemplate._event[tmpName] = new Array();
		pTemplate._event[tmpName].level = eventProperties.level;
		pTemplate._event[tmpName].static = eventProperties.static;
	}
	else
	{
		internalAlert('[template "'+pTemplate._name+'"] - Can not redefine event "'+eventName+'".');
	}
}

function newEvent(pClass, eventName, eventProperties) {
	// Get scope : if not in class declaration, reject
	if (_xbs_classScope[0] != '_cls_'+pClass._package._name+'_'+pClass._name+'_cls_')
	{
		internalAlert('[class "'+pClass._name+'"] - Can not create event "'+eventName+'": an event can not be defined outside class definition.');
		return
	}
	if (eventProperties === undefined)
		eventProperties = { level: _xbs_public, static: false, abstract: false, override: false };
	if (eventProperties.level === undefined)
		eventProperties.level = _xbs_public;
	if (eventProperties.static === undefined)
		eventProperties.static = false;
	if (eventProperties.override === undefined)
		eventProperties.override = false;
	eventProperties.abstract = false;
	if (pClass._abstract == true)
	{
		internalAlert('[class "'+pClass._name+'"] - Can not define event "'+funcName+'" on an abstract class.');
	}
	else
	{
		var tmpName = prefixReservedName(eventName);
		var result = _xbs_eventExists(pClass, tmpName, eventProperties.override);
		if (result == false)
		{
			pClass._event[tmpName] = new Array();
			pClass._event[tmpName].level = eventProperties.level;
			pClass._event[tmpName].static = eventProperties.static;
			pClass._event[tmpName].override = eventProperties.override;
			pClass._event[tmpName].scope = pClass;
			pClass._event[tmpName].active = true;
			pClass._event[tmpName].callers = new Array();
		}
		else
		{
			internalAlert('[class "'+pClass._name+'"] - Can not redefine event "'+eventName+'".');
		}
	}
}

_xbs_dtPropType = 0; // 1 for data, 2 for property
_xbs_propExist = false;

function _xbs_getSDtPropArray(pClass, dtPropName, isGetter, scope) {
	if (scope === undefined) scope = 7;
	// Exists in local properties
	if (pClass._prop[dtPropName] !== undefined)
	{
		_xbs_propExist = true;
		_xbs_dtPropType = 2;
		if (isGetter == true)
		{
			if (((scope & pClass._prop[dtPropName].getter.level) == pClass._prop[dtPropName].getter.level) && (pClass._prop[dtPropName].getter.func != null))
				return(pClass._prop[dtPropName]);
		}
		else
		{
			if (((scope & pClass._prop[dtPropName].setter.level) == pClass._prop[dtPropName].setter.level) && (pClass._prop[dtPropName].setter.func != null))
				return(pClass._prop[dtPropName]);
		}
	}
	// Exists in local datas
	if (pClass._data[dtPropName] !== undefined)
	{
		_xbs_dtPropType = 1;
		if ((scope & pClass._data[dtPropName].level) == pClass._data[dtPropName].level)
			return(pClass._data[dtPropName]);
	}
	// Exists in inheritance
	var scope2 = 0;
	if ((scope & 8) == 8)
	{
		if (scope == 15)
			scope2 = 11;
		else
			scope2 = 9;
	}
	else
	{
		if (scope == 7)
			scope2 = 3;
		else
			scope2 = 1;
	}
	for (var i in pClass._super)
	{
		var result = _xbs_getSDtPropArray(pClass._super[i], dtPropName, isGetter, scope2);
		if (result != null)
			return(result);
	}
	return(null);
}

function _xbs_getSData(pClass, dtPropName) {
	_xbs_dtPropType = 0;
	_xbs_propExist = false;
	var tmpName = prefixReservedName(dtPropName);
	if (pClass._package._name+'.'+pClass._name == _xbs_classScope[0])
		var my_dtProp = _xbs_getSDtPropArray(pClass, tmpName, true, 15);
	else
	{
		if (_xbs_classScope[0] !== undefined)
		{
			if (_xbs_classScope[0].indexOf(pClass._package._name+'.') == 0)
			{
				if (_xbs_directParent(_xbs_classScope[0], pClass._package._name, pClass._name) == true)
					var my_dtProp = _xbs_getSDtPropArray(pClass, tmpName, true, 11);
				else
					var my_dtProp = _xbs_getSDtPropArray(pClass, tmpName, true, 9);
			}
			else
			{
				if (_xbs_directParent(_xbs_classScope[0], pClass._package._name, pClass._name) == true)
					var my_dtProp = _xbs_getSDtPropArray(pClass, tmpName, true, 3);
				else
					var my_dtProp = _xbs_getSDtPropArray(pClass, tmpName, true, 1);
			}
		}
		else
		{
			var my_dtProp = _xbs_getSDtPropArray(pClass, tmpName, true, 1);
		}
	}
	if (my_dtProp != null)
	{
		if (my_dtProp.static == true)
		{
			if (_xbs_dtPropType == 1)
				return(my_dtProp.value);
			if (_xbs_dtPropType == 2)
			{
				var args = new Array();
				//_xbs_callstack.push(pClass._name+'.'+dtPropName);
				_xbs_callstack.push(my_dtProp.scope._name+'::'+tmpName);
				_xbs_classScope.unshift(my_dtProp.scope._package._name+'.'+my_dtProp.scope._name);
				var result = my_dtProp.getter.func.apply(my_dtProp.scope, args)
				_xbs_classScope.shift();
				_xbs_callstack.pop();
				return(result);
			}
		}
		else
		{
			if (_xbs_dtPropType == 1)
				internalAlert('[class "'+pClass._name+'"] - Can not get data "'+dtPropName+'": this is not a static data.');
			if (_xbs_dtPropType == 2)
				internalAlert('[class "'+pClass._name+'"] - Can not get property "'+dtPropName+'": this is not a static property.');
		}
	}
	else
	{
		internalAlert('[class "'+pClass._name+'"] - Unknown static data or property named "'+dtPropName+'".');
	}
	return(null);
}

function _xbs_setSData(pClass, dtPropName, dtPropValue) {
	_xbs_dtPropType = 0;
	_xbs_propExist = false;
	var tmpName = prefixReservedName(dtPropName);
	if (pClass._package._name+'.'+pClass._name == _xbs_classScope[0])
		var my_dtProp = _xbs_getSDtPropArray(pClass, tmpName, false, 15);
	else
	{
		if (_xbs_classScope[0] !== undefined)
		{
			if (_xbs_classScope[0].indexOf(pClass._package._name+'.') == 0)
			{
				if (_xbs_directParent(_xbs_classScope[0], pClass._package._name, pClass._name) == true)
					var my_dtProp = _xbs_getSDtPropArray(pClass, tmpName, false, 11);
				else
					var my_dtProp = _xbs_getSDtPropArray(pClass, tmpName, false, 9);
			}
			else
			{
				if (_xbs_directParent(_xbs_classScope[0], pClass._package._name, pClass._name) == true)
					var my_dtProp = _xbs_getSDtPropArray(pClass, tmpName, false, 3);
				else
					var my_dtProp = _xbs_getSDtPropArray(pClass, tmpName, false, 1);
			}
		}
		else
		{
			var my_dtProp = _xbs_getSDtPropArray(pClass, tmpName, false, 1);
		}
	}
	if (my_dtProp != null)
	{
		if (my_dtProp.static == true)
		{
			if (_xbs_dtPropType == 1)
				my_dtProp.value = dtPropValue;
			if (_xbs_dtPropType == 2)
			{
				var args = new Array();
				args.push(dtPropValue);
				//_xbs_callstack.push(pClass._name+'.'+dtPropName);
				_xbs_callstack.push(my_dtProp.scope._name+'::'+tmpName);
				_xbs_classScope.unshift(my_dtProp.scope._package._name+'.'+my_dtProp.scope._name);
				my_dtProp.setter.func.apply(my_dtProp.scope, args);
				_xbs_classScope.shift();
				_xbs_callstack.pop();
			}
		}
		else
		{
			if (_xbs_dtPropType == 1)
				internalAlert('[class "'+pClass._name+'"] - Can not set data "'+dtPropName+'": this is not a static data.');
			if (_xbs_dtPropType == 2)
				internalAlert('[class "'+pClass._name+'"] - Can not set property "'+dtPropName+'": this is not a static property.');
		}
	}
	else
	{
		if (_xbs_propExist == true)
			internalAlert('[class "'+pClass._name+'"] - Static property named "'+dtPropName+'" is read only, can not set.');
		else
			internalAlert('[class "'+pClass._name+'"] - Unknown static data or property named "'+dtPropName+'".');
	}
}

_xbs_funcRoute = new Array();
_xbs_funcClassname = '';

function _xbs_getFunction(pClass, funcName, scope) {
	if (scope === undefined) scope = 7;
	// Exists in local function
	if (pClass._func[funcName] !== undefined)
	{
		_xbs_funcClassname = pClass._name;
		if ((scope & pClass._func[funcName].level) == pClass._func[funcName].level)
			return(pClass._func[funcName]);
	}
	// Exists in inheritance
	for (var i in pClass._super)
	{
		var scope2 = 0;
		if ((scope & 8) == 8)
		{
			if (scope == 15)
				scope2 = 11;
			else
				scope2 = 9;
		}
		else
		{
			if (scope == 7)
				scope2 = 3;
			else
				scope2 = 1;
		}
		//_xbs_funcRoute.push(pClass._super[i]._name);
		_xbs_funcRoute.push(i);
		var result = _xbs_getFunction(pClass._super[i], funcName, scope2);
		if (result != null)
			return(result);
		_xbs_funcRoute.pop();
	}
	return(null);
}

function _xbs_StaticCall() {
	var args = argsAsArray(_xbs_StaticCall.arguments);
	var pClass = args.shift();
	var funcName = args.shift();
	var tmpName = prefixReservedName(funcName);	
	if (pClass._package._name+'.'+pClass._name == _xbs_classScope[0])
		var my_func = _xbs_getFunction(pClass, tmpName, 15);
	else
	{
		if (_xbs_classScope[0] !== undefined)
		{
			if (_xbs_classScope[0].indexOf(pClass._package._name+'.') == 0)
			{
				if (_xbs_directParent(_xbs_classScope[0], pClass._package._name, pClass._name) == true)
					var my_func = _xbs_getFunction(pClass, tmpName, 11);
				else
					var my_func = _xbs_getFunction(pClass, tmpName, 9);
			}
			else
			{
				if (_xbs_directParent(_xbs_classScope[0], pClass._package._name, pClass._name) == true)
					var my_func = _xbs_getFunction(pClass, tmpName, 3);
				else
					var my_func = _xbs_getFunction(pClass, tmpName, 1);
			}
		}
		else
		{
			var my_func = _xbs_getFunction(pClass, tmpName, 1);
		}
	}
	if (my_func != null)
	{
		if (my_func.abstract == true)
		{
			internalAlert('[class "'+pClass._name+'"] - Can not call function "'+funcName+'": this is an abstract function.');
		}
		else
		{
			if (my_func.static == true)
			{
				//_xbs_callstack.push(pClass._name+'.'+funcName);
				_xbs_callstack.push(my_func.scope._name+'::'+tmpName);
				_xbs_classScope.unshift(my_func.scope._package._name+'.'+my_func.scope._name);
				var result = my_func.func.apply(my_func.scope, args);
				_xbs_classScope.shift();
				_xbs_callstack.pop();
				return(result);
			}
			else
			{
				internalAlert('[class "'+pClass._name+'"] - Can not call function "'+funcName+'": this is not a static function.');
			}
		}
	}
	else
	{
		internalAlert('[class "'+pClass._name+'"] - Unknown function named "'+funcName+'".');
	}
}

function _xbs_isPackClass(pClass, packageName, className) {
	if (packageName.length > 0)
	{
		if ((pClass._name == className) && (pClass._package._name == packageName))
			return(true);
	}
	else
	{
		if (pClass._name == className)
			return(true);
	}
	for (var i in pClass._super)
		if (_xbs_isPackClass(pClass._super[i], packageName, className) == true)
			return(true);
	return(false);
}

function _xbs_isClass(pClass, name) {
	var className = ''
	var packageName = ''
	var i = name.indexOf('.');
	if (i == -1)
	{
		className = name;
	}
	else
	{
		if (i == 0)
		{
			className = name.substr(1);
		}
		else
		{
			packageName = name.substr(0, i);
			className = name.substr(i + 1);
		}
	}
	return(_xbs_isPackClass(pClass, packageName, className));
}

function _xbs_Delete(pInst) {
	var pClass = pInst._class;
	// Call local destructor
	if (pClass._func['_destructor'] !== undefined)
	{
		//_xbs_callstack.push(pClass._name+'('+pInst._id+').destructor');
		_xbs_callstack.push(pInst._class._name+'::destructor');
		_xbs_classScope.unshift(pClass._package._name+'.'+pClass._name);
		pClass._func['_destructor'].func.apply(pInst, new Array());
		_xbs_classScope.shift();
		_xbs_callstack.pop();
	}
	// Inheritance
	for (var i in pInst._super)
		_xbs_Delete(pInst._super[i]);
	// destroy content
	pInst._class = null;
	pInst._data = null;
	pInst._event = null;
	pInst._id = 0;
	pInst._super = null;
	pInst.call = null;
	pInst.delete = null;
	pInst.eventListenerAdd = null;
	pInst.eventListenerRem = null;
	pInts.freezeEvent = null;
	pInts.get = null;
	pInts.isClass = null;
	pInts.raiseEvent = null;
	pInts.set = null;
	pInts.warmEvent = null;
	// Decrement counter on class
	pClass._instances -= 1;
	// Delete object
	delete _xbs_instances[pInst._id];
}

function _xbs_New(pClass, args, inst_id) {
	if (inst_id === undefined) inst_id = -1;
	if (args === undefined) args = new Array();
	if (pClass.abstract == true)
	{
		internalAlert('[class "'+pClass._name+'"] - Can not instanciate an abstract class.');
		return(null);
	}
	else if (pClass._func['_constructor'] === undefined)
	{
		if (inst_id == -1)
			internalAlert('[class "'+pClass._name+'"] - Can not instanciate a class without constructor.');
		else
			internalAlert('[class "'+pClass._name+'"] - Can not inherit a class without constructor.');
		return(null);
	}
	else
	{
		// calculate scope and constructor level
		var valid_constructor = 1;
		if (pClass._package._name+'.'+pClass._name == _xbs_classScope[0])
		{
			valid_constructor = 0;
		}
		else
		{
			if (pClass._func['_constructor'].level == _xbs_public)
			{
				valid_constructor = 0;
			}
			else if (pClass._func['_constructor'].level == _xbs_protected)
			{
				if (inst_id == -1)
					valid_constructor = 1;
				else
					valid_constructor = 0;
			}
			else
			{
				if (inst_id != -1)
					valid_constructor = 2;
			}
			if ((valid_constructor == 1) && (_xbs_classScope[0].indexOf(pClass._package._name+'.') == 0))
			{
				if (pClass._func['_constructor'].level == _xbs_package)
					valid_constructor = 0;
			}
		}
		if (valid_constructor != 0)
		{
			if (valid_constructor == 1)
				internalAlert('[class "'+pClass._name+'"] - Can not instanciate the class: constructor is not public.');
			if (valid_constructor == 2)
				internalAlert('[class "'+pClass._name+'"] - Can not inherit class: constructor is private.');
			return(null);
		}
		else
		{
			var old_inst_id = inst_id;
			if (inst_id == -1)
			{
				_xbs_instancesIdCnt++;
				_xbs_instances[_xbs_instancesIdCnt] = new Object;	
				var pInst = _xbs_instances[_xbs_instancesIdCnt];
				pInst._id = _xbs_instancesIdCnt;
				inst_id = pInst._id;
			}
			else
			{
				var pInst = new Object;
				pInst._id = inst_id;
			}
			pInst._class = pClass;
			pInst._super = new Array();
			pInst._data = new Array();
			pInst._event = new Array();
			// OOP Functions
			pInst.delete = function() {
				_xbs_Delete(this);
			};
			pInst.get = function(dataName) {
				return(_xbs_getData(this, dataName));
			};
			pInst.set = function(dataName, dataValue) {
				_xbs_setData(this, dataName, dataValue);
			};
			pInst.call = function() {
				var args = argsAsArray(this.call.arguments);
				args.unshift(this);
				return(_xbs_Call.apply(_xbs_jso, args));
			};
			pInst.eventListenerAdd = function(eventName, pCallObj, pCallFunc) {
				eventListenerAdd(this, eventName, pCallObj, pCallFunc);
			};
			pInst.eventListenerRem = function(eventName, pCallObj, pCallFunc) {
				eventListenerRem(this, eventName, pCallObj, pCallFunc);
			};
			pInst.raiseEvent = function(eventName, eventDatas) {
				return(raiseEvent(this, eventName, eventDatas));
			};
			pInst.freezeEvent = function(eventName) {
				freezeEvent(this, eventName);
			};
			pInst.warmEvent = function(eventName) {
				warmEvent(this, eventName);
			};
			pInst.isClass = function(className) {
				return(_xbs_isClass(this._class, className));
			};
			// Inheritance
			for (var i in pClass._super)
			{
				var tmpArgs = new Array();
				// If params to transmit to superclass constructor build the args
				if (pClass._func['_constructor'] !== undefined)
				{
					if (pClass._func['_constructor'].super[i] !== undefined)
					{
						for (var j = 0;j < pClass._func['_constructor'].super[i].length;j++)
						{
							if (isArray(pClass._func['_constructor'].super[i][j]) == true)
								tmpArgs.push(pClass._func['_constructor'].super[i][j][0]);
							else
								tmpArgs.push(args[pClass._func['_constructor'].super[i][j]]);
						}
					}
				}
				pInst._super[i] = _xbs_New(pClass._super[i], tmpArgs, inst_id);
			}
			// Create datas
			for (var i in pClass._data)
			{
				if (pClass._data[i].static == false)
					pInst._data[i] = pClass._data[i].value;
			}
			// Create events
			for (var i in pClass._event)
			{
				if (pClass._event[i].static == false)
				{
					pInst._event[i] = new Array();
					pInst._event[i].active = true;
					pInst._event[i].caller = new Array();
				}
			}

			// Call constructor
			if (pClass._func['_constructor'] !== undefined)
			{
				//_xbs_callstack.push(pClass._name+'('+pInst._id+').constructor');
				_xbs_callstack.push(pInst._class._name+'::constructor');
				_xbs_classScope.unshift(pClass._package._name+'.'+pClass._name);
				pClass._func['_constructor'].func.apply(pInst, args);
				_xbs_classScope.shift();
				_xbs_callstack.pop();
			}
			
			// Add counter of instances for the class
			pClass._instances += 1;
			
			return(pInst);
		}
	}
}

function xblNew() {
	var args = argsAsArray(xblNew.arguments);
	var pClass = args.shift();
	if (isString(pClass) == true)
	{
		var new_package = '';
		var new_class = '';
		var i = pClass.indexOf('.');
		if (i == -1)
		{
			new_class = pClass;
		}
		else
		{
			if (i == 0)
			{
				new_class = pClass.substr(1);
			}
			else
			{
				new_package = pClass.substr(0, i);
				new_class = pClass.substr(i + 1);
			}
		}
		if ((_xbs_jso[new_class] === undefined) || (_xbs_jso[new_class]._name === undefined))
		{
			var found = false
			var j = 0;
			for (i = 0;(found == false) && (i < _xbs_classes.length);i++)
			{
				if (_xbs_classes[i]._name == new_class)
				{
					if ((new_package.length > 0) && (_xbs_classes[i]._package._name == new_package))
					{
						var pClass = _xbs_classes[i];
						found = true;
					}
				}
			}
			if (found == false)
			{
				// Get package scope
				if (_xbs_classScope[0])
				{
					var currPackScope = '';
					if (_xbs_classScope[0].indexOf('_pk_') == 0)
					{
						currPackScope = _xbs_classScope[0].substr(4, _xbs_classScope[0].length - 8);
					}
					else
					{
						var i = _xbs_classScope[0].indexOf('.');
						if (i > 0)
							currPackScope = _xbs_classScope[0].substr(0, i);
					}
					if (new_package.length > 0)
					{
						if (currPackScope == new_package)
						{
							if (_xbs_jso[new_package]._classes[new_class] !== undefined)
							{
								var pClass = _xbs_jso[new_package]._classes[new_class];
								found = true;
							}
						}
					}
					else
					{
						if ((currPackScope.length > 0) && (_xbs_jso[currPackScope]._classes[new_class] !== undefined))
						{
							var pClass = _xbs_jso[currPackScope]._classes[new_class];
							found = true;
						}
					}
				}
			}
			if (found == false)
			{
				if (new_package.length > 0)
					internalAlert('Unknown class "'+new_class+'" in "'+new_package+'": can not instanciate.');
				else
					internalAlert('Unknown class "'+new_class+'": can not instanciate.');
				return(null);
			}
		}
		else
		{
			var pClass = _xbs_jso[new_class];
		}
	}
	var pInst = _xbs_New(pClass, args);
	// send event oninstanciated
	pInst.raiseEvent('_xbs_oninstanciated', new Array());
	return(pInst);
}

_xbs_dtPropRoute = new Array();
_xbs_dtPropClassname = '';

function _xbs_getDtPropArray(pClass, dtPropName, isGetter, scope) {
	if (scope === undefined) scope = 7;
	// Exists in local properties
	if (pClass._prop[dtPropName] !== undefined)
	{
		_xbs_propExist = true;
		_xbs_dtPropType = 2;
		_xbs_dtPropClassname = pClass._name;
		if (isGetter == true)
		{
			if (((scope & pClass._prop[dtPropName].getter.level) == pClass._prop[dtPropName].getter.level) && (pClass._prop[dtPropName].getter.func != null))
				return(pClass._prop[dtPropName]);
		}
		else
		{
			if (((scope & pClass._prop[dtPropName].setter.level) == pClass._prop[dtPropName].setter.level) && (pClass._prop[dtPropName].setter.func != null))
				return(pClass._prop[dtPropName]);
		}
	}
	// Exists in local datas
	if (pClass._data[dtPropName] !== undefined)
	{
		_xbs_dtPropType = 1;
		_xbs_dtPropClassname = pClass._name;
		if ((scope & pClass._data[dtPropName].level) == pClass._data[dtPropName].level)
			return(pClass._data[dtPropName]);
	}
	// Exists in local consts
	if (pClass[dtPropName] !== undefined)
	{
		_xbs_dtPropType = 3;
		_xbs_dtPropClassname = pClass._name;
		return(pClass[dtPropName]);
	}
	// Exists in inheritance
	var scope2 = 0;
	if ((scope & 8) == 8)
	{
		if (scope == 15)
			scope2 = 11;
		else
			scope2 = 9;
	}
	else
	{
		if (scope == 7)
			scope2 = 3;
		else
			scope2 = 1;
	}
	for (var i in pClass._super)
	{
		//_xbs_dtPropRoute.push(pClass._super[i]._name);
		_xbs_dtPropRoute.push(i);
		var result = _xbs_getDtPropArray(pClass._super[i], dtPropName, isGetter, scope2);
		if (result != null)
			return(result);
		_xbs_dtPropRoute.pop();
	}
	return(null);
}

function _xbs_getDtPropStore(pInst)
{
	if (_xbs_dtPropRoute.length == 0)
		return(pInst);
	var pClass2 = _xbs_dtPropRoute.shift();
	var pInst2 = pInst._super[pClass2];
	return(_xbs_getDtPropStore(pInst2));
}

function _xbs_getData(pInst, dtPropName) {
	_xbs_dtPropType = 0;
	_xbs_propExist = false;
	_xbs_dtPropRoute = new Array();
	_xbs_dtPropClassname = null;
	var tmpName = prefixReservedName(dtPropName);	
	var pClass = pInst._class;
	if (pClass._package._name+'.'+pClass._name == _xbs_classScope[0])
		var my_dtProp = _xbs_getDtPropArray(pClass, tmpName, true, 15);
	else
	{
		if (_xbs_classScope[0].indexOf(pClass._package._name+'.') == 0)
		{
			if (_xbs_directParent(_xbs_classScope[0], pClass._package._name, pClass._name) == true)
				var my_dtProp = _xbs_getDtPropArray(pClass, tmpName, true, 11);
			else
				var my_dtProp = _xbs_getDtPropArray(pClass, tmpName, true, 9);
		}
		else
		{
			if (_xbs_directParent(_xbs_classScope[0], pClass._package._name, pClass._name) == true)
				var my_dtProp = _xbs_getDtPropArray(pClass, tmpName, true, 3);
			else
				var my_dtProp = _xbs_getDtPropArray(pClass, tmpName, true, 1);
		}
	}
	if (my_dtProp != null)
	{
		if (_xbs_dtPropType == 3)
		{
			return(my_dtProp);
		}
		else
		{
			if (my_dtProp.static == false)
			{
				if (_xbs_dtPropType == 1)
				{
					var pDataInst = _xbs_getDtPropStore(pInst);
					return(pDataInst._data[tmpName]);
				}
				if (_xbs_dtPropType == 2)
				{
					var pPropInst = _xbs_getDtPropStore(pInst);
					var args = new Array();
					//_xbs_callstack.push(pClass._name+'('+pInst._id+').'+dtPropName);
					_xbs_callstack.push(pPropInst._class._name+'::'+tmpName);
					_xbs_classScope.unshift(my_dtProp.scope._package._name+'.'+my_dtProp.scope._name);
					result = my_dtProp.getter.func.apply(pPropInst, args);
					_xbs_classScope.shift();
					_xbs_callstack.pop();
					return(result);
				}
			}
			else
			{
				if (_xbs_dtPropType == 1)
					internalAlert('[class "'+pClass._name+'"] - Can not get data "'+dtPropName+'": this is a static data.');
				if (_xbs_dtPropType == 2)
					internalAlert('[class "'+pClass._name+'"] - Can not get property "'+dtPropName+'": this is a static property.');
			}
		}
	}
	else
	{
		internalAlert('[class "'+pClass._name+'"] - Unknown data or property named "'+dtPropName+'".');
	}
	return(null);
}

function _xbs_setData(pInst, dtPropName, dtPropValue) {
	_xbs_dtPropType = 0;
	_xbs_propExist = false;
	_xbs_dtPropRoute = new Array();
	_xbs_dtPropClassname = null;
	var tmpName = prefixReservedName(dtPropName);
	var pClass = pInst._class;
	if (pClass._package._name+'.'+pClass._name == _xbs_classScope[0])
		var my_dtProp = _xbs_getDtPropArray(pClass, tmpName, false, 15);
	else
	{
		if (_xbs_classScope[0].indexOf(pClass._package._name+'.') == 0)
		{
			if (_xbs_directParent(_xbs_classScope[0], pClass._package._name, pClass._name) == true)
				var my_dtProp = _xbs_getDtPropArray(pClass, tmpName, false, 11);
			else
				var my_dtProp = _xbs_getDtPropArray(pClass, tmpName, false, 9);
		}
		else
		{
			if (_xbs_directParent(_xbs_classScope[0], pClass._package._name, pClass._name) == true)
				var my_dtProp = _xbs_getDtPropArray(pClass, tmpName, false, 3);
			else
				var my_dtProp = _xbs_getDtPropArray(pClass, tmpName, false, 1);
		}
	}
	if (my_dtProp != null)
	{
		if (my_dtProp.static == false)
		{
			if (_xbs_dtPropType == 1)
			{
				var pDataInst = _xbs_getDtPropStore(pInst);
				pDataInst._data[tmpName] = dtPropValue;
			}
			if (_xbs_dtPropType == 2)
			{
				var pPropInst = _xbs_getDtPropStore(pInst);
				var args = new Array();
				args.push(dtPropValue);
				//_xbs_callstack.push(pClass._name+'('+pInst._id+').'+dtPropName);
				_xbs_callstack.push(pPropInst._class._name+'::'+tmpName);
				_xbs_classScope.unshift(my_dtProp.scope._package._name+'.'+my_dtProp.scope._name);
				my_dtProp.setter.func.apply(pPropInst, args);
				_xbs_classScope.shift();
				_xbs_callstack.pop();
			}
		}
		else
		{
			if (_xbs_dtPropType == 1)
				internalAlert('[class "'+pClass._name+'"] - Can not set data "'+dtPropName+'": this is a static data.');
			if (_xbs_dtPropType == 2)
				internalAlert('[class "'+pClass._name+'"] - Can not set property "'+dtPropName+'": this is a static property.');
		}
	}
	else
	{
		if (_xbs_propExist == true)
			internalAlert('[class "'+pClass._name+'"] - Property named "'+dtPropName+'" is read only, can not set.');
		else
			internalAlert('[class "'+pClass._name+'"] - Unknown data or property named "'+dtPropName+'".');
	}
}

function _xbs_getFuncStore(pInst)
{
	if (_xbs_funcRoute.length == 0)
		return(pInst);
	var pClass2 = _xbs_funcRoute.shift();
	var pInst2 = pInst._super[pClass2];
	return(_xbs_getFuncStore(pInst2));
}

function _xbs_Call() {
	var args = argsAsArray(_xbs_Call.arguments);
	var pInst = args.shift();
	var pClass = pInst._class;
	var funcName = args.shift();
	_xbs_funcRoute = new Array();
	_xbs_funcClassname = null;
	var tmpName = prefixReservedName(funcName);
	if (pClass._package._name+'.'+pClass._name == _xbs_classScope[0])
		var my_func = _xbs_getFunction(pClass, tmpName, 15);
	else
	{
		if (_xbs_classScope[0].indexOf(pClass._package._name+'.') == 0)
		{
			if (_xbs_directParent(_xbs_classScope[0], pClass._package._name, pClass._name) == true)
				var my_func = _xbs_getFunction(pClass, tmpName, 11);
			else
				var my_func = _xbs_getFunction(pClass, tmpName, 9);
		}
		else
		{
			if (_xbs_directParent(_xbs_classScope[0], pClass._package._name, pClass._name) == true)
				var my_func = _xbs_getFunction(pClass, tmpName, 3);
			else
				var my_func = _xbs_getFunction(pClass, tmpName, 1);
		}
	}
	if (my_func != null)
	{
		if (my_func.abstract == true)
		{
			internalAlert('[class "'+pClass._name+'"] - Can not call function "'+funcName+'": this is an abstract function.');
		}
		else
		{
			if (my_func.static == false)
			{
				var pFuncInst = _xbs_getFuncStore(pInst);
				//_xbs_callstack.push(pClass._name+'('+pInst._id+').'+funcName);
				_xbs_callstack.push(pFuncInst._class._name+'::'+tmpName);
				_xbs_classScope.unshift(my_func.scope._package._name+'.'+my_func.scope._name);
				var result = my_func.func.apply(pFuncInst, args);
				//my_func.func.apply(pInst, args);
				_xbs_classScope.shift();
				_xbs_callstack.pop();
				return(result);
			}
			else
			{
				internalAlert('[class "'+pClass._name+'"] - Can not call function "'+funcName+'": this is a static function.');
			}
		}
	}
	else
	{
		internalAlert('[class "'+pClass._name+'"] - Unknown function named "'+funcName+'".');
	}
}

_xbs_eventRoute = new Array();

function _xbs_getEvent(pClass, eventName, scope) {
	if (scope === undefined) scope = 7;
	// Exists in local datas
	if (pClass._event[eventName] !== undefined)
	{
		if ((scope & pClass._event[eventName].level) == pClass._event[eventName].level)
			return(pClass._event[eventName]);
	}
	// Exists in inheritance ?
	var scope2 = 0;
	if ((scope & 8) == 8)
	{
		if (scope == 15)
			scope2 = 11;
		else
			scope2 = 9;
	}
	else
	{
		if (scope == 7)
			scope2 = 3;
		else
			scope2 = 1;
	}
	for (var i in pClass._super)
	{
		//_xbs_eventRoute.push(pClass._super[i]._name);
		_xbs_eventRoute.push(i);
		var result = _xbs_getEvent(pClass._super[i], eventName, scope2);
		if (result != null)
			return(result);
		_xbs_eventRoute.pop();
	}
	return(null);
}

function _xbs_getEventStore(pInst)
{
	if (_xbs_eventRoute.length == 0)
		return(pInst);
	var pClass2 = _xbs_eventRoute.shift();
	var pInst2 = pInst._super[pClass2];
	return(_xbs_getEventStore(pInst2));
}

function eventListenerAdd(pEvtObj, eventName, pCallObj, pCallFunc) {
	_xbs_eventRoute = new Array();
	var tmpName = prefixReservedName(eventName);
	if (pEvtObj._class !== undefined)
	{ // Instance : non static event only
		var my_event = _xbs_getEvent(pEvtObj._class, tmpName);
		if (my_event != null)
		{
			if (my_event.static == false)
			{
				var pEventInst = _xbs_getEventStore(pEvtObj);
				if (pCallObj._class !== undefined)
				{ // Instance
					var callKey = pCallObj._id+'.'+pCallObj._class._name+'.'+pCallFunc;
					if (pEventInst._event[tmpName].caller[callKey] === undefined)
					{
						pEventInst._event[tmpName].caller[callKey] = new Array();
						var tmpCall = pEventInst._event[tmpName].caller[callKey];
						tmpCall['obj'] = pCallObj;
						tmpCall['func'] = pCallFunc;
						if (pCallObj._class._package._name+'.'+pCallObj._class._name == _xbs_classScope[0])
							tmpCall['scope'] = pCallObj._class._package._name+'.'+pCallObj._class._name;
						else
							tmpCall['scope'] = '';
					}
					else
					{
						// Need an exception
						internalAlert('[class "'+pEvtObj._class._name+'"] - Can not redefine callback on event "'+eventName+'".');
					}
				}
				else
				{ // Class
					var callKey = pCallObj._name+'.'+pCallFunc;
					if (pEventInst._event[tmpName].caller[callKey] === undefined)
					{
						pEventInst._event[tmpName].caller[callKey] = new Array();
						var tmpCall = pEventInst._event[tmpName].caller[callKey];
						tmpCall['obj'] = pCallObj;
						tmpCall['func'] = pCallFunc;
						if (pCallObj._package._name+'.'+pCallObj._name == _xbs_classScope[0])
							tmpCall['scope'] = pCallObj._package._name+'.'+pCallObj._name;
						else
							tmpCall['scope'] = '';
					}
					else
					{
						// Need an exception
						internalAlert('[class "'+pEvtObj._class._name+'"] - Can not redefine callback on event "'+eventName+'".');
					}
				}
			}
			else
			{
				internalAlert('[class "'+pEvtObj._class._name+'"] - Can not trap event "'+eventName+'": this is a static event.');
			}
		}
		else
		{
			internalAlert('[class "'+pEvtObj._class._name+'"] - Unknown event "'+eventName+'".');
		}
	}
	else
	{ // Class : static event only
		var my_event = _xbs_getEvent(pEvtObj, tmpName);
		if (my_event != null)
		{
			if (my_event.static == true)
			{
				if (pCallObj._class !== undefined)
				{ // Instance
					var callKey = pCallObj._id+'.'+pCallObj._class._name+'.'+pCallFunc;
					if (my_event.callers[callKey] === undefined)
					{
						my_event.callers[callKey] = new Array();
						var tmpCall = my_event.callers[callKey];
						tmpCall['obj'] = pCallObj;
						tmpCall['func'] = pCallFunc;
						if (pCallObj._class._package._name+'.'+pCallObj._class._name == _xbs_classScope[0])
							tmpCall['scope'] = pCallObj._class._package._name+'.'+pCallObj._class._name;
						else
							tmpCall['scope'] = '';
					}
					else
					{
						// Need an exception
						internalAlert('[class "'+pEvtObj._name+'"] - Can not redefine callback on event "'+eventName+'".');
					}
				}
				else
				{ // Class
					var callKey = pCallObj._name+'.'+pCallFunc;
					if (my_event.callers[callKey] === undefined)
					{
						my_event.callers[callKey] = new Array();
						var tmpCall = my_event.callers[callKey];
						tmpCall['obj'] = pCallObj;
						tmpCall['func'] = pCallFunc;
						if (pCallObj._package._name+'.'+pCallObj._name == _xbs_classScope[0])
							tmpCall['scope'] = pCallObj._package._name+'.'+pCallObj._name;
						else
							tmpCall['scope'] = '';
					}
					else
					{
						// Need an exception
						internalAlert('[class "'+pEvtObj._name+'"] - Can not redefine callback on event "'+eventName+'".');
					}
				}
			}
			else
			{
				internalAlert('[class "'+pEvtObj._name+'"] - Can not trap event "'+eventName+'": this is not a static event.');
			}
		}
		else
		{
			internalAlert('[class "'+pEvtObj._name+'"] - Unknown event "'+eventName+'".');
		}
	}
}

function eventListenerRem(pEvtObj, eventName, pCallObj, pCallFunc) {
	_xbs_eventRoute = new Array();
	var tmpName = prefixReservedName(eventName);
	if (pEvtObj._class !== undefined)
	{ // Instance : non static event only
		var my_event = _xbs_getEvent(pEvtObj._class, tmpName);
		if (my_event != null)
		{
			if (my_event.static == false)
			{
				var pEventInst = _xbs_getEventStore(pEvtObj);
				var callKey = pCallObj._id+'.'+pCallObj._class._name+'.'+pCallFunc;
				if (pEventInst._event[tmpName].caller[callKey] !== undefined)
				{
					delete pEventInst._event[tmpName].caller[callKey];
				}
				else
				{
					// Need an exception
					internalAlert('[class "'+pEvtObj._class._name+'"] - Can not remove callback on event "'+eventName+'": callback do not exists.');
				}
			}
			else
			{
				internalAlert('[class "'+pEvtObj._class._name+'"] - Can not trap event "'+eventName+'": this is a static event.');
			}
		}
		else
		{
			internalAlert('[class "'+pEvtObj._class._name+'"] - Unknown event "'+eventName+'".');
		}
	}
	else
	{ // Class : static event only
		var my_event = _xbs_getEvent(pEvtObj, tmpName);
		if (my_event != null)
		{
			if (my_event.static == true)
			{
				var callKey = pCallObj._id+'.'+pCallObj._class._name+'.'+pCallFunc;
				if (my_event.callers[callKey] !== undefined)
				{
					delete my_event.callers[callKey];
				}
				else
				{
					// Need an exception
					internalAlert('[class "'+pEvtObj._name+'"] - Can not remove callback on event "'+eventName+'": callback do not exists.');
				}
			}
			else
			{
				internalAlert('[class "'+pEvtObj._name+'"] - Can not trap event "'+eventName+'": this is not a static event.');
			}
		}
		else
		{
			internalAlert('[class "'+pEvtObj._name+'"] - Unknown event "'+eventName+'".');
		}
	}
}

function raiseEvent(pEvtObj, eventName, eventObj) {
	var result
	if (eventObj === undefined)
		eventObj = new Array();
	if (eventObj.stop === undefined)
		eventObj.stop = false
	eventObj._name = eventName;
	// get the object from instance to have the lower child in inheritance tree
	eventObj._raiser = _xbs_instances[pEvtObj._id];
	//eventObj._raiser = pEvtObj;
	_xbs_eventRoute = new Array();
	var tmpName = prefixReservedName(eventName);
	if (pEvtObj._class !== undefined)
	{ // Instance : non static event only
		var my_event = _xbs_getEvent(pEvtObj._class, tmpName);
		if (my_event != null)
		{
			if (my_event.static == false)
			{
				var pEventInst = _xbs_getEventStore(pEvtObj);
				if (pEventInst._event[tmpName].active == true)
				{
					for (var i in pEventInst._event[tmpName].caller)
					{
						var pCallObj = pEventInst._event[tmpName].caller[i]['obj'];
						var pCallFunc = pEventInst._event[tmpName].caller[i]['func'];
						var pCallScope = pEventInst._event[tmpName].caller[i]['scope'];
						if ((pCallScope.length == 0) && (pEvtObj._class !== undefined))
							pCallScope = pEvtObj._class._package._name+'.'+pEvtObj._class._name;
						if (pCallObj._class !== undefined)
						{ // Instance : call
							// Set scope on obj that receive event or caller
							_xbs_classScope.unshift(pCallScope);
							result = _xbs_Call(pCallObj, pCallFunc, eventObj);
							// Remove scope
							_xbs_classScope.shift();
						}
						else
						{ // Call : static call
							// Set scope on obj that receive event
							_xbs_classScope.unshift(pEvtObj._class._package._name+'.'+pEvtObj._class._name);
							result = _xbs_StaticCall(pCallObj, pCallFunc, eventObj);
							// Remove scope
							_xbs_classScope.shift();
						}
						if (result != null)
							eventObj = result
						if (eventObj.stop == true)
							break;
					}
				}
			}
			else
			{
				internalAlert('[class "'+pEvtObj._class._name+'"] - Can not trap event "'+eventName+'": this is a static event.');
			}
		}
		else
		{
			internalAlert('[class "'+pEvtObj._class._name+'"] - Unknown event "'+eventName+'".');
		}
	}
	else
	{ // Class : static event only
		var my_event = _xbs_getEvent(pEvtObj, tmpName);
		if (my_event != null)
		{
			if (my_event.static == true)
			{
				if (my_event.active == true)
				{
					for (var i in my_event.callers)
					{
						var pCallObj = my_event.callers[i]['obj'];
						var pCallFunc = my_event.callers[i]['func'];
						var pCallScope = my_event.callers[i]['scope'];
						if (pCallObj._class !== undefined)
						{ // Instance : call
							// Set scope on obj that receive event
							_xbs_classScope.unshift(pCallScope);
							result = _xbs_Call(pCallObj, pCallFunc, eventObj);
							// Remove scope
							_xbs_classScope.shift();
						}
						else
						{ // Call : static call
							result = _xbs_StaticCall(pCallObj, pCallFunc, eventObj);
						}
						if (result != null)
							eventObj = result
						if (eventObj.stop == true)
							break;
					}
				}
			}
			else
			{
				internalAlert('[class "'+pEvtObj._name+'"] - Can not trap event "'+eventName+'": this is not a static event.');
			}
		}
		else
		{
			internalAlert('[class "'+pEvtObj._name+'"] - Unknown event "'+eventName+'".');
		}
	}
	return(eventObj);
}

function freezeEvent(pEvtObj, eventName) {
	_xbs_eventRoute = new Array();
	var tmpName = prefixReservedName(eventName);
	if (pEvtObj._class !== undefined)
	{ // Instance : non static event only
		var my_event = _xbs_getEvent(pEvtObj._class, tmpName);
		if (my_event != null)
		{
			if (my_event.static == false)
			{
				var pEventInst = _xbs_getEventStore(pEvtObj);
				if (pEventInst._event[tmpName].active == true)
					pEventInst._event[tmpName].active = false;
				else
					internalAlert('[class "'+pEvtObj._class._name+'"] - Can not freeze event "'+eventName+'": this event is already freezed.');
			}
			else
			{
				internalAlert('[class "'+pEvtObj._class._name+'"] - Can not freeze event "'+eventName+'": this is a static event.');
			}
		}
		else
		{
			internalAlert('[class "'+pEvtObj._class._name+'"] - Unknown event "'+eventName+'".');
		}
	}
	else
	{ // Class : static event only
		var my_event = _xbs_getEvent(pEvtObj, tmpName);
		if (my_event != null)
		{
			if (my_event.static == true)
			{
				my_event.active = false;
			}
			else
			{
				internalAlert('[class "'+pEvtObj._name+'"] - Can not freeze event "'+eventName+'": this is not a static event.');
			}
		}
		else
		{
			internalAlert('[class "'+pEvtObj._name+'"] - Unknown event "'+eventName+'".');
		}
	}
}

function warmEvent(pEvtObj, eventName) {
	_xbs_eventRoute = new Array();
	var tmpName = prefixReservedName(eventName);
	if (pEvtObj._class !== undefined)
	{ // Instance : non static event only
		var my_event = _xbs_getEvent(pEvtObj._class, tmpName);
		if (my_event != null)
		{
			if (my_event.static == false)
			{
				var pEventInst = _xbs_getEventStore(pEvtObj);
				if (pEventInst._event[tmpName].active == false)
					pEventInst._event[tmpName].active = true;
				else
					internalAlert('[class "'+pEvtObj._class._name+'"] - Can not warm event "'+eventName+'": this event is active.');
			}
			else
			{
				internalAlert('[class "'+pEvtObj._class._name+'"] - Can not warm event "'+eventName+'": this is a static event.');
			}
		}
		else
		{
			internalAlert('[class "'+pEvtObj._class._name+'"] - Unknown event "'+eventName+'".');
		}
	}
	else
	{ // Class : static event only
		var my_event = _xbs_getEvent(pEvtObj, tmpName);
		if (my_event != null)
		{
			if (my_event.static == true)
			{
				my_event.active = true;
			}
			else
			{
				internalAlert('[class "'+pEvtObj._name+'"] - Can not warm event "'+eventName+'": this is not a static event.');
			}
		}
		else
		{
			internalAlert('[class "'+pEvtObj._name+'"] - Unknown event "'+eventName+'".');
		}
	}
}



//////////////////////////////////////////////////////////////////////////////
// OOP Directives of Classes
//////////////////////////////////////////////////////////////////////////////

// @class [Class]
//   @level public
//   @desc Here, you will find all the Object Oriented Programmation for JavaScript directive that exists on every class.
//   @desc_fre Ici, vous trouverez l'ensemble des directives Orientés Objets que vous trouverez sur l'ensemble des classes.

// @func xblNew
//   @desc Create an instance of the current class.
//   @desc_fre Crée une instance de la classe courante.
//   @return instance
//     @type Object
//     @desc Instance created.
//     @desc_fre L'instance créée.
//   @param [params]
//     @desc params of the constructor of the class.
//     @desc_fre Paramètres du constructeur de la classe.
//   @sample
//     @title Sample 2: create an instance
//     @title_fre Exemple 2 : création d'une instance
//     @section
//       @text This code create instances of some classes.
//       @text_fre Ce code crée quelque instances de classe.
//       @codeBegin
//         @code var pInst1 = xblNew('xbs_sample2_class1');
//         @code var pInst2 = xblNew('xbs_sample2_class2', 'text passed if parameters', 1, 5, 'param4', 8000, 42);
//         @code var param1 = 18;
//         @code var param2 = new Array(0,1,2);
//         @code var pInst3 = xblNew('xbs_sample2_class3', param1, param2);
//         @code var pInst4 = xbs_sample2_class4.xblNew(new Array('l1', 'l2', 'l3'), 7);

// @func call
//   @desc Call a static function on the current class.
//   @desc_fre Appelle une fonction statique de la classe.
//   @return return
//     @desc Return of the function called.
//     @desc_fre Retour de l'appel de fonction.
//   @param funcName
//     @type string
//     @desc Name of the function to call.
//     @desc_fre Nom de la fonction à appeler.
//   @param [params]
//     @desc Params of the called function.
//     @desc_fre Paramètre de la fonction appelée.
//   @sample
//     @title Sample 3: function call
//     @title_fre Exemple 3 : appel de fonction
//     @section
//       @text This code create a class and call some functions of this class.
//       @text_fre Le code ci-dessous crée une class et appelle quelques fonctions statiques.
//       @codeBegin
//         @code newClass('xbs_sample3_class', { }, null, function() {
//         @code   // Private function
//         @code   this.function('func_priv', { level: _xbs_private, static: true }, function() {
//         @code     return(1);
//         @code   });
//         @code   // Constructor & Destructor
//         @code   this.constructor({ level: _xbs_public }, function() {
//         @code   });
//         @code   // Public functions
//         @code   this.function('func_pub1', { level: _xbs_public, static: true }, function(param1, param2) {
//         @code     return(0);
//         @code   });
//         @code   this.function('func_pub2', { level: _xbs_public, static: true }, function() {
//         @code     alert('func_pub2');
//         @code   });
//         @code });
//         @code
//         @code // Static call of public function
//         @code var result = xbs_sample3_class.call('func_pub1', 18, 42);
//         @code xbs_sample3_class.call('func_pub2');
//         @code
//         @code // This following lines raised exception
//         @code xbs_sample3_class.call('func_priv');
//         @code var pInst = xblNew('xbs_sample3_class');
//         @code pInst.call('func_pub2');

// @func const
//   @desc Define a new constant.<br><br>Warning! <i>This directive is only accessible during the declaration of the class.</i>
//   @desc_fre Défini une nouvelle constante.<br><br>Attention! <i>Cette directive n'est accessible que dans le code de la classe.</i>
//   @desc_short Define a new constant.<br>Warning! <i>This directive is only accessible during the declaration of the class.</i>
//   @desc_short_fre Define a new constant.<br>Warning! <i>This directive is only accessible during the declaration of the class.</i>
//   @param name
//     @type string
//     @desc Name of the constant.
//     @desc_fre Nom de la constante.
//   @param params
//     @type Array
//     @desc Array of properties of the constant:<br>&nbsp;&nbsp;- level (_xbs_public, _xbs_protected, _xbs_private).
//     @desc_fre Tableau des propriétés de la constante :<br>&nbsp;&nbsp;- level (_xbs_public, _xbs_protected, _xbs_private).
//   @param value
//     @type Any
//     @desc Value of the constant.
//     @desc_fre Valeur de la constante.
//   @sample
//     @title Sample 4: const directive use
//     @title_fre Exemple 4 : usage de la directive const
//     @section
//       @text This code create some constants on a class.
//       @text_fre Ce code crée quelques constantes sur une classe.
//       @codeBegin
//         @code newClass('xbs_sample4_class', { }, null, function() {
//         @code   this.const('cstTextalignLeft', { level: _xbs_public }, 1);
//         @code   this.const('cstTextalignRight', { level: _xbs_public }, 2);
//         @code   this.const('cstTextalignCenter', { level: _xbs_public }, 3);
//         @code });

// @func function
//   @desc Define a new function of the class.<br><br>Warning! <i>This directive is only accessible during the declaration of the class.</i>
//   @desc_fre Défini une nouvelle fonction sur la classe..<br><br>Attention! <i>Cette directive n'est accessible que dans le code de la classe.</i>
//   @desc_short Define a new function of the class.<br>Warning! <i>This directive is only accessible during the declaration of the class.</i>
//   @desc_short_fre Défini une nouvelle fonction sur la classe.<br>Attention! <i>Cette directive n'est accessible que dans le code de la classe.</i>
//   @param name
//     @type string
//     @desc Name of the function.
//     @desc_fre Nom de la fonction.
//   @param params
//     @type Array
//     @desc Array of properties of the function:<br>&nbsp;&nbsp;- level (_xbs_public, _xbs_protected, _xbs_private, _xbs_package)<br>&nbsp;&nbsp;- static (boolean)<br>&nbsp;&nbsp;- abstract (boolean)<br>&nbsp;&nbsp;- override (boolean) <i>this parameter is mandatory with value 'true' when you override an inherrited function</i>
//     @desc_fre Tableau des propriétés de la fonction :<br>&nbsp;&nbsp;- level (_xbs_public, _xbs_protected, _xbs_private, _xbs_package)<br>&nbsp;&nbsp;- static (booléen)<br>&nbsp;&nbsp;- abstract (booléen)<br>&nbsp;&nbsp;- override (booléen) <i>cette propriété est obligatoire avec la valeur 'true' quand on surcharge une fonction héritée</i>
//   @param classCode
//     @type function
//     @desc Code of the function.
//     @desc_fre Code de la fonction.
//   @sample
//     @title Sample 5: functions declaration sample
//     @title_fre Exemple 5 : exemple de déclaration de fonctions
//     @section
//       @text This code create some functions.
//       @text_fre Ce code crée quelques fonctions.
//       @codeBegin
//         @code newClass('xbs_sample5_class', { }, null, function() {
//         @code   // Private function
//         @code   this.function('func_priv', { level: _xbs_private }, function(param1) {
//         @code     return(param1);
//         @code   });
//         @code   // Public function
//         @code   this.function('func_pub', { level: _xbs_public }, function(param1, param2) {
//         @code     return(param1+param2);
//         @code   });
//         @code   // Public static function
//         @code   this.function('func_pub_static', { level: _xbs_public, static: true }, function() {
//         @code   });
//         @code   // Public virtual function : no code defined
//         @code   this.function('func_pub_virtual', { level: _xbs_public, abstract: true });
//         @code });
//         @code // Class inherit from 'xbs_sample5_class'
//         @code newClass('xbs_sample5_class2', { }, 'xbs_sample5_class', function() {
//         @code   // Override public virtual function
//         @code   this.function('func_pub_virtual', { level: _xbs_public, override: true }, function() {
//         @code     // here, the code of the function
//         @code   });
//         @code });

// @func constructor
//   @desc Define the constructor of the class.<br>The constructor level define the use of the class.<br>&nbsp;&nbsp;- If public the is instanciable anywhere.<br>&nbsp;&nbsp;- If protected the class is not instanciable but inheritable.<br>&nbsp;&nbsp;- If private the class is not instanciable and not inheritable, but the class can provide the instanciation by a public static function on the class (used for singleton).<br><br>Warning! <i>This directive is only accessible during the declaration of the class.</i>
//   @desc_fre Défini Le constructeur de la classe.<br>Le niveau de visibilité du constructeur va déterminer l'usage de la classe.<br>&nbsp;&nbsp;- Si il est 'public', la classe est instanciable.<br>&nbsp;&nbsp;- Si il est 'protected', la classe n'est pas instanciable, mais néanmoins héritable.<br>&nbsp;&nbsp;- Si il est 'private', la classe est ni instanciable, ni héritable, mais une fonction publique statique sur cette classe peut retourner une instance (utilisé pour faire une classe 'singleton').<br><br>Attention! <i>Cette directive n'est accessible que dans le code de la classe.</i>
//   @desc_short Define the constructor of the class.<br>Warning! <i>This directive is only accessible during the declaration of the class.</i>
//   @desc_short_fre Défini Le constructeur de la classe.<br>Attention! <i>Cette directive n'est accessible que dans le code de la classe.</i>
//   @param params
//     @type Array
//     @desc Array of properties of the constructor:<br>&nbsp;&nbsp;- level (_xbs_public, _xbs_protected, _xbs_private, _xbs_package).<br>&nbsp;&nbsp;- <i>[inherited constructor(s)]</i> define the parameters passed to inherited constructor(s) as an Array (see in sample below)
//     @desc_fre Tableau des propriétés du constructeur :<br>&nbsp;&nbsp;- level (_xbs_public, _xbs_protected, _xbs_private, _xbs_package).<br>&nbsp;&nbsp;- <i>[constructeur(s) hérité(s)]</i> définie les paramètres passé au constructeur(s) hérité(s) (voir l'exemple ci-dessous)
//   @param classCode
//     @type function
//     @desc Code of the function.
//     @desc_fre Code de la fonction.
//   @sample
//     @title Sample 6: constructor
//     @title_fre Exemple 6 : constructeur
//     @section
//       @text This code define some basic constructor
//       @text_fre Ce code montre quelques constructeurs simple.
//       @codeBegin
//         @code // Public constructor
//         @code this.constructor({ level: _xbs_public }, function(param1, param2) {
//         @code   // here, the code
//         @code });
//         @code // Protected constructor: class inheritable, not instanciable
//         @code this.constructor({ level: _xbs_protected }, function(param1, param2) {
//         @code   // here, the code
//         @code });
//         @code // Private constructor: class not inheritable, instanciable in the class only
//         @code this.constructor({ level: _xbs_private }, function(param1, param2) {
//         @code   // here, the code
//         @code });
//     @section
//       @text In this sample, you will see how to pass parameters to inherited constructor:<br>&nbsp;&nbsp;1 - with a single inheritance<br>&nbsp;&nbsp;2 - with a multiple inheritance
//       @text_fre Cet exemple présente la manière dont on passe des paramètres au constructeur dont on hérite :<br>&nbsp;&nbsp;1 - tout d'abord avec un héritage simple (le 1er et 3ème paramètre est passé)<br>&nbsp;&nbsp;2 - ensuite avec un héritage multiple (le 1er paramètre est passé au premier constructeur, le 1er, 2ème et 3ème est passé au deuxième constructeur)
//       @codeBegin
//         @code // This class inherit from the class 'xbs_sample6_classA'
//         @code newClass('xbs_sample6_class1', { }, ['xbs_sample6_classA'], function() {
//         @code   // Constructor pass param 1 and 3 to the inherited constructor
//         @code   this.constructor({ level: _xbs_public, xbs_sample6_classA: [ 0, 3 ] }, function(param1, param2, param3, param4, param5) {
//         @code     // here, the code
//         @code   });
//         @code });
//         @code // This class inherit from 2 class 'xbs_sample6_classB' and 'xbs_sample6_classC'
//         @code newClass('xbs_sample6_class2', { }, ['xbs_sample6_classB', 'xbs_sample6_classC'], function() {
//         @code   // Constructor pass param 1 to the first parent and param 3, 1 and 2 to second parent, in this order
//         @code   this.constructor({ level: _xbs_public, xbs_sample6_classB: [ 0 ], xbs_sample6_classC: [ 2, 0, 1 ] }, function(param1, param2, param3, param4, param5) {
//         @code     // here, the code
//         @code   });
//         @code });

// @func destructor
//   @desc Define the destructor of the class. The destructor has no parameter.<br><br>Warning! <i>This directive is only accessible during the declaration of the class.</i>
//   @desc_fre Défini le destructeur de la classe. Le destructeur ne prend aucun paramètres.<br><br>Attention! <i>Cette directive n'est accessible que dans le code de la classe.</i>
//   @desc_short Define the destructor of the class.<br>Warning! <i>This directive is only accessible during the declaration of the class.</i>
//   @desc_short_fre Défini le destructeur de la classe.<br>Attention! <i>Cette directive n'est accessible que dans le code de la classe.</i>
//   @param params
//     @type Array
//     @desc Array of properties of the destructor:<br>&nbsp;&nbsp;- level (_xbs_public, _xbs_protected, _xbs_private, _xbs_package).
//     @desc_fre Tableau des propriétés du destructeur :<br>&nbsp;&nbsp;- level (_xbs_public, _xbs_protected, _xbs_private, _xbs_package).
//   @param classCode
//     @type function
//     @desc Code of the function. This JS function has no parameters.
//     @desc_fre Code de la fonction. Cette fonction JS n'attend pas de paramètres.
//   @sample
//     @title Sample 7: destructor
//     @title_fre Exemple 7 : destructeur
//     @section
//       @text This code define a destructor
//       @text_fre Ce code défini un destructeur
//       @codeBegin
//         @code // Public destructor
//         @code this.destructor({ level: _xbs_public }, function() {
//         @code   // here, the code of the destructor
//         @code });

// @func data
//   @desc Define a new simple data of the class. A data is a simple storage. If public it can be set and get anywhere. If you want to avoid define a readonly data use the properties system.<br><br>Warning! <i>This directive is only accessible during the declaration of the class.</i>
//   @desc_fre Défini une nouvelle donnée simple de la classe. Si cette donnée est publique, elle peut être modifié partout dans le code. Si vous voulez définir une donnée en lecture seule, il faut utiliser le système des propriétés.<br><br>Attention! <i>Cette directive n'est accessible que dans le code de la classe.</i>
//   @desc_short Define a new simple data of the class.<br>Warning! <i>This directive is only accessible during the declaration of the class.</i>
//   @desc_short_fre Défini une nouvelle donnée simple de la classe.<br>Attention! <i>Cette directive n'est accessible que dans le code de la classe.</i>
//   @param name
//     @type string
//     @desc Name of the constant.
//     @desc_fre Nom de la constante.
//   @param params
//     @type Array
//     @desc Array of properties of the data:<br>&nbsp;&nbsp;- level (_xbs_public, _xbs_protected, _xbs_private, _xbs_package)<br>&nbsp;&nbsp;- static (boolean)
//     @desc_fre Tableau des propriétés de la donnée :<br>&nbsp;&nbsp;- level (_xbs_public, _xbs_protected, _xbs_private, _xbs_package)<br>&nbsp;&nbsp;- static (booleén)
//   @param value
//     @optional
//     @desc Value of the data. Used only if the data is static.
//     @desc_fre Valeur de la donnée. Utilisée seulement quand la donnée est statique.
//   @sample
//     @title Sample 8: datas
//     @title_fre Exemple 8 : les données simples
//     @section
//       @text This code define some datas on instance or on class (static data).
//       @text_fre Ce code défini plusieurs données, des données d'instance et de classe (statiques).
//       @codeBegin
//         @code newClass('xbs_sample8_class', { }, null, function() {
//         @code   // Instances data
//         @code   this.data('dt1', { level: _xbs_private }); // Private
//         @code   this.data('dt2', { level: _xbs_public }); // Public
//         @code   // Class data: default value is set here
//         @code   this.data('dt3', { level: _xbs_private, static: true }, 0);
//         @code   this.data('dt4', { level: _xbs_private, static: true }, new Array());
//         @code   this.data('dt5', { level: _xbs_private, static: true }, 'init value');
//         @code   // This code raise an error, you can not init an instance data at definition. Do it in the constructor
//         @code   this.data('dt6', { level: _xbs_public }, 'test init instance value');
//         @code });

// @func property
//   @desc Define a new property of the class. The property is defined by a getter function and optionnaly by a setter function. Each ones can have different visibility level.<br>Warning, the property is not a storage of the data, you need private data to store the data if needed.<br><br>Warning! <i>This directive is only accessible during the declaration of the class.</i>
//   @desc_fre Défini une propriété sur la classe. Une propriété est défini par une fonction de récupération ('getter') et de manière optionnelle par une fonction d'affectation ('setter'). Chacune de ces fonctions ont une visibilité propre.<br>Attention toutefois, la propriété ne stocke pas de donnée. Si besoin est, passez par une donnée privée pour le stockage.<br><br>Attention! <i>Cette directive n'est accessible que dans le code de la classe.</i>
//   @desc_short Define a new property of the class.<br>Warning! <i>This directive is only accessible during the declaration of the class.</i>
//   @desc_short_fre Défini une propriété sur la classe.<br>Attention! <i>Cette directive n'est accessible que dans le code de la classe.</i>
//   @param name
//     @type string
//     @desc Name of the property.
//     @desc_fre Nom de la propriété.
//   @param params
//     @type Array
//     @desc Array of properties of the property:<br>&nbsp;&nbsp;- level (_xbs_public, _xbs_protected, _xbs_private, _xbs_package)
//     @desc_fre Tableau des propriétés de la propriété :<br>&nbsp;&nbsp;- level (_xbs_public, _xbs_protected, _xbs_private, _xbs_package)
//   @param getter_level
//     @type <i>constant</i> (_xbs_public, _xbs_protected, _xbs_private, _xbs_package)
//     @desc Visibility level of the getter.
//     @desc_fre Niveau de visibilité du getter.
//   @param classCode
//     @type Function
//     @desc Code of the getter.
//     @desc_fre Code source du getter.
//   @param setter_level
//     @type <i>constant</i> (_xbs_public, _xbs_protected, _xbs_private, _xbs_package)
//     @optional
//     @desc Visibility level of the setter.
//     @desc_fre Niveau de visibilité du setter.
//   @param classCode
//     @type Function
//     @optional
//     @desc Code of the setter.
//     @desc_fre Code source du setter.
//   @sample
//     @title Sample 9: properties
//     @title_fre Exemple 9 : les propriétés
//     @section
//       @text This code define some properties on instance or on class (static properties).
//       @text_fre Ce code défini plusieurs propriétés, des propriétés d'instance et de classe (statiques).
//       @codeBegin
//         @code this.data('dt1', { level: _xbs_private });
//         @code this.data('dt2', { level: _xbs_private });
//         @code this.data('dt3', { level: _xbs_private, static: true }, 42);
//         @code // prop1 is a public property with simpliest getter and setter that get and store data1
//         @code this.property('prop1', { level: _xbs_pubic },
//         @code   _xbs_public, function() {
//         @code     return(this.get('_dt1'));
//         @code   }, _xbs_public, function(value) {
//         @code     this.set('_dt1', value);
//         @code   });
//         @code // prop2 is a public property that always return the value 0.
//         @code this.property('prop2', { level: _xbs_pubic },
//         @code   _xbs_public, function() {
//         @code     return(0);
//         @code   });
//         @code // prop3 is a protected property, the getter (or setter) can be only protected or private
//         @code this.property('prop3', { level: _xbs_protected },
//         @code   _xbs_protected, function() {
//         @code     return(this.get('_dt2') + 10);
//         @code   });
//         @code // prop4 is a static property and update the value only in range [42..8000]
//         @code this.property('prop4', { level: _xbs_pubic, static: true },
//         @code   _xbs_pubic, function() {
//         @code     return(this.get('_dt3'));
//         @code   }, _xbs_public, function(value) {
//         @code     if ((value > 41) && (value < 8001))
//         @code       this.set('_dt3', value);
//         @code   });

// @func get
//   @desc Get a static data or static property of the class.
//   @desc_fre Retourne la valeur d'une donnée ou d'une propriété statique.
//   @return value
//     @desc The value of the statis data or property.
//     @desc_fre La valeur de la donnée ou propriété statique.
//   @param name
//     @type string
//     @desc Name of the static data or property.
//     @desc_fre Nom de la donnée ou propriété statique.
//   @sample
//     @title Sample 10: get of data or properties
//     @title_fre Exemple 10 : lecture d'une donnée ou propriété
//     @section
//       @text This code show how to get a static data or properties.
//       @text_fre Ce code montre comment récupérer une donnée ou propriété statique.
//       @codeBegin
//         @code newClass('xbs_sample10_class', { }, null, function() {
//         @code   this.data('data1', { level: _xbs_public, static: true });
//         @code   this.data('data2', { level: _xbs_private, static: true });
//         @code   this.property('prop1', { level: _xbs_pubic, static: true },
//         @code     _xbs_public, function() {
//         @code       return(this.get('_data2'));
//         @code     }, _xbs_public, function(value) {
//         @code       this.set('_data2', value);
//         @code     });
//         @code });
//         @code // get a public static data
//         @code var v1 = xbs_sample10_class.get('data1');
//         @code // get a public static property
//         @code var v2 = xbs_sample10_class.get('prop1');

// @func set
//   @desc Set a static data or static property of the class.<br>Warning! <i>If the property is read only, this raised an exception.</i>
//   @desc_fre Affecte la valeur d'une donnée ou propriété statique.<br>Attention! <i>Si la propriété est en lecture seule, une exception sera levée.</i>
//   @param name
//     @type string
//     @desc Name of the static data or property.
//     @desc_fre Nom de la donnée ou propriété statique.
//   @param value
//     @desc New value of the static data or property.
//     @desc_fre Valeur à affecter à la donnée ou propriété.
//   @sample
//     @title Sample 11: set of data or properties
//     @title_fre Exemple 11 : écriture d'une donnée ou propriété
//     @section
//       @text This code show how to set a static data or properties.
//       @text_fre Ce code montre comment modifier une donnée ou propriété statique.
//       @codeBegin
//         @code newClass('xbs_sample11_class', { }, null, function() {
//         @code   this.data('data1', { level: _xbs_public, static: true });
//         @code   this.data('data2', { level: _xbs_private, static: true });
//         @code   this.property('prop1', { level: _xbs_pubic, static: true },
//         @code     _xbs_public, function() {
//         @code       return(this.get('_data2'));
//         @code     }, _xbs_public, function(value) {
//         @code       if ((value > 41) && (value < 8001))
//         @code        this.set('_data2', value);
//         @code     });
//         @code   this.property('prop2', { level: _xbs_pubic, static: true },
//         @code     _xbs_public, function() {
//         @code       return(this.get('_data1'));
//         @code     });
//         @code });
//         @code // set a public static data
//         @code xbs_sample11_class.set('data1', 'test value');
//         @code // set a public static property, this call the setter
//         @code xbs_sample11_class.set('prop1', 120); // updated with '120'
//         @code xbs_sample11_class.set('prop1', 18);  // not updated because not in range [42..8000]
//         @code // this line raise an error because prop2 is read only
//         @code xbs_sample11_class.set('prop2', 'hello');

// @func event
//   @desc Define a new event of the class.<br><br>Warning! <i>This directive is only accessible during the declaration of the class.</i>
//   @desc_fre Défini un événement de la classe.<br><br>Attention! <i>Cette directive n'est accessible que dans le code de la classe.</i>
//   @desc_short Define a new event of the class.<br>Warning! <i>This directive is only accessible during the declaration of the class.</i>
//   @desc_short_fre Défini un événement de la classe.<br>Attention! <i>Cette directive n'est accessible que dans le code de la classe.</i>
//   @param name
//     @type string
//     @desc Name of the event.
//     @desc_fre Nom de l'événement.
//   @param params
//     @type Array
//     @desc Array of properties of the event:<br>&nbsp;&nbsp;- level (_xbs_public, _xbs_protected, _xbs_private)<br>&nbsp;&nbsp;- static (boolean)
//     @desc_fre Tableau des propriétés de l'événement :<br>&nbsp;&nbsp;- level (_xbs_public, _xbs_protected, _xbs_private)<br>&nbsp;&nbsp;- static (booléen)
//   @sample
//     @title Sample 12: define event
//     @title_fre Exemple 12 : définir un événement
//     @section
//       @text This code show how to define an event.
//       @text_fre Ce code montre comment définir un événement.
//       @codeBegin
//         @code // Instance event
//         @code this.event('evt1', { level: _xbs_public });
//         @code // Class event
//         @code this.event('evt2', { level: _xbs_public, static: true });

// @func eventListenerAdd
//   @desc Add a callback on a static event of the class. The key of the callback is composed by the event name, the instance id and the callback function name. The key is uniq in the eventListener of the class listened; if your try to add a callback with a used key, this will raise an error.
//   @desc_fre Ajoute une fonction d'appel sur un événement statique de la classe. La clé d'écoute est composée du nom de l'événement, de l'id de l'instance et et du nom de la fonction d'appel. Cette clé est unique dans le listener de la class écoutée; si vous essayé de l'ajouter une deuxième cela génèrera une erreur.
//   @desc_short Add a callback on a static event of the class.
//   @desc_short_fre Ajoute une fonction d'appel sur un événement statique de la classe.
//   @param name
//     @type string
//     @desc Name of the event to trap.
//     @desc_fre Nom de l'événement que l'on veut écouter.
//   @param pInst
//     @type Object
//     @desc Instance that want to trap the event.
//     @desc_fre Instance qui désire écouter l'événement.
//   @param funcName
//     @type string
//     @desc Name of the callback function. This function take one parameter only: the event params array.
//     @desc_fre Nom de la fonction d'appel. Cette fonction prend un seul paramètre : le tableau des paramètres de l'événement.
//   @sample
//     @title Sample 13: add a callback on a static event
//     @title_fre Exemple 13 : ajoute une fonction d'appel sur un événement statique
//     @section
//       @text This code show how the class 'xbs_sample13_class2' listen the static event 'ontick' of the class 'xbs_sample13_class1'.
//       @text_fre Ce code montre comment la class 'xbs_sample13_class2' écoute l'événement statique 'ontick' de la classe 'xbs_sample13_class1'.
//       @codeBegin
//         @code // This class define a static event 'ontick'
//         @code newClass('xbs_sample13_class1', { }, null, function() {
//         @code   // Class event
//         @code   this.event('ontick', { level: _xbs_public, static: true });
//         @code });
//         @code // This class define a callback on static event 'ontick' of the class1
//         @code newClass('xbs_sample13_class2', { }, null, function() {
//         @code   this.function('OnTick', { level: _xbs_private }, function(e) {
//         @code     // Code of the callback here : e is an array that contains event params
//         @code   });
//         @code   this.function('OnTick2', { level: _xbs_private }, function(e) {
//         @code     // Code of the callback here : e is an array that contains event params
//         @code   });
//         @code   this.function('OnTick3', { level: _xbs_public }, function(e) {
//         @code     // Code of the callback here : e is an array that contains event params
//         @code   });
//         @code   this.constructor({ level: _xbs_public }, function() {
//         @code     // Define the callback on the static event 'ontick': this works even if 'OnTick' is private because you declare the callback in the class. Out of the class this will not work.
//         @code     xbs_sample13_class1.eventListenerAdd('ontick', this, 'OnTick');
//         @code   });
//         @code });
//         @code var pInst = xblNew('xbs_sample13_class2');
//         @code // this callback declaration will work
//         @code xbs_sample13_class1.eventListenerAdd('ontick', pInst, 'OnTick3');
//         @code // this will NOT because 'OnTick2' is private and your outside the class definition
//         @code xbs_sample13_class1.eventListenerAdd('ontick', pInst, 'OnTick2');

// @func eventListenerRem
//   @desc Remove a callback previously added on a static event. Because a callback uniq key is defined by the event name, the instance id of the listener and the callback function name, you need to give all this information to remove the callback.
//   @desc_fre Supprime un fonction d'appel préalablement ajoutée sur un événement statique. Comme la clé unique d'une écoute d'événement est composé du nom de l'événement, de id de l'instance qui écoute et nom de la fonction d'appel, vous avez besoin de spécifier l'ensemble de ces éléments pour supprimer l'écoute.
//   @desc_short Remove a callback previously added on a static event.
//   @desc_short_fre Supprime un fonction d'appel préalablement ajoutée sur un événement statique.
//   @param name
//     @type string
//     @desc Name of the event which is trapped.
//     @desc_fre Nom de l'événement qui est écouté.
//   @param pInst
//     @type Object
//     @desc Instance that currently trap the event.
//     @desc_fre Instance qui écoute l'événement.
//   @param funcName
//     @type string
//     @desc Name of the callback function.
//     @desc_fre Nom de la fonction d'appel.
//   @sample
//     @title Sample 14: remove a callback on a static event
//     @title_fre Exemple 14 : supprime une fonction d'appel sur un événement statique
//     @section
//       @text This code show how to remove a callback on a static event.
//       @text_fre Ce code montre comment supprimer une écoute sur un événement statique.
//       @codeBegin
//         @code newClass('xbs_sample14_class2', { }, null, function() {
//         @code   [...]
//         @code   this.destructor({ level: _xbs_public }, function() {
//         @code     xbs_sample14_class1.eventListenerRem('ontick', this, 'OnTick');
//         @code   });
//         @code });
//         @code var pInst = xblNew('xbs_sample14_class2');
//         @code [...]
//         @code xbs_sample14_class1.eventListenerRem('ontick', pInst, 'OnTick3');

// @func raiseEvent
//   @desc Raise a static event of the class.<br><br>Warning! <i>This directive is only accessible during the declaration of the class or by inheritance.</i>
//   @desc_fre Déclenche un événement statique.<br><br>Attention! <i>Cette directive n'est accessible que dans le code de la classe ou par héritage.</i>
//   @desc_short Raise a static event of the class.<br>Warning! <i>This directive is only accessible during the declaration of the class or by inheritance.</i>
//   @desc_short_fre Déclenche un événement statique.<br>Attention! <i>Cette directive n'est accessible que dans le code de la classe ou par héritage.</i>
//   @param name
//     @type string
//     @desc Name of the event to raise.
//     @desc_fre Nom de l'événement à déclencher.
//   @param evtArray
//     @type Array
//     @desc Array of the event datas.
//     @desc_fre Tableau des paramètres de l'événement.
//   @sample
//     @title Sample 15: raise a static event
//     @title_fre Exemple 15 : déclenche un événement statique
//     @section
//       @text This code show how to raise a static event.
//       @text_fre Ce code montre comment déclencher un événement statique.
//       @codeBegin
//         @code newClass('xbs_sample15_class', { }, null, function() {
//         @code   this.event('ontick', { level: _xbs_public, static: true });
//         @code   // This static function raise the event 'ontick'
//         @code   this.function('RaiseOnTick', { level: _xbs_private, static: true }, function(v1) {
//         @code     var params = new Array();
//         @code     params['data1'] = v1;
//         @code     this.raiseEvent('ontick', params);
//         @code   });
//         @code   // This function raise the event 'ontick' too
//         @code   this.function('RaiseOnTick', { level: _xbs_private }, function(v1) {
//         @code     var params = new Array();
//         @code     params['data1'] = v1;
//         @code     xbs_sample15_class.raiseEvent('ontick', params);
//         @code   });
//         @code });

// @class_end


//////////////////////////////////////////////////////////////////////////////
// OOP Directives of Instances
//////////////////////////////////////////////////////////////////////////////

// @class [Instance]
//   @level public
//   @desc Here, you will find all the Object Oriented Programmation for JavaScript directive that exists on every instance.
//   @desc_fre Ici, vous trouverez l'ensemble des directives Orientés Objets que vous trouverez sur l'ensemble des intances de classe.

// @func call
//   @desc Call a function on the current instance.
//   @desc_fre Appelle une fonction sur l'instance courante.
//   @param name
//     @type string
//     @desc Name of the function to call.
//     @desc_fre Nom de la fonction à appeler.
//   @param [params]
//     @desc Params of the called function.
//     @desc_fre Paramètre de la fonction appellée.
//   @sample
//     @title Sample 16: call a function on instance
//     @title_fre Exemple 16 : appeller une fonction sur une instance
//     @section
//       @text This code show how to call a function.
//       @text_fre Ce code montre comment appeller une fonction sur une instance.
//       @codeBegin
//         @code newClass('xbs_sample16_class', { }, null, function() {
//         @code   this.function('func1', { level: _xbs_public }, function(param1, param2) {
//         @code     alert('"func1" called with params : '+param1+', '+param2);
//         @code   });
//         @code });
//         @code var pInst = xblNew('xbs_sample16_class');
//         @code pInst.call('func1', 8, 'text');

// @func delete
//   @desc Delete the current instance. If a destructor is defined on the class, it will be called before the destruction of the instance.
//   @desc_fre Supprime l'instance courante. Si un constructeur est défini sur la classe, il sera appellé lors de la suppression de l'instance.
//   @desc_short Delete the current instance.
//   @desc_short_fre Supprime l'instance courante.
//   @sample
//     @title Sample 17: delete an instance
//     @title_fre Exemple 17 : supprimer une instance
//     @section
//       @text This code show how to delete an instance.
//       @text_fre Ce code montre comment supprimer l'instance d'une classe.
//       @codeBegin
//         @code newClass('xbs_sample17_class', { }, null, function() {
//         @code   this.function('alive', { level: _xbs_public }, function() {
//         @code     alert('This instance is active');
//         @code   });
//         @code });
//         @code var pInst = xblNew('xbs_sample17_class');
//         @code pInst.call('alive');
//         @code pInst.delete;
//         @code // This call will raise an error
//         @code pInst.call('alive');

// @func eventListenerAdd
//   @desc Add a callback on an event of the current instance. The key of the callback is composed by the event name, the instance id and the callback function name. The key is uniq in the eventListener of the class listened; if your try to add a callback with a used key, this will raise an error.
//   @desc_fre Ajoute une fonction d'appel sur un événement de l'instance en cours. La clé d'écoute est composée du nom de l'événement, de l'id de l'instance et et du nom de la fonction d'appel. Cette clé est unique dans le listener de la class écoutée; si vous essayé de l'ajouter une deuxième cela génèrera une erreur.
//   @desc_short Add a callback on an event of the class.
//   @desc_short_fre Ajoute une fonction d'appel sur un événement de la classe.
//   @param name
//     @type string
//     @desc Name of the event to trap.
//     @desc_fre Name of the event to trap.
//   @param pInst
//     @type Object
//     @desc Instance that want to trap the event.
//     @desc_fre Instance qui désire écouter l'événement.
//   @param funcName
//     @type String
//     @desc Name of the callback function. This function take one parameter: the event array.
//     @desc_fre Nom de la fonction d'appel. Cette fonction prend un seul paramètre : le tableau des paramètres de l'événement.
//   @sample
//     @title Sample 18: add a callback on an event
//     @title_fre Exemple 18 : ajoute une fonction d'appel sur un événement
//     @section
//       @text This code show how the class 'xbs_sample18_class2' listen the static event 'ontick' of the class 'xbs_sample18_class1'.
//       @text_fre Ce code montre comment la class 'xbs_sample18_class2' écoute l'événement statique 'ontick' de la classe 'xbs_sample18_class1'.
//       @codeBegin
//         @code // This class define an event 'ontick'
//         @code newClass('xbs_sample18_class1', { }, null, function() {
//         @code   // Class event
//         @code   this.event('ontick', { level: _xbs_public });
//         @code });
//         @code newClass('xbs_sample18_class2', { }, null, function() {
//         @code   this.function('OnTick', { level: _xbs_private }, function(e) {
//         @code     // Code of the callback here : e is an array that contains event params
//         @code   });
//         @code   this.function('OnTick2', { level: _xbs_private }, function(e) {
//         @code     // Code of the callback here : e is an array that contains event params
//         @code   });
//         @code   this.function('OnTick3', { level: _xbs_public }, function(e) {
//         @code     // Code of the callback here : e is an array that contains event params
//         @code   });
//         @code   this.constructor({ level: _xbs_public }, function() {
//         @code     var pClass1 = xblNew('xbs_sample18_class1')
//         @code     // Define the callback on the event 'ontick' of the instance created: this works even if 'OnTick' is private because you declare the callback in the class. Out of the class this will not work.
//         @code     pClass1.eventListenerAdd('ontick', this, 'OnTick');
//         @code   });
//         @code });
//         @code var pInst1 = xblNew('xbs_sample18_class1');
//         @code var pInst2 = xblNew('xbs_sample18_class2');
//         @code // this callback declaration will work
//         @code pInst1.eventListenerAdd('ontick', pInst2, 'OnTick3');
//         @code // this will NOT because 'OnTick2' is private and your outside the class definition
//         @code pInst1.eventListenerAdd('ontick', pInst2, 'OnTick2');
//         @code // this will NOT because 'ontick' is not static
//         @code xbs_sample18_class1.eventListenerAdd('ontick', pInst2, 'OnTick3');

// @func eventListenerRem
//   @desc Remove a callback previously added. Because a callback uniq key is defined by the event name, the instance id of the listener and the callback function name, you need to give all this information to remove the callback.
//   @desc_fre Supprime un fonction d'appel préalablement ajoutée sur un événement statique. Comme la clé unique d'une écoute d'événement est composé du nom de l'événement, de id de l'instance qui écoute et nom de la fonction d'appel, vous avez besoin de spécifier l'ensemble de ces éléments pour supprimer l'écoute.
//   @desc_short Remove a callback previously added on a event.
//   @desc_short_fre Supprime un fonction d'appel préalablement ajoutée sur un événement.
//   @param name
//     @type string
//     @desc Name of the event which is trapped.
//     @desc_fre Nom de l'événement qui est écouté.
//   @param pInst
//     @type Object
//     @desc Instance that currently trap the event.
//     @desc_fre Instance qui écoute l'événement.
//   @param funcName
//     @type String
//     @desc Name of the callback function.
//     @desc_fre Nom de la fonction d'appel.
//   @sample
//     @title Sample 19: remove a callback on an event
//     @title_fre Exemple 19 : supprime une fonction d'appel sur un événement
//     @section
//       @text This code show how to remove a callback on an event.
//       @text_fre Ce code montre comment supprimer une écoute sur un événement.
//       @codeBegin
//         @code newClass('xbs_sample19_class1', { }, null, function() {
//         @code   // Class event
//         @code   this.event('ontick', { level: _xbs_public });
//         @code });
//         @code newClass('xbs_sample19_class2', { }, null, function() {
//         @code   this.function('OnTick', { level: _xbs_public }, function(e) {
//         @code     // Code of the callback here : e is an array that contains event params
//         @code   });
//         @code });
//         @code var pInst1 = xblNew('xbs_sample19_class1');
//         @code var pInst2 = xblNew('xbs_sample19_class2');
//         @code // define a callback on event 'ontick'
//         @code pInst1.eventListenerAdd('ontick', pInst2, 'OnTick');
//         @code // remove the callback
//         @code pInst1.eventListenerRem('ontick', pInst2, 'OnTick');

// @func freezeEvent
//   @desc Freeze an event of the current instance. During the freezing, the event can not be raised. To reverse the freezing operation, call function "warmEvent".
//   @desc_fre Gèle les événements d'une instance. Pendant le gèle des événements, aucun d'entre eux ne peu être lancé. Pour réactiver les événements, appellez la fonction "warmEvent".
//   @desc_short Freeze an event of the current instance.
//   @desc_short_fre Gèle les événements d'une instance.
//   @param name
//     @type string
//     @desc Name of the event to freeze.
//     @desc_fre Nom de l'événement à geler.

// @func get
//   @desc Get a data of the instance. If the data is a property, this function call the getter and return the result.
//   @desc_fre Récupère une donnée de l'instance. Si la données est une propriété, cette fonction appelle le getter.
//   @desc_short Get a data of the instance.
//   @desc_short_fre Récupère une donnée de l'instance.
//   @param name
//     @type string
//     @desc Name of the data or property.
//     @desc_fre Nom de la donnée ou proprété.
//   @return value
//     @desc Value of the data or property.
//     @desc_fre Valeur de la donnée ou propriété.
//   @sample
//     @title Sample 20: get of data or properties
//     @title_fre Exemple 20 : lecture d'une donnée ou propriété
//     @section
//       @text This code show how to get data or properties.
//       @text_fre Ce code montre comment récupérer une donnée ou propriété.
//       @codeBegin
//         @code newClass('xbs_sample20_class', { }, null, function() {
//         @code   this.data('data1', { level: _xbs_public });
//         @code   this.data('data2', { level: _xbs_private });
//         @code   this.property('prop1', { level: _xbs_pubic },
//         @code     _xbs_public, function() {
//         @code       return(this.get('_data2'));
//         @code     }, _xbs_public, function(value) {
//         @code       this.set('_data2', value);
//         @code     });
//         @code   this.constructor({ level: _xbs_public }, function() {
//         @code   });
//         @code });
//         @code var pInst = xblNew('xbs_sample20_class');
//         @code // get a public data
//         @code var v1 = pInst.get('data1');
//         @code // get a public property
//         @code var v2 = pInst.get('prop1');

// @func isClass
//   @desc Return true if the class in parameter et the instance class or one of his parent classes.
//   @desc_fre Retourne 'true' si la classe en paramètre est la classe de l'instance ou une de ses parente.
//   @param className
//     @type string
//     @desc Name of the class to test.
//     @desc_fre Nom de la classa à tester.
//   @return result
//     @type boolean
//     @desc Result of the test.
//     @desc_fre Le résultat du test.

// @func raiseEvent
//   @desc Raise an event on the current instance.<br><br>Warning! <i>This directive is only accessible during the declaration of the class or by inheritance.</i>
//   @desc_fre Déclenche un événement sur l'instance courante.<br><br>Attention! <i>Cette directive n'est accessible que dans le code de la classe ou par héritage.</i>
//   @param name
//     @type string
//     @desc Name of the event to raise.
//     @desc_fre Nom de l'événement à déclencher.
//   @param evtArray
//     @type Array
//     @desc Array of the event datas.
//     @desc_fre Tableau des paramètres de l'événement.
//   @sample
//     @title Sample 22: raise an event
//     @title_fre Exemple 22 : déclenche un événement
//     @section
//       @text This code show how to raise an event.
//       @text_fre Ce code montre comment déclencher un événement.
//       @codeBegin
//         @code newClass('xbs_sample22_class', { }, null, function() {
//         @code   this.event('ontick', { level: _xbs_public });
//         @code   // This function raise the event 'ontick'
//         @code   this.function('RaiseOnTick', { level: _xbs_private }, function(v1) {
//         @code     var params = new Array();
//         @code     params['data1'] = v1;
//         @code     this.raiseEvent('ontick', params);
//         @code   });
//         @code });

// @func set
//   @desc Set a data or property of the instance. If the data is a property, this function call the setter.<br>Warning! <i>If the property is read only, this raised an exception.</i>
//   @desc_fre Affecte la valeur d'une donnée ou propriété. Si la données est une propriété, cette fonction appelle le setter.<br>Attention! <i>Si la propriété est en lecture seule, une exception sera levée.</i>
//   @desc_short Set a data or property of the instance.<br>Warning! <i>If the property is read only, this raised an exception.</i>
//   @desc_short_fre Affecte la valeur d'une donnée ou propriété.<br>Attention! <i>Si la propriété est en lecture seule, une exception sera levée.</i>
//   @param name
//     @type string
//     @desc Name of the data or property.
//     @desc_fre Nom de la donnée ou propriété.
//   @param value
//     @desc New value of the data or property.
//     @desc_fre Valeur à affecter à la donnée ou propriété.
//   @sample
//     @title Sample 21: set of data or properties
//     @title_fre Exemple 21 : écriture d'une donnée ou propriété
//     @section
//       @text This code show how to set data or properties.
//       @text_fre Ce code montre comment modifier une donnée ou propriété.
//       @codeBegin
//         @code newClass('xbs_sample21_class', { }, null, function() {
//         @code   this.data('data1', { level: _xbs_public });
//         @code   this.data('data2', { level: _xbs_private });
//         @code   this.property('prop1', { level: _xbs_pubic },
//         @code     _xbs_public, function() {
//         @code       return(this.get('_data2'));
//         @code     }, _xbs_public, function(value) {
//         @code       if ((value > 41) && (value < 8001))
//         @code        this.set('_data2', value);
//         @code     });
//         @code   this.property('prop2', { level: _xbs_pubic },
//         @code     _xbs_public, function() {
//         @code       return(this.get('_data1'));
//         @code     });
//         @code   this.constructor({ level: _xbs_public }, function() {
//         @code   });
//         @code });
//         @code var pInst = xblNew('xbs_sample21_class');
//         @code // set a public data
//         @code pInst.set('data1', 'test value');
//         @code // set a public property, this call the setter
//         @code pInst.set('prop1', 120); // updated with '120'
//         @code pInst.set('prop1', 18);  // not updated because not in range [42..8000]
//         @code // this line raise an error because prop2 is read only
//         @code pInst.set('prop2', 'hello');

// @func warmEvent
//   @desc Warm an event previously freezed.
//   @desc_fre Réactive un événement précédemment gelé.
//   @param name
//     @type string
//     @desc Name of the event to warm.
//     @desc_fre Nom de l'événement à réactiver.

// @class_end



//////////////////////////////////////////////////////////////////////////////
// OO Exception Handling
//////////////////////////////////////////////////////////////////////////////

// @class Exception
//   @level public
//   @desc Exception handling base class, all your specific exceptions must inherit this class.
//   @desc_fre Classe de gestion des exceptions, toute les classe de gestion spécifique des exceptions doivent en hériter.

newClass('Exception', { }, '', function() {	
	// Static elements

	// Constants
	// @const cstGravity
	//   @level public
	//   @desc Constants that define the gravity of the exception.
	//   @desc_fre Contante qui défini la gravité des exceptions.
	this.const('cstGravityNone', { level: _xbs_public }, '');
	//   @item cstGravityInformation
	//     @level public
	//     @desc the exception is an information.
	//     @desc_fre l'exception est une information.
	this.const('cstGravityInformation', { level: _xbs_public }, 'i');
	//   @item cstGravityWarning
	//     @level public
	//     @desc the exception is a warning.
	//     @desc_fre l'exception est une alerte.
	this.const('cstGravityWarning', { level: _xbs_public }, 'w');
	//   @item cstGravityError
	//     @level public
	//     @desc the exception is an error.
	//     @desc_fre l'exception est une erreur.
	this.const('cstGravityError', { level: _xbs_public }, 'e');
	//   @item cstGravitySevere
	//     @level public
	//     @desc the exception is a severe error.
	//     @desc_fre l'exception est une erreur fatale.
	this.const('cstGravitySevere', { level: _xbs_public }, 's');
	// Exception #
	// @const xbs_unknown_error
	//   @level public
	//   @desc this exception is raised when you throw an unknown exception id.
	//   @desc_fre cette exception est levée quand vous code essayez de lever une exception inconnu.
	this.const('xbs_unknown_error', { level: _xbs_public }, 1);
	// @const xbs_cannot_redefine_error
	//   @level public
	//   @desc this exception is raised when you define an exception with an already used id.
	//   @desc_fre cette exception est levée quand vous déclarez une exception dont l'id existe déjà.
	this.const('xbs_cannot_redefine_error', { level: _xbs_public }, 2);
	
	// Private datas

	this.data('_errors', { level: _xbs_private, static: true }, new Array());
	
	// Public functions

	// @func NewError
	//   @level public
	//   @static
	//   @desc define a new exception in the exception system.
	//   @desc_fre défini une nouvelle exception.
	//   @param id
	//     @type integer
	//     @desc id of the exception.
	//     @desc_fre id unique de la nouvelle exception.
	//   @param gravity
	//     @type cstGravity
	//     @desc gravity of the exception.
	//     @desc_fre gravité de la nouvelle exception.
	//   @param description
	//     @type string array
	//     @desc texts list of the exception (if you have 1 data, you will have 2 texts, 1 before and 1 after. If you have 2 datas, 3 texts, and so on).
	//     @desc_fre liste des texts de l'exception (si vous avez 1 donnée, vous aurez 2 textes, 1 texte avant la donnée et 1 texte après. Si vous avez 2 données, 3 textes, et ainsi de suite).
	this.function('NewError', { level: _xbs_public, static: true }, function(err_num, err_grav, err_desc) {
		var errors = this.get('_errors');
		var err_key = 'e_'+err_num;
		if (errors[err_key] === undefined)
		{
			errors[err_key] = new Array();
			errors[err_key].num = err_num;
			errors[err_key].grav = err_grav;
			if (isString(err_desc) == true)
			{
				errors[err_key].desc = new Array();
				errors[err_key].desc.push(err_desc);
			}
			else
			{
				errors[err_key].desc = err_desc;
			}
			this.set('_errors', errors);
		}
		else
		{
			this.call('ThrowError', 2, { number: err_num });
		}
	});
	// @func ThrowError
	//   @level public
	//   @static
	//   @desc call to throw an exception.
	//   @desc_fre appeller pour lever une exception.
	//   @param id
	//     @type integer
	//     @desc id of the exception to throw.
	//     @desc_fre id de l'exception à lever.
	//   @param datas
	//     @type array
	//     @desc array of data to set between texts of the exception.
	//     @desc_fre tableau des données à injecter dans l'exception.
	this.function('ThrowError', { level: _xbs_public, static: true }, function(err_num, datas) {
		// Unstack me to not see me in stack of error
		_xbs_callstack.pop();
		var errors = this.get('_errors');
		var err_key = 'e_'+err_num;
		if (errors[err_key] !== undefined)
		{
			// Build the description
			var my_desc = errors[err_key].desc[0];
			var j = 1;
			for (var i in datas)
				my_desc += datas[i]+errors[err_key].desc[j++];
			var pInst = this.xblNew(err_num, errors[err_key].grav, my_desc, datas);
			// Restack for pop after
			_xbs_callstack.push('Unstacked');
			throw pInst;
		}
		else
		{
			this.call('ThrowError', 1, { number: err_num });
		}
		// Restack for pop after
		_xbs_callstack.push('Unstacked');
	});
	this.function('Stack2String', { level: _xbs_public, static: true }, function() {
		// Unstack me to not see me in stack of error
		_xbs_callstack.pop();
		var my_callstack = _xbs_callstack;
		var my_callstackstring = '';
		if (my_callstack.length > 0)
		{
			my_callstackstring = my_callstack[my_callstack.length - 1];
			for (var i = (my_callstack.length - 2);i >= 0;i--)
				my_callstackstring = my_callstackstring+'\n'+my_callstack[i];
		}
		// Restack for pop after
		_xbs_callstack.push('Unstacked');
		return(my_callstackstring);
	});
	
	// Instance elements
	
	// Private datas
	
	this.data('_num', { level: _xbs_private });
	this.data('_grav', { level: _xbs_private });
	this.data('_desc', { level: _xbs_private });
	this.data('_datas', { level: _xbs_private });
	this.data('_callstack', { level: _xbs_private });
	this.data('_callstackstring', { level: _xbs_private });

	// Public properties

	this.property('number', { level: _xbs_public },
		_xbs_public, function() {
			return(this.get('_num'));
		});
	this.property('gravity', { level: _xbs_public },
		_xbs_public, function() {
			return(this.get('_grav'));
		});
	this.property('description', { level: _xbs_public },
		_xbs_public, function() {
			return(this.get('_desc'));
		});
	this.property('datas', { level: _xbs_public },
		_xbs_public, function() {
			return(this.get('_datas'));
		});
	this.property('callstack', { level: _xbs_public },
		_xbs_public, function() {
			return(this.get('_callstack'));
		});
	this.property('callstackstring', { level: _xbs_public },
		_xbs_public, function() {
			return(this.get('_callstackstring'));
		});

	// Constructor & Destructor

	// @const_func
	//   @level public
	//   @desc Called when a new instance is created.
	//   @desc_fre Appeller lors de la création d'une nouvelle instance d'exception.
	//   @param err_num
	//     @type integer
	//     @desc id of the exception.
	//     @desc_fre id de l'exception.
	//   @param err_grav
	//     @type cstGravity
	//     @desc gravity of the exception.
	//     @desc_fre gravité de l'exception.
	//   @param err_desc
	//     @type string array
	//     @desc description of the exception.
	//     @desc_fre description de l'exception.
	//   @param err_datas
	//     @type string array
	//     @desc data list of the exception.
	//     @desc_fre liste des données de l'exception.
	this.constructor({ level: _xbs_public }, function(err_num, err_grav, err_desc, err_datas) {
		// Unstack me to not see me in stack of error
		_xbs_callstack.pop();
		this.set('_num', err_num);
		this.set('_grav', err_grav);
		this.set('_desc', err_desc);
		this.set('_datas', err_datas);
		this.set('_callstack', _xbs_callstack);
		this.set('_callstackstring', Exception.call('Stack2String'));
		// Restack for pop after
		_xbs_callstack.push('Unstacked');
	});
	// @dest_func
	//   @level public
	//   @desc Called when an instance is delete.
	//   @desc_fre Appellé lors de la destruction de l'instance.
	this.destructor({ level: _xbs_public }, function() {
		// Unstack me to not see me in stack of error
		_xbs_callstack.pop();
		this.set('_num', 0);
		this.set('_grav', Exception.cstGravityNone);
		this.set('_desc', '');
		this.set('_datas', null);
		this.set('_callstack', null);
		this.set('_callstackstring', '');
		// Restack for pop after
		_xbs_callstack.push('Unstacked');
	});
	
	// Public functions

	// @func toString
	//   @level public
	//   @desc return the exception as a string.
	//   @desc_fre retourne l'exception sous forme de chaine de caractères.
	//   @return
	//     @type string
	//     @desc the exception as a string.
	//     @desc_fre l'exception sous forme de chaine de caractères.
	this.function('toString', { level: _xbs_public }, function() {
		var str = '';
		var my_grav = this.get('_grav');
		if (my_grav == Exception.cstGravityInformation)
			str += 'Information ';
		if (my_grav == Exception.cstGravityWarning)
			str += 'Warning ';
		if (my_grav == Exception.cstGravityError)
			str += 'Error ';
		if (my_grav == Exception.cstGravitySevere)
			str += 'Severe Error ';
		str += '#'+this.get('_num')+': '+this.get('_desc');
		str += '\n'+this.get('_callstackstring');
		return(str);
	});
	// @func Throw
	//   @level public
	//   @abstract
	//   @desc call to throw an instanciable exception. Classic behavior for Object Oriented Languages. Exists for the compatibility.
	//   @desc_fre appelé pour levé une exception instanciable. Comportement classique pour les langages objets. Existe pour la compatibilité.
	this.function('Throw', { level: _xbs_public, abstract: true }, function() {
	});
});
// @class_end
Exception.call('NewError', Exception.xbs_unknown_error, Exception.cstGravitySevere, ['Unknown error #', '.']);
Exception.call('NewError', Exception.xbs_cannot_redefine_error, Exception.cstGravityError, ['Can not redefine error #', '.']);

function internalAlert(message) {
	message = 'InternalException : '+message;
	message += '\n'+Exception.call('Stack2String');
	alert(message);
}

function alertEx(ex) {
	var ex_str = ""
	if (ex._class === undefined)
	{
		ex_str = ex.toString();
		ex_str += '\n'+Exception.call('Stack2String');
	}
	else
	{
		ex_str = ex.call('toString');
	}
	alert(ex_str);
}



//////////////////////////////////////////////////////////////////////////////
// Timers
//////////////////////////////////////////////////////////////////////////////

var _xbs_timers = new Array();

function _xbs_on_timer(timerId)
{
	if (_xbs_timers[timerId] !== undefined)
	{
		// Set the scope
		_xbs_classScope.unshift(_xbs_timers[timerId]['callbackScope']);
		// Call the callback
		if( _xbs_timers[timerId]['callbackStatic'] == true)
			_xbs_StaticCall(_xbs_timers[timerId]['callbackObj'], _xbs_timers[timerId]['callbackFunc']);
		else
			_xbs_Call(_xbs_timers[timerId]['callbackObj'], _xbs_timers[timerId]['callbackFunc']);
		// Remove scope
		_xbs_classScope.shift();
	}
}

function xbs_set_timer(timerId, duration, callbackObj, callbackFunc)
{
	if (_xbs_timers[timerId] === undefined)
	{
		_xbs_timers[timerId] = new Array();
		_xbs_timers[timerId]['duration'] = duration;
		_xbs_timers[timerId]['callbackObj'] = callbackObj;
		_xbs_timers[timerId]['callbackFunc'] = callbackFunc;
		if (callbackObj._class === undefined)
		{ // Class
			if (callbackObj._package == null)
				_xbs_timers[timerId]['callbackScope'] = callbackObj._name;
			else
				_xbs_timers[timerId]['callbackScope'] = callbackObj._package._name+'.'+callbackObj._name;
			_xbs_timers[timerId]['callbackStatic'] = true;
		}
		else
		{ // Instance
			if (callbackObj._class._package == null)
				_xbs_timers[timerId]['callbackScope'] = callbackObj._class._name;
			else
				_xbs_timers[timerId]['callbackScope'] = callbackObj._class._package._name+'.'+callbackObj._class._name;
			_xbs_timers[timerId]['callbackStatic'] = false;
		}
		// Use eval and a global var to include the timer id into the function called on setInterval
		eval("_xbs_result = setInterval(function(){ _xbs_on_timer('"+timerId+"'); }, "+duration+");");
		// Get the result of the setInterval and reset it
		_xbs_timers[timerId]['JSId'] = _xbs_result;
		_xbs_result = 0;
		return(true);
	}
	return(false);
}

function xbs_stop_timer(timerId)
{
	if (_xbs_timers[timerId] !== undefined)
	{
		clearInterval(_xbs_timers[timerId]['JSId']);
		delete _xbs_timers[timerId];
		return(true);
	}
	return(false);
}
