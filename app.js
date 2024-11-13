const express=require ('express')
const app = express();
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
// Setting up the config.env file variables
dotenv.config({path:'./config/config.env'});
const ErrorHandler=require('./utils/errorHandlers.js');

//importing the database connection
const connectiontodb=require('./config/database.js');

const errormiddleware= require('./middlewares/error.js');

// handling Uncaught Exception
process.on('uncaughtException',err =>{
    console.log(`Error:${err.message}`);
    console.log('Shutting down the server due to uncaught promise rejection')
        process.exit(1);
})


        connectiontodb();
        app.use(express.json());
        
        // use Cookie Parser
        app.use(cookieParser());
        
        // /importing all the routes
        
        const auth =require('./Routes/auth.js');
        const user =require('./Routes/user.js');
        app.use('/api/v1',auth);
        app.use('/api/v1',user);
         //  handling unnhandled routes
        try{app.all ('*',(req,res,next)=>{
            next(new ErrorHandler(`${req.originalUrl} route not found `, 404));
        });}
        catch(err){
            console.log("error: ", err);
        }
        
        
        app.use(errormiddleware);
        const port=process.env.PORT;
        const server = app.listen(port,()=>{
            console.log(`Server is running on port ${process.env.PORT} and in ${process.env.NODE_ENV} mode`);
        }) ;       
        

// Handling unhandled Promise Rejection 
// like any erro .env ffile
process.on('unhandledRejection', err =>{
    // @ts-ignore
    console.log(`Error:${ err .message}`);
    console.log('Shutting down the server due to handled promise rejection')
    server.close(()=>{
        process.exit(1);
    })

});