const express = require('express');
const path = require('path')
const authRouter = require('./router/auth.router');
const homeRouter=require('./router/home.router');
const adminRouter=require('./router/admin.router');
const correctorRouter=require('./router/corrector.router');
const anonymityRouter=require('./router/anonymity.router')
const candidateModel=require('./models/candidate.model');
const csv= require('csvtojson');
const mongoose=require('mongoose')
const multer=require('multer')
const body_parser=require('body-parser');
const { json } = require('express/lib/response');
const app = express();
const server=require('http').createServer(app)
const socketIo=require('socket.io')
const io=socketIo(server)
const DB_URL='mongodb://localhost:27017/doctorat-webSite';
app.get('/',body_parser.urlencoded({extended:true}),(req,res,next)=>{
    res.render('auth',{data:req.body})
})
app.use(express.static(path.join(__dirname, 'asets')))

const session=require('express-session');

const { Cookie } = require('express-session');
const SessionStore=require('connect-mongodb-session')(session);//دالة تاخض السيشن التي قمنا بتحميلها وترجع كونستراكتور

const STORE=new SessionStore({
    uri:'mongodb://localhost:27017/doctorat-webSite',//اللينك الخاص بقاعدة البيانات التي اعمل عليها
    collection:'sessions'//اسم الكولاكشن التي احفض فيها السكشنز
});

app.use(session({
    secret:'lsjdf isjfie .fs ifiehifhwofsdf,,...sdjfiosdfoe ofowje',
    saveUninitialized:false,   
    store:STORE
}))




const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./asets/uploads');
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
});

var uploads = multer({storage:storage});
mongoose.connect('mongodb://localhost:27017/doctorat-webSite',{useNewUrlParser:true})
.then(()=>console.log('connected to db'))
.catch((err)=>console.log(err))

app.use(body_parser.urlencoded({
    extended: false,
 parameterLimit: 10000,
 limit: 1024 * 1024 * 10
}));
app.use(body_parser.json({
    extended: false,
    parameterLimit: 10000,
    limit: 1024 * 1024 * 10
}));////

////


app.set('view engine', 'ejs')
app.set('views',path.join(__dirname,'views'));

app.use('/auth',authRouter)
app.use('/home',homeRouter)
app.use('/admin',adminRouter);
app.use('/corrector',correctorRouter)
app.use('/anonymity',anonymityRouter)
app.use('/home',homeRouter)
/////////////////////////
var temp ;

app.post('/',uploads.single('csv'),(req,res)=>{
 //convert csvfile to jsonArray   
    csv().fromFile(req.file.path).then((jsonObj)=>{
        for(var x=0;x<jsonObj;x++){
            temp = parseFloat(jsonObj[x].Test1)
            jsonObj[x].Test1 = temp;
            temp = parseFloat(jsonObj[x].Test2)
            jsonObj[x].Test2 = temp;
            temp = parseFloat(jsonObj[x].Test3)
            jsonObj[x].Test3 = temp;
            temp = parseFloat(jsonObj[x].Test4)
            jsonObj[x].Test4 = temp;
            temp = parseFloat(jsonObj[x].Final)
            jsonObj[x].Final = temp;
        }
        for(i=0;i<=jsonObj.length-1;i++){
            jsonObj[i]={...jsonObj[i],Note:'',Mark:''}
        }
        return jsonObj.sort((a,b)=>{
            if(a.Last_name<b.Last_name){
                return -1
            }else if(a.Last_name>b.Last_name){
                return 1
            }else{
                return 0
            }
        })
        
    }).then(jsonObj=>{
        return new Promise((resolve,reject)=>{
            mongoose.connect(DB_URL).then(()=>{
                return candidateModel.insertMany(jsonObj);
            }).then(()=>{
                mongoose.disconnect();
                res.redirect('/admin/candidates')
            }).catch(()=>{
                mongoose.disconnect();
            })
        })
    });
});



server.listen(3000,()=>{
    console.log('server listen in port 3000...')
})