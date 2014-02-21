var CoundownTimer={
	endTime:null,
	timerId:null,
	minutes:0,
	maxWidth:0,
	maxTime:(25*60*1000),
	isBreak:false,

	normalColors:['#e47a80','#eb363b'],
	breakColors:['#97c751','#759f58'],

	start:function(minutes,isBreak) {
		if(this.maxWidth==0)
			this.maxWidth=$('#timer-bar').width();
		if(this.timerId)
			this.cancel();
		this.minutes=minutes;
		this.isBreak=isBreak;
		this.setupTimer();
		this.flashbar();
	},
	setupTimer:function() {
		$('timer-finished').fadeOut();
		var date = new Date();
		this.endTime=date.getTime()+(this.minutes*60*1000);
		this.timerId=setInterval(this.tick,1000);
		this.setBarToTime(this.minutes*60*1000);
		$('title').text("Started "+(this.isBreak?this.minutes + " minute break":" pomodoro"));
	},
	flashbar:function() {
		var lColor,dColor;
		if(this.isBreak)
		{
			lColor=this.breakColors[0];
			dColor=this.breakColors[1];
		}
		else{
			lColor=this.normalColors[0];
			dColor=this.normalColors[1];
		}
		$('#timer-bar').animate({backgroundColor:lColor}).animate({backgroundColor:dColor});
	},
	setBarToTime:function(time) {
		$('#timer-bar').animate({
			width:(time/this.maxTime)*this.maxWidth
		});
	},
	cancel:function() {
		clearInterval(this.timerId);
	},
	tick:function() {
		CoundownTimer.tock();
	},
	tock:function() {
		var date=new Date();
		var rTime=this.endTime-date.getTime();
		if (rTime<=0) {
			this.cancel();
			this.setBarToTime(0);
			this.showCompletedInLog();
			this.showCompletedMessage();
		}
		else{
			this.setBarToTime(rTime);
		}
	},
	showCompletedInLog:function() {
		var logClass="timer-log"+this.minutes+(this.isBreak?"-break":"");
		$("#timer-log").append('<div class ='+logClass+'"></div>');
	},
	showCompletedMessage:function() {
		if($('#timer-finished').length==0)
			$('#timer').append('<div id="timer-finished"></div>');
		var message="Finished "+(this.isBreak? this.minutes +" minutes break" :" one pomodoro");
		$('title').text(message);
		$('#timer-finished').text(message).fadeIn(1000);
	},
};


$.fn.extend({
	states:['task-empty','task-x','task-apostrophe','task-dash'],
	resetTaskStateClassName:function() {
		var elements=this;
		$.each($.fn.states,function() {
			elements.removeClass(this);
		})
		return this;
	},
	resetTaskState:function() {
		this.resetTaskStateClassName();
		return this.each(function() {
			$(this).data('taskState',0).addClass($.fn.states[0]);

		});

	},
	toggleTaskState:function() {
		this.resetTaskStateClassName();

		return this.each(function() {
			var element=$(this);
			var taskState=element.data('taskState') || 0;
			taskState=(taskState+1)%$.fn.states.length;
			element.data('taskState',taskState).addClass($.fn.states[taskState]);
		});
	},
});
$(function() {
	$('#button-25').click(function(e) {
		e.preventDefault();
		CoundownTimer.start(25);
	});

	$('#button-5-break').click(function(e) {
		e.preventDefault();
		CoundownTimer.start(5,true);
	});

	$('#button-25-break').click(function(e) {
		e.preventDefault();
		CoundownTimer.start(25,true);
	});

	$('#add').click(function(e) {
		var item=$("#tasks ul li:first").clone();
		item
			.find(".completion a").resetTaskState()
		.end()
			.find('input[type="text"]').val("");
		$("#tasks ul").append(item);
		item.find('input[type="text"]:first').focus();
		return false;
	});
	$(".completion a").live('click',function(e) {
		$(this).toggleTaskState();
		return false;
	});
	$('input[type="text"]:first').focus();
	var item=$("#tasks ul").sortable({handle:".handle"}).disableSelection();
});