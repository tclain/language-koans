import * as React from "react";
import { Logger } from "../utils/logger";

import { flatten } from "lodash";
import { highlightCode } from "../utils/display";

const AST_TYPES = {
  LINE: "LINE",
  FRAGMENT: "FRAGMENT",
  PLACEHOLDER: "PLACEHOLDER"
};

// Components
const CodeLine = ({ children }) => (
  <div className="code-line">Line: {children}</div>
);

interface ICodeFragmentProps {
  children: string;
  language: string;
}

const CodeFragment: React.SFC<ICodeFragmentProps> = ({
  children,
  language
}) => (
  <div
    dangerouslySetInnerHTML={{ __html: highlightCode(language, children) }}
    className="code-fragment"
  />
);

const CodePlaceholder = (props: any) => (
  <input className="code-placeholder" {...props} />
);

// Tokenize

const tokenizeLine = ({ line, placeholderPattern }) => {
  // no significant information in the code string
  const significantBits = line.replace(/\s/g, "");
  if (significantBits === "") {
    return [];
  }

  // We try to split by placeholder
  const splitByPlaceholder = line.split(placeholderPattern);
  if (splitByPlaceholder.length === 1) {
    return [{ type: AST_TYPES.FRAGMENT, content: line }];
  }
  const flattenSpec = flatten(
    splitByPlaceholder.map(fragment => {
      Logger.log("fragment", JSON.stringify(fragment));
      return [
        {
          type: AST_TYPES.FRAGMENT,
          content: fragment
        },
        { type: AST_TYPES.PLACEHOLDER }
      ];
    })
  );
  return flattenSpec;
};

/**
 * Simple code parser that generates an ast for the given koan
 * @param {*} param0
 */
const tokenize = ({ code, placeholderPattern }) =>
  code.split("\n").map(line => ({
    type: AST_TYPES.LINE,
    content: tokenizeLine({ line, placeholderPattern })
  }));

interface IKoanRendererProps {
  code: string;
  language: string;
  placeholderPattern: string;
  onPlaceholderChange: () => void;
}

export const KoanRenderer = ({
  code = "",
  language = "javascript",
  placeholderPattern = "#___",
  onPlaceholderChange
}) => {
  const ast = tokenize({ code, language, placeholderPattern });
  return (
    <div className="koan__renderer">
      {ast.map((line, index) => (
        <CodeLine key={index}>
          {line.content &&
            line.content.map(
              fragment =>
                fragment.type === AST_TYPES.FRAGMENT ? (
                  <CodeFragment language={language}>
                    {fragment.content}
                  </CodeFragment>
                ) : (
                  <CodePlaceholder
                    onChange={onPlaceholderChange(fragment.index)}
                  />
                )
            )}
        </CodeLine>
      ))}
    </div>
  );
};
