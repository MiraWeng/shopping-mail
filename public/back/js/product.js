$(function(){
    var curPage=1;
    var pageSize=2;
    // 1,已进入页面就进行分页渲染
    function render(){
        $.ajax({
            type:"get",
            url:"/product/queryProductDetailList",
            data:{
                page:curPage,
                pageSize:pageSize
            },
            dataType:"json",
            success:function(info){
                var htmlStr=template("tpl-product",info);
                $(".lt-content tbody").html(htmlStr);
                // 分页功能实现
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    currentPage:info.page,
                    totalPages:Math.ceil(info.total/info.size),
                    onPageClicked:function(a,b,c,page){
                        curPage=page;
                        render();
                    },
                    // 按钮上字体大小
                    size:"normal",
                    // 按钮上显示的文字
                    itemTexts: function( type, page, current ) {
                        // first 首页 last 尾页, prev 上一页, next 下一页, page 普通页码
                        // page 是当前按钮指向第几页
                        // current 是指当前是第几页 (相对于整个分页来说的)
                        switch(type){
                            case "first":
                            return "首页";
                            case "last":
                            return "尾页";
                            case "prev":
                            return "上一页";
                            case "next":
                            return "下一页";
                            case "page":
                            return page;
                        }
                    },
                    // 按钮的title
                    tooltipTitles:function(type,page,current){
                        switch(type){
                            case "first":
                            return "首页";
                            case "last":
                            return "尾页";
                            case "prev":
                            return "上一页";
                            case "next":
                            return "下一页";
                            case "page":
                            return "前往第"+page+"页";
                        }
                    },
                    useBootstrapTooltip: true                                
                });
            }
        });
    };
    render();
    // 2,点击添加商品按钮出现模态框
    $(".lt-content .btn-product").click(function(){
        $("#modal-product").modal('show');
        // 3,渲染模态框二级分类
        $.ajax({
            type:"get",
            url:"/category/querySecondCategoryPaging",
            data:{
                page:1,
                pageSize:100
            },
            dataType:"json",
            success:function(info){
                var htmlStr=template("tpl-modal",info);
                $(".dropdown-menu").html(htmlStr);
            }
        });
    });
    // 4,给二级分类注册事件委托,将取得的id给隐藏域提交
    $('.dropdown-menu').on( "click", "a", function() {
        var txt=$(this).text();
        var id=$(this).data("id");
        $('.menu-text').text(txt);
        $("[name='brandId']").val(id);
        //较验成功时
        $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID")
    });
    // 5,图片上传
    var picArr=[];
    $("#fileupload").fileupload({ 
        dataType:"json", 
        //e：事件对象 //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址 done:function (e, data) { console.log(data); 
        done:function (e, data) {
             picArr.unshift(data.result);
            //  console.log(data.result); 
             $("#imgBox").prepend('<img width="100" src='+data.result.picAddr+'>');
             if(picArr.length>3){
                picArr.pop();
                $("#imgBox img").eq(3).remove();
             }
             if(picArr.length===3){
                $('#form').data("bootstrapValidator").updateStatus("pic", "VALID")
             }
        }
    }); 
    // 6,表单较验
    $("#form").bootstrapValidator({
        // 将默认的排除项, 重置掉 (默认会对 :hidden, :disabled等进行排除)
        excluded: [],
    // 配置图标
        feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
            brandId:{
                validators:{
                    notEmpty:{
                        message:"请选择二级分类"
                    }
                }
            },
            proName:{
                validators:{
                    notEmpty:{
                        message:"请输入商品名称"
                    }
                }
            },
            proDesc:{
                validators:{
                    notEmpty:{
                        message:"请输入商品描述"
                    }
                }
            },
            num:{
                validators:{
                    notEmpty:{
                        message:"请输入商品库存"
                    },
                    regexp:{
                        regexp:/^[1-9]\d*$/,
                        message:"商品库存格式, 必须是非零开头的数字"
                    }
                }
            },
            size:{
                validators:{
                    notEmpty:{                
                        message:"请输入商品尺码"
                    },
                    regexp:{
                        regexp:/^\d{2}-\d{2}$/,
                        message:"尺码格式, 必须是 32-40"
                    }
                }
            },
            oldPrice:{
                validators:{
                    notEmpty:{
                        message:"请输入商品原价"
                    }
                }
            },
            price:{
                validators:{
                    notEmpty:{
                        message:"请输入商品价格"
                    }
                }
            },
            pic:{
                validators:{
                    notEmpty:{
                        message:"请上传3张图片"
                    }
                }
            },
        }
    });
    // 7,表单提交
    $("#form").on("success.form.bv",function(e){
        e.preventDefault();
        var params=$("#form").serialize();
        // console.log(params);
        // console.log(picArr);
        params+="&picName1="+picArr[0].picName+"&picAddr1="+picArr[0].picAddr;
        params+="&picName2="+picArr[1].picName+"&picAddr2="+picArr[1].picAddr;
        params+="&picName3="+picArr[2].picName+"&picAddr3="+picArr[2].picAddr;
        console.log(params);
        $.ajax({
            type:"post",
            url:" /product/addProduct",
            data:params,
            dataType:"json",
            success:function(info){
                console.log(info);
                if(info.success){
                //关闭模态框
                    $("#modal-product").modal('hide');
                //渲染页面
                    curPage=1;
                    render();
                //重置表单
                    $('#form').data("bootstrapValidator").resetForm(true);
                // 重置二级分类
                $('.menu-text').text("请选择二级分类");
                // 重置图片
                $("#imgBox img").remove();
                    
                }
                
            }
        });
    });
   
});