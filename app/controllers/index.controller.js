const { temp_rtc } = require('../models/temp_rtc.model');

var render=(req,res)=>{
    temp_rtc.find({},(err,data)=>{
	    if(!err)res.render('index',{tempData: data});
    });
}

var addData=(req,res)=>{
    var r=temp_rtc.insertMany(req.body);
    res.json(r)
}

var getData=(req,res)=>{
    temp_rtc.find({},(err,data)=>{
        if(!err){
            let detail=new Array();
            let average=new Array();
	    let tmp={};
            data.forEach((item,index)=>{
                let dt=new Date(item.year, (item.month-1), item.day, item.hour, item.minute);
                detail.push({'dateTime':dt, 'temperature':item.temperature, 'humidity':item.humidity});
            });
            detail.forEach((item,index)=>{
		let obj=tmp[item.dateTime.getDate()+'/'+item.dateTime.getMonth()+'/'+item.dateTime.getFullYear()]=tmp[item.dateTime.getDate()+'/'+item.dateTime.getMonth()+'/'+item.dateTime.getFullYear()]||{count:0, totalTemperature:0, totalHumidity:0};
		obj.count++;
		obj.totalTemperature+=item.temperature;
		obj.totalHumidity+=item.humidity;
            });
	    let result=Object.entries(tmp).map(function(entry){
		return {date: entry[0], temperature: entry[1].totalTemperature/entry[1].count, humidity: entry[1].totalHumidity/entry[1].count};
	    });
            res.json(result);
        }
    })
}

module.exports={
    render,
    addData,
    getData
}


