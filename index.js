const mariadb = require('mariadb');
//var parse = require('./readFile.js');
//var managedb = require('./manageDB.js');

let tableFields = [
    'id int AUTO_INCREMENT',
    'npi VARCHAR(10)',
    'nppes_provider_last_org_name VARCHAR(70)',
    'nppes_provider_first_name VARCHAR(20)',
    'nppes_provider_city VARCHAR(40)',
    'nppes_provider_state VARCHAR(2)',
    'specialty_description VARCHAR(75)',
    'description_flag VARCHAR(1)',
    'drug_name VARCHAR(30)',
    'generic_name VARCHAR(30)',
    'bene_count VARCHAR(8)', //int
    'total_claim_count VARCHAR(8)', //int
    'total_30_day_fill_count VARCHAR(8)', //float
    'total_day_supply VARCHAR(8)', //float
    'total_drug_cost VARCHAR(12)', //float
    'bene_count_ge65 VARCHAR(8)', //int
    'bene_count_ge65_suppress_flag VARCHAR(1)',
    'total_claim_count_ge65 VARCHAR(8)', //int
    'ge65_suppress_flag VARCHAR(1)',
    'total_30_day_fill_count_ge65 VARCHAR(8)', //float
    'total_day_supply_ge65 VARCHAR(8)', //float
    'total_drug_cost_ge65 VARCHAR(12)', //float
    'PRIMARY KEY (id)'
];

comma_separated_tFields = tableFields.join();

async function run() {

    pool = await mariadb.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'myMDB'
    })

    await pool.getConnection();

    await pool.query('CREATE TABLE recordtbl(' + comma_separated_tFields + ')')
        .then(() => {
            console.log('Table Created.')
        })
        .catch(err => {
            console.log('Error @ CREATE TABLE: ', err);
        });

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
            if(nRecords < 0) {
                nRecords++;
            } else {
                var record = line.split('\r');
                record = record[0].split('\t');
                await pool.query("INSERT INTO recordtbl (npi, nppes_provider_last_org_name,nppes_provider_first_name,nppes_provider_city,nppes_provider_state,specialty_description,description_flag,drug_name,generic_name,bene_count,total_claim_count,total_30_day_fill_count,total_day_supply,total_drug_cost,bene_count_ge65,bene_count_ge65_suppress_flag,total_claim_count_ge65,ge65_suppress_flag,total_30_day_fill_count_ge65,total_day_supply_ge65,total_drug_cost_ge65) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", record)
                    .then(() => {
                        //console.log('Inserted: ', record);
                    })
                    .catch(err => {
                        console.log('Error @ INSERT: ', err, ': @ record: ', nRecords);
                    });

                nRecords++;
                record = null;
            }
            idxStart = idx + 1;
            line = null;
        }
        leftOver = leftOver.substring(idxStart);
    }

    var readEnd = new Date() - readStart;
    console.log('Read time: %dms', readEnd);
    console.log('Records read: %d', nRecords);

}

run();
