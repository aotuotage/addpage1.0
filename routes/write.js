var express = require('express');
var router = express.Router();
var fs = require("fs");
var buf = new Buffer.alloc(1024);
let htmlTarget,cssTarget,reqtext,reqtexth5;

//pc图片目录
var pcimgpath;
//h5图片目录
var h5imgpath;
//pc部分
//pc端创建模板文件及css，img,html文件
router.get('/pc',function (req, res, next) {
    //读取输入文件名
    reqtext = req.query.text;
    //html模板文件名
    let htmlurl = './tmp/input.html';
    //css模板名
    let cssurl = './tmp/input.css';
    //html模板文件内容
    let htmltext;
    //html模板文件内容
    let csstext;
    //生成html文件名
    htmlTarget = "/Users/mac/desktop/hexindai_php/frontend/resources/views/www/promotion_"+reqtext+".blade.php";
    //生成css文件名
    cssTarget = "/Users/mac/desktop/hexindai_php/src/css/promotion_"+reqtext+".css";
    //生成js文件目录
    let jsCatalog = "/Users/mac/desktop/hexindai_php/src/js/promotion_"+reqtext;
    //生成js文件
    let jsTarget = "/Users/mac/desktop/hexindai_php/src/js/promotion_"+reqtext+"/zz_promotion_"+reqtext+".js";
    //img文件目录
    let imgTarget = "/Users/mac/desktop/hexindai_php/src/img";
    //service.js添加
    let service = "/Users/mac/desktop/hexindai_php/src/js/service.js";
    let result;
//js模板内容
let Template = `(function($) {
    var ${reqtext}_data = {nowrap: true};
    $callbacks['/promotion/${reqtext}'] = function (reload) {
        ${reqtext}_data = {nowrap: true};
        if (routerJS.state.userinfo && routerJS.state.userinfo.is_login) {
            ${reqtext}_data.is_login = true;
        }
        $.when($.promiseJSON.load('/promotion/${reqtext}'), $.promiseJSON.load('/userinfo'))
            .then(function (info, userinfo) {
                $.extend(${reqtext}_data, info, userinfo);
                inti_promotion_${reqtext}(${reqtext}_data);
            });
    };
    $callbacks['/promotion/${reqtext}_partial'] = function () {
        ${reqtext}_data = {nowrap: true};
        if (routerJS.state.userinfo && routerJS.state.userinfo.is_login) {
            ${reqtext}_data.is_login = true;
        }
        $.when($.promiseJSON.load('/promotion/${reqtext}'), $.promiseJSON.load('/userinfo'))
            .then(function (info, userinfo) {
                $.extend(${reqtext}_data, info, userinfo);
                inti_promotion_${reqtext}(${reqtext}_data);
            });
    };
    function inti_promotion_${reqtext}(${reqtext}_data) {
        var promotion_${reqtext}_wrap = nunjucks.render('promotion_${reqtext}.tpl', ${reqtext}_data);
        $(function() {
            $('#wrap').html(promotion_${reqtext}_wrap);
            bind_promotion_${reqtext}(${reqtext}_data);
        });
        return false;
    }
    function bind_promotion_${reqtext}(${reqtext}_data) {
        $('#wrap .pushstate').pushstate();
        $('#wrap .login-btn').on('click', function (e) {
            e.preventDefault();
            $.hx.show_login_layer();
        });
        //页面js区
        NProgress && NProgress.done();
    }
})(jQuery);`;
let servicetext = `.set('/promotion/${reqtext}', {
    'js': {
        path: 'promotion_${reqtext}.js',
        require: ['common','swiper']
    },
    'css': ['promotion_${reqtext}.css','swiper-3.4.2.min.css'],
    isStatic:true
})
.run();`;
    //html读写
    fs.open(htmlurl, 'r+', function(err,fd) {
        if (err) {
            return console.error(err);
        }
        //读取模板文件
        fs.readFile(htmlurl, function (err, data) {
            if (err) {
                return console.error(err);
            }
            htmltext = data.toString();
            fs.writeFile(htmlTarget,htmltext,function(error){
                if(error){
                    console.log(error);
                    return false;
                }
                console.log('写入html成功');
            });
        });
        fs.close(fd, function(err){
            if (err){
                console.log(err);
            }
            console.log("html文件关闭成功");
        });
    });
    //css读写
    fs.open(cssurl, 'r+', function(err,fd) {
        if (err) {
            return console.error(err);
        }
        //读取模板文件
        fs.readFile(cssurl, function (err, data) {
            if (err) {
                return console.error(err);
            }
            csstext = data.toString();
            fs.writeFile(cssTarget,csstext,function(error){
                if(error){
                    console.log(error);
                    return false;
                }
                console.log('写入css成功');
            });
        });
        fs.close(fd, function(err){
            if (err){
                console.log(err);
            }
            console.log("css文件关闭成功");
        });
    });
    //创建js文件
    fs.mkdir(jsCatalog,function(err){
        if (err) {
            return console.error(err);
        }
        console.log("js目录创建成功。");
        fs.writeFile(jsTarget,Template,function(error){
            if(error){
                console.log(error);
                return false;
            }
            console.log('写入js成功');
        });
    });
    //创建img文件
    fs.mkdir(imgTarget+"/"+reqtext,function(err){
        if (err) {
            return console.error(err);
        }
        pcimgpath = imgTarget+"/"+reqtext;
        console.log("img目录创建成功。");
    });

    //service.js读写
    fs.open(service, 'r+', function(err,fd) {
        if (err) {
            return console.error(err);
        }
        //读取模板文件
        fs.readFile(service, function (err, data) {
            if (err) {
                return console.error(err);
            }
            servicedata = data.toString();
            result = servicedata.replace(/.run\(\)\;/g, servicetext);
            fs.writeFile(service,result,function(error){
                if(error){
                    console.log(error);
                    return false;
                }
                console.log('写入service成功');
            });
        });
        fs.close(fd, function(err){
            if (err){
                console.log(err);
            }
            console.log("service文件关闭成功");
        });
    });

    //返回前端值
    res.send({"stutes":1});
});
//pc批量修改图片名
router.get('/img',function (req, res, next) {
    //读取输入文件名
    let stutes = 1;
    let reqtextimg = req.query.text;
    console.log(pcimgpath);
    fs.readdir(pcimgpath, function(err, files) {
        console.log(files.length);
        if(files.length === 0){
            stutes = 2;
            //返回前端值
            res.send({"stutes":stutes});
        }else {
            files.forEach(function(filename,index) {
                //运用正则表达式替换oldPath中不想要的部分
                let oldPath = pcimgpath + '/' + filename,
                    newPath = pcimgpath + '/' + filename.replace(/.+(?=\.jpg)|.+(?=\.png)/g, reqtextimg+index);
                fs.rename(oldPath, newPath, function(err) {
                    if (!err) {
                        console.log(filename + '替换成功!')
                    }
                })
            });
            //返回前端值
            res.send({"stutes":stutes});
        }
    });
});
//pc端页面生成
router.post('/banner',function (req, res, next) {
    console.log(req.body);
    let rbody = req.body;
    //html模板文件名
    let htmlurl = './tmp/input.html';
    //css模板名
    let cssurl = './tmp/input.css';
    let htmltext;
    //标题
    let title = "('title', '"+rbody.input_title+"')";
    let key = "('keywords', '"+rbody.input_key+"')";

    //本地模板操作
    fs.readFile(htmlTarget, function (err, data) {
        if (err) {
            return console.error(err);
        }
        htmltext = data.toString();
        //匹配dom节点
        let newhtml = htmltext.replace(/\('title', '.+'\)/g, title);
        let nuwkey = newhtml.replace(/\('keywords', '.+'\)/g, key);
        let newdom= `@section('content')
${rbody.div_html}`;
        let addhtml = nuwkey.replace(/@section\('content'\)/g, newdom);
        console.log(rbody.div_html);
        fs.writeFile(htmlTarget,addhtml,function(error){
            if(error){
                console.log(error);
                return false;
            }
            console.log('写入html成功');
        });
    });
    //css样式追加
    let div_num= rbody.div_num;
    let alert_num= rbody.alert_num;
    let divCssStyle = ``;
//添加div样式
for(let i =1;i<=div_num;i++){
    let bgimg = eval("rbody.div"+i+"_bgimg");
    let width = eval("rbody.div"+i+"_width");
    let height = eval("rbody.div"+i+"_height");
let divtextContent = `
.${reqtext} .establish${i}{
    width: ${width}px;
    height: ${height}px;
    margin: 0 auto;
    padding: 10px;
    background: url(//static.hexindai.com/lv2/img/${reqtext}/${bgimg}) no-repeat 50%;
    position: relative;
}`;
    divCssStyle+=divtextContent;
}
//添加alert样式
for(let i =1;i<=alert_num;i++){
        let bgimg = eval("rbody.alert"+i+"_bgimg");
        let width = eval("rbody.alert"+i+"_width");
        let height = eval("rbody.alert"+i+"_height");
        let alertContent = `
.${reqtext} .alert_dark${i}{
    width:100%;
    height:100%;
    position: fixed;
    top:0;
    background:rgba(000,000,000,.8);
    display:none;
}        
.${reqtext} .alert${i}{
    width: ${width}px;
    height: ${height}px;
    position:absolute;
    top:50%;
    left:50%;
    margin-left:${width/2}px;
    margin-top:${height/2}px;
    padding: 10px;
    background: url(//static.hexindai.com/lv2/img/${reqtext}/${bgimg}) no-repeat 50%;
    z-index:999;
}`;
        divCssStyle+=alertContent;
}

let newcss =`
.${reqtext}{
    background:${rbody.input_bgcolor};
}
.${reqtext} .banner{
    width: 100%;
    height: ${rbody.banner_height}px;
    background: url(//static.hexindai.com/lv2/img/${reqtext}/${rbody.banner_name}) no-repeat 50%;
    position: relative;
}`;
    divCssStyle+=newcss;
        fs.appendFile(cssTarget,divCssStyle,function(error){
            if(error){
                console.log(error);
                return false;
            }
            console.log('追加css成功');
        });
    //返回前端值
    res.send({"stutes":1});
});

