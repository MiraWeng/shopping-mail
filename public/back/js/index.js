$(function(){
    // 基于准备好的dom，初始化echarts实例
    var myChart1 = echarts.init(document.getElementsByClassName('echarts1')[0]);

        // 指定图表的配置项和数据
        var option1 = {
            title: {
                text: '2017年注册人数'
            },
            tooltip: {},
            legend: {
                data:['人数']
            },
            xAxis: {
                data: ["1月","2月","3月","4月","5月","6月"]
            },
            yAxis: {
                // data:["0","100","200","300","400","500"] 
            },
            series: [{
                name: '人数',
                type: 'bar',
                data: [100, 20, 360, 180, 410, 220]
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart1.setOption(option1);


        var myChart2 = echarts.init(document.getElementsByClassName('echarts2')[0]);
        var option2 = {
            title : {
                text: '热门品牌销售',
                subtext: '2019年6月',
                x:'center'
            },
            tooltip : {
                trigger: 'none',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['阿迪','耐克','阿迪王','新百伦','李宁']
            },
            series : [
                {
                    name: '品牌',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:335, name:'阿迪'},
                        {value:310, name:'耐克'},
                        {value:234, name:'阿迪王'},
                        {value:135, name:'新百伦'},
                        {value:1548, name:'李宁'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        myChart2.setOption(option2);
        

});