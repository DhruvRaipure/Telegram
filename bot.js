require('dotenv').config()
var {Client}=require('pg')

var Bot=require('node-telegram-bot-api')

bot=new Bot(process.env.TOKEN,{polling:true})

bot.onText(/^\/start$/,(msg)=>{
  var f= "/mighty_mighty \n /random_ \n /all_\n";
  var client=new Client({
    connectionString: process.env.DATABASE_URL, ssl:true
  });
  client.connect();

  query="SELECT COUNT(*), genre FROM mySchema.myTable GROUP BY GENRE"

  client.query(query,(err,data)=>{
    if(err)
    throw err;

    for(let x in data.rows)
    {
      f=f+'/all'+data.rows[x].genre+'\n';
    }
    for(let x in data.rows)
    {
      f=f+'/random'+data.rows[x].genre+'\n';
    }

    f=f+'/help \n'

    bot.sendMessage(msg.chat.id,f)

    client.end()
  })
})

bot.onText(/^\/mighty_mighty$/,(msg)=>{              //client enters mighty_mighty
    bot.sendMessage(msg.chat.id,"YEMIT!!")
})

bot.onText(/^\/help$/,(msg)=>{                                     //client enters help
  bot.sendMessage(msg.chat.id, "Enter /start for all commands")
})

var found=0;

bot.onText(/^\/random(.+)/,(msg,match)=>{                     // on random
   var client= new Client({
     connectionString:process.env.DATABASE_URL, ssl:true
   });
   client.connect();

   if(match[1]=='_')                                          //on random_
   {
     query="SELECT * FROM mySchema.myTable"
     client.query(query,(err,info)=>{
       if(err)
       throw err;

       bot.sendMessage(msg.chat.id,info.rows[Math.floor(Math.random()*info.rows.length)].quote)

       return;
     })
   }
   else
   {
     query="SELECT genre FROM mySchema.myTable GROUP BY genre"     // specific genre
     client.query(query,(err,data)=>{
       if(err) 
       throw err;
       var found=0;

       for(let x in data.rows)
       {
         if(data.rows[x].genre==match[1])
           found=1;
       }
       if(found==0)
       {
         bot.sendMessage(msg.chat.id,"Invalid query..")    // no such genre exists
       }

       if(found==1)
       {
         q="SELECT quote FROM mySchema.myTable WHERE genre="+"'"+match[1]+"'"      
         client.query(q,(err,info)=>{
           bot.sendMessage(msg.chat.id,info.rows[Math.floor(Math.random()*info.rows.length)].quote)
           client.end();
         })
       }
     })
   }
})

bot.onText(/^\/all(.+)/,(msg,match)=>{                            // on all
  var client=new Client({
    connectionString: process.env.DATABASE_URL, ssl: true
  })

  client.connect();

  if(match[1]=='_')                                               // all the quotes in the schema
  {
    query="SELECT *FROM mySchema.myTable"
    client.query(query,(err,info)=>{
      if(err)
      throw err;

      for(let x in info.rows)
      {
        bot.sendMessage(msg.chat.id, info.rows[x].quote)
      }
    })
    return;
  }
  else                                                                       
  {
    query="SELECT genre FROM mySchema.myTable GROUP BY genre"                    // all quotes of specific genre
    client.query(query,(err,data)=>{
    if(err)
    throw err;
    for(let x in data.rows)
    {
      
      var str=data.rows[x].genre;
      if(str==match[1]){
      found=1;
      console.log(found);
      }
    }
    if(found==0)
    {
      bot.sendMessage(msg.chat.id,"Invalid query")
    }
    if(found==1)
    {
      q="SELECT quote from mySchema.myTable WHERE genre="+"'"+match[1]+"'"
      client.query(q,(err,info)=>{
        if(err)
        throw err;

        for(let x in info.rows)
        {
          bot.sendMessage(msg.chat.id,info.rows[x].quote)
        }
        client.end()
      })
    }
  })
  }
})