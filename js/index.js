/*---------------------刷新时自动获取当前IP天气--------------------------*/
$.get('//weixin.jirengu.com/weather/ip').done(function(rel){
$.get('//weixin.jirengu.com/weather/cityid?location='+rel.data).done(function(rel2){

setCity(rel2.results[0].name,0)

$.get('//weixin.jirengu.com/weather/now?cityid='+rel2.results[0].id).done(function(rel3){

setToday (rel3.weather[0],0)
})

$.get('//weixin.jirengu.com/weather/future24h?cityid='+rel2.results[0].id).done(function(rel4){
set24h(rel4,0)
})
})
})
/*-----------------------------设置天气函数----------------------------------*/
var codeImg = '//weixin.jirengu.com/images/weather/code/'
function setToday (obj,index) {
$('.inner').eq(index).find('.now-wea>.tem').text(obj.now.temperature+'°')
$('.inner').eq(index).find('.now-wea>p').text(obj.today.suggestion.uv.details)
$('.inner').eq(index).find('.now-wea>img').attr('src',codeImg+obj.now.code+'.png')
var $list = $('.inner').eq(index).find('.future>.list>li')
$list.each(function (ind) {
$(this).find('.am').attr('src',codeImg + obj.future[ind].code1 + '.png')
$(this).find('.pm').attr('src',codeImg + obj.future[ind].code2 + '.png')
$(this).find('.wind').text(obj.future[ind].wind)
$(this).find('.tem').text(obj.future[ind].high+'°/'+obj.future[ind].low+'°')
})
}

function setCity (cityName,index) {
$('.inner').eq(index).find('.now-wea>h2').text(cityName+'市')
}

function set24h (obj,index) {
$('.inner').eq(index).find('.wea-24h>li').each(function (ind) {
$(this).find('img').attr('src',codeImg + obj.hourly[8+ind*3].code + '.png')
$(this).find('span').text(obj.hourly[8+ind*3].temperature + '°')
})
}


/*---------------------------------面板控制--------------------------------------*/



/*----------------'+'按钮弹出搜索框-------------------*/



$('.control>#add').click(function () {
/*----------------如果当前面板为空，刷新页面获取当前天气-----------------*/
if($('.content>.inner').length === 0){
location.reload()
return
}else{
/*-------------如果不为空，有模板，就走流程-------------------------------*/

$('#addWea').css('display','block')
}
})



/*----------------'x'按钮隐藏搜索框-------------------*/

$('#addWea>b').click(function () {
$('#addWea').css('display','none')
})

