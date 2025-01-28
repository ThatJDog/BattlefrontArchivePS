class PDMLBody {
    constructor(name) {
        this.name = name.toLowerCase(); // Tag name (normalized to lowercase)
        this.attributes = {}; // Key-value pairs of attributes
        this.children = []; // List of child nodes
    }

    // Get the tag name
    getTagName() {
        return this.name;
    }

    // Check if the tag name matches a given string (case insensitive)
    tagIs(match) {
        return this.name === match.toLowerCase();
    }

    // Add an attribute (key-value pair)
    addAttribute(key, value) {
        this.attributes[key.toLowerCase()] = value;
    }

    // Get an attribute value
    getAttribute(key) {
        return this.attributes[key.toLowerCase()] || null;
    }

    // Get a double (number) attribute
    getDoubleAttribute(key) {
        const attribute = this.getAttribute(key);
        if (attribute instanceof PDMLNumber) {
            return attribute.value;
        }
        return 0.0;
    }

    // Get a boolean attribute
    getBoolAttribute(key) {
        const attribute = this.getAttribute(key);
        if (attribute instanceof PDMLBoolean) {
            return attribute.value;
        }
        return false;
    }

    // Get a hexadecimal color attribute (returns as string for simplicity)
    getHexAttribute(key) {
        const attribute = this.getAttribute(key);
        if (attribute instanceof PDMLHexColor) {
            return attribute.value; // Return the raw color string (e.g., "#ff0000")
        }
        return "#000000"; // Default to black
    }

    // Get a string attribute
    getStringAttribute(key) {
        const attribute = this.getAttribute(key);
        if (attribute instanceof PDMLString) {
            return attribute.value;
        }
        return null;
    }

    // Get a struct attribute
    getStructAttribute(key) {
        const attribute = this.getAttribute(key);
        if (attribute instanceof PDMLStruct) {
            return attribute;
        }
        return null;
    }

    // Get an array attribute
    getArrayAttribute(key) {
        const attribute = this.getAttribute(key);
        if (attribute instanceof PDMLArray) {
            return attribute;
        }
        return null;
    }

    // Check if an attribute is a double (number)
    hasDoubleAttribute(key) {
        const attribute = this.getAttribute(key);
        return attribute instanceof PDMLNumber;
    }

    // Check if an attribute is a boolean
    hasBoolAttribute(key) {
        const attribute = this.getAttribute(key);
        return attribute instanceof PDMLBoolean;
    }

    // Check if an attribute is a hex color
    hasHexAttribute(key) {
        const attribute = this.getAttribute(key);
        return attribute instanceof PDMLHexColor;
    }

    // Check if an attribute is a string
    hasStringAttribute(key) {
        const attribute = this.getAttribute(key);
        return attribute instanceof PDMLString;
    }

    // Check if an attribute is a struct
    hasStructAttribute(key) {
        const attribute = this.getAttribute(key);
        return attribute instanceof PDMLStruct;
    }

    // Check if an attribute is an array
    hasArrayAttribute(key) {
        const attribute = this.getAttribute(key);
        return attribute instanceof PDMLArray;
    }

    // Add a child node
    addChild(child) {
        this.children.push(child);
    }
}

class PDMLValue {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

class PDMLStruct {
    constructor() {
        this.fields = {};
    }

    addField(key, value) {
        this.fields[key] = value;
    }
}

class PDMLArray {
    constructor() {
        this.elements = [];
    }

    addElement(value) {
        this.elements.push(value);
    }
}

class PDMLNumber extends PDMLValue {
    constructor(value) {
        super("number", value);
    }
}

class PDMLString extends PDMLValue {
    constructor(value) {
        super("string", value);
    }
}

class PDMLHexColor extends PDMLValue {
    constructor(value) {
        super("hexColor", value);
    }
}

class PDMLBoolean extends PDMLValue {
    constructor(value) {
        super("boolean", value);
    }
}

class PDMLCompiler {
    compile(input) {
        const antlr4 = require('antlr4');
        const PDMLLexer = require('./PDMLLexer');
        const PDMLParser = require('./PDMLParser');

        const chars = new antlr4.InputStream(input);
        const lexer = new PDMLLexer.PDMLLexer(chars);
        const tokens = new antlr4.CommonTokenStream(lexer);
        const parser = new PDMLParser.PDMLParser(tokens);

        const tree = parser.grammarSpec(); // Start parsing from the grammarSpec rule
        const result = this.visitGrammarSpec(tree);

        return result;
    }

    visitGrammarSpec(ctx) {
        return this.visitBody(ctx.body());
    }

    visitBody(ctx) {
        if (ctx.tag() != null) {
            return this.visitTag(ctx.tag());
        } else if (ctx.self_closing_tag() != null) {
            return this.visitSelfClosingTag(ctx.self_closing_tag());
        }
        throw new Error("Invalid body structure.");
    }

    visitTag(ctx) {
        const tagName = ctx.open_tag().IDFR().getText();
        const body = new PDMLBody(tagName);

        // Parse attributes
        for (const valueCtx of ctx.open_tag().valueAssignment()) {
            const key = valueCtx.IDFR().getText();
            const value = this.visitValue(valueCtx.value());
            body.addAttribute(key, value);
        }

        // Parse children
        for (const childCtx of ctx.body()) {
            body.addChild(this.visitBody(childCtx));
        }

        return body;
    }

    visitSelfClosingTag(ctx) {
        const tagName = ctx.IDFR().getText();
        const body = new PDMLBody(tagName);

        // Parse attributes
        for (const valueCtx of ctx.valueAssignment()) {
            const key = valueCtx.IDFR().getText();
            const value = this.visitValue(valueCtx.value());
            body.addAttribute(key, value);
        }

        return body;
    }

    visitValue(ctx) {
        if (ctx instanceof PDMLParser.BoolLitContext) {
            return new PDMLBoolean(ctx.getText() === "true");
        } else if (ctx instanceof PDMLParser.NumLitContext) {
            return new PDMLNumber(parseFloat(ctx.getText()));
        } else if (ctx instanceof PDMLParser.StringLitContext) {
            const rawText = ctx.getText();
            return new PDMLString(rawText.substring(1, rawText.length - 1)); // Remove quotes
        } else if (ctx instanceof PDMLParser.HexColourContext) {
            return new PDMLHexColor(ctx.getText());
        } else if (ctx instanceof PDMLParser.StructContext) {
            const struct = new PDMLStruct();
            for (const valueCtx of ctx.valueAssignment()) {
                const key = valueCtx.IDFR().getText();
                const value = this.visitValue(valueCtx.value());
                struct.addField(key, value);
            }
            return struct;
        } else if (ctx instanceof PDMLParser.ArrayContext) {
            const array = new PDMLArray();
            for (const elementCtx of ctx.value()) {
                array.addElement(this.visitValue(elementCtx));
            }
            return array;
        }
        throw new Error("Unknown value type.");
    }

    visit(tree) {
        return tree.accept(this);
    }

    visitChildren(node) {
        const results = [];
        for (let i = 0; i < node.getChildCount(); i++) {
            const child = node.getChild(i);
            const result = child.accept(this);
            if (result !== null) results.push(result);
        }
        return results;
    }

    visitTerminal(terminalNode) {
        return terminalNode.getText();
    }

    visitErrorNode(errorNode) {
        throw new Error("Parsing error: " + errorNode.getText());
    }
}

module.exports = PDMLCompiler;