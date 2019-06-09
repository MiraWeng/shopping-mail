
// 进度条
$(document).ajaxStart(function(){
    NProgress.start();
});
$(document).ajaxStop(function(){
    // 模拟网络延迟
    setTimeout(function(){
        NProgress.done();
    },500);
});

//登录拦截
if(location.href.indexOf("login.html")===-1){
    $.ajax({
        type:"get",
        url:"/employee/checkRootLogin",
        dataType:"json",
        success:function(info){
            if(info.success){
                console.log(info);
            }
            if(info.error===400){
                location.href="login.html";
            }            
        }
    });
}



$(function(){
    // 分类管理
    $(".lt-aside .nav .category").click(function(){
        $(this).next().stop().slideToggle();
    });

    // 顶部菜单栏切换显示功能
    $(".lt-topbar .menu").click(function(){
        $(".lt-aside").toggleClass("hidemenu");
        $(".lt-main").toggleClass("hidemenu");
        $(".lt-topbar").toggleClass("hidemenu");
    });
    //点击退出显示模态框
    $(".lt-topbar .logout").click(function(){
        $('#myModal').modal('show');
    });

    // 点退出按钮退出
    $(".logoutBtn").click(function(){
        $.ajax({
            url:"/employee/employeeLogout",
            type:"get",
            dataType:"json",
            success:function(info){
                if(info.success){
                    location.href="login.html";
                }
            }
        });
    });

});
