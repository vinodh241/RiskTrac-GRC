const PATH                  = require('path');
const FILE_SYSTEM           = require('fs');
const MESSAGE_FILE_OBJ      = require('./message/message-constant.js');
const CONSTANT_FILE_OBJ     = require('./constants/constant.js');
const APP_CONFIG            = require('../config/app-config.js');
const UNIQID                = require('uniqid');
const FILE_TYPE             = require('file-type');
const {fileTypeFromBuffer} = require('file-type');




module.exports = class BinaryData {
    constructor() {
    }
 
    /**
     * This function will upload a files to given location and return with 
     * file name, file unique id, file extension and file data content in binary format.
     * @param {*} requestObject 
     * @param {*} destinationPath 
     * @param {*} ALLOWED_FILE_EXTENSION_TYPES 
     * @param {*} ALLOWED_FILE_MIME_TYPES 
     * @param {*} userIdFromToken 
     */
     async uploadFilesInBinaryFormat(requestObject, destinationPath, ALLOWED_FILE_EXTENSION_TYPES,ALLOWED_FILE_MIME_TYPES, userIdFromToken){
       
        let fileUploadResponseObject = {
            status:             CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            fileUniqueId:       CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            fileName:           CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            fileExtension:      CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            fileDataContent:    CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage:       CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        let uniqueId                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let oldFilePathWithFileName = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let newFilePathWithFileName = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let filePath                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let uploadedFileObject      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let uploadedFileName        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let uploadFileType          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let uploadFileMimeType      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        const allowedFileMimeType   = ALLOWED_FILE_MIME_TYPES;
        try {
            /**
             * File upload logic : Start
             */
            if (requestObject.files !== CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED &&
                requestObject.files !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL &&
                Object.keys(requestObject.files).length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){

                logger.log('info', 'User Id : '+ userIdFromToken +' : BinaryData : uploadFilesInBinaryFormat : Execution started.');

                uniqueId                    = UNIQID();                         // Generating unique id.
                uploadedFileObject          = requestObject.files.UploadFile;   // The name of the input field is used to retrieve the uploaded file object.
                uploadedFileName            = uploadedFileObject.name;          // Getting file name file object.
                uploadedFileName            = uploadedFileName.trim();
                filePath                    = destinationPath;                  // Reading file location to dump file.
                uploadFileType              = ((await FILE_TYPE.fromBuffer(uploadedFileObject.data)) && (await FILE_TYPE.fromBuffer(uploadedFileObject.data)).ext) || PATH.extname(uploadedFileName);
                uploadFileType              = uploadFileType.toLowerCase();
                uploadFileMimeType          = uploadFileType == '.eml' ? uploadedFileObject.mimetype : null;
                
                logger.log('info', 'User Id : '+ userIdFromToken +' : BinaryData : uploadFilesInBinaryFormat : uploadedFileName : '+uploadedFileName);
                // Check malicious file upload
                const MALICIOUS_FILE_RESPONSE =  await this.CheckMaliciousUploadFile(requestObject, ALLOWED_FILE_EXTENSION_TYPES, userIdFromToken);

                if(MALICIOUS_FILE_RESPONSE.status == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE){
                    // Found Malicious upload file error
                    fileUploadResponseObject.status         = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                    fileUploadResponseObject.errorMessage   = MALICIOUS_FILE_RESPONSE.errorMessage;

                    logger.log('error', 'User Id : '+ userIdFromToken +' : BinaryData : uploadFilesInBinaryFormat : Execution end. : File found malicious : Error details : ' + fileUploadResponseObject.errorMessage);
                    
                    return fileUploadResponseObject;
                } else {
                    logger.log('info', 'User Id : '+ userIdFromToken +' : BinaryData : uploadFilesInBinaryFormat : File uploading process started.');
                    logger.log('info', 'User Id : '+ userIdFromToken +' : BinaryData : uploadFilesInBinaryFormat : uploadedFileName : '+ uploadedFileName);
                    logger.log('info', 'User Id : '+ userIdFromToken +' : BinaryData : uploadFilesInBinaryFormat : uniqueId : '+ uniqueId);
                    
                    if(filePath.endsWith(CONSTANT_FILE_OBJ.APP_CONSTANT.FORWARD_SLASH)){
                        filePath = filePath.slice(CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO, CONSTANT_FILE_OBJ.APP_CONSTANT.MINUS_ONE);
                    }

                    /**
                     * Adding file name into file path.
                     */
                    oldFilePathWithFileName = PATH.join(filePath+CONSTANT_FILE_OBJ.APP_CONSTANT.FORWARD_SLASH, uploadedFileName);

                    // Removing "/temp" from file path, because finally file will get store in without temp.
                    filePath = filePath.slice(CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO, CONSTANT_FILE_OBJ.APP_CONSTANT.MINUS_FIVE);

                    /**
                     * Adding unique id, underscore and file name into file path.
                     */
                    newFilePathWithFileName = PATH.join(filePath + CONSTANT_FILE_OBJ.APP_CONSTANT.FORWARD_SLASH, uniqueId + CONSTANT_FILE_OBJ.APP_CONSTANT.UNDERSCORE + uploadedFileName);

                    // Use the mv() method to place the file at defined location on server
                    uploadedFileObject.mv(oldFilePathWithFileName, function(error) {
                        if(error){
                            logger.log('error', 'User Id : '+ userIdFromToken +' : BinaryData : uploadFilesInBinaryFormat : Execution end. : Error on dumping  file into server. : Error details : '+error);

                            // Send negative response
                            fileUploadResponseObject.status         = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                            fileUploadResponseObject.errorMessage   = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_ATTACH_FILE_ERROR;

                            return fileUploadResponseObject;
                        } else {
                            logger.log('info', 'User Id : '+ userIdFromToken +' : BinaryData : uploadFilesInBinaryFormat : File dump into location with original name successfully.');

                            /**
                             * Renaming file with unique id outside of temp folder location : START
                             */
                            FILE_SYSTEM.rename(oldFilePathWithFileName, newFilePathWithFileName,
                                async (error) => await checkFileContent({
                                    error,
                                    fileUploadResponseObject,
                                    userIdFromToken,
                                    uploadFileType,
                                    allowedFileMimeType,
                                    newFilePathWithFileName,
                                    uniqueId,
                                    uploadedFileName,
                                    uploadFileMimeType
                                })
                            );
                            /**
                             * Renaming file with unique id outside of temp folder location : END
                             */
                        }
                    });
                }
            }
            else {
                logger.log('info', 'User Id : '+ userIdFromToken +' : BinaryData : uploadFilesInBinaryFormat : Execution end. : No file to upload.');

                // Send negative response
                fileUploadResponseObject.status         = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                fileUploadResponseObject.errorMessage   = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_ATTACH_FILE_ERROR;

                return fileUploadResponseObject;
            }
            /**
             * File upload logic : END
             */
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : BinaryData : uploadFilesInBinaryFormat : Execution end. : Error on dumping file into server : Error details from catch block : '+error.stack);

            // Send negative response
            fileUploadResponseObject.status         = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
            fileUploadResponseObject.errorMessage   = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_ATTACH_FILE_ERROR;

            return fileUploadResponseObject;
        }
    }

    /**
     * This function will chaek malicious file for upload
     * @param {*} requestObject 
     * @param {*} ALLOWED_FILE_EXTENSION_TYPES 
     * @param {*} userIdFromToken 
     * @returns 
     */
    async CheckMaliciousUploadFile(requestObject, ALLOWED_FILE_EXTENSION_TYPES, userIdFromToken){
        try {
            logger.log('info', 'User Id : '+ userIdFromToken +' : BinaryData : CheckMaliciousUploadFile : Execution started.');

            let maliciousFileResponsObj  = {
                status          : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                errorMessage    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
            };

            let uploadedFileObject  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let uploadedFileName    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let uploadFileType      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            uploadedFileObject      = requestObject.files.UploadFile;   // The name of the input field is used to retrieve the uploaded file object.           
            uploadedFileName        = uploadedFileObject.name;          // Getting file name file object.
            uploadedFileName        = uploadedFileName.trim();
            uploadFileType          = PATH.extname(uploadedFileName);   // Getting file type (extension)  

            uploadFileType          = uploadFileType.toLowerCase();

            // console.log("uploadedFileObject",uploadedFileObject)
            // console.log("uploadedFileName",uploadedFileName)
            // console.log("uploadFileType",uploadFileType)

            logger.log('info', 'User Id : '+ userIdFromToken +' : BinaryData : CheckMaliciousUploadFile : uploadFileType extension : '+ (uploadFileType || null));
            
            // If file type is undefine or null or "".exe" then do not upload file
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == uploadFileType || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == uploadFileType || CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY == uploadFileType){
                logger.log('error', 'User Id : '+ userIdFromToken +' : BinaryData : CheckMaliciousUploadFile : Execution end. : Attached file extension is undefined or null.');
                
                maliciousFileResponsObj.status       = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
                maliciousFileResponsObj.errorMessage = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FILE_EXTENSION_NULL_UNDEFINED;

                return maliciousFileResponsObj;
            } else if(uploadFileType == CONSTANT_FILE_OBJ.APP_CONSTANT.FILE_TYPE_exe || uploadFileType == CONSTANT_FILE_OBJ.APP_CONSTANT.FILE_TYPE_EXE){
                logger.log('error', 'User Id : '+ userIdFromToken +' : BinaryData : CheckMaliciousUploadFile : Execution end. : Attached file extension is .exe, So file can not be upload into server.');
                
                maliciousFileResponsObj.status       = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
                maliciousFileResponsObj.errorMessage = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FILE_EXTENSION_EXE;
                return maliciousFileResponsObj;
            } else {
                // Allow only define file type extension only, Which is defined into app config file.
                logger.log('info', 'User Id : '+ userIdFromToken +' : BinaryData : CheckMaliciousUploadFile : ALLOWED_FILE_EXTENSION_TYPES : ' + ALLOWED_FILE_EXTENSION_TYPES);
                logger.log('info', 'User Id : '+ userIdFromToken +' : BinaryData : CheckMaliciousUploadFile : uploadFileType : ' + uploadFileType.toLowerCase());

                if(uploadFileType && ALLOWED_FILE_EXTENSION_TYPES.includes(uploadFileType)){
                    logger.log('info', 'User Id : '+ userIdFromToken +' : BinaryData : CheckMaliciousUploadFile : Execution end. : Upload file is not malicious file and file type is matching with allowed file type.');
                    maliciousFileResponsObj.status       = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                    maliciousFileResponsObj.errorMessage = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    return maliciousFileResponsObj;
                } else {
                    // file type extension is not matached with defined allowed list. so we can not upload file into server
                    logger.log('error', 'User Id : '+ userIdFromToken +' : BinaryData : CheckMaliciousUploadFile : Execution end. : Uploading file extesion is not matching to allowed file extension list defined in appConfig.js file');
                    maliciousFileResponsObj.status       = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
                    maliciousFileResponsObj.errorMessage = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FILE_EXTENSION_NOT_EXISTING_ALLOWED_LIST;
                    return maliciousFileResponsObj;
                }
            }
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : BinaryData : CheckMaliciousUploadFile : Execution end. : Got some unchacked error : Error detail : '+error.stack);
            maliciousFileResponsObj.status       = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
            maliciousFileResponsObj.errorMessage = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.MALICIOUS_ATTACH_FILE_ERROR;
            return maliciousFileResponsObj;
        }
    }
  
}

