import {formatDate} from '@angular/common';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import * as moment from 'moment';

export function removeEmptyQuery(query: object) {

  Object.keys(query).forEach(key => {
    if (
      query[key] === '' ||
      query[key] === undefined ||
      query[key] === null ||
      query[key] === 'undefined' ||
      query[key] === 'null'
    ) delete query[key];
  });

  return query;
}

export function calculateFistLastPageTable(rowData, total, pageSize, currentPage): {first: number, last: number, pages: number} {
  let first, last, pages;

  if (!rowData && rowData.length === 0) {
    first = 0;
    last = 0;
  } else {
    pages = Array(Math.ceil(total / pageSize)).fill(0).map((value, index) => index + 1);
    first = pageSize * (currentPage - 1) + 1;
    last = rowData.length + (pageSize * (currentPage - 1));
  }

  return {first, last, pages};
}

export function removeAccents(str: string) {
  str = str.trim();
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ|Ì|Í|Ị|Ỉ|Ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ|Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'y');
  str = str.replace(/đ|Đ/g, 'd');
  // str = str.replace(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, "");
  // str = str.replace(/-/g, " ");
  str = str.replace(/\s+/g, '');
  return str
}

export function convertDateToString(time: any) {
  if (!time) return '';
  time = new Date(time);
  const year = time.getFullYear();
  let date = time.getDate();
  let month = time.getMonth() + 1;
  // var hours = time.getHours();
  // var minutes = time.getMinutes();
  // var seconds = time.getSeconds();
  if (date < 10) {
    date = '0' + date;
  }
  if (month < 10) {
    month = '0' + month;
  }
  // if (hours < 10) {
  //   hours = "0" + hours;
  // }
  // if (minutes < 10) {
  //   minutes = "0" + minutes;
  // }
  // if (seconds < 10) {
  //   seconds = "0" + seconds;
  // }
  // return `${date}\/${month}\/${year} ${hours}:${minutes}:${seconds}`;
  return `${date}\/${month}\/${year}`;
}

