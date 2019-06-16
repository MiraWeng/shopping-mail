$(function(){
    // 已进入页面就从后台拿数据渲染
    render();
    function render(){
        $.ajax({
            type:"get",
            url:"/cart/queryCart",
            dataType:"json",
            success:function(info){
                console.log(info);
                if(info.error==400){
                    //未登录
                    location.href="login.html";
                }
                var htmlStr=template("tpl",{info:info})
                $("#OA_task_2").html(htmlStr);
                console.log(mui('#refreshContainer').pullRefresh().endPulldownToRefresh());
            }
        });
    }; 
    // 下拉刷新初始化
    mui.init({
        pullRefresh : {
          container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
          down : {
            height:50,//可选,默认50.触发下拉刷新拖动距离,
            auto: false,//可选,默认false.首次加载自动下拉刷新一次
            contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            callback :function(){//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                render();
            } 
          }
        }
      });
    // 删除功能
    $("#OA_task_2").on("click",".btn-del",function(){
        var id=$(this).parent().data("id");
        $.ajax({
            type:"get",
            url:"/cart/deleteCart",
            data:{
                id:id
            },
            dataType:"json",
            success:function(info){
                if(info.success){
                    render();
                }  
            }
        });
    });
    // 编辑功能,id num,size
    $("#OA_task_2").on("click",".btn-edit",function(){
        var obj=this.dataset;
        console.log(obj);
        var htmlStr=template("edit-tpl",obj);
        htmlStr=htmlStr.replace(/\n/g,"");
        mui.confirm(htmlStr,"编辑商品",["确认","取消"],function(e){
            var size=$(".modal-size span.current").text();
            var num=$(".modal-num input").val();
            var id=obj.id;
            if(e.index==0){
                $.ajax({
                    type:"post",
                    url:"/cart/updateCart",
                    data:{
                        id:id,
                        size:size,
                        num:num
                    },
                    dataType:"json",
                    success:function(info){
                        if(info.success){
                            render();
                        }  
                    }
                });
            }
        });
        // 手动初始化数字框
        mui(".modal-num .mui-numbox").numbox();
        // 选择尺寸
        $("body").on("click",".modal-size span",function(){
            $(this).addClass("current").siblings().removeClass("current");
        });
    });

});