// Generated by CoffeeScript 1.3.3
((function(){var a,b,c,d,e=function(a,b){return function(){return a.apply(b,arguments)}},f=[].slice;(function(){var a,b,c,e,f,g,h,i,j,k;return typeof d!="undefined"?h=d:h=this.Nimbus={},h.version="0.0.1",a=h.$=this.jQuery||this.Zepto||function(){return arguments[0]},j=function(a){return Array.prototype.slice.call(a,0)},i=function(a){return Object.prototype.toString.call(a)==="[object Array]"},typeof Array.prototype.indexOf=="undefined"&&(Array.prototype.indexOf=function(a){var b;b=0;while(b<this.length){if(this[b]===a)return b;b++}return-1}),f={bind:function(a,b){var c,d,e;d=a.split(" "),c=this._callbacks||(this._callbacks={}),e=0;while(e<d.length)(this._callbacks[d[e]]||(this._callbacks[d[e]]=[])).push(b),e++;return this},trigger:function(){var a,b,c,d,e,f;a=j(arguments),c=a.shift();if(!(b=this._callbacks))return!1;if(!(f=this._callbacks[c]))return!1;d=0,e=f.length;while(d<e){if(f[d].apply(this,a)===!1)return!1;d++}return!0},unbind:function(a,b){var c,d,e,f;if(!a)return this._callbacks={},this;if(!(c=this._callbacks))return this;if(!(f=c[a]))return this;if(!b)return delete this._callbacks[a],this;d=0,e=f.length;while(d<e){if(b===f[d]){f=f.slice(),f.splice(d,1),c[a]=f;break}d++}return this}},typeof Object.create!="function"&&(Object.create=function(a){var b;return b=function(){},b.prototype=a,new b}),k=["included","extended"],c={inherited:function(){},created:function(){},prototype:{initialize:function(){},init:function(){}},create:function(a,b){var c;return c=Object.create(this),c.parent=this,c.prototype=c.fn=Object.create(this.prototype),a&&c.include(a),b&&c.extend(b),c.created(),this.inherited(c),c},init:function(){var a;return a=Object.create(this.prototype),a.parent=this,a.initialize.apply(a,arguments),a.init.apply(a,arguments),a},proxy:function(a){var b;return b=this,function(){return a.apply(b,arguments)}},proxyAll:function(){var a,b,c;a=j(arguments),b=0,c=[];while(b<a.length)this[a[b]]=this.proxy(this[a[b]]),c.push(b++);return c},include:function(a){var b,c;for(c in a)k.indexOf(c)===-1&&(this.fn[c]=a[c]);return b=a.included,b&&b.apply(this),this},extend:function(a){var b,c;for(c in a)k.indexOf(c)===-1&&(this[c]=a[c]);return b=a.extended,b&&b.apply(this),this}},c.prototype.proxy=c.proxy,c.prototype.proxyAll=c.proxyAll,c.inst=c.init,c.sub=c.create,h.guid=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(a){var b,c;return b=Math.random()*16|0,c=a==="x"?b:b&3|8,c.toString(16)}).toUpperCase()},b=h.Auth=c.create(),b.extend({reinitialize:function(){if(localStorage["service"]!=null)return this.setup(localStorage.service,localStorage.d_key,localStorage.secret,localStorage.app_name),this.initialize()},setup:function(a,b,c,d){log("setup called"),this.service=a,this.key=b,this.secret=c,this.app_name=d,localStorage.service=this.service,localStorage.d_key=this.key,localStorage.secret=this.secret,localStorage.app_name=this.app_name;switch(this.service){case"Dropbox":this.extend(h.Auth.Dropbox_auth),this.authorize=this.proxy(this.authenticate_dropbox),this.initialize=this.proxy(this.initialize_dropbox),log("service is dropbox");break;default:log("Invalid service name")}},authorized:function(){return localStorage["service"]!=null?localStorage.state==="Working"?!0:!1:!1},state:function(){return localStorage.state},authorize:function(){return log("authorize not yet setup")},initialize:function(){return log("initialize not setup")},authorized_callback:function(){return log("authorized callback undefined")}}),e=h.Client=c.create(),g=h.Model=c.create(),g.extend(f),g.extend({setup:function(a,b){var c,d;if(h.Auth.service!=null){b.push("synced"),b.push("time"),d=g.sub(),a&&(d.name=a),b&&(d.attributes=b);switch(h.Auth.service){case"Dropbox":log("extend as Dropbox"),d.extend(h.Model.Local),d.extend(h.Model.general_sync),d.extend(h.Model.Dropbox);break;default:log("Invalid service name")}a.indexOf("_Deletion")<0&&(c=h.Model.setup(a+"_"+"Deletion",["deletion_id","listid"]),c.extend(h.Model.Local),c.fetch(),d.DeletionStorage=c)}else console.log("Please setup Nimbus.Auth first before creating models");return d.fetch(),d},created:function(a){return this.records={},this.attributes=this.attributes?j(this.attributes):[]},find:function(a){var b;b=this.records[a];if(!b)throw"Unknown record";return b.clone()},exists:function(a){try{return this.find(a)}catch(b){return!1}},refresh:function(a){var b,c,d;a=this.fromJSON(a),this.records={},b=0,c=a.length;while(b<c)d=a[b],d.newRecord=!1,this.records[d.id]=d,b++;return this.trigger("refresh"),this},select:function(a){var b,c;c=[];for(b in this.records)a(this.records[b])&&c.push(this.records[b]);return this.cloneArray(c)},findByAttribute:function(a,b){var c;for(c in this.records)if(this.records[c][a]===b)return this.records[c].clone()},findAllByAttribute:function(a,b){return this.select(function(c){return c[a]===b})},each:function(a){var b,c;c=[];for(b in this.records)c.push(a(this.records[b]));return c},all:function(){return this.cloneArray(this.recordsValues())},first:function(){var a;return a=this.recordsValues()[0],a&&a.clone()},last:function(){var a,b;return b=this.recordsValues(),a=b[b.length-1],a&&a.clone()},count:function(){return this.recordsValues().length},deleteAll:function(){var a,b;b=[];for(a in this.records)b.push(delete this.records[a]);return b},destroyAll:function(){var a,b;b=[];for(a in this.records)b.push(this.records[a].destroy());return b},update:function(a,b){return this.find(a).updateAttributes(b)},create:function(a){var b;return b=this.init(a),b.save()},destroy:function(a){return this.find(a).destroy()},sync:function(a){return this.bind("change",a)},fetch:function(a){return typeof a=="function"?this.bind("fetch",a):this.trigger.apply(this,["fetch"].concat(j(arguments)))},toJSON:function(){return this.recordsValues()},fromJSON:function(a){var b,c;if(!a)return;typeof a=="string"&&(a=JSON.parse(a));if(i(a)){c=[],b=0;while(b<a.length)c.push(this.init(a[b])),b++;return c}return this.init(a)},recordsValues:function(){var a,b;b=[];for(a in this.records)b.push(this.records[a]);return b},cloneArray:function(a){var b,c;c=[],b=0;while(b<a.length)c.push(a[b].clone()),b++;return c}}),g.include({model:!0,newRecord:!0,init:function(a){return a&&this.load(a),this.trigger("init",this)},isNew:function(){return this.newRecord},isValid:function(){return!this.validate()},validate:function(){},load:function(a){var b,c;c=[];for(b in a)c.push(this[b]=a[b]);return c},attributes:function(){var a,b,c;c={},b=0;while(b<this.parent.attributes.length)a=this.parent.attributes[b],c[a]=this[a],b++;return c.id=this.id,c},eql:function(a){return a&&a.id===this.id&&a.parent===this.parent},save:function(){var a;return a=this.validate(),a?(this.trigger("error",this,a),!1):(this.trigger("beforeSave",this),this.newRecord?this.create():this.update(),this.trigger("save",this),this)},updateAttribute:function(a,b){return this[a]=b,this.save()},updateAttributes:function(a){return this.load(a),this.save()},destroy:function(){return this.trigger("beforeDestroy",this),delete this.parent.records[this.id],this.destroyed=!0,this.trigger("destroy",this),this.trigger("change",this,"destroy")},dup:function(){var a;return a=this.parent.init(this.attributes()),a.newRecord=this.newRecord,a},clone:function(){return Object.create(this)},reload:function(){var a;return this.newRecord?this:(a=this.parent.find(this.id),this.load(a.attributes()),a)},toJSON:function(){return this.attributes()},exists:function(){return this.id&&this.id in this.parent.records},update:function(){var a,b;return this.trigger("beforeUpdate",this),b=this.parent.records,b[this.id].load(this.attributes()),a=b[this.id].clone(),this.trigger("update",a),this.trigger("change",a,"update")},create:function(){var a,b;return this.trigger("beforeCreate",this),this.id||(this.id=h.guid()),this.newRecord=!1,b=this.parent.records,b[this.id]=this.dup(),a=b[this.id].clone(),this.trigger("create",a),this.trigger("change",a,"create")},bind:function(a,b){return this.parent.bind(a,this.proxy(function(a){if(a&&this.eql(a))return b.apply(this,arguments)}))},trigger:function(){return this.parent.trigger.apply(this.parent,arguments)}})})(),c=function(){function a(a){this._set=a===void 0?[]:a,this.length=this._set.length,this.contains=function(a){return this._set.indexOf(a)!==-1}}return a.prototype.union=function(a){var b,c,d,e;b=a.length>this.length?a:this,c=a.length>this.length?this:a,e=b.copy(),d=0;while(d<c.length)e.add(c._set[d]),d++;return e},a.prototype.intersection=function(b){var c,d,e,f,g;g=new a,c=b.length>this.length?b:this,d=b.length>this.length?this:b,f=0;while(f<d.length)e=d._set[f],c.contains(e)&&g.add(e),f++;return g},a.prototype.difference=function(b){var c,d,e;e=new a,d=0;while(d<this.length)c=this._set[d],b.contains(c)||e.add(c),d++;return e},a.prototype.symmetricDifference=function(a){return this.union(a).difference(this.intersection(a))},a.prototype.isSuperSet=function(a){var b;b=0;while(b<a.length){if(!this.contains(a._set[b]))return!1;b++}return!0},a.prototype.isSubSet=function(a){var b;b=0;while(b<this.length){if(!a.contains(this._set[b]))return!1;b++}return!0},a.prototype.add=function(a){return this._set.indexOf(a)===-1&&(this._set.push(a),this.length++),this.length},a.prototype.remove=function(a){var b;return b=this._set.indexOf(a),b!==-1?(this.length--,this._set.splice(b,1)[0]):null},a.prototype.copy=function(){return new a(this._set.slice())},a.prototype.asArray=function(){return this._set},a}(),d=this,d.Set=c,a=function(){function a(a){this.callback=a,this.ready=e(this.ready,this),this.ok=e(this.ok,this),this.wait=e(this.wait,this),this.count=1}return a.prototype.wait=function(){return this.count++},a.prototype.ok=function(){if(!--this.count)return this.callback()},a.prototype.ready=function(){return this.ok()},a}(),b=function(){function a(){this.ready=e(this.ready,this),this.ok=e(this.ok,this),this.wait=e(this.wait,this),this.count=1}return a.prototype.wait=function(){return this.count++},a.prototype.ok=function(){if(!--this.count)return log("ok executed")},a.prototype.ready=function(){return this.ok()},a}(),d=this,d.DelayedOp=a,d.DelayedSyncAnimation=b,window.debug=!1,window.log=function(){var a;a=1<=arguments.length?f.call(arguments,0):[];if(window.debug)return console.log(a)},window.one_time_sync=!1,window.keys=function(a){var b,c,d;c=[];for(b in a)d=a[b],c.push(b);return c},Nimbus.Model.general_sync={cloudcache:{},create_object_dictionary:function(){var a,b,c,d,e;a={},log("object:",this),e=this.all();for(c=0,d=e.length;c<d;c++)b=e[c],a[b.id]=b;return a},sync_model_base_algo:function(){var a,b,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A;log("#ONE TIME SYNC ALGO RUNNING",this.name),window.one_time_sync=!0,window.currently_syncing=!0,j=this.create_object_dictionary(),a=this.cloudcache,l=new c(keys(j)),b=new c(keys(a)),log("local_set",l),log("cloud_set",b),e=[],x=this.DeletionStorage.all();for(p=0,t=x.length;p<t;p++)g=x[p],this.delete_from_cloud(g.id),e.push(g.id),g.destroy();f=new c(e),log("deleted set",f),log("#the set of ids that are there locally but not there on the cloud",l.difference(b)._set),y=l.difference(b)._set;for(q=0,u=y.length;q<u;q++)i=y[q],k=j[i],k["synced"]!=null&&k.synced?(log("id for deletion",i),j[i].destroy()):this.add_to_cloud(k);log("#the set of ids that are there on the cloud but not there locally minus deletions",b.difference(l).difference(f)._set),z=b.difference(l).difference(f)._set;for(r=0,v=z.length;r<v;r++)i=z[r],this.add_from_cloud(i);log("#the set of ids that are there in the cloud and locally",b.intersection(l)._set),n=[],o=[],h=[],A=b.intersection(l)._set;for(s=0,w=A.length;s<w;s++)i=A[s],m=new Date(j[i].time),d=new Date(a[i].time),log("local_time",m.toString()),log("cloud_time",d.toString()),m-d===0?(log("equal time stamp do nothin",a[i].title),h.push(i)):m-d>0?(this.update_to_cloud(j[i]),n.push(i)):(this.update_to_local(j[i]),o.push(i));return window.currently_syncing=!1,window.one_time_sync=!1,log("updated to cloud",n.length,n),log("updated to local",o.length,o),log("equal timestamp",h.length,h)},real_time_sync:function(a,b,c){var d,e;log("method",b),log("record",a),this.saveLocal();if(window.currently_syncing)return!0;b==="update"&&(this.records[a.id].time=(new Date).toString()),e=navigator.onLine&&localStorage.state==="Working";if(!e)return console.log("syncing is not setup correctly or the instance is not online"),!0;switch(b){case"destroy":if(a.synced)return e?(log("deletion in cloud"),this.delete_from_cloud(a.id)):(d=Deletion.init({id:a.id}),d.save());break;case"create":return this.add_to_cloud(a,function(){});case"update":return this.update_to_cloud(a,function(){});case"read":return this.update_to_local(a,function(){});default:return log("REAL TIME SYNCING FAILED, THIS METHOD NOT IMPLEMENTED")}},delta_update:function(){var a;return a=this.get_delta}},Nimbus.Model.Local={extended:function(){return this.sync(this.proxy(this.saveLocal)),this.fetch(this.proxy(this.loadLocal))},saveLocal:function(){var a;return a=JSON.stringify(this),localStorage[this.name]=a},loadLocal:function(){var a;a=localStorage[this.name];if(!a)return;return a=JSON.parse(a),this.refresh(a)}},Nimbus.Model.Dropbox={cloudcache:{},last_hash:"",hash:"",toCloudStructure:function(a){return log("local to cloud structure"),JSON.stringify(a)},fromCloudStructure:function(a){return log("changes cloud to local data in the form a dictionary"),a},diff_objects:function(a,b){var c,d,e;c={};for(d in a)e=a[d],b[d]!==a[d]&&(c[d]=[b[d],a[d]]);return a["parent_id"]!=null!=(b["parent_id"]!=null)&&(c.parent_id=["one of them is null"]),c},add_to_cloud:function(a,b){return log("add to cloud",a.name),Nimbus.Client.Dropbox.putFileContents("/"+Nimbus.Auth.app_name+("/"+this.name+"/"+a.id+".txt"),this.toCloudStructure(a),function(c){log(a.name,"finished being added to cloud"),log("resp",c),window.currently_syncing=!0,a.time=c.modified,a.synced=!0,a.save(),window.currently_syncing=!1;if(b!=null)return b(c)})},delete_from_cloud:function(a,b){return log("delete from cloud",a),log("delete route","/"+Nimbus.Auth.app_name+("/"+this.name+"/"+a+".txt")),Nimbus.Client.Dropbox.deletePath("/"+Nimbus.Auth.app_name+("/"+this.name+"/"+a+".txt"),function(){log("finished delete from cloud",a);if(b!=null)return b()})},update_to_cloud:function(a,b){return log("updated to cloud",a.name),Nimbus.Client.Dropbox.putFileContents("/"+Nimbus.Auth.app_name+("/"+this.name+"/"+a.id+".txt"),this.toCloudStructure(a),function(c){log(a.name,"finished being updated to cloud"),window.currently_syncing=!0,a.time=c.modified,a.synced=!0,a.save(),window.currently_syncing=!1;if(b!=null)return b(c)})},add_from_cloud:function(a,b){var c=this;return log("add from cloud",a),Nimbus.Client.Dropbox.getFileContents("/"+Nimbus.Auth.app_name+("/"+this.name+"/"+a+".txt"),function(d){var e,f;log("cloud read data",d),window.currently_syncing=!0,e=c.fromCloudStructure(d),f=c.init(e),f.synced=!0,f.time=c.cloudcache[a].time,f.save(),window.currently_syncing=!1;if(b!=null)return b(d)})},update_to_local:function(a,b){var c=this;return log("update to local",a.name),Nimbus.Client.Dropbox.getFileContents("/"+Nimbus.Auth.app_name+("/"+this.name+"/"+a.id+".txt"),function(b){var d,e;return log("cloud read data",b),window.currently_syncing=!0,d=c.fromCloudStructure(b),e=c.find(a.id),d.time=c.cloudcache[a.id].time,e.updateAttributes(d),window.currently_syncing=!1})},sync_all:function(b){var c=this;return log("syncs all the data, normally happens at the start of a program or coming back from offline"),window.current_syncing=new a(function(){return log("call back sync called"),window.current_syncing=new a(function(){window.current_syncing=null;if(b!=null)return b()}),c.sync_model_base_algo(),window.current_syncing.ready()}),this.load_all_from_cloud(),window.current_syncing.ready()},load_all_from_cloud:function(){var a=this;log("loads all the data from the cloud locally, probably not feasible with dropbox and changes need to happen"),this.cloudcache={};try{return Nimbus.Client.Dropbox.getMetadataList("/"+Nimbus.Auth.app_name+"/"+this.name,function(b){var c,d,e,f,g,h,i;log("call back load called"),log("data",b),h=b.contents,i=[];for(f=0,g=h.length;f<g;f++)e=h[f],d=e.path,c=d.replace("/"+Nimbus.Auth.app_name+"/"+(""+a.name+"/"),"").replace(".txt",""),i.push(a.cloudcache[c]={id:c,time:e.modified});return i})}catch(b){return log("trying to get the folder failed, probably cuz it don't exist",b)}},get_delta:function(){return log("get the delta for ",this.name," since last synced")},extended:function(){return this.sync(this.proxy(this.real_time_sync)),this.fetch(this.proxy(this.loadLocal))}},Nimbus.Auth.Dropbox_auth={authenticate_dropbox:function(){return localStorage.key=this.key,localStorage.secret=this.secret,localStorage.state="Auth",Nimbus.Client.Dropbox.get_request_token(this.key,this.secret,Nimbus.Client.Dropbox.authorize_token)},initialize_dropbox:function(){log("initialization called");if(localStorage["state"]!=null&&localStorage.state==="Auth")return Nimbus.Client.Dropbox.get_access_token(function(a){return localStorage.state="Working",Nimbus.Auth.authorized_callback()})}},Nimbus.Client.Dropbox={get_request_token:function(a,b,c){var d,e;return e=new XMLHttpRequest,e.open("POST","https://api.dropbox.com/1/oauth/request_token",!0),d='OAuth oauth_version="1.0",oauth_signature_method="PLAINTEXT",oauth_consumer_key="'+a+'",oauth_signature="'+b+'&"',log(d),e.setRequestHeader("Authorization",d),e.onreadystatechange=function(){var a,b,d,e,f,g,h,i,j,k;if(this.readyState===4){if(this.status!==200){try{h=JSON.parse(h)}catch(l){}return error(h,this.status,this)}a=this.response,log(a),f=a.split(/&/),g={};for(j=0,k=f.length;j<k;j++)b=f[j],e=b.split(RegExp("="),2),g[e[0]]=e[1];log("Token result",g);for(d in g)i=g[d],localStorage[d]=i;window.request_token=g;if(c!=null)return c(g)}},e.send()},authorize_token:function(a){var b,c;return document.URL.slice(0,4)==="http"?(c="&oauth_callback="+encodeURI(document.URL),location.replace(b)):(c="",console.log("local url",document.URL),b="https://www.dropbox.com/1/oauth/authorize?oauth_token="+a.oauth_token+c,location.replace(b))},get_access_token:function(a){var b,c,d,e;return c=localStorage.oauth_token,d=localStorage.oauth_token_secret,b='OAuth oauth_version="1.0",oauth_signature_method="PLAINTEXT",oauth_consumer_key="'+Nimbus.Auth.key+'",oauth_token="'+c+'",oauth_signature="'+Nimbus.Auth.secret+"&"+d+'"',log("auth_string:",b),e=new XMLHttpRequest,e.open("POST","https://api.dropbox.com/1/oauth/access_token",!0),e.setRequestHeader("Authorization",b),e.onreadystatechange=function(){var b,c,d,e,f,g,h,i,j,k;if(this.readyState===4){if(this.status!==200){try{h=JSON.parse(h)}catch(l){}return log(h,this.status,this)}c=this.response,log(c),g=c.split(/&/),b={};for(j=0,k=g.length;j<k;j++)d=g[j],f=d.split(RegExp("="),2),b[f[0]]=f[1];log("Access result",b);for(e in b)i=b[e],localStorage[e]=i;window.access_token=b;if(a!=null)return a(b)}},e.send()},send_request:function(a,b,c,d,e){var f,g,h,i,j,k;h=localStorage.oauth_token,i=localStorage.oauth_token_secret,f='OAuth oauth_version="1.0",oauth_signature_method="PLAINTEXT",oauth_consumer_key="'+Nimbus.Auth.key+'",oauth_token="'+h+'",oauth_signature="'+Nimbus.Auth.secret+"&"+i+'"',log("auth_string:",f),k=new XMLHttpRequest,k.open(a,b,!0),k.setRequestHeader("Authorization",f),k.onreadystatechange=function(){var a;if(this.readyState===4){if(this.status===200){a=this.response;try{a=JSON.parse(a)}catch(b){}log("REQUEST RESULT",a),d!=null&&d(a)}else{try{a=JSON.parse(a)}catch(b){}log(a,this.status,this),e!=null&&e(a)}if(window.current_syncing!=null)return window.current_syncing.ok()}};if(a==="POST"){k.setRequestHeader("Content-Type","application/x-www-form-urlencoded");if(c){j=[];for(g in c)j.push(encodeURIComponent(g)+"="+encodeURIComponent(c[g]));c=j.length>0?j.join("&").replace(/%20/g,"+"):null}log(c)}return log("send request params",a,b,c,d,e),window.current_syncing!=null&&window.current_syncing.wait(),k.send(c)},putFileContents:function(a,b,c,d){return log("putFileContents"),Nimbus.Client.Dropbox.send_request("PUT","https://api-content.dropbox.com/1/files_put/dropbox"+a,b,c,d)},deletePath:function(a,b,c){return log("deletePath"),Nimbus.Client.Dropbox.send_request("POST","https://api.dropbox.com/1/fileops/delete",{root:"dropbox",path:a},b,c)},getFileContents:function(a,b,c){return log("getFileContents"),Nimbus.Client.Dropbox.send_request("GET","https://api-content.dropbox.com/1/files/dropbox"+a,"",b,c)},getMetadataList:function(a,b,c){return log("getMetadataList"),Nimbus.Client.Dropbox.send_request("GET","https://api.dropbox.com/1/metadata/dropbox"+a,"",b,c)}},Nimbus.Auth.reinitialize()})).call(this);