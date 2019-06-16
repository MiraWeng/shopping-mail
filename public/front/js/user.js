$(function(){
    $.ajax({
        type:"get",
        url:"/user/queryUserMessage",
        dataType:"json",
        success:function(info){
            // console.log( info );
            if ( info.error === 400 ) {
                // 未登录
                location.href = "login.html";
                return;
            }
            // 已登录, 通过模板引擎渲染
            var htmlStr = template("tpl", info);
            $('#userInfo').html( htmlStr );
                }
    });
    $("#logout").click(function(){
        $.ajax({
            type:"get",
            url:"/user/logout",
            dataType:"json",
            success:function(info){
                // console.log(info);
                if(info){
                    location.href = "login.html";
                }
            }
        })
    });
});