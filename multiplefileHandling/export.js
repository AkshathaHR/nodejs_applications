 var express = require('express');

var exports = module.exports = {};

var x = 10;

exports.expFunction = function () {
	console.log("Exported function");
}

exports.testfn = function () {
    console.log("Hello World");
}

function hello() {
    console.log("dhsfghdf");
} 
