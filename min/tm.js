(function() {
  var alphaLev, curAlpha, curFontSize, curHeight, curNum, curWidth, defHeight, defNewAlpha, defNewFontSize, defOldAlpha, defOldFontSize, defWidth, entryTmpl, fontSizeLev, login, maxNum, newTop, reShow, screenHeight, screenWidth, scrollNew, scrollOld, topLev, uid;
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
  entryTmpl = null;
  $(function() {
    var kibo, source;
    source = $("#entryTmpl").html();
    entryTmpl = Handlebars.compile(source);
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
    var feedUrl, param, plurkObj;
    param = $.param({
      url: 'http://www.plurk.com/m/u/' + acct
    });
    plurkObj = [];
    feedUrl = "http://www.plurk.com/" + acct + ".xml";
    return $.jGFeed(feedUrl, function(feeds) {
      var entry, i, _ref;
      if (!feeds) {
        return false;
      }
      $('section').remove();
      for (i = 0, _ref = feeds.entries.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        entry = feeds.entries[i];
        $('<section>').append(entryTmpl(entry)).appendTo('body');
      }
      maxNum = $('section').length - 1;
      curNum = 0;
      curAlpha = defNewAlpha;
      alphaLev = (defNewAlpha - defOldAlpha) / maxNum;
      fontSizeLev = defOldFontSize / defNewFontSize;
      newTop = (screenHeight - defHeight) / 2;
      $('section').addClass('show');
      return reShow();
    }, -1);
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
