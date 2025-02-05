// Use Antlr4 for parsing
import antlr4 from 'antlr4';
import PDMLLexer from './PDMLLexer.js';
import PDMLParser from './PDMLParser.js';

// PDMLBody Class
export class PDMLBody {
    constructor(name) {
        this.name = name.toLowerCase(); // Tag name (normalized to lowercase)
        this.attributes = {}; // Key-value pairs of attributes
        this.children = []; // List of child nodes
    }

    getTagName() {
        return this.name;
    }

    tagIs(match) {
        return this.name === match.toLowerCase();
    }

    addAttribute(key, value) {
        this.attributes[key.toLowerCase()] = value;
    }

    getAttribute(key) {
        return this.attributes[key.toLowerCase()] ? this.attributes[key.toLowerCase()].value : null;
    }

    getOrDefaultAttribute(key, defaultValue) {
        return this.attributes[key.toLowerCase()] ? this.attributes[key.toLowerCase()].value : defaultValue;
    }

    getDoubleAttribute(key) {
        const attribute = this.getAttribute(key);
        return attribute instanceof PDMLNumber ? attribute.value : 0.0;
    }

    getBoolAttribute(key) {
        const attribute = this.getAttribute(key);
        return attribute instanceof PDMLBoolean ? attribute.value : false;
    }

    getHexAttribute(key) {
        const attribute = this.getAttribute(key);
        return attribute instanceof PDMLHexColor ? attribute.value : "#000000";
    }

    getStringAttribute(key) {
        const attribute = this.getAttribute(key);
        return attribute instanceof PDMLString ? attribute.value : null;
    }

    getStructAttribute(key) {
        const attribute = this.getAttribute(key);
        return attribute instanceof PDMLStruct ? attribute.value : null;
    }

    getArrayAttribute(key) {
        const attribute = this.getAttribute(key);
        return attribute instanceof PDMLArray ? attribute.value : null;
    }

    hasAttribute(key) {
        return this.getAttribute(key) != null;
    }

    hasDoubleAttribute(key) {
        return this.getAttribute(key) instanceof PDMLNumber;
    }

    hasBoolAttribute(key) {
        return this.getAttribute(key) instanceof PDMLBoolean;
    }

    hasHexAttribute(key) {
        return this.getAttribute(key) instanceof PDMLHexColor;
    }

    hasStringAttribute(key) {
        return this.getAttribute(key) instanceof PDMLString;
    }

    hasStructAttribute(key) {
        return this.getAttribute(key) instanceof PDMLStruct;
    }

    hasArrayAttribute(key) {
        return this.getAttribute(key) instanceof PDMLArray;
    }

    addChild(child) {
        this.children.push(child);
    }
}

// Value Types
export class PDMLValue {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

export class PDMLStruct {
    constructor() {
        this.value = {};
    }

    addField(key, value) {
        this.value[key] = value;
    }
}

export class PDMLArray {
    constructor() {
        this.value = [];
    }

    addElement(value) {
        this.value.push(value);
    }
}

export class PDMLNumber extends PDMLValue {
    constructor(value) {
        super("number", value);
    }
}

export class PDMLString extends PDMLValue {
    constructor(value) {
        super("string", value);
    }
}

export class PDMLHexColor extends PDMLValue {
    constructor(value) {
        super("hexColor", value);
    }
}

export class PDMLBoolean extends PDMLValue {
    constructor(value) {
        super("boolean", value);
    }
}

// PDMLCompiler Class
export class PDMLCompiler {
    compile(input) {
        const chars = new antlr4.InputStream(input);
        const lexer = new PDMLLexer(chars);
        const tokens = new antlr4.CommonTokenStream(lexer);
        const parser = new PDMLParser(tokens);

        const tree = parser.grammarSpec(); // Start parsing from the grammarSpec rule
        return this.visitGrammarSpec(tree);
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

        for (const valueCtx of ctx.open_tag().valueAssignment()) {
            const key = valueCtx.IDFR().getText();
            const value = this.visitValue(valueCtx.value());
            body.addAttribute(key, value);
        }

        for (const childCtx of ctx.body()) {
            body.addChild(this.visitBody(childCtx));
        }

        return body;
    }

    visitSelfClosingTag(ctx) {
        const tagName = ctx.IDFR().getText();
        const body = new PDMLBody(tagName);

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
            return new PDMLString(rawText.substring(1, rawText.length - 1));
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
