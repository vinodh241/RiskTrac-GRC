const CONSTANT_FILE_OBJ = require("./constants/constant.js");
const ENUMS_OBJ         = require("./enums/enums.js");
const APP_CONFIG        = require("../config/app-config.js")


module.exports = class ComputationsUtility {
    constructor() {
    }


     /**
     * This function will calculate risk rating       
     * @param {*} userIdFromToken
     * @param {*} likelihoodID 
     * @param {*} impactID 
     */
    async calcutateRiskRating(userIdFromToken,likelihoodID,impactID,riskRanges){
        let overAllRating = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
        let overAllRiskRating = [];
        try{
            logger.log('info', 'User Id : '+ userIdFromToken +' : ComputationsUtility : calcutateRiskRating : Execution Started ');

            let formula = APP_CONFIG.COMPUTATIONAL_FORMULA.RISK_RATING_FORMULA;

            overAllRating = eval(formula);

            if(overAllRating > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                overAllRiskRating = await this.getRiskRating(userIdFromToken,overAllRating,riskRanges);
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : ComputationsUtility : calcutateRiskRating : Execution End ');
            return overAllRiskRating;

        }catch(error){
            logger.log('error', 'User Id : '+ userIdFromToken +' : ComputationsUtility : calcutateRiskRating : Execution End ' + error);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        }
    }

    /**
     * This function will derive residual risk rating from the matrix based on 
     * Overall Inherent Risk Rating + Control Effectiveness
     * @param {*} userIdFromToken
     * @param {*} overallInherentRiskRatingId 
     * @param {*} controlEffectivenessId 
     * @param {*} residualRiskMatrix - Array of matrix rows from BCM.SRA_ResidualRiskMatrix
     */
    async getResidualRiskFromMatrix(userIdFromToken, overallInherentRiskRatingId, controlEffectivenessId, residualRiskMatrix) {
        let residualRiskRating = null;
        try {
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ComputationsUtility : getResidualRiskFromMatrix : Execution Started');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ComputationsUtility : getResidualRiskFromMatrix : OverallInherentRiskRatingID = ' + overallInherentRiskRatingId + ', ControlEffectivenessID = ' + controlEffectivenessId);

            if (!residualRiskMatrix || residualRiskMatrix.length === 0) {
                logger.log('warn', 'User Id : ' + userIdFromToken + ' : ComputationsUtility : getResidualRiskFromMatrix : Residual risk matrix data is empty or null.');
                return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            }

            // Matrix lookup: find the matching row
            const matchedRow = residualRiskMatrix.find(
                row => Number(row.OverallInherentRiskRatingID) === Number(overallInherentRiskRatingId)
                    && Number(row.ControlEffectivenessID) === Number(controlEffectivenessId)
            );

            if (matchedRow) {
                residualRiskRating = {
                    "OverallResidualRiskRatingID": matchedRow.OverallResidualRiskRatingID,
                    "OverallResidualRiskRating": matchedRow.OverallResidualRiskRating
                };
                logger.log('info', 'User Id : ' + userIdFromToken + ' : ComputationsUtility : getResidualRiskFromMatrix : Matrix match found → OverallResidualRiskRatingID = ' + matchedRow.OverallResidualRiskRatingID + ', OverallResidualRiskRating = ' + matchedRow.OverallResidualRiskRating);
            } else {
                logger.log('warn', 'User Id : ' + userIdFromToken + ' : ComputationsUtility : getResidualRiskFromMatrix : No matrix match found for OverallInherentRiskRatingID = ' + overallInherentRiskRatingId + ', ControlEffectivenessID = ' + controlEffectivenessId);
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ComputationsUtility : getResidualRiskFromMatrix : Execution End');
            return residualRiskRating;

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ComputationsUtility : getResidualRiskFromMatrix : Execution End ' + error);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        }
    }

    async getRiskRating(userIdFromToken,currentriskrating,riskRanges){
        let riskRating = []

        try{
            logger.log('info', 'User Id : '+ userIdFromToken +' : ComputationsUtility : getRiskRating : Execution Started ');

            riskRanges.forEach(ele => {
                if (ele.Computation.includes('&')) {
                    let data = ele.Computation.split('&');
                    let min = `${currentriskrating}${data[0]}`;
                    let max = `${currentriskrating}${data[1]}`;
                        if (eval(min) && eval(max) ) {
                            riskRating.push(ele);
                        }
                } else {
                    let val = `${currentriskrating}${ele.Computation}`;
                    if (eval(val)) {
                        riskRating.push(ele);
                    }
                }
            });
            return riskRating;

        }catch(error){
            logger.log('error', 'User Id : '+ userIdFromToken +' : ComputationsUtility : getRiskRating : Execution End ' + error);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        }
    }

}




