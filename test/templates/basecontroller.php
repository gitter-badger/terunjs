<?php

class BaseController {
    public $title = "Hello";


    function index(){
        return ["base"=>"base.js"];
    }
}