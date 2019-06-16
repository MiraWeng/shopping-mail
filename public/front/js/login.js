$(function(){
    $(".btn-login").click(function(){
        var username=$(".lt-main .username").val();
        var password=$(".lt-main .password").val();
        if(username.trim()===""){
            mui.toast("请输入用户名");
            return;
        }
        if(password.trim()===""){
            mui.toast("请输入密码");
            return;
        };
        $.ajax({
            type:"post",
            url:" /user/login",
            data:{
                username:username,
                password:password
            },
            dataType:"json",
            success:function(info){
                console.log(info);
                if(info.success){
                    // 登录成功,如果是从详情页过来的跳回详情页,否则跳到个人中心
                    if(location.search.indexOf("reUrl")>-1){
                        location.href=location.search.replace("?reUrl=","");
                    }
                    else{
                        location.href="user.html";
                    }
                }
                if(info.error){
                    mui.toast("用户名或密码错误");
                }
            }
        });
    });
    
})