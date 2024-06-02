// ==UserScript==
// @name         国家开放大学视频一键挂机脚本
// @namespace    http://tampermonkey.net/
// @version      2024-06-01
// @description  国家开放大学视频一键挂机脚本
// @author       OrangeMinus
// @match        https://lms.ouchn.cn/course/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ouchn.cn
// @require https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {

    // 页面加载完成执行绑定
    $(function () {
        setTimeout(function (){
            const activity = document.getElementsByClassName("learning-activity ng-scope")
            for (const element of activity) {
                let id =  extractNumber(element.id)
                let activityValue = element.getElementsByClassName("attribute-value number ng-binding")
                console.log(activityValue)
                if (activityValue.length>0) {
                    let activityTimeStr = activityValue[0].textContent
                    let time = timeStringToSeconds(activityTimeStr);
                    let operationElement = element.getElementsByClassName("activity-operations-container")[0];
                    let btnHtml = '<span id="auto-button" class="button button-green small gtm-label" style="font-size: 12px; width: 58px; margin-left: 4px;" data-activity-id="'+id+'" data-time="'+time+'">直接挂机</span>';
                    $(element).before(btnHtml)
                    console.log("课程id:",id,"时间:",time);
                }
            }
            $(document).on('click', '#auto-button', function () {
                console.log(this.dataset)
                requestActivitiesRead(this.dataset.activityId,this.dataset.time)
            });
        },5000)

    });

    function requestActivitiesRead(id,end){
        $.ajax({
            type: "POST",
            url: "https://lms.ouchn.cn/api/course/activities-read/"+id,
            contentType: 'application/json',
            data: JSON.stringify({
                start: 0,
                end: parseInt(end),
            }),
            success: function (response) {
                console.log('响应结果',response);
            }
        });
    }

    function timeStringToSeconds(timeString) {
        // 按冒号分割字符串
        var parts = timeString.split(':');

        // 将每个部分转换为整数
        var hours = parseInt(parts[0], 10);
        var minutes = parseInt(parts[1], 10);
        var seconds = parseInt(parts[2], 10);

        // 计算总秒数
        var totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

        return totalSeconds;
    }

    function extractNumber(str) {
        // 找到最后一个连字符的位置
        var lastDashIndex = str.lastIndexOf('-');
        // 提取该位置之后的子字符串
        return str.substring(lastDashIndex + 1);
    }
})();

