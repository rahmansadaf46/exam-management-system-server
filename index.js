const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6pkpq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('image'));
app.use(fileUpload());

const port = 5000;

app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const studentCollection = client.db("istStudentEnrollmentSystem").collection("allStudent");
    const teacherCollection = client.db("istStudentEnrollmentSystem").collection("allTeacher");
    const departmentCollection = client.db("istStudentEnrollmentSystem").collection("department");
    const adminCollection = client.db("istStudentEnrollmentSystem").collection("admin");
    const adminNameCollection = client.db("istStudentEnrollmentSystem").collection("adminName");
    const sessionCollection = client.db("istStudentEnrollmentSystem").collection("session");
    const semesterCollection = client.db("istStudentEnrollmentSystem").collection("semester");
    const questionCollection = client.db("istStudentEnrollmentSystem").collection("question");
    const resultCollection = client.db("istStudentEnrollmentSystem").collection("result");
    const resultSheetCollection = client.db("istStudentEnrollmentSystem").collection("resultSheetCollection");
    app.post('/addStudent', (req, res) => {
        const file = req.files.file;
        const image = req.files.file.name;
        const name = req.body.name;
        const roll = req.body.roll;
        const session = req.body.session;
        const email = req.body.email;
        const mobile = req.body.mobile;
        const department = req.body.department;
        const category = req.body.category;

        file.mv(`${__dirname}/image/student/${file.name}`, err => {
            if (err) {
                return res.status(500).send({ msg: 'Failed to upload Image' });
            }
        })

        studentCollection.insertOne({ name, roll, session, email, mobile, department, image, category })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    app.delete('/delete/:id', (req, res) => {
        studentCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
            })
    })

    app.get('/students', (req, res) => {
        studentCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.post('/isStudent', (req, res) => {
        const email = req.body.email;
        studentCollection.find({ email: email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/students/:id', (req, res) => {
        studentCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post('/studentsByRoll', (req, res) => {
        const roll = req.body;
        studentCollection.find({ roll: roll.roll })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.post('/studentsForExam', (req, res) => {
        const info = req.body.data;
        // console.log(info)
        studentCollection.find({ department: info.department })
            .toArray((err, documents) => {
                // res.send(documents);
                const response = documents.filter(data => data.session === info.session);
                res.send(response);
            })
    })
    app.post('/studentsByDept/:department', (req, res) => {
        const roll = req.params.department;
        studentCollection.find({ department: req.params.department })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })


    app.post('/addDepartment', (req, res) => {
        const department = req.body;
        departmentCollection.insertOne(department)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/departments', (req, res) => {
        departmentCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/addAdmin', (req, res) => {
        const admin = req.body;
        adminCollection.insertOne(admin)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    app.get('/adminList', (req, res) => {
        adminCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.delete('/deleteAdmin/:id', (req, res) => {
        adminCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
            })
    })
    app.post('/addAdminName', (req, res) => {
        const adminName = req.body;
        adminNameCollection.insertOne(adminName)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/adminName', (req, res) => {
        const email = req.body.email;
        adminNameCollection.find({ email: email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.patch('/updateStudent/:id', (req, res) => {
        studentCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: {
                    name: req.body.name, roll: req.body.roll, session
                        : req.body.session
                    , email: req.body.email, mobile: req.body.mobile, department: req.body.department
                },
            })
            .then(result => {
                res.send(result.matchedCount > 0);
            })
    })

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admins) => {
                res.send(admins.length > 0);
            })
    })

    app.post('/addSession', (req, res) => {
        const session = req.body;
        sessionCollection.insertOne(session)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    app.get('/sessions', (req, res) => {
        // console.log(res)
        sessionCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })


    app.post('/addTeacher', (req, res) => {
        const file = req.files.file;
        const image = req.files.file.name;
        const name = req.body.name;
        const designation = req.body.designation;
        const email = req.body.email;
        const mobile = req.body.mobile;
        const department = req.body.department;
        const category = req.body.category;
        file.mv(`${__dirname}/image/teacher/${file.name}`, err => {
            if (err) {
                return res.status(500).send({ msg: 'Failed to upload Image' });
            }
        })
        teacherCollection.insertOne({ name, designation, category, email, mobile, department, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    app.get('/teachers', (req, res) => {
        teacherCollection.find()
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.patch('/updateTeacher/:id', (req, res) => {
        teacherCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: req.body,
            })
            .then(result => {
                res.send(result.matchedCount > 0);
            })
    })
    app.delete('/deleteTeacher/:id', (req, res) => {
        teacherCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
            })
    })
    app.get('/teacherProfile/:id', (req, res) => {
        teacherCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })
    app.post('/isTeacher', (req, res) => {
        const email = req.body.email;
        teacherCollection.find({ email: email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })


    app.post('/addSemester', (req, res) => {
        const semester = req.body;
        semesterCollection.insertOne(semester)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    app.patch('/updateSemester/:id', (req, res) => {
        semesterCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: {
                    semester: req.body.semester, session: req.body.session, department: req.body.department, teacher: req.body.teacher, status: req.body.status
                },
            })
            .then(result => {
                res.send(result.matchedCount > 0);
            })
    })
    // app.patch('/updateSemesterTeacher/:id', (req, res) => {
    //     console.log(req.params.id)

    //     const id = req.params.id;
    //     console.log(id)
    //     semesterCollection.find({})
    //         .toArray((err, documents) => {
    //             const data = documents.filter(data => data.teacher = data.teacher.filter(person => person !== id));
    //             // const filterTeacher = teacher.filter((el) => {
    //             //     return el.teacher.some((value) => {
    //             //         return value === id;
    //             //     });
    //             // })
    //             // const filter = { teacher: filterTeacher };
    //             const updateDoc = {
    //                 $set: {
    //                     teacher: req.body,
    //                 },
    //             };
    //             const updateTeacher =(value)=> {
    //                 return {
    //                     $set: {
    //                         teacher: value,
    //                     },
    //                 };
    //             } 
    //             const bulkOps = data.map(obj => {
    //                 return {
    //                   updateOne: {
    //                     filter: {
    //                       _id: obj._id
    //                     },
    //                     // If you were using the MongoDB driver directly, you'd need to do
    //                     // `update: { $set: { field: ... } }` but mongoose adds $set for you
    //                     update: {
    //                       teacher: obj[teacher]
    //                     }
    //                   }
    //                 }
    //               })

    //               MongooseModel.bulkWrite(bulkOps).then((res) => {
    //                 console.log("Documents Updated", res.modifiedCount)
    //               })
    //             // semesterCollection.updateMany({},)
    //             //     .then(result => {
    //             //         res.send(result.matchedCount > 0);
    //             //     })

    //         })      // increment every document matching the filter with 2 more comments

    // })

    app.get('/semesters', (req, res) => {
        semesterCollection.find()
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/semester/:id', (req, res) => {
        semesterCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })
    app.get('/semesterStudent/:session/:dept', (req, res) => {
        semesterCollection.find({ session: req.params.session })
            .toArray((err, documents) => {
                const response = documents.filter(data => data.department === req.params.dept);
                res.send(response);
            })
    })
    app.post('/semesterById', (req, res) => {
        const id = req.body.id;
        semesterCollection.find({})
            .toArray((err, documents) => {
                const teacher = documents;
                const filterTeacher = teacher.filter((el) => {
                    return el.teacher.some((value) => {
                        return value === id;
                    });
                })
                res.send(filterTeacher);
            })
    })



    app.post('/addQuestion', (req, res) => {
        const question = req.body;
        // const students = req.body.students;
        questionCollection.insertOne(question)
            .then(result => {
                res.send(result.ops);
                // let ques = result.ops[0];
                // if (result.ops) {
                //     let sheet = {
                //         question: ques,
                //         students: students
                //     }
                //     resultSheetCollection.insertOne(sheet)
                //         .then(result => {
                //             res.send(result.insertedCount > 0);
                //         })
                // }

            })
    })
    app.patch('/updateQuestion/:id', (req, res) => {
        questionCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: req.body,
            })
            .then(result => {
                res.send(result.matchedCount > 0);
            })
    })
    app.delete('/deleteQuestion/:id', (req, res) => {
        // console.log(req.params.id);
        questionCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
            })
    })
    app.post('/teacherQuestion', (req, res) => {
        const email = req.body.email;
        questionCollection.find({ email: email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.get('/question/:id', (req, res) => {
        questionCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })
    app.get('/question/:id', (req, res) => {
        questionCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })
    app.post('/questionStudent', (req, res) => {
        const data = req.body;
        // console.log(data);
        questionCollection.find({ department: data.department })
            .toArray((err, documents) => {
                const filterData = documents.filter(question => question.session === data.session && question.semester === data.semester);
                let result = [];
                filterData.forEach(element => {
                    result.push({
                        _id: element._id,
                        examName: element.examName,
                        time: element.time,
                        teacherName: element.teacherName,
                        duration: element.duration
                    })
                })
                // console.log(result);
                res.send(result);
            })
    })
    app.get('/questionFind/:id', (req, res) => {
        questionCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                // console.log(documents[0])
                const question = documents[0];
                let filterQuestion = [];
                // console.log(filterQuestion)
                if (question.category === 'viva') {
                    filterQuestion = question.question.map((data) => { return Object.fromEntries(Object.entries(data).filter(([key, value]) => key !== 'hostLink')) })
                    question.question = filterQuestion;
                }

                else if (question.category === 'mcq') {
                    filterQuestion = question.question.map((data) => { return Object.fromEntries(Object.entries(data).filter(([key, value]) => key !== 'rightAnswer')) })
                    question.question = filterQuestion;
                }

                const endTime = new Date((new Date(question.time).getTime() - 1) + question.duration * 60000);
                const validDate = new Date() > new Date(question.time) && new Date() < new Date(endTime);
                // console.log(validDate, new Date(endTime));
                if (validDate) {
                    res.send({
                        validation: true,
                        question: question
                    });
                }
                else {
                    res.send({
                        validation: false
                    });
                }

            })
    })
    app.post('/addResult2', (req, res) => {

        const file = req.files.file;
        const doc = req.files.file.name;
        const obtainedMark = parseInt(req.body.obtainedMark);
        const totalMark = parseInt(req.body.totalMark);
        const status = req.body.status;
        const studentRoll = req.body.studentRoll;
        const studentName = req.body.studentName;
        const questionId = req.body.questionId;
        const examName = req.body.examName;
        const category = req.body.category;
        const teacherName = req.body.teacherName;
        const teacherEmail = req.body.teacherEmail;
        const time = req.body.time;
        const duration = req.body.duration;
        const semester = req.body.semester;
        const department = req.body.department;
        const session = req.body.session;
        const totalQuestion = req.body.totalQuestion;
        const studentEmail = req.body.studentEmail;

        const assignmentDetails = req.body.assignmentDetails;
        const assignmentCategory = req.body.assignmentCategory;
        file.mv(`${__dirname}/image/files/${file.name}`, err => {
            if (err) {
                return res.status(500).send({ msg: 'Failed to upload Image' });
            }
        })
        resultCollection.insertOne({ studentName, answerData:{
            answer: [{
                answer: doc,
                category: assignmentCategory,
                assignmentDetails: assignmentDetails
            }]
        },  totalMark, obtainedMark, questionId, studentRoll, status, studentEmail, totalQuestion, session, department, semester, duration, time, teacherEmail, teacherName, category, examName })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/addResult1', (req, res) => {
        const questionData = req.body.question;
        const answer = req.body.answer;
        const student = req.body.student;

        questionCollection.find({ _id: ObjectId(questionData._id) })
            .toArray((err, documents) => {
                const question = documents[0].question;
                if (questionData.category === 'mcq') {
                    let rightAnswer = [];
                    answer.forEach(ans => {
                        // console.log(data)
                        question.forEach(ques => {
                            if (ques.questionName === ans.questionName) {
                                if (ans.category === 'mcq') {
                                    if (ques.rightAnswer === ans.answer) {
                                        rightAnswer.push({
                                            questionNumber: ques.questionNumber,
                                            category: ques.category,
                                            questionName: ques.questionName,
                                            answer1: ques.answer1,
                                            answer2: ques.answer2,
                                            answer3: ques.answer3,
                                            answer4: ques.answer4,
                                            rightAnswer: ques.rightAnswer,
                                            mark: parseInt(ques.mark),
                                            obtainedMark: parseInt(ques.mark),
                                            givenAnswer: ans.answer,
                                            answer: 'Right'
                                        })
                                    }
                                    else {
                                        rightAnswer.push({
                                            questionNumber: ques.questionNumber,
                                            category: ques.category,
                                            questionName: ques.questionName,
                                            answer1: ques.answer1,
                                            answer2: ques.answer2,
                                            answer3: ques.answer3,
                                            answer4: ques.answer4,
                                            rightAnswer: ques.rightAnswer,
                                            mark: parseInt(ques.mark),
                                            obtainedMark: parseInt(0),
                                            givenAnswer: ans.answer,
                                            answer: 'Wrong'
                                        })
                                    }
                                }
                                else if (ans.category === 'fillInTheGaps') {
                                    if (ques.rightAnswer.toLowerCase() === ans.answer.toLowerCase()) {
                                        rightAnswer.push({
                                            questionNumber: ques.questionNumber,
                                            category: ques.category,
                                            questionName: ques.questionName,
                                            rightAnswer: ques.rightAnswer,
                                            mark: parseInt(ques.mark),
                                            obtainedMark: parseInt(ques.mark),
                                            givenAnswer: ans.answer,
                                            answer: 'Right'
                                        })
                                    }
                                    else {
                                        rightAnswer.push({
                                            questionNumber: ques.questionNumber,
                                            category: ques.category,
                                            questionName: ques.questionName,
                                            rightAnswer: ques.rightAnswer,
                                            mark: parseInt(ques.mark),
                                            obtainedMark: parseInt(0),
                                            givenAnswer: ans.answer,
                                            answer: 'Wrong'
                                        })
                                    }
                                }

                            }


                        })
                    })
                    let notAnswer = question.filter(function (objOne) {
                        return !rightAnswer.some(function (objTwo) {
                            return objOne.questionName === objTwo.questionName;
                        });
                    })
                    let obtainedMark = [];
                    rightAnswer.forEach(ans => {
                        if (ans.answer === 'Right') {
                            obtainedMark.push(ans.mark);
                        }
                    })
                    let fullMark = [];
                    question.forEach(ques => {
                        fullMark.push(parseInt(ques.mark))
                    })
                    // console.log(rightAnswer, notAnswer, obtainedMark.reduce((a, b) => a + b, 0), fullMark.reduce((a, b) => a + b, 0))

                    let dataBody = {
                        questionId: questionData._id,
                        examName: questionData.examName,
                        category: questionData.category,
                        teacherName: questionData.teacherName,
                        teacherEmail: questionData.email,
                        time: questionData.time,
                        duration: questionData.duration,
                        semester: questionData.semester,
                        department: questionData.department,
                        session: questionData.session,
                        totalQuestion: questionData.totalQuestion,
                        studentEmail: student[0].email,
                        studentName: student[0].name,
                        studentRoll: student[0].roll,
                        totalMark: fullMark.reduce((a, b) => a + b, 0),
                        obtainedMark: obtainedMark.reduce((a, b) => a + b, 0),
                        answerData: {
                            answer: rightAnswer,
                            notAnswer: notAnswer
                        }
                    }
                    // console.log(dataBody);
                    resultCollection.insertOne(dataBody)
                        .then(result => {
                            res.send(result.ops);
                        })
                }
                else if (questionData.category === 'written') {
                    let givenAnswer = [];
                    answer.forEach(ans => {
                        // console.log(data)
                        givenAnswer.push({
                            questionNumber: ans.questionNumber,
                            category: ans.category,
                            questionName: ans.questionName,
                            givenAnswer: ans.answer,
                            mark: parseInt(ans.mark),
                            obtainedMark: parseInt(0),
                            status: 'Not Checked'
                        })
                    })
                    let notAnswer = question.filter(function (objOne) {
                        return !givenAnswer.some(function (objTwo) {
                            return objOne.questionName === objTwo.questionName;
                        });
                    })
                    let fullMark = [];
                    question.forEach(ques => {
                        fullMark.push(parseInt(ques.mark))
                    })
                    let dataBody = {
                        questionId: questionData._id,
                        examName: questionData.examName,
                        category: questionData.category,
                        teacherName: questionData.teacherName,
                        teacherEmail: questionData.email,
                        time: questionData.time,
                        duration: questionData.duration,
                        semester: questionData.semester,
                        department: questionData.department,
                        session: questionData.session,
                        totalQuestion: questionData.totalQuestion,
                        studentEmail: student[0].email,
                        studentName: student[0].name,
                        studentRoll: student[0].roll,
                        status: 'Not Checked',
                        totalMark: fullMark.reduce((a, b) => a + b, 0),
                        obtainedMark: parseInt(0),
                        answerData: {
                            answer: givenAnswer,
                            notAnswer: notAnswer
                        }
                    }
                    // console.log(dataBody)
                    resultCollection.insertOne(dataBody)
                        .then(result => {
                            res.send(result.ops);
                        })
                }
                else if (questionData.category === 'viva') {



                    let dataBody = {
                        questionId: questionData._id,
                        examName: questionData.examName,
                        category: questionData.category,
                        teacherName: questionData.teacherName,
                        teacherEmail: questionData.email,
                        time: questionData.time,
                        duration: questionData.duration,
                        semester: questionData.semester,
                        department: questionData.department,
                        session: questionData.session,
                        totalQuestion: questionData.totalQuestion,
                        studentEmail: student[0].email,
                        studentName: student[0].name,
                        studentRoll: student[0].roll,
                        status: 'Not Checked',
                        totalMark: answer.mark,
                        obtainedMark: parseInt(0),
                        answerData: {
                            answer: answer,
                            // notAnswer: notAnswer
                        }
                    }
                    // console.log(dataBody)
                    resultCollection.insertOne(dataBody)
                        .then(result => {
                            res.send(result.ops);
                        })
                }
                else if (questionData.category === 'assignment') {
                    let dataBody = {
                        questionId: questionData._id,
                        examName: questionData.examName,
                        category: questionData.category,
                        teacherName: questionData.teacherName,
                        teacherEmail: questionData.email,
                        time: questionData.time,
                        duration: questionData.duration,
                        semester: questionData.semester,
                        department: questionData.department,
                        session: questionData.session,
                        totalQuestion: questionData.totalQuestion,
                        studentEmail: student[0].email,
                        studentName: student[0].name,
                        studentRoll: student[0].roll,
                        status: 'Not Checked',
                        totalMark: answer[0].mark,
                        obtainedMark: parseInt(0),
                        answerData: {
                            answer: answer,
                            // notAnswer: notAnswer
                        }
                    }
                    // console.log(dataBody)
                    resultCollection.insertOne(dataBody)
                        .then(result => {
                            res.send(result.ops);
                        })
                }
            })
    })
    app.patch('/updateResult/:id', (req, res) => {
        resultCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: {
                    answerData: req.body.answerData, obtainedMark: req.body.obtainedMark, status: req.body.status,
                }
            })
            .then(result => {
                res.send(result.matchedCount > 0);
            })
    })
    // app.patch('/updateResult/:id', (req, res) => {
    //     resultCollection.updateOne({ _id: ObjectId(req.params.id) },
    //         {
    //             $set: req.body,
    //         })
    //         .then(result => {
    //             res.send(result.matchedCount > 0);
    //         })
    // })
    app.post('/resultFind', (req, res) => {
        const id = req.body.questionId;
        resultCollection.find({ questionId: id })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.get('/resultDetails/:id', (req, res) => {

        resultCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    // app.get('/resultViva/:quesId/:email', (req, res) => {

    //     resultCollection.find({ _id: ObjectId(req.params.id) })
    //         .toArray((err, documents) => {
    //             res.send(documents[0]);
    //         })
    // })
    app.post('/resultViva', (req, res) => {
        const email = req.body.email;
        const questionId = req.body.questionId;
        resultCollection.find({ questionId: questionId })
            .toArray((err, documents) => {
                let filterData = documents.filter(data => data.studentEmail === email);
                res.send(filterData.length > 0);
            })
    })

    app.post('/resultStudent', (req, res) => {
        const studentEmail = req.body.studentEmail;
        resultCollection.find({ studentEmail: studentEmail })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
});


app.listen(process.env.PORT || port)