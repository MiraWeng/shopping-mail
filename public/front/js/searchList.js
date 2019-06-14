$(function(){
     // 从地址栏得到参数
    function getSearch(){
        // 从地址栏得到参数并且正确解码
        var search=decodeURI(location.search);
        // 去掉问号
        var str=search.slice(1);
        var arr=str.split("=");
        // 得到值
        var val=arr[1];
        return val;
    };
    // 得到地址栏参数值
    // 将地址栏的参数赋值给搜索框
    $(".search .search-input").val(getSearch());  
    // 1,进入页面渲染
    render();
    function render(){
        var params={};
        var proName=$(".search .search-input").val(); 
        params.proName=proName;
        params.page=1;
        params.pageSize=100;
        var $current=$(".sort a.current")
        if($current){
            var sortName=$current.data("type");
            var sortVal=$current.find("i").hasClass("fa-angle-down") ? 2 : 1;
            params[sortName]=sortVal;
        }
        $.ajax({
            type:"get",
            url:"/product/queryProduct",
            data:params,
            dataType:"json",
            success:function(info){
                console.log(info);
                var htmlStr=template("tpl",info);
                $(".lt-product").html(htmlStr);
            }
        });
    };
    // 点击搜索框搜索并且搜索内容写进搜索历史
    $(".search .search-btn").click(function(){
        // 将新输入的写入历史记录
        var key=$(".search .search-input").val();
        var arr=getHistory();
        var index=arr.indexOf(key);
        // 存在这个值就删除
        if(index!=-1){
            arr.splice(index,1);
        }
        arr.unshift(key);
        if(arr.length>10){
            arr.pop();
        }
        localStorage.setItem("searchList",JSON.stringify(arr));
        // 重新渲染
        render();

    });
    //排序
    $(".sort a[data-type]").click(function(){
        // 点排序按钮样式变化
        if(!$(this).hasClass("current")){
            $(this).addClass("current").siblings().removeClass("current");  
        }
        $(this).find("i").toggleClass("fa fa-angle-down").toggleClass("fa fa-angle-up");
        // 产品展示变化
        render();

    });

   
   
});