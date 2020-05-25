const panel = document.getElementById("welcome");
const availability = document.getElementById("availability")
const platforms = document.getElementById("platforms")
const contact = document.getElementById("contact-info")
const session = document.getElementById("session-id");
const infoform = document.getElementById("infoform");
const avform = document.getElementById("availabilityform");
const platformform = document.getElementById("platformform");
const button = document.getElementById("logout");
const stname = document.getElementById("strangername");
const stplatform = document.getElementById("matchplatform");
const sttime = document.getElementById("matchtime");
const stcontact = document.getElementById("strangercontact");
const status = document.getElementById("partstatus");
const msgbtn = document.getElementById("buttonmsg");
const matchsts = document.getElementById("matchstatus");
const resetform = document.getElementById("resetpw");
const xhttp = new XMLHttpRequest();

function listmakera(array){
  let output = ""
  array.forEach((val)=>{
    let baidentity = "bida"+ array.indexOf(val).toString();
    let laidentity = "lida"+ array.indexOf(val).toString();
      output += "<li id="+laidentity+">"+val+"<button id="+baidentity+">X</button>"+"</li>"; 
  })
  return output
}

function listmakerp(array){
  let output = ""
  array.forEach((val)=>{
    let bpidentity = "bidp"+ array.indexOf(val).toString();
    let lpidentity = "lidp"+ array.indexOf(val).toString();
    output += "<li id="+lpidentity+">"+val+"<button id="+bpidentity+">X</button>"+"</li>";
  })
  return output
}

function listmakerc(array){
  let output = ""
  array.forEach((val)=>{
    let bcidentity = "bidc"+ array.indexOf(val).toString();
    let lcidentity = "lidc"+ array.indexOf(val).toString();
    output += "<li id="+lcidentity+">"+val+"<button id="+bcidentity+">X</button>"+"</li>";
  })
  return output
}

const firstcap = function(val){
  const lowval = val.toLowerCase();
  return lowval.charAt(0).toUpperCase() + lowval.slice(1);
}

fetch(window.location.pathname + "/information")
.then(res => res.json())
.then(name => {
  panel.innerHTML = "Welcome to your personal dashboard " + firstcap(name.Name);
  if(name.status=="False"){
    status.innerHTML = "Not confirmed";
    msgbtn.innerHTML = "Confirm Now";
    status.style.color = "red";
  } else {
    status.innerHTML = "Confirmed";
    msgbtn.innerHTML = "Unconfirm Now";
    status.style.color = "green";
  }
  if (name.Availability.length==0||name.Availability[0]==""){
    availability.innerHTML = listmakera(["Not updated"]);
    availability.style.color = "red";
  } else {
    availability.innerHTML = listmakera(name.Availability);
    if(name.Availability.length==5){
      document.getElementById("maxwarn").innerHTML = "Max number of availability intervals reached!";
      document.getElementById("maxwarn").style.color = "red";
    }
  }
  if (name.Platforms.length==0||name.Platforms[0]==""){
    platforms.innerHTML = listmakerp(["Not updated"]);
    platforms.style.color = "red";
  } else {
    platforms.innerHTML = listmakerp(name.Platforms); 
  }
  if (name.Contact.length==0||name.Contact[0]==""){
    contact.innerHTML = listmakerc(["Not updated"]);
    contact.style.color = "red";
  } else {
    contact.innerHTML = listmakerc(name.Contact);
  }
  if(name.strangername=="NA"){
    matchsts.innerHTML = "No Matches.. &#128542;"
    matchsts.style.color = "red";
    stname.innerHTML = "No matches this week :(";
    stname.style.color = "red";
  } else {
    matchsts.innerHTML = "MATCHED! &#9996;"
    matchsts.style.color = "white";
    stname.innerHTML = firstcap(name.strangername);
  }
  if(name.matchplatforms[0]=="NA" || name.matchplatforms.length==0){
    stplatform.innerHTML = "No matches this week :(";  
    stplatform.style.color = "red";
  } else {
    stplatform.innerHTML = name.matchplatforms.join(", ");
  }
  if(name.matchtime=="NA"){
    sttime.innerHTML = "No matches this week :(";  
    sttime.style.color = "red";
  } else {
    sttime.innerHTML = name.matchtime;
  }
  if(name.strangercontact=="NA"){
    stcontact.innerHTML = "No matches this week :(";  
    stcontact.style.color = "red";
  } else {
    stcontact.innerHTML = firstcap(name.strangercontact);
  }
  let lista = Object.values(document.getElementsByTagName("button")).filter((val)=>{
    if(val.getAttribute('id')==null){
      return false;
    } else { 
      return val.getAttribute('id').substring(0,4) == "bida";
    }
  })
  let listp = Object.values(document.getElementsByTagName("button")).filter((val)=>{
    if(val.getAttribute('id')==null){
      return false;
    } else { 
      return val.getAttribute('id').substring(0,4) == "bidp";
    }
  })
  let listc = Object.values(document.getElementsByTagName("button")).filter((val)=>{
    if(val.getAttribute('id')==null){
      return false;
    } else { 
      return val.getAttribute('id').substring(0,4) == "bidc";
    }
  })
  
  lista.forEach((val)=>{
    val.addEventListener("click", event => {
      let identity="lida"+val.getAttribute('id').slice(4);
      let baidentity = "bida"+ val.getAttribute('id').slice(4);
      let todel = document.getElementById(identity).innerHTML.split("<")[0];
      if(todel!=="Not updated"&& todel!=="---Deleted---"){
        xhttp.open("POST", window.location.pathname + "/delete",true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify({"todelete":todel,"type":"availability"}));
        document.getElementById(identity).innerHTML = "---Deleted---<button id="+baidentity+">X</button>";
        document.getElementById(identity).style.color = "red";
      }
    })
  })
  
  listp.forEach((val)=>{
    val.addEventListener("click", event => {
      let identity="lidp"+val.getAttribute('id').slice(4);
      let baidentity = "bidp"+ val.getAttribute('id').slice(4);
      let todel = document.getElementById(identity).innerHTML.split("<")[0];
      if(todel!=="Not updated"&& todel!=="---Deleted---"){
        xhttp.open("POST", window.location.pathname + "/delete",true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify({"todelete":todel,"type":"platforms"}));
        document.getElementById(identity).innerHTML = "---Deleted---<button id="+baidentity+">X</button>";
        document.getElementById(identity).style.color = "red";
      }
    })
  })
  listc.forEach((val)=>{
    val.addEventListener("click", event => {
      let identity="lidc"+val.getAttribute('id').slice(4);
      let baidentity = "bidc"+ val.getAttribute('id').slice(4);
      let todel = document.getElementById(identity).innerHTML.split("<")[0];
      if(todel!=="Not updated" && todel!=="---Deleted---"){
        xhttp.open("POST", window.location.pathname + "/delete",true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify({"todelete":todel,"type":"contact"}));
        document.getElementById(identity).innerHTML = "---Deleted---<button id="+baidentity+">X</button>";
        document.getElementById(identity).style.color = "red";
      }  
    })
  })
  
  document.getElementById("confirm").addEventListener("submit", event => {
    let updatests = status.innerHTML;
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'status';
    input.value = updatests;
    document.getElementById("confirm").appendChild(input);
    document.getElementById("confirm").method="post";
    document.getElementById("confirm").action=window.location.pathname+"/confirm";
    document.getElementById("confirm").submit();
})
  
})

