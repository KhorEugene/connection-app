const execform = document.getElementById("execute");
const returnform = document.getElementById("return");
const clearform = document.getElementById("clear");

const firstcap = function(val){
  const lowval = val.toLowerCase();
  return lowval.charAt(0).toUpperCase() + lowval.slice(1);
}


const same = function(arr1,arr2) {
    let ret = [];
    for(let i in arr1) {   
        if(arr2.indexOf(arr1[i]) > -1){
            ret.push(arr1[i]);
        }
    }
    return ret;
};

const getFields = function(input, field) {
  if (input.length == 0){
    return [];
  } else {
    const output = [];
    for (let i=0; i < input.length ; ++i)
        output.push(input[i][field]);
    return output;
  }
}

const timeoverlap = function(duration1,duration2){
  if(duration1.length !== 42 || duration2.length !== 42){
    return false;
  } else {
    const starttime1 = Date.parse(duration1.split(" ")[0]+"T"+duration1.split(" ")[1]);
    const endtime1 = Date.parse(duration1.split(" ")[3]+"T"+duration1.split(" ")[4]);
    const starttime2 = Date.parse(duration2.split(" ")[0]+"T"+duration2.split(" ")[1]);
    const endtime2 = Date.parse(duration2.split(" ")[3]+"T"+duration2.split(" ")[4]);
    if((starttime1 <= endtime2) && (endtime1 >= starttime2)){
      return true;
    } else {
      return false;
    }
  }
}

const duroverlap = function(duration1,duration2){
  if(timeoverlap(duration1,duration2)){
    const starttime1 = Date.parse(duration1.split(" ")[0]+"T"+duration1.split(" ")[1]);
    const endtime1 = Date.parse(duration1.split(" ")[3]+"T"+duration1.split(" ")[4]);
    const starttime2 = Date.parse(duration2.split(" ")[0]+"T"+duration2.split(" ")[1]);
    const endtime2 = Date.parse(duration2.split(" ")[3]+"T"+duration2.split(" ")[4]);
    if(starttime2 >= starttime1){
      if(endtime2 >= endtime1){
        return duration2.split(" ")[0]+" "+duration2.split(" ")[1] + " to " + duration1.split(" ")[3]+" "+duration1.split(" ")[4]   
      } else {
        return duration2.split(" ")[0]+" "+duration2.split(" ")[1] + " to " + duration2.split(" ")[3]+" "+duration2.split(" ")[4]
      }
    } else {
      if(endtime1 >= endtime2){
        return duration1.split(" ")[0]+" "+duration1.split(" ")[1] + " to " + duration2.split(" ")[3]+" "+duration2.split(" ")[4]  
      } else {
        return duration1.split(" ")[0]+" "+duration1.split(" ")[1] + " to " + duration1.split(" ")[3]+" "+duration1.split(" ")[4]  
      }
    }
  } else {
    return "No overlap!";
  }
}

const retavaoverlap = function(arr1, arr2){
  if(arr1.length==0 || arr2.length==0){
    return [];
  } else {
    let ret = [];
    for(let i in arr1) {   
        arr2.forEach((val)=>{
          if(timeoverlap(arr1[i],val)){
            ret.push(duroverlap(arr1[i],val));
          }
        })
    }
    return ret;
  }
}

const availabilityoverlap = function(arr1,arr2){
  if(arr1.length==0 || arr2.length==0){
    return [];
  } else {
    let ret = [];
    for(let i in arr1) {   
        arr2.forEach((val)=>{
          if(timeoverlap(arr1[i],val)){
            ret.push(arr1[i]);
          }
        })
    }
    return ret;
  }
}

const removeitem = function(arr,itemname){
  const final = arr.filter((val)=>{
    return val.nickname !== itemname;
  })
  return final;
}

