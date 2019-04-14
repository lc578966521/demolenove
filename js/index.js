$(function(){
    // 滑动隐藏header
    var scrollStartH = 0;
    var scrollMoveH = 0;
    var scrollChangeH = 0;
    var downloadAppIndex = false;
    $(document).on("touchstart",function(e){
        scrollStartH = e.targetTouches[0].clientY;
    });
    $(document).on("touchmove",function(e){
        scrollMoveH = e.targetTouches[0].clientY;
        scrollChangeH = scrollMoveH-scrollStartH;
        if(downloadAppIndex == false){
            if(scrollChangeH < -98){
                $(".downloadApp").css("display","none");
                $(".top-nav").css("display","none");
                $("header").height("1.226667rem");
                $(".search-bar").css("top",0);
            }else if(scrollChangeH > 10){
                $(".downloadApp").css("display","block");
                $(".top-nav").css("display","block");
                $("header").height("3.866667rem");
                $(".search-bar").css("top","2.613333rem");
            }
        }else{
            if(scrollChangeH < -42){
                $(".top-nav").css("display","none");
                $("header").height("1.226667rem");
                $(".search-bar").css("top",0);
            }else if(scrollChangeH > 10){
                $(".top-nav").css("display","block");
                $("header").height("2.346667rem");
                $(".search-bar").css("top","1.12rem");
            }
        }
        
    });
    // 点击关闭downloadapp
    $(".downloadApp .download-close").tap(function(){
        $(".downloadApp").css("display","none");
        $("header").height("2.346667rem");
        $(".top-nav").css("top",0);
        $(".search-bar").css("top","1.12rem");
        downloadAppIndex = true;
    });
    // 动态添加前后两张图片
    var boxWidth = $(".rotation-content").width();
    var imgBox = $(".rotation-content").find("ul:first-of-type");
    var firstImg = imgBox.find("li:first");
    var lastImg = imgBox.find("li:last");
    lastImg.clone().prependTo(imgBox);
    firstImg.clone().appendTo(imgBox);

    var lis = imgBox.find("li");
    imgBox.css("width",lis.length*100+"%");
    lis.each(function (index, value) {
        $(lis[index]).css("width",100/lis.length+"%");
    });
    imgBox.css("left","-100%");
    var bannerIndex = 1;
    //轮播图自动效果
    function animateStart(){
        imgBox.animate({left:-bannerIndex*100+"%"},200,"linear",function(){
            if(bannerIndex == lis.length - 1){
                bannerIndex = 1;
                imgBox.css("left",-bannerIndex*100+"%");
            }else if(bannerIndex == 0){
                bannerIndex = lis.length - 2;
                imgBox.css("left",-bannerIndex*100 + "%");
            }
            $(".rotation-swiper span").removeClass("active");
            $(".rotation-swiper span:eq("+bannerIndex+")").addClass("active");
        });
    }
    var timerId = setInterval(function(){
        bannerIndex++;
        animateStart();
    },2000);
    //轮播图手动效果
    var touchStartx = 0;
    var touchMovex = 0;
    var touchChangex = 0;
    imgBox.on("touchstart",function(e){
        clearInterval(timerId);
        touchStartx = e.targetTouches[0].clientX;
    });
    imgBox.on("touchmove",function(e){
        clearInterval(timerId);
        touchMovex = e.targetTouches[0].clientX;
        touchChangex = touchMovex - touchStartx;
        imgBox.css("left",-bannerIndex*boxWidth + touchChangex + "px");
    });
    imgBox.on("touchend",function(e){
        console.log(touchChangex);
        if(Math.abs(touchChangex) > boxWidth/3){
            if(touchChangex > 0){
                console.log("--");
                bannerIndex--;
            }else if(touchChangex < 0){
                console.log("++");
                bannerIndex++;
            }
            imgBox.css("transition","all 0.2s linear");
            imgBox.css("left",-bannerIndex*boxWidth + "px");
            animateStart();
        }else if(Math.abs(touchChangex) > 0){
            imgBox.css("transition","none");
            animateStart();
        }
        setTimeout(function(){
            timerId = setInterval(function(){
                bannerIndex++;
                animateStart();
            },2000);
        },300);
    });
    // 倒计时效果
    var em1 = $(".spike-time span em").eq(0);
    var em2 = $(".spike-time span em").eq(1);
    var em3 = $(".spike-time span em").eq(2);
    timeBack();
    function timeBack(backTime){
        var totalTime = 3605;
        setInterval(function(){
            var hour = Math.floor(totalTime/3600);
            var minute = Math.floor(totalTime%3600/60);
            var second = Math.floor(totalTime%60);
            if(Math.floor(hour/10) == 0){
                em1.html("0"+hour);
            }else{
                em1.html(hour);
            }
            if(Math.floor(minute/10) == 0){
                em2.html("0"+minute);
            }else{
                em2.html(minute);
            }
            if(Math.floor(second/10) == 0){
                em3.html("0"+second);
            }else{
                em3.html(second);
            }
            totalTime--;
        },1000);
    }
    //限时秒杀左右拖动效果
    drag(".spike-content ul",10);
    //新品预约左右拖动效果
    drag(".new-order-content ul",10);
    function drag(element,otherWidth){
        var newOrderStart = 0;
        var newOrderMove = 0;
        var newOrderEnd = 0;
        var newOrderChange = 0;
        var leftIndexStart = 0
        var boxWidth = $(element).children("li").width();
        var count = (boxWidth+otherWidth)*$(element).children("li").length - $(element).parent().width();
        $(element).on("touchstart",function(e){
            newOrderStart = e.targetTouches[0].clientX;
            leftIndexStart = parseInt($(this).css("left"));
        });
        $(element).on("touchmove",function(e){
            newOrderMove = e.targetTouches[0].clientX;
            // console.log(newOrderChange);
            // console.log(newOrderMove - newOrderStart);
            newOrderEnd = newOrderMove - newOrderStart;
            $(this).css("left",newOrderMove - newOrderStart + newOrderChange);
            var leftIndex = parseInt($(this).css("left"));
            if(leftIndex > 0 ){
                $(this).css("left", 0);
                newOrderEnd = newOrderEnd - leftIndex;
            }else if(leftIndex < -count){
                $(this).css("left","-"+count+"px");;
                newOrderEnd = -count - leftIndexStart;
            }
        });
        $(element).on("touchend",function(e){
            newOrderChange = newOrderChange + newOrderEnd;
            if(newOrderChange < -count){
                $(this).css("left","-"+count+"px");
            }else if(newOrderChange > 0){
                $(this).css("left", 0);
            }else{
                $(this).css("left",newOrderChange);
            }
        });
    }
})