avform.addEventListener("submit", event => {
  const start = Date.parse(avform.elements["start-date"].value + "T" + avform.elements["start-time"].value+":00");
  const end = Date.parse(avform.elements["end-date"].value + "T" + avform.elements["end-time"].value+":00")
  if(start>end){
    document.getElementById("errorbox").innerHTML = "Please ensure the start datetime is BEFORE the end datetime";
    event.preventDefault();
  } else {
    const input1 = document.createElement('input');
    input1.type = 'hidden';
    input1.name = "typeA";
    input1.value = "True";
    const input2 = document.createElement('input');
    input2.type = 'hidden';
    input2.name = "typeP";
    input2.value = "False";
    const input3 = document.createElement('input');
    input3.type = 'hidden';
    input3.name = "typeC";
    input3.value = "False";
    avform.appendChild(input1);
    avform.appendChild(input2);
    avform.appendChild(input3);
    let newAvailability = avform.elements["start-date"].value + " " + avform.elements["start-time"].value+":00" +" to "+ avform.elements["end-date"].value + " " + avform.elements["end-time"].value+":00"
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = "availability";
    input.value = newAvailability;
    avform.appendChild(input);
    avform.method="post";
    avform.action=window.location.pathname+"/update";
    avform.submit();
  }
})

platformform.addEventListener("submit", event => {
  const input1 = document.createElement('input');
  input1.type = 'hidden';
  input1.name = "typeA";
  input1.value = "False";
  const input2 = document.createElement('input');
  input2.type = 'hidden';
  input2.name = "typeP";
  input2.value = "True";
  const input3 = document.createElement('input');
  input3.type = 'hidden';
  input3.name = "typeC";
  input3.value = "False";
  platformform.appendChild(input1);
  platformform.appendChild(input2);
  platformform.appendChild(input3);
  platformform.method="post";
  platformform.action=window.location.pathname+"/update";
  platformform.submit();
})

infoform.addEventListener("submit", event => {
  const input1 = document.createElement('input');
  input1.type = 'hidden';
  input1.name = "typeA";
  input1.value = "False";
  const input2 = document.createElement('input');
  input2.type = 'hidden';
  input2.name = "typeP";
  input2.value = "False";
  const input3 = document.createElement('input');
  input3.type = 'hidden';
  input3.name = "typeC";
  input3.value = "True";
  infoform.appendChild(input1);
  infoform.appendChild(input2);
  infoform.appendChild(input3);
  infoform.method="post";
  infoform.action=window.location.pathname+"/update";
  infoform.submit();
})

button.addEventListener("click", event => {
    button.method="get";
    button.action="/";
    button.submit();
})

resetform.addEventListener("submit", event => {
    resetform.method="get";
    resetform.action=window.location.pathname+"/resetpw";
    resetform.submit();
})


