const mongoose=require('mongoose');

async function connecttoMongoDB(URL){
    return mongoose.connect(URL);
}

module.exports={
    connecttoMongoDB
}