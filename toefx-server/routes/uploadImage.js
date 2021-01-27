const express = require('express');
const uploadImage = express.Router();
const utils = require('../utils');
let toeData = require('../database/toe-dataSchema');

var fs = require('fs');
const { resolve } = require('path');

//TODO: Saving new image as last in array could cause bugs and overwrite old images after deletion.


/*
    Saves the toe data in the Database.
    param userId: The user's id in the database (whom the toe data is for).
    param date: The date to be submitted as the image's date.
    param footIndex: 0 or 1 referring to left and right foot respectively.
    param toeIndex: 0 to 4 referring to the toes.["Big Toe", "Index Toe", "Middle Toe", "Fourth Toe", "Little Toe"]
    param imageName: The name of the image to be saved in DB. Must be the saved as the image's actual name.
*/
function SaveToeData(userId, date, footIndex, toeIndex, imageName) {
    //Find the user's images in the database and add to them
    //User slot is automatically created on sign-up
    toeData.findOne({userID: userId}, (err, item) => {
        if (item) {
            item.feet[footIndex].toes[toeIndex].images.push({
                date: date,
                name: imageName,
                fungalCoverage: '20%' //Temp data for now
            })

            item.save();
        }        
    });
}

/*
    Prints an error message upon a failed image move.
    param error: The error to be printed.
*/
function PrintImageMovementError(error) {
    console.log("Error while attempting to move the image:");
    console.log(error);
}

/*
    Moves the uploaded image to the user's folder in /images
    param image: The image file.
    param userId: The user's id. Also same as the folder name (/images/$userId).
    param imageName: The name of the image to moved.
    returns A promise. Resolved if image is successfully saved.
*/
function moveImageToUserImages(image, userId, imageName) {
    return new Promise((resolve, reject) => {
        try {
            image.mv(`./images/${userId}/${imageName}`, (err) => { //The move image command
                if (err) {
                    PrintImageMovementError(err);
                    reject();
                }
                else {
                    resolve();
                }
            });
        }
        catch(e) {
            PrintImageMovementError(e);
        }
    });
}

/*
    Creates folder /tempImages and stores the uploaded image.
    This is only used for user's who are not logged in.
    Param image: the image file.
    Param ImageName: the name of the image to move.
    returns A promise. Resolved if image is successfully saved.
*/
function moveImageToTempFolder(image, imageName) {
    return new Promise((resolve, reject) => {
        try {
            //Create a temp folder if it doesnt already exist
            if (!fs.existsSync('./tempImages'))
                fs.mkdirSync('./tempImages');

            image.mv(`./tempImages/${imageName}`, (err) => { //The move image command
                if (err) {
                    PrintImageMovementError(error);
                    reject();
                }
                else {
                    resolve();
                }
            });
        }
        catch (e) {
            PrintImageMovementError(e);
        }
    });
}

/*
    Parses an image extension from an image name.
    param image: The image whose name is to be parsed.
    returns: The image extension (.png, .jpg, etc.).
*/
function GetImageExtension(image) {
    var partsOfImageName = image.name.split(".");
    var extension = partsOfImageName[partsOfImageName.length - 1];
    return extension;
}

/*
    Endpoint: /uploadImage/loggedin
    Saves the uploaded toe image in the database and moves the image to the user's folder in /images.
    param req: The request object containing:
        files.file: The image to upload.
        body.foot: The foot index the image is for, 0 or 1.
        body.toe: The toe index the image is for, 0 to 4.
    param res: The object to store and send the result in.
    returns: The reponse being an object {msg: uploaded} for success.
*/
uploadImage.route('/loggedin').post(async (req, res) => {
    const image = req.files.file;
    var userObject = await utils.loadUserObject(req, res);
    var user = userObject.user;
    var userId = userObject.id;
    var extension = GetImageExtension(image); //Used in the image name later

    //user.images.length is the number of images the user has uploaded
    //This gives each new image a unique number
    //BUG: Deleting some images can overwrite old images
    const imageName = user.images.length + "." + extension;

    //Save the new image under user
    user.images.push(imageName);
    user.save()

    //Prep the data to be saved in the toe-data collection 
    var date = new Date(); //Use the current date as the image's date
    var datetoString = date.toString();
    var footIndex = parseInt(req.body.foot)
    var toeIndex = parseInt(req.body.toe);

    //Save the data itself
    SaveToeData(userId, datetoString, footIndex, toeIndex, imageName)

    //Move it to the database
    moveImageToUserImages(image, userId, imageName).then(() => {
        res.send({msg: "uploaded"})
    }).catch(() => res.status(500).send({msg: "Error occured"}));
})

/*
    Endpoint: /uploadImage/notloggedin
    Saves the uploaded image to a temp folder when the user is not logged in.
        Eventually it will delete the image after the fungal coverage percentage is calculated (not implemented yet).
    param req: The request object containing:
        files.file: The image to upload.
    param res: The object to store and send the result in.
    returns as the response: msg: "uploaded" and img: the name of the saved image
*/
uploadImage.route('/notloggedin').post(async (req, res) => {
    const image = req.files.file;
    var extension = GetImageExtension(image);
    var timeInMs = new Date().getTime()

    //Image name is the time in milisonds and it is going to be stored in the tempImages folder.
    const imageName = timeInMs + "." + extension;

    //Move it to a temp folder for later
    moveImageToTempFolder(image, imageName).then(() => {
        res.send({msg: "uploaded", img: imageName})
    }).catch(() => res.status(500).send({ msg: "Error occured" }));
})

module.exports = uploadImage;