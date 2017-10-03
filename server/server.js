// server.js
'use strict'

//require('dotenv').config()
// first we import our dependencies…
var express = require('express');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var bodyParser = require('body-parser');
var Comment = require('./model/comments');
var Feedback = require('./model/Feedback');
var FeedbackOptions = require('./model/FeedbackOptions');

// and create our instances
var app = express();
var router = express.Router();

// set our port to either a predetermined port number if you have set
// it up, or 3001
var port = process.env.API_PORT || 3002;

// db config
mongoose.connect(`mongodb://localhost:27017/happy_sad`);

// now we should configure the API to use bodyParser and look for
// JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// To prevent errors from Cross Origin Resource Sharing, we will set
// our headers to allow CORS with middleware like so:
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

    // and remove cacheing so we get the most recent comments
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

// now we can set the route path & initialize the API
router.get('/', function (req, res) {
    res.json({ message: 'API Initialized!' });
});

router.route('/feedback')
    .get(function (req, res) {
        //  var yesterday=(new Date().getTime()-1000 * 86400 * 1)
        var date = typeof req.query.date === "undefined" || req.query.date == null ? (new Date().getTime() - 1000 * 86400 * 1) : Number(req.query.date);
        var startDate = new Date(date);
        startDate.setSeconds(0);
        startDate.setHours(0);
        startDate.setMinutes(0);
        var endDate = new Date(date);
        endDate.setSeconds(59);
        endDate.setHours(23);
        endDate.setMinutes(59);
        var fromDate = new Date(startDate).toISOString()
        var toDate = new Date(endDate).toISOString()
        var qry = [{
            $match: { day: { $gte: new Date(fromDate), "$lte": new Date(toDate) } }
        }, {
            $group: {
                _id: { year: { $year: "$day" } },
                happy: { $sum: "$happy" },
                sad: { $sum: "$sad" }
            }
        }, {
            $project: {
                _id: 0,
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
                happy: "$happy",
                sad: "$sad"
            }
        }]

        Feedback.aggregate(qry, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            res.json(result[0])
        })

    })
    .post(function (req, res) {
        var fieldname = req.body.feedback;
        var optionId = req.body.optionId;

        var date = new Date();
        var day = new Date(date.getFullYear(),
            date.getMonth(),
            date.getDate() + 1);
        var value;
        if (fieldname.toLowerCase() == 'happy')
            value = { $inc: { happy: 1 } };
        else if (fieldname.toLowerCase() == 'sad')
            value = { $inc: { sad: 1 } };
        else if (fieldname.toLowerCase() == 'neutral')
            value = { $inc: { neutral: 1 } };
        else {
            return res.status(400).json({ 'Error': 'Invalid Feedback.' });
        }

        if (typeof optionId != 'undefined') {
            FeedbackOptions.count({ _id: optionId }, function (err, count) {
                if (typeof count == 'undefined' || count == 0) {
                    return res.status(400).json({ 'Error': 'Invalid optionId.' });
                } else {
                    addFeedback(date, optionId, value)
                    return res.status(200).json({ 'Success': 'Record Submitted Successfully.' });
                }
            });

        } else {
            addFeedback(date, optionId, value)
            return res.status(200).json({ 'Success': 'Record Submitted Successfully.' });
        }
    })

function addFeedback(date, optionId, value) {
    Feedback.update({ day: date, optionId: optionId }, value, { upsert: true }, function (err, db_res) {
        if (err) {
            throw err;
        }
    });
}

