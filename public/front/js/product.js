$(function(){
    // 渲染searchList的时候把productId放在了地址栏,点击跳转到详情页后取到对应的ID
    var search=location.search;
    var str=search.slice(1);
    var id=str.split("=")[1];
    $.ajax({
        type:"get",
        url:"/product/queryProductDetail",
        data:{
            id:id
        },
        dataType:"json",
        success:function(info){
            console.log(info);
            var htmlStr=template("tpl",info);
            $(".lt-main .mui-scroll").html(htmlStr);
            // 动态生成的轮播图手动初始化
            // 获得slider插件对象
            var gallery = mui('.mui-slider');
            gallery.slider({
            interval:2000 //自动轮播周期，若为0则不自动播放，默认为0；
            });
            // 动态生成的数字框手动初始化
            mui(".mui-numbox").numbox();
        }
    });
    // 给尺码框添加选中事件
    $(".lt-main").on("click",".item-box .size",function(){
        $(this).addClass("current").siblings().removeClass("current");
    });

    // 加入购物车点击事件
    $(".lt-toCart .add-cart").click(function(){
        if($(".lt-main .size").hasClass("current")){
            var num=$("#num").val();
            var size=$(".lt-main .size.current").text();
            $.ajax({
                type:"post",
                url:"/cart/addCart",
                data:{
                    productId:id,
                    num:num,
                    size:size
                },
                success:function(info){
                    // 登录了的话提示跳到购物车
                    if(info.success){
                        mui.confirm( "添加成功", "温馨提示", ["去购物车", "继续浏览"],function(e) {
                            if ( e.index === 0 ) {
                              // 去购物车
                              location.href = "cart.html";
                            }
                          })
                    }
                    // 没登录跳转到登录页面,将本页地址传过去,返回的时候直接从地址栏拿到
                    if(info.error==400){
                        location.href="login.html?reUrl="+location.href;
                    }  
                }
            });
        }
        else{
            mui.toast("请选择尺码");
            return;
        }
    });
});