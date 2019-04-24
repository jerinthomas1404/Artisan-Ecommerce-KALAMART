const brain = require("brain.js");
const network = new brain.NeuralNetwork();
network.train({
    input: {"title" : "Mustard Coloured Paithani"},
    output: {"category" : "sarees"}
},
{
    input: {"title" : "Jaipur Blue Pottery"},
    output: {"category" : "teaset"}
},
{
    input: {"title" : "Tribal Red Matrix"},
    output: {"category" : "jewellery"}
},
{
    input: {"title" : "Tea N Saucer"},
    output: {"category" : "teaset"}
},
{
    input: {"title" : "Tea Pot with Cups"},
    output: {"category" : "teaset"}
},
{
    input: {"title" : "Chai Time"},
    output: {"category" : "teaset"}
},
{
    input: {"title" : "Shiv Tandav"},
    output: {"category" : "painting"}
},
{
    input: {"title" : "Shiv Tandav"},
    output: {"category" : "painting"}
},
{
    input: {"title" : "Great Buddha"},
    output: {"category" : "painting"}
},
{
    input: {"title" : "Lord Ganesha"},
    output: {"category" : "painting"}
},
{
    input: {"title" : "Chandraswaroopa"},
    output: {"category" : "jewellery"}
},
{
    input: {"title" : "Shehjaar"},
    output: {"category" : "shawls"}
},
{
    input: {"title" : "Shabnam"},
    output: {"category" : "shawls"},
},
{
    input: {"title" : "Blossoms Of The Desert"},
    output: {"category" : "sarees"},
},
{
    input: {"title" : "Chandani Maheshwari Sarees"},
    output: {"category" : "sarees"},
},
{
    input: {"title" : "Talika"},
    output: {"category" : "home"},
},
{
    input: {"title" : "Sheesh-Mahal Collection"},
    output: {"category" : "home"},
},
{
    input: {"title" : "Blue Anmol Anguthi"},
    output: {"category" : "jewellery"},
},
{
    input: {"title" : "Aditya Mangalam"},
    output: {"category" : "sarees"},
},
{
    input: {"title" : "Radha Krishna Swinging Lampshade"},
    output: {"category" : "home"},
},
{
    input: {"title" : "Aam Ras"},
    output: {"category" : "sarees"}
}
);

const output = network.run("Chai");
console.log(`Category: ${JSON.stringify(output)}`);