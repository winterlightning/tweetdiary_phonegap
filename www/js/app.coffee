#function to add a new entry
window.create_new_entry = ()->
  console.log("create new entry called")
  
  content = $("#writearea").val()
  if content isnt ""
    hashtags = twttr.txt.extractHashtags(content)
    entry = Entry.create(text: content, create_time: (new Date()).toString(), tags: hashtags )
    
    $("#writearea").val("") #clear the div afterwards
    
    d = new Date(entry.create_time)
    timeago = jQuery.timeago(d)
    date = d.getUTCMonth() + "/" + d.getUTCDate() + "/" + d.getUTCFullYear()
    
    window.store.loadData([{text: entry.text, create_time: timeago, tags: entry.tags.toString(), date: date }], true)

window.get_entry_from_spine = ()->
  all_entries = [] 
  for entry in Entry.all()
    d = new Date(entry.create_time)
    timeago = jQuery.timeago(d)
    date = d.getUTCMonth() + "/" + d.getUTCDate() + "/" + d.getUTCFullYear()
    all_entries.push( text: entry.text, create_time: timeago, tags: entry.tags.toString(), date: date ) 
  all_entries

Nimbus.Auth.setup("Dropbox", "lejn01o1njs1elo", "2f02rqbnn08u8at", "diary_app") #switch this with your own app key (please!!!!)

Entry = Nimbus.Model.setup("Entry", ["text", "create_time", "tags"]) 

Ext.setup
  tabletStartupScreen: "tablet_startup.png"
  phoneStartupScreen: "phone_startup.png"
  icon: "icon.png"
  glossOnIcon: false
  
  onReady: ->
    
    Ext.regModel "Entry",
      fields: ["text", "create_time", "tags", "date"]
    
    all_entries = get_entry_from_spine()
    
    window.store = new Ext.data.Store(
      model: "Entry"
      sorters: "create_time"
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
          $("#buttonbar").show()
          $("#writearea").val(record.get("text"))
          window.carousel.setActiveItem( 0, 'flip' )
          
      store: window.store

    list = new  Ext.List(Ext.apply(groupingBase,
      centered: true
      modal: true
    ))
    
    # Create a Carousel of Items
    carousel1 = new Ext.Carousel(
      defaults:
        cls: "card"

      items: [
        html: """<textarea type=\"textarea\" id='writearea' placeholder='Tap and add your entry' style=\"border:0px;border-radius:0px;padding:20px;font-size:30px;color:#fff;width:100%;height:100%;background-image: url(img/asfalt.png);\"></textarea>
        <div id="buttonbar">
          <a class="button" href="#">Save</a>
          <a class="button" id="rightbutton" href="#">Delete</a>
        </div>
        """
      , list,
        title: "Tab 3"
        html: """<div style=\"background-image: url(img/linen.png);height:100%;width:100%;\">
          
        </div>"""
      ]
    )
    window.carousel = carousel1
    
    carousel1.addListener("cardswitch", (obj, newCard, oldCard, index, animated)-> 
      if index isnt 0
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

exports = this #this is needed to get around the coffeescript namespace wrap
exports.Entry = Entry