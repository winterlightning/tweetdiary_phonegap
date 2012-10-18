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
      
      ###
      onItemTap: ()->
        console.log("testing item tap")
          #alert "Disclose more info for " + record.get("firstName")
          console.log( record.data )
          window.r_id = record.data.id
          $("#buttonbar").show()
          $("#writearea").val(record.get("text"))
          window.carousel.setActiveItem( 0, 'flip' )
      ###
          
      onItemDisclosure:
        scope: "test"
        handler: (record, btn, index) ->
          #alert "Disclose more info for " + record.get("firstName")
          console.log( record.data )
          window.r_id = record.data.id
          $("#buttonbar").show()
          $("#writearea").val(record.get("text"))
          window.carousel.setActiveItem( 0, 'flip' )
      
      listener:
          itemtap:  (list, index, item, e) ->
            e.preventDefault();
            
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

    #window.auto_sync()