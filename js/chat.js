/*



    This code is a bit mesy and will be cleaned up later

    For some reason Ollama does't format their JSON in a way that javascript can parse
    So I have to edit it before parsing




*/


// the element that acts as the ai's chat box
var aiWriteTo = null;
// array of conversation messages
var messagesText = [];

var imgs = [];

function addUserChat(chat)
{
    messagesText[messagesText.length] = 
    { 
        role: 'user', 
        content: chat,
        images: imgs
    };

    console.log(messagesText);
}

function addAiChat(chat)
{
    messagesText[messagesText.length] = 
    { 
        role: 'assistant', 
        content: chat 
    };
}

function updateImagePreview() {
  const imagePreview = document.getElementById('imagePreview');
  imagePreview.innerHTML = '';

  const imgdiv = document.getElementById('hasImages');
  if(imgs.length > 0)
  {
    imgdiv.style.display = "block";
  }
  else
  {
    imgdiv.style.display = "none";
  }

  imgs.forEach((imgData, index) => {
    const imgContainer = document.createElement('div');
    imgContainer.style.position = 'relative';
    imgContainer.style.marginRight = '10px';

    const img = document.createElement('img');
    img.src = `data:image/jpeg;base64,${imgData}`;
    img.style.width = '100px';
    img.style.height = '100px';

    const removeButton = document.createElement('div');
    removeButton.textContent = 'X';
    removeButton.style.position = 'absolute';
    removeButton.style.top = '0';
    removeButton.style.right = '0';
    removeButton.style.background = 'red';
    removeButton.style.color = 'white';
    removeButton.style.cursor = 'pointer';
    removeButton.style.padding = '2px 5px';
    removeButton.onclick = () => {
      imgs.splice(index, 1);
      updateImagePreview();
    };

    imgContainer.appendChild(img);
    imgContainer.appendChild(removeButton);
    imagePreview.appendChild(imgContainer);
  });
}

function toggleImageMenu() {
  const menu = document.getElementById('imageMenu');
  if (menu.style.display === 'none') {
    menu.style.display = 'block';
  } else {
    menu.style.display = 'none';
  }
}

function ChatWith()
{
  var chatContent = document.getElementById("contents");
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
    model: 'gemma3:4b',
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
