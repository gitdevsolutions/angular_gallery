const server = require('../server.js');
const http = require('http');
const appBuilder = require('../app.js');
const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const low = require('lowdb');
const pathToSystemJson = path.join(__dirname, 'db', 'system.json');
const pathToCandiadatesJson = path.join(__dirname, 'db', 'candidates.json');
const pathToQuestionsJson = path.join(__dirname, 'db', 'questions.json');
const appOptions = {
    distDir: path.join(__dirname, '..', '..', 'dist'),
    adminPath: "/wieksdlk52423rf/",
    candidatesDb: low(),
    questionsDb: low(),
    systemDb: low(),
}
const serverSetup = {
    httpPort: 3000
};

xdescribe('Academy app', function () {
    beforeAll((done) => {
        readJSON(readFileToString(pathToQuestionsJson)).then((json) => {
            appOptions.questionsDb.defaults(json).write();
            return readJSON(readFileToString(pathToCandiadatesJson));
        }).then((json) => {
            appOptions.candidatesDb.defaults(json).write();
            return readJSON(readFileToString(pathToSystemJson));
        }).then((json) => {
            appOptions.systemDb.defaults(json).write();
            const app = appBuilder(appOptions);
            server(serverSetup, app);
            done();
        }).catch(done.fail);
    });
    it('serves redirect to appOptions.redirectUrl on /', function (done) {
        readUrl('/').then((response) => {
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe(appOptions.redirectUrl);
            done();
        });
    });
    it('serves redirect on /[nonexistent candidate id]', function (done) {
        readUrl('/sdfgfsgadsfgsfdgsdfgsdfgsffg').then((response) => {
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe(appOptions.redirectUrl);
            done();
        });
    });
    it('serves quiz on /test/', function (done) {
        readUrl('/test/').then((response) => {
            expect(response.rawData).toContain('<html');
            done();
        }).catch(done.fail);
    });
    it('disables and reenables the quiz', function (done) {
        readUrl('/test/').then((response) => {
            expect(response.statusCode).toBe(200);
            return readUrl(appOptions.adminPath + 'disable');
        }).then((response) => {
            expect(response.rawData).toContain('disabled');
            let systemJson = appOptions.systemDb.get('system').value();
            expect(systemJson.status).toBe('disabled');
            return readUrl('/test/');
        }).then((response) => {
            expect(response.statusCode).toBe(302);
            return readUrl(appOptions.adminPath + 'enable');
        }).then((response) => {
            expect(response.rawData).toContain('enabled');
            done();
        }).catch((error) => {
            done.fail(error);
        })
    });
    it('saves a candidate using his email address', (done) => {
        readUrl(appOptions.adminPath + 'test2@gmail.com').then((response) => {
            let newCandidate = appOptions.candidatesDb.get('candidates').find({email : 'test2@gmail.com'}).value();
            expect(newCandidate).toBeDefined();
            expect(response.rawData).toContain(appOptions.baseUrl + newCandidate.id);
            done();
        }).catch(done.fail);
    });
    it('prints error message when admin gets malformed email address', (done) => {
        const malformedEmail = 'aaa@bbb';
        readUrl(appOptions.adminPath + malformedEmail).then((response) => {
            expect(response.rawData).toBe(malformedEmail + ' is not a valid email');
            done();
        });
    });
    it('accepts proper email address', (done) => {
        const malformedEmail = 'test@test.com';
        readUrl(appOptions.adminPath + malformedEmail).then((response) => {
            expect(response.rawData).toContain(appOptions.baseUrl);
            done();
        });
    });
    it('sends questions to the client', (done) => {
        readJSON(readUrlToString('/test/questions')).then((questionsJson) => {
            expect(questionsJson.questions.length).toBe(10);
            done();
        }).catch(done.fail);
    });
    it('doesn\'t send proper/wrong answer indicators to the client', (done) => {
        readJSON(readUrlToString('/test/questions')).then((questionsJson) => {
            questionsJson.questions.forEach((question) => {
                question.answers.forEach((answer) => {
                    expect(answer.wrong).toBeUndefined();
                });
            });
            done();
        }).catch(done.fail);
    });
    it('saves answers', (done) => {
        readJSON(readFileToString(pathToQuestionsJson)).then((questionsJson) => {
            postToUrl('/test/answers', JSON.stringify(questionsJson.questions)).then((response) => {
                expect(response.statusCode).toBe(200);
                let testCandidate = appOptions.candidatesDb.get("candidates").find({ id: 'test' }).value();
                expect(testCandidate.questions).toBeDefined();
                expect(testCandidate.questions[0].answers[0]).toBeDefined();
                done();
            }).catch((error) => {
                done.fail(error);
            });
        }).catch(done.fail);
    });
});

function readJSON(dataProviderPromise) {
    return new Promise((resolve, reject) => {
        dataProviderPromise.then((fileContent) => {
            try {
                resolve(JSON.parse(fileContent));
            } catch (parseError) {
                reject(parseError);
            }
        }).catch((fileReadError) => {
            reject(fileReadError);
        });
    });
}

function readFileToString(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
            };
            resolve(data);
        });
    })
}

function readUrlToString(url) {
    return new Promise((resolve, reject) => {
        readUrl(url).then((response) => {
            resolve(response.rawData);
        }).catch(reject);
    });
}

function postToUrl(url, postData) {
    const options = getHttpOptions(url);
    options.method = 'POST';
    options.headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    };
    return readUrlWithOptions(options, postData);
}

function readUrl(url) {
    const options = getHttpOptions(url);
    return readUrlWithOptions(options);
}

function readUrlWithOptions(options, requestData) {
    return new Promise((resolve, reject) => {
        try {
            const req = http.request(options, (res) => {
                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => {
                    rawData += chunk;
                });
                res.on('end', () => {
                    res.rawData = rawData;
                    resolve(res);
                });
            });
            if (requestData) {
                req.write(requestData);
            }
            req.end();
        } catch (error) {
            reject(error);
        }
    })
}

function getHttpOptions(url) {
    return {
        hostname: 'localhost',
        port: 3000,
        path: url,
        method: 'GET'
    }
}
