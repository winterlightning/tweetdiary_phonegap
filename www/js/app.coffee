window.r_id = "" #id of current one being edited

#function to add a new entry
window.create_new_entry = ()->
  console.log("create new entry called")
  
  #check if there is a window rid which means this is a edit
  if window.r_id? and window.r_id isnt ""
    window.save_entry()
    return true
  
  content = $("#writearea").val()
  if content isnt ""
    hashtags = twttr.txt.extractHashtags(content)
    entry = Entry.create(text: content, create_time: (new Date()).toString(), tags: hashtags )
    
    $("#writearea").val("") #clear the div afterwards
    
    d = new Date(entry.create_time)
    timeago = jQuery.timeago(d)
    date = (d.getUTCMonth() + 1 ) + "/" + d.getUTCDate() + "/" + d.getUTCFullYear()

    window.store.loadData([{text: entry.text, create_time: timeago, tags: entry.tags.toString(), date: date, id: entry.id, seconds: (d/1000) }], true)

window.get_entry_from_spine = ()->
  all_entries = [] 
  for entry in Entry.all()
    d = new Date(entry.create_time)
    timeago = jQuery.timeago(d)
    date = (d.getUTCMonth() + 1 ) + "/" + d.getUTCDate() + "/" + d.getUTCFullYear()

    all_entries.push( text: entry.text, create_time: timeago, tags: entry.tags.toString(), date: date, id: entry.id, seconds: (d/1000) ) 
  all_entries

window.delete_entry = () ->
  e = Entry.find(window.r_id)
  e.destroy()
  
  window.store.loadData(get_entry_from_spine(), false)
  window.list.refresh()
  window.carousel.setActiveItem( 1, 'flip' )
  window.r_id = ""

window.save_entry = () ->
  e = Entry.find(window.r_id)
  value = $("#writearea").val()
  e.text = value
  e.save()
  
  $("#writearea").val("")
  
  window.store.loadData(get_entry_from_spine(), false)
  window.list.refresh()
  window.carousel.setActiveItem( 1, 'flip' )
  window.r_id = ""

Nimbus.Auth.setup("Dropbox", "lejn01o1njs1elo", "2f02rqbnn08u8at", "diary_app") #switch this with your own app key (please!!!!)

Entry = Nimbus.Model.setup("Entry", ["text", "create_time", "tags"]) 

###
Entry.ordersort = (a, b) ->
  x = new Date(a.create_time)
  y = new Date(b.create_time)
  (if (x > y) then -1 else 1)
###

Ext.setup
  tabletStartupScreen: "tablet_startup.png"
  phoneStartupScreen: "phone_startup.png"
  icon: "icon.png"
  glossOnIcon: false
  
  onReady: ->
    
    Ext.regModel "Entry",
      fields: ["text", "create_time", "tags", "date", "seconds"]
    
    all_entries = get_entry_from_spine()
    
    window.store = new Ext.data.Store(
      model: "Entry"
      sorters: 
        property:"seconds"
        direction: "DESC"
        
      getGroupString: (record) ->
        record.get("date")

      data: all_entries
    )
    
    #do the model and the center pane
    groupingBase =
      itemTpl: "<div class=\"maintext\">{text}</div> <div class=\"timetext\">{create_time}</div>"
        
      singleSelect: false
      multiSelect: false  
      grouped: true
      indexBar: false
      onItemDisclosure:
        scope: "test"
        handler: (record, btn, index) ->
          #alert "Disclose more info for " + record.get("firstName")
          console.log( record.data )
          window.r_id = record.data.id
          $("#buttonbar").show()
          $("#writearea").val(record.get("text"))
          window.carousel.setActiveItem( 0, 'flip' )
          
      store: window.store

    list = new  Ext.List(Ext.apply(groupingBase,
      centered: true
      modal: true
    ))
    window.list = list
    
    # Create a Carousel of Items
    carousel1 = new Ext.Carousel(
      defaults:
        cls: "card"

      items: [
        html: """<textarea type=\"textarea\" id='writearea' placeholder='Tap and add your entry; Hit return to save' style=\"border:0px;border-radius:0px;padding:20px;font-size:30px;color:#fff;width:100%;height:100%;background-image: url(img/asfalt.png);\"></textarea>
        <div id="buttonbar">
          <a class="button" onclick="window.save_entry()">Save</a>
          <a class="button" id="rightbutton" onclick="window.delete_entry()">Delete</a>
        </div>
        """
      , list,
        title: "Tab 3"
        html: """<div style=\"background-image: url(img/linen.png);height:100%;width:100%;text-align:center;\">
          <br />
          <p style="color: #fff; padding: 20px; padding-bottom: 0px;">Sync all your entries across multiple devices by setting up storage on Dropbox.</p>
          <p style="color: #fff; padding: 20px">First click on authorize and then allow data access on the Dropbox link in the browser. Then click on validate back in the app.</p>
          
          <a class="large blue awesome" onclick="window.auth()">Authorize</a><br />
          <a class="large blue awesome" onclick="window.validate()">Validate</a><br />

          <a class="large black awesome" onclick="window.sync_entry()">Sync All</a>
        </div>"""
      ]
    )
    window.carousel = carousel1
    
    carousel1.addListener("cardswitch", (obj, newCard, oldCard, index, animated)-> 
      if index isnt 0
        if window.rid isnt ""
          $("#writearea").val("")
        
        $("#buttonbar").hide()
    )
    
    #create the main panel
    new Ext.Panel(
      fullscreen: true
      layout:
        type: "vbox"
        align: "stretch"

      defaults:
        flex: 1

      items: [carousel1]
    )
    
    $("#writearea").keydown (e) ->
      keyCode = e.keyCode or e.which
      if keyCode is 13
        window.create_new_entry()
        false

    window.auto_sync()

window.auth = ()-> 
  ios_notify.notify( title: "Authentication in progress", message: "Wait for the browser window to open up and authenticate." )
  Nimbus.Auth.authorize()

window.validate = ()->
  Nimbus.Auth.initialize()

Nimbus.Auth.authorized_callback = ()->
  ios_notify.notify( title: "Validation", message: "Validation is done! Now your data is stored in Dropbox." )
  window.sync_entry()
  
window.sync_entry = ->
  if Nimbus.Auth.authorized()
    Entry.sync_all( ()->
      window.store.loadData(get_entry_from_spine(), false)
      window.list.refresh()
      ios_notify.notify( title: "Synced", message: "Data synced!" )
    )
  else
    ios_notify.notify( title: "Not Authorized", message: "You need to authorize first!" )

window.auto_sync = ->
  if Nimbus.Auth.authorized()
    #console.log("auto-syncing")
    
    Entry.sync_all( ()->
      window.store.loadData(get_entry_from_spine(), false)
      window.list.refresh()
      setTimeout("window.auto_sync()", 5000);
    )

exports = this #this is needed to get around the coffeescript namespace wrap
exports.Entry = Entry