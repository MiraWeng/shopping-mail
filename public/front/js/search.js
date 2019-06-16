$(function(){
    // 进入页面就开始渲染
    render();
    
    //根据历史记录渲染列表
    function render(){
        var arr= getHistory();
            var htmlStr=template("tpl",{arr:arr});
            $(".history").html(htmlStr);
    };
    // 清空记录
    $(".history").on("click",".btn-clear",function(){
        // 弹出框
        mui.confirm("你确定要清空历史记录吗","温馨提示",["取消","确认"],function(e){
            if(e.index===1){
                localStorage.removeItem("searchList");
                render();
            }
        });
    });
    // 删除单条记录
    $(".history").on("click",".btn-del",function(){
        var that=this;
        // 弹出框
        mui.confirm("你确定要删除该条记录吗","温馨提示",["取消","确认"],function(e){
            if(e.index===1){
                var arr= getHistory();
                var index=$(that).data("index");
                arr.splice(index,1);
                localStorage.setItem("searchList",JSON.stringify(arr));        
                render();
            }
        });
        
    });
    //添加记录
    $(".search .search-btn").click(function(){
        var key=$(".search .search-input").val().trim();
        if(key===""){
            mui.toast("请输入搜索关键字",{ duration:2000});
            return;
        }
        var arr=getHistory();
        // 数组去重
        var index=arr.indexOf(key)
        if(index!=-1){
            arr.splice(index,1);
        }
        arr.unshift(key);
        // 搜索记录在10条以内
        if(arr.length>10){
            arr.pop();
        }
        localStorage.setItem("searchList",JSON.stringify(arr));
        render();
        $(".search .search-input").val("");
        location.href="searchList.html?key="+key;
    });
    // 点击搜索按钮调到产品展示页面
    // $(".search .search-btn").click(function(){
    //     var key=$(".search-input").val();

    //     if(key.trim()===""){
    //         alert("请输入搜索关键字");
    //         return;
    //     }
    //     
    // })
});
