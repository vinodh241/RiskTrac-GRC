const PATH = require('path');
const FILE_SYSTEM = require('fs');
const MESSAGE_FILE_OBJ = require('./message/message-constant.js');
const CONSTANT_FILE_OBJ = require('./constants/constant.js');
const APP_CONFIG = require('../config/app-config.js');
const UNIQID = require('uniqid');
const FILE_TYPE = require('file-type');
const { fileTypeFromBuffer } = require('file-type');
const Client = require('ssh2-sftp-client');
const UTILITY_APP = require('../utility/utility.js');
const pdf = require('pdf-parse');

var utilityAppObject = new UTILITY_APP();
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
     * @param {*} callback 
     */
    async uploadFilesInBinaryFormat(requestObject, destinationPath, ALLOWED_FILE_EXTENSION_TYPES, ALLOWED_FILE_MIME_TYPES, userIdFromToken, callback) {

        var fileUploadResponseObject = {
            status: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            fileUniqueId: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            fileName: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            fileExtension: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            fileDataContent: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        var uniqueId = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var oldFilePathWithFileName = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var newFilePathWithFileName = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var filePath = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var uploadedFileObject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var uploadedFileName = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var uploadFileType = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var uploadFileMimeType = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        const allowedFileMimeType = ALLOWED_FILE_MIME_TYPES;
        try {
            /**
             * File upload logic : Start
             */
            if (requestObject.files !== CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED &&
                requestObject.files !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL &&
                Object.keys(requestObject.files).length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {

                logger.log('info', 'User Id : ' + userIdFromToken + ' : BinaryData : uploadFilesInBinaryFormat : Execution started.');

                uniqueId = UNIQID();                         // Generating unique id.
                uploadedFileObject = requestObject.files.UploadFile;   // The name of the input field is used to retrieve the uploaded file object.

                uploadedFileName = uploadedFileObject.name;          // Getting file name file object.
                uploadedFileName = uploadedFileName.trim();
                filePath = destinationPath;                  // Reading file location to dump file.
                // uploadFileType              = PATH.extname(uploadedFileName);
                // uploadFileType              = (await FILE_TYPE.fromBuffer(uploadedFileObject.data)).ext || PATH.extname(uploadedFileName);
                uploadFileType = ((await FILE_TYPE.fromBuffer(uploadedFileObject.data)) && (await FILE_TYPE.fromBuffer(uploadedFileObject.data)).ext) || PATH.extname(uploadedFileName);
                uploadFileType = uploadFileType.toLowerCase();
                uploadFileMimeType = uploadFileType == '.eml' ? uploadedFileObject.mimetype : null;
                // console.log('✌️uploadedFileObject.mimetype --->', uploadedFileObject.mimetype);

                logger.log('info', 'User Id : ' + userIdFromToken + ' : BinaryData : uploadFilesInBinaryFormat : uploadedFileName : ' + uploadedFileName);
                // console.log("ALLOWED_FILE_EXTENSION_TYPES",ALLOWED_FILE_EXTENSION_TYPES)
                // Check malicious file upload
                const MALICIOUS_FILE_RESPONSE = await this.CheckMaliciousUploadFile(requestObject, ALLOWED_FILE_EXTENSION_TYPES, userIdFromToken);

                // console.log("MALICIOUS_FILE_RESPONSE",MALICIOUS_FILE_RESPONSE)
                if (MALICIOUS_FILE_RESPONSE.status == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                    // Found Malicious upload file error
                    fileUploadResponseObject.status = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                    fileUploadResponseObject.errorMessage = MALICIOUS_FILE_RESPONSE.errorMessage;

                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BinaryData : uploadFilesInBinaryFormat : Execution end. : File found malicious : Error details : ' + fileUploadResponseObject.errorMessage);

                    callback(fileUploadResponseObject);
                } else {
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : BinaryData : uploadFilesInBinaryFormat : File uploading process started.');
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : BinaryData : uploadFilesInBinaryFormat : uploadedFileName : ' + uploadedFileName);
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : BinaryData : uploadFilesInBinaryFormat : uniqueId : ' + uniqueId);

                    if (filePath.endsWith(CONSTANT_FILE_OBJ.APP_CONSTANT.FORWARD_SLASH)) {
                        filePath = filePath.slice(CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO, CONSTANT_FILE_OBJ.APP_CONSTANT.MINUS_ONE);
                    }

                    /**
                     * Adding file name into file path.
                     */
                    oldFilePathWithFileName = PATH.join(filePath + CONSTANT_FILE_OBJ.APP_CONSTANT.FORWARD_SLASH, uploadedFileName);

                    // Removing "/temp" from file path, because finally file will get store in without temp.
                    filePath = filePath.slice(CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO, CONSTANT_FILE_OBJ.APP_CONSTANT.MINUS_FIVE);

                    /**
                     * Adding unique id, underscore and file name into file path.
                     */
                    newFilePathWithFileName = PATH.join(filePath + CONSTANT_FILE_OBJ.APP_CONSTANT.FORWARD_SLASH, uniqueId + CONSTANT_FILE_OBJ.APP_CONSTANT.UNDERSCORE + uploadedFileName);

                    // Use the mv() method to place the file at defined location on server                    
                    uploadedFileObject.mv(oldFilePathWithFileName, function (error) {
                        if (error) {
                            logger.log('error', 'User Id : ' + userIdFromToken + ' : BinaryData : uploadFilesInBinaryFormat : Execution end. : Error on dumping  file into server. : Error details : ' + error);

                            // Send negative response
                            fileUploadResponseObject.status = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                            fileUploadResponseObject.errorMessage = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_ATTACH_FILE_ERROR;

                            callback(fileUploadResponseObject);
                        } else {
                            logger.log('info', 'User Id : ' + userIdFromToken + ' : BinaryData : uploadFilesInBinaryFormat : File dump into location with original name successfully.');

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
                                    callback,
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
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BinaryData : uploadFilesInBinaryFormat : Execution end. : No file to upload.');

                // Send negative response
                fileUploadResponseObject.status = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                fileUploadResponseObject.errorMessage = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_ATTACH_FILE_ERROR;

                callback(fileUploadResponseObject);
            }
            /**
             * File upload logic : END
             */
        } catch (error) {
            // console.log("error",error)
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BinaryData : uploadFilesInBinaryFormat : Execution end. : Error on dumping file into server : Error details from catch block : ' + error.stack);

            // Send negative response
            fileUploadResponseObject.status = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
            fileUploadResponseObject.errorMessage = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_ATTACH_FILE_ERROR;

            callback(fileUploadResponseObject);
        }
    }

    // async uploadFileToRemoteServer(fileContent, remoteFile, userIdFromToken) {
    //     // const pattern = /API\\(.*)/; // Define a regular expression pattern to match 'API\' and everything after it
    //     // const match = newFilePathWithFileName.match(pattern); // Use match() method to get the part of the path after 'API\'
    //     // let extractedPath =  match ? '\\' + match[1] : null; // Extract the matched part and return it
    //     // // console.log(`Uploading  ${extractedPath}`);
    //     logger.log('info', 'User Id : '+ userIdFromToken +' : BinaryData : uploadFileToRemoteServer : Execution end. : remoteFilePath : ' + remoteFile);

    //     const sftp = new Client(); // Create SftpClient instance here
    //     try {
    //         await sftp.connect(APP_CONFIG.SFTP_CONFIG);        
    //         // await sftp.put(Buffer.from(fileContent), filename);
    //         await sftp.put(Buffer.from(fileContent), remoteFile);
    //     } catch (err) {
    //         // console.error('Error uploading file to remote server:', err);
    //         logger.log('error', 'User Id : '+ userIdFromToken +' : BinaryData : uploadFileToRemoteServer : Execution end. : Error uploading file to remote server:', err);
    //         throw err; // Rethrow the error to handle it in the calling function
    //     } finally {
    //         await sftp.end();
    //     }
    // }


    /**
     * This function will chaek malicious file for upload
     * @param {*} requestObject 
     * @param {*} ALLOWED_FILE_EXTENSION_TYPES 
     * @param {*} userIdFromToken 
     * @returns 
     */
    async CheckMaliciousUploadFile(requestObject, ALLOWED_FILE_EXTENSION_TYPES, userIdFromToken) {
        try {
            logger.log('info', 'User Id : ' + userIdFromToken + ' : BinaryData : CheckMaliciousUploadFile : Execution started.');

            var maliciousFileResponsObj = {
                status: CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
                errorMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
            };

            var uploadedFileObject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var uploadedFileName = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var uploadFileType = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            uploadedFileObject = requestObject.files.UploadFile;   // The name of the input field is used to retrieve the uploaded file object.           
            uploadedFileName = uploadedFileObject.name;          // Getting file name file object.
            uploadedFileName = uploadedFileName.trim();
            uploadFileType = PATH.extname(uploadedFileName);   // Getting file type (extension)  

            // uploadFileType = (await FILE_TYPE.fromBuffer(uploadedFileObject.data))?.ext || PATH.extname(uploadedFileName);
            uploadFileType = uploadFileType.toLowerCase();

            // console.log("uploadedFileObject",uploadedFileObject)
            // console.log("uploadedFileName",uploadedFileName)
            // console.log("uploadFileType",uploadFileType)

            logger.log('info', 'User Id : ' + userIdFromToken + ' : BinaryData : CheckMaliciousUploadFile : uploadFileType extension : ' + (uploadFileType || null));

            // If file type is undefine or null or "".exe" then do not upload file
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == uploadFileType || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == uploadFileType || CONSTANT_FILE_OBJ.APP_CONSTANT.EMPTY == uploadFileType) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BinaryData : CheckMaliciousUploadFile : Execution end. : Attached file extension is undefined or null.');

                maliciousFileResponsObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
                maliciousFileResponsObj.errorMessage = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FILE_EXTENSION_NULL_UNDEFINE;
                return maliciousFileResponsObj;
            } else if (uploadFileType == CONSTANT_FILE_OBJ.APP_CONSTANT.FILE_TYPE_exe || uploadFileType == CONSTANT_FILE_OBJ.APP_CONSTANT.FILE_TYPE_EXE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : BinaryData : CheckMaliciousUploadFile : Execution end. : Attached file extension is .exe, So file can not be upload into server.');

                maliciousFileResponsObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
                maliciousFileResponsObj.errorMessage = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FILE_EXTENSION_EXE;
                return maliciousFileResponsObj;
            } else {
                // Allow only define file type extension only, Which is defined into app config file.
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BinaryData : CheckMaliciousUploadFile : ALLOWED_FILE_EXTENSION_TYPES : ' + ALLOWED_FILE_EXTENSION_TYPES);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BinaryData : CheckMaliciousUploadFile : uploadFileType : ' + uploadFileType.toLowerCase());

                if (uploadFileType && ALLOWED_FILE_EXTENSION_TYPES.includes(uploadFileType)) {
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : BinaryData : CheckMaliciousUploadFile : Execution end. : Upload file is not malicious file and file type is matching with allowed file type.');
                    maliciousFileResponsObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                    maliciousFileResponsObj.errorMessage = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    return maliciousFileResponsObj;
                } else {
                    // file type extension is not matached with defined allowed list. so we can not upload file into server
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : BinaryData : CheckMaliciousUploadFile : Execution end. : Uploading file extesion is not matching to allowed file extension list defined in appConfig.js file');
                    maliciousFileResponsObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
                    maliciousFileResponsObj.errorMessage = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.FILE_EXTENSION_NOT_EXISTING_ALLOWED_LIST;
                    return maliciousFileResponsObj;
                }
            }
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : BinaryData : CheckMaliciousUploadFile : Execution end. : Got some unchacked error : Error detail : ' + error.stack);
            maliciousFileResponsObj.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
            maliciousFileResponsObj.errorMessage = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.MALICIOUS_ATTACH_FILE_ERROR;
            return maliciousFileResponsObj;
        }
    }

}

async function checkFileContent(fileCheck) {
    try {
        logger.log('info', 'User Id : ' + fileCheck.userIdFromToken + ' : BinaryData : checkFileContent : Execution started.');
        if (fileCheck.error) {
            logger.log('error', 'User Id : ' + fileCheck.userIdFromToken + ' : BinaryData : checkFileContent : Execution end. : File renaming got error : Error details : ' + error);
            // Send negative response
            fileCheck.fileUploadResponseObject.status = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
            fileCheck.fileUploadResponseObject.errorMessage = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_ATTACH_FILE_ERROR;

            callback(fileCheck.fileUploadResponseObject);
        } else {
            // console.log("fileCheck",fileCheck)
            logger.log('info', 'User Id : ' + fileCheck.userIdFromToken + ' : BinaryData : checkFileContent : File name renamed with unique id successfully.');

            const IS_VALID_FILE = await checkFileMime(fileCheck.newFilePathWithFileName, fileCheck.allowedFileMimeType, fileCheck.userIdFromToken, fileCheck.uploadFileMimeType);

            logger.log('info', 'User Id : ' + fileCheck.userIdFromToken + ' : BinaryData : checkFileContent : IS_VALID_FILE = ' + IS_VALID_FILE);

            const SFTPUniqueFileName = fileCheck.uniqueId + "_" + fileCheck.uploadedFileName;
            const SFTPFilePath = APP_CONFIG.FILE_UPLOAD.FILE_PATH_SFTP_SERVER + SFTPUniqueFileName;

            //read the file from API server and get the file content to send to sftp server
            //const FILE_DATA_FROM_READ    = FILE_SYSTEM.readFileSync(fileCheck.newFilePathWithFileName);
            //const FILE_DATA_CONTENT      = Buffer.from(FILE_DATA_FROM_READ, 'binary');

            //get the file from specified path of API server, to send to sftp server
            const FILE_DATA_CONTENT = fileCheck.newFilePathWithFileName
            let fileUploadedSFTPResponse = await uploadFileToRemoteServer(FILE_DATA_CONTENT, SFTPFilePath, fileCheck.userIdFromToken, fileCheck.uploadFileType);
            logger.log('info', 'User Id : ' + fileCheck.userIdFromToken + ' : BinaryData : uploadFilesInBinaryFormat :fileUploadedSFTPResponse : ' + fileUploadedSFTPResponse);

            if (IS_VALID_FILE && fileUploadedSFTPResponse) {
                logger.log('info', 'User Id : ' + fileCheck.userIdFromToken + ' : BinaryData : checkFileContent : Execution end. : File mime type is allowed mime type and file dumped into sftp server successfully.');
                successFileUploadHandler(fileCheck);
            } else {
                logger.log('error', 'User Id : ' + fileCheck.userIdFromToken + ' : BinaryData : checkFileContent : Execution end. : File mime type is not allowed mime type or couldnot able to dump file to sftp server');
                maliciousErrorHandler(fileCheck);
            }
        }
    } catch (error) {
        logger.log('error', 'User Id : ' + fileCheck.userIdFromToken + ' BinaryData : checkFileContent : Execution end. : Got unhandle error : error details : ' + error.stack);
        fileCheck.fileUploadResponseObject.status = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
        fileCheck.fileUploadResponseObject.errorMessage = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_ATTACH_FILE_ERROR;
        callback(fileCheck.fileUploadResponseObject);
    }
}

async function checkFileMime(newFilePathWithFileName, allowedFileMimeType, userIdFromToken, uploadFileMimeType) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BinaryData : checkFileMime : Execution started.');

        let isValidFile = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
        // console.log("newFilePathWithFileName",newFilePathWithFileName)
        let FILE_TYPE_OBJ = await FILE_TYPE.fromFile(newFilePathWithFileName);
        if (uploadFileMimeType && FILE_TYPE_OBJ == undefined) FILE_TYPE_OBJ = { mime: uploadFileMimeType };
        if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FILE_TYPE_OBJ || !(allowedFileMimeType.includes(FILE_TYPE_OBJ.mime))) {
            /**
             * Deleting file, if file mime type is not allowed.
             */
            FILE_SYSTEM.unlinkSync(newFilePathWithFileName);
            isValidFile = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
        }
        logger.log('info', 'User Id : ' + userIdFromToken + ' : BinaryData : checkFileMime : Execution end. : Uploaded file mime type is allowed mime type. : ' + FILE_TYPE_OBJ.mime);
        return isValidFile;
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' BinaryData : checkFileMime : Execution end. : Got unhandle error : error details : ' + error.stack);

        isValidFile = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
        return isValidFile;
    }
}

