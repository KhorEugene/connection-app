const code = document.getElementById("codeform");
code.addEventListener("submit", event => {
  event.preventDefault();
  let codeval = code.elements.code.value
  document.getElementById("codeform").innerHTML = "Validating...";
  fetch(window.location.pathname+"/check/"+codeval)
  .then(res => res.json())
  .then(name => {
    if(name.Status == "Success"){
      document.getElementById("mainbody").innerHTML = "Successfully registered! Please wait while we redirect you to the login";
    } else {
      document.getElementById("mainbody").innerHTML = "Invalid attempt! Redirecting you back to login..";
    }
  })
  setTimeout(()=>{
        window.location = "https://connection-app.glitch.me/";
      },3000)
})

const login = document.getElementById("login");
login.addEventListener("click", event => {
    login.method="get";
    login.action="/";
    login.submit();
})