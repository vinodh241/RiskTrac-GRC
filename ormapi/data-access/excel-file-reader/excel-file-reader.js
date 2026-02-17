const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../../utility/constants/constant.js');


async function uploadData(userId, userName, dataToUpload, fileId, accountGUIDFromToken, callback) {
    logger.log('info', 'User Id : '+ userId +' : excel-file-reader : uploadData : Execution started.');
   
    var uploadStatus = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;

    processExcelData(userId, userName, dataToUpload, fileId,accountGUIDFromToken, function(processStatus) {
        if(processStatus){
            logger.log('info', 'User Id : '+ userId +' : excel-file-reader : uploadData : Execution end. : All rows are added.');
            uploadStatus = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
            callback(uploadStatus);
        }
        else {
            logger.log('error', 'User Id : '+ userId +' : excel-file-reader : uploadData : Execution end. : Error in all the rows adding. ');
            uploadStatus = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
            callback(uploadStatus);
        }
    });
}

async function processExcelData(userId, userName, dataToUpload, fileId, accountGUIDFromToken, callback) {
    logger.log('info', 'User Id : '+ userId +' : excel-file-reader : processExcelData : Execution started.');

    var processStatus = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;

    for (var index = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO; index < dataToUpload.length; index++) {
        let rowNumber   = dataToUpload[index].Row;
        let rowData     = dataToUpload[index].Data;

        await addFileRows(userId, userName, rowNumber, rowData, fileId, accountGUIDFromToken).then(function () {
            if (index == dataToUpload.length - CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('info', 'User Id : '+ userId +' : excel-file-reader : processExcelData : Execution end. : All the File Rows are added to the FileRows table Completed..');
                processStatus = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
            }
        })  
        .catch(function (error){
            logger.log('error', 'User Id : '+ userId +' : excel-file-reader : processExcelData : Execution end. : addFileRows got error : error details : ' + error);
            processStatus = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
        });       
    }
    await addFrameworkFromExcel(userId, userName,  fileId, accountGUIDFromToken).then(function () {
        logger.log('info', 'User Id : '+ userId +' : excel-file-reader : processExcelData : Execution end. : Framework created successfully.');
        processStatus = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
    })        
    .catch(function (error){
        logger.log('error', 'User Id : '+ userId +' : excel-file-reader : processExcelData : Execution end. : addFileRows got error : error details : ' + error);
        processStatus = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
    });
    callback(processStatus);
}

async function addFileRows(userId, userName, rowNum, rowData, fileId, accountGUIDFromToken) {
    return new Promise(function (resolve, reject) {
        logger.log('info', 'User Id : '+ userId +' : excel-file-reader : addFileRows : Execution started.');
        var request = new MSSQL.Request(poolConnectionObject);     
        
        request.input('RecordData',     MSSQL.VarChar,  rowData);
        request.input('RowNum',         MSSQL.Int,      rowNum);
        request.input('FileID',         MSSQL.BigInt,   fileId);        
        request.input('UserName',       MSSQL.NVarChar, userName);
        request.input('AccountGUID',    MSSQL.UniqueIdentifier, accountGUIDFromToken)
        request.output('Success',       MSSQL.Bit);
        request.output('OutMessage',    MSSQL.VarChar);

        logger.log('info', 'User Id : '+ userId +' : excel-file-reader : addFileRows : Input parameters value for ORM.AddFileRows procedure.');
        logger.log('info', 'User Id : '+ userId +' : excel-file-reader : addFileRows : RowNum       = ' + rowNum);
        logger.log('info', 'User Id : '+ userId +' : excel-file-reader : addFileRows : RecordData   = ' + rowData);
        logger.log('info', 'User Id : '+ userId +' : excel-file-reader : addFileRows : FileID       = ' + fileId);

        request.execute('ORM.AddFileRows').then(function(result) {
            logger.log('info', 'User Id : '+ userId +' : excel-file-reader : addFileRows : Output parameters value of ORM.AddFileRows procedure.');
            logger.log('info', 'User Id : '+ userId +' : excel-file-reader : addFileRows : Success      = ' + result.output.Success);
            logger.log('info', 'User Id : '+ userId +' : excel-file-reader : addFileRows : OutMessage   = ' + result.output.OutMessage);
        
            if(result.output.Success == CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE){
                logger.log('error', 'User Id : '+ userId +' : excel-file-reader : addFileRows : Input parameters value for ORM.AddFileRows procedure.');
                logger.log('error', 'User Id : '+ userId +' : excel-file-reader : addFileRows : RowNum      = ' + rowNum);
                logger.log('error', 'User Id : '+ userId +' : excel-file-reader : addFileRows : RecordData  = ' + rowData);
                logger.log('error', 'User Id : '+ userId +' : excel-file-reader : addFileRows : FileID      = ' + fileId);

                logger.log('error', 'User Id : '+ userId +' : excel-file-reader : addFileRows : Output parameters value of ORM.AddFileRows procedure.');
                logger.log('error', 'User Id : '+ userId +' : excel-file-reader : addFileRows : Success     = ' + result.output.Success);
                logger.log('error', 'User Id : '+ userId +' : excel-file-reader : addFileRows : OutMessage  = ' + result.output.OutMessage);

                logger.log('error', 'User Id : '+ userId +' : excel-file-reader : addFileRows : Execution end. : Add file rows failed due to procedure error. : Error details : ' + result.output.OutMessage);
            } 
            resolve(CONSTANT_FILE_OBJ.APP_CONSTANT.ONE);
        })
        .catch(function (error) {
            logger.log('error', 'User Id : '+ userId +' : excel-file-reader : addFileRows : Input parameters value for ORM.AddFileRows procedure.');
            logger.log('error', 'User Id : '+ userId +' : excel-file-reader : addFileRows : RowNum      = ' + rowNum);
            logger.log('error', 'User Id : '+ userId +' : excel-file-reader : addFileRows : RecordData  = ' + rowData);
            logger.log('error', 'User Id : '+ userId +' : excel-file-reader : addFileRows : FileID      = ' + fileId);
            logger.log('error', 'User Id : '+ userId +' : excel-file-reader : addFileRows : Execution end. : Add file rows failed : Error detail : ' + error);
            reject(CONSTANT_FILE_OBJ.APP_CONSTANT.ONE);
        });
    });
}