async function successFileUploadHandler(fileCheck) {
    try {
        logger.log('info', 'User Id : ' + fileCheck.userIdFromToken + ' : BinaryData : successFileUploadHandler : Execution started.');
        const FILE_DATA_FROM_READ = FILE_SYSTEM.readFileSync(fileCheck.newFilePathWithFileName);
        const FILE_DATA_CONTENT = Buffer.from(FILE_DATA_FROM_READ, 'binary');

        fileCheck.fileUploadResponseObject.status = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
        fileCheck.fileUploadResponseObject.fileUniqueId = fileCheck.uniqueId;
        fileCheck.fileUploadResponseObject.fileName = fileCheck.uploadedFileName;
        fileCheck.fileUploadResponseObject.fileExtension = fileCheck.uploadFileType;
        fileCheck.fileUploadResponseObject.fileDataContent = FILE_DATA_CONTENT;
        fileCheck.fileUploadResponseObject.errorMessage = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;




        logger.log('info', 'User Id : ' + fileCheck.userIdFromToken + ' : BinaryData : successFileUploadHandler : Execution end.');
        fileCheck.callback(fileCheck.fileUploadResponseObject);
    } catch (error) {
        logger.log('error', 'User Id : ' + fileCheck.userIdFromToken + ' : BinaryData : successFileUploadHandler : Execution end. : Got unchecked error : Error details : ' + error.stack);
        fileCheck.fileUploadResponseObject.status = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
        fileCheck.fileUploadResponseObject.errorMessage = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_ATTACH_FILE_ERROR;
        fileCheck.callback(fileCheck.fileUploadResponseObject);
    }
}