export function pagination(currentPage, totalPage) {
  let delta = 2,
    left = currentPage - delta,
    right = currentPage + delta + 1,
    range = [],
    rangeWithDots = [],
    l;

  for (let i = 1; i <= totalPage; i++) {
    if (i == 1 || i == totalPage || (i >= left && i < right)) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
}

export function next(currentPage, totalPage) {
  currentPage++;

  if (currentPage > totalPage) {
    currentPage = totalPage;
    return;
  }

  return currentPage;
}

export function prev(currentPage) {
  currentPage--;

  if (currentPage < 1) {
    currentPage = 1;
    return;
  }

  return currentPage;
}

export function exportName(title: string) {
  title = title + moment().format('DDMMYYYY').toString();
  return title;
}

export function download(data, title: string) {
  const file = new Blob([data], {type: 'application/vnd.ms-excel'});
  const fileURL = URL.createObjectURL(file);
  const anchor = document.createElement('a');
  anchor.download = title;
  anchor.href = fileURL;
  anchor.click();
}

export function getField(object, field) {
  if (object && object.hasOwnProperty(field)) {
    return object[field];
  }

  return object;
}

export function convertToDate2(date: string) {
  if (!date) return null
  const dd = new Date(date)
  return {
    year: dd.getFullYear(),
    month: dd.getMonth() + 1,
    day: dd.getDate()
  }
}

export function parseDate2(date2: { day, month, year }, format: string = 'yyyy/MM/dd'): string {
  if (!date2) return null
  const {day, month, year} = date2
  return formatDate(`${year}/${month}/${day}`, format, 'en_US')
}

export function parseDate3(date2: { day, month, year }, format: string = 'dd/MM/yyyy'): string {
  if (!date2) return null;
  const { day, month, year } = date2;
  const parsedDate = new Date(year, month - 1, day);
  return formatDate(parsedDate, format, 'en_US');
}

export function changeWidthAgCenterColsContainerStyle() {
  const removeStyle = document.getElementsByClassName('ag-center-cols-container') as HTMLCollectionOf<HTMLElement>;
  if (removeStyle.length > 1) {
    const currentValue = removeStyle[1].style.getPropertyValue('width');
    const newCurrentValueFloat = currentValue.slice(0, -2);
    const newCurrentValueInt = Math.round(parseFloat(newCurrentValueFloat));
    const newValue = newCurrentValueInt + 20;
    removeStyle[1].style.width = `${newValue}px`;
  } else {
    const currentValue = removeStyle[0].style.getPropertyValue('width');
    const newCurrentValueFloat = currentValue.slice(0, -2);
    const newCurrentValueInt = Math.round(parseFloat(newCurrentValueFloat));
    const newValue = newCurrentValueInt + 20;
    removeStyle[0].style.width = `${newValue}px`;
  }
}

export function changeWidthAgCenterColsContainerStyleHasMinWidth(minWidth: any, addPx: any) {
  const removeStyle = document.getElementsByClassName('ag-center-cols-container') as HTMLCollectionOf<HTMLElement>;
  if (removeStyle.length > 1) {
    const currentValue = removeStyle[1].style.getPropertyValue('width');
    const newCurrentValueFloat = currentValue.slice(0, -2);
    const newCurrentValueInt = Math.round(parseFloat(newCurrentValueFloat));

    if (newCurrentValueInt <= minWidth) {
      const newValue = newCurrentValueInt + addPx;
      if (newValue <= minWidth) {
        removeStyle[1].style.width = `${newValue}px`;
      }
      return;
    } else {
      const newValue = newCurrentValueInt + 20;
      removeStyle[1].style.width = `${newValue}px`;
    }
  } else {
    const currentValue = removeStyle[0].style.getPropertyValue('width');
    const newCurrentValueFloat = currentValue.slice(0, -2);
    const newCurrentValueInt = Math.round(parseFloat(newCurrentValueFloat));

    if (newCurrentValueInt <= minWidth) {
      const newValue = newCurrentValueInt + addPx;
      if (newValue <= minWidth) {
        removeStyle[0].style.width = `${newValue}px`;
      }
      return;
    } else {
      const newValue = newCurrentValueInt + 20;
      removeStyle[0].style.width = `${newValue}px`;
    }


  }
}

export function changeWidthAgCenterColsContainerStyleHasMinWidth1(minWidth: any, addPx: any, addPxOther?: number, selector?: any) {
  const removeStyle = document.querySelector('.popupCreateLoanPayment .ag-center-cols-container') as HTMLElement;

  console.log('removeStyle', removeStyle);
  if (removeStyle) {
    const currentValue = removeStyle.style.getPropertyValue('width');
    const newCurrentValueFloat = currentValue.slice(0, -2);
    const newCurrentValueInt = Math.round(parseFloat(newCurrentValueFloat));

    console.log('newCurrentValueInt', newCurrentValueInt);
    if (newCurrentValueInt <= minWidth) {
      const newValue = newCurrentValueInt + addPx;
      if (newValue <= minWidth) {
        removeStyle.style.width = `${newValue}px`;
      }
      return;
    } else {
      let newValue = newCurrentValueInt + 20;
      if(addPxOther){
        newValue = newCurrentValueInt + addPxOther;
      }
      removeStyle.style.width = `${newValue}px`;
    }
  }

}


export function removeRightSpacer() {
  const element: any = document.getElementsByClassName('ag-horizontal-right-spacer');
  element[0].remove();
}

export function getWidthOfElement(elementName) {
  const elements: any = document.getElementsByClassName(`${elementName}`);
  const currentValue = elements[1].style.getPropertyValue('width');
  return currentValue.slice(0, -2);
}

export function convertDateToStringDate(time: any) {
  if (!time) return '';
  time = new Date(time);
  const year = time.getFullYear();
  let date = time.getDate();
  let month = time.getMonth() + 1;

  if (date < 10) {
    date = '0' + date;
  }
  if (month < 10) {
    month = '0' + month;
  }
  return `${year}-${month}-${date}`;
}

export function convertDateTimeToStringExactly(time: any) {
  if (!time) return '';
  time = new Date(time);
  const year = time.getFullYear();
  let date = time.getDate();
  let month = time.getMonth() + 1;

  let hours = time.getHours();
  let minutes = time.getMinutes();
  let seconds = time.getSeconds();

  if (date < 10) {
    date = '0' + date;
  }
  if (month < 10) {
    month = '0' + month;
  }
  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  return `${date}\/${month}\/${year} ${hours}:${minutes}:${seconds}`;
}

export function prepareSubmit(f: FormGroup | FormArray) {

  for (const i in f.controls) {
    if (typeof f.controls[i].value === 'string') {
      if (Boolean(f.controls[i].value)) {
        f.controls[i].setValue(f.controls[i].value.trim());
      }
    }

    if (f.controls[i] instanceof FormControl) {
      f.controls[i].markAsDirty();
      f.controls[i].updateValueAndValidity();
    } else {
      prepareSubmit(f.controls[i] as any);
    }
  }
}

export function stringYYMMDDHHMMToDate(str: string) {
  // yyyy/MM/dd HH:mm
  if (!str) return null
  const dateParts = str.split('/');
  const timeParts = dateParts[2].split(' ')[1].split(':');
  dateParts[2] = dateParts[2].split(' ')[0];
  return new Date(
    Number(dateParts[0]),
    Number(dateParts[1]) - 1,
    Number(dateParts[2]),
    Number(timeParts[0]),
    Number(timeParts[1])
  );
}

// export function connectSocket(role: string[], login: string, stompService: StompService, destroy$: DestroyService) {



export function getNameUserAvatar(fullName: string): string {
  if (!fullName) {
    return ''
  }

  let nameABC = '';
  const names = fullName.trim().split(' ');
  nameABC = names[0].substring(0, 1).toUpperCase();
  if (names.length > 1) {
    nameABC += names[names.length - 1].substring(0, 1);
  } else if (names.length === 1) {
    nameABC = names[0].substring(0, 2).toUpperCase();
  }

  return nameABC;
}

export function convertObjectDate(value: any): Object {
  if (!(value instanceof Object) && value !== null) {
    const obj = value.split('/');
    return {
      day: parseInt(obj[0]),
      month: parseInt(obj[1]),
      year: parseInt(obj[2])
    };
  }
  return value;
}

export function datePickerToDate(datePicker) {
  datePicker = convertObjectDate(datePicker);
  return new Date(`${('0' + datePicker.month).slice(-2)}-${('0' + datePicker.day).slice(-2)}-${datePicker.year}`);
}
