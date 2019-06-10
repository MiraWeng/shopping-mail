$(function(){
    //1,进入页面就渲染分页
    var curPage=1;
    var pageSize=6;
    function render(){
        $.ajax({
            type:"get",
            url:"/category/querySecondCategoryPaging",
            data:{
                page:curPage,
                pageSize:pageSize
            },
            dataType:"json",
            success:function(info){
                    var htmlStr=template("tpl-cate",info);
                    $(".lt-content .table tbody").html(htmlStr);   
    // 2,分页功能实现
                    $("#paginator").bootstrapPaginator({
                        bootstrapMajorVersion:3,
                        currentPage:info.page,
                        totalPages:Math.ceil(info.total/info.size),
                        onPageClicked:function(a,b,c,page){
                            curPage=page;
                            render();
                        }
                    });        
            }
        });
    };
    render();
    // 3,点击分类按钮显示模态框
    $(".btn-add").click(function(){
        $('#myModal-cate').modal('show');
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                page:1,
                pageSize:100
            },
            dataType:"json",
            success:function(info){
                // 渲染下拉菜单
                var htmlStr=template("tpl-dragdown",info);
                $(".modal-body .dropdown-menu").html(htmlStr);
            }
        });
    });
// 点击下拉框选中一级分类
    $(".dropdown-menu").on("click","a",function(){
        $(".menu-text").text($(this).text());
// 将categoryId存于对应隐藏域中
        $(".categoryId").val($(this).data("id"));
        $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");
    });
    
    // 4,图片预览
    $('#fileupload').fileupload({
        // 指定数据类型为 json
        dataType: "json",
        // done, 当图片上传完成, 响应回来时调用
        done: function( e, data ) {
          console.log( data )
          // 获取上传成功的图片地址
          var picAddr = data.result.picAddr;
          // 设置图片地址
          $('#imgBox img').attr("src", picAddr);
// brandlogo将图片地址存在隐藏域中
          $('[name="brandLogo"]').val( picAddr );
    
          // 重置校验状态
          $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID")
        }
      });
    //   5,表单验证
    $("#form").bootstrapValidator({
        excluded: [],
        // 配置图标
        feedbackIcons:{
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
          fields:{
            categoryId:{
                validators:{
                    notEmpty:{
                        message:"一级分类不能为空"
                    }
                }
            },
            brandLogo:{
                validators:{
                    notEmpty:{
                        message:"二级分类不能为空"
                    }
                }
            },
            brandName:{
                validators:{
                    notEmpty:{
                        message:"请上传图片"
                    }
                }
            }
        }
    });
    $("#form").on("success.form.bv", function( e ) {
        // 阻止默认的提交
        e.preventDefault();
        
        $.ajax({
            url: "/category/addSecondCategory",
            type: "post",
            data: $('#form').serialize(),
            success: function( info ) {
              // 关闭模态框
              $('#myModal-cate').modal("hide");
              // 重置表单里面的内容和校验状态
              $('#form').data("bootstrapValidator").resetForm( true );
      
              // 重新渲染第一页
              curPage = 1;
              render();
      
              // 找到下拉菜单文本重置
              $('.menu-text').text("请选择1级分类")
      
              // 找到图片重置
              $('#imgBox img').attr("src", "images/none.png")
            }
          })
        })
    
});