(function() {
  var alphaLev, curAlpha, curFontSize, curHeight, curNum, curWidth, defHeight, defNewAlpha, defNewFontSize, defOldAlpha, defOldFontSize, defWidth, fontSizeLev, init, login, maxNum, newTop, reShow, screenHeight, screenWidth, scrollNew, scrollOld, topLev, uid;
  screenWidth = $(window).width();
  screenHeight = $(window).height();
  defWidth = 600;
  defHeight = 300;
  curWidth = null;
  curHeight = null;
  newTop = null;
  topLev = 15;
  defNewAlpha = 0.95;
  defOldAlpha = 0.2;
  curAlpha = null;
  alphaLev = null;
  defNewFontSize = 28;
  defOldFontSize = 26;
  curFontSize = null;
  fontSizeLev = null;
  maxNum = null;
  curNum = null;
  uid = null;
  $(function() {
    var kibo;
    $('input#login').click(function() {
      return login($('input#acct').val());
    });
    kibo = new Kibo();
    kibo.down('up', function() {
      return scrollOld();
    }).down('down', function() {
      return scrollNew();
    });
    $('a#new').click(function() {
      return scrollNew();
    });
    return $('a#old').click(function() {
      return scrollOld();
    });
  });
  login = function(acct) {
    var param, plurkObj;
    param = $.param({
      url: 'http://www.plurk.com/m/u/' + acct
    });
    plurkObj = [];
    return $.getJSON("ba-simple-proxy.php?" + param).done(function(data) {
      $(data.contents).each(function() {
        var tmpObj;
        tmpObj = $(this).find('div.plurk');
        if (tmpObj.text() !== '') {
          return plurkObj.push(tmpObj);
        }
      });
      $('section').remove();
      $(plurkObj)[0].each(function() {
        return $('<section>').append($(this).contents()).appendTo('body');
      });
      init();
      return reShow();
    });
  };
  init = function() {
    maxNum = $('section').length - 1;
    curNum = 0;
    curAlpha = defNewAlpha;
    alphaLev = (defNewAlpha - defOldAlpha) / maxNum;
    fontSizeLev = defOldFontSize / defNewFontSize;
    newTop = (screenHeight - defHeight) / 2;
    return $('section').addClass('show');
  };
  reShow = function() {
    curHeight = defHeight;
    curWidth = defWidth;
    curAlpha = defNewAlpha;
    curFontSize = defNewFontSize;
    $('section').not('.show').css('opacity', 0);
    return $('section.show').each(function(index) {
      $(this).css('height', curHeight).css('width', curWidth).css('left', (screenWidth - curWidth) / 2).css('top', newTop - (index * topLev)).css('font-size', curFontSize + "px").css('opacity', curAlpha).css('z-index', maxNum - index);
      curHeight *= fontSizeLev;
      curWidth *= fontSizeLev;
      curAlpha -= alphaLev;
      curFontSize *= fontSizeLev;
    });
  };
  scrollOld = function() {
    if (curNum < maxNum) {
      $('section').eq(curNum).removeClass('show');
      curNum += 1;
    }
    reShow();
  };
  scrollNew = function() {
    if (curNum > 0) {
      curNum -= 1;
      $('section').eq(curNum).addClass('show');
    }
    reShow();
  };
}).call(this);
