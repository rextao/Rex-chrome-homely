$(document).ready(function () {
  let style1 = new SettingStyle();
  style1.init();

  // helper methods
  var cap = function cap(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  var trim = function trim(str, len) {
    return str.length > len ? str.substring(0, len - 3) + "..." : str;
  }
  var pad = function pad(n) {
    return n < 10 ? "0" + n : n.toString();
  };
  var fa = function fa(icon, fw) {
    return $("<i/>").addClass("fa fa-" + icon).toggleClass("fa-fw", fw !== false);
  }
  var label = function label(text, settings) {
    return [" ", $("<span/>").addClass("menu-label").html(text)];
  }
  var manif = chrome.runtime.getManifest();
  // 默认设置
  var settings = {
    // 链接
    "links": {
      // 模块控制
      "edit": {
        "menu": true,
        "dragdrop": true
      },
      // 行为
      "behaviour": {
        "dropdownmiddle": false
      },
      // 默认页面内容
      "content": [
        {
          "title": "Chrome",
          "buttons": [
            {
              "title": "Web Store",
              "url": "https://chrome.google.com/webstore",
              "style": "primary"
            },
            {
              "title": "Settings",
              "menu": [
                {
                  "title": "Settings",
                  "url": "chrome://settings"
                },
                {
                  "title": "Extensions",
                  "url": "chrome://extensions"
                },
                {
                  "title": "Flags",
                  "url": "chrome://flags"
                }
              ],
              "style": "light"
            },
            {
              "title": "Content",
              "menu": [
                {
                  "title": "Apps",
                  "url": "chrome://apps"
                },
                {
                  "title": "Bookmarks",
                  "url": "chrome://bookmarks"
                },
                {
                  "title": "Downloads",
                  "url": "chrome://downloads"
                },
                {
                  "title": "History",
                  "url": "chrome://history"
                }
              ],
              "style": "default"
            }
          ]
        },
        {
          "title": "Storage",
          "buttons": [
            {
              "title": "Dropbox",
              "url": "https://www.dropbox.com",
              "style": "info"
            },
            {
              "title": "Google Drive",
              "url": "https://drive.google.com",
              "style": "warning"
            },
            {
              "title": "OneDrive",
              "url": "https://onedrive.live.com",
              "style": "primary"
            }
          ]
        },
        {
          "title": "Social",
          "buttons": [
            {
              "title": "Facebook",
              "url": "https://www.facebook.com",
              "style": "primary"
            },
            {
              "title": "Twitter",
              "menu": [
                {
                  "title": "Twitter",
                  "url": "https://twitter.com"
                },
                {
                  "title": "TweetDeck",
                  "url": "https://tweetdeck.twitter.com"
                }
              ],
              "style": "info"
            },
            {
              "title": "Google+",
              "url": "https://plus.google.com",
              "style": "danger"
            }
          ]
        },
        {
          "title": "Tips",
          "buttons": [
            {
              "title": "Lifehacker",
              "url": "http://lifehacker.com",
              "style": "success"
            },
            {
              "title": "AddictiveTips",
              "url": "http://www.addictivetips.com",
              "style": "primary"
            },
            {
              "title": "How-To Geek",
              "url": "http://www.howtogeek.com",
              "style": "dark"
            }
          ]
        }
      ]
    },
    "bookmarks": {
      "enable": false,
      "bookmarklets": true,
      "foldercontents": true,
      "split": false,
      "merge": false,
      "above": false
    },
    "history": {
      "enable": false,
      "limit": 10
    },
    "general": {
      "title": manif.name,
      "keyboard": false,
      "clock": {
        "show": true,
        "twentyfour": true,
        "seconds": true
      },
      "timer": {
        "stopwatch": false,
        "countdown": false,
        "beep": true
      },
      "notepad": {
        "show": false,
        "content": ""
      },
      "apps": false,
      "weather": {
        "show": false,
        "location": "",
        "celsius": true
      },
      "proxy": false
    },
    "style": {
      "font": "Segoe UI",
      "fluid": false,
      "topbar": {
        "fix": false,
        "dark": false,
        "labels": true
      },
      "panel": "default",
      "background": {
        "image": "../img/bg.png",
        "repeat": true,
        "centre": true,
        "fixed": false,
        "stretch": false
      },
      "customcss": {
        "enable": false,
        "content": ""
      }
    }
  };
  // required permissions
  var ajaxPerms = {
    "ticktick": ["https://ticktick.com/"],
    "weather": ["http://api.openweathermap.org/"],
    "proxy": ["http://www.whatismyproxy.com/"]
  };
  // load settings
  chrome.storage.local.get(function (store) {
    var firstRun = $.isEmptyObject(store);
    // load links first
    if (!firstRun) settings.links.content = store.links.content;
    // merge settings with defaults
    settings = $.extend(true, {}, settings, store);
    // apply custom styles
    document.title = settings.general["title"];
    var css = [];
    if (settings.style["font"]) {
      css.push("* {\n"
        + "    font-family: '" + settings.style["font"] + "';\n"
        + "}");
    }
    $("body").addClass(settings.style["fluid"] ? "container-fluid" : "container");
    if (settings.style["topbar"].fix) {
      $("body").addClass("topbar-fix");
      $("nav").addClass("navbar-fixed-top");
      $("#menu-collapse").addClass("collapse navbar-collapse");
      $("#menu-collapse-toggle").show();
    }
    if (settings.style["topbar"].dark) {
      $("nav").removeClass("navbar-default").addClass("navbar-inverse");
    }
    if (settings.style["background"].image) {
      css.push("html {\n"
        + "    background-image: url(" + settings.style["background"].image + ");\n"
        + "    background-repeat: " + (settings.style["background"].repeat ? "" : "no-") + "repeat;\n"
        + "    background-position: " + (settings.style["background"].centre ? "center" : "initial") + ";\n"
        + "    background-attachment: " + (settings.style["background"].fixed ? "fixed" : "initial") + ";\n"
        + "    background-size: " + (settings.style["background"].stretch ? "cover" : "auto") + ";\n"
        + "}");
    }
    if (css.length) {
      $(document.head).append($("<style/>").html(css.join("\n")));
    }
    if (settings.style["customcss"].enable) {
      $(document.head).append($("<style/>").html(settings.style["customcss"].content));
    }
    // show current time in navbar
    if (settings.general["clock"].show) {
      var time = $("<div/>").attr("id", "time").addClass("navbar-brand");
      $(".navbar-header").append($("<a/>").attr("href", "http://time.is").append(time));
      var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      var tick = function tick() {
        var now = new Date();
        var hours = now.getHours();
        var pm = "";
        if (settings.general["clock"].twentyfour) {
          hours = pad(hours);
        } else {
          pm = " AM";
          if (hours === 0 || hours > 12) {
            hours = (hours + 12) % 24;
            pm = " PM";
          }
        }
        time.text(hours + ":" + pad(now.getMinutes()) + (settings.general["clock"].seconds ? ":" + pad(now.getSeconds()) : "") + pm)
          .attr("title", days[now.getDay()] + " " + now.getDate() + " " + months[now.getMonth()] + " " + now.getFullYear());
      }
      tick();
      setInterval(tick, 1000);
    }
    // show stopwatch / countdown timer
    if (settings.general["timer"].stopwatch || settings.general["timer"].countdown) {
      var tmRoot = $("<li/>").addClass("dropdown");
      var tmLink = $("<a/>").addClass("dropdown-toggle").attr("data-toggle", "dropdown");
      tmRoot.append(tmLink);
      var tmMenu = $("<ul/>").addClass("dropdown-menu");
      tmRoot.append(tmMenu);
      var reset = function reset() {
        tmLink.empty().append(fa("clock-o", false)).append(label("No timers ", settings)).append($("<b/>").addClass("caret"));
        if (!settings.style["topbar"].labels) {
          tmLink.prop("title", "No timers");
        }
        ;
        tmMenu.empty();
        var interval = 0;
        if (settings.general["timer"].stopwatch) {
          tmMenu.append($("<li/>").append($("<a/>").append("Start stopwatch").click(function (e) {
            var time = 0;
            var stopwatch = function stopwatch() {
              time++;
              if (time) {
                var text = pad(Math.floor(time / (60 * 60))) + ":" + pad(Math.floor((time / 60) % 60)) + ":" + pad(time % 60);
                $($("span", tmLink)[0]).text(text);
                document.title = text;
              } else {
                clearInterval(interval);
                document.title = settings.general["title"];
                reset();
              }
            };
            // stopwatch menu
            tmMenu.empty().append($("<li/>").append($("<a/>").data("paused", false).append(fa("pause")).append(" Pause").click(function (e) {
              if ($(this).data("paused")) {
                interval = setInterval(stopwatch, 1000);
                $("i", tmLink).addClass("fa-spin");
                $(this).data("paused", false).empty().append(fa("pause")).append(" Pause");
              } else {
                clearInterval(interval);
                $("i", tmLink).removeClass("fa-spin");
                $(this).data("paused", true).empty().append(fa("play")).append(" Resume");
              }
            }))).append($("<li/>").append($("<a/>").append(fa("stop")).append(" Cancel").click(function (e) {
              clearInterval(interval);
              document.title = settings.general["title"];
              reset();
            })));
            // show timer
            var text = pad(Math.floor(time / (60 * 60))) + ":" + pad(Math.floor((time / 60) % 60)) + ":" + pad(time % 60);
            tmLink.empty().prop("title", "").append(fa("spinner fa-spin", false)).append(" ").append($("<span/>").text(text)).append(" ").append($("<b/>").addClass("caret"));
            document.title = text;
            interval = setInterval(stopwatch, 1000);
          })));
        }
        if (settings.general["timer"].countdown) {
          tmMenu.append($("<li/>").append($("<a/>").append("Start countdown").click(function (e) {
            // select time
            var time = prompt("Enter a time to countdown from (e.g. 45s, 2m30s).", "5m");
            if (!time) return;
            var parts = time.replace(/[^0-9hms]/g, "").match(/([0-9]+[hms])/g);
            var time = 0;
            for (var i in parts) {
              var part = parts[i];
              var params = [parseInt(part.substr(0, part.length - 1)), part.charAt(part.length - 1)];
              switch (params[1]) {
                case "h":
                  time += params[0] * 60 * 60;
                  break;
                case "m":
                  time += params[0] * 60;
                  break;
                case "s":
                  time += params[0];
                  break;
              }
            }
            var countdown = function countdown() {
              if (time) {
                time--;
                var text = pad(Math.floor(time / (60 * 60))) + ":" + pad(Math.floor((time / 60) % 60)) + ":" + pad(time % 60);
                $($("span", tmLink)[0]).text(text);
                document.title = text;
              } else {
                if (settings.general["timer"].beep) {
                  new Audio("../mp3/alarm.mp3").play();
                }
                clearInterval(interval);
                document.title = settings.general["title"];
                reset();
              }
            };
            // countdown menu
            tmMenu.empty().append($("<li/>").append($("<a/>").data("paused", false).append(fa("pause")).append(" Pause").click(function (e) {
              if ($(this).data("paused")) {
                interval = setInterval(countdown, 1000);
                $("i", tmLink).addClass("fa-spin");
                $(this).data("paused", false).empty().append(fa("pause")).append(" Pause");
              } else {
                clearInterval(interval);
                $("i", tmLink).removeClass("fa-spin");
                $(this).data("paused", true).empty().append(fa("play")).append(" Resume");
              }
            }))).append($("<li/>").append($("<a/>").append(fa("stop")).append(" Cancel").click(function (e) {
              clearInterval(interval);
              document.title = settings.general["title"];
              reset();
            })));
            // show timer
            var text = pad(Math.floor(time / (60 * 60))) + ":" + pad(Math.floor((time / 60) % 60)) + ":" + pad(time % 60);
            tmLink.empty().prop("title", "").append(fa("spinner fa-spin", false)).append(" ").append($("<span/>").text(text)).append(" ").append($("<b/>").addClass("caret"));
            document.title = text;
            interval = setInterval(countdown, 1000);
          })));
        }
      };
      reset();
      $("#menu-left").append(tmRoot);
    }
    // show notepad
    if (settings.general["notepad"].show) {
      var npRoot = $("<li/>").addClass("dropdown");
      var npLink = $("<a/>").addClass("dropdown-toggle").attr("data-toggle", "dropdown")
        .append(fa("edit", false)).append(label("Notepad", settings)).append(" ").append($("<b/>").addClass("caret"));
      npRoot.append(npLink);
      var npMenu = $("<ul/>").addClass("dropdown-menu");
      var notepad = $("<textarea/>").attr("id", "notepad").attr("rows", 10).addClass("form-control notepad-saved");
      var timeout = 0;
      notepad.val(settings.general["notepad"].content).on("input", function (e) {
        notepad.removeClass("notepad-saved");
        if (timeout) clearTimeout(timeout);
        var content = notepad.val();
        timeout = setTimeout(function () {
          settings.general["notepad"].content = content;
          chrome.storage.local.set({general: settings.general});
          notepad.addClass("notepad-saved");
        }, 500);
      }).click(function (e) {
        e.stopPropagation();
      });
      npMenu.append($("<li/>").append(notepad));
      npRoot.append(npMenu);
      $("#menu-left").append(npRoot);
    }
    // get weather
    var weatherCallbacks = [];
    if (settings.general["weather"].show && !chrome.extension.inIncognitoContext) {
      chrome.permissions.contains({
        origins: ajaxPerms["weather"]
      }, function (has) {
        if (!has || !settings.general["weather"].location) {
          settings.general["weather"].show = false;
          return;
        }
        if (navigator.onLine) {
          var loc = encodeURIComponent(settings.general["weather"].location);
          var unit = (settings.general["weather"].celsius ? "metric" : "imperial");
          $.ajax({
            url: "http://api.openweathermap.org/data/2.5/weather?APPID=833b8b2bb6161e0c2b43dab37d0c93a7&q=" + loc + "&units=" + unit,
            success: function success(resp, stat, xhr) {
              var conds = [];
              $.each(resp.weather, function (i, item) {
                conds.push(item.description);
              });
              var temp = Math.round(resp.main.temp);
              var title = resp.name + ": " + cap((settings.style["topbar"].labels ? "" : temp + " degrees, ") + conds.join(", "));
              var link = $("<a/>").attr("id", "menu-weather").attr("href", "http://www.openweathermap.org/city/" + resp.id)
                .attr("title", title).hide();
              link.append(fa("cloud", false)).append(label(temp + "&deg;" + (unit === "metric" ? "C" : "F"), settings));
              // always show before proxy link if that loads first
              if ($("#menu-proxy").length) {
                $("#menu-proxy").before($("<li/>").append(link));
              } else {
                $("#menu-left").append($("<li/>").append(link));
              }
              link.fadeIn();
              // return any pending callbacks
              for (var i in weatherCallbacks) {
                weatherCallbacks[i].call();
              }
            }
          });
        }
      });
    }
    // get IP address / proxy status
    var proxyCallbacks = [];
    if (settings.general["proxy"]) {
      chrome.permissions.contains({
        origins: ajaxPerms["proxy"]
      }, function (has) {
        if (!has) {
          settings.general["proxy"] = false;
          return;
        }
        var link = $("<a/>").attr("id", "menu-proxy");
        if (navigator.onLine) {
          $.ajax({
            url: "http://www.whatismyproxy.com",
            success: function success(resp, stat, xhr) {
              var params = $(".h1", resp).text().split("IP address: ");
              link.attr("href", "http://www.whatismyproxy.com").hide();
              link.append(fa(params[0] === "No proxies were detected." ? "desktop" : "exchange", false)).append(label(params[1], settings));
              $("#menu-left").append($("<li/>").attr("id", "menu-proxy").append(link));
              link.fadeIn();
            },
            error: function (xhr, stat, err) {
              link.append(fa("power-off", false)).append(label("No connection", settings)).hide();
              $("#menu-left").append($("<li/>").attr("id", "menu-proxy").append(link));
              link.fadeIn();
            },
            complete: function (xhr, stat) {
              // return any pending callbacks
              for (var i in proxyCallbacks) {
                proxyCallbacks[i].call();
              }
            }
          });
        } else {
          link.append(fa("power-off", false)).append(label("No connection", settings)).hide();
          $("#menu-left").append($("<li/>").append(link));
          link.fadeIn();
          // return any pending callbacks
          for (var i in proxyCallbacks) {
            proxyCallbacks[i].call();
          }
        }
      });
    }
    /*
    Links: customizable grid of links and menus
    */
    if (settings.bookmarks["enable"] && settings.bookmarks["merge"] && settings.bookmarks["above"]) $("#links").before($("#bookmarks"));
    // monitor Ctrl key to open links in a new tab
    var ctrlDown = false;
    $(window).keydown(function (e) {
      if (e.keyCode === 17) ctrlDown = true;
    }).keyup(function (e) {
      if (e.keyCode === 17) ctrlDown = false;
    });
    // special link handling
    var fixLinkHandling = function fixLinkHandling(context) {
      // open Chrome links via Tabs API
      $(".link-chrome", context).off("click").click(function (e) {
        // normal click, not external
        if (e.which === 1 && !ctrlDown && !$(this).hasClass("link-external")) {
          chrome.tabs.update({url: this.href});
          e.preventDefault();
          // middle click, Ctrl+click, or set as external
        } else if (e.which <= 2) {
          chrome.tabs.create({url: this.href, active: $(this).hasClass("link-external")});
          e.preventDefault();
        }
      });
      // always open external links in a new tab
      $(".link-external", context).off("click").click(function (e) {
        if (!$(this).hasClass("link-chrome")) {
          chrome.tabs.create({url: this.href, active: true});
          e.preventDefault();
        }
      });
    };
    if (!settings.bookmarks["enable"]) $("#menu-links").hide();
    var populateLinks = function populateLinks() {
      $("#alerts, #links").empty();
      if (settings.links["edit"].dragdrop) $("#links").off("sortupdate");
      // loop through blocks
      $(settings.links["content"]).each(function (i, linkBlk) {
        if (!linkBlk.title) linkBlk.title = "";
        if (!linkBlk.buttons) linkBlk.buttons = [];
        var blk = $("<div/>").addClass("panel panel-" + settings.style["panel"] + " sortable").data("pos", i);
        var head = $("<div/>").addClass("panel-heading").text(linkBlk.title).dblclick(function (e) {
          $("#links-editor").data("block", i).modal("show");
        });
        if (!linkBlk.title) head.html("&nbsp;");
        // edit controls dropdown on header
        if (settings.links["edit"].menu) {
          var editRoot = $("<div/>").addClass("btn-group pull-right");
          var editBtn = $("<button/>").addClass("btn btn-xs btn-default dropdown-toggle").attr("data-toggle", "dropdown").append($("<b/>").addClass("caret")).hide();
          editRoot.append(editBtn);
          var editMenu = $("<ul/>").addClass("dropdown-menu");
          if (i > 0) {
            editMenu.append($("<li/>").append($("<a/>").append(fa("angle-double-left")).append(" Move to start").click(function (e) {
              for (var x = i; x > 0; x--) {
                settings.links["content"][x] = settings.links["content"][x - 1];
              }
              settings.links["content"][0] = linkBlk;
              populateLinks();
              chrome.storage.local.set({"links": settings.links});
            })));
            editMenu.append($("<li/>").append($("<a/>").append(fa("angle-left")).append(" Move left").click(function (e) {
              settings.links["content"][i] = settings.links["content"][i - 1];
              settings.links["content"][i - 1] = linkBlk;
              populateLinks();
              chrome.storage.local.set({"links": settings.links});
            })));
          }
          var max = settings.links["content"].length - 1;
          if (i < max) {
            editMenu.append($("<li/>").append($("<a/>").append(fa("angle-right")).append(" Move right").click(function (e) {
              settings.links["content"][i] = settings.links["content"][i + 1];
              settings.links["content"][i + 1] = linkBlk;
              populateLinks();
              chrome.storage.local.set({"links": settings.links});
            })));
            editMenu.append($("<li/>").append($("<a/>").append(fa("angle-double-right")).append(" Move to end").click(function (e) {
              for (var x = i; x < max; x++) {
                settings.links["content"][x] = settings.links["content"][x + 1];
              }
              settings.links["content"][max] = linkBlk;
              populateLinks();
              chrome.storage.local.set({"links": settings.links});
            })));
          }
          if (i > 0 || i < max) {
            editMenu.append($("<li/>").append($("<a/>").append(fa("arrows")).append(" Move to position").click(function (e) {
              var pos = prompt("Enter a new position for this block.", i);
              if (typeof(pos) === "string") {
                pos = parseInt(pos);
                if (!isNaN(pos)) {
                  if (pos < 0) pos = 0;
                  if (pos > max) pos = max;
                  if (pos < i) {
                    for (var x = i; x > pos; x--) {
                      settings.links["content"][x] = settings.links["content"][x - 1];
                    }
                  } else if (pos > i) {
                    for (var x = i; x < pos; x++) {
                      settings.links["content"][x] = settings.links["content"][x + 1];
                    }
                  }
                  settings.links["content"][pos] = linkBlk;
                  populateLinks();
                  chrome.storage.local.set({"links": settings.links});
                }
              }
            })));
            editMenu.append($("<li/>").addClass("divider"));
          }
          editMenu.append($("<li/>").append($("<a/>").append(fa("step-backward")).append(" New block before").click(function (e) {
            settings.links["content"].splice(i, 0, {
              title: "",
              buttons: []
            });
            $("#links-editor").data("block", i).modal("show");
            populateLinks();
            chrome.storage.local.set({"links": settings.links});
          })));
          editMenu.append($("<li/>").append($("<a/>").append(fa("step-forward")).append(" New block after").click(function (e) {
            settings.links["content"].splice(i + 1, 0, {
              title: "",
              buttons: []
            });
            $("#links-editor").data("block", i + 1).modal("show");
            populateLinks();
            chrome.storage.local.set({"links": settings.links});
          })));
          editMenu.append($("<li/>").append($("<a/>").append(fa("files-o")).append(" Duplicate block").click(function (e) {
            settings.links["content"].splice(i + 1, 0, $.extend(true, {}, linkBlk));
            populateLinks();
            chrome.storage.local.set({"links": settings.links});
          })));
          editMenu.append($("<li/>").addClass("divider"));
          editMenu.append($("<li/>").append($("<a/>").append(fa("pencil")).append(" Edit block").click(function (e) {
            $("#links-editor").data("block", i).modal("show");
          })));
          editMenu.append($("<li/>").append($("<a/>").append(fa("tag")).append(" Rename block").click(function (e) {
            var name = prompt("Enter a new name for this block.", linkBlk.title);
            if (typeof(name) === "string") {
              linkBlk.title = name;
              populateLinks();
              chrome.storage.local.set({"links": settings.links});
            }
          })));
          editMenu.append($("<li/>").append($("<a/>").append(fa("trash-o")).append(" Delete block").click(function (e) {
            if (confirm("Are you sure you want to delete " + (linkBlk.title ? linkBlk.title : "this block") + "?")) {
              settings.links["content"].splice(i, 1);
              populateLinks();
              chrome.storage.local.set({"links": settings.links});
            }
          })));
          editRoot.append(editMenu);
          head.append(editRoot);
          head.mouseenter(function (e) {
            editBtn.show();
          }).mouseleave(function (e) {
            editBtn.hide();
            if (editRoot.hasClass("open")) {
              editBtn.dropdown("toggle");
            }
          });
        }
        blk.append(head);
        var body = $("<div/>").addClass("panel-body");
        // loop through buttons
        $.each(linkBlk.buttons, function (j, linkBtn) {
          if (!linkBtn.title) linkBtn.title = "";
          if (!linkBtn.style) linkBtn.style = "default";
          var btn;
          if (linkBtn.menu) {
            btn = $("<div/>").addClass("btn-group btn-block");
            btn.append($("<button/>").addClass("btn btn-block btn-" + linkBtn.style + " dropdown-toggle").attr("data-toggle", "dropdown")
              .text(linkBtn.title + " ").append($("<b/>").addClass("caret")));
            var menu = $("<ul/>").addClass("dropdown-menu");
            // loop through menu items
            var urls = [];
            for (var k in linkBtn.menu) {
              var linkItem = linkBtn.menu[k];
              if (typeof(linkItem) === "string") {
                if (k > 0) menu.append($("<li/>").addClass("divider"));
                if (linkItem) menu.append($("<li/>").addClass("dropdown-header").text(linkItem));
              } else {
                if (!linkItem.title) linkItem.title = "";
                var item = $("<a/>").attr("href", linkItem.url).text(linkItem.title);
                // workaround for accessing Chrome and file URLs
                for (var prefix of ["chrome", "chrome-extension", "file"]) {
                  if (linkItem.url.substring(0, prefix.length + 3) === prefix + "://") {
                    item.addClass("link-chrome");
                    break;
                  }
                }
                // always open in new tab
                if (linkItem.external) item.addClass("link-external");
                menu.append($("<li/>").append(item));
                urls.push(linkItem.url);
              }
            }
            // middle-click to open all
            if (settings.links["behaviour"].dropdownmiddle) {
              var active = false;
              btn.mousedown(function (e) {
                active = true;
              }).mouseup(function (e) {
                if (e.which === 1 && active && e.ctrlKey) {
                  e.preventDefault();
                  for (var i in urls) chrome.tabs.create({url: urls[i], active: false});
                  active = false;
                }
              });
            }
            btn.append(menu);
          } else {
            btn = $("<a/>").addClass("btn btn-block btn-" + linkBtn.style).attr("href", linkBtn.url).text(linkBtn.title);
            if (!linkBtn.title) btn.html("&nbsp;");
            // workaround for accessing Chrome and file URLs
            for (var prefix of ["chrome", "chrome-extension", "file"]) {
              if (linkBtn.url.substring(0, prefix.length + 3) === prefix + "://") {
                btn.addClass("link-chrome");
                break;
              }
            }
            // always open in new tab
            if (linkBtn.external) btn.addClass("link-external");
          }
          body.append(btn);
        });
        blk.append(body);
        $("#links").append($("<div/>").addClass("col-lg-2 col-md-3 col-sm-4 col-xs-6").append(blk));
      });
      // drag block headings to reorder
      if (settings.links["edit"].dragdrop) {
        $("#links").sortable({handle: ".panel-heading"}).on("sortupdate", function (e) {
          var old = settings.links["content"];
          settings.links["content"] = [];
          $(".panel", this).each(function (i, blk) {
            settings.links["content"].push(old[$(blk).data("pos")]);
          });
          populateLinks();
          chrome.storage.local.set({"links": settings.links});
        });
      }
      fixLinkHandling();
    };
    populateLinks();
    // generate editor modal
    $("#links-editor").on("show.bs.modal", function (e) {
      var i = $(this).data("block");
      // working copy
      var linkBlk = $.extend(true, {}, settings.links["content"][i]);
      $("#links-editor-title").val(linkBlk.title);
      var populateLinkEditor = function populateLinkEditor(noscroll) {
        // remember scroll position
        var scroll = noscroll ? 0 : document.body.scrollTop;
        $("#links-editor-body").empty();
        if (!linkBlk.buttons.length) {
          $("#links-editor-body").append($("<div/>").addClass("alert alert-info").text("No buttons added yet."));
        }
        // loop through buttons in block
        $(linkBlk.buttons).each(function (j, linkBtn) {
          var blk = $("<div/>").addClass("well well-sm");
          var group = $("<div/>").addClass("input-group form-control-pad-bottom");
          // left menu
          var btnRootLeft = $("<span/>").addClass("input-group-btn");
          var optsBtn = $("<button/>").addClass("btn btn-default dropdown-toggle").attr("data-toggle", "dropdown").append($("<b/>").addClass("caret"));
          btnRootLeft.append(optsBtn);
          var optsMenu = $("<ul/>").addClass("dropdown-menu");
          if (j > 0) {
            optsMenu.append($("<li/>").append($("<a/>").append(fa("angle-double-up")).append(" Move to top").click(function (e) {
              for (var x = j; x > 0; x--) {
                linkBlk.buttons[x] = linkBlk.buttons[x - 1];
              }
              linkBlk.buttons[0] = linkBtn;
              populateLinkEditor();
            })));
            optsMenu.append($("<li/>").append($("<a/>").append(fa("angle-up")).append(" Move up").click(function (e) {
              linkBlk.buttons[j] = linkBlk.buttons[j - 1];
              linkBlk.buttons[j - 1] = linkBtn;
              populateLinkEditor();
            })));
          }
          var max = linkBlk.buttons.length - 1;
          if (j < max) {
            optsMenu.append($("<li/>").append($("<a/>").append(fa("angle-down")).append(" Move down").click(function (e) {
              linkBlk.buttons[j] = linkBlk.buttons[j + 1];
              linkBlk.buttons[j + 1] = linkBtn;
              populateLinkEditor();
            })));
            optsMenu.append($("<li/>").append($("<a/>").append(fa("angle-double-down")).append(" Move to bottom").click(function (e) {
              for (var x = j; x < max; x++) {
                linkBlk.buttons[x] = linkBlk.buttons[x + 1];
              }
              linkBlk.buttons[max] = linkBtn;
              populateLinkEditor();
            })));
          }
          if (j > 0 || j < max) {
            optsMenu.append($("<li/>").addClass("divider"));
          }
          if (linkBtn.menu && linkBtn.menu.length === 1) {
            optsMenu.append($("<li/>").append($("<a/>").append(fa("level-up")).append(" Convert to link").click(function (e) {
              linkBtn.title = linkBtn.menu[0].title;
              linkBtn.url = linkBtn.menu[0].url;
              delete linkBtn.menu;
              populateLinkEditor();
            })));
            optsMenu.append($("<li/>").addClass("divider"));
          } else if (!linkBtn.menu) {
            optsMenu.append($("<li/>").append($("<a/>").append(fa("level-down")).append(" Convert to menu").click(function (e) {
              linkBtn.menu = [
                {
                  title: linkBtn.title,
                  url: linkBtn.url
                }
              ];
              linkBtn.title = "";
              delete linkBtn.url;
              populateLinkEditor();
            })));
            optsMenu.append($("<li/>").addClass("divider"));
          }
          optsMenu.append($("<li/>").append($("<a/>").append(fa("trash-o")).append(" Delete button").click(function (e) {
            if (confirm("Are you sure you want to delete " + (linkBtn.title ? linkBtn.title : "this button") + "?")) {
              linkBlk.buttons.splice(j, 1);
              populateLinkEditor();
            }
          })));
          btnRootLeft.append(optsMenu);
          group.append(btnRootLeft);
          group.append($("<input>").attr("type", "text").addClass("form-control").attr("placeholder", "Button label").val(linkBtn.title).change(function (e) {
            linkBtn.title = $(this).val();
          }));
          // right menus
          var btnRootRight = $("<span/>").addClass("input-group-btn");
          if (!linkBtn.style) {
            linkBtn.style = "default";
          }
          var styles = ["default", "light", "dark", "primary", "info", "success", "warning", "danger"];
          var stylePreview = $("<button/>").addClass("btn btn-" + linkBtn.style).html("&nbsp");
          var styleOpts = [];
          stylePreview.click(function (e) {
            stylePreview.detach();
            btnRootRight.append(styleOpts);
          });
          $(styles).each(function (k, style) {
            styleOpts.push($("<button/>").addClass("btn btn-" + style).html("&nbsp;").click(function (e) {
              linkBtn.style = style;
              $(styleOpts).each(function (l, opt) {
                $(opt).detach();
              });
              // remove all button style classes
              stylePreview.removeClass(function (l, css) {
                return (css.match(/\bbtn-\S+/g) || []).join(" ");
              }).addClass("btn-" + styles[k]);
              btnRootRight.append(stylePreview);
            }));
          });
          styleOpts.push($("<button/>").addClass("btn btn-default").append($("<i/>").addClass("fa fa-magic")).click(function (e) {
            var cls = prompt("Enter a class name to apply to the button.\n\nUse the custom CSS box in Settings to add a button style for this name.", "");
            if (!cls) return;
            linkBtn.style = cls;
            if (styles.indexOf(cls) > -1) cls = "btn-" + cls;
            $(styleOpts).each(function (l, opt) {
              $(opt).detach();
            });
            // remove all button style classes
            stylePreview.removeClass(function (l, css) {
              return (css.match(/\bbtn-\S+/g) || []).join(" ");
            }).addClass(cls);
            btnRootRight.append(stylePreview);
          }));
          btnRootRight.append(stylePreview);
          group.append(btnRootRight);
          blk.append(group);
          // link/menu options
          if (linkBtn.menu) {
            var tbody = $("<tbody/>");
            $(linkBtn.menu).each(function (k, linkItem) {
              var tr = $("<tr/>");
              var menuOptsRoot = $("<div/>").addClass("btn-group btn-block");
              menuOptsRoot.append($("<button/>").addClass("btn btn-block btn-default dropdown-toggle").attr("data-toggle", "dropdown").append($("<b/>").addClass("caret")));
              var menuOptsMenu = $("<ul/>").addClass("dropdown-menu");
              if (k > 0) {
                menuOptsMenu.append($("<li/>").append($("<a/>").append(fa("angle-double-up")).append(" Move to top").click(function (e) {
                  for (var x = k; x > 0; x--) {
                    linkBtn.menu[x] = linkBtn.menu[x - 1];
                  }
                  linkBtn.menu[0] = linkItem;
                  populateLinkEditor();
                })));
                menuOptsMenu.append($("<li/>").append($("<a/>").append(fa("angle-up")).append(" Move up").click(function (e) {
                  linkBtn.menu[k] = linkBtn.menu[k - 1];
                  linkBtn.menu[k - 1] = linkItem;
                  populateLinkEditor();
                })));
              }
              var max = linkBtn.menu.length - 1;
              if (k < max) {
                menuOptsMenu.append($("<li/>").append($("<a/>").append(fa("angle-down")).append(" Move down").click(function (e) {
                  linkBtn.menu[k] = linkBtn.menu[k + 1];
                  linkBtn.menu[k + 1] = linkItem;
                  populateLinkEditor();
                })));
                menuOptsMenu.append($("<li/>").append($("<a/>").append(fa("angle-double-down")).append(" Move to bottom").click(function (e) {
                  for (var x = k; x < max; x++) {
                    linkBtn.menu[x] = linkBtn.menu[x + 1];
                  }
                  linkBtn.menu[max] = linkItem;
                  populateLinkEditor();
                })));
              }
              if (k > 0 || k < max) {
                menuOptsMenu.append($("<li/>").addClass("divider"));
              }
              menuOptsMenu.append($("<li/>").append($("<a/>").append(fa("trash-o")).append(" Delete item").click(function (e) {
                linkBtn.menu.splice(k, 1);
                populateLinkEditor();
              })));
              menuOptsRoot.append(menuOptsMenu);
              tr.append($("<td/>").append(menuOptsRoot));
              if (typeof(linkItem) === "string") {
                var title = $("<input>").attr("type", "text").addClass("form-control").attr("placeholder", "Section header (leave blank for none)").val(linkItem).change(function (e) {
                  linkBtn.menu[k] = $(this).val();
                });
                tr.append($("<td/>").attr("colspan", 3).append(title));
              } else {
                var title = $("<input>").attr("type", "text").addClass("form-control").attr("placeholder", "Label").val(linkItem.title).change(function (e) {
                  linkItem.title = $(this).val();
                });
                tr.append($("<td/>").append(title));
                var linkGroup = $("<div/>").addClass("input-group");
                var url = $("<input>").attr("type", "text").addClass("form-control").attr("placeholder", "Link URL").val(linkItem.url).change(function (e) {
                  linkItem.url = $(this).val();
                })
                linkGroup.append(url);
                var linkItemRootRight = $("<span/>").addClass("input-group-btn");
                var check = $("<button/>").addClass("btn btn-default dropdown-toggle").attr("data-toggle", "dropdown");
                if (linkItem.external) {
                  check.append(fa("external-link")).append(" New tab");
                } else {
                  check.append(fa("sign-in")).append(" Same tab");
                }
                check.click(function (e) {
                  linkItem.external = !linkItem.external;
                  check.empty();
                  if (linkItem.external) {
                    check.append(fa("external-link")).append(" New tab");
                  } else {
                    check.append(fa("sign-in")).append(" Same tab");
                  }
                });
                linkItemRootRight.append(check);
                linkGroup.append(linkItemRootRight);
                tr.append($("<td/>").append(linkGroup));
              }
              tbody.append(tr);
            });
            blk.append($("<table/>").addClass("table table-bordered table-condensed").append(tbody));
            var menuBtnsRoot = $("<div/>").addClass("btn-group");
            menuBtnsRoot.append($("<button/>").addClass("btn btn-default").append(fa("globe")).append(" Add link").click(function (e) {
              linkBtn.menu.push({
                title: "",
                url: ""
              });
              populateLinkEditor();
            }));
            menuBtnsRoot.append($("<button/>").addClass("btn btn-default").append(fa("indent")).append(" Add section").click(function (e) {
              linkBtn.menu.push("");
              populateLinkEditor();
            }));
            blk.append(menuBtnsRoot);
          } else {
            var linkGroup = $("<div/>").addClass("input-group");
            var url = $("<input>").attr("type", "text").addClass("form-control").attr("placeholder", "Link URL").val(linkBtn.url).change(function (e) {
              linkBtn.url = $(this).val();
            })
            linkGroup.append(url);
            var linkBtnRootRight = $("<span/>").addClass("input-group-btn");
            var check = $("<button/>").addClass("btn btn-default dropdown-toggle").attr("data-toggle", "dropdown");
            if (linkBtn.external) {
              check.append(fa("external-link")).append(" New tab");
            } else {
              check.append(fa("sign-in")).append(" Same tab");
            }
            check.click(function (e) {
              linkBtn.external = !linkBtn.external;
              check.empty();
              if (linkBtn.external) {
                check.append(fa("external-link")).append(" New tab");
              } else {
                check.append(fa("sign-in")).append(" Same tab");
              }
            });
            linkBtnRootRight.append(check);
            linkGroup.append(linkBtnRootRight);
            blk.append(linkGroup);
          }
          $("#links-editor-body").append(blk);
        });
        // reset scroll position
        window.scrollTo(0, scroll);
      };
      // add buttons to block
      $("#links-editor-add-link").click(function (e) {
        linkBlk.buttons.push({
          title: "",
          url: "",
          style: "default"
        });
        populateLinkEditor();
      })
      $("#links-editor-add-menu").click(function (e) {
        linkBlk.buttons.push({
          title: "",
          menu: [],
          style: "default"
        });
        populateLinkEditor();
      })
      // save block
      $("#links-editor-save").click(function (e) {
        linkBlk.title = $("#links-editor-title").val();
        settings.links["content"][i] = linkBlk;
        $("#links-editor").modal("hide");
        populateLinks();
        chrome.storage.local.set({"links": settings.links});
      })
      // delete block
      $("#links-editor-delete").click(function (e) {
        if (confirm("Are you sure you want to delete " + (linkBlk.title ? linkBlk.title : "this block") + "?")) {
          settings.links["content"].splice(i, 1);
          $("#links-editor").modal("hide");
          populateLinks();
          chrome.storage.local.set({"links": settings.links});
        }
      })
      populateLinkEditor(true);
    }).on("hide.bs.modal", function (e) {
      $("#links-editor-add-link, #links-editor-add-menu, #links-editor-save, #links-editor-delete").off("click");
    });
    if (firstRun) {
      var alert = $("<div/>").addClass("alert alert-success alert-dismissable");
      alert.append($("<button/>").addClass("close").attr("data-dismiss", "alert").html("&times;").click(function (e) {
        chrome.storage.local.set(settings);
      }));
      alert.append("<span><strong>Welcome to " + manif.name + "!</strong>  To get you started, here are a few sample blocks for your new New Tab page.  "
        + "Feel free to change or add to them by hovering over the block headings for controls.  "
        + "Head into Settings for more advanced options, where you can add bookmarks, history, apps, widgets, keyboard shortcuts and more.</span>");
      $("#alerts").append(alert);
    }
    if (!settings.links["content"].length) {
      var text = $("<span><strong>You don't have any links added yet!</strong>  Get started by <a>adding a new block</a>.</span>");
      $("a", text).click(function (e) {
        settings.links["content"].push({
          title: "",
          buttons: []
        });
        $("#links-editor").data("block", settings.links["content"].length - 1).modal("show");
        populateLinks();
        chrome.storage.local.set({"links": settings.links});
      })
      $("#alerts").append($("<div/>").addClass("alert alert-info").append(text));
    }
    // switch to links page
    $("#menu-links").click(function (e) {
      $(".navbar-right li").removeClass("active");
      $(this).addClass("active");
      $(".main").hide();
      $("#links").show();
    });
    /*
    Bookmarks: lightweight bookmark browser
    */
    var bookmarksCallbacks = [];
    if (settings.bookmarks["enable"]) {
      chrome.permissions.contains({
        permissions: ["bookmarks"]
      }, function (has) {
        if (!has) {
          settings.bookmarks["enable"] = false;
          return;
        }
        $("#bookmarks").addClass("panel-" + settings.style["panel"]);
        // switch to bookmarks page
        $("#menu-bookmarks").click(function (e) {
          $(".navbar-right li").removeClass("active");
          $(this).addClass("active");
          $(".main").hide();
          $("#bookmarks").show();
        });
        // show split pane if enabled
        if (settings.bookmarks["split"]) {
          $("#bookmarks-block").before($("<div/>").attr("id", "bookmarks-block-folders").addClass("panel-body"));
          $("#bookmarks-block").before($("<hr/>"));
        }
        // pre-process the bookmark tree to add parent references
        var processBookmarks = function processBookmarks(root) {
          for (var i in root.children) {
            root.children[i].parent = root;
            if (root.children[i].children) processBookmarks(root.children[i]);
          }
          return root;
        };
        // create a button for a bookmark node
        var renderBookmark = function renderBookmark(node) {
          // bookmark
          if (node.url) {
            // bookmarklet
            if (node.url.substring(0, "javascript:".length) === "javascript:") {
              if (settings.bookmarks["bookmarklets"]) {
                return $("<button/>").addClass("btn btn-info disabled").append(fa("code")).append(" " + node.title);
              }
            } else {
              var link = $("<a/>").addClass("btn btn-primary").attr("href", node.url).append(fa("file")).append(" " + node.title);
              // workaround for accessing Chrome and URLs
              for (var prefix of ["chrome", "chrome-extension", "file"]) {
                if (node.url.substring(0, prefix.length + 3) === prefix + "://") {
                  link.addClass("link-chrome");
                  break;
                }
              }
              return link;
            }
            // folder
          } else if (node.children) {
            return $("<button/>").addClass("btn btn-warning").append(fa("folder" + (node.children.length ? "" : "-o"))).append(" " + node.title).click(function (e) {
              // normal click
              if (e.which === 1 && (!ctrlDown || !settings.bookmarks["foldercontents"])) {
                populateBookmarks(node);
                // middle click or Ctrl+click, if enabled
              } else if (e.which <= 2 && settings.bookmarks["foldercontents"]) {
                $(node.children).each(function (i, child) {
                  if (child.url && child.url.substring(0, "javascript:".length) !== "javascript:") chrome.tabs.create({
                    url: child.url,
                    active: false
                  });
                });
              }
            });
          }
        };
        // display a folder in the bookmarks pane
        var populateBookmarks = function populateBookmarks(root) {
          // clear current list
          $("#bookmarks-title, #bookmarks-block, #bookmarks-block-folders").empty();
          if (!root.children.length) {
            $("#bookmarks-block").show().append($("<div/>").addClass("alert alert-info").append("<span>Nothing in this folder.</span>"));
            $("#bookmarks-block-folders").hide();
          }
          $("#bookmarks-block-search, hr.bookmarks-search").remove();
          $("#bookmarks-search").val("");
          // loop through folder children and add to pane
          $(root.children).each(function (i, node) {
            var link = renderBookmark(node);
            var container = $("#bookmarks-block" + (settings.bookmarks["split"] && link.hasClass("btn-warning") ? "-folders" : ""));
            container.append(link);
          });
          $("#bookmarks-block, #bookmarks-block-folders").each(function (i, blk) {
            $(blk).toggle(!$(blk).is(":empty"));
          });
          $("#bookmarks hr").toggle(!$("#bookmarks-block, #bookmarks-block-folders").is(":empty"));
          // open Chrome links via Tabs API
          $(".link-chrome", "#bookmarks-block").click(function (e) {
            // normal click, not external
            if (e.which === 1 && !ctrlDown && !$(this).hasClass("link-external")) {
              chrome.tabs.update({url: this.href});
              e.preventDefault();
              // middle click, Ctrl+click, or set as external
            } else if (e.which <= 2) {
              chrome.tabs.create({url: this.href, active: $(this).hasClass("link-external")});
              e.preventDefault();
            }
          });
          // breadcrumb navigation
          var current = root;
          var path = [root];
          while (current.parent) {
            current = current.parent;
            path.unshift(current);
          }
          $(path).each(function (i, node) {
            if (i > 0) $("#bookmarks-title").append($("<span/>").addClass("caret-right"));
            $("#bookmarks-title").append($("<button/>").addClass("btn btn-sm btn-default").text(node.title).click(function (e) {
              populateBookmarks(node);
            }));
          });
        };
        // request tree from Bookmarks API
        chrome.bookmarks.getTree(function bookmarksCallback(tree) {
          var root = processBookmarks(tree[0]);
          root.title = "Bookmarks";
          populateBookmarks(root);
          if (settings.bookmarks["merge"]) {
            $("#bookmarks").fadeIn();
          } else {
            $("#menu-bookmarks").show();
          }
          // bookmark search
          var timeout = 0;
          $("#bookmarks-search").on("input", function (e) {
            var text = $(this).val().toLowerCase();
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(function () {
              if (!text) {
                $("#bookmarks-block-search, hr.bookmarks-search").remove();
                return;
              }
              var results = [];
              var search = function search(node) {
                // bookmark matching search
                if (node.title && node.title.toLowerCase().indexOf(text) > -1) {
                  results.push(node);
                }
                // folder
                if (node.children) {
                  $.each(node.children, function (i, child) {
                    search(child);
                  });
                }
              };
              search(root);
              var block = $("#bookmarks-block-search");
              if (block.length) {
                $("#bookmarks-block-search").empty();
              } else {
                block = $("<div/>").attr("id", "bookmarks-block-search").addClass("panel-body");
                $("#bookmarks .panel-heading").after($("<hr/>").addClass("bookmarks-search")).after(block);
              }
              if (results.length) {
                $.each(results, function (i, node) {
                  $("#bookmarks-block-search").append(renderBookmark(node));
                });
                // open Chrome links via Tabs API
                $(".link-chrome", "#bookmarks-block-search").click(function (e) {
                  // normal click, not external
                  if (e.which === 1 && !ctrlDown && !$(this).hasClass("link-external")) {
                    chrome.tabs.update({url: this.href});
                    e.preventDefault();
                    // middle click, Ctrl+click, or set as external
                  } else if (e.which <= 2) {
                    chrome.tabs.create({url: this.href, active: $(this).hasClass("link-external")});
                    e.preventDefault();
                  }
                });
              } else {
                $("#bookmarks-block-search").append($("<div/>").addClass("alert alert-info").text("No results."));
              }
            }, 200);
          });
        });
        // return any pending callbacks
        for (var i in bookmarksCallbacks) {
          bookmarksCallbacks[i].call();
        }
      });
    }
    /*
    Apps: installed Chrome apps drop-down
    */
    if (settings.general["apps"] && !chrome.extension.inIncognitoContext) {
      chrome.permissions.contains({
        permissions: ["management"]
      }, function (has) {
        if (!has) {
          settings.general["apps"] = false;
          return;
        }
        chrome.management.getAll(function (apps) {
          var show = false;
          $.each(apps, function (i, app) {
            if (app.enabled && ["hosted_app", "packaged_app", "legacy_packaged_app"].indexOf(app.type) > -1) {
              var link = $("<a/>").text(app.name).click(function (e) {
                chrome.management.launchApp(app.id);
                e.preventDefault();
              });
              if (app.appLaunchUrl) link.attr("href", app.appLaunchUrl);
              $("#apps-list").append($("<li/>").append(link));
              show = true;
            }
          });
          if (show) {
            var all = $("<a/>").attr("href", "chrome://apps").addClass("link-chrome").append(fa("th")).append(" View all apps");
            var allCont = $("<li/>").append(all);
            fixLinkHandling(allCont);
            var store = $("<a/>").attr("href", "https://chrome.google.com/webstore");
            $("#apps-list").append($("<li/>").addClass("divider"))
              .append(allCont)
              .append($("<li/>").append(store.append(fa("shopping-cart")).append(" Chrome Web Store")));
            $("#menu-apps").show();
          }
        });
      });
    }
    /*
    History: quick drop-down of recent pages
    */
    // only show if enabled and not in incognito
    if (settings.history["enable"] && !chrome.extension.inIncognitoContext) {
      chrome.permissions.contains({
        permissions: ["history"]
      }, function (has) {
        if (!has) {
          settings.history["enable"] = false;
          return;
        }
        if (settings.history["limit"] === 0) settings.history["limit"] = 10;
        var block = true;
        $("#history-title").click(function (e) {
          // delay opening list until loaded
          if (block && !$(this).hasClass("active")) {
            e.stopPropagation();
            // request items from History API
            chrome.history.search({text: "", maxResults: settings.history["limit"]}, function historyCallback(results) {
              $("#history-list").empty();
              // loop through history items
              for (var i in results) {
                var res = results[i];
                var link = $("<a/>").attr("href", res.url).text(trim(res.title ? res.title : res.url, 50));
                // workaround for accessing Chrome and file URLs
                for (var prefix of ["chrome", "chrome-extension", "file"]) {
                  if (res.url.substring(0, prefix.length + 3) === prefix + "://") {
                    link.click(function (e) {
                      // normal click, not external
                      if (e.which === 1 && !ctrlDown && !$(this).hasClass("link-external")) {
                        chrome.tabs.update({url: this.href});
                        e.preventDefault();
                        // middle click, Ctrl+click, or set as external
                      } else if (e.which <= 2) {
                        chrome.tabs.create({url: this.href, active: $(this).hasClass("link-external")});
                        e.preventDefault();
                      }
                    });
                    break;
                  }
                }
                // add to dropdown
                $("#history-list").append($("<li/>").append(link));
              }
              $("#history-list").append($("<li/>").addClass("divider"));
              $("#history-list").append($("<li/>").append($("<a/>").addClass("link-chrome").append(fa("search")).append(" View full history").attr("href", "chrome://history")));
              fixLinkHandling("#history-list");
              block = false;
              $("#history-title").click();
            });
            // reset block
          } else {
            block = true;
          }
        });
        $("#menu-history").show();
      });
    }
    /*
    Settings: modal to customize links and options
    */
    // set to current data
    /**
     *
     */
    var populateSettings = function populateSettings() {
      $("#settings-links-edit-menu").prop("checked", settings.links["edit"].menu);
      $("#settings-links-edit-dragdrop").prop("checked", settings.links["edit"].dragdrop);
      $("#settings-links-behaviour-dropdownmiddle").prop("checked", settings.links["behaviour"].dropdownmiddle);
      $("#settings-bookmarks-enable").prop("checked", settings.bookmarks["enable"]);
      // highlight bookmarks permission status
      chrome.permissions.contains({
        permissions: ["bookmarks"]
      }, function (has) {
        if (has) {
          $(".settings-perm-bookmarks").addClass("has-success");
        } else {
          $(".settings-perm-bookmarks").addClass("has-warning");
          $("#settings-bookmarks-enable").prop("checked", false);
        }
      });
      $("#settings-bookmarks-bookmarklets").prop("checked", settings.bookmarks["bookmarklets"]);
      $("#settings-bookmarks-foldercontents").prop("checked", settings.bookmarks["foldercontents"]);
      $("#settings-bookmarks-split").prop("checked", settings.bookmarks["split"]);
      $("#settings-bookmarks-merge").prop("checked", settings.bookmarks["merge"]);
      $("#settings-bookmarks-bookmarklets, #settings-bookmarks-foldercontents, #settings-bookmarks-split, #settings-bookmarks-merge")
        .prop("disabled", !settings.bookmarks["enable"]).parent().toggleClass("text-muted", !settings.bookmarks["enable"]);
      $("#settings-bookmarks-above").prop("checked", settings.bookmarks["above"])
        .prop("disabled", !(settings.bookmarks["enable"] && settings.bookmarks["merge"]))
        .parent().toggleClass("text-muted", !(settings.bookmarks["enable"] && settings.bookmarks["merge"]));
      $("#settings-history-enable").prop("checked", settings.history["enable"]);
      // highlight history permission status
      chrome.permissions.contains({
        permissions: ["history"]
      }, function (has) {
        if (has) {
          $(".settings-perm-history").addClass("has-success");
        } else {
          $(".settings-perm-history").addClass("has-warning");
          $("#settings-history-enable").prop("checked", false);
        }
      });
      $("#settings-history-limit").val(settings.history["limit"])
        .prop("disabled", !settings.history["enable"])
        .parent().toggleClass("text-muted", !settings.history["enable"]);
      $("#settings-history-limit-value").text(settings.history["limit"])
        .parent().toggleClass("text-muted", !settings.history["enable"]);
      // highlight notif/basket permissions status
      $(".settings-perm").each(function (i, group) {
        var key = $(group).data("key");
        chrome.permissions.contains({
          origins: ajaxPerms[key]
        }, function (has) {
          if (has) {
            $(group).addClass("has-success");
          } else {
            $(group).addClass("has-warning");
            $("input[type=checkbox]", group).prop("checked", false);
          }
        })
      });
      $("#settings-general-title").val(settings.general["title"]);
      $("#settings-general-keyboard").prop("checked", settings.general["keyboard"]);
      $("#settings-general-clock-show").prop("checked", settings.general["clock"].show);
      $("#settings-general-clock-twentyfour").prop("checked", settings.general["clock"].twentyfour)
        .prop("disabled", !settings.general["clock"].show)
        .parent().toggleClass("text-muted", !settings.general["clock"].show);
      $("#settings-general-clock-seconds").prop("checked", settings.general["clock"].seconds)
        .prop("disabled", !settings.general["clock"].show)
        .parent().toggleClass("text-muted", !settings.general["clock"].show);
      $("#settings-general-timer-stopwatch").prop("checked", settings.general["timer"].stopwatch);
      $("#settings-general-timer-countdown").prop("checked", settings.general["timer"].countdown);
      $("#settings-general-timer-beep").prop("checked", settings.general["timer"].beep)
        .prop("disabled", !settings.general["timer"].countdown)
        .parent().toggleClass("text-muted", !settings.general["timer"].countdown);
      $("#settings-general-notepad-show").prop("checked", settings.general["notepad"].show);
      $("#settings-general-apps").prop("checked", settings.general["apps"]);
      // highlight apps permission status
      chrome.permissions.contains({
        permissions: ["management"]
      }, function (has) {
        if (has) {
          $(".settings-perm-management").addClass("has-success");
        } else {
          $(".settings-perm-management").addClass("has-warning");
          $("#settings-general-apps").prop("checked", false);
        }
      });
      $("#settings-general-weather-show").prop("checked", settings.general["weather"].show);
      $("#settings-general-weather-location").val(settings.general["weather"].location)
        .prop("disabled", !settings.general["weather"].show)
        .parent().toggleClass("text-muted", !settings.general["weather"].show);
      $("#settings-general-weather-celsius").html("&deg;" + (settings.general["weather"].celsius ? "C" : "F"))
        .prop("disabled", !settings.general["weather"].show);
      $("#settings-general-proxy").prop("checked", settings.general["proxy"]);
      $("#settings-style-font").val(settings.style["font"]);
      $("#settings-style-fluid").prop("checked", settings.style["fluid"]);
      $("#settings-style-topbar-fix").prop("checked", settings.style["topbar"].fix);
      $("#settings-style-topbar-dark").prop("checked", settings.style["topbar"].dark);
      $("#settings-style-topbar-labels").prop("checked", settings.style["topbar"].labels);
      $("#settings-style-panel label.btn-" + settings.style["panel"]).click();
      $("#settings-style-background-image").data("val", settings.style["background"].image).prop("placeholder", "(unchanged)");
      $("#settings-style-background-repeat").prop("checked", settings.style["background"].repeat);
      $("#settings-style-background-centre").prop("checked", settings.style["background"].centre);
      $("#settings-style-background-fixed").prop("checked", settings.style["background"].fixed);
      $("#settings-style-background-stretch").prop("checked", settings.style["background"].stretch);
      $(".settings-style-background-check").prop("disabled", !settings.style["background"].image)
        .next().toggleClass("text-muted", !settings.style["background"].image);
      $("#settings-style-customcss-enable").prop("checked", settings.style["customcss"].enable);
      $("#settings-style-customcss-content").prop("disabled", !settings.style["customcss"].enable).val(settings.style["customcss"].content);
    }
    switch (settings.style["background"].image) {
      case "":
        $("#settings-style-background-image").prop("placeholder", "(none)");
        break;
      case "../img/bg.png":
        $("#settings-style-background-image").prop("placeholder", "(default)");
        break;
    }
    /***********************设置（样式）*********************************/
    // 请求获取字体
    chrome.fontSettings.getFontList(function fontsCallback(fonts) {
      for (var i in fonts) {
        $("#settings-style-font").append($("<option/>").text(fonts[i].displayName));
      }
      $("#settings-style-font").val(settings.style["font"]);
    });
    $(".ext-name").text(manif.name);
    $(".ext-ver").text(manif.version);
    // reset modal on show
    $("#settings").on("show.bs.modal", function (e) {
      $("#settings-alerts").empty();
      $(".form-group", "#settings-tab-links").removeClass("has-success has-error");
      $("#settings-style-panel label.active").removeClass("active");
      populateSettings();
      $($("#settings-tabs a")[0]).click();
    });
    $("#settings-bookmarks-enable").change(function (e) {
      $("#settings-alerts").empty();
      // grant bookmarks permissions
      if (this.checked) {
        chrome.permissions.request({
          permissions: ["bookmarks"]
        }, function (success) {
          if (success) {
            $(".settings-perm-bookmarks").removeClass("has-warning").addClass("has-success");
            $("#settings-bookmarks-bookmarklets, #settings-bookmarks-foldercontents, #settings-bookmarks-split, "
              + "#settings-bookmarks-merge")
              .prop("disabled", false).parent().removeClass("text-muted");
            $("#settings-bookmarks-above").prop("disabled", !$("#settings-bookmarks-merge").prop("checked"))
              .parent().toggleClass("text-muted", !$("#settings-bookmarks-merge").prop("checked"));
          } else {
            var text = "Permission denied for bookmarks.";
            $("#settings-alerts").append($("<div/>").addClass("alert alert-danger").text(text));
            $(this).prop("checked", false);
          }
        });
      } else {
        $("#settings-bookmarks-bookmarklets, #settings-bookmarks-foldercontents, #settings-bookmarks-split, "
          + "#settings-bookmarks-merge, #settings-bookmarks-above")
          .prop("disabled", true).parent().addClass("text-muted");
      }
    });
    $("#settings-bookmarks-merge").change(function (e) {
      $("#settings-bookmarks-above").prop("disabled", !($("#settings-bookmarks-enable").prop("checked") && this.checked))
        .parent().toggleClass("text-muted", !($("#settings-bookmarks-enable").prop("checked") && this.checked));
    });
    $("#settings-history-enable").change(function (e) {
      $("#settings-alerts").empty();
      // grant history permissions
      if (this.checked) {
        chrome.permissions.request({
          permissions: ["history"]
        }, function (success) {
          if (success) {
            $(".settings-perm-history").removeClass("has-warning").addClass("has-success");
            $("#settings-history-limit").prop("disabled", false).parent().removeClass("text-muted");
            $("#settings-history-limit-value").parent().removeClass("text-muted");
          } else {
            var text = "Permission denied for history.";
            $("#settings-alerts").append($("<div/>").addClass("alert alert-danger").text(text));
            $(this).prop("checked", false);
          }
        });
      } else {
        $("#settings-history-limit").prop("disabled", true).parent().addClass("text-muted");
        $("#settings-history-limit-value").parent().addClass("text-muted");
      }
    });
    $("#settings-history-limit").on("input change", function (e) {
      $("#settings-history-limit-value").text($(this).val());
    });
    // permission requests
    $(".settings-perm input[type=checkbox]").change(function (e) {
      $("#settings-alerts").empty();
      // grant requried permissions for provider
      var id = this.id;
      var perms = ajaxPerms[$("#" + id).closest(".settings-perm").data("key")];
      if (this.checked) {
        chrome.permissions.request({
          origins: perms
        }, function (success) {
          var check = $("#" + id);
          if (success) {
            check.closest(".settings-perm").removeClass("has-warning").addClass("has-success");
          } else {
            var text = "Permission denied for " + perms.join(", ") + ".";
            $("#settings-alerts").append($("<div/>").addClass("alert alert-danger").text(text));
            check.prop("checked", false).change();
          }
        });
      }
    });
    // enable fields from checkbox selection
    $("#settings-general-clock-show").change(function (e) {
      $("#settings-general-clock-twentyfour, #settings-general-clock-seconds").prop("disabled", !this.checked)
        .parent().toggleClass("text-muted", !this.checked);
    });
    $("#settings-general-timer-countdown").change(function (e) {
      $("#settings-general-timer-beep").prop("disabled", !this.checked)
        .parent().toggleClass("text-muted", !this.checked);
    });
    $("#settings-general-apps").change(function (e) {
      $("#settings-alerts").empty();
      // grant history permissions
      if (this.checked) {
        chrome.permissions.request({
          permissions: ["management"]
        }, function (success) {
          if (success) {
            $(".settings-perm-management").removeClass("has-warning").addClass("has-success");
            $("#settings-general-apps").prop("disabled", false).parent().removeClass("text-muted");
          } else {
            var text = "Permission denied for management.";
            $("#settings-alerts").append($("<div/>").addClass("alert alert-danger").text(text));
            $(this).prop("checked", false);
          }
        });
      }
    });
    $("#settings-general-weather-show").change(function (e) {
      $("#settings-general-weather-location, #settings-general-weather-celsius").prop("disabled", !this.checked);
      if (this.checked) $("#settings-general-weather-location").focus();
    });
    $("#settings-general-weather-celsius").click(function (e) {
      $(this).html("&deg;" + ($(this).text()[1] === "C" ? "F" : "C"));
    });
    // panel style group
    $("#settings-style-panel label").click(function (e) {
      $("input", this).prop("checked", true);
    });
    // background image selector
    $("#settings-style-background-image").on("input change", function (e) {
      // lose previous value on change
      $(this).data("val", "").prop("placeholder", "(none)");
      $(".settings-style-background-check").prop("disabled", !$(this).val()).next().toggleClass("text-muted", !$(this).val());
    });
    $("#settings-style-background-choose").click(function (e) {
      // trigger hidden input field
      $("#settings-alerts").empty();
      $("#settings-style-background-file").click();
    });
    $("#settings-style-background-file").change(function (e) {
      // if a file is selected
      if (this.files.length) {
        var file = this.files.item(0);
        // if an image
        if (file.type.match(/^image\//)) {
          var reader = new FileReader;
          reader.readAsDataURL(file);
          reader.onload = function readerLoaded() {
            $("#settings-style-background-image").data("val", reader.result).prop("placeholder", file.name).val("");
            $("#settings-style-background-file").val("");
          };
        } else {
          $("#settings-alerts").empty().append($("<div/>").addClass("alert alert-danger")
            .text(file.name + " doesn't seem to be a valid image file."));
        }
      }
    });
    // clear image
    $("#settings-style-background-none").click(function (e) {
      $("#settings-style-background-image").data("val", "").prop("placeholder", "(none)").val("");
      $(".settings-style-background-check").prop("disabled", true).next().addClass("text-muted");
    });
    // reset to default stripes
    $("#settings-style-background-default").click(function (e) {
      $("#settings-style-background-image").data("val", "../img/bg.png").prop("placeholder", "(default)").val("");
      $("#settings-style-background-repeat").prop("checked", true);
      $("#settings-style-background-centre").prop("checked", true);
      $("#settings-style-background-fixed").prop("checked", false);
      $("#settings-style-background-stretch").prop("checked", false);
      $(".settings-style-background-check").prop("disabled", false).next().removeClass("text-muted");
    });
    // custom CSS editor
    $("#settings-style-customcss-enable").change(function (e) {
      $("#settings-style-customcss-content").prop("disabled", !$(this).prop("checked")).focus();
    });
    /*******************modal保存按钮*************************************************/
    $("#settings-save").click(function (e) {
      $("#settings-alerts").empty();
      $("#settings-save").prop("disabled", true).empty().append(fa("spinner fa-spin", false)).append(" Saving...");
      settings.links["edit"] = {
        menu: $("#settings-links-edit-menu").prop("checked"),
        dragdrop: $("#settings-links-edit-dragdrop").prop("checked")
      };
      settings.links["behaviour"].dropdownmiddle = $("#settings-links-behaviour-dropdownmiddle").prop("checked");
      settings.bookmarks["enable"] = $("#settings-bookmarks-enable").prop("checked");
      if (!settings.bookmarks["enable"]) {
        chrome.permissions.remove({
          permissions: ["bookmarks"]
        }, function (success) {
          if (!success) revokeError = true;
        });
      }
      settings.bookmarks["bookmarklets"] = $("#settings-bookmarks-bookmarklets").prop("checked");
      settings.bookmarks["foldercontents"] = $("#settings-bookmarks-foldercontents").prop("checked");
      settings.bookmarks["split"] = $("#settings-bookmarks-split").prop("checked");
      settings.bookmarks["merge"] = $("#settings-bookmarks-merge").prop("checked");
      settings.bookmarks["above"] = $("#settings-bookmarks-above").prop("checked");
      settings.history["enable"] = $("#settings-history-enable").prop("checked");
      if (!settings.history["enable"]) {
        chrome.permissions.remove({
          permissions: ["history"]
        }, function (success) {
          if (!success) revokeError = true;
        });
      }
      settings.history["limit"] = parseInt($("#settings-history-limit").val());
      // var revoke = function revoke(key) {
      //   chrome.permissions.remove({
      //     origins: ajaxPerms[key]
      //   }, function (success) {
      //     if (!success) revokeError = true;
      //   });
      // }
      var revokeError = false;
      if (!$("#settings-general-title").val()) $("#settings-general-title").val(manif.name);
      settings.general["title"] = $("#settings-general-title").val();
      settings.general["keyboard"] = $("#settings-general-keyboard").prop("checked");
      settings.general["clock"] = {
        show: $("#settings-general-clock-show").prop("checked"),
        twentyfour: $("#settings-general-clock-twentyfour").prop("checked"),
        seconds: $("#settings-general-clock-seconds").prop("checked")
      };
      settings.general["timer"] = {
        stopwatch: $("#settings-general-timer-stopwatch").prop("checked"),
        countdown: $("#settings-general-timer-countdown").prop("checked"),
        beep: $("#settings-general-timer-beep").prop("checked")
      };
      settings.general["notepad"].show = $("#settings-general-notepad-show").prop("checked");
      settings.general["apps"] = $("#settings-general-apps").prop("checked");
      // if (!settings.general["apps"]) {
      //   chrome.permissions.remove({
      //     permissions: ["management"]
      //   }, function (success) {
      //     if (!success) revokeError = true;
      //   });
      // }
      settings.general["weather"] = {
        show: $("#settings-general-weather-show").prop("checked"),
        location: $("#settings-general-weather-location").val(),
        celsius: $("#settings-general-weather-celsius").text()[1] === "C"
      };
      if (!settings.general["weather"].location) settings.general["weather"].show = false;
      // if (!settings.general["weather"].show) revoke("weather");
      settings.general["proxy"] = $("#settings-general-proxy").prop("checked");
      // if (!settings.general["proxy"]) revoke("proxy");
      settings.style["font"] = $("#settings-style-font").val();
      settings.style["fluid"] = $("#settings-style-fluid").prop("checked");
      settings.style["topbar"] = {
        fix: $("#settings-style-topbar-fix").prop("checked"),
        dark: $("#settings-style-topbar-dark").prop("checked"),
        labels: $("#settings-style-topbar-labels").prop("checked")
      };
      settings.style["panel"] = $("#settings-style-panel label.active input").val();
      settings.style["background"] = {
        image: $("#settings-style-background-image").val() ? $("#settings-style-background-image").val() : $("#settings-style-background-image").data("val"),
        repeat: $("#settings-style-background-repeat").prop("checked"),
        centre: $("#settings-style-background-centre").prop("checked"),
        fixed: $("#settings-style-background-fixed").prop("checked"),
        stretch: $("#settings-style-background-stretch").prop("checked")
      };
      settings.style["customcss"] = {
        enable: $("#settings-style-customcss-content").val() && $("#settings-style-customcss-enable").prop("checked"),
        content: $("#settings-style-customcss-content").val()
      };
      $("#settings").on("hide.bs.modal", function (e) {
        e.preventDefault();
      });
      // write to local storage
      chrome.storage.local.set(settings, function () {
        if (chrome.runtime.lastError) {
          $("#settings-alerts").append($("<div/>").addClass("alert alert-danger").text("Unable to save: " + chrome.runtime.lastError.message));
          $("#settings-save").prop("disabled", false).empty().append(fa("check", false)).append(" Save and reload");
          return;
        }
        if (revokeError) {
          $("#settings-alerts").append($("<div/>").addClass("alert alert-warning").text("Failed to revoke permissions: " + chrome.runtime.lastError.message));
        }
        $("#settings-save").empty().append(fa("check", false)).append(" Saved!");
        // reload page
        $("#settings").off("hide.bs.modal").off("hidden.bs.modal").on("hidden.bs.modal", function (e) {
          location.reload();
        });
        setTimeout(function () {
          $("#settings").modal("hide");
        }, 250);
      });
    });
    // import settings from file
    $("#settings-import").click(function (e) {
      $("#settings-import-file").click();
    });
    $("#settings-import-file").change(function (e) {
      // if a file is selected
      if (this.files.length) {
        var file = this.files.item(0);
        var reader = new FileReader;
        reader.readAsText(file);
        reader.onload = function readerLoaded() {
          $("#settings-import-file").val("");
          var toImport;
          try {
            toImport = JSON.parse(reader.result);
          } catch (e) {
            return window.alert(file.name + " doesn't seem to be a valid JSON file.");
          }
          if (toImport && confirm("Do you want to replace your current settings with those in " + file.name + "?")) {
            // merge with current, import takes priority
            settings = $.extend(true, {}, settings, toImport);
            // copy links code whole
            if (toImport["links"]) settings["links"] = toImport["links"];
            // write to local storage
            chrome.storage.local.set(settings, function () {
              if (chrome.runtime.lastError) window.alert("Unable to save: " + chrome.runtime.lastError.message);
              else location.reload();
            });
          }
        };
      }
    });
    // export settings to file
    $("#settings-export").click(function (e) {
      var toExport = $.extend(true, {}, settings);
      // converting image to URI takes too long, hangs browser
      delete toExport.style["background"].image;
      // link has a download="homely.json" tag to force download
      $(this).attr("href", "data:application/json;charset=UTF-8," + encodeURIComponent(JSON.stringify(toExport)))
        .click().attr("href", "");
    });
    // links selection state
    var linksHotkeys = {
      curBlk: -1,
      curBtn: -1,
      blk: []
    };
    var mousetrapStop = Mousetrap.stopCallback;
    // setup keyboard shortcuts on tab change
    var setupHotkeys = function setupHotkeys(e) {
      // close any open dropdown menus
      var closeDropdowns = function closeDropdowns() {
        $(".btn-group.open, .dropdown.open").removeClass("open");
        $("#links .panel-heading .btn").hide();
      };
      // number/cycle navigation for links
      var nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
      var off = "panel-" + settings.style["panel"];
      var on = "panel-" + (off === "panel-primary" ? "default" : "primary");
      var linksSelectBlk = function linksSelectBlk(i) {
        $("#links ." + on).removeClass(on).addClass(off);
        linksHotkeys.curBlk = i;
        $("#links :nth-child(" + (linksHotkeys.curBlk + 1) + ") .panel").removeClass(off).addClass(on);
        if (linksHotkeys.curBtn > -1) {
          $(linksHotkeys.blk[linksHotkeys.curBtn]).off("blur");
          $("i", linksHotkeys.blk[linksHotkeys.curBtn]).remove();
        }
        linksHotkeys.blk = $("#links :nth-child(" + (linksHotkeys.curBlk + 1) + ") .panel .panel-body .btn");
        linksSelectBtn(0);
      };
      var linksSelectBtn = function linksSelectBtn(i) {
        if (linksHotkeys.curBtn > -1) {
          $(linksHotkeys.blk[linksHotkeys.curBtn]).off("blur");
          $("i", linksHotkeys.blk[linksHotkeys.curBtn]).remove();
        }
        linksHotkeys.curBtn = i;
        $(linksHotkeys.blk[linksHotkeys.curBtn]).prepend(" ").prepend($("<i/>").addClass("fa fa-hand-o-right")).focus().blur(function (e) {
          $(this).off("blur");
          linksClearSel();
        });
      }
      var linksClearSel = function linksClearSel() {
        $("#links ." + on).removeClass(on).addClass(off);
        if (linksHotkeys.curBtn > -1) $("i", linksHotkeys.blk[linksHotkeys.curBtn]).remove();
        linksHotkeys = {
          curBlk: -1,
          curBtn: -1,
          blk: []
        };
      };
      // clear current state
      Mousetrap.reset();
      linksClearSel();
      // restore escape to close modal if open
      var modal = $(document.body).hasClass("modal-open");
      if (modal) {
        Mousetrap.bind("esc", function (e, key) {
          $(".modal.in").modal("hide");
        });
      }
      // enable all keyboard shortcuts
      if (settings.general["keyboard"]) {
        // global page switch keys
        if (!modal) {
          if (settings.bookmarks["enable"] && !settings.bookmarks["merge"]) {
            Mousetrap.bind(["l", "q"], function (e, key) {
              closeDropdowns();
              $("#menu-links").click();
            }).bind(["b", "w"], function (e, key) {
              closeDropdowns();
              $("#menu-bookmarks").click();
            });
          }
          if (settings.general["apps"]) {
            Mousetrap.bind(["a", "e"], function (e, key) {
              if (!$("#apps-title").parent().hasClass("open")) closeDropdowns();
              $("#apps-title").click();
            }).bind("shift+a", function (e, key) {
              chrome.tabs.update({url: "chrome://apps"});
            }).bind("shift+alt+a", function (e, key) {
              location.href = "https://chrome.google.com/webstore";
            });
          }
          if (settings.history["enable"]) {
            Mousetrap.bind(["h", "r"], function (e, key) {
              if (!$("#history-title").parent().hasClass("open")) closeDropdowns();
              $("#history-title").click();
            });
          }
          Mousetrap.bind(["s", "u"], function (e, key) {
            if (!$("#settings-title").parent().hasClass("open")) closeDropdowns();
            $("#settings-title").click();
          }).bind(["shift+s", "shift+y"], function (e, key) {
            closeDropdowns();
            $("#settings-toggle").click();
          }).bind("?", function (e, key) {
            $("#shortcuts").modal();
          }).bind("esc", function (e, key) {
            closeDropdowns();
          });
        }
        // if settings modal is open
        if ($(e.target).attr("id") === "settings" && e.type === "show") {
          Mousetrap.bind(["tab", "shift+tab"], function (e, key) {
            var sel = $("#settings-tabs li.active").index();
            sel = (sel + (key === "tab" ? 1 : -1)) % $("#settings-tabs li").length;
            if (sel < 0) sel += $("#settings-tabs li").length;
            $($("#settings-tabs a")[sel]).click();
            e.preventDefault();
          }).bind("enter", function (e, key) {
            $($("#settings .tab-pane.active input")[0]).focus();
          }).bind("ctrl+enter", function (e, key) {
            $("#settings-save").click();
          });
          // override stop callback to pause on button focus
          Mousetrap.stopCallback = function (e, element) {
            return element.tagName === "BUTTON" || mousetrapStop(e, element);
          }
          // if shortcuts modal is open
        } else if ($(e.target).attr("id") === "shortcuts" && e.type === "show") {
          Mousetrap.bind("?", function (e, key) {
            $("#shortcuts").modal("hide");
          });
        } else {
          // restore stop callback
          Mousetrap.stopCallback = mousetrapStop;
          // if links page is active
          if ($("nav li.active").attr("id") === "menu-links" || settings.bookmarks["merge"]) {
            Mousetrap.bind(nums, function (e, key) {
              closeDropdowns();
              // select block by number
              linksSelectBlk(nums.indexOf(key));
            }).bind(["-", "="], function (e, key) {
              closeDropdowns();
              // previous/next block
              var i = (linksHotkeys.curBlk === -1 ? 0 : (linksHotkeys.curBlk + (key === "-" ? -1 : 1)) % $("#links .panel").length);
              if (i < 0) i += $("#links .panel").length;
              linksSelectBlk(i);
            }).bind(["[", "]"], function (e, key) {
              closeDropdowns();
              // previous/next button
              if (linksHotkeys.curBlk === -1) linksSelectBlk(0);
              var i = (linksHotkeys.curBtn === -1 ? 0 : (linksHotkeys.curBtn + (key === "[" ? -1 : 1)) % linksHotkeys.blk.length);
              if (i < 0) i += linksHotkeys.blk.length;
              linksSelectBtn(i);
            }).bind("enter", function (e, key) {
              // clear selection
              setTimeout(linksClearSel, 50);
            }).bind("backspace", function (e, key) {
              // clear selection and lose focus
              if (linksHotkeys.curBtn > -1) $(linksHotkeys.blk[linksHotkeys.curBtn]).blur();
            });
          }
          // if bookmarks page is active
          if ($("nav li.active").attr("id") === "menu-bookmarks" || settings.bookmarks["merge"]) {
            Mousetrap.bind("/", function (e, key) {
              $("#bookmarks-search").focus();
              e.preventDefault();
            });
          }
        }
      }
    };
    $("#menu-links").click(setupHotkeys);
    if (settings.style["topbar"].labels) {
      $(".menu-label").show();
    } else {
      $(".menu-label").each(function (i) {
        $(this).parent().attr("title", $(this).text());
      });
    }
    ;
    bookmarksCallbacks.push(function () {
      $("#menu-bookmarks").click(setupHotkeys);
      var label = $("#menu-bookmarks .menu-label");
      if (settings.style["topbar"].labels) {
        label.show();
      } else {
        label.parent().attr("title", label.text());
      }
    });
    weatherCallbacks.push(function () {
      if (settings.style["topbar"].labels) $("#menu-weather .menu-label").show();
    });
    proxyCallbacks.push(function () {
      var label = $("#menu-proxy .menu-label");
      if (settings.style["topbar"].labels) {
        label.show();
      } else {
        label.parent().attr("title", label.text());
      }
    });
    // manually adjust modal-open class as not available at event trigger
    $(".modal").on("show.bs.modal", function (e) {
      $(document.body).addClass("modal-open");
      setupHotkeys(e);
    }).on("hidden.bs.modal", function (e) {
      $(document.body).removeClass("modal-open");
      setupHotkeys(e);
    });
    if (settings.bookmarks["merge"]) {
      setupHotkeys({});
      // show both links and bookmarks, hide switch links
      $("#menu-links, #menu-bookmarks").hide();
      $(document.body).addClass("merge");
    } else {
      // open on links page
      $("#menu-links").click();
    }
    // show incognito state
    if (chrome.extension.inIncognitoContext) $(".incognito").removeClass("incognito");
    // fade in once all is loaded
    $(document.body).fadeIn();
  });
});
