// can add Index and isEdit property to the object of array
export function addIndex(docs?: any, addEditMode?: any) {
  let Index = 1;
  (docs || []).forEach((data: any) => {
    data.Index = Index;
    if (addEditMode) {
      data.isEdit = false;
    }
    Index++;
  });
  return docs;
}

// search functionality for Mat-Table
export function searchBy(searchInput?: any, searchFields?: any, tableData?: any, filterColumn?: any, filterColumnIds?: any, headerFilterColumns?: any, enteredColumnText?: any) {
  let cloneData = JSON.parse(JSON.stringify((tableData || [])));

  if (searchInput?.length > 0) {
    cloneData = cloneData.filter((item: any) => {
      return searchFields.some((field: any) => {
        return ((typeof item[field] == 'number') ? String(item[field]) : item[field] || '').toLowerCase().trim().includes(searchInput.toLowerCase().trim());
      });
    });
  };

  if (filterColumnIds?.length > 0) {
    cloneData = cloneData.filter((row: any) => {
      return filterColumn.some((col: any) => {
        return filterColumnIds.includes(row[col]);
      });
    });
  };

  if (headerFilterColumns && headerFilterColumns?.length > 0) {
    headerFilterColumns.forEach((x: any) => {
      if (enteredColumnText[x] !== '') {
        cloneData = cloneData.filter((row: any) => {
          return ((typeof row[x] == 'number') ? String(row[x]) : row[x] || '').toLowerCase().trim().includes(enteredColumnText[x].toLowerCase().trim());
        });
      };
    });
  };

  return cloneData;
}

// sort method for Mat-Table
export function sortBy(sort?: any, tableData?: any) {
  const data = (tableData || []).slice();

  if (!sort.active || sort.direction === '') {
    return JSON.parse(JSON.stringify(data));
  } else {
    return data.sort((a: any, b: any) => {
      const aValue = (a as any)[sort.active];
      const bValue = (b as any)[sort.active];
      return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
    });
  }
}

// 2020-09-18T23:03:57.000Z to 18-09-2020 03:57
export function dateToString(dateo: String, includeDate = true, includeTime = false, includeAMPM = false, seperator: any = '-') {
  if (dateo) {
    const ary = dateo.split('T');
    const aryd = ary[0].split('-');
    const aryt = ary[1].split('.')[0].split(':');
    let date = "";
    if (includeDate)
      date = aryd[2] + seperator + aryd[1] + seperator + aryd[0];
    if (includeTime) {
      if (date != "")
        date += " ";
      if (includeAMPM) {
        date += String(Number(aryt[0]) > 12 ? Number(aryt[0]) - 12 : Number(aryt[0])) + ':' + aryt[1] + ':' + aryt[2] + (Number(aryt[0]) > 12 ? ' pm' : ' am');
      } else {
        date += aryt[0] + ':' + aryt[1] + ':' + aryt[2];
      }
    }
    return date;
  } else {
    return null;
  }
}

export function dateToYMd(date: string) {
  const inputDate = new Date(date);
  return inputDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' });
}

export function formatTimeType(isoTimestamp: any) {
  let splitedTime = isoTimestamp.split('T')[1].split(':');

  let hours = splitedTime[0].toString().padStart(2, '0');
  const minutes = splitedTime[1].toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}

// Date = 2023-08-21T00:00:00.000Z Time = 23:10 returns 2023-08-21T11:10:00.000Z
export function attachDateTime(Date: string, Time: any) {
  if (Date && Time) {
    let splitedTime = Time.split(':');
    return Date.split('T')[0] + 'T' + ((String(Number(splitedTime[0]) > 12) ? padWithLeadingZeros(Number(splitedTime[0]) - 12, 2) : splitedTime[0])) + ':' + splitedTime[1] + ':00.000Z'
  }
  return null
}

function padWithLeadingZeros(num: number, totalLength?: number) {
  return String(num).padStart(totalLength || 2, '0');
}

// to filter the fileMimeTypes based on fileExtensions
export function filterMimeTypes(fileExtensions: any, MimeTypes: any) {
  let filteredMimeTypes = [];
  filteredMimeTypes = fileExtensions.reduce((acc: any, ext: any) => {
    const mimeType = MimeTypes[0][ext];
    if (mimeType) {
      // Check if mimeType is an array (for cases like 'jpg')
      if (Array.isArray(mimeType)) {
        acc.push(...mimeType);
      } else {
        acc.push(mimeType);
      }
    }
    return acc;
  }, []);
  return filteredMimeTypes;
}

// to convert HTML tags when used in ckeditor

export function stripHtml(html: string) {
  var div = document.createElement("DIV");

  div.innerHTML = html;

  let cleanText = div.innerText;

  //div = null; // prevent mem leaks

  return cleanText;
}

//to remove +5:30 and format the date like - "2023-08-21T00:00:00.000Z"
export function formatTimeZone(dateval: any) {
  let date = null;
  if (dateval instanceof Date) {
    const d = dateval.getDate();
    let dd = '';
    if (d < 10) {
      dd = '0' + d;
    } else {
      dd = '' + d;
    }
    let m = dateval.getMonth() + 1;
    let mm = '';
    if (m < 10) {
      mm = '0' + m;
    } else {
      mm = '' + m;
    }
    const y = dateval.getFullYear();
    const Timeval = "00:00:00.000Z"
    let val = y + '-' + mm + '-' + dd;
    date = val
  } else if (typeof dateval === 'string' || dateval instanceof String) {
    const dateval2 = dateval.split('T')[0];
    const Timeval = "00:00:00.000Z"
    date = dateval2;
  } else {
    return null;
  }
  return date;
}

// 2024-05-09T15:40:00.000Z to 9 May, 2024 - 03:40 PM
export function formatedDate1(date: any) {
  if (!!date) {
    let date1 = new Date(date);
    let dateFormat = date1.getUTCDate() + ' ' + date1.toLocaleString('default', { month: 'long' }) + ', ' + date1.getUTCFullYear() + ' - ';
    let time = convertTime(((date || '').split('T')[1]).split('.')[0]);
    return dateFormat + time;
  } else {
    let date1 = new Date(date);
    let dateFormat = date1.getUTCDate() + ' ' + date1.toLocaleString('default', { month: 'long' }) + ', ' + date1.getUTCFullYear() + ' - ';
    return dateFormat;
  }
}

// Convert 24-hours format to 12-hours
export function convertTime(timeString: any) {
  const [hours, minutes] = timeString.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = (hours % 12) || 12;
  return `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// To show 3 dots if length of the text is more
export function extentedTitle(title: string, range: number) {
  return (title?.length > range ? ((title).substring(0, range) + '...') : title);
}

// File name pattern restrictions
export function fileNamePattern(fileName: string) {
  const match = /[\^`\;@\&\+\$\%\!\#\{}\~]/;

  if (match.test(fileName)) {
    return true;
  }
  return false;
}
