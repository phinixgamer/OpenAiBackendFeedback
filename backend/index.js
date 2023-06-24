const { Configuration, OpenAIApi } = require("openai");
const { config } = require("dotenv");
const express = require("express");
const cors = require("cors");
const { connection } = require("./Connection/Mongooseconnection");
const { Register } = require("./Routes/register");
const app = express();
app.use(cors());

config();

app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
// Question Api for Generating Questions

app.get("/Openai/:section", async (req, res) => {
  const { section } = req.params;
  const chat_completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: `Give me 5 question of ${section} ` }],
  });
  let data = chat_completion.data.choices[0].message.content;
  let spliteddata = data.split("\n");
  res.send(spliteddata);
});

app.get("/Openai/Objective/:section", async (req, res) => {
  const { section } = req.params;
  const chat_completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Could you please provide me with 5 multiple-choice questions related to ${section}? Each question should be presented in a numbered format and be followed by 4 potential answer options labelled A, B, C, and D. In addition to this, the correct answer should be given in the line immediately following the list of options.

        For example, it might look something like this:
        
        Which of the following is a primitive data type in JavaScript?
        A) Number
        B) Array
        C) Object
        D) String
        Correct option: A) Number
        Could you please follow the same format for the rest of the questions related to ${section}?`,
      },
    ],
  });
  let data = chat_completion.data.choices[0].message.content;
  let spliteddata = data.split("\n");
  res.send(spliteddata);
});

//  Api for Generating Answer
app.post("/Openai/feedback", async (req, res) => {
  const { Question, Answer } = req.body;
  console.log(Question, Answer);
  const chat_completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Please provide your feedback on the answer to the question: '${Question}'. Answer: '${Answer}'. In 2 lines, please share your feedback. On a scale of 1 to 10 in another line using /n, how would you rate this answer? `,
      },
    ],
  });
  res.send(chat_completion.data.choices[0].message);
});

app.use("/", Register);

app.get("/", async (req, res) => {
  res.send("hello How can I help You");
});

app.listen(3000, async () => {
  try {
    await connection;
    console.log("App is connected to database");
  } catch (error) {
    console.log(error);
  }
});