async function maliciousErrorHandler(fileCheck) {
    try {
        logger.log('error', 'User Id : ' + fileCheck.userIdFromToken + ' : BinaryData : maliciousErrorHandler : Uploaded file is a malicious file.  : Error details : ' + fileCheck.error);

        fileCheck.fileUploadResponseObject.status = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
        fileCheck.fileUploadResponseObject.errorMessage = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ERROR_ALLOWED_FILE_EXTENSION;

        fileCheck.callback(fileCheck.fileUploadResponseObject);
    } catch (error) {
        logger.log('error', 'User Id : ' + fileCheck.userIdFromToken + ' : BinaryData : maliciousErrorHandler : Got unchecked error  : Error details : ' + error.stack);
        fileCheck.callback(fileCheck.fileUploadResponseObject);
    }
}

async function uploadFileToRemoteServer(fileContent, filePath, userIdFromToken, uploadedFileExtension) {
    logger.log('info', 'User Id :: BinaryData : uploadFileToRemoteServer : Execution started.');
    const sftp = new Client(); // Create SftpClient instance here
    let SFTP_CONNECTION_CONFIG = {
        host: APP_CONFIG.SFTP_CONFIG.host,
        port: APP_CONFIG.SFTP_CONFIG.port,
        username: APP_CONFIG.SFTP_CONFIG.username,
        password: utilityAppObject.decryptDataByPrivateKey(APP_CONFIG.SFTP_CONFIG.password)
    };
    try {
        if (uploadedFileExtension === '.pdf' || uploadedFileExtension === 'pdf') {
            const res = await isPDFFileValid(fileContent);
            if (!res.isValidPDF) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : BinaryData : uploadFileToRemoteServer : uploaded file is having malicious content. res.isValidPDF : ' + res.isValidPDF);
                return false;
            }
        }
        await sftp.connect(SFTP_CONNECTION_CONFIG);
        logger.log('info', 'User Id : ' + userIdFromToken + ': BinaryData : uploadFileToRemoteServer : Connected to SFTP server successsfully ');
        // await sftp.put(fileContent, filePath); // Use sftp.put to upload the file
        await sftp.fastPut(fileContent, filePath);
        logger.log('info', 'User Id : ' + userIdFromToken + ': BinaryData : uploadFileToRemoteServer : file dumped into location : filePath : ' + filePath);

        return true;
    } catch (error) {
        logger.log('info', 'User Id : ' + userIdFromToken + ': BinaryData : uploadFileToRemoteServer : Execution end.' + error.stack);
        return false;
    } finally {
        logger.log('info', 'User Id : ' + userIdFromToken + ': BinaryData : uploadFileToRemoteServer : connection got end. : ');
        await sftp.end();
    }
}

async function isPDFFileValid(buffer) {
    return pdf(buffer).then(function (data) {
        if (!data.text.trim()) {
            return { isValidPDF: false, info: null };
        }
        return { isValidPDF: true, info: data.info };
    }, (err) => {
        return { isValidPDF: false, info: null };
    });
}

