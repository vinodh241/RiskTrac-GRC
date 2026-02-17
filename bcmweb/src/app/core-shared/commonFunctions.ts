export function fileNamePattern(fileName: string) {
    const match = /[\^`\;@\&\+\$\%\!\#\{}]/;

    if (match.test(fileName)) {
      return true;
    }
    return false;
  }
