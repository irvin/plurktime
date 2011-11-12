(function() {
  var alphaLev, curAlpha, curFontSize, curHeight, curNum, curWidth, defHeight, defNewAlpha, defNewFontSize, defOldAlpha, defOldFontSize, defWidth, entryTmpl, fontSizeLev, hashchange, login, maxNum, newTop, reShow, screenHeight, screenWidth, scrollNew, scrollOld, topLev, uid;
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
      return hashchange();
    });
    acct = window.location.hash.substr(1).trim();
    if (acct !== '') {
      hashchange();
    }
    kibo = new Kibo();
    return kibo.down('up', function() {
      return scrollOld();
    }).down('down', function() {
      return scrollNew();
    });
  });
  hashchange = function() {
    var acct;
    acct = window.location.hash.substr(1).trim();
    if (acct === 'about_this') {
      $('#about').fadeIn();
      return false;
    }
    if (acct === 'close_about') {
      $('#about').fadeOut();
      window.location.hash = '';
      return false;
    } else {
      if ($('#about').css('display') === 'block') {
        $('#about').fadeOut();
      }
      return login(acct);
    }
  };
  login = function(acct) {
    var plurkObj;
    plurkObj = [];
    return $.jGFeed("http://www.plurk.com/" + acct + ".xml", function(feeds) {
      var date, datediff, entry, i, section;
      if (feeds) {
        $('section').remove();
        maxNum = feeds.entries.length;
        for (i = 0; 0 <= maxNum ? i < maxNum : i > maxNum; 0 <= maxNum ? i++ : i--) {
          entry = feeds.entries[i];
          entry.content = entry.content.substr(entry.content.indexOf(' '));
          date = new Date(entry.publishedDate);
          datediff = Math.floor((Date.now() - date) / 60000);
          if (datediff < 1) {
            entry.publishedDate = 'just now';
          } else if (datediff < 2) {
            entry.publishedDate = '1 min ago';
          } else if (datediff < 60) {
            entry.publishedDate = datediff + ' mins ago';
          } else if (datediff < 120) {
            entry.publishedDate = '1 hour ago';
          } else if (datediff < 1440) {
            entry.publishedDate = Math.floor(datediff / 60) + ' hours ago';
          } else if (datediff < 2880) {
            entry.publishedDate = '1 day ago';
          } else if (datediff < 10080) {
            entry.publishedDate = Math.floor(datediff / 1440) + ' days ago';
          } else {
            entry.publishedDate = date.toLocaleString();
          }
          section = $("<section style='opacity: 0' class='show'>").append(entryTmpl(entry)).appendTo('body');
        }
        curNum = 0;
        curAlpha = defNewAlpha;
        alphaLev = (defNewAlpha - defOldAlpha) / 15;
        fontSizeLev = defOldFontSize / defNewFontSize;
        newTop = (screenHeight - defHeight) / 2;
        acct = $('input#acct').val().trim();
        if (acct !== '') {
          $('input#acct').blur();
        }
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
          'top': newTop - (index * topLev) * (60 - index) / 60,
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
    if (curNum < maxNum - 1) {
      $('section').eq(curNum).removeClass('show');
      curNum += 1;
      return reShow();
    }
  };
  scrollNew = function() {
    if (curNum > 0) {
      curNum -= 1;
      $('section').eq(curNum).addClass('show');
      return reShow();
    }
  };
}).call(this);
