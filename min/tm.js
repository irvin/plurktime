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
  defOldAlpha = 0.01;
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
    var acct, kibo, source;
    source = $("#entryTmpl").html();
    entryTmpl = Handlebars.compile(source);
    $('form').submit(function() {
      var acct;
      acct = $('input#acct').val().trim();
      if (acct !== '') {
        window.location.hash = '#' + acct;
      }
      return false;
    });
    $(window).on('hashchange', function() {
      var acct;
      acct = window.location.hash.substr(1).trim();
      return login(acct);
    });
    acct = window.location.hash.substr(1).trim();
    if (acct !== '') {
      login(acct);
    }
    kibo = new Kibo();
    return kibo.down('up', function() {
      return scrollOld();
    }).down('down', function() {
      return scrollNew();
    });
  });
  login = function(acct) {
    var plurkObj;
    plurkObj = [];
    return $.jGFeed("http://www.plurk.com/" + acct + ".xml", function(feeds) {
      var entry, i, _ref;
      if (feeds) {
        $('section').remove();
        for (i = 0, _ref = feeds.entries.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
          entry = feeds.entries[i];
          $('<section>').append(entryTmpl(entry)).appendTo('body');
        }
        maxNum = $('section').length - 1;
        curNum = 0;
        curAlpha = defNewAlpha;
        alphaLev = (defNewAlpha - defOldAlpha) / 15;
        fontSizeLev = defOldFontSize / defNewFontSize;
        newTop = (screenHeight - defHeight) / 2;
        $('section').addClass('show');
        return reShow();
      } else {
        window.location.hash = '';
        return false;
      }
    }, -1);
  };
  reShow = function() {
    curHeight = defHeight;
    curWidth = defWidth;
    curAlpha = defNewAlpha;
    curFontSize = defNewFontSize;
    $('section').not('.show').css('opacity', 0);
    return $('section.show').each(function(index) {
      if (curAlpha > 0) {
        $(this).css({
          'height': curHeight,
          'width': curWidth,
          'left': (screenWidth - curWidth) / 2,
          'top': newTop - (index * topLev),
          'font-size': curFontSize + "px",
          'opacity': curAlpha,
          'z-index': maxNum - index
        });
        curHeight *= fontSizeLev;
        curWidth *= fontSizeLev;
        if (curAlpha > alphaLev) {
          curAlpha = curAlpha - alphaLev;
        } else {
          curAlpha = 0;
        }
        curFontSize *= fontSizeLev;
      } else {
        $(this).css({
          'opacity': 0
        });
      }
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