router.route('/getHistoricalResult')
    .post(function (req, res) {
        var type = req.body.type;
        var toDate = req.body.toDate;
        var fromDate = req.body.fromDate;
        var startDate = new Date(fromDate);
        startDate.setSeconds(0);
        startDate.setHours(0);
        startDate.setMinutes(0);
        var endDate = new Date(toDate);
        endDate.setSeconds(59);
        endDate.setHours(23);
        endDate.setMinutes(59);
        var qry;
        if (typeof type == 'undefined' || typeof toDate == 'undefined' || typeof fromDate == 'undefined') {
            return res.status(400).json({ 'Error': 'Required Param Missing.' })
        }
        else {
            if (type.toLowerCase() == "daily") {
                qry = [{
                    $match: {
                        day: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        }
                    }
                }, {
                    $group: {
                        _id: { year: { $year: "$day" }, month: { $month: "$day" }, day: { $dayOfMonth: "$day" } },
                        happy: { $sum: "$happy" },
                        sad: { $sum: "$sad" }
                    }
                }, { $sort: { _id: 1 } }, {
                    $project: {
                        _id: 0,
                        year: "$_id.year",
                        month: "$_id.month",
                        date: "$_id.day",
                        day: "$_id.day",
                        happy: "$happy",
                        sad: "$sad"
                    }
                }];
            }

            else if (type.toLowerCase() == "monthly") {
                qry = [{
                    $match: {
                        day: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        }
                    }
                }, {
                    $group: {
                        _id: { year: { $year: "$day" }, month: { $month: "$day" } },
                        happy: { $sum: "$happy" },
                        sad: { $sum: "$sad" }
                    }
                }, { $sort: { _id: 1 } }, { $project: { _id: 0, year: "$_id.year", month: "$_id.month", happy: "$happy", sad: "$sad" } }]

            }
            else if (type.toLowerCase() == "weekly") {
                qry = [{
                    $match: {
                        day: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        }
                    }
                }, {
                    $group: {
                        _id: { year: { $year: "$day" }, month: { $month: "$day" }, week: { $week: "$day" } },
                        happy: { $sum: "$happy" },
                        date: { $first: "$day" },
                        sad: { $sum: "$sad" }
                    }
                }, { $sort: { date: 1 } }, { $project: { _id: 0, year: "$_id.year", month: "$_id.month", week: "$_id.week", date: "$date", happy: "$happy", sad: "$sad" } }]

            }
            else {
                qry = [{
                    $match: {
                        day: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        }
                    }
                }, {
                    $group: {
                        _id: { year: { $year: "$day" } },
                        happy: { $sum: "$happy" },
                        sad: { $sum: "$sad" }
                    }
                }, { $sort: { _id: 1 } }, { $project: { _id: 0, year: "$_id.year", happy: "$happy", sad: "$sad" } }]

            }

            Feedback.aggregate(qry, function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                res.json(result)


            })
        }
    })

router.route('/hourlyData')
    .get(function (req, res) {
        var date = typeof req.query.date === "undefined" || req.query.date == null ? (new Date().getTime() - 1000 * 86400 * 1) : Number(req.query.date);
        var startDate = new Date(date);
        startDate.setSeconds(0);
        startDate.setHours(0);
        startDate.setMinutes(0);

        var endDate = new Date(date);
        endDate.setSeconds(59);
        endDate.setHours(23);
        endDate.setMinutes(59);
        var fromDate = new Date(startDate).toISOString()
        var toDate = new Date(endDate).toISOString()
        var qry = [{
            $match: {
                day: { $gte: new Date(fromDate), "$lte": new Date(toDate) }
            }
        },
        {
            "$group": {
                "_id": {
                    "$subtract": [
                        { "$subtract": ["$day", new Date("1970-01-01")] },
                        {
                            "$mod": [
                                { "$subtract": ["$day", new Date("1970-01-01")] },
                                1000 * 60 * 60
                            ]
                        }
                    ]
                },
                "happy": { "$sum": "$happy" },
                "sad": { "$sum": "$sad" }
            }
        }, { $sort: { _id: 1 } }, { $project: { _id: 0, dt: { $add: [new Date(0), "$_id"] }, day: "$_id", happy: "$happy", sad: "$sad" } }
        ]
        Feedback.aggregate(qry, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            res.json(result)
        })

    })

