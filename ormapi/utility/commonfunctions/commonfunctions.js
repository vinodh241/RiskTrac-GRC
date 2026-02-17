const fs = require('fs');
const path = require('path');
const APP_CONFIG_FILE_OBJ = require('../../config/app-config.js');

function isBlank(v) {
    return v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
}

function trimOrEmpty(v) {
    return typeof v === 'string' ? v.trim() : v;
}

function isValidInt(v) {
    return Number.isInteger(v) && v > 0;
}

function isValidJsonArrayString(s) {
    try {
        const parsed = JSON.parse(s);
        return Array.isArray(parsed);
    } catch {
        return false;
    }
}

function safeParseJsonArray(s) {
    try {
        const parsed = JSON.parse(s);
        return Array.isArray(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

// function formatDate(dateValue) {
//     if (!dateValue)
//         return ""; // null, undefined → empty string
//     const date = new Date(dateValue);
//     if (isNaN(date.getTime()))
//         return ""; // invalid date → empty string
//     const day = String(date.getDate()).padStart(2, "0");
//     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
//         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//     const month = monthNames[date.getMonth()];
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
// }

function formatDate(input) {
    if (input == null) return "";
    // normalize to a string that (preferably) contains an ISO date "YYYY-MM-DD..."
    let s = input;
    // If an object with CreatedDate property, use that
    if (typeof s === "object" && !(s instanceof String)) {
        if (s instanceof Date) {
            // convert Date -> ISO string (only used if caller passed a Date object)
            s = s.toISOString();
        } else if (typeof s.CreatedDate === "string") {
            s = s.CreatedDate;
        } else {
            // fallback: try to stringify the object
            try { s = String(s); } catch (e) { return ""; }
        }
    }
    // ensure we have a string
    s = String(s);
    // Extract date part: prefer "YYYY-MM-DD" before 'T' if present
    const tIndex = s.indexOf("T");
    const datePart = tIndex !== -1 ? s.slice(0, tIndex) : s.split(" ")[0];
    const parts = datePart.split("-");
    if (parts.length !== 3) return "";
    const [year, month, day] = parts.map(p => p.trim());
    const monthNum = parseInt(month, 10);
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) return "";
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = monthNames[monthNum - 1];
    // Ensure day is two digits
    const dayStr = String(day).padStart(2, "0");
    return `${dayStr}-${monthName}-${year}`;
}


module.exports = {
    isBlank,
    trimOrEmpty,
    isValidInt,
    isValidJsonArrayString,
    safeParseJsonArray,
    formatDate
};
