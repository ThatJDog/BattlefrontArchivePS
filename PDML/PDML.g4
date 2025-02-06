grammar PDML;

// Entry point
grammarSpec: body EOF;

// Body can contain either a tag or a self-closing tag
body: tag | self_closing_tag;

// Tag structure with matching start and end tag names
tag: open_tag WS* body* WS* close_tag WS*;

// Lexer rules for tags
open_tag: '<' IDFR WS* (valueAssignment WS*)* '>';
close_tag: '</' IDFR WS* '>';
self_closing_tag: '<' IDFR WS* (valueAssignment WS*)* '/>' WS*;

// Value assignments inside tags
valueAssignment: IDFR WS* ASSIGN WS* value WS*;

// Value options
value
    : BOOL_LITERAL                                          # boolLit
    | NUMBER                                                # numLit
    | STRING_LITERAL                                        # stringLit
    | HEX_COLOR                                             # hexColour
    | '{' WS* (valueAssignment (WS* valueAssignment)*)? WS* '}' # struct
    | '[' WS* (value (WS* value)*)? WS* ']'            # array
    ;

// String literal
STRING_LITERAL: '"' ( ~["\\] | '\\' . )* '"';

// Hex color
HEX_COLOR: '#' ([0-9a-fA-F][0-9a-fA-F][0-9a-fA-F] |
                [0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F] |
                [0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]);

// Boolean literal
BOOL_LITERAL: 'true' | 'false';

// Assignment operator
ASSIGN: '=';

// Comments
COMMENT: SINGLE_COMMENT | MULTI_COMMENT;
SINGLE_COMMENT: '//' ~[\r\n]* -> skip;
MULTI_COMMENT: '/*' .*? '*/' -> skip;

// Identifier
IDFR: [a-zA-Z_][a-zA-Z0-9_-]*;

// Numeric values
NUMBER: [-+]? [0-9]+ ('.' [0-9]+)?;

// Whitespace
WS: [ \t\r\n]+;