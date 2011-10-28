var ptm = {    
    screenWidth: $(window).width(),
    screenHeight: $(window).height(),
    
    defWidth: 600,
    defHeight: 300,
    curWidth: null,
    curHeight: null,
    
    newTop: null,
    topLev: 15,
    
    defNewAlpha: 0.95,
    defOldAlpha: 0.2,
    curAlpha: null,
    alphaLev: null,
    
    defNewFontSize: 28,
    defOldFontSize: 26,
    curFontSize: null,
    fontSizeLev: null,
    
    maxNum: null,
    curNum: null,

    uid: null,

    init: function(){ 
      ptm.maxNum = $('section').length - 1;
      ptm.curNum = 0;
      ptm.curAlpha = ptm.defNewAlpha;
      ptm.alphaLev = (ptm.defNewAlpha - ptm.defOldAlpha) / ptm.maxNum;
      ptm.fontSizeLev = ptm.defOldFontSize / ptm.defNewFontSize;
      ptm.newTop = ( ptm.screenHeight - ptm.defHeight) / 2;
      
      $('section').addClass('show');
    },

    reShow: function(){
      
      ptm.curHeight = ptm.defHeight;
      ptm.curWidth = ptm.defWidth;
      ptm.curAlpha = ptm.defNewAlpha;
      ptm.curFontSize = ptm.defNewFontSize;
      
      $('section').not('.show').css( 'opacity', 0 );
      
      $('section.show').each(function(index) {
        $(this).css( 'height', ptm.curHeight ).css( 'width', ptm.curWidth )
          .css( 'left', ( ptm.screenWidth - ptm.curWidth) / 2 )
          .css( 'top', ( ptm.newTop - (index * ptm.topLev) ) )
          .css( 'font-size', ptm.curFontSize + "px" )
          .css( 'opacity', ptm.curAlpha )
          .css( 'z-index', ptm.maxNum - index );
        
        ptm.curHeight *= ptm.fontSizeLev;
        ptm.curWidth *= ptm.fontSizeLev;
        ptm.curAlpha -= ptm.alphaLev;
        ptm.curFontSize *= ptm.fontSizeLev;
      });
    },

    scrollOld: function(){
        if (ptm.curNum < ptm.maxNum){
            $('section').eq(ptm.curNum).removeClass('show');
            ptm.curNum += 1;
        }
        ptm.reShow();
    },
    
    scrollNew: function(){
      if (ptm.curNum > 0){
          ptm.curNum -= 1;
          $('section').eq(ptm.curNum).addClass('show');
      }
      ptm.reShow();
    },

    login: function(acct){
        var param = $.param({ url: 'http://www.plurk.com/m/u/' + acct });
        var plurkObj = [];
    
        $.getJSON( "ba-simple-proxy.php?" + param, function(data){   
            $(data.contents).each(function(i){
                var tmpObj = $(this).find('div.plurk');
                if (tmpObj.text() != '') plurkObj.push(tmpObj);
            })
            
            $('section').remove();
            
            $(plurkObj)[0].each(function(i){
                $('<section>').append($(this).contents()).appendTo('body');
            })
            
            ptm.init();
            ptm.reShow();
        })  
    }
};

$(function() {
        
    var kibo = new Kibo();    
    kibo.down('up', function() { ptm.scrollOld(); })
        .up('down', function() { ptm.scrollNew(); });
        
    $('a#new').click(function(){
        ptm.scrollNew();
    });
    
    $('a#old').click(function(){
        ptm.scrollOld();
    });
    
    $('input#login').click(function(){
        ptm.login($('input#acct').val());
    })
    
});