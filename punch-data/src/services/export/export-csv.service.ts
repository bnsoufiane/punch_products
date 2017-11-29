import {Injectable} from 'angular2/core';

@Injectable()
export class ExportCSVService {
  /**
   *
   * @param filename {string} to name the file that will downloaded
   * @param rows array for elements to export as CSV
     */
  public exportToCsv(filename, rows) {
    let csvFile = '';
    for (let i = 0; i < rows.length; i++) {
      csvFile += this.processRow(rows[i]);
    }

    let blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      let link:any = document.createElement('a');
      if (link.download !== undefined) { // feature detection
        // Browsers that support HTML5 download attribute
        let url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('Your browser doesn\'t support HTML5 download attribute, try using Chrome!');
      }
    }
  }

  /**
   * processes each row from an array and returns it as a valid CSV row
   * @param row
   * @returns {string}
     */
  private processRow(row) {
    let finalVal = '';
    for (let j = 0; j < row.length; j++) {
      let innerValue = (row[j] === null || row[j] === undefined) ? '' : row[j].toString();
      if (row[j] instanceof Date) {
        innerValue = row[j].toLocaleString();
      }
      let result = innerValue.replace(/"/g, '""');
      if (result.search(/("|,|\n)/g) >= 0)
        result = '"' + result + '"';
      if (j > 0)
        finalVal += ',';
      finalVal += result;
    }
    return finalVal + '\n';
  }
}


