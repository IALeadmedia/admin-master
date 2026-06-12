import DOMPurify from "dompurify";

export class MessageFormatter {
  static transformText(text: string) {
    let formattedText = this.breakLine(text);
    formattedText = this.applyBold(formattedText);
    formattedText = this.applyItalic(formattedText);
    formattedText = this.applyStrikethrough(formattedText);
    return DOMPurify.sanitize(formattedText);
  }

  static breakLine(text: string) {
    return text.replace(/\n/g, "<br />");
  }

  static applyBold(text: string) {
    return text.replace(/\*(.*?)\*/g, "<strong>$1</strong>");
  }

  static applyItalic(text: string) {
    return text.replace(/_(.*?)_/g, "<em>$1</em>");
  }

  static applyStrikethrough(text: string) {
    return text.replace(/~(.*?)~/g, "<s>$1</s>");
  }
}
