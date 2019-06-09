$(function(){
    var curPage=1;
    var pageSize=5;
    render();
    function render(){
        $.ajax({
            type:"get",
            url:"/user/queryUser",
            data:{
                page:curPage,
                pageSize:pageSize
            },
            dataType:"json",
            success:function(info){
                console.log(info);
                var htmlStr=template("tpl-user",info);
                $('.lt-content tbody').html( htmlStr );
                // 分页
                $('#paginator').bootstrapPaginator({
                    currentPage: info.page,//当前的请求页面。
                    totalPages: Math.ceil(info.total/pageSize),//一共多少页。
                    size:"normal",//应该是页眉的大小。
                    bootstrapMajorVersion: 3,//bootstrap的版本要求。
                    alignment:"right",
                    numberOfPages:info.size,//一页列出多少数据。
                    itemTexts: function (type, page, current) {//如下的代码是将页眉显示的中文显示我们自定义的中文。
                           switch (type) {
                           case "first": return "首页";
                           case "prev": return "上一页";
                           case "next": return "下一页";
                           case "last": return "末页";
                           case "page": return page;
                           }
                       },
                    onPageClicked:function(a,b,c,page){
                        curPage=page;
                        render();
                    }
                   });
            }
        });
    }
//禁用启用切换模态框
    $(".lt-content tbody").on("click",".btn",function(){    
        $('#modal-user').modal('show');
        var id=$(this).parent().data("id");
        var isDelete=$(this).hasClass("btn-danger")?0:1;
        $("#modal-user .cancel").click(function(){
            $('#modal-user').modal('hide');
        });
        $("#modal-user .confirm").click(function(){
            $.ajax({
                type:"post",
                url:"/user/updateUser",
                data:{
                    id:id,
                    isDelete:isDelete
                },
                dataType:"json",
                success:function(info){
                    if ( info.success ) {
                        // 关闭模态框
                        $('#modal-user').modal("hide");
                        // 重新渲染
                        render();
                    }
                }
            });
            
        });
        
    });
    
});