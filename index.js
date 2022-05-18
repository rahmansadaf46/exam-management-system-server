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
    app.post('/addStudent', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const roll = req.body.roll;
        const session = req.body.session;
        const email = req.body.email;
        const mobile = req.body.mobile;
        const department = req.body.department;
        const category = req.body.category;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        studentCollection.insertOne({ name, roll, session, email, mobile, department, image, category })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    app.delete('/delete/:id', (req, res) => {
        // console.log(req.params.id);
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

    app.post('/studentsByDept/:department', (req, res) => {
        const roll = req.params.department;
        studentCollection.find({ department: req.params.department })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })


    app.post('/addDepartment', (req, res) => {
        const file = req.files.file;
        const department = req.body.department;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        departmentCollection.insertOne({ department, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/departments', (req, res) => {
        // console.log(res)
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
        const name = req.body.name;
        const designation = req.body.designation;
        const email = req.body.email;
        const mobile = req.body.mobile;
        const department = req.body.department;
        const category = req.body.category;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

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
});


app.listen(process.env.PORT || port)