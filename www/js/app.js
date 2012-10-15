// Generated by CoffeeScript 1.3.3
(function() {
  var Entry, exports;

  window.r_id = "";

  window.create_new_entry = function() {
    var content, d, date, entry, hashtags, timeago;
    console.log("create new entry called");
    if ((window.r_id != null) && window.r_id !== "") {
      window.save_entry();
      return true;
    }
    content = $("#writearea").val();
    if (content !== "") {
      hashtags = twttr.txt.extractHashtags(content);
      entry = Entry.create({
        text: content,
        create_time: (new Date()).toString(),
        tags: hashtags
      });
      $("#writearea").val("");
      d = new Date(entry.create_time);
      timeago = jQuery.timeago(d);
      date = (d.getUTCMonth() + 1) + "/" + d.getUTCDate() + "/" + d.getUTCFullYear();
      return window.store.loadData([
        {
          text: entry.text,
          create_time: timeago,
          tags: entry.tags.toString(),
          date: date,
          id: entry.id,
          seconds: d / 1000
        }
      ], true);
    }
  };

  window.get_entry_from_spine = function() {
    var all_entries, d, date, entry, timeago, _i, _len, _ref;
    all_entries = [];
    _ref = Entry.all();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      entry = _ref[_i];
      d = new Date(entry.create_time);
      timeago = jQuery.timeago(d);
      date = (d.getUTCMonth() + 1) + "/" + d.getUTCDate() + "/" + d.getUTCFullYear();
      all_entries.push({
        text: entry.text,
        create_time: timeago,
        tags: entry.tags.toString(),
        date: date,
        id: entry.id,
        seconds: d / 1000
      });
    }
    return all_entries;
  };

  window.delete_entry = function() {
    var e;
    e = Entry.find(window.r_id);
    e.destroy();
    window.store.loadData(get_entry_from_spine(), false);
    window.list.refresh();
    window.carousel.setActiveItem(1, 'flip');
    return window.r_id = "";
  };

  window.save_entry = function() {
    var e, value;
    e = Entry.find(window.r_id);
    value = $("#writearea").val();
    e.text = value;
    e.save();
    $("#writearea").val("");
    window.store.loadData(get_entry_from_spine(), false);
    window.list.refresh();
    window.carousel.setActiveItem(1, 'flip');
    return window.r_id = "";
  };

  Nimbus.Auth.setup("Dropbox", "lejn01o1njs1elo", "2f02rqbnn08u8at", "diary_app");

  Entry = Nimbus.Model.setup("Entry", ["text", "create_time", "tags"]);

  /*
  Entry.ordersort = (a, b) ->
    x = new Date(a.create_time)
    y = new Date(b.create_time)
    (if (x > y) then -1 else 1)
  */


  Ext.setup({
    tabletStartupScreen: "tablet_startup.png",
    phoneStartupScreen: "phone_startup.png",
    icon: "icon.png",
    glossOnIcon: false,
    onReady: function() {
      var all_entries, carousel1, groupingBase, list;
      Ext.regModel("Entry", {
        fields: ["text", "create_time", "tags", "date", "seconds"]
      });
      all_entries = get_entry_from_spine();
      window.store = new Ext.data.Store({
        model: "Entry",
        sorters: {
          property: "seconds",
          direction: "DESC"
        },
        getGroupString: function(record) {
          return record.get("date");
        },
        data: all_entries
      });
      groupingBase = {
        itemTpl: "<div class=\"maintext\">{text}</div> <div class=\"timetext\">{create_time}</div>",
        singleSelect: false,
        multiSelect: false,
        grouped: true,
        indexBar: false,
        onItemDisclosure: {
          scope: "test",
          handler: function(record, btn, index) {
            console.log(record.data);
            window.r_id = record.data.id;
            $("#buttonbar").show();
            $("#writearea").val(record.get("text"));
            return window.carousel.setActiveItem(0, 'flip');
          }
        },
        store: window.store
      };
      list = new Ext.List(Ext.apply(groupingBase, {
        centered: true,
        modal: true
      }));
      window.list = list;
      carousel1 = new Ext.Carousel({
        defaults: {
          cls: "card"
        },
        items: [
          {
            html: "<textarea type=\"textarea\" id='writearea' placeholder='Tap and add your entry; Hit return to save' style=\"border:0px;border-radius:0px;padding:20px;font-size:30px;color:#fff;width:100%;height:100%;background-image: url(img/asfalt.png);\"></textarea>\n<div id=\"buttonbar\">\n  <a class=\"button\" onclick=\"window.save_entry()\">Save</a>\n  <a class=\"button\" id=\"rightbutton\" onclick=\"window.delete_entry()\">Delete</a>\n</div>"
          }, list, {
            title: "Tab 3",
            html: "<div style=\"background-image: url(img/linen.png);height:100%;width:100%;text-align:center;\">\n  <br />\n  <p style=\"color: #fff; padding: 20px; padding-bottom: 0px;\">Sync all your entries across multiple devices by setting up storage on Dropbox.</p>\n  <p style=\"color: #fff; padding: 20px\">First click on authorize and then allow data access on the Dropbox link in the browser. Then click on validate back in the app.</p>\n  \n  <a class=\"large blue awesome\" onclick=\"window.auth()\">Authorize</a><br />\n  <a class=\"large blue awesome\" onclick=\"window.validate()\">Validate</a><br />\n\n  <a class=\"large black awesome\" onclick=\"window.sync_entry()\">Sync All</a>\n</div>"
          }
        ]
      });
      window.carousel = carousel1;
      carousel1.addListener("cardswitch", function(obj, newCard, oldCard, index, animated) {
        if (index !== 0) {
          if (window.rid !== "") {
            $("#writearea").val("");
          }
          return $("#buttonbar").hide();
        }
      });
      new Ext.Panel({
        fullscreen: true,
        layout: {
          type: "vbox",
          align: "stretch"
        },
        defaults: {
          flex: 1
        },
        items: [carousel1]
      });
      $("#writearea").keydown(function(e) {
        var keyCode;
        keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
          window.create_new_entry();
          return false;
        }
      });
      return window.auto_sync();
    }
  });

  window.auth = function() {
    ios_notify.notify({
      title: "Authentication in progress",
      message: "Wait for the browser window to open up and authenticate."
    });
    return Nimbus.Auth.authorize();
  };

  window.validate = function() {
    return Nimbus.Auth.initialize();
  };

  Nimbus.Auth.authorized_callback = function() {
    ios_notify.notify({
      title: "Validation",
      message: "Validation is done! Now your data is stored in Dropbox."
    });
    return window.sync_entry();
  };

  window.sync_entry = function() {
    if (Nimbus.Auth.authorized()) {
      return Entry.sync_all(function() {
        window.store.loadData(get_entry_from_spine(), false);
        window.list.refresh();
        return ios_notify.notify({
          title: "Synced",
          message: "Data synced!"
        });
      });
    } else {
      return ios_notify.notify({
        title: "Not Authorized",
        message: "You need to authorize first!"
      });
    }
  };

  window.auto_sync = function() {
    if (Nimbus.Auth.authorized()) {
      return Entry.sync_all(function() {
        window.store.loadData(get_entry_from_spine(), false);
        window.list.refresh();
        return setTimeout("window.auto_sync()", 5000);
      });
    }
  };

  exports = this;

  exports.Entry = Entry;

}).call(this);
