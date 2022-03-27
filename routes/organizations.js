const express = require("express")
const router = express.Router()
const db = require('../firebase')
const {FieldValue} = require('firebase-admin/firestore')
const { v4: uuidv4 } = require('uuid');


router.get('/', (req, res) => {
    const orgs = [];
    const orgsRef = db.collection('organizations');
    orgsRef.get()
    .then(snapshot => {
        snapshot.forEach(org => {
            item = org.data();
            item.id = org.id;
            orgs.push(item)
        })
    })
    .then(() => {
        res.render('organizations', {orgs});
    })
})

router.get('/create', (req, res) => {
    res.render('create');
})

router.post('/create', (req, res) => {
    const orgData = {
        name: req.body.name,
        state: req.body.state
    }
    const orgsRef = db.collection('organizations');
    orgsRef.doc(uuidv4()).set(orgData)
    .then(() => {
        res.redirect('/organizations')
    })
})

router.get('/:id', (req, res) => {
    let org = null;
    let activities = [];
    const id = req.params.id;
    const orgRef = db.collection('organizations').doc(id);
    orgRef.get()
    .then(snapshot => {
        if(!snapshot.exists){
            res.redirect('/organizations')
        } else {
            item = snapshot.data();
            item.id = snapshot.id;
            org = item;
        }
    })
    .then(() => {
        res.render('organization', {org: org, orgId: id})
    })
})

router.get('/:orgId/:activityId', (req, res) => {
    let org = null;
    let activity = null;
    const id = req.params.orgId;
    const orgRef = db.collection('organizations').doc(id);
    orgRef.get()
    .then(snapshot => {
        if(!snapshot.exists){
            res.redirect('/organizations')
        } else {
            item = snapshot.data();
            item.id = snapshot.id;
            org = item;
            org.activities.forEach(a => {
                if(a.id == req.params.activityId){
                    activity = a;
                }
            })
        }
    })
    .then(() => {
        res.render('activity', {activity})
    })
    
})

router.post('/:id/create', (req, res) => {
    const activityId = uuidv4();
    const activityData = {
        name: req.body.title,
        address: req.body.address,
        time: req.body.time,
        id: activityId
    }
    const orgsRef = db.collection('organizations');
    orgsRef.doc(req.params.id).update({
        activities: FieldValue.arrayUnion(activityData)
    })
    .then(() => {
        res.redirect(`/organizations/${req.params.id}`)
    })
})

module.exports = router;