async function checkFileContent(fileCheck){
    try {
        logger.log('info', 'User Id : ' + fileCheck.userIdFromToken + ' : BinaryData : checkFileContent : Execution started.');
        if (fileCheck.error) {
            logger.log('error', 'User Id : ' + fileCheck.userIdFromToken + ' : BinaryData : checkFileContent : Execution end. : File renaming got error : Error details : '+ error);
            // Send negative response
            fileCheck.fileUploadResponseObject.status       = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
            fileCheck.fileUploadResponseObject.errorMessage = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_ATTACH_FILE_ERROR;
            
            return fileCheck.fileUploadResponseObject;           
        } else {
            // console.log("fileCheck",fileCheck)
            logger.log('info', 'User Id : ' + fileCheck.userIdFromToken + ' : BinaryData : checkFileContent : File name renamed with unique id successfully.');

            const IS_VALID_FILE = await checkFileMime(fileCheck.newFilePathWithFileName,fileCheck.allowedFileMimeType, fileCheck.userIdFromToken,fileCheck.uploadFileMimeType);

            logger.log('info', 'User Id : ' + fileCheck.userIdFromToken + ' : BinaryData : checkFileContent : IS_VALID_FILE = ' + IS_VALID_FILE);

            if (IS_VALID_FILE) {
                logger.log('info', 'User Id : ' + fileCheck.userIdFromToken + ' : BinaryData : checkFileContent : Execution end. : File mime type is allowed mime type.');
                
                successFileUploadHandler(fileCheck);                
              
            } else {
                logger.log('error', 'User Id : ' + fileCheck.userIdFromToken + ' : BinaryData : checkFileContent : Execution end. : File mime type is not allowed mime type.');
                
                maliciousErrorHandler(fileCheck);              
            }
        }
    } catch (error) {
        logger.log('error', 'User Id : ' + fileCheck.userIdFromToken + ' BinaryData : checkFileContent : Execution end. : Got unhandle error : error details : '+error.stack);
        fileCheck.fileUploadResponseObject.status       = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
        fileCheck.fileUploadResponseObject.errorMessage = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_ATTACH_FILE_ERROR;
        return fileCheck.fileUploadResponseObject; 
    }
}

