/*



    This code is a bit mesy and will be cleaned up later

    For some reason Ollama does't format their JSON in a way that javascript can parse
    So I have to edit it before parsing




*/


// the element that acts as the ai's chat box
var aiWriteTo = null;
// array of conversation messages
var messagesText = [];

function addUserChat(chat)
{
    messagesText[messagesText.length] = 
    { 
        role: 'user', 
        content: chat 
    };
}

function addAiChat(chat)
{
    messagesText[messagesText.length] = 
    { 
        role: 'assistant', 
        content: chat 
    };
}

function GetLastAiMessage()
{
  var chatContent = document.getElementById("contents");
    var list = document.getElementsByClassName("aiReply"); 
    if(list.length > 0)
    {
      var last = list[list.length - 1];
      var msg = last.innerText;
      console.log("ai: " + msg);
      addAiChat(msg);
    }

    chatContent.scrollTop = chatContent.offsetHeight;
}


function ChatWith()
{
  var chatContent = document.getElementById("contents");
  GetLastAiMessage();
  var prmptElement = document.getElementById('text');
  var prompt = prmptElement.value;

  var content = document.getElementById("contents");

  var user =  document.createElement("div");
  user.innerHTML = prompt;
  user.classList.add( "userChat", "userTextColor" );

  addUserChat(prompt);
 
  var ele = document.createElement("div");
  ele.classList.add( "aiReply", "aiTextColor" );

  // add the conversation to the conversation box
  content.appendChild(user);
  content.appendChild(ele);

  ele.innerHTML += "........";
  // assign a chat box for the ai
  aiWriteTo = ele;
  prmptElement.value = "";
  const datares = new XMLHttpRequest();

 const json = JSON.stringify({
    model: 'gemma2',
    messages: messagesText,
    stream: true
 });


  datares.open("POST", 'http://localhost:11434/api/chat')

  datares.setRequestHeader('Content-Type', 'application/json');

  datares.send(json);

  datares.onprogress = (e) => {
    if (datares.statusText == "OK") {

      const result = datares.response;

      // clear ai chat box
      aiWriteTo.innerHTML = "";
      var dat = "ERR";

        
      // reformating so the json can be parsed
      // ollama should really just hand me a 
      // json object instead of json segments
      var edit = "[" + result;
      edit = edit.replaceAll("false}", "false},");
      var cm = edit.lastIndexOf(',');
      edit = edit.substring(0, cm + 1) + "]";

    
      
      try 
      {

       
         var jsn = JSON.parse(edit);


        for(var v = 0; v < jsn.length; v++)
        {
            dat =  jsn[v].message;
            aiWriteTo.innerHTML += dat;
        }
       
      }
      catch
      {
        //backup function if the json format fails
        var arry = result.split('{"');

        for(var v = 0; v < arry.length; v++)
        {
          dat = arry[v].toString();
          // replace formating
          dat = dat.replaceAll('\\"', '"');
          dat = dat.replaceAll("\\n", "<br/>");
          aiWriteTo.innerHTML += parseChat(dat);
        }
        
      }

    } else {
      console.log(datares.statusText);
    }

    //scroll it
    chatContent.scrollTop = chatContent.offsetHeight;
  }

  chatContent.scrollTop = chatContent.offsetHeight;
}

function parseChat(obj)
{
    var parseResponse = "";
    var len = '"role":"assistant","content":"'.length;

    const responseStart = obj.indexOf('"role":"assistant","content":"') + len;
    const responseEnd =  obj.indexOf('"}', responseStart);
    
    if(responseStart > 0 && responseEnd > 0)
    {
        parseResponse = obj.slice(responseStart, responseEnd);
    }

    return parseResponse;
}

function ReplaceAllText(str, find, replace)
{
    while(str.includes(find)){
        str = str.replace(find, replace);
    }

    return str;
}
