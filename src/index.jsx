import ForgeUI, { ContentAction, ModalDialog, Button,Macro, render, Text, useAction, useProductContext, Image, useState, Fragment } from "@forge/ui";

import api,{ route }  from "@forge/api";

const get_content = async (contentId) => {
  const response = await api.asUser().requestConfluence(route`/wiki/rest/api/content/${contentId}?expand=body.atlas_doc_format`);

  if (!response.ok) {
      const err = `Error while get_content with contentId ${contentId}: ${response.status} ${response.statusText}`;
      console.error(err);
      throw new Error(err);
  }
  return await response.json();
};

function count_words(str) {
  var str1=str.toString();
  str1 = str1.replace(/(?!\W)\S+/g,"1").replace(/\s*/g,"");
  return str1.lastIndexOf("");
  }

function count_chars(str) {
    var str1=str.toString();
    var chars = str1.length;
    return chars;
    }
function count_exSpacechars(str) {
      var str1=str.toString();
      var temp=str1.match(/ /g).length;
      var chars = str1.length;
      return chars-temp;
      }
function get_values(obj, key) {
  var objects = [];
  for (var i in obj) {
      if (!obj.hasOwnProperty(i)) continue;
      if (typeof obj[i] == 'object') {
          objects = objects.concat(get_values(obj[i], key));
      } else if (i == key) {
          objects.push(obj[i]);
      }
  }
  return objects;
}

const countWords = (data) => {
  if (!data || !data.body || !data.body.atlas_doc_format || !data.body.atlas_doc_format.value) {
      return 5;
  }
  var jsoned = JSON.parse(data.body.atlas_doc_format.value);
  var values = get_values(jsoned, 'text');
  return count_words(values);
};

const countChars = (data) => {
  if (!data || !data.body || !data.body.atlas_doc_format || !data.body.atlas_doc_format.value) {
      return 5;
  }
  var jsoned = JSON.parse(data.body.atlas_doc_format.value);
  var values = get_values(jsoned, 'text');
  return count_chars(values);
};

const countexSpaceChars = (data) => {
  if (!data || !data.body || !data.body.atlas_doc_format || !data.body.atlas_doc_format.value) {
      return 5;
  }
  var jsoned = JSON.parse(data.body.atlas_doc_format.value);
  var values = get_values(jsoned, 'text');
  return count_exSpacechars(values);
};

const App = () => {
  const [isOpen, setOpen] = useState(true);
  if (!isOpen) {
      return null;
  }

  const { contentId } = useProductContext();
  const [data] = useAction(
      () => null,
      async () => await get_content(contentId)
  );
  const wordCount = countWords(data);
  const charCount= countChars(data);
  const charexSpaceCount= countexSpaceChars(data);
  return (
      <ModalDialog header="Confluence Word Counter" onClose={() => setOpen(false)}>
        <Text>{`Number of words in the Confluence Page: ${wordCount}`}</Text>
        <Text>{`Number of characters in the Confluence Page: ${charCount}`}</Text>
        <Text>{`Number of characters (excluding spaces) in the Confluence Page: ${charexSpaceCount}`}</Text>
      </ModalDialog>
  );
};

export const run = render(
  <ContentAction>
  <App/>
  </ContentAction>
);