var timer2 = null,timer3 = null,circlesNum = 0
/*--------------加定时器防止重复点击-----------------------*/
/*----------------------'<'按钮左滑-------------------------*/
$('.control>#go-left').click(function () {

if(timer2){ clearTimeout(timer2) }
timer2 = setTimeout(function(){




var $left = parseInt($('.content').css('left'))
var $width = parseInt($('.content').css('width'))
var $length = $('.inner').length
if(-1*$left < $width*(($length-1)/$length)-10){
	$('.circles>span').eq(1+circlesNum).addClass('active').siblings('span').removeClass('active')
	circlesNum += 1
	$('.control>#go-right').addClass('right-active')
	if(circlesNum+1 === $('.circles>span').length){
		$('.control>#go-left').removeClass('left-active')
	}
	$('.content').animate({
		left : '-=' + (1/$length)*$width + 'px'
	})
}
},500)



})
/*----------------------'>'按钮右滑-------------------------*/
$('.control>#go-right').click(function () {

if(timer3){ clearTimeout(timer3) }
timer3 = setTimeout(function(){
var $left = parseInt($('.content').css('left'))
var $width = parseInt($('.content').css('width'))
var $length = $('.inner').length
if($left < -10){
	$('.circles>span').eq(-1+circlesNum).addClass('active').siblings('span').removeClass('active')
	circlesNum -= 1
	$('.control>#go-left').addClass('left-active')
	if(circlesNum === 0){
		$('.control>#go-right').removeClass('right-active')
	}
	$('.content').animate({
		left : '+=' + (1/$length)*$width + 'px'
	})
}
},500)



})
/*----------------------'x'按钮删除当前显示天气-----------------------------*/
$('.content').on('click','.close',function () {
$('.addWea>input').css('display','none')
$('.addWea').css('display','block')
$('.addWea>span').css('display','block')

var $length = $('.inner').length
var $width = parseInt($('.content').css('width'))
var $parent = $(this).parents('.inner')
/*-------------------如果只剩下一个面板了，直接删------------------*/
if($length === 1){
$parent.remove()
$('.circles>span').remove()
return
}else if($length === 3){
if($parent.index()===0){$('.control>#go-right').removeClass('right-active')}else{
	$('.control>#go-left').removeClass('left-active')
}	
}else if($length === 2){
$('.control>#go-right').removeClass('right-active')
$('.control>#go-left').removeClass('left-active')
}
/*---------------如果只剩下多于一个面板，加动画效果------------------*/
if($parent.index() === $length-1){
console.log($parent.index())
console.log($length)
$('.circles>span:first').remove()
circlesNum -= 1
/*				if($('.circles>span').length===1){
	$('.control>#go-left').removeClass('left-active')
	$('.control>#go-right').removeClass('right-active')
}else if($('.circles>span').length===2){

}*/
$('.content').animate({
	left : '+=' + (1/$length)*$width + 'px'
},function(){
	$parent.remove()
})
}else {
$('.content').animate({
	left : '+=' + (1/$length)*$width + 'px'
},1,function(){
	$('.circles>span:last').remove()
	/*if($('.circles>span').length===1){
		$('.control>#go-right').removeClass('right-active')
		$('.control>#go-left').removeClass('left-active')
	}*/
})
$('.content').animate({
	left : '-=' + (1/$length)*$width + 'px'
},function(){
	$parent.remove()
})
$parent.remove()
}

$('.content').css('width',100*($length-1) + '%')
$('.inner').css('width',100/($length-1) + '%')

$('.addWea').css('display','none')
$('.addWea>input').css('display','block')
$('.addWea>span').css('display','none')

})





/*-------------------------添加城市---------------------------*/
var timer1 = null
$('#addWea>input').keyup(function () {
$('#addWea>ul').empty()
var $that = $(this)
if(timer1){ clearTimeout(timer1) }
timer1 = setTimeout(function(){
$('#addWea>span').css('display','block')
$.get('//weixin.jirengu.com/weather/cityid?location=' + $that.val()).done(function(rel5){
	$('#addWea>span').css('display','none')
	addList(rel5.results)
})
},2000)
})

$('#addWea>ul').on('click','li',function(){
$('#addWea>ul').empty()
$('#addWea>span').css('display','block')
$('#addWea>input').attr('disabled','true')
var $length = $('.inner').length
var $that = $(this)


$.get('//weixin.jirengu.com/weather/now?cityid='+$(this).attr('id')).done(function(rel3){

var cloneInner = $('.inner')[0].cloneNode(true)
$('.content').append($(cloneInner))

setToday (rel3.weather[0],$length)
})

$.get('//weixin.jirengu.com/weather/future24h?cityid='+ $(this).attr('id')).done(function(rel4){
set24h(rel4,$length)
setCity($that.text(),$length)
})


$('.content').css('width',100*($length+1)+'%')
$('.inner').css('width',100/($length+1)+'%')


$('.circles').append($('<span></span>'))
$('.control>#go-left').addClass('left-active')


$('#addWea>span').css('display','none')
$('#addWea>input').removeAttr('disabled').val('')
$('#addWea').css('display','none')
})


/*---------------------城市下拉列表----------------------*/
function addList(arr){
var fragment = document.createDocumentFragment()
for(var i = 0;i < arr.length;i++){
($(fragment)).append($('<li id=' + arr[i].id + '>' + arr[i].name + '</li>'))
}
($('#addWea>ul')).append($(fragment))
}