// h5部分
// h5端创建三文件
router.get('/h5',function (req, res, next) {
    //读取输入文件名
    reqtexth5 = req.query.text;
    //html模板文件名
    let htmlurl = './tmp/inputh5.html';
    //css模板名
    let cssurl = './tmp/input.css';
    //html模板文件内容
    let htmltext;
    //html模板文件内容
    let csstext;
    //生成html文件名
    htmlTarget = "/Users/mac/desktop/hexindai_php/frontend/resources/views/mp/"+reqtexth5+"_mobile.blade.php";
    //生成css文件名
    cssTarget = "/Users/mac/desktop/hexindai_php/src/mp.css/"+reqtexth5+".css";
    //img文件目录
    let imgTarget = "/Users/mac/desktop/hexindai_php/src/mp.img";
    //html读写
    fs.open(htmlurl, 'r+', function(err,fd) {
        if (err) {
            return console.error(err);
        }
        //读取模板文件
        fs.readFile(htmlurl, function (err, data) {
            if (err) {
                return console.error(err);
            }
            htmltext = data.toString();
            fs.writeFile(htmlTarget,htmltext,function(error){
                if(error){
                    console.log(error);
                    return false;
                }
                console.log('写入html成功');
            });
        });
        fs.close(fd, function(err){
            if (err){
                console.log(err);
            }
            console.log("html文件关闭成功");
        });
    });
    //css读写
    fs.open(cssurl, 'r+', function(err,fd) {
        if (err) {
            return console.error(err);
        }
        //读取模板文件
        fs.readFile(cssurl, function (err, data) {
            if (err) {
                return console.error(err);
            }
            csstext = data.toString();
            fs.writeFile(cssTarget,csstext,function(error){
                if(error){
                    console.log(error);
                    return false;
                }
                console.log('写入css成功');
            });
        });
        fs.close(fd, function(err){
            if (err){
                console.log(err);
            }
            console.log("css文件关闭成功");
        });
    });
    //创建img文件
    fs.mkdir(imgTarget+"/"+reqtexth5,function(err){
        if (err) {
            return console.error(err);
        }

        h5imgpath = imgTarget+"/"+reqtexth5;
        console.log("img目录创建成功。");
    });
    //返回前端值
    res.send({"stutes":1});
});
//h5批量修改图片名
router.get('/imgh5',function (req, res, next) {
    //读取输入文件名
    let stutes = 1;
    let reqtextimg = req.query.text;
    console.log(h5imgpath);
    fs.readdir(h5imgpath, function(err, files) {
        console.log(files.length);
        if(files.length === 0){
            stutes = 2;
            //返回前端值
            res.send({"stutes":stutes});
        }else {
            files.forEach(function(filename,index) {
                //运用正则表达式替换oldPath中不想要的部分
                let oldPath = h5imgpath + '/' + filename,
                    newPath = h5imgpath + '/' + filename.replace(/.+(?=\.jpg)|.+(?=\.png)/g, reqtextimg+index);
                fs.rename(oldPath, newPath, function(err) {
                    if (!err) {
                        console.log(filename + '替换成功!')
                    }
                })
            });
            //返回前端值
            res.send({"stutes":stutes});
        }
    });
});
//h5端页面生成
router.post('/bannerh5',function (req, res, next) {
    console.log(req.body);
    let rbody = req.body;
    //html模板文件名
    let htmlurl = './tmp/inputh5.html';
    //css模板名
    let cssurl = './tmp/input.css';
    let htmltext;
    //标题
    let title = `<title>${rbody.input_title}</title>
    <link rel="stylesheet" href="//static.hexindai.com/lv2/mp.css/${reqtexth5}.css"/>`;
    let key = "<meta name='keywords' content='"+rbody.input_key+"'>";

    //本地模板操作
    fs.readFile(htmlTarget, function (err, data) {
        if (err) {
            return console.error(err);
        }
        htmltext = data.toString();
        //匹配dom节点
        let newhtml = htmltext.replace(/<title>.+<\/title>/g, title);
        let nuwkey = newhtml.replace(/<meta name="keywords" content=.+>/g, key);
        let newdom= `${rbody.div_html}
@include('www.layouts.analysis', ['isMobile'=>'true'])`;
        let addhtml = nuwkey.replace(/@include\('www.layouts.analysis', \['isMobile'=>'true'\]\)/g, newdom);
        console.log(rbody.div_html);
        fs.writeFile(htmlTarget,addhtml,function(error){
            if(error){
                console.log(error);
                return false;
            }
            console.log('写入html成功');
        });
    });
    //css样式追加
    let div_num= rbody.div_num;
    let alert_num= rbody.alert_num;
    let divCssStyle = ``;
//添加div样式
    for(let i =1;i<=div_num;i++){
        let bgimg = eval("rbody.div"+i+"_bgimg");
        let width = eval("rbody.div"+i+"_width");
        let height = eval("rbody.div"+i+"_height");
        let divtextContent = `
.${reqtexth5} .establish${i}{
    width: ${width}px;
    height: ${height}px;
    margin: 0 auto;
    padding: 10px;
    background: url(//static.hexindai.com/lv2/mp.img/${reqtexth5}/${bgimg}) no-repeat 50%;
    position: relative;
}`;
        divCssStyle+=divtextContent;
    }
//添加alert样式
    for(let i =1;i<=alert_num;i++){
        let bgimg = eval("rbody.alert"+i+"_bgimg");
        let width = eval("rbody.alert"+i+"_width");
        let height = eval("rbody.alert"+i+"_height");
        let alertContent = `
.${reqtexth5} .alert_dark${i}{
    width:100%;
    height:100%;
    position: fixed;
    top:0;
    background:rgba(000,000,000,.8);
    display:none;
}        
.${reqtexth5} .alert${i}{
    width: ${width}px;
    height: ${height}px;
    position:absolute;
    top:50%;
    left:50%;
    margin-left:${width/2}px;
    margin-top:${height/2}px;
    padding: 10px;
    background: url(//static.hexindai.com/lv2/mp.img/${reqtexth5}/${bgimg}) no-repeat 50%;
    z-index:999;
}`;
        divCssStyle+=alertContent;
    }

    let newcss =`
.${reqtexth5}{
    background:${rbody.input_bgcolor};
}
.${reqtexth5} .banner{
    width: 100%;
    height: ${rbody.banner_height}px;
    background: url(//static.hexindai.com/lv2/mp.img/${reqtexth5}/${rbody.banner_name}) no-repeat 50%;
    position: relative;
}`;
    divCssStyle+=newcss;
    fs.appendFile(cssTarget,divCssStyle,function(error){
        if(error){
            console.log(error);
            return false;
        }
        console.log('追加css成功');
    });
    //返回前端值
    res.send({"stutes":1});
});
module.exports = router;
