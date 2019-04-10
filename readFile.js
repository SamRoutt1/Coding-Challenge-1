module.exports = {

    parseFile: function () {
        var fs = require('fs');
        var readline = require('readline');
        var stream = require('stream');

        var instream = fs.createReadStream('./data/PartD_Prescriber_PUF_NPI_Drug_16.txt');
        var outstream = new stream;
        var rl = readline.createInterface(instream, outstream);

        records = 0
        var start = new Date();
        rl.on('line', (line) => {
            //parse line
            //console.log(line);
            records ++;
        });

        rl.on('close', () => {
            //do something
            console.log('finish reading');
            var end = new Date() - start;
            console.log('Read time: %dms', end);
            console.log('Records read: %d', records);
        });
    }

}