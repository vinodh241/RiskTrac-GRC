const EXCELJS_OBJ           = require('exceljs');
const RISK_APPETITE_DB      = require('../../data-access/excel-file-reader/excel-file-reader.js');
const CONSTANT_FILE_OBJ     = require('../../utility/constants/constant.js');
const APP_CONFIG_FILE_OBJ   = require('../../config/app-config.js');
   
/**
 * This function will read excel file and insert  into database
 * @param {*} filePath 
 * @param {*} callback 
 */
 function  processExcelFile(userId, userName, fileId, filePath, accountGUIDFromToken, callback) {
    try {       
        logger.log('info', 'User Id : ' + userId + ' : RiskAppetiteFileReader : processExcelFile : Execution started.');

        var excelProcessStatus  = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
        var workBook            = new EXCELJS_OBJ.Workbook();

        workBook.xlsx.readFile(filePath).then(function () {
            
            var workSheet   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var rowObj      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            const SHEET     = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.FRAMEWORK_SHEET_NAME;
            var rows        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var Row         = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            var RowData     = [];

            workSheet   = workBook.getWorksheet(SHEET);
            rows        = workSheet.rowCount;
            column      = workSheet.columnCount;

            for(Row = CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE; Row <= rows; Row++) 
            {
                rowObj          = workSheet.getRow(Row);
                cellCount       = rowObj.cellCount;                
                var columnData  = [];

                if(rowObj.getCell(CONSTANT_FILE_OBJ.APP_CONSTANT.THREE).value == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                    continue;
                }

                for(Col = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO; Col <= cellCount; Col++) 
                {
                    var Val     = rowObj.getCell(Col).value;
                    var RVal    = CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY_STRING;
                    if(Val != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && Val.richText) {                           
                        var NVal = Val.richText;
                        NVal.forEach(element => {
                            RVal = RVal + element.text;
                        });
                        Val = RVal;                           
                    }                       
                    columnData.push({ Col, Val });
                }
                var Data = JSON.stringify(columnData);
                RowData.push({Row, Data});
            }

            var strRowData  = JSON.stringify(RowData);
            var Uploaded    = JSON.parse(strRowData);

            RISK_APPETITE_DB.uploadData(userId, userName, Uploaded, fileId,accountGUIDFromToken, function(uploadStatus) {
                if(uploadStatus) {
                    logger.log('info', 'User Id : ' + userId + ' : RiskAppetiteFileReader : processExcelFile : Execution end. : Data processing of uploaded file is successfull.');
                    excelProcessStatus = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
                    callback (excelProcessStatus);
                }
                else {
                    logger.log('error', 'User Id : ' + userId + ' : RiskAppetiteFileReader : processExcelFile : Execution end. : Data processing of uploaded file is unsuccessfull.');
                    excelProcessStatus = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                    callback (excelProcessStatus);
                }
            });
        })
        .catch(function (error) {
            logger.log('error', 'User Id : ' + userId + ' : RiskAppetiteFileReader : processExcelFile : Execution end. : Uploaded file is not xls or xlsx, It might be a malicious file. : Error details : ' + error);
            excelProcessStatus = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
            callback (excelProcessStatus);
        });
    } catch (error) {
        logger.log('error', 'User Id : ' + userId + ' : RiskAppetiteFileReader : processExcelFile :  Execution end. : Got unhandled error : Error Detail : ' + error);
        excelProcessStatus = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
        callback (excelProcessStatus);
    }
}

module.exports = {
    processExcelFile  : processExcelFile
};

    