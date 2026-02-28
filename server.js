const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
app.use(express.json());

app.post("/generate-pdf", async (req,res)=>{

const {title,userCode,questions}=req.body;

const browser=await puppeteer.launch({
args:["--no-sandbox","--disable-setuid-sandbox"]
});

const page=await browser.newPage();

const html = `
<h1>ATP - ${title}</h1>
<h3>User: ${userCode}</h3>
${questions.map((q,i)=>
`<p>${i+1}) ${q.question}<br>
<b>${q.answer}</b></p>`
).join("")}
`;

await page.setContent(html);

const pdf=await page.pdf({format:"A4"});

await browser.close();

res.set({"Content-Type":"application/pdf"});
res.send(pdf);

});

app.listen(3000,()=>{
console.log("Running...");
});
