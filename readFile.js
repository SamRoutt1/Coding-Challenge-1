var managedb = require('./manageDB');
var mariadb = require('mariadb');

module.exports = {

    parseFile: function (pool) {

        var fs = require('fs');
        var filepath = './data/PartD_Prescriber_PUF_NPI_Drug_16.txt';

        var file = fs.openSync(filepath, 'r');
        var bufferSize = 1024;
        var buffer = new Buffer.alloc(bufferSize);

        var nRecords = -1;

        var leftOver = '';
        var read, line, idxStart, idx;

        var readStart = new Date();

        while((read = fs.readSync(file, buffer, 0, bufferSize, null)) !== 0) {
            leftOver += buffer.toString('utf8', 0, read);
            idxStart = 0;

            while((idx = leftOver.indexOf('\n', idxStart)) !== -1) {
                line = leftOver.substring(idxStart, idx);
                //console.log('one line read: ' + line);
                //console.log('NRECORDS: %d', nRecords)
                if(nRecords < 0) {
                    nRecords++;
                } else {
                    var record = line.split('\r');
                    record = record[0].split('\t');
                    //console.log('NPI: ', record[0]);
                    //managedb.insertdb(pool, record);
                    nRecords++;
                    record = [];
                }
                idxStart = idx + 1;
                line = null;
            }
            //console.log('idxStart, idx: ', idxStart, idx);
            leftOver = leftOver.substring(idxStart);
        }

        var readEnd = new Date() - readStart;
        console.log('Read time: %dms', readEnd);


        //var readStart = new Date();

        /*var lblReader = require('line-by-line');
        lr = new lblReader(filepath);

        nRecords = -1;
        totalBenes = 0;
        totalClaims = 0;
        totalDrugCost = 0;

        lr.on('error', function (err) {
            console.log('ERROR: ', err);
            console.log('Near line: ', nRecords);
        });

        lr.on('line', function (line) {
            lr.pause();
            if(nRecords >= 0) {
                var record = line.split('\t');

                pool.getConnection((err) => {
                    if (err) throw err;
                })
                    .then(async (conn) => {
                        try {
                            let sql = 'USE myMDB';
                            conn.query(sql, (err, result) => {
                                if(err) throw err;
                                //console.log('Use myMDB . . .');
                            });
            
                            sql = 'INSERT INTO recordtbl (npi, nppes_provider_last_org_name,nppes_provider_first_name,nppes_provider_state,nppes_provider_city,specialty_description,description_flag,drug_name,generic_name,bene_count,total_claim_count,total_30_day_fill_count,total_day_supply,total_drug_cost,bene_count_ge65,bene_count_ge65_suppress_flag,total_claim_count_ge65,ge65_suppress_flag,total_30_day_fill_count_ge65,total_day_supply_ge65,total_drug_cost_ge65) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
                            conn.query(sql, record, (err, result) => {
                                if(err) throw err;
                            });
                            //console.log('Records Inserted . . .');
            
                            conn.end();
                        } catch (err) {
                            console.error(err);
                        }
        
                    })

                //managedb.insertdb(pool, record);
                totalBenes += +record[9];
                totalClaims += +record[10];
                totalDrugCost += +record[13];
            }
            nRecords++;
            lr.resume();
        });

        lr.on('end', function () {
            console.log('Total bene_count: %d', totalBenes);
            console.log('Total total_claim_count: %d', totalClaims);
            console.log('Total total_drug_cost: %d', totalDrugCost);

            var readEnd = new Date() - readStart;
            console.log('Read time: %dms', readEnd);
            console.log('Total records read: %d', nRecords);
        })*/

        /*var fs = require('fs');
        var readline = require('readline');
        var stream = require('stream');

        var instream = fs.createReadStream('./data/PartD_Prescriber_PUF_NPI_Drug_16.txt');
        var outstream = new stream;
        var rl = readline.createInterface(instream, outstream);

        nRecords = -1;
        var listRecords = [];
        var start = new Date();
        rl.on('line', (line) => {
            if(nRecords === -1) {
                //do nothing
            } else {
                var record = line.split('\t');
                //console.log(items);
                listRecords.push(record);
                //listRecords = [...listRecords, items];
            }
            nRecords ++;
        })

        rl.on('close', () => {
            //do something
            console.log('finish reading');
            var end = new Date() - start;
            console.log('Read time: %dms', end);
            console.log('Records read: %d', nRecords);
        });*/

        //console.log('listRecords length: ', listRecords.length);

        //return listRecords;
        
    }

}