const panel = document.getElementById("welcome");
const availability = document.getElementById("availability")
const platforms = document.getElementById("platforms")
const contact = document.getElementById("contact-info")
const session = document.getElementById("session-id");
const infoform = document.getElementById("infoform");
const button = document.getElementById("logout");

function listmaker(array){
  let output = ""
  array.forEach((val)=>{
    output += "<li>"+val+"</li>";
  })
  return output
}

fetch(window.location.pathname + "/information")
.then(res => res.json())
.then(name => {
  const nickname = name.Name.toLowerCase();
  const nameCapitalized = nickname.charAt(0).toUpperCase() + nickname.slice(1);
  panel.innerHTML = "Welcome to your personal dashboard " + nameCapitalized;
  availability.innerHTML = listmaker(name.Availability); 
  platforms.innerHTML = listmaker(name.Platforms); 
  contact.innerHTML = listmaker(name.Contact);
})

infoform.addEventListener("submit", event => {
    infoform.method="post";
    infoform.action=window.location.pathname+"/update";
    infoform.submit();
})

button.addEventListener("click", event => {
    button.method="get";
    button.action="/";
    button.submit();
})