const getrandom = function(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

const arrtojson = function(arr){
  let json = {};
  for(let i in arr){
    let email = arr[i].email;

    json[email] = arr[i];
  }
  return json;
}


fetch(window.location.pathname+"/admininfo")
.then(res => res.json())
.then(name => {
  const viewpane = document.getElementById("view");
  const view2pane = document.getElementById("view2");
  const numberFalse = getFields(name,"status").filter((val)=>{
    return val == "False";
  }).length;
  const numberTrue = getFields(name,"status").filter((val)=>{
    return val == "True";
  }).length;
  let content = "<b>Participants: </b>"+numberTrue;
  let content2 = "<b>Non-participants: </b>"+numberFalse;
  
  for(let i in name){
    let user = name[i];
    if(user.status=="False"){
      content2 += "<li>" + firstcap(user.nickname)+"</li>";
    } else {
      if(user.strangername=="NA"){
        content += "<li>" + firstcap(user.nickname)+" : No users matched :("+"</li>";
      } else {
        content += "<li>"+firstcap(user.nickname) + " : " + firstcap(user.strangername) + " with matching platforms of "+user.matchplatforms.join(", ")+ " with matching times of "+user.matchtime+". Contact at "+user.strangercontact+".</li>"
      }
    }
  }

  viewpane.innerHTML = content;
  view2pane.innerHTML = content2;
  
  execform.addEventListener("submit", event => {
    let finalusers = [];
    const filtername = name.filter((val)=>{
    return val.status=="True";
    })
    let leftusers = filtername;
    for(let i in filtername) {   
    let user = filtername[i]; 
    if(finalusers.includes(user)){
      //nothing happens
    } else {
      const matchp = leftusers.filter((val)=>{
      if(user.email==val.email){
        return false;
      } else if(user.platforms.includes("Any")){
        return true;
      } else if(val.platforms.includes("Any")){
        return true;
      } else {
        return same(user.platforms,val.platforms).length !== 0; 
      }
    })
     let totmatch = matchp.filter((val)=>{
      if(val.availability.length == 0 || user.availability.length == 0){
        return false;
      } else {
        return availabilityoverlap(user.availability,val.availability).length !== 0;
      }
    })
     if(totmatch.length==0){
      user.matchplatforms = ["NA"];
      user.strangercontact = "NA";
      user.matchtime = "NA";
      user.strangername = "NA";
      finalusers.push(user);
      removeitem(leftusers,user.nickname);
     } else {
      const finalmatch = getrandom(totmatch);
      for(let j in leftusers) { 
        if(leftusers[j].nickname==finalmatch.nickname){
          if(leftusers[j].strangername=="NA"){
            let finaltime = getrandom(retavaoverlap(leftusers[j].availability,user.availability));
            leftusers[j].strangername = user.nickname;
            leftusers[j].strangercontact = user.contact[0];
            if(leftusers[j].platforms.includes("Any")||user.platforms.includes("Any")){
              leftusers[j].matchplatforms = ["Any"];
              user.matchplatforms = ["Any"];
            } else {
              leftusers[j].matchplatforms = same(leftusers[j].platforms,user.platforms);  
              user.matchplatforms = same(leftusers[j].platforms,user.platforms);
            }
            leftusers[j].matchtime = finaltime;
            user.strangercontact = finalmatch.contact[0];
            user.matchtime = finaltime;
            user.strangername = finalmatch.nickname;
            finalusers.push(user);
            finalusers.push(leftusers[j]);
            removeitem(leftusers,user.nickname);
            removeitem(leftusers,finalmatch.nickname);
          } 
        }    
      }
     } 
    }
    }
    execform.method="post";
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'update';
    input.value = JSON.stringify(arrtojson(finalusers));
    execform.appendChild(input);
    execform.action=window.location.pathname+"/adminexecute";
    execform.submit();
  })
  
  
  clearform.addEventListener("submit", event => {
    clearform.method="post";
    clearform.action=window.location.pathname+"/adminclear";
    clearform.submit();
  })
})

returnform.addEventListener("submit", event => {
    returnform.method="get";
    returnform.action="/";
    returnform.submit();
})