$(function(){
    var curPage=1;
    var pageSize=5;
    function render(){
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                page:curPage,
                pageSize:pageSize
            },
            dataType:"json",
            success:function(info){
                console.log(info);
                var htmlStr=template("tpl-first",info);
                $(".lt-content .table tbody").html(htmlStr);
                // 分页
                $("#paginator").bootstrapPaginator({
                    currentPage:info.page,
                    totalPages:Math.ceil(info.total/info.size),
                    bootstrapMajorVersion:3,
                    numberOfPages:info.size,
                    onPageClicked:function(a,b,c,page){
                        curPage=page;
                        render();    
                    }
                });
            }
        });
    };
    render();
    
    $(".lt-content .btn-add").click(function(){
        $('#cate-modal').modal('show');
    });
    $(".btn-cancel").click(function(){
        $('#cate-modal').modal('hide');
    });       
    $("#formCate").bootstrapValidator({
        feedbackIcons:{
            valid: 'glyphicon glyphicon-ok',
　　　　　　　　  invalid: 'glyphicon glyphicon-remove',
　　　　　　　　  validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
            categoryName:{
                validators:{
                    notEmpty:{
                        message:"请输入一级分类名称"
                    }
                }
            }                    
        }
    });
    $('#formCate').on("success.form.bv", function( e ) {
        e.preventDefault();
        $.ajax({
            type:"post",
            url:"/category/addTopCategory",
            data:$('#formCate').serialize(),
            dataType:"json",
            success:function(info){
                if(info.success){
                    console.log(info);
                    $('#cate-modal').modal('hide');
                    curPage=1;
                    render();
                    $('#formCate').data('bootstrapValidator').resetForm(true);
                }
            }
        });
    });            
});