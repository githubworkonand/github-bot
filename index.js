const jsonfile = require('jsonfile');
const moment = require('moment');
const simpleGit = require('simple-git');
const random = require('random');
const inq = require('inquirer');
const FILE_PATH = './data.json';

const questions = [
    {
        name: 'startDate',
        type: 'input',
        message: 'Enter the start date you want to commit from(2010-01-01):',
        validate: function(value) {
            if (value.length) {
                return true
            }
            else {
                return 'Please enter the start date.';
            }
        }
    }
];

const makeCommit = (curMoment, endMoment) => {
    if (curMoment.isAfter(endMoment)) {
        console.log("Pushed...");
        return simpleGit().push();
    }
    const DATE = curMoment.format();
    const data = {
        date: DATE
    };
    jsonfile.writeFile(FILE_PATH, data, () => {
        simpleGit()
            .add([FILE_PATH])
            .commit(
                DATE, {'--date': DATE},
                makeCommit.bind(this, curMoment = curMoment.add(random.int(0, 6), 'd'), endMoment));
    });
}

const run = async () => {
    
    const res = await inq.prompt(questions);
    
    const startDate = res.startDate;
    
    const startYear = parseInt(startDate.split('-')[0]);
    const startMonth = parseInt(startDate.split('-')[1]) - 1;
    const startDay = parseInt(startDate.split('-')[2]);
    
    const startMoment = moment().set({
        'y': startYear,
        'M': startMonth,
        'D': startDay,
        'h': 0,
        'm': 1,
        's': 39,
        'ms': 25
    });

    let curMoment = startMoment;
    const endMoment = moment();
    
    makeCommit(curMoment, endMoment);
}

run();