async function addFrameworkFromExcel(userId, userName, fileId, accountGUIDFromToken) {
    return new Promise(function (resolve, reject) {

        logger.log('info', 'User Id : '+ userId +' : addFrameworkToDB : addFrameworkFromExcel : Execution started.');
        var request = new MSSQL.Request(poolConnectionObject);

        request.input('UserName',       MSSQL.NVarChar,   userName);
        request.input('FileID',         MSSQL.BigInt,     fileId);      
        request.input('AccountGUID',    MSSQL.UniqueIdentifier, accountGUIDFromToken) 
        request.output('Success',       MSSQL.Bit);
        request.output('OutMessage',    MSSQL.NVarChar);

        logger.log('info', 'User Id : '+ userId +' : addFrameworkToDB : addFrameworkFromExcel : Input parameters value for ORM.UploadRAFrameworkFromExcel procedure.');
        logger.log('info', 'User Id : '+ userId +' : addFrameworkToDB : addFrameworkFromExcel : FileID  = ' + fileId);
        logger.log('info', 'User Id : '+ userId +' : addFrameworkToDB : addFrameworkFromExcel : accountGUIDFromToken  = ' + accountGUIDFromToken);

       
        request.execute('ORM.UploadRAFrameworkFromExcel').then(function (result) {
            logger.log('info', 'User Id : '+ userId +' : addFrameworkToDB : addFrameworkFromExcel : Output parameters value of ORM.UploadRAFrameworkFromExcel procedure.');
            logger.log('info', 'User Id : '+ userId +' : addFrameworkToDB : addFrameworkFromExcel : Success    = ' + result.output.Success);
            logger.log('info', 'User Id : '+ userId +' : addFrameworkToDB : addFrameworkFromExcel : OutMessage = ' + result.output.OutMessage);
            
            if (result.output.Success == CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('info', 'User Id : '+ userId +' : addFrameworkToDB : addFrameworkFromExcel : Execution end. : addFrameworkFromExcel is successfull.');
                resolve(CONSTANT_FILE_OBJ.APP_CONSTANT.ONE);
            }
            else {
                logger.log('error', 'User Id : '+ userId +' : addFrameworkToDB : addFrameworkFromExcel : Execution end. : addFrameworkFromExcel is unsuccessfull. : Error details : ' + result.output.OutMessage);
                resolve(CONSTANT_FILE_OBJ.APP_CONSTANT.ONE);
            }
        })
        .catch(function (error) {
            logger.log('error', 'User Id : '+ userId +' : addFrameworkToDB : addFrameworkFromExcel : Execution end. : addFrameworkFromExcel is unsuccessfull. : Error details : ' + error);
            reject(CONSTANT_FILE_OBJ.APP_CONSTANT.ONE);
        });
        
    });
}
module.exports = {
    uploadData: uploadData
};