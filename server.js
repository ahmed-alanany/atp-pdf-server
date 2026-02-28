const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
app.use(express.json({limit:"10mb"}));

app.post("/generate-pdf", async (req,res)=>{

const {title,userCode,questions}=req.body;

const browser=await puppeteer.launch({
args:["--no-sandbox"]
});

const page=await browser.newPage();

const html=`
<html>
<head>

<style>

body{
font-family:Arial;
background:#f5f7fb;
padding:40px;
}

.header{
display:flex;
justify-content:space-between;
border-bottom:3px solid #2c3e50;
margin-bottom:25px;
padding-bottom:10px;
}

.card{
background:white;
border-radius:10px;
padding:20px;
margin-bottom:20px;
box-shadow:0 2px 8px rgba(0,0,0,.08);
}

.option{
background:#f1f4f9;
padding:8px;
margin:5px 0;
border-radius:6px;
}

.answer{
background:#e8f0ff;
padding:15px;
margin-top:15px;
border-left:5px solid #4a6cf7;
}

.watermark{
position:fixed;
top:40%;
left:10%;
font-size:80px;
opacity:.06;
transform:rotate(-30deg);
}

</style>
</head>

<body>

<div class="watermark">
ATP-${userCode}
</div>

<div class="header">
<h2>ATP INTELLIGENT SYSTEM</h2>
<h3>${title}</h3>
</div>

${questions.map((q,i)=>`

<div class="card">

<h3>Q${i+1}. ${q.question}</h3>

${
q.type==="mcq"
? q.options.map(o=>`<div class="option">${o}</div>`).join("")
:""
}

<div class="answer">
<b>Answer:</b>
<p>${q.answer}</p>
</div>

</div>

`).join("")}

</body>
</html>
`;

await page.setContent(html);

const pdf=await page.pdf({
format:"A4",
printBackground:true
});

await browser.close();

res.set({"Content-Type":"application/pdf"});
res.send(pdf);

});

app.listen(3000);
