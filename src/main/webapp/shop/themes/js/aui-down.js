/**
 * Created by lizhenya on 2017/11/10.
 */


$(function(){
    /*----------------------------------
     点击展开移出区域隐藏列表
     ----------------------------------*/
    //外层select框
    var oDropDown = $('.select');
    //选择列表项
    var oChangeA = $('.listA');
    oDropDown.click(function(){
        $(this).find('.selectList').toggle().siblings('.xl-icon').toggleClass('sq-icon');
    });

    oDropDown.mouseleave(function(){
        $(this).find('.selectList').hide().siblings('.xl-icon').removeClass('sq-icon');
    });

    // 点击后 获取到的参数
    // oChangeA.click(function(){
    //     var oVal = $(this).text();
    //     $(this).parents('.listA-all').parents('.selectList').siblings('.selectVal').text(oVal).siblings('.xl-icon').toggleClass('sq-icon');
    // });
    /*----------------------------------
     点击展开点击空白区域隐藏列表
     ----------------------------------*/
    var oNextS = $('.selectNext');
    var oChangeANext = $('.listANext');
    oNextS.click(function(){
        //如果页面存在多个下拉框，点击this把别的下拉框隐藏并且下拉icon向下
        $('.selectListNext').hide();
        $('.xl-iconNext').removeClass('sq-icon');

        $(this).siblings('.selectListNext').toggle().siblings('.selectNext').find('.xl-iconNext').toggleClass('sq-icon');
    });
    //点击空白区域列表隐藏
    $(document).click(function(){
        $(".selectListNext").hide();
        $('.xl-iconNext').removeClass('sq-icon');
    });
    //点击元素内不隐藏
    oNextS.click(function(event){
        event.stopPropagation();
    });

    // 点击后 获取到的参数
    // oChangeANext.click(function(){
    //     var oVal = $(this).text();
    //     $(this).parents('.listA-allNext').parents('.selectListNext').siblings('.selectNext').find('.selectValNext').text(oVal).siblings('.xl-iconNext').toggleClass('sq-icon');
    // });
});