router.route('/feedbackOptions')
    .get(function (req, res) {
        var status =  req.query.status;
        var type = req.query.type;
        var size = req.query.size || 10;          
        if (typeof status == 'undefined' || typeof type == 'undefined') {
            return res.status(400).json({ 'Error': 'Required Param Missing.' })
        }

        if (status.toLowerCase() === "true" || status.toLowerCase() === "false") {
            FeedbackOptions.find({ isActive: status, type:{'$regex': type,$options:'i'} }, function (err, result) {
                if (err) {
                    return res.status(400).json({ 'Error': 'Oops! Something went wrong while fetching records.' });
                }
                console.log(result)
                res.json(result);
            });
        } else if (status.toLowerCase() === "all") {           
            FeedbackOptions.find({type:{'$regex': type,$options:'i'}}).limit(parseInt(size)).exec( 
               function (err, result) {
                if (err) {
                     return res.status(400).json({ 'Error': 'Oops! Something went wrong while fetching records.' });
                }
                    console.log(result)                
                    res.json(result);                
               });           
        } else {
            res.status(400).json({ 'Error': 'Invalid Status.' });
        }

    })
    .post(function (req, res) {
        var option = req.body.option;
        var type = req.body.type;
        var isActive = req.body.isActive;
        if (typeof option == 'undefined' || typeof type == 'undefined' || typeof isActive == 'undefined') {
            return res.status(400).json({ 'Error': 'Required Param Missing.' })
        }
        else {            
                FeedbackOptions.count({ type: { '$regex': type, $options: 'i' } }, function (err, records) {                    
                   if(typeof records == 'undefined' || records < 10)
                    {
                        FeedbackOptions.count({ option: { '$regex': option, $options: 'i' }, type: { '$regex': type, $options: 'i' } }, function (err, count) {
                            if (typeof count == 'undefined' || count == 0) {
                                var myobj = { option: option, type: type, isActive: isActive };
                                FeedbackOptions.insertMany(myobj, function (err, resp) {
                                    if (err)
                                        return res.status(400).json({ 'Error': 'Oops! Something went wrong while inserting record.' });
                                });

                                return res.status(200).json({ 'Success': 'Record Submitted Successfully.' });

                            } else {
                                return res.status(400).json({ 'Error': 'Record Already Exists.' });
                            }
                        
                        });
                    }else{
                        return res.status(400).json({ 'Error': 'Sorry you cannot insert more than 10 records for this type' });
                    }
            })
        }
    })
    .put(function (req, res) {
        var optionId = req.body.optionId;
        var isActive = req.body.isActive;
        if (typeof optionId == 'undefined' || typeof isActive == 'undefined') {
            return res.status(400).json({ 'Error': 'Required Param Missing.' })
        }
        else {
            FeedbackOptions.update({ _id: optionId }, { $set: { isActive: isActive } }, { upsert: false }, function (err, db_res) {
                if (err) {
                    return res.status(400).json({ 'Error': 'Oops! Something went wrong while updating the record.' });
                }

                return res.status(200).json({ 'Success': 'Record Updated Successfully.' });
            });
        }
    })
    .delete(function (req, res) {
        var optionId = req.body.optionId;
        if (typeof optionId == 'undefined') {
            return res.status(400).json({ 'Error': 'Required Param Missing.' })
        } else {           
            Feedback.update({ optionId: optionId }, { optionId: null }, { multi: true },
                function (err, resp) {
                    if (err) {
                        return res.status(400).json({ 'Error': 'Oops! Something went wrong while deleting the record.' });
                    } else {
                            FeedbackOptions.findByIdAndRemove({ _id: optionId }, function (err, resp) {
                            if (err) {
                                return res.status(400).json({ 'Error': 'Oops! Something went wrong while deleting the record.' });
                            }

                            return res.status(200).json({ 'Success': 'Record Deleted Successfully.' });
                        })
                    }
                });
        }
    })


// Use our router configuration when we call /api
app.use('/api', router);

// starts the server and listens for requests
app.listen(port, '0.0.0.0', function () {
    console.log(`api running on port ${port}`);
});
