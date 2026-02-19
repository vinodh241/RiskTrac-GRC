import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CkEditorConfigService {
  ckeditorUrl = environment.ckeditorUrl;

  constructor() { }

  getCKEditorConfig(): any {
    return {
      title: false,
      //width:'30vw',                                      // fixed width
      height: '35vh',
      allowedContent: true,
      //language_list: ['ar:Arabic:rtl', 'en:English'],     // allowed languages
      forcePasteAsPlainText: false,
      toolbar: [{
        name: 'clipboard',
        items: ['Undo', 'Redo']
      }, {
        name: 'basicstyles',
        items: ['Bold', 'Italic', 'Underline', 'Strike']
      }, {
        name: 'paragraph',
        items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'BidiLtr', 'BidiRtl', 'NumberedList', 'BulletedList']
      }, {
        name: 'insert',
        items: ['Table']
      }, {
        name: 'styles',
        items: ['Format', 'Font', 'FontSize']
      }, {
        name: 'colors',
        items: ['TextColor', 'BGColor']
      }
      ],
      enterMode: 2,
      uiColor: '#CEDCE0',
      basicEntities: false,
      contentsLangDirection: 'ltr',
      extraPlugins: 'divarea, language, bidi, smiley, colordialog, justify,wordcount',
      removePlugins: 'link, Anchor, elementspath, save, magicline, easyimage, cloudservices, exportpdf',
      removeButtons: 'Anchor, Subscript, Superscript, Source',
      ckeditorUrl: this.ckeditorUrl,
      wordcount: {
        maxWordCount: -1,  // Set your desired max word count here
        showParagraphs: false,
        showWordCount: false,
        showCharCount: true,
        countSpacesAsChars: false,
        countHTML: false,
        maxCharCount: 1024  // Disable max char count
      }
    };
  }

  getReadOnlyCKEditorConfig(): any {
    return {
      title: false,
      height: '35vh',
      //width:'30vw',                                 // fixed width
      allowedContent: true,
      //language_list: ['ar:Arabic:rtl', 'en:English'], // allowed languages
      forcePasteAsPlainText: false,
      toolbar: [{
        name: 'clipboard',
        items: ['Undo', 'Redo']
      }, {
        name: 'basicstyles',
        items: ['Bold', 'Italic', 'Underline', 'Strike']
      }, {
        name: 'paragraph',
        items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'BidiLtr', 'BidiRtl', 'NumberedList', 'BulletedList']
      }, {
        name: 'insert',
        items: ['Table']
      }, {
        name: 'styles',
        items: ['Format', 'Font', 'FontSize']
      }, {
        name: 'colors',
        items: ['TextColor', 'BGColor']
      }
      ],
      enterMode: 2,
      uiColor: '#CEDCE0',
      basicEntities: false,
      contentsLangDirection: 'ltr',
      extraPlugins: 'divarea, language, bidi, smiley, colordialog, justify,wordcount',
      removePlugins: 'link, Anchor, elementspath, save, magicline, easyimage, cloudservices, exportpdf',
      removeButtons: 'Anchor, Subscript, Superscript, Source',
      ckeditorUrl: this.ckeditorUrl,
      wordcount: {
        maxWordCount: -1,  // Set your desired max word count here
        showParagraphs: false,
        showWordCount: false,
        showCharCount: true,
        countSpacesAsChars: false,
        countHTML: false,
        maxCharCount: 1024  // Disable max char count
      },
      readOnly: true
    };
  }

  // As of now the below method is not in use
  getCKEditorConfigReadOnly(): any {
    return {
      title: false,
      height: '35vh',
      // width:'30vw',              // fixed width
      allowedContent: true,
      forcePasteAsPlainText: false,
      toolbar: [
      ],
      enterMode: 2,
      uiColor: '#CEDCE0',
      basicEntities: false,
      contentsLangDirection: 'ltr',
      extraPlugins: 'divarea, language, bidi, smiley, colordialog, justify,wordcount',
      removePlugins: 'link, Anchor, elementspath, save, magicline, easyimage, cloudservices, exportpdf',
      removeButtons: 'Anchor, Subscript, Superscript, Source',
      ckeditorUrl: this.ckeditorUrl,
      wordcount: {
        maxWordCount: -1,  // Set your desired max word count here
        showParagraphs: false,
        showWordCount: false,
        showCharCount: true,
        countSpacesAsChars: false,
        countHTML: false,
        maxCharCount: 1024  // Disable max char count
      },
    };
  }
}
