
/*



    IGNORE THIS TESTING CODE, ITS VERY BAD






*/






var aiWriteTo = null;

function testGet()
{
  var prmptElement = document.getElementById('text');
  var prompt = prmptElement.value;
  var content = document.getElementById("contents");
  var user =  document.createElement("div");
  user.innerHTML = prompt;
  user.classList.add( "userChat", "userTextColor" );

 
  var ele = document.createElement("div");
  ele.classList.add( "aiReply", "aiTextColor" );
  content.appendChild(user);
  content.appendChild(ele);
  ele.innerHTML += "........";
  aiWriteTo = ele;
  prmptElement.value = "";
  const datares = new XMLHttpRequest();
  //   const json = JSON.stringify({
  //   "name": "The Oracle of Delphi, Pythia",
  //   "modelfile": "FROM llama3\nSYSTEM You are an oracle who has the most accurate information imaginable."
  // }); 

 const json = JSON.stringify({
    model: 'gemma2',
      prompt: prompt,
      stream: true
  }); 
  /*
 http://localhost:11434/api/create -d '{
  "name": "mario",
  "modelfile": "FROM llama2\nSYSTEM You are mario from Super Mario Bros."
}'
curl http://localhost:11434/api/chat -d '{
  "model": "llama3",
  "messages": [
    {
      "role": "user",
      "content": "why is the sky blue?"
    },
    {
      "role": "assistant",
      "content": "due to rayleigh scattering."
    },
    {
      "role": "user",
      "content": "how is that different than mie scattering?"
    }
  ]
}
*/

  datares.open("POST", 'http://localhost:11434/api/generate')
  //datares.open("POST", 'http://localhost:11434/api/create')
  datares.setRequestHeader('Content-Type', 'application/json');

  datares.send(json);

  datares.onprogress = (e) => {
    if (datares.statusText == "OK") {
      const result = datares.response;
      aiWriteTo.innerHTML = "";
      var dat = "ERR";


      // reformating so the json can be parsed
      // ollama should really just hand me a 
      // json object instead of json segments
      var edit = "[" + result;
      edit = edit.replaceAll("}", "},");
      var cm = edit.lastIndexOf(',');
      edit = edit.substring(0, cm) + "]";

     // console.log(edit);


      
      try {

        var jsn = JSON.parse(edit);

        for(var v = 0; v < jsn.length; v++)
        {
            dat =  jsn[v].response;
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
          dat = dat.replaceAll('\\"', '"');
          dat = dat.replaceAll("\\n", "<br/>");
          aiWriteTo.innerHTML += parseResponse(dat);
        }
        
      }

    } else {
      console.log(datares.statusText);
    }
}
}




// 	async function generateText(prompt) {
//   const url = 'http://localhost:11434/api/generate';
//   const data = {
//     model: 'llama3',
//     prompt: prompt
//   };


//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(data)
//     });

//     if (response.ok) {
//       const result = await response.text();

//       var arry = result.split('{"');
//       var ele = document.getElementById("test");

//       for(var v = 0; v < arry.length; v++)
//       {
//         var dat =  parseResponse(arry[v].toString());
//         //dat = ReplaceAllText(dat, )
//         console.log( dat.split("\\" + "n"));
//         dat = dat.split("\\n").join("<br/>");
//         ele.innerHTML += dat;
//       }

//     } else {
//       console.log(response.statusText);
//     }
// }

function ReplaceAllText(str, find, replace)
{
  while(str.includes(find)){
    str = str.replace(find, replace);
  }

  return str;
}


function parseResponse(obj) {
  var parsedResponse = "";
  try{
  const responseStart = obj.indexOf('"response":') + 12;
  const responseEnd = obj.lastIndexOf('","');
  
  if(responseStart > 0 && responseEnd > 0)
  {
   parsedResponse = obj.slice(responseStart, responseEnd);
  }
  }catch{

  }
  
  //console.log(parsedResponse);
  return parsedResponse;
}

// Usage example
//const prompt = 'How to create a new electron app project';
//console.log(generateText(prompt));