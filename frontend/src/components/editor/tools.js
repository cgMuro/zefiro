import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import List from "@editorjs/list";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
// import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import CheckList from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import SimpleImage from "@editorjs/simple-image";

export const EDITOR_JS_TOOLS = {
  embed: Embed,
  table: Table,
  marker: Marker,
  list: List,
  code: Code,
  linkTool: LinkTool,
  // image: Image,
  header: {
    class: Header,
    config: {
      placeholder: 'Write your title here'
    }
  },
  quote: Quote,
  checklist: CheckList,
  delimiter: Delimiter,
  image: SimpleImage
};