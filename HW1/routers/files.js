const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const app = express();

const urlencodedParser= bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();

const fs = require('fs');
const fsPromises = fs.promises;

const dir = './files';
const filesFolder = './files/';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

router.get('/files', (req, res, next) => {
    fs.readdir(filesFolder, (err, files) => {
        if (req.statusCode = 200){
          res.send(
            {
            "message": "Success",
            "files": files
            }
          )
        }
        else if (req.statusCode = 400){
          res.send(
            {
              "message": "Client error"
            }
          )
        }
        else if (req.statusCode = 500){
          res.send(
            {
              "message": "Server error"
            }
          )
        }
    })

})


router.get('/files/:filename', async (req, res) => {
    const filename = req.params.filename;
    const regEx = /\.(log|txt|yaml|log|json|js)$/i;
    const extension =  regEx.test(filename);

    if (!extension) {
        res.status(400).send({ "message": "Please specify file extension with log, txt, json, yaml, xml and js" });
        return;
    }

    try {
        const data = await fsPromises.readFile(`${dir}/${filename}`, 'utf8');
        const info = await fsPromises.stat(`${dir}/${filename}`);
        res.status(200).send({
            message: 'Success',
            filename: filename,
            content: data,
            extension: extension,
            uploadedDate: info.birthtime
        })
    } catch (err) {
        res.status(500).send({ "message": "Server error" })
    }
       
});

router.post('/files', urlencodedParser, jsonParser, async (req, res) => {
    const filename = req.body.filename;
    const content = JSON.stringify(req.body.content);
    const regEx = /\.(log|txt|yaml|log|json|js)$/i;
    const extension =  regEx.test(filename);

    try {
        await fs.writeFile(`./files/${filename}`,content, function (err) {
            if (err) throw err;
            return res.status(200).send({
              "message": "File created successfully"
            });
          })
    } catch (error) {
        if (!extension) {
            return res.status(400).send({
                "message": "Please specify file extension with log, txt, json, yaml, xml and js"
            })
        } else if (!content || !filename) {
            return res.status(400).send({
                "message": "Please specify 'content' parameter"
            })
        } else {
            return res.status(500).send({
                "message": "Server error"
              })
        }
    }

})
 
router.put('/files/:filename/edit', urlencodedParser, jsonParser, async (req, res) => {
    let filename = req.params.filename;
    let newContent = JSON.stringify(req.body.content);

    try {
        await fs.writeFile(`./files/${filename}`, newContent, {flag: 'w+'}, () => {
            res.status(200).send({
                "message": "File edited successfully"
            })
        })
    } catch (error) {
        res.status(500).send({
            "message": "File failed to edit"
        })
    }

})

router.delete('/files/:filename/delete', async (req, res) => {
    const filename = req.params.filename;
    const filePath = `./files/${filename}`;

    try {
        await fs.unlink(filePath, () => {
            res.status(200).send({
                "message" : "Delete successfully"
            })
        })
    } catch (error) {
        res.status(500).send({
            "message": "Can not delete the file"
        })
    }
})


module.exports = router;

