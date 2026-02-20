const sql                                   = require('mssql');
var dynamicMasterManagementClassInstance    = null;
const DB_CONFIG                             = require('../../../config/db-config');
const MESSAGE_FILE_OBJ                      = require("../../../utility/message/message-constant.js");
const CONSTANT_FILE_OBJ                     = require("../../../utility/constants/constant.js");
const { logger }                            = require("../../../utility/log-manager/log-manager.js");
const fs                                    = require('fs');
const path                                  = require('path');

class DynamicMasterManagement {
    constructor() { }
    start() { }

    async addWebPageConfiguration(request, response) {
        let data = request.body.data;
        let tableName = data.PageTitle.replace(/\s+/g, '');
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : addWebPageConfiguration : Execution started.');

            let query = `
            CREATE TABLE BCM.MasterData_${tableName} (
                ID INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
                NAME NVARCHAR(512) NOT NULL,                                   
                IsActive bit DEFAULT 1,  
                IsDeleted bit DEFAULT 0, 
                CreatedDate DATETIME,
                CreatedBy NVARCHAR(512),
                LastUpdatedDate DATETIME,
                LastUpdatedBy NVARCHAR(512),
                AccountGUID UNIQUEIDENTIFIER NULL
            )`;  //--Description NVARCHAR(512) NULL,  
            let createProcedureQuery = `
                CREATE PROCEDURE BCM.Master_${tableName}
                AS
                BEGIN
                    SELECT * FROM BCM.MasterData_${tableName};
                END`;

            await global.poolConnectionObject.request().query(query);
            await global.poolConnectionObject.request().query(createProcedureQuery);

            const result = await global.poolConnectionObject.request()
                .input("PageTitle", sql.NVarChar, data.PageTitle)
                .input("DisplayName", sql.NVarChar, data.PageDisplayName)
                .input("HeaderButtonTitle", sql.NVarChar, data.AddButtonTitle)
                .input("PopUpTitle", sql.NVarChar, data.PopupTitle)
                .input("SaveButtonTitle", sql.NVarChar, data.SaveButtonTitle)
                .input("CancelButtonTitle", sql.NVarChar, data.CancelButtonTitle)
                // .input("MasterModule",         sql.NVarChar, data.MasterModule)
                .input("AccountGUID", sql.UniqueIdentifier, data.accountGUIDFromToken)
                .output("Success", sql.Bit)
                .output("OutMessage", sql.VarChar)
                .execute("BCM.MasterData_AddWebpageConfigurations");

            const { recordsets, output } = result;
            const responseData = recordsets[0];

            const filePathTable = path.join(__dirname, '..', '..', '..', 'file-upload', 'dynamic-master-query', `BCM.MasterData_${data.PageTitle}.txt`);
            const filePathProc = path.join(__dirname, '..', '..', '..', 'file-upload', 'dynamic-master-query', `BCM.Master_${data.PageTitle}.txt`);

            // Create directory if it doesn't exist
            const directoryTable = path.dirname(filePathTable);
            if (!fs.existsSync(directoryTable)) {
                fs.mkdirSync(directoryTable, { recursive: true });
            }
            const directoryProc = path.dirname(filePathProc);
            if (!fs.existsSync(directoryProc)) {
                fs.mkdirSync(directoryProc, { recursive: true });
            }

            // Write the query string to the file
            fs.writeFile(filePathTable, query, (err) => {
                if (err) throw err;
                logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : addWebPageConfiguration : Query saved to file:' + filePathTable);
            });

            fs.writeFile(filePathProc, createProcedureQuery, (err) => {
                if (err) throw err;
                logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : addWebPageConfiguration : Query saved to file:' + filePathProc);
            });

            response.status(200).json({ message: 'web page configured successfully', data: responseData, error: null, success: 1, token: refreshedToken });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : addWebPageConfiguration : Execution end. : Got unhandled error. : Error Detail : ' + error.stack);
            response.status(500).json({ message: "Internal Server Error", error: error.stack, success: 0, token: refreshedToken });
        }
    }

    async getWebPageConfiguration(request, response) {
        let data = request.body;
        let pageList = []
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getWebPageConfiguration : Execution started.');
            const pool = await global.poolConnectionObject;
            const result = await pool.request()
                .input("PageID", sql.NVarChar, data.PageID)
                .input("AccountGUID", sql.UniqueIdentifier, data.accountGUIDFromToken)
                .output("Success", sql.Bit)
                .output("OutMessage", sql.VarChar)
                .execute("BCM.MasterData_GetWebpageConfigurations");

            const { recordsets, output } = result;
            let responseData = recordsets[0];
            responseData = responseData.filter(ob => ob.IsActive == 1);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getWebPageConfiguration : responseData : ' + JSON.stringify(responseData));


            responseData = responseData.sort(function (a, b) {
                if (a.DisplayName < b.DisplayName) {
                    return -1;
                } if (a.DisplayName > b.DisplayName) {
                    return 1;
                } return 0;
            })

            responseData.forEach(ob => {
                pageList.push({ "PageID": ob.PageID, "PageTitle": ob.PageTitle, "DisplayName": ob.DisplayName })
            })
            const queryResult = await pool.request()
                .input('AccountGUID', sql.UniqueIdentifier, accountGUIDFromToken)
                .query(`SELECT * FROM BCM.MasterData_WebControlConfigurations WHERE AccountGUID = @AccountGUID`);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getWebPageConfiguration : queryResult : ' + JSON.stringify(queryResult));
            let records = queryResult.recordset;

            records = records.map((item, index) => ({ 'Sl No': index + 1, ...item }));

            let headerList = Array.from(new Set(records.flatMap(obj => Object.keys(obj)))).filter(key => key !== 'PageID' &&
                key !== 'CreatedDate' && key !== 'CreatedBy' && key !== 'LastUpdatedDate' &&
                key !== 'LastUpdatedBy' && key !== 'IsDeleted' && key !== 'IsActive' && key !== 'WebControlID' && key != 'AccountGUID');

            response.status(200).json({ message: 'web page fetched successfully', success: 1, error: null, data: responseData, pageList, records, headerList, token: refreshedToken });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getWebPageConfiguration : Execution end. : Got unhandled error. : Error Detail : ' + error.stack);
            response.status(500).json({ message: "Internal Server Error", error: error.stack, success: 0, token: refreshedToken });
        }
    }

    async getInfoMasterFields(request, response) {
        let data = request.body.data;
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getInfoMasterFields : Execution started.');

            const poolConnectionObject = await global.poolConnectionObject;
            const result = await poolConnectionObject.request();
            let procedureCreationResult = null;
            let createProcedureQuery = null;
            let tableName = data.PageTitle.replace(/\s+/g, '');

            createProcedureQuery = `
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'MasterData_${tableName}' 
                AND TABLE_SCHEMA = 'BCM' 
                AND TABLE_CATALOG = '${DB_CONFIG.database}'`;

            procedureCreationResult = await result.query(createProcedureQuery);
            const { recordsets, output } = procedureCreationResult;
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getInfoMasterFields : procedureCreationResult : ' + JSON.stringify(procedureCreationResult));
            let headerList = []
            let dataArr1 = recordsets[0].filter(ob => ob.COLUMN_NAME !== 'CreatedDate' && ob.COLUMN_NAME !== 'CreatedBy' && ob.COLUMN_NAME !== 'IsActive' &&
                ob.COLUMN_NAME !== 'LastUpdatedDate' && ob.COLUMN_NAME != 'AccountGUID' && ob.COLUMN_NAME !== 'LastUpdatedBy' && ob.COLUMN_NAME !== 'IsDeleted' && ob.COLUMN_NAME !== 'ID');

            dataArr1.forEach(ob => {
                headerList.push({ "header": ob.COLUMN_NAME });
            });
            headerList.push({ "header": "AddNewfield" });

            let selectedTableHeader = recordsets[0].filter(ob => ob.COLUMN_NAME !== 'CreatedDate' && ob.COLUMN_NAME !== 'CreatedBy' && ob.COLUMN_NAME !== 'IsActive' &&
                ob.COLUMN_NAME !== 'LastUpdatedDate' && ob.COLUMN_NAME != 'AccountGUID' && ob.COLUMN_NAME !== 'LastUpdatedBy' && ob.COLUMN_NAME !== 'IsDeleted');

            selectedTableHeader.map(ob => ({ header: ob.COLUMN_NAME }));

            response.status(200).json({ message: 'data fetched successfully', success: 1, data: headerList, error: null, selectedTableHeader, token: refreshedToken });

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getWebPageConfiguration : Execution end. : Got unhandled error. : Error Detail : ' + error.stack);
            response.status(500).json({ message: "Internal Server Error", error: error.stack, success: 0, token: refreshedToken });
        }
    }

    async execProcedure(request, response) {
        let data = request.body.data;
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : execProcedure : Execution started.');

            const poolConnectionObject = await global.poolConnectionObject;
            try {
                const result = await poolConnectionObject.request()
                    .input('AccountGUID', sql.UniqueIdentifier, accountGUIDFromToken) // Pass the accountGUID as a parameter
                    .execute(`BCM.Master_${data.PageTitle.replace(/\s+/g, '')}`); // Use execute to run the stored procedure

                const { recordsets, output } = result;
                const responseData = recordsets[0];

                logger.log('info', 'Procedure executed successfully. Result: ' + JSON.stringify(result));

            } catch (error) {
                logger.log('error', 'Database procedure execution error: ' + error.message);
            }

            response.status(200).json({ message: 'data fetched successfully', success: 1, error: null, data: responseData, token: refreshedToken });

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : execProcedure : Execution end. : Got unhandled error. : Error Detail : ' + error.stack);
            response.status(500).json({ message: "Internal Server Error", error: error.stack, success: 0, token: refreshedToken });
        }
    }

    async addData(request, response) {
        let data = request.body.data.TableData;
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : addData : Execution started.');

            const poolConnectionObject = await global.poolConnectionObject;
            const result = await poolConnectionObject.request();
            let procedureCreationResult = null;
            let createProcedureQuery = null;
            let tableName = request.body.data.PageTitle.replace(/\s+/g, '');

            const currentDate = new Date();
            const offset = -currentDate.getTimezoneOffset();
            currentDate.setMinutes(currentDate.getMinutes() + offset);
            const formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ").replace(/-/g, '/');

            data.LastUpdatedDate = formattedDate;
            data.LastUpdatedBy = userNameFromToken;
            data.CreatedDate = formattedDate;
            data.CreatedBy = userNameFromToken;
            data.AccountGUID = accountGUIDFromToken;
            const columns = Object.keys(data).join(', ');
            const values = Object.keys(data).map(key => `@${key}`).join(', ');

            createProcedureQuery = `INSERT INTO BCM.MasterData_${tableName} (${columns}) VALUES (${values})`;

            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    result.input(key, data[key]);
                }
            }

            procedureCreationResult = await result.query(createProcedureQuery);
            const { recordsets, output } = procedureCreationResult;
            const responseData = recordsets[0];

            response.status(200).json({ message: 'Data added successfully', success: 1, error: null, data: responseData, token: refreshedToken });

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : addData : Execution end. : Got unhandled error. : Error Detail : ' + error.stack);
            response.status(500).json({ message: "Internal Server Error", error: error.stack, success: 0, token: refreshedToken });
        }
    }

    async addWebPageControlConfiguration(request, response) {
        let data = request.body.data;
        let tableName = data.SelectPage.replace(/\s+/g, '');
        let dataType = null;
        let query = null;
        let tableCreationResult = null;
        let childtableresult = null;

        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : addWebPageControlConfiguration : Execution started.');

            const result = await global.poolConnectionObject.request()
                .input("WebControlID", sql.BigInt, data.WebControlID)
                .input("PageID", sql.BigInt, data.PageID)
                .input("TableControl", sql.NVarChar, data.SelectHeader == "AddNewfield" ? data.newParameter : data.SelectHeader)
                .input("Name", sql.NVarChar, data.name)
                .input("LabelName", sql.NVarChar, data.label)
                .input("Value", sql.NVarChar, data.value)
                .input("Placeholder", sql.NVarChar, data.Placeholder)
                .input("Class", sql.NVarChar, data.Class)
                .input("Type", sql.NVarChar, data.Type)
                .input("IsRequired", sql.Bit, data.IsRequired)
                .input("IsActive", sql.Bit, data.IsActive)
                .input("IsDeleted", sql.Bit, data.IsDeleted)
                .input("AccountGUID", sql.UniqueIdentifier, accountGUIDFromToken)
                .output("Success", sql.Bit)
                .output("OutMessage", sql.VarChar)
                .execute("BCM.MasterData_AddWebControlConfigurations");

            const { recordsets, output } = result;
            const responseData = recordsets[0];

            try {
                let query;
                if (data.IsForeignKey && data.newParameter && data.newParameter !== "") {
                    let val = data.newParameter !== "" ? data.newParameter : data.name;
                    query = `
                        ALTER TABLE BCM.MasterData_${tableName}
                        ADD [${data.newParameter}] INT  NULL;
            
                        ALTER TABLE BCM.MasterData_${tableName}
                        ADD CONSTRAINT FK_${tableName}_${data.newParameter}
                        FOREIGN KEY (${data.newParameter})
                        REFERENCES BCM.MasterData_${data.selectedTableNames}(${data.selectedTableHeader});`;

                } else if (data.newParameter && data.newParameter !== "") {
                    query = `
                        ALTER TABLE BCM.MasterData_${tableName} 
                        ADD [${data.newParameter}] ${data.Type === 'number' ? 'int' : 'nvarchar(512)'} NULL;`;
                }
                tableCreationResult = await global.poolConnectionObject.request().query(query);

                const filePathTable = path.join(__dirname, '..', '..', '..', 'file-upload', 'dynamic-master-query', `BCM.MasterData_${tableName}.txt`);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : addWebPageControlConfiguration : Query saved to file:' + filePathTable);

                const directoryTable = path.dirname(filePathTable);
                if (!fs.existsSync(directoryTable)) {
                    fs.mkdirSync(directoryTable, { recursive: true });
                }

                // Write the query string to the file
                fs.writeFile(filePathTable, query, (err) => {
                    if (err) throw err;
                    logger.log('Query saved to file:', filePathTable);
                });

            } catch (err) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : addWebPageControlConfiguration : Execution end. : Got unhandled error. : Error Detail : ' + err.stack);
                response.status(500).json({ message: "Internal Server Error", error: err.stack, success: 0, token: refreshedToken });

            }

            response.status(200).json({ message: 'web page control added successfully', success: 1, error: null, data: responseData, query, tableCreationResult, childtableresult, token: refreshedToken });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : addWebPageControlConfiguration : Execution end. : Got unhandled error. : Error Detail : ' + error.stack);
            response.status(500).json({ message: "Internal Server Error", error: error.stack, success: 0, token: refreshedToken });
        }
    }

    async getWebPageControlConfiguration(request, response) {
        let data = request.body.data;
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getWebPageControlConfiguration : Execution started.');

            const result = await global.poolConnectionObject.request()
                .input("PageID", sql.NVarChar, data.PageID)
                .input("AccountGUID", sql.UniqueIdentifier, accountGUIDFromToken)
                .output("Success", sql.Bit)
                .output("OutMessage", sql.VarChar)
                .execute("BCM.MasterData_GetWebControlConfigurations");

            const { recordsets: webControlConfigurations, output } = result;
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getWebPageControlConfiguration : webControlConfigurations : ' + JSON.stringify(webControlConfigurations[0]));


            let tableName = data.PageTitle.replace(/\s+/g, '');
            const createProcedureQuery = `
                SELECT
                    fk.name AS ForeignKeyName,
                    tp.name AS ReferencedTableName
                FROM
                    sys.foreign_keys AS fk
                INNER JOIN
                    sys.tables AS t
                ON
                    fk.parent_object_id = t.object_id
                INNER JOIN
                    sys.tables AS tp
                ON
                    fk.referenced_object_id = tp.object_id
                WHERE
                    t.name = 'MasterData_${tableName}';`;

            const procedureCreationResult = await global.poolConnectionObject.request().query(createProcedureQuery);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getWebPageControlConfiguration : procedureCreationResult: .' + JSON.stringify(procedureCreationResult));
            // console.log('procedureCreationResult: '+JSON.stringify(procedureCreationResult))
            let { recordsets: foreignKeyResult, output: foreignKeyOutput } = procedureCreationResult;
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getWebPageControlConfiguration : foreignKeyResult : ' + JSON.stringify(foreignKeyResult));

            foreignKeyResult = foreignKeyResult[0].filter(n => n.ReferencedTableName != 'Accounts')
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getWebPageControlConfiguration : foreignKeyResult : ' + JSON.stringify(foreignKeyResult));

            if (foreignKeyResult.length > 0) {
                try {
                    const tableCreationResults = await Promise.all(
                        foreignKeyResult.map(async ob => {
                            const result = await global.poolConnectionObject.request()
                                .input('AccountGUID', sql.UniqueIdentifier, accountGUIDFromToken)
                                .query(`SELECT * FROM BCM.${ob.ReferencedTableName} WHERE AccountGUID = @AccountGUID`);

                            const recordset = result.recordsets[0];

                            const mappedOb = recordset.map(item => {
                                let filteredItem = { ...item };
                                delete filteredItem.CreatedDate;
                                delete filteredItem.CreatedBy;
                                delete filteredItem.LastUpdatedDate;
                                delete filteredItem.LastUpdatedBy;
                                delete filteredItem.IsDeleted;
                                delete filteredItem.AccountGUID
                                filteredItem.tableName = ob.ReferencedTableName.split('_')[1];
                                return filteredItem;
                            });

                            return mappedOb;
                        })
                    );
                    let flattenedData = tableCreationResults.flat();
                    flattenedData = flattenedData.filter(m => m.IsActive == true)

                    const mergedData = {
                        webControlConfigurations: webControlConfigurations[0],
                        referencedTableData: flattenedData
                    };
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getWebPageControlConfiguration : mergedData: .' + JSON.stringify(mergedData));
                    response.status(200).json({ message: 'Web page controls fetched successfully', success: 1, error: null, data: mergedData, token: refreshedToken });
                } catch (error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getWebPageControlConfiguration : Execution end. : Got unhandled error. : Error Detail : ' + error.stack);
                    response.status(500).json({ message: 'Internal Server Error', success: 0, token: refreshedToken });
                }
            } else {
                response.status(200).json({
                    message: 'Web page controls fetched successfully',
                    data: { webControlConfigurations: webControlConfigurations[0], referencedTableData: [] }, error: null, success: 1, token: refreshedToken
                });
            }
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getWebPageControlConfiguration : Execution end. : Got unhandled error. : Error Detail : ' + error.stack);
            response.status(500).json({ message: "Internal Server Error", error: error.stack, success: 0, token: refreshedToken });
        }
    }

    async getPageDetails(request, response) {
        let data = request.body;
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getPageDetails : Execution started.');

            const poolConnectionObject = await global.poolConnectionObject;
            const result = await poolConnectionObject.request();

            let tableName = data.PageTitle.replace(/\s+/g, '');
            let dataArr = [];
            let joinQuery = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let joinQueryResult = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let responseData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let headerList = [];
            let mergedArr = []
            let resArr = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let procExecResult = [];
            let childTableData = []
            let displayData = []

            const procResult = await global.poolConnectionObject.request()
                .input("PageID", sql.NVarChar, data.PageID)
                .input('AccountGUID', sql.UniqueIdentifier, accountGUIDFromToken)
                .output("Success", sql.Bit)
                .output("OutMessage", sql.VarChar)
                .execute("BCM.MasterData_GetWebpageConfigurations");

            let procResponseData = procResult.recordsets[0];
            procResponseData = procResponseData.filter(m => m.PageTitle == data.PageTitle);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getPageDetails : procresponsedata : ' + JSON.stringify(procResponseData));

            const createProcedure = `SELECT
                    fk.name AS ForeignKeyName,
                    tp.name AS ReferencedTableName
                FROM
                    sys.foreign_keys AS fk
                INNER JOIN
                    sys.tables AS t
                ON
                    fk.parent_object_id = t.object_id
                INNER JOIN
                    sys.tables AS tp
                ON
                    fk.referenced_object_id = tp.object_id
                WHERE
                    t.name = 'MasterData_${tableName}';`;

            const procedureResult = await global.poolConnectionObject.request().query(createProcedure);
            const { recordsets: foreignKeyResult, output: foreignKeyOutput } = procedureResult;
            let foreignKeys = foreignKeyResult[0];
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getPageDetails : foreignKeys : ' + JSON.stringify(foreignKeys));
            foreignKeys = foreignKeys.filter(n => n.ReferencedTableName !== "Accounts")
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getPageDetails : foreignKeys : ' + JSON.stringify(foreignKeys));

            if (foreignKeys.length) {
                for (const ob of foreignKeys) {
                    let refTable = ob.ReferencedTableName;
                    let colName = refTable.split('_')[1];

                    joinQuery = `
                        SELECT
                            CM.NAME AS [${colName} Name],
                            SM.*                        
                        FROM
                            [${DB_CONFIG.database}].[BCM].MasterData_${tableName} AS SM
                        INNER JOIN
                            [${DB_CONFIG.database}].[BCM].${refTable} AS CM
                        ON
                            SM.${colName} = CM.ID
                        WHERE
                            SM.AccountGUID = @AccountGUID;`;

                    joinQueryResult = await global.poolConnectionObject.request()
                        .input('AccountGUID', sql.UniqueIdentifier, accountGUIDFromToken)
                        .query(joinQuery);

                    dataArr.push(joinQueryResult.recordsets[0]);
                }

                // console.log(dataArr)
                mergedArr = dataArr.reduce((acc, curr) => {
                    let map = new Map(acc.map(obj => [obj.ID, obj]));
                    curr.forEach(obj => {
                        let existingObj = map.get(obj.ID);
                        if (existingObj) {
                            Object.assign(existingObj, obj);
                        } else {
                            map.set(obj.ID, obj);
                            acc.push(obj);
                        }
                    });
                    return acc;
                }, []);

            } else {

                const pool = await global.poolConnectionObject;
                const procedureCreationResult = await pool.request()
                    .input("AccountGUID", sql.UniqueIdentifier, accountGUIDFromToken)
                    .output("Success", sql.Bit)
                    .output("OutMessage", sql.VarChar)
                    .execute(`BCM.Master_${tableName}`);
                const { recordsets, output } = procedureCreationResult;
                mergedArr = recordsets[0] || [];

            }
            // mergedArr = mergedArr.map((item, index) => ({ 'Sl No': index + 1, ...item }));           
            mergedArr = mergedArr.map(ob => {
                let filteredOb = { ...ob };
                delete filteredOb.CreatedDate;
                delete filteredOb.CreatedBy;
                delete filteredOb.LastUpdatedDate;
                delete filteredOb.LastUpdatedBy;
                delete filteredOb.IsDeleted;
                delete filteredOb.AccountGUID;
                return filteredOb;
            });
            // headerList= Array.from(new Set(mergedArr.flatMap(obj => Object.keys(obj))));
            headerList = Array.from(new Set(mergedArr.flatMap(obj => Object.keys(obj)))).filter(key => key !== 'ID' && key !== 'IsActive');

            if (headerList == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || headerList == [] || headerList == "") {
                let createProcedureQuery1 = `
                    SELECT COLUMN_NAME
                    FROM INFORMATION_SCHEMA.COLUMNS
                    WHERE TABLE_NAME = 'MasterData_${tableName}'
                    AND TABLE_SCHEMA = 'BCM'
                    AND TABLE_CATALOG = '${DB_CONFIG.database}'`;

                let procedureCreationResult1 = await result.query(createProcedureQuery1);
                headerList = procedureCreationResult1.recordsets[0].map(ob => ob.COLUMN_NAME) || [];
                headerList = headerList.filter(ob => ob !== 'CreatedDate' && ob !== 'CreatedBy' && ob !== 'LastUpdatedDate' &&
                    ob !== 'LastUpdatedBy' && ob != 'AccountGUID' && ob !== 'IsDeleted' && ob !== 'IsActive' && ob !== 'ID');
                // headerList = ['Sl No',...headerList]
            }

            let checkRefrenceFieldName = `SELECT
                FK.name AS ForeignKeyName,
                TP.name AS TableName,
                CP.name AS ColumnName,
                RT.name AS ReferencedTableName,
                RC.name AS ReferencedColumnName
                FROM
                    sys.foreign_keys AS FK
                INNER JOIN
                    sys.tables AS TP ON FK.parent_object_id = TP.object_id
                INNER JOIN
                    sys.tables AS RT ON FK.referenced_object_id = RT.object_id
                INNER JOIN
                    sys.foreign_key_columns AS FKC ON FK.object_id = FKC.constraint_object_id
                INNER JOIN
                    sys.columns AS CP ON FKC.parent_column_id = CP.column_id AND FKC.parent_object_id = CP.object_id
                INNER JOIN
                    sys.columns AS RC ON FKC.referenced_column_id = RC.column_id AND FKC.referenced_object_id = RC.object_id
                WHERE
                    TP.name = 'MasterData_${tableName}' AND
                    TP.schema_id = SCHEMA_ID('BCM');`

            const RefFiledResult = await global.poolConnectionObject.request().query(checkRefrenceFieldName);

            let refFiledResponse = RefFiledResult.recordsets[0];
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getPageDetails : refFieldResponse : ' + JSON.stringify(refFiledResponse));

            if (refFiledResponse.length) {
                refFiledResponse = refFiledResponse.map(ob => ob.ColumnName);
                headerList = headerList.filter(field => !refFiledResponse.includes(field));
            }

            let checkRecord = `SELECT
                t.name AS ChildTableName,
                fk.name AS ForeignKeyName
                FROM
                    sys.foreign_keys AS fk
                INNER JOIN
                    sys.tables AS t
                ON
                    fk.parent_object_id = t.object_id
                INNER JOIN
                    sys.tables AS tp
                ON
                    fk.referenced_object_id = tp.object_id
                WHERE
                    tp.name = 'MasterData_${tableName}'`;

            let PrimaryTableData = await global.poolConnectionObject.request().query(checkRecord);
            PrimaryTableData = PrimaryTableData.recordsets[0];

            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getPageDetails : PrimaryTableData : ' + JSON.stringify(PrimaryTableData));
            if (PrimaryTableData.length) {
                for (const ob of PrimaryTableData) {
                    let FKey = ob.ForeignKeyName.substring(ob.ForeignKeyName.lastIndexOf('_') + 1);

                    let joinQuery = `
                    SELECT                        
                        REF.*, PM.NAME AS LinkedName
                    FROM
                        [BCM].${ob.ChildTableName} AS REF
                    JOIN                            
                        [BCM].MasterData_${tableName} AS PM
                    ON
                        PM.ID = REF.${FKey}
                    WHERE
                        REF.AccountGUID = @AccountGUID AND PM.IsDeleted = 0 AND REF.IsDeleted = 0` ;

                    const procExecResult = await global.poolConnectionObject.request()
                        .input('AccountGUID', sql.UniqueIdentifier, accountGUIDFromToken)
                        .query(joinQuery);
                    childTableData.push(procExecResult.recordsets[0])
                }
            }
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getPageDetails : childTableData 1 : ' + JSON.stringify(childTableData));

            if (childTableData.length > 1) {
                childTableData = childTableData.flat()
                // reduce((acc, curr) => {
                //     let map = new Map(acc.map(obj => [obj.ID, obj]));                
                //     curr.forEach(obj => {
                //         let existingObj = map.get(obj.ID);
                //         if (existingObj) {
                //             Object.assign(existingObj, obj);
                //         } else {
                //             map.set(obj.ID, obj);
                //             acc.push(obj);
                //         }
                //     });                
                //     return acc;
                // }, []);
                // console.log('if' + JSON.stringify(childTableData))
            } else if (childTableData.length == 1) {
                // console.log('else')
                childTableData = childTableData[0]
            }
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getPageDetails : childTableData : ' + JSON.stringify(childTableData));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getPageDetails : mergedArr : ' + JSON.stringify(mergedArr));
            let linkedData = []
            mergedArr.forEach(obj => {

                const filtered = childTableData.find(itr => obj.NAME == itr.LinkedName);
                if (filtered) {
                    linkedData.push({ ...obj, IslinkedRecord: 1 })
                } else {
                    linkedData.push({ ...obj, IslinkedRecord: 0 })

                }
            })
            if (mergedArr.length) {
                displayData = linkedData;
            }
            if (tableName == 'City') {
                headerList = ["Country Name", "State Name", "NAME"];
            } else {
                headerList = headerList;
            }
            displayData = displayData.length ? displayData : []
            response.status(200).json({ message: 'Data fetched successfully', success: 1, data: displayData, error: null, mergedArr, headerList, procResponseData, refFiledResponse, PrimaryTableData, childTableData, linkedData, token: refreshedToken });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getPageDetails : Execution end. : Got unhandled error. : Error Detail : ' + error.stack);
            response.status(500).json({ message: "Internal Server Error", error: error.stack, success: 0, token: refreshedToken });
        }
    }

    async editData(request, response) {
        let { TableData, PageTitle, IDInfo } = request.body.data;
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : editData : Execution started.');

            const currentDate = new Date();
            const offset = -currentDate.getTimezoneOffset();
            currentDate.setMinutes(currentDate.getMinutes() + offset);
            const formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ").replace(/-/g, '/');

            TableData.LastUpdatedDate = formattedDate;
            TableData.LastUpdatedBy = userNameFromToken;
            TableData.AccountGUID = accountGUIDFromToken;
            const poolConnectionObject = await global.poolConnectionObject;
            const result = await poolConnectionObject.request();
            let createProcedureQuery = null;
            let tableName = PageTitle.replace(/\s+/g, '');

            const updateColumns = Object.keys(TableData).map(key => `${key} = @${key}`).join(', ');
            createProcedureQuery = `UPDATE BCM.MasterData_${tableName} SET ${updateColumns} WHERE ID = @ID AND AccountGUID = @AccountGUID`;

            result.input('ID', IDInfo.ID);
            for (const key in TableData) {
                if (TableData.hasOwnProperty(key)) {
                    result.input(key, TableData[key]);
                }
            }
            const procedureCreationResult = await result.query(createProcedureQuery);
            const { rowsAffected } = procedureCreationResult;

            response.status(200).json({ message: 'Data updated successfully', success: 1, data: rowsAffected, error: null, token: refreshedToken });

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : editData : Execution end. : Got unhandled error. : Error Detail : ' + error.stack);
            response.status(500).json({ message: "Internal Server Error", error: error.stack, success: 0, token: refreshedToken });
        }
    }

    async getEditControlInfo(request, response) {
        let data = request.body.data;
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {

            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            let tableName = data.PageTitle.replace(/\s+/g, '');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getEditControlInfo : Execution started.');

            const procResult = await global.poolConnectionObject.request()
                .input("PageID", sql.NVarChar, data.PageID)
                .input("AccountGUID", sql.UniqueIdentifier, accountGUIDFromToken)
                .output("Success", sql.Bit)
                .output("OutMessage", sql.VarChar)
                .execute("BCM.MasterData_GetWebControlConfigurations");

            let procResponseData = procResult.recordsets[0];
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getEditControlInfo : procResponseData : .' + JSON.stringify(procResponseData));

            let procedureCreationResult = await global.poolConnectionObject.request()
                .input("AccountGUID", sql.UniqueIdentifier, accountGUIDFromToken)
                .output("Success", sql.Bit)
                .output("OutMessage", sql.VarChar)
                .execute(`BCM.Master_${tableName}`);

            procedureCreationResult = procedureCreationResult.recordsets[0];
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getEditControlInfo : procedureCreationResult : .' + JSON.stringify(procedureCreationResult));

            let filteredData = procedureCreationResult.filter(ob => {
                for (const key in ob) {
                    if (ob[key] === data.rowData.ID) {
                        // console.log(`Matched property: ${key}`);
                        return true;
                    } else {
                        // console.log(`UN Matched property: ${key}`);
                    }
                }
                return false;
            });
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getEditControlInfo : filteredData : .' + JSON.stringify(filteredData));
            filteredData = filteredData.filter(ob => ob.NAME == data.rowData.NAME)
            if (filteredData.length > 0) {
                procResponseData.forEach((item) => {
                    if (item.TableControl in filteredData[0]) {
                        item["AddedValue"] = filteredData[0][item.TableControl];
                    } else {
                        item["AddedValue"] = "";
                    }
                });
            } else {
                console.error('No matching data found.');
                response.status(500).json({ message: "Internal Server Error", error: error.stack, success: 0, token: refreshedToken });
            }
            // console.log('procResponseData : +'+JSON.stringify(procResponseData))

            const createProcedureQuery1 = `
                SELECT
                    fk.name AS ForeignKeyName,
                    tp.name AS ReferencedTableName
                FROM
                    sys.foreign_keys AS fk
                INNER JOIN
                    sys.tables AS t ON fk.parent_object_id = t.object_id
                INNER JOIN
                    sys.tables AS tp ON fk.referenced_object_id = tp.object_id
                WHERE
                    t.name = 'MasterData_${tableName}';`;

            const procedureCreationResult1 = await global.poolConnectionObject.request().query(createProcedureQuery1);
            let { recordsets: foreignKeyResult } = procedureCreationResult1;
            // console.log('foreignKeyResult: ' + JSON.stringify(foreignKeyResult));
            foreignKeyResult = foreignKeyResult[0].filter(n => n.ReferencedTableName !== "Accounts")

            if (foreignKeyResult.length > 0) {
                try {
                    const tableCreationResults = await Promise.all(
                        foreignKeyResult.map(async ob => {
                            // Modify the query to include AccountGUID filter
                            const result = await global.poolConnectionObject.request()
                                .input('AccountGUID', sql.UniqueIdentifier, accountGUIDFromToken) // Define the parameter
                                .query(`SELECT * FROM BCM.${ob.ReferencedTableName} WHERE AccountGUID = @AccountGUID`);

                            const recordset = result.recordsets[0];
                            const mappedOb = recordset.map(item => {
                                let filteredItem = { ...item };
                                delete filteredItem.CreatedDate;
                                delete filteredItem.CreatedBy;
                                delete filteredItem.LastUpdatedDate;
                                delete filteredItem.LastUpdatedBy;
                                delete filteredItem.IsDeleted;
                                delete filteredItem.AccountGUID;
                                filteredItem.tableName = ob.ReferencedTableName.split('_')[1];
                                return filteredItem;
                            });
                            return mappedOb;
                        })
                    );

                    let flattenedData = tableCreationResults.flat();
                    flattenedData = flattenedData.filter(m => m.IsActive === true);

                    response.status(200).json({
                        message: 'Web page controls fetched successfully',
                        data: procResponseData,
                        error: null,
                        referencedTableData: flattenedData,
                        success: 1,
                        token: refreshedToken
                    });
                } catch (error) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getEditControlInfo : Execution end. : Got unhandled error. : Error Detail : ' + error.stack);
                    response.status(500).json({ message: 'Internal Server Error', success: 0, token: refreshedToken });
                }
            } else {
                response.status(200).json({
                    message: 'Web page controls fetched successfully',
                    success: 1,
                    token: refreshedToken,
                    error: null,
                    data: procResponseData, referencedTableData: []
                });
            }


            // response.status(200).json({ message: 'Data fetched successfully', data:  procResponseData });
        } catch (error) {
            response.status(500).json({ message: "Internal Server Error", error: error.stack, success: 0, token: refreshedToken });
        }
    }

    async editRecordStatus(request, response) {
        let data = request.body.data
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let LastUpdatedBy = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            LastUpdatedBy = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : editRecordStatus : Execution started.');

            const poolConnectionObject = await global.poolConnectionObject;
            const result = await poolConnectionObject.request();
            let tableName = data.PageTitle.replace(/\s+/g, '');

            const currentDate = new Date();
            const offset = -currentDate.getTimezoneOffset();
            currentDate.setMinutes(currentDate.getMinutes() + offset);
            const formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ").replace(/-/g, '/');

            const createProcedureQuery = `UPDATE BCM.MasterData_${tableName}
                SET IsActive = @IsActive, LastUpdatedDate = @formattedDate, LastUpdatedBy = @LastUpdatedBy
                WHERE ID = @ID AND AccountGUID = @AccountGUID`;

            const procedureCreationResult = await result
                .input('IsActive', data.IsActive)
                .input('formattedDate', formattedDate)
                .input('LastUpdatedBy', LastUpdatedBy)
                .input('ID', data.IDInfo.ID)
                .input('AccountGUID', accountGUIDFromToken)
                .query(createProcedureQuery);

            response.status(200).json({ message: 'Data updated successfully', data: procedureCreationResult, error: null, token: refreshedToken, success: 1 });

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : editRecordStatus : Execution end. : Got unhandled error. : Error Detail : ' + error.stack);
            response.status(500).json({ message: "Internal Server Error", error: error.stack, success: 0, token: refreshedToken });
        }
    }

    async getUpdatedToken(request, response) {
        let refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        let resp = []

        try {
            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getUpdatedToken : Execution started.');

            response.status(200).json({ message: 'data fetched successfully', success: 1, error: null, data: resp, token: refreshedToken });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : DynamicMasterManagement : getUpdatedToken : Execution end. : Got unhandled error. : Error Detail : ' + error.stack);
            response.status(500).json({ message: "Internal Server Error", error: error.stack, success: 0, token: refreshedToken });
        }
    }

}

function getDynamicMasterManagementClassInstance() {
    if (dynamicMasterManagementClassInstance === null) {
        dynamicMasterManagementClassInstance = new DynamicMasterManagement();
    }
    return dynamicMasterManagementClassInstance;
}

exports.getDynamicMasterManagementClassInstance = getDynamicMasterManagementClassInstance;
