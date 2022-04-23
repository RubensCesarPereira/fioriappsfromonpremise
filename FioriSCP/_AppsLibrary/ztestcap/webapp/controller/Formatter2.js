jQuery.sap.declare("util.Formatter2");

util.Formatter2 = {

	getName : function(value) {

		if (value == "1102")
			return "DE";

		if (value == "1701")
			return "CH";

		return value;

	},


	getCode : function(value) {

		if (value == "1102")
			return "DE";
	
		if (value == "1701")
			return "CH";
	
		return value;
	
	},
	
	quitarIzqCero : function(value) {		
	
		if (value === undefined || value === null) {
		    //do something
		}else{		
			value = value.replace(/^0+/, '');
		}
		
		return value;
	},
	
	
	redondear :  function (value) {		
		var num = parseFloat(value);	
		num = Math.round(num);
	    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
		
	},
	
	
	formatFecha: function (value) {
		
		if(value == null){
			return "-"
		}
		
	   var fecha = new Date(value);
	   fecha.setHours(fecha.getHours() + (fecha.getTimezoneOffset() / 60));
	   
		var months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
		var formattedDate = fecha.getDate()+"-"+months[fecha.getMonth()]+"-"+fecha.getFullYear();
		return formattedDate;
				
	},
	
	
	mensaje: function (){

		$("#__xmlview2--botonApbr").show();	
		
	},
	
	mensaje2: function (){
	
		$("#__xmlview2--botonApbr").hide();		
		
	},
	
	
	myIndent: function(){
		
		$("#__item1-value").attr('class', '');
		$("#__item1-value").css('position', 'absolute');
		$("#__item1-value").css('left', '150px');
		
		$("#__label0").attr('class', '');
		$("#__label1").attr('class', '');
		$("#__label2").attr('class', '');
		$("#__label3").attr('class', '');
		$("#__label4").attr('class', '');
		$("#__label5").attr('class', '');
		$("#__label6").attr('class', '');
		$("#__label7").attr('class', '');
		$("#__label8").attr('class', '');
		$("#__label9").attr('class', '');

		$('#__label0').css("font-weight","Bold");
		$('#__label1').css("font-weight","Bold");
		$('#__label2').css("font-weight","Bold");
		$('#__label3').css("font-weight","Bold");
		$('#__label4').css("font-weight","Bold");
		$('#__label5').css("font-weight","Bold");

		$('#__label6').css("font-weight","Bold");
		$('#__label7').css("font-weight","Bold");
		$('#__label8').css("font-weight","Bold");
		$('#__label9').css("font-weight","Bold");
		
		
		
		$("#__label5").css({
		    fontSize: 12
		});
		
		$("#__label4").css({
		    fontSize: 12
		});
		
		$("#__label3").css({
		    fontSize: 12
		});
		
		$("#__label2").css({
		    fontSize: 12
		});
		
		$("#__label1").css({
		    fontSize: 12
		});
		
		
		$("#__label0").css({
		    fontSize: 12
		});		
		
		
		$("#__label6").css({
		    fontSize: 12
		});
		
		$("#__label7").css({
		    fontSize: 12
		});
		
		
		$("#__label8").css({
		    fontSize: 12
		});		
		
		$("#__label9").css({
		    fontSize: 12
		});	
		

		$("#__xmlview2--nameText4").css({
		    fontSize: 12
		});		
		
		$("#__xmlview2--nameText").css({
		    fontSize: 12
		});	
		
		$("#__text0").css({
		    fontSize: 12
		});	
		

		$("#__text1").css({
		    fontSize: 12
		});	
		
		$("#__xmlview2--countryText2").css({
		    fontSize: 12
		});	
		
		$("#__xmlview2--countryText1").css({
		    fontSize: 12
		});			
		
		
		$("#__text2").css({
		    fontSize: 12
		});	
		
		
		//$("#__container1--Grid").attr('class', '');
		
		
		//__container1--Grid le quito el class y hago un padding left a los valores
		//style="padding-left : 30px;
		
		
	
	//	$("#__container1--Grid").attr('class' ,'' );
		

	},
	
	print : function(){
		
		return $("#__xmlview2--nameText4").text();
		//return "111112";
	},
	
	
	getItem : function(){
		
		return $("#__xmlview2--nameText44").text();
		//return "1101";
	},
	
	
	clicLiberadas : function() {
		
	//$("#__xmlview1--btnPendiente").click();
	  $("#__xmlview1--btnLiberadas").click();
		
		
	},
	
	leeJson : function (data){
		 data = $.parseJSON(data);
		 $.each(data.error.message, function(index, element) {
	    	   alert(element);
	        });
	},
	

	printTextClean : function (){

		 $("#__xmlview2--textCab").text('');
		
	},
	
	printText : function (value){
		
		 $("#__xmlview2--textCab").text(value);
		
	}
	
	


	
	
};