async function checkFileMime(newFilePathWithFileName,allowedFileMimeType, userIdFromToken,uploadFileMimeType){
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BinaryData : checkFileMime : Execution started.');

        let isValidFile     = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
        // console.log("newFilePathWithFileName",newFilePathWithFileName)
        let FILE_TYPE_OBJ = await FILE_TYPE.fromFile(newFilePathWithFileName);
        if(uploadFileMimeType && FILE_TYPE_OBJ == undefined) FILE_TYPE_OBJ = {mime : uploadFileMimeType};
        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FILE_TYPE_OBJ || !(allowedFileMimeType.includes(FILE_TYPE_OBJ.mime))) {
            /**
             * Deleting file, if file mime type is not allowed.
             */
            FILE_SYSTEM.unlinkSync(newFilePathWithFileName);
            isValidFile = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
        }
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BinaryData : checkFileMime : Execution end. : Uploaded file mime type is allowed mime type. : '+FILE_TYPE_OBJ.mime);
        return isValidFile;
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' BinaryData : checkFileMime : Execution end. : Got unhandle error : error details : '+error.stack);

        isValidFile = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
        return isValidFile;
    }
}

async function successFileUploadHandler(fileCheck){
    try {
        logger.log('info', 'User Id : ' + fileCheck.userIdFromToken + ' : BinaryData : successFileUploadHandler : Execution started.');
        const FILE_DATA_FROM_READ   = FILE_SYSTEM.readFileSync(fileCheck.newFilePathWithFileName);
        const FILE_DATA_CONTENT     = Buffer.from(FILE_DATA_FROM_READ, 'binary');

        fileCheck.fileUploadResponseObject.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
        fileCheck.fileUploadResponseObject.fileUniqueId     = fileCheck.uniqueId;
        fileCheck.fileUploadResponseObject.fileName         = fileCheck.uploadedFileName;
        fileCheck.fileUploadResponseObject.fileExtension    = fileCheck.uploadFileType;
        fileCheck.fileUploadResponseObject.fileDataContent  = FILE_DATA_CONTENT;
        fileCheck.fileUploadResponseObject.errorMessage     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        logger.log('info', 'User Id : ' + fileCheck.userIdFromToken + ' : BinaryData : successFileUploadHandler : Execution end.');
       
        await fileCheck.callback(fileCheck.fileUploadResponseObject);
        return fileCheck.fileUploadResponseObject;
    } catch (error) {
        logger.log('error', 'User Id : ' + fileCheck.userIdFromToken + ' : BinaryData : successFileUploadHandler : Execution end. : Got unchecked error : Error details : ' + error.stack);
        fileCheck.fileUploadResponseObject.status       = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
        fileCheck.fileUploadResponseObject.errorMessage = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_ATTACH_FILE_ERROR;
        await fileCheck.callback(fileCheck.fileUploadResponseObject);
        return fileCheck.fileUploadResponseObject;
    }
}

async function maliciousErrorHandler(fileCheck) {
    try {
        logger.log('error', 'User Id : ' + fileCheck.userIdFromToken + ' : BinaryData : maliciousErrorHandler : Uploaded file is a malicious file.  : Error details : ' + fileCheck.error);
    
        fileCheck.fileUploadResponseObject.status       = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
        fileCheck.fileUploadResponseObject.errorMessage = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ERROR_ALLOWED_FILE_EXTENSION;
        await fileCheck.callback(fileCheck.fileUploadResponseObject);
        return fileCheck.fileUploadResponseObject;
    } catch (error) {
        logger.log('error', 'User Id : ' + fileCheck.userIdFromToken + ' : BinaryData : maliciousErrorHandler : Got unchecked error  : Error details : ' + error.stack);
        await fileCheck.callback(fileCheck.fileUploadResponseObject);
        return fileCheck.fileUploadResponseObject;
    }
}