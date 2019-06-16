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
    // render();
    var curPage=1;
    var pageSize=4;
    function render(callback){
        var params={};
        var proName=$(".search .search-input").val(); 
        params.proName=proName;
        params.page=curPage;
        params.pageSize=pageSize;
        var $current=$(".sort a.current")
        if($current){
            var sortName=$current.data("type");
            var sortVal=$current.find("i").hasClass("fa-angle-down") ? 2 : 1;
            params[sortName]=sortVal;
        }
        setTimeout(function(){
            $.ajax({
                type:"get",
                url:"/product/queryProduct",
                data:params,
                dataType:"json",
                success:function(info){
                    callback&&callback(info);
                }
            });
        },500)
    };
    // 上拉加载和下拉刷新初始化
    mui.init({
        pullRefresh : {
          container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
          down : {  //下拉刷新
            height:50,//可选,默认50.触发下拉刷新拖动距离,
            auto: true,//可选,默认false.首次加载自动下拉刷新一次
            contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            callback :function(){ //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                // 下拉刷新肯定是到第一页刷新
                curPage=1;
                render(function(info){ 
                    var htmlStr=template("tpl",info);
                    $(".lt-product").html(htmlStr);
                    // 下拉刷新结束
                    mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                    // 启用下拉加载功能
                    mui('#refreshContainer').pullRefresh().enablePullupToRefresh();
                });
            }
          },
          up :{
            height:50,//可选.默认50.触发上拉加载拖动距离
            auto:false,//可选,默认false.自动上拉加载一次
            contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
            callback :function() {//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                curPage++;
                render(function(info) {
                    var htmlStr=template("tpl",info);
                    $(".lt-product").append(htmlStr);
                    // 上拉刷新结束
                    mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                });
            }
          }
        }
